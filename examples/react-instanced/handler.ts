import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Handler } from 'vite-plugin-mix';

const API_NAME = '/api';
const FOLDER_NAME = 'routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeTrailingSlash = (s: string) => s.endsWith('/') ? s.substring(0, s.length - 1) : s;

export const handler: Handler = (req, res, next) => {
  if (!req.path.startsWith(API_NAME)) {
    next();
    return;
  }

  const notFound = () => {
    console.log('Not Found:', req.path);
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end('404 does not exist');
  }

  const sendJson = (filePath: string) => {
    console.log('Sending:', filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    res.setHeader('Content-Type', 'application/json');
    return res.end(content);
  }

  const s = removeTrailingSlash(req.path.replace(API_NAME, ''));

  let filePath: string;
  const dirPath = path.join(__dirname, FOLDER_NAME, s);

  if (!fs.existsSync(dirPath)) {
    filePath = dirPath + '.json';
    if (fs.existsSync(filePath)) {
      return sendJson(filePath);
    }
    return notFound();
  }

  filePath = path.join(__dirname, FOLDER_NAME, s, 'index.json');

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  return sendJson(filePath);
};
