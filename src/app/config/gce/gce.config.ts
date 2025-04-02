import { Storage } from '@google-cloud/storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class GoogleCloudStorageConfig {
  private readonly logger: Logger = new Logger(GoogleCloudStorageConfig.name);
  private storage: Storage;

  public constructor(private configService: ConfigService) {
    this.logger.log(path.resolve(__dirname, '../../../../credenciales.json'));
    this.storage = new Storage({
      projectId: configService.getOrThrow('PROJECT_ID'),
      keyFilename: path.resolve(
        __dirname,
        '../../../../credenciales/gce-echadospalante.json',
      ),
    });

    this.createBucketsIfNotExist();
  }

  public get client() {
    return this.storage;
  }

  public get venturesBucketName() {
    return this.configService.getOrThrow<string>('GCS_VENTURES_BUCKET');
  }

  public get eventsBucketName() {
    return this.configService.getOrThrow<string>('GCS_EVENTS_BUCKET');
  }

  public get publicationsBucketName() {
    return this.configService.getOrThrow<string>('GCS_PUBLICATIONS_BUCKET');
  }

  private async createBucketsIfNotExist() {
    const bucketNames = [
      this.venturesBucketName,
      this.eventsBucketName,
      this.publicationsBucketName,
    ];
    console.log({ bucketNames });
    for await (const bucketName of bucketNames) {
      const [bucketExists] = await this.storage.bucket(bucketName).exists();
      if (!bucketExists) {
        const result = await this.storage.createBucket(bucketName);
        const response2 = await this.storage.bucket(bucketName).makePublic();
        this.logger.log(`GCS: Bucket ${bucketName} created`);
        return;
      }
      this.logger.log(`GCS: Bucket ${bucketName} already exists`);
    }
  }

  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const bucket = this.storage.bucket(bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  public async deleteFile(bucketName: string, fileName: string): Promise<void> {
    await this.storage.bucket(bucketName).file(fileName).delete();
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
