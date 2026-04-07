// src/common/services/s3.service.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

// Sanitize filename function
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 100);
};

// Direct S3 file upload service
@Injectable()
export class S3UploadService {
  private readonly s3Client: AWS.S3;

  constructor() {
    this.s3Client = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  // Upload file buffer directly to S3
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
    folder: string = 'uploads',
  ): Promise<{ key: string; url: string }> {
    // Validate input parameters
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is required and cannot be empty');
    }

    if (!originalName || originalName.trim() === '') {
      throw new Error('Original filename is required');
    }

    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is required');
    }

    const sanitizedName = sanitizeFilename(originalName);
    const key = `${folder}/${Date.now()}_${sanitizedName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    await this.s3Client.putObject(params).promise();

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { key, url };
  }

  // Upload base64 image to S3
  async uploadBase64Image(
    base64String: string,
    fileName: string,
    folder: string = 'uploads',
  ): Promise<{ key: string; url: string }> {
    // Validate input parameters
    if (!base64String || base64String.trim() === '') {
      throw new Error('Base64 string is required');
    }

    if (!fileName || fileName.trim() === '') {
      throw new Error('Filename is required');
    }

    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is required');
    }

    const sanitizedName = sanitizeFilename(fileName);
    const key = `${folder}/${Date.now()}_${sanitizedName}`;

    // Remove data:image/png;base64, prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Detect mime type from base64 string or use default
    const mimeType =
      base64String.match(/^data:(image\/\w+);base64/)?.[1] || 'image/jpeg';

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };

    await this.s3Client.putObject(params).promise();

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { key, url };
  }

  // Get public URL (no signing required for public objects)
  getPublicUrl(key: string): string {
    if (!key || key.trim() === '') {
      throw new Error('File key is required');
    }

    if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_REGION) {
      throw new Error(
        'AWS_S3_BUCKET_NAME and AWS_REGION environment variables are required',
      );
    }

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    if (!key || key.trim() === '') {
      throw new Error('File key is required');
    }

    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is required');
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    await this.s3Client.deleteObject(params).promise();
  }

  // Check if file exists
  async fileExists(key: string): Promise<boolean> {
    if (!key || key.trim() === '') {
      throw new Error('File key is required');
    }

    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is required');
    }

    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      };
      await this.s3Client.headObject(params).promise();
      return true;
    } catch (_error) {
      // File doesn't exist or other error occurred
      return false;
    }
  }
}

// Simple upload function
export const uploadToS3 = async (
  fileBuffer: Buffer,
  originalName: string,
  mimetype: string,
  folder: string = 'uploads',
): Promise<{ key: string; url: string }> => {
  const s3Service = new S3UploadService();
  return await s3Service.uploadFile(fileBuffer, originalName, mimetype, folder);
};

// Upload base64 image function
export const uploadBase64ToS3 = async (
  base64String: string,
  fileName: string,
  folder: string = 'uploads',
): Promise<{ key: string; url: string }> => {
  const s3Service = new S3UploadService();
  return await s3Service.uploadBase64Image(base64String, fileName, folder);
};
