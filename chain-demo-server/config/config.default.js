'use strict';

module.exports = appInfo => {
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '';

  // add your config here
  config.middleware = [];

  config.cluster = {
    listen: {
      port: 7001
    }
  };

  config.sequelize = {
    dialect: 'mysql',
    database: '',
    host: '',
    port: '3306',
    username: '',
    password: '',
    pool: {
      max: 10,
      min: 3,
      acquire: 30000,
      idle: 10000,
    },
  };

  config.security = {
    // domainWhiteList: [ 'http://localhost:9021' ],
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  config.jwt = {
    secret: '',
    maxAge: 3600, // 1000, "2 days", "10h", "7d"
  };

  // swtc 公链请求地址
  config.swtc = {
    baseUrl: 'https://tapi.jingtum.com',
    host: 'tapi.jingtum.com',
    port: '80',
    protocol: 'https://',
    wssPort: '5443',
    currency: 'SWT',
    activityValue: 35
  };

  // 系统账户列表
  config.accountList = {
    // 激活账户
    activateAccount: '',
    activateSecret: '',
    // 数据上链对公账户
    dataPublicAccount: '',
    dataPublicSecret: '',
    // 数据上链对私账户
    dataPrivateAccount: '',
    dataPrivateSecret: '',
    // 数据上链支付金额
    dataValue: 0.01,
  };

  // oss配置
  config.oss = {
    client: {
      sts: true,
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      endpoint: ''
    }
  };

  // 验证码配置
  config.verificationCode = {
    validTime: 60 * 10, // 有效时间 单位：秒
    dayMax: 5,
    SignName: '',
    accessKeyId: '',
    secretAccessKey: ''
  };

  return config;
};
