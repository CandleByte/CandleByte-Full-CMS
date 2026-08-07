import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../config/env.js';

const client = new S3Client({
    region: 'auto',
    endpoint: env.R2_KEY_ENDPOINT_URL,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY
    }
});

export const uploadS3File = async (buffer, key, mimeType) => {
    const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType
    });

    await client.send(command);
    return key;
}

export const getS3FileUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
}

export const deleteS3File = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key
    });
    await client.send(command);

}
