import axios from 'axios';
/**
 * 创建默认请求配置
 * */
const createConfig = () => {
  let config = {
    // 请求方法同上
    method: 'get', // default
    // 基础url前缀
    baseURL: '',

    transformRequest: [
      function (data) {
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
        // data = Qs.stringify(data);
        data = JSON.stringify(data);
        return data;
      }],

    transformResponse: [
      function (data) {
        // 这里提前处理返回的数据
        return data;
      }
    ],
    // 请求头信息
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },

    // parameter参数
    params: {
    },

    // post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
    data: {
    },

    // 设置超时时间
    timeout: 25000,
    // 返回数据类型
    responseType: 'json' // default
  }
  return config;
}

/**
 * 自定义请求
 * @param conf
 * @returns {Promise.<TResult>|*}
 */
const customRequest = (conf) => {
  return axios.request(conf).then(res => {
    return res;
  }).catch(error => {
    return error;
  });
}

const Ajax = {
  get(url, params) {
    let config = createConfig();
    config.method = 'get';
    config.url = url;
    config.params = params || {};
    return customRequest(config)
  },
  post(url, params) {
    let config = createConfig();
    config.method = 'post';
    config.url = url;
    config.data = params || {};
    return customRequest(config)
  },
  delete(url, params) {
    let config = createConfig();
    config.method = 'delete';
    config.url = url;
    config.params = params || {};
    return customRequest(config)
  },
  put(url, params) {
    let config = createConfig();
    config.method = 'get';
    config.url = url;
    config.data = params || {};
    return customRequest(config)
  }
}
export default Ajax;
