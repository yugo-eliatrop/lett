import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export class FileSystemService {
  constructor(private readonly publicPath: string) {}

  private buildPath(relativePath: string) {
    return join(this.publicPath, relativePath);
  }

  public checkAndCreateFolder(dir: string) {
    const path = this.buildPath(dir);
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  }

  public writeToFile(pathToFile: string, text: string) {
    const path = this.buildPath(pathToFile);
    writeFileSync(path, text);
  }
}
