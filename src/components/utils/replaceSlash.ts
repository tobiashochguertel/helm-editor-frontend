function replaceSlash(filename: string) {
    const SLASH = '%2F';
  
    if (filename.indexOf("/") > -1) {
      filename = filename.replace("/", SLASH);
    }
    return filename;
  }

export default replaceSlash;