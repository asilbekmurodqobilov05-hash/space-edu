"""Shared upload validation.

Django's `ImageField` calls `Pillow.verify()`, which only checks that the file
*starts* like an image. It does not bound the size, does not bound the pixel
count, and does not rename the file — so before this module:

* a 5 GB avatar was spooled to Railway's ephemeral disk and re-uploaded to R2;
* `avatar.html` was stored under that exact name, and `S3Boto3Storage` derives
  Content-Type from the name, so a PNG-headed polyglot became `text/html` served
  from a public bucket;
* a 40000x40000 PNG (a few hundred KB on disk) expanded to gigabytes in memory.

Use `validate_image_upload` on every serializer field that accepts an image, and
`image_upload_to` as the model field's `upload_to`.
"""
import uuid

from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

MAX_UPLOAD_BYTES = 2 * 1024 * 1024      # 2 MB
MAX_PIXELS = 24_000_000                 # ~6000x4000
MAX_SIDE = 8000

# Pillow format name -> the extension we will store it under. The caller's own
# extension is discarded; only these formats are accepted.
ALLOWED_FORMATS = {
    'JPEG': '.jpg',
    'PNG': '.png',
    'WEBP': '.webp',
    'GIF': '.gif',
}


def validate_image_upload(uploaded):
    """Return the canonical extension, or raise ValidationError.

    Call this from a serializer's `validate_<field>` so the caller gets a 400
    with a usable message rather than a 500 or a silently stored payload.
    """
    if uploaded is None:
        return None

    size = getattr(uploaded, 'size', None)
    if size is not None and size > MAX_UPLOAD_BYTES:
        raise ValidationError(
            f'Image must be under {MAX_UPLOAD_BYTES // (1024 * 1024)} MB. '
            f'Yours is {size / (1024 * 1024):.1f} MB.'
        )

    from PIL import Image

    try:
        uploaded.seek(0)
        with Image.open(uploaded) as probe:
            image_format = (probe.format or '').upper()
            width, height = probe.size
            probe.verify()
    except ValidationError:
        raise
    except Exception:
        # Covers a non-image payload, a truncated file, and an SVG (Pillow has
        # no SVG decoder, so it raises here rather than accepting markup).
        raise ValidationError('That file is not a readable image.')
    finally:
        try:
            uploaded.seek(0)
        except Exception:
            pass

    if image_format not in ALLOWED_FORMATS:
        raise ValidationError(
            f'Unsupported image format. Use {", ".join(sorted(ALLOWED_FORMATS))}.'
        )
    if width > MAX_SIDE or height > MAX_SIDE or width * height > MAX_PIXELS:
        raise ValidationError(
            f'Image is too large ({width}x{height}). Maximum side is {MAX_SIDE} px.'
        )

    return ALLOWED_FORMATS[image_format]


@deconstructible
class image_upload_to:
    """`upload_to` that discards the caller's filename entirely.

    The stored name is a UUID plus the extension implied by the *detected*
    format, so a caller cannot choose the served Content-Type, cannot collide
    with someone else's file, and cannot walk out of the directory.
    """

    def __init__(self, folder):
        self.folder = folder.strip('/')

    def __call__(self, instance, filename):
        from PIL import Image

        extension = '.png'
        field_file = None
        for field in instance._meta.fields:
            if getattr(field, 'upload_to', None) is self:
                field_file = getattr(instance, field.name, None)
                break
        try:
            if field_file is not None:
                field_file.seek(0)
                with Image.open(field_file) as probe:
                    extension = ALLOWED_FORMATS.get((probe.format or '').upper(), '.png')
                field_file.seek(0)
        except Exception:
            pass
        return f'{self.folder}/{uuid.uuid4().hex}{extension}'

    def __eq__(self, other):
        return isinstance(other, image_upload_to) and other.folder == self.folder

    def __hash__(self):
        return hash(('image_upload_to', self.folder))
