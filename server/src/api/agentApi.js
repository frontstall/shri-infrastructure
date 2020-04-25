import { getAgentCallApi } from '../utils/callApi';
import { AGENT_ROUTES } from '../routes';

const createApi = (baseUrl) => {
  const callApi = getAgentCallApi(baseUrl);
  return {
    build(data) {
      console.log('===============>', data);
      return callApi({
        method: 'POST',
        url: AGENT_ROUTES.build,
        data,
      });
    },
  };
};

export default createApi;
