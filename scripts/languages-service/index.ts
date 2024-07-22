/**
 * Needed libs: ts-node, @types/node, axios or node-fetch
 *
 * Needed files: ./tsconfig.node.json
 *
 * Needs to update package.json.scripts
 */

import { argv } from 'process';

import { FileSystemService } from './fs.service';
import { LanguagesService } from './languages.service';

const runInInterval = !!argv[2]; // a variable to run interval below

const SYNC_TIME = 1000; // 12 hours

const fsService = new FileSystemService('./public/languages/');
const languagesService = new LanguagesService('https://api.adada.ds', fsService);

languagesService.sync(); // runs and syncs one time

if (runInInterval) {
  setInterval(() => {
    languagesService.sync();
  }, SYNC_TIME);
}
