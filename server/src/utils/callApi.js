import axios from 'axios';
import https from 'https';

const getCallApi = (baseURL, apiToken) => ({
  method,
  url,
  data = {},
  params = {},
// eslint-disable-next-line consistent-return
}) => {
  axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

  return axios({
    method,
    url,
    data,
    params,
  });
};

export default getCallApi;
