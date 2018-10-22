'use strict';

const Controller = require('egg').Controller;

class TransactionController extends Controller {
  /**
   * 数据上链
   * @return {Promise<void>}
   */
  async dataToChain() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const params = ctx.request.body;
    const transactionType = params.transactionType;
    const filePath = params.filePath;
    const fileHash = params.fileHash;
    const hashType = params.hashType;
    const dataType = params.dataType;
    const text = params.text;
    const phone = params.phone;
    const verifyCode = params.verifyCode;
    let flagData = await ctx.service.verificationCode.verifyCode(phone, verifyCode);
    if (!flagData.success) {
      ctx.helper.resHandlerError({}, flagData.message);
      return;
    }
    let memos = [];
    if (text) {
      memos.push(`text=${text}`);
    }
    let fileObj = {};
    if (dataType) {
      memos.push(`dataType=${dataType}`);
      fileObj.dataType = dataType;
    }
    if (hashType) {
      memos.push(`hashType=${hashType}`);
      fileObj.hashType = hashType;
    }
    if (filePath) {
      memos.push(`filePath=${filePath}`);
      fileObj.filePath = filePath;
    }
    if (fileHash) {
      memos.push(`fileHash=${fileHash}`);
      fileObj.fileHash = fileHash;
    }
    if (phone) {
      memos.push(`phone=${phone}`);
      fileObj.phone = phone;
    }
    let srcAddress = this.config.accountList.dataPublicAccount;
    let srcSecret = this.config.accountList.dataPublicSecret;
    let toAddress = this.config.accountList.dataPrivateAccount;
    let currencyValue = this.config.accountList.dataValue;
    const payInfo = await ctx.service.transaction.createTransaction(srcAddress, srcSecret, toAddress,
      currencyValue, transactionType, memos, fileObj);
    ctx.helper.resHandlerSuccess(payInfo, '请求成功');
  }

  /**
   * 获取上链列表数据（交易数据）
   * @return {Promise<void>}
   */
  async getTransactionList() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const query = ctx.request.query;
    const pageSize = Number(query.pageSize);
    const currentPage = Number(query.currentPage);
    const type = query.type;
    const data = {};
    let searchObj = {};
    searchObj.where = {transactionType: type};
    searchObj.where.deleteState = 0;
    searchObj.order = [];
    searchObj.order.push(['created_at', 'DESC']);
    searchObj.offset = pageSize * (currentPage - 1);
    searchObj.limit = pageSize;
    const result = await ctx.model.SysTransaction.findAndCountAll(searchObj);
    data.total = result.count;
    data.list = result.rows;
    data.pageSize = pageSize;
    data.currentPage = currentPage;
    data.totalPage = Math.ceil(result.count / pageSize);
    ctx.helper.resHandlerSuccess(data, '请求成功');
  }

  /**
   * 获取链上交易详情
   * @return {Promise<void>}
   */
  async getTransactionChainDetail() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const query = ctx.request.query;
    const clientId = query.clientId;
    const address = query.address;
    const payInfo = await ctx.model.SysTransaction.findOne({where: {clientId: clientId}});
    const result = await ctx.service.swtcApi.getPayments(address, payInfo.hash);
    let data = {};
    data.payInfo = payInfo;
    data.chainInfo = result;
    ctx.helper.resHandlerSuccess(data, '请求成功');
  }
}

module.exports = TransactionController;
