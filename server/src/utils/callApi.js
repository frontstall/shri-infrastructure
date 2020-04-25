import axios from 'axios';
import https from 'https';

export const getStorageCallApi = (baseURL, apiToken) => ({
  method,
  url,
  data = {},
  params = {},
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

export const getAgentCallApi = (baseURL) => ({
  method,
  url,
  data = {},
  params = {},
}) => {
  axios.defaults.baseURL = baseURL;

  return axios({
    method,
    url,
    data,
    params,
  });
};
