// @ts-check
import getCallApi from '../utils/callApi';
import { REQUEST_ROUTES } from '../routes';

const createApi = (baseUrl) => {
  const callApi = getCallApi(baseUrl);
  return {
    register(data) {
      return callApi({
        method: 'POST',
        url: REQUEST_ROUTES.register,
        data,
      });
    },

    sendBuildResult(data) {
      return callApi({
        method: 'POST',
        url: REQUEST_ROUTES.sendBuildResult,
        data,
      });
    },
  };
};

export default createApi;
