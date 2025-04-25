import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageConfig {
  private readonly logger: Logger = new Logger(GoogleCloudStorageConfig.name);
  private storage: Storage;

  public constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.getOrThrow('PROJECT_ID'),
      credentials: {
        client_email:
          'gce-echadospalante@echadospalante.iam.gserviceaccount.com',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC7zHyKIIBKF5dP\npFY/82dN0GWC3010+GLYH63VUS75qadTGLs+NL9qU6zpCu8W7SsnIkRmh+2Av7DY\nzNHtpTx9Pg36fkPk3Mbl0H4R6e3M5/gX/HkQ//eUa8JuZtEibxogjg3zVIDB/RUd\naFCVZ5WCCllMeHpRJMcKdHIodgcP4p/hyVvB1+A3eYu/yhd9E6AZTQNp0hkp2Gs7\nymgg58NYCuilB9F+YMhIhKem9Af5M43MfIlNLnBPHEY6V6I1RC8kvQNjaRwaldIa\nMPZTMIuN9LO+39TbnJrvNF6x+AFIKEE0N+SdFj34BDnq+jJDgHBsl9CY+s9cw0nJ\nU1f8MLoTAgMBAAECggEAAlry0ufMKKreXHCOZ4FZMdNIVhBZmUQqycJlql1v7iuC\nLDaxjDGsu3dKL/AIhlDeuQlHoHlHg+d++l7Oqlf50QUmt0zjqmF9mfWKOYNu6Nkw\nNf+oZDAeNNj3IaTm5PxycF3w3Ucr0V5xHv5eI8mMJIsD+B7osTzVDoFwXMxCJfye\nML/ghEmsJbNPlx6l5uW0NHysD0yr6BADvqBFz8HpPFRigavU9+LH0hObwZuI+UwZ\nQgk3aSHzsW5ddizTatw4AXQORSvP9KmqyQzFF5rV8tfw9pQJ+ED3niqr+C2qFO3e\nq0Jw7FYbCdy9sNTyZ2yERG/xWi1ey2MAvH0f6s5ZSQKBgQDnscfNXtF6gX8qXTet\nzWdxrT4R1As8Mb1ydK7Hfv2nDGk+Z2plyk9ABuO9s/0aiIeSVbffK5zPYj6pp1nV\nA5w8++SAMqTFmPGT28Kc+lL2NDslrmOvNnixv9ADDTHFIEunBRXaUHL6NyUWjnz1\nHtHGhVy06jR5LgSuju2qy7B8SQKBgQDPf+AOyqN70d3yXshKA5+Otz+EbSAqoOA7\nbnJpVqYxC0E1BjmTZDv7isFhWZb4v985EcBGtdh5USN1BzX94UGbAfXl9vcFtj2Q\nzYfpU4xz99lANwRDdE4FQ5dlPAO2WnedA4QjdrLPXYoMPvJGe6CWm15p2D2/Muxl\nxTgkrd7rewKBgBXEWP4NU2bL9bN4MHvumTJP0U4BetC7541yMt1hK9lezCBlvNQ1\nTn64ZvryhuvQOdRgozafNUsycqqjo0fk3+/Gxm/Y0iwSM1ftxHnU9qhUvd3LZWgX\nmP0yBQvUWIGpiBH341awSi0Bs0VMO6cXryOUceI5QpbD4QK5QNDT9A+pAoGAUXo+\n+s/rHgWshy1crGN71chy8ob/KH3/Tpbx6hcSLxPiSPXmyc+EFiPIB3fsZkTBXGFy\nBNIG7KxFpgBs3QIEht9gNSqimOWUizWJdr9N2YOrFSIFVI9oy3xdCG1mb8ZaTZdB\n3cMQN4jdWi2laLPGvRzJF/rHVDqkxNmKUCzN6d0CgYAf+jKsMgaO3CosuOTEsiiU\nI6h8wUJHBJ7ujJSpcYN6N7TOAxvviK17GQuonY6mDGM1n40ix+wUP5j449DI9pDX\njj9FUS6BX73Z0eInnZ/ThIK8M0WN+h/bWXB/UY+y4OKyjOjaDzhjRWwPomqcgrlC\n3ftT4zSFxotzApf/p0SdMA==\n-----END PRIVATE KEY-----\n',
      },
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
        // const result =
        await this.storage.createBucket(bucketName);
        // const response2 =
        await this.storage.bucket(bucketName).makePublic();
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
