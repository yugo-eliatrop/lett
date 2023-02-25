import { writeFile } from 'fs/promises';

import { log } from '../utils/log';
import { allFilesInDir } from './utils';

const pagesPath = './pages';
const apiUrlRegex = /^.+(\/api.+)\.ts$/;

type FuncDescription = {
  func: string;
  funcName: string;
};

const funcDescriptionToString = (fd: FuncDescription) => `${fd.funcName}: ${fd.func}`;

const urlToName = (url: string): string => {
  const tokens = url.split('/').filter(t => !['', 'index'].includes(t) && !t.includes('['));
  const capitalizeFirstLetter = (s: string) => s[0].toUpperCase() + s.slice(1, s.length);
  return [tokens[0], ...tokens.slice(1, tokens.length).map(capitalizeFirstLetter)].join('');
};

const handlePath = (path: string): FuncDescription => {
  if (path === '/index') return { func: "() => '/'", funcName: 'index' };
  const variables = [...path.matchAll(/\[(\w+)\]/g)].map(item => ({ name: item[1], entry: item[0] }));
  const params = variables.map(({ name }) => `${name}: number | string`).join(', ');
  const pathWithEntries = variables.reduce((res, variable) => {
    return res.replace(variable.entry, '${' + variable.name + '}');
  }, path);
  return {
    func: `(${params}) => \`${pathWithEntries.replace('/index', '')}\``,
    funcName: urlToName(path),
  };
};

(async () => {
  log('generating routes')('');
  const files = await allFilesInDir(pagesPath);
  const funcs = files
    .filter(path => !path.match(apiUrlRegex) && !path.match(/_app|_document/))
    .map(path => path.replace('pages', '').replace('.tsx', ''))
    .map(handlePath);
  const script = `export const routes = {${funcs.map(funcDescriptionToString).join(',\n')}}`;
  await writeFile('routes.ts', script);
})();
