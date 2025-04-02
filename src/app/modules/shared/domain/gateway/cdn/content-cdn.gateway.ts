export interface ContentCdn {
  uploadFile(
    bucketName: 'VENTURES' | 'EVENTS' | 'PUBLICATIONS',
    file: Express.Multer.File,
  ): Promise<string>;
}

export const ContentCdn = Symbol('ContentCdn');
