/**
 * Created by DELL on 2018/8/29.
 */
const Service = require('egg').Service;
const Utils = require('../tools/Utils');
const moment = require('moment');
class TransactionService extends Service {
  /**
   * 发起swtc支付交易
   * @returns {Promise.<void>}
   */
  async createTransaction(source_address, secret, destination, value, transactionType, memos, fileObj) {
    const ctx = this.ctx;
    const swtc = this.config.swtc;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const client_id = 'jt_zs_' + transactionType + new Date().getTime() + Utils.createRandomStr(4);
    let payment = {};
    payment.source = source_address;
    payment.destination = destination;
    payment.amount = {
      value: String(value),
      currency: swtc.currency,
      issuer: ''
    };
    let createInfo = {};
    createInfo.clientId = client_id;
    createInfo.payAddress = source_address;
    createInfo.toAddress = destination;
    createInfo.currency = payment.amount.currency;
    createInfo.issuer = payment.amount.issuer;
    createInfo.currencyValue = payment.amount.value;
    createInfo.transactionType = transactionType;
    if (memos.length) {
      payment.memos = memos;
      createInfo.memos = memos.join('$^$^$');
    }
    if (fileObj) {
      if (fileObj.filePath) {
        createInfo.filePath = fileObj.filePath;
      }
      if (fileObj.dataType) {
        createInfo.dataType = fileObj.dataType;
      }
      if (fileObj.fileHash) {
        createInfo.fileHash = fileObj.fileHash;
      }
      if (fileObj.hashType) {
        createInfo.hashType = fileObj.hashType;
      }
    }

    const transactionInfo = await ctx.model.SysTransaction.create(createInfo);
    const payInfo = await ctx.service.swtcApi.submitPayments(source_address, secret, client_id, payment);
    const result = await ctx.model.SysTransaction.update({
      hash: payInfo.hash,
      fee: payInfo.fee,
      status: 1,
      payTime: moment().format('YYYY-MM-DD HH:mm:ss')
    }, {where: {id: transactionInfo.id}});
    const resultInfo = await ctx.model.SysTransaction.findOne({where: {id: transactionInfo.id}});
    return resultInfo;
  }
}

module.exports = TransactionService;