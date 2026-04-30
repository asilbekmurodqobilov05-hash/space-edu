from storages.backends.s3boto3 import S3Boto3Storage


class R2MediaStorage(S3Boto3Storage):
    """Cloudflare R2 storage for user-uploaded media (avatars, market images)."""
    region_name = 'auto'
    default_acl = None       # R2 uses bucket-level access policy, not per-object ACLs
    file_overwrite = False
    querystring_auth = False  # public bucket — no signed URLs needed
