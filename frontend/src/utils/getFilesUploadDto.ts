import { Files } from "@/models/dto/file";

export const getFilesUploadDto = (
  model: { [s: string]: unknown; } | ArrayLike<unknown>, 
  companyId: string
) => {
  const formData = new FormData();
  const fileArray = Object.values(model).flat(1) as File[];
  const metadataJson = JSON.stringify({'companyId': companyId});
  const metadataBlob = new Blob([metadataJson], {type: 'application/json'});

  fileArray.forEach((file) => formData.append(`files`, file));
  formData.append("metadata", metadataBlob);

  return formData as unknown as Files;
}
