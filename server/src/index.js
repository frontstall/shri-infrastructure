// @ts-check
import fs from 'fs';
import path from 'path';

import startApp from './app';

const pathToConfig = path.resolve(__dirname, '..', 'server-conf.json');
const config = JSON.parse(fs.readFileSync(pathToConfig));

startApp(config);
