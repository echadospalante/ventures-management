import { Injectable } from '@nestjs/common';

import { Bucket } from '@google-cloud/storage';

import { ContentCdn } from '../../domain/gateway/cdn/content-cdn.gateway';
import { GoogleCloudStorageConfig } from '../../../../config/gce/gce.config';

@Injectable()
export class ContentCdnImpl implements ContentCdn {
  private readonly venturesBucket: Bucket;
  private readonly eventsBucket: Bucket;
  private readonly publicationsBucket: Bucket;

  public constructor(private googleCloudStorage: GoogleCloudStorageConfig) {
    this.venturesBucket = this.googleCloudStorage.client.bucket(
      this.googleCloudStorage.venturesBucketName,
    );
    this.eventsBucket = this.googleCloudStorage.client.bucket(
      this.googleCloudStorage.eventsBucketName,
    );
    this.publicationsBucket = this.googleCloudStorage.client.bucket(
      this.googleCloudStorage.publicationsBucketName,
    );
  }

  public async uploadFile(
    bucketName: 'VENTURES' | 'EVENTS' | 'PUBLICATIONS',
    file: Express.Multer.File,
  ): Promise<string> {
    let bucketToUse: Bucket | null = null;
    if (bucketName === 'VENTURES') {
      bucketToUse = this.venturesBucket;
    } else if (bucketName === 'EVENTS') {
      bucketToUse = this.eventsBucket;
    } else {
      bucketToUse = this.publicationsBucket;
    }
    console.log(file);
    const blob = bucketToUse.file(file.originalname);
    const blobStream = blob.createWriteStream();
    // await blob.makePublic();
    console.log(bucketName);
    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketToUse.name}/${blob.name}`;
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
