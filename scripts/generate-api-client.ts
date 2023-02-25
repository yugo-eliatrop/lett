import { sequenceS } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { readFile, writeFile } from 'fs/promises';
import * as t from 'io-ts';

import { log } from '../utils/log';
import { allFilesInDir } from './utils';

const apiPath = './pages/api';
const apiClientMetodRegex = /@api-client-method:.{0,}(GET|POST|PUT|DELETE)/;
const apiUrlRegex = /^.+(\/api.+)\.ts$/;

const MethodCodec = t.union([t.literal('GET'), t.literal('POST'), t.literal('PUT'), t.literal('DELETE')]);
type Metod = t.TypeOf<typeof MethodCodec>;

type Endpoint = {
  url: string;
  name: string;
  method: Metod;
};

const findMethod = (text: string): O.Option<Metod> =>
  pipe(text.match(apiClientMetodRegex)?.[1], MethodCodec.decode, O.fromEither);

const genUrl = (path: string): O.Option<string> => pipe(path, s => s.match(apiUrlRegex)?.[1], O.fromNullable);

const urlToName = (url: string): string => {
  const tokens = url.split('/').filter(t => t);
  const capitalizeFirstLetter = (s: string) => s[0].toUpperCase() + s.slice(1, s.length);
  return [tokens[0], ...tokens.slice(1, tokens.length).map(capitalizeFirstLetter)].join('');
};

const defineEndpoint = async (path: string): Promise<O.Option<Endpoint>> => {
  const file = await readFile(path, { encoding: 'utf-8' });
  return pipe(
    sequenceS(O.Apply)({ method: findMethod(file), url: genUrl(path) }),
    O.bind('name', ({ url }) => O.of(urlToName(url)))
  );
};

const run = async () => {
  log('generating api client')('');
  const files = await allFilesInDir(apiPath);
  const endpoints = (await Promise.all(files.map(defineEndpoint))).filter(O.isSome).map(x => x.value);

  const script = `import type { NextApiRequest, NextApiResponse } from 'next';
import * as RD from '@devexperts/remote-data-ts';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';

${endpoints.map(({ name, url }) => `import ${name}Handler from './pages${url}';`).join('\n')}

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse<E.Either<string, unknown>>) => void;

type ResponseOf<T extends NextApiHandler> = Parameters<Parameters<T>[1]['json']>[0];

type TypeFromRight<T> = T extends E.Right<infer U> ? E.Right<U> : never;

const apiMethodFactory = <H extends NextApiHandler>(url: string, method: string) => {
  type SuccessfulResp = TypeFromRight<ResponseOf<H>>['right'];
  return async (body?: object): Promise<RD.RemoteInitial | RD.RemotePending | RD.RemoteFailure<Error> | RD.RemoteSuccess<SuccessfulResp>> => {
    try {
      const res = await fetch(url, { method, body: JSON.stringify(body) });
      const data = await res.json() as ResponseOf<H>;
      return pipe(
        data,
        E.fold(
          (e) => RD.failure(new Error(e)),
          (d) => RD.success(d),
        ),
      );
    } catch (e) {
      return RD.failure(e as Error);
    }
  };
};

${endpoints
  .map(
    ({ url, method, name }) => `export const ${name} = apiMethodFactory<typeof ${name}Handler>('${url}', '${method}');`
  )
  .join('\n')}
`;
  await writeFile('api-client.ts', script);
};

run();
