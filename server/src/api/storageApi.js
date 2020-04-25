// @ts-check
import { getStorageCallApi } from '../utils/callApi';
import { STORAGE_ROUTES } from '../routes';

const createApi = (baseUrl, apiToken) => {
  const callApi = getStorageCallApi(baseUrl, apiToken);
  return {
    async getBuilds(offset = 0, limit = 25) {
      const { data: { data: builds } } = await callApi({
        method: 'GET',
        url: STORAGE_ROUTES.buildList,
        params: { limit, offset },
      });

      return builds;
    },

    startBuild({ buildId, dateTime }) {
      return callApi({
        method: 'POST',
        url: STORAGE_ROUTES.startBuild,
        data: {
          buildId,
          dateTime,
        },
      });
    },

    finishBuild({
      buildId,
      duration,
      success,
      buildLog,
    }) {
      return callApi({
        method: 'POST',
        url: STORAGE_ROUTES.finishBuild,
        data: {
          buildId,
          duration,
          success,
          buildLog,
        },
      });
    },
  };
};

export default createApi;
