// @ts-check
import createApi from '../api/storageApi';
import initServer from '../server';
import Queue from '../Queue';

const startApp = ({
  port,
  apiBaseUrl,
  apiToken,
}) => {
  const api = createApi(apiBaseUrl, apiToken);

  const queue = new Queue(api);
  queue.start();

  initServer(port, queue);
};

export default startApp;
