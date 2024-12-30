import * as dotenv from 'dotenv';
import { join } from 'path';

const env = process.env.NODE_ENV || 'development';
export default dotenv.config({
  path: join(__dirname, '../_env', '/.env.' + env),
});
