// @ts-check
import Express from 'express';
import morgan from 'morgan';

import { ROUTES } from './routes';
import getId from './utils/getId';

const initServer = (port, queue) => {
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

  app.post(ROUTES.buildResult, async (req, res) => {
    try {
      console.log(`Sending build result:
      buildId is ${req.body.id},
      status is ${req.body.status},
      log is ${req.body.buildLog}`);
      await queue.finishBuild(req.body);
    } catch (error) {
      console.error(error);
    }

    res.send(200).end();
  });

  app.post(ROUTES.registerAgent, (req, res) => {
    const { host, port: agentPort } = req.body;
    const agentId = getId();
    queue.addAgent({ agentId, host, port: agentPort });
    console.log(`agent ${agentId} connected`);
    res.send({ agentId }).end();
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
