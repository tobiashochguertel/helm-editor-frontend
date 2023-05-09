export function replaceSlash(filename: string) {
  const SLASH = '%2F';

  if (filename.indexOf("/") > -1) {
    filename = filename.replace("/", SLASH);
  }
  return filename;
}
type FileContent = {
  fielname: string;
  content: string;
};
export async function getContent(filename: string): Promise<FileContent> {
  // http://localhost:5173/api/file/templates%2Fworker-deployment.yaml
  filename = replaceSlash(filename);

  const data = await (
    await fetch(`/api/file/${filename}`)
  ).json();
  return data;
}
