// FE/utils/apiProxy.jsx
import axios from 'axios';

const apiProxy = new Proxy(
  {
    request: async (method, url, data = null, config = {}) => {
      if (method.toLowerCase() === 'get') {
        return axios.get(url, config);
      } else if (method.toLowerCase() === 'put') {
        return axios.put(url, data, config);
      } else if (method.toLowerCase() === 'post') {
        return axios.post(url, data, config);
      }
      throw new Error('Unsupported HTTP method');
    },
  },
  {
    get(target, prop) {
      if (prop === 'request') {
        return async function (method, url, data = null, config = {}) {
          if (!isAuthenticated()) {
            throw new Error('Người dùng chưa được xác thực!');
          }

          console.log(`Making ${method} request to ${url}`);

          try {
            const response = await target[prop](method, url, data, config);
            return response;
          } catch (error) {
            throw new Error(error.response?.data?.message || 'Đã có lỗi xảy ra!');
          }
        };
      }
      return target[prop];
    },
  }
);

function isAuthenticated() {
  // Đọc cookie từ document.cookie
  const cookies = document.cookie.split(';');
  const patientToken = cookies.find((cookie) =>
    cookie.trim().startsWith('patientToken=')
  );
  return !!patientToken;
}

export default apiProxy;