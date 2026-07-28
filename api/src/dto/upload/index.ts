import { MultipartFile } from "@fastify/multipart";

export interface IUploadFileInputDto {
  file: MultipartFile,
  id: string,
  pathFolder: string,
}