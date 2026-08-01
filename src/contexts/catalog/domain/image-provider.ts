export type UploadImageParams = {
  buffer: Buffer
  extension: string
  publicId: string
}

export interface ImageProvider {
  delete: (url: string) => Promise<void>
  upload: (params: UploadImageParams) => Promise<string>
}
