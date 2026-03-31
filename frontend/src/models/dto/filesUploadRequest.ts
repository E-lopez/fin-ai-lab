export interface FilesUploadRequest {
  user: Record<string, any>;
  files: File[];

}
export interface FilesUploadRequestPayload {
  file: File;
  fileKey: string;
}