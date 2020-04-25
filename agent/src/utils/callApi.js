import axios from 'axios';

const getCallApi = (baseURL) => ({
  method,
  url,
  data,
}) => {
  axios.defaults.baseURL = baseURL;

  return axios({
    method,
    url,
    data,
  });
};

export default getCallApi;
