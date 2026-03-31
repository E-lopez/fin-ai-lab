export function checkFileExtension(filename: string, allowedExtensions: string[]) {
  const ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
  return allowedExtensions.includes(ext);
}

export function sanitizeFileName(fileName: string) {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9_\-\s]/g, '');
  return sanitizedFileName.replace(/\s/g, '_');
}
