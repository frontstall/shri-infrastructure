// @ts-check
import path from 'path';

import createApi from '../api/serverApi';
import initServer from '../server';

const startAgent = async ({
  port,
  ownHost,
  serverHost,
  serverPort,
}) => {
  const serverBaseUrl = `http://${serverHost}:${serverPort}`;
  const api = createApi(serverBaseUrl);

  try {
    const { data: { agentId } } = await api.register({ host: ownHost, port });

    initServer({ agentId, api, port });
  } catch (error) {
    console.error(error);
  }
};

export default startAgent;
