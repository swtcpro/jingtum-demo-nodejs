'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   * 创建用户（钱包）
   * @return {Promise<void>}
   */
  async createUser() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const params = ctx.request.body;
    const createRule = {
      phoneNumber: 'phone'
    }
    ctx.validate(createRule, params);
    const result  = await ctx.model.SysUser.findOne({
      where: {phoneNumber: params.phoneNumber}
    });
    if (result) {
      ctx.helper.resHandlerError({}, '该手机号已经注册');
    } else {
      const wallet = await ctx.service.swtcApi.createWallet();
      const userInfo = await ctx.model.SysUser.create({
        phoneNumber: params.phoneNumber,
        address: wallet.address,
        secret: wallet.secret
      });
      ctx.helper.resHandlerSuccess(userInfo, '注册成功');
    }
  }

  /**
   * 获取账户余额
   * @return {Promise<void>}
   */
  async getAccountBalances() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const swtc = this.config.swtc;
    const id = ctx.request.query.id;
    const userInfo = await ctx.model.SysUser.findOne({where: {id: id}});
    try {
      const result = await ctx.service.swtcApi.getAccountBalances(userInfo.address, swtc.currency, '');
      ctx.helper.resHandlerSuccess(result.balances, '请求成功');
    } catch (e) {
      if (e.status_code === '3000') {
        ctx.helper.resHandlerError(e, '钱包未激活');
      } else {
        ctx.helper.resHandlerError(e, '请求失败');
      }
    }
  }

  /**
   * 获取用户列表
   * @returns {Promise.<void>}
   */
  async getUserList() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const query = ctx.request.query;
    let currentPage = query.currentPage;
    currentPage = Number(currentPage);
    let pageSize = query.pageSize;
    const createRule = {
      currentPage: 'number',
      pageSize: 'number'
    }
    pageSize = Number(pageSize);
    ctx.validate(createRule, {currentPage: currentPage, pageSize: pageSize});
    let searchObj = {};
    searchObj.attributes = [[sequelize.fn('COUNT', sequelize.col('id')), 'total']];
    searchObj.order = [];
    searchObj.order.push(['created_at', 'DESC']);
    const totalRes = await ctx.model.SysUser.find(searchObj);
    const total = totalRes.dataValues.total;
    delete searchObj.attributes;
    searchObj.offset = (currentPage - 1) * pageSize;
    searchObj.limit = pageSize;
    const list = await ctx.model.SysUser.findAll(searchObj);
    let data = {};
    data.total = total;
    data.pageSize = pageSize;
    data.totalPage = Math.ceil(total / pageSize);
    data.currentPage = currentPage;
    data.list = list;
    ctx.helper.resHandlerSuccess(data, '请求成功');
  }

  /**
   * 激活用户钱包
   * @returns {Promise.<void>}
   */
  async activateUserWallet() {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const id = ctx.request.query.id;
    const userInfo = await ctx.model.SysUser.findOne({
      where: {id: id}
    });
    if (userInfo.isActivity === 1) {
      ctx.helper.resHandlerError(null, '钱包已激活,请不要重复激活!');
    } else {
      const payInfo = await ctx.service.user.activiteUser(id);
      ctx.helper.resHandlerSuccess(payInfo, '激活成功');
    }
  }
}

module.exports = UserController;
