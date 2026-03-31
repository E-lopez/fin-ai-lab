import { FilesUploadRequest } from "@/models/dto/filesUploadRequest";
import { FilesService } from "@/services/filesApi/filesService";
import { useAlertDispatch } from "@/stores/alerts/AlertsStore";
import { sanitizeFileName } from "@/utils/functions/files";

export const useFilesHandler = () => {
  const dispatch = useAlertDispatch();

  const uploadMultiple = async (data: FilesUploadRequest, access_token: string) => {
    for (const file of data.files) {
      const fileKey = `${data.user.userId || 'a9182ef3-0063-4619-9e0b-c80556ad103b'}/${sanitizeFileName(file.name)}`;
      await FilesService.uploadFiles({file, fileKey}, access_token);
      dispatch({
        type: "SET_ALERT",
        alertType: "success",
        name: file.name || "Archivo cargado",
        message: "Archivos cargados.",
        data: ''
      });
    };
    return true;
  };

  return {
    uploadMultiple,
  }
}

