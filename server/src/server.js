// @ts-check
import path from 'path';
import Express from 'express';
import morgan from 'morgan';

import createApi from './api/storageApi';
import { ROUTES } from './routes';

const initServer = ({
  port,
  apiBaseUrl,
  apiToken,
}) => {
  const app = new Express();
  const logger = morgan('combined');
  app.use(logger);
  app.use(Express.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, DELETE, POST, GET');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  const api = createApi(apiBaseUrl, apiToken);

  app.post(ROUTES.notify, async (req, res) => {
    const {
      id,
      buildLog,
      status,
    } = req.body;

    res.send(200).end();
  });

  app.use((error, req, res, next) => { //eslint-disable-line
    console.log(error);
    res.status(500).end();
  });

  app.listen(port, () => {
    console.log(`server has been started on port ${port}`);
  });
};

export default initServer;
