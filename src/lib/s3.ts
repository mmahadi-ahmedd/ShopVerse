import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_SIZE = 5 * 1024 * 1024;

export async function createUploadUrl(ownerId: string, contentType: string, size: number) {
  const key = `products/${ownerId}/${nanoid(16)}.${EXT[contentType]}`;
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType, ContentLength: size }),
    { expiresIn: 300 }
  );
  return { uploadUrl, key, publicUrl: `${process.env.CDN_URL}/${key}` };
}