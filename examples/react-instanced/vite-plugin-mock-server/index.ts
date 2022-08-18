import { Plugin, ViteDevServer, Connect, ResolvedConfig } from 'vite';
import AntPathMatcher from '@howiefh/ant-path-matcher';
import fs from 'node:fs';
import type { ServerResponse } from 'node:http';
import path from 'node:path';

interface ILogger {
  info(...msg: string[]): void;
  success(...msg: string[]): void;
  warn(...msg: string[]): void;
  error(...msg: string[]): void;
}

type LogLevel = 'info' | 'error' | 'off';

class Logger implements ILogger {
  private colors = {
    reset: '\x1b[0m',
    fg: {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
    },
  } as const;

  private packageName: string;
  private logLevel: LogLevel;

  constructor(packageName: string, logLevel: LogLevel) {
    this.packageName = packageName;
    this.logLevel = logLevel;
  }

  private log(msg: string[], prefix: string = '') {
    if (this.logLevel === 'off') {
      return;
    }
    const s = msg.join('\n');
    // eslint-disable-next-line no-console
    console.log(`%s${this.packageName}:%s ${s}\n`, prefix, prefix ? this.colors.reset : '');
  }

  info(...msg: string[]) {
    if (this.logLevel === 'error') {
      return;
    }
    this.log(msg);
  }

  success(...msg: string[]) {
    if (this.logLevel === 'error') {
      return;
    }
    this.log(msg, this.colors.fg.green);
  }

  warn(...msg: string[]) {
    if (this.logLevel === 'error') {
      return;
    }
    this.log([...msg], this.colors.fg.yellow);
  }

  error(...msg: string[]) {
    this.log(['Failed!', ...msg], this.colors.fg.red);
  }
}

const PLUGIN_NAME = 'vite-plugin-mock-server';
let logger: ILogger;

export type MockFunction = {
  (req: Connect.IncomingMessage, res: ServerResponse, urlVars?: { [key: string]: string }): void
}

export type MockHandler = {
  pattern: string;
  method?: string;
  handle: MockFunction;
};

export type MockOptions = {
  logLevel?: 'info' | 'error' | 'off';
  urlPrefixes?: string[];
  handlers?: MockHandler[],
  mockRootDir?: string;
  noHandlerResponse404?: boolean;
};

const defaultOptions: MockOptions = {
  logLevel: 'info',
  urlPrefixes: ['/api/'],
  mockRootDir: 'json',
  noHandlerResponse404: true,
};

export default (options: MockOptions = {}): Plugin => {
  let config: ResolvedConfig;

  return {
    name: PLUGIN_NAME,

    configResolved(resolvedConfig) {
      // store the resolved config
      config = resolvedConfig;
      // console.log(config)
    },

    configureServer: async (server: ViteDevServer) => {
      // build url matcher
      const matcher = new AntPathMatcher();

      // init options
      options.logLevel = options.logLevel || defaultOptions.logLevel;
      let urlPrefixes: string[];
      if (Array.isArray(options.urlPrefixes)) {
        urlPrefixes = urlPrefixes.filter(Boolean).map(addSlashes);
      }
      options.urlPrefixes = urlPrefixes?.length ? urlPrefixes : defaultOptions.urlPrefixes;
      options.mockRootDir = options.mockRootDir || defaultOptions.mockRootDir;
      options.noHandlerResponse404 = options.noHandlerResponse404 ?? defaultOptions.noHandlerResponse404;

      logger = new Logger(PLUGIN_NAME, options.logLevel);

      logger.info('mock server started.', `options = ${JSON.stringify(options, null, '  ')}`);

      server.middlewares.use((
        req: Connect.IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
      ) => {
        doHandle(options, config, matcher, req, res, next);
      });
    },
  };
};

const doHandle = async (
  {handlers, urlPrefixes, mockRootDir, noHandlerResponse404}: MockOptions,
  config: ResolvedConfig,
  matcher: AntPathMatcher,
  req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction
) => {
  if (!req?.url || !urlPrefixes.some((prefix) => req.url.startsWith(prefix))) {
    next();
    return;
  }

  if (handlers) {
    const normalizedUrl = req.url.endsWith('/') ? req.url.substring(0, req.url.length - 1) : req.url;

    for (const handler of handlers) {
      let path = normalizedUrl;
      const index = path.indexOf('?');
      if (index > 0) {
        path = path.substring(0, index);
      }
      let pathVars: { [key: string]: string } = {};
      let matched = matcher.doMatch(handler.pattern, path, true, pathVars);
      if (matched && handler.method) {
        matched = handler.method === req.method;
      }
      if (matched) {
        logger.info('matched', `handler = ${JSON.stringify(handler, null, '  ')}`, `pathVars = ${JSON.stringify(pathVars, null, '  ')}`);
        handler.handle(req, res, { ...pathVars });
        return;
      }
    }
  }

  let route: string;
  for (const prefix of urlPrefixes) {
    if (req.url.startsWith(prefix)) {
      route = req.url.substring(prefix.length);
      break;
    }
  }

  if (route) {
    route = removeTrailingSlash(route);

    const dirPath = path.join(config.root, mockRootDir, route);
    const name = isDirExists(dirPath) ? 'index' : '';

    const filePath = (name ? path.join(dirPath, name) : dirPath) + '.json';

    if (isFileExists(filePath)) {
      logger.info('matched', `file: ${filePath}`);

      const data = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.end(data);

      return;
    }
  }

  if (noHandlerResponse404) {
    res.statusCode = 404;
    const { url, method } = req;
    res.end('[' + PLUGIN_NAME + '] no handler found, { url: "' + url + '", method: "' + method + '" }');
    return;
  }

  next();
}

function removeTrailingSlash(s: string) {
  return s.endsWith('/') ? s.substring(0, s.length - 1) : s;
}

function isDirExists(s: string) {
  try {
    const stat = fs.statSync(s);
    return stat.isDirectory();
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    logger.error(err.toString());
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
    logger.error(err.toString());
  }
}

function addSlashes(s: string) {
  if (!s.startsWith('/')) {
    s = `/${s}`;
  }
  if (!s.endsWith('/')) {
    s = `${s}/`;
  }
  return s;
}



