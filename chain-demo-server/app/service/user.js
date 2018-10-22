/**
 * Created by DELL on 2018/8/29.
 */
const Service = require('egg').Service;
const Utils = require('../tools/Utils');
const Enum = require('../tools/Enum');
class UserService extends Service {
  /**
   * 创建用户
   * @param info
   * @returns {Promise.<{info: *}>}
   */
  async create(info) {
  }

  /**
   * 激活用户钱包
   * @returns {Promise.<void>}
   */
  async activiteUser(id) {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const userInfo = await ctx.model.SysUser.findOne({
      where: {id: id}
    });
    const srcAddress = this.config.accountList.activateAccount;
    const srcSecret = this.config.accountList.activateSecret;
    const payInfo = await ctx.service.transaction.createTransaction(srcAddress, srcSecret, userInfo.address,
      this.config.swtc.activityValue, Enum.TRANSACTION_TYPE.ACTIVITY, ['激活钱包']);
    const result = await ctx.model.SysUser.update({isActivity: 1}, {
      where: {id: id}
    });
    return payInfo;
  }
}

module.exports = UserService;