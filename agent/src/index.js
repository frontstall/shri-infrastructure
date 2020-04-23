// @ts-check
import fs from 'fs';
import path from 'path';

import initServer from './server';

const pathToConfig = path.resolve(__dirname, '..', 'agent-conf.json');
const config = JSON.parse(fs.readFileSync(pathToConfig));

initServer(config);
