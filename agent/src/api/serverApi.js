// @ts-check
import axios from 'axios';
import path from 'path';

const createApi = (baseUrl, requestHandler = axios) => {
  const getUrl = (apiUrl) => path.join(baseUrl, apiUrl);
  return {
    async notifyServer(data) {
      const url = getUrl('/notify_build_result');

      try {
        await requestHandler.post(url, data);
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export default createApi;
