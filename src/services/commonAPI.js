import axios from "axios";

const commonAPI = async (method, url, body = {}, headers = {}) => {
  const config = {
    method,
    url,
    data: body,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  return await axios(config);
};

export default commonAPI;