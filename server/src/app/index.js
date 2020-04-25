// @ts-check
import createApi from '../api/storageApi';
import initServer from '../server';
import Queue from '../Queue';

const startApp = async ({
  port,
  apiBaseUrl,
  apiToken,
}) => {
  const api = createApi(apiBaseUrl, apiToken);
  const { data: { data: config } } = await api.getConfig();
  const queue = new Queue(api, config);
  queue.start();

  initServer(port, queue);
};

export default startApp;
