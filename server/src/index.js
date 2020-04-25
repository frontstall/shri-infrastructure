// @ts-check
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import startApp from './app';

dotenv.config();

const pathToConfig = path.resolve(__dirname, '..', 'server-conf.json');
const config = JSON.parse(fs.readFileSync(pathToConfig));

if (process.env.TOKEN) {
  config.apiToken = process.env.TOKEN;
}

startApp(config);
