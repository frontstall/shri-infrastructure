import { getAgentCallApi } from '../utils/callApi';
import { AGENT_ROUTES } from '../routes';

const createApi = (baseUrl) => {
  const callApi = getAgentCallApi(baseUrl);
  return {
    build(data) {
      callApi({
        method: 'POST',
        url: AGENT_ROUTES.string,
        data,
      });
    },
  };
};

export default createApi;
