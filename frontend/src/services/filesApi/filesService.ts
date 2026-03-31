import FilesApiConnector from "./filesApiConnector";
import { FilesUploadRequestPayload } from "@/models/dto/filesUploadRequest";

class FilesFacade {
  connector: FilesApiConnector;

  constructor(connector: new () => FilesApiConnector) {
    this.connector = new connector()
  }

  getAllFiles() { 
    return this.connector.getAllFiles() 
  };

  // To do
  getFilesByUserId() {};

  uploadFiles(request: FilesUploadRequestPayload, access_token: string) {
    return this.connector.uploadFiles(request, access_token);
  }



}

export const FilesService = new FilesFacade(FilesApiConnector);
