import { FilesUploadRequestPayload } from "@/models/dto/filesUploadRequest";

export default class FilesApiConnector {
  static readonly lambda_url: string = import.meta.env.VITE_FILE_LAMBDA_URL;
  static readonly baseUrl: string = this.lambda_url + 'file';
  static readonly bucket = import.meta.env.VITE_FILE_BUCKET_NAME || 'dev-file-handler-bucket';


  get currentBaseUrl() {
    return FilesApiConnector.baseUrl
  }

  async getAllFiles() {
    try {
      const response = await fetch(`${FilesApiConnector.baseUrl}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors'
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      return `${e.name}: ${e.message}`;
    }
  }

  async getFileByUserId(id: string) {
    try {
      const response = await fetch(`${FilesApiConnector.baseUrl}/${id}`, { 
        headers: {'Content-Type': 'application/json'},
        mode: 'cors'
      });
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      return json;
    }
    catch(e: any) {
      return `${e.name}: ${e.message}`;
    }
  }

  async uploadFiles({file, fileKey}: FilesUploadRequestPayload, access_token: string) {
    try {
      const s3Url = `s3/${FilesApiConnector.bucket}/${fileKey}`

      const signedUrl = await fetch(`${this.currentBaseUrl}/${s3Url}?token=${encodeURIComponent(access_token ?? '')}`, {
        method: "GET",
      });
      if (!signedUrl.ok) {
        throw signedUrl;
      }
      const { url: clientUrl } = await signedUrl.json();

      
      const response = await fetch(clientUrl, {
        method: "PUT",
        headers: {
          "Content-Length": new Blob([file]).size.toString(),
        },
        mode: "cors",
        body: file,
      });

      if (!response.ok) {
        throw response;
      }

      return response;

    } catch (caught) {
      if (caught instanceof Error && caught.name === "CredentialsProviderError") {

      } else {
        throw caught;
      }
    }
  };

}