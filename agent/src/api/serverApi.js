// @ts-check
import getCallApi from '../utils/callApi';
import { REQUEST_ROUTES } from '../routes';

const createApi = (baseUrl) => {
  const callApi = getCallApi(baseUrl);
  return {
    notifyServer(data) {
      return callApi({
        method: 'POST',
        url: REQUEST_ROUTES.notify,
        data,
      });
    },
  };
};

export default createApi;
