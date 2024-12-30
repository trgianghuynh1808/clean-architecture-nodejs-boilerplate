import { existsSync, readFileSync } from 'fs';
import path from 'path';

export const getBuildVersionFromFile = (): string => {
  const versionPath = path.join(__dirname, '..', '..', '..', '.version');
  let version: string = process.env.npm_package_version?.toString() || '';
  if (existsSync(versionPath)) {
    version = readFileSync(versionPath).toString().replace('\n', '') || version;
  }

  return version;
};

export const loadBuildVersion = (): void => {
  process.env.BUILD_VERSION = getBuildVersionFromFile();
};

export const getBuildVersion = (): string => {
  if (!process.env.BUILD_VERSION) {
    loadBuildVersion();
  }

  return <string>process.env.BUILD_VERSION || '< unknown >';
};
