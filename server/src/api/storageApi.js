// @ts-check
import getCallApi from '../utils/callApi';
import { STORAGE_ROUTES } from '../routes';

const createApi = (baseUrl, apiToken) => {
  const callApi = getCallApi(baseUrl, apiToken);
  return {
    getBuilds(offset = 0, limit = 10) {
      return callApi({
        method: 'GET',
        url: STORAGE_ROUTES.buildList,
        params: { limit, offset },
      });
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
