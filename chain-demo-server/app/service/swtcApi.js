'use strict';
/**
 * swtc 公链接口
 * Created by DELL on 2018/8/27.
 */
const Service = require('egg').Service;
const request = require('request');
const Qs = require('qs');
class SwtcApiService extends Service {
  /**
   * 1.1 创建一个钱包账户
   * @return {Promise.<void>}
   */
  async createWallet() {
    const url = `${this.config.swtc.baseUrl}/v2/wallet/new`;
    const promise = new Promise(function(resolve, reject) {
      request(url, (error, res, body) => {
        if (error) {
          reject(error, res, body);
        } else {
          const data = JSON.parse(body);
          if (data.success) {
            resolve(data.wallet);
          } else {
            reject(error, res, data);
          }
        }
      });
    });
    return promise;
  }


  /**
   * 1.2 获取账户余额
   * @param {String} address 井通钱包地址
   * @param {String=} currency 指定返回对应货币的余额
   * @param {String=} issuer 指定返回对应银关发行的货币
   * @return {Promise.<void>}
   */
  async getAccountBalances(address, currency, issuer) {
    const query = { currency, issuer };
    const queryStr = Qs.stringify(query);
    const url = `${this.config.swtc.baseUrl}/v2/accounts/${address}/balances?${queryStr}`;
    const promise = new Promise(function(resolve, reject) {
      request(url, (error, res, body) => {
        if (error) {
          reject(error, res, body);
        } else {
          const data = JSON.parse(body);
          if (data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        }
      });
    });
    return promise;
  }

  /**
   * 2.2 提交支付请求
   * @param {String} source_address  支付方的井通地址
   * @param {String} secret 支付方的钱包私钥
   * @param {String} client_id 此次请求的交易单号，交易单需要唯一
   * @param {Object} payment 支付对象
   * @param {String} payment.source 发起账号
   * @param {String} payment.destination 目标账号
   * @param {Object} payment.amount 支付金额
   * @param {String} payment.choice 支付选择的key，可选
   * @param {Array} payment.memos 支付的备注，String数组，可选
   * @return {Promise.<void>}
   */
  async submitPayments(source_address, secret, client_id, payment) {
    const ctx = this.ctx;
    const url = `${this.config.swtc.baseUrl}/v2/accounts/${source_address}/payments`;
    let params = {};
    params.secret = secret;
    params.client_id = client_id;
    params.payment = payment;
    const promise = new Promise(function(resolve, reject) {
      let options = {
        method: 'POST',
        url: url,
        headers: {'Connection': 'close'},
        json: true,
        body: params
      };
      request(options, (error, res, body) => {
        if (error) {
          reject(error, res, body);
        } else {
          params.secret = 'secret';
          ctx.logger.info('swtc transaction data: %j', JSON.stringify(params));
          const data = body;
          if (data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        }
      });
    });
    return promise;
  }

  /**
   * 2.3 获得支付信息
   * @param {String} address 支付用户的井通地址
   * @param {String} id 支付交易的hash或资源号
   * @return {Promise.<void>}
   */
  async getPayments(address, id) {
    const url = `${this.config.swtc.baseUrl}/v2/accounts/${address}/payments/${id}`;
    const promise = new Promise(function(resolve, reject) {
      let options = {
        method: 'GET',
        url: url,
        headers: {'Connection': 'close'},
        json: true
      };
      request(options, (error, res, body) => {
        if (error) {
          reject(error, res, body);
        } else {
          const data = body;
          if (data.success) {
            resolve(data);
          } else {
            reject(error, res, data);
          }
        }
      });
    });
    return promise;
  }

  /**
   * 4.1 查询交易信息
   * @param {String} address 井通钱包地址
   * @param {String} id 交易资源号或者交易hash
   * @return {Promise<void>}
   */
  async getTransactionsInfo(address, id) {
    const url = `${this.config.swtc.baseUrl}/v2/accounts/${address}/transactions/${id}`;
    const promise = new Promise(function(resolve, reject) {
      let options = {
        method: 'GET',
        url: url,
        headers: {'Connection': 'close'},
        json: true
      };
      request(options, (error, res, body) => {
        if (error) {
          reject(error, res, body);
        } else {
          const data = body;
          if (data.success) {
            resolve(data);
          } else {
            reject(error, res, data);
          }
        }
      });
    });
    return promise;
  }

}

module.exports = SwtcApiService;
