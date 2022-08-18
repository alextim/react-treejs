import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Handler } from 'vite-plugin-mix';



const API_NAME = '/api';
const FOLDER_NAME = 'routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeTrailingSlash = (s: string) => s.endsWith('/') ? s.substring(0, s.length - 1) : s;

function isDirExists(s: string) {
  try {
    const stat = fs.statSync(s);
    return stat.isDirectory();
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

function isFileExists(s: string) {
  try {
    const stat = fs.statSync(s);
    return stat.isFile();
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}


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

  const sendJsonRes = (content: string) => {
    res.setHeader('Content-Type', 'application/json');
    return res.end(content);
  }

  const sendFileContent = (filePath: string) => {
    console.log('Sending:', filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    return sendJsonRes(content);
  }

  const send = (dirPath: string, fileName = '') => {
    let file: string;
    if (fileName) {
      file = path.join(dirPath, fileName);
    } else {
      file = dirPath;
    }

    const filePath = file + '.json';
    if (isFileExists(filePath)) {
      return sendFileContent(filePath);
    }

    return notFound();
  };

  const route = removeTrailingSlash(req.path.replace(API_NAME, ''));
  console.log(route)
  const fn = routes[route];
  if (fn) {
    const jsonData = fn();
    return sendJsonRes(JSON.stringify(jsonData));
  }

  const dirPath = path.join(__dirname, FOLDER_NAME, route);

  return send(dirPath, isDirExists(dirPath) ? 'index' : '');
};
