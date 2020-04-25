import axios from 'axios';
import https from 'https';

export const getStorageCallApi = (baseURL, apiToken) => ({
  method,
  url,
  data,
  params,
}) => {
  axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

  const request = { method, url };

  if (data) {
    Object.assign(request, { data });
  }

  if (params) {
    Object.assign(request, { params });
  }

  return axios(request);
};

export const getAgentCallApi = (baseURL) => ({
  method,
  url,
  data,
  params,
}) => {
  axios.defaults.baseURL = baseURL;

  const request = { method, url };

  if (data) {
    Object.assign(request, { data });
  }

  if (params) {
    Object.assign(request, { params });
  }

  return axios(request);
};
