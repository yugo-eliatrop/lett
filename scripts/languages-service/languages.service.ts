import fetch from 'node-fetch';

import { FileSystemService } from './fs.service';

type LanguagesResponse = {
  data: Record<string, Record<string, string>>; // JSONs with data like { en: {...}, ru: {...} }
  time: string; // string like Date, last update time in PO Editor
};

export class LanguagesService {
  private lastUpdateTime: string | null = null;

  constructor(private readonly apiUrl: string, private readonly fs: FileSystemService) {}

  private async getLanguagesData() {
    const response = await fetch(this.apiUrl);
    const data = (await response.json()) as LanguagesResponse;
    return data;
  }

  private handleData(data: LanguagesResponse['data']) {
    // use funcs from fs service
    Object.keys(data).forEach(language => {
      // language - like 'en', 'ru', 'fr'
      this.fs.checkAndCreateFolder(language); // create needed folder
      const jsonForLanguage = data[language];
      this.fs.writeToFile(`${language}/blabla.json`, JSON.stringify(jsonForLanguage)); // create needed file
    });
  }

  public async sync() {
    const res = await this.getLanguagesData();
    if (res.time !== this.lastUpdateTime) {
      this.lastUpdateTime = res.time;
      this.handleData(res.data);
    }
  }
}
