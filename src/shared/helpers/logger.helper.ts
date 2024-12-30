import { existsSync, readFileSync, readdirSync } from 'fs';
import path, { join } from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';
import { createStream } from 'rotating-file-stream';

export enum ELogType {
  INFO = 'info',
  ERROR = 'error',
  ACCESS = 'access',
  FATAL = 'fatal',
}

const logDir = join(__dirname, '..', '..', '..', 'logs');

const logStream = (type: string, interval: string = '1d') =>
  createStream(type, { interval, path: join(logDir, type) });

const prettyStream = pretty({
  colorize: true,
  translateTime: true,
});

const streams: pino.StreamEntry[] = [
  { stream: prettyStream },
  { level: 'error', stream: logStream('error') },
  { level: 'debug', stream: logStream('debug') },
  { level: 'fatal', stream: logStream('fatal') },
  { level: 'info', stream: logStream('info', '2d') },
];

const pinoConfigs = {
  safe: true,
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(pinoConfigs, pino.multistream(streams));

export const getListLogFile = async (type: ELogType): Promise<string[]> => {
  if (!['info', 'error', 'access', 'fatal'].includes(type)) {
    throw new Error(`Error: getListLogFile type value (${type}) unknown`);
  }
  return readdirSync(path.join(logDir, type)) || [];
};

export const getContentLogFile = async (type: ELogType, filename: string): Promise<string> => {
  const pathFile = path.join(logDir, type, filename);
  if (existsSync(pathFile)) {
    return readFileSync(pathFile).toString();
  }
  return 'nil';
};
