export const getKeyByFilename = (filename: string): string =>
  `${filename.split('.').slice(0, -1).join('.')}_${Date.now()}`;
