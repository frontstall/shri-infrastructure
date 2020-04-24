import axios from 'axios';

const getCallApi = (baseURL) => ({
  method,
  url,
  data,
  params,
// eslint-disable-next-line consistent-return
}) => {
  axios.defaults.baseURL = baseURL;

  return axios({
    method,
    url,
    data,
    params,
  });
};

export default getCallApi;
