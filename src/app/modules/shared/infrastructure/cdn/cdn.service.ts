import { Injectable } from '@nestjs/common';

import { ContentCdn } from '../../domain/gateway/cdn/content-cdn.gateway';
import { GoogleCloudStorageConfig } from 'src/app/config/gce/gce.config';
import { Bucket } from '@google-cloud/storage';

@Injectable()
export class ContentCdnImpl implements ContentCdn {
  private readonly venturesBucket: Bucket;
  public constructor(private googleCloudStorage: GoogleCloudStorageConfig) {
    this.venturesBucket = this.googleCloudStorage.client.bucket(
      this.googleCloudStorage.bucketName,
    );
  }

  public uploadFile(file: Express.Multer.File): Promise<string> {
    const blob = this.venturesBucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.venturesBucket.name}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  public async deleteFile(fileName: string): Promise<void> {
    await this.venturesBucket.file(fileName).delete();
  }

  // Para descargar un archivo
  //   public async getFile(fileName: string): Promise<Buffer> {
  //     const file = this.storage.bucket(this.bucketName).file(fileName);
  //     const [fileExists] = await file.exists();
  //     if (!fileExists) {
  //       throw new Error(`File ${fileName} not found`);
  //     }
  //     const [data] = await file.download();
  //     return data;
  //   }
}
