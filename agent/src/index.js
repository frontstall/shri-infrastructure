// @ts-check
import fs from 'fs';
import path from 'path';

import startAgent from './app';

const ownHost = '127.0.0.1';
const pathToConfig = path.resolve(__dirname, '..', 'agent-conf.json');
const config = JSON.parse(fs.readFileSync(pathToConfig));

startAgent({ ...config, ownHost });
