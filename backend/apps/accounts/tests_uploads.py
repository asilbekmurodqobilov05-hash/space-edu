"""Upload hardening — regression tests for the 2026-08-22 audit.

Findings: PATCH /auth/me/ accepted an avatar with no size limit (Django's
DATA_UPLOAD_MAX_MEMORY_SIZE does not apply to files), the caller chose the
stored filename and extension, and Pillow's verify() happily passes a
PNG-headed polyglot — which S3Boto3Storage then served as text/html from a
public bucket.
"""
import io

from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

from .models import User


def png_bytes(width=8, height=8):
    buf = io.BytesIO()
    Image.new('RGB', (width, height), (10, 20, 40)).save(buf, format='PNG')
    return buf.getvalue()


def upload(name, content, content_type='image/png'):
    return SimpleUploadedFile(name, content, content_type=content_type)


@override_settings(MEDIA_ROOT='/tmp/uzcosmos-test-media')
class AvatarUploadTests(TestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username='pilot', email='p@e.com', password='Str0ngPassw0rd!x'
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def tearDown(self):
        cache.clear()

    def _patch(self, avatar):
        return self.client.patch('/api/v1/auth/me/', {'avatar': avatar}, format='multipart')

    def test_a_normal_png_is_accepted(self):
        r = self._patch(upload('me.png', png_bytes()))
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_a_dangerous_extension_can_never_be_stored(self):
        """`avatar.html` used to be stored under that exact name, and the storage
        backend derives Content-Type from the name — so a PNG-headed polyglot
        became text/html on a public bucket. Rejecting it and renaming it are
        both acceptable; storing it as .html is not."""
        r = self._patch(upload('avatar.html', png_bytes()))
        self.user.refresh_from_db()
        if r.status_code == status.HTTP_200_OK:
            self.assertFalse(self.user.avatar.name.endswith('.html'), self.user.avatar.name)
        else:
            self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertFalse(self.user.avatar)

    def test_stored_filename_is_not_the_one_the_caller_chose(self):
        """Even for an acceptable extension, the caller must not pick the path:
        it decides the served name and can collide with another user's file."""
        r = self._patch(upload('my-photo.png', png_bytes()))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertNotIn('my-photo', self.user.avatar.name)
        self.assertTrue(self.user.avatar.name.startswith('avatars/'), self.user.avatar.name)

    def test_oversized_upload_is_rejected(self):
        big = png_bytes() + b'\0' * (3 * 1024 * 1024)
        r = self._patch(upload('big.png', big))
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_image_payload_is_rejected(self):
        r = self._patch(upload('script.png', b'<script>alert(1)</script>'))
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_svg_is_rejected(self):
        """SVG is a script container; it must never be an avatar."""
        svg = b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
        r = self._patch(upload('x.svg', svg, content_type='image/svg+xml'))
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_absurd_dimensions_are_rejected(self):
        """A decompression bomb is small on disk and enormous in memory."""
        r = self._patch(upload('bomb.png', png_bytes(9000, 9000)))
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_path_traversal_in_the_name_cannot_escape(self):
        self._patch(upload('../../etc/passwd.png', png_bytes()))
        self.user.refresh_from_db()
        self.assertNotIn('..', self.user.avatar.name)
