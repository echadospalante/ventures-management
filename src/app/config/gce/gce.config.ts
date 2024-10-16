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

    this.createBucketIfNotExists();
  }

  public get client() {
    return this.storage;
  }

  public get bucketName() {
    return this.configService.getOrThrow<string>('GCS_BUCKET');
  }

  private async createBucketIfNotExists() {
    const [bucketExists] = await this.storage.bucket(this.bucketName).exists();
    if (!bucketExists) {
      const result = await this.storage.createBucket(this.bucketName);
      const response2 = await this.storage.bucket(this.bucketName).makePublic();
      console.log({ result, response2 });
      this.logger.log(`GCS: Bucket ${this.bucketName} created`);
      return;
    }
    this.logger.log(`GCS: Bucket ${this.bucketName} already exists`);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  public async deleteFile(fileName: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(fileName).delete();
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
