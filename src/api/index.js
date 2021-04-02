import axios from "axios"; // 引入axios
import QS from "qs"; // 引入qs模块，用来序列化post类型的数据，后面会提到

axios.defaults.timeout = 30000;
// axios.defaults.headers = headers
// 请求的url
let urls = "";
let paramsInfo = "";
//http request 请求拦截器
axios.interceptors.request.use(
  config => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    config.headers = headers;
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);
// 响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    return Promise.resolve(errorObj);
  }
);

// get方法， 对应get请求 param {
//  String
// }
// url[请求的url地址] *
// param {
//    Object
//  }
// params[请求时携带的参数]
export function get(url, params, login = false) {
  // 防止并发
  if (urls == url && paramsInfo == JSON.stringify(params)) {
    return;
  }
  checkLogin = login;
  urls = url;
  paramsInfo = JSON.stringify(params);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params, login = false) {
  checkLogin = login;
  // 防止并发
  if (urls == url && paramsInfo == JSON.stringify(params)) {
    return;
  }
  urls = url;
  paramsInfo = JSON.stringify(params);
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}