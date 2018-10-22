'use strict';

/**
 * 路由设置
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const apiVersions = 'v1';
  const apiName = 'api';
  const vtoken = app.middleware.vtoken();

  router.get('/', controller.home.index);
  router.post(`/${apiName}/${apiVersions}/user/create`, controller.user.createUser);
  router.get(`/${apiName}/${apiVersions}/user/balances`, controller.user.getAccountBalances);
  router.get(`/${apiName}/${apiVersions}/user/list`, controller.user.getUserList);
  router.get(`/${apiName}/${apiVersions}/user/activity`, controller.user.activateUserWallet);

  router.post(`/${apiName}/${apiVersions}/transaction/data`, controller.transaction.dataToChain);
  router.get(`/${apiName}/${apiVersions}/transaction/list`, controller.transaction.getTransactionList);
  router.get(`/${apiName}/${apiVersions}/transaction/detail`, controller.transaction.getTransactionChainDetail);

  router.get(`/${apiName}/${apiVersions}/base/oss/token`, controller.base.getAliOssToken);
  router.get(`/${apiName}/${apiVersions}/base/sms/code`, controller.base.sendSMSVerifyCOde);

};
