import * as fs from 'fs';

export async function GetImageFromDir(path: string) {
  try {
    if (fs.existsSync(path)) {
      const images = await fs.readdirSync(path).filter(function (file) {
        return fs.statSync(`${path}/${file}`).isFile();
      });
      return images;
    } else return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetDirListFromDir(path: string) {
  try {
    if (fs.existsSync(path)) {
      const images = await fs.readdirSync(path);
      return images;
    } else return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
