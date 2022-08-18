import type { MockHandler } from '../vite-plugin-mock-server';
import path from 'node:path';
import fs from 'node:fs';

const DATA_FOLDER = 'json';

const ENOENT = 2;

function toPosix(s: string) {
  return s.split(path.sep).join(path.posix.sep);
}

function removePrefixPath(p: string) {
  const i = p.indexOf(DATA_FOLDER);
  return p.substring(i + DATA_FOLDER.length);
}

function getMocks() {
  const handlers: MockHandler[] = [];

  function scan(folder: string) {
    const items = fs.readdirSync(folder);
    items.forEach((item) => {
      const stat = fs.statSync(path.join(folder, item));
      if (stat.isFile()) {
        const { name, ext } = path.parse(item);
        if (ext === '.json') {
          let pattern = toPosix(removePrefixPath(folder));
          pattern = name === 'index' ? pattern : path.posix.join(pattern, name);
          if (pattern && pattern.startsWith('/')) {
            pattern = pattern.substring(1);
          }
          handlers.push({
            pattern,
            filePath: path.join(folder, item),
            handle(req, res) {
              const data = fs.readFileSync(this.filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            },
          } as any );
        }
      } else {
        scan(path.join(folder, item));
      }
    });
  }

  try {
    scan(path.join(__dirname, DATA_FOLDER));
  } catch (err: any) {
    if (err.code === ENOENT) {
      console.log(err.code);
    } else {
      console.error(err.message);
    }
  } finally {
    return handlers;
  }
}

const mocks = getMocks();

export default mocks;


