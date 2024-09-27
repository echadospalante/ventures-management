export interface ContentCdn {
  uploadFile(file: Express.Multer.File): Promise<string>;
}

export const ContentCdn = Symbol('ContentCdn');
