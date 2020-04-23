// @ts-check
import path from 'path';
import Express from 'express';
import morgan from 'morgan';

import createApi from './api/serverApi';
import Builder from './Builder';
import ROUTES from './routes';

const initServer = ({
  port,
  serverHost,
  serverPort,
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

  const api = createApi();

  app.post(ROUTES.build, async (req, res) => {
    const {
      id,
      repoUrl,
      commitHash,
      buildCommand,
    } = req.body;

    const serverBaseUrl = path.join(serverHost, serverPort);

    const builder = new Builder(api, serverBaseUrl);
    builder.start({
      id,
      repoUrl,
      commitHash,
      buildCommand,
    });

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
