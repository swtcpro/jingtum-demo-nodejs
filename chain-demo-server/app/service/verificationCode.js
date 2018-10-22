/**
 * Created by DELL on 2018/8/29.
 */
const Service = require('egg').Service;
const Utils = require('../tools/Utils');
const Enum = require('../tools/Enum');
const SMSClient = require('@alicloud/sms-sdk');
const moment = require('moment');
let smsClient = null;
class VerificationCodeService extends Service {
  /**
   * 生成验证码
   * @param info
   * @returns {Promise.<{info: *}>}
   */
  async create(content) {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    let configVerificationCode = this.config.verificationCode;
    let code = Utils.createRandomStr(4);
    // 查询用户
    const result  = await ctx.model.SysVerificationCode.findOne({
      where: {content: content}
    });
    let msgInfo = {};
    if (result) {
      // 判断当天
      if (moment(result.riseTime).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        if (result.dayCount >= result.dayMax) {
          // 达到最大次数
          msgInfo.message = `今天短信验证码已超最大${result.dayMax}次限制！`;
          msgInfo.success = false;
          return msgInfo;
        } else {
          let updated = await ctx.model.SysVerificationCode.update({
            code: code,
            status: 1,
            riseTime: moment().toDate(),
            validTime: moment().add(configVerificationCode.validTime, 'seconds').toDate(),
            count: ++result.count,
            dayCount: ++result.dayCount
          }, {
            where: {id: result.id}
          });
          msgInfo.message = `生成成功`;
          msgInfo.success = true;
          msgInfo.data = await ctx.model.SysVerificationCode.findOne({
            where: {content: content}
          });
          return msgInfo;
        }
      } else {
        let updated = await ctx.model.SysVerificationCode.update({
          code: code,
          status: 1,
          riseTime: moment().toDate(),
          validTime: moment().add(configVerificationCode.validTime, 'seconds').toDate(),
          count: ++result.count,
          dayCount: 1
        }, {
          where: {id: result.id}
        });
        msgInfo.message = `生成成功`;
        msgInfo.success = true;
        msgInfo.data = await ctx.model.SysVerificationCode.findOne({
          where: {content: content}
        });
        return msgInfo;
      }
    } else {
      let codeInfo = {};
      codeInfo.content = content;
      codeInfo.code = code;
      codeInfo.status = 1;
      codeInfo.riseTime = moment().toDate();
      codeInfo.validTime = moment().add(configVerificationCode.validTime, 'seconds').toDate();
      codeInfo.count = 1;
      codeInfo.dayCount = 1;
      codeInfo.dayMax = configVerificationCode.dayMax;
      const codeData = await ctx.model.SysVerificationCode.create(codeInfo);
      msgInfo.message = `生成成功`;
      msgInfo.success = true;
      msgInfo.data = codeData;
      return msgInfo;
    }
  }

  /**
   * 校验验证码
   * @param content
   * @param code
   * @returns data
   */
  async verifyCode(content, code) {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    const result  = await ctx.model.SysVerificationCode.findOne({
      where: {content: content}
    });
    let data = {};
    console.log(result.validTime)
    if (!result) {
      data.message = '验证码不正确！';
      data.success = false;
      return  data;
    } else if (code !== result.code) {
      data.message = '验证码不正确！';
      data.success = false;
      return  data;
    } else if (result.status === 0) {
      data.message = '验证码不正确！';
      data.success = false;
      return  data;
    } else if (moment().toDate().getTime() > moment(result.validTime).toDate().getTime()) {
      data.message = '验证码已过期！';
      data.success = false;
      return  data;
    } else {
      data.message = '验证成功';
      data.success = true;
      await ctx.model.SysVerificationCode.update({
        status: 0
      }, {
        where: {content: content}
      });
      return  data;
    }
  }

  /**
   * 发送短信
   * @param option
   * @returns {Promise.<void>}
   */
  async sendSMS(option) {
    if (smsClient === null) {
      let configVerificationCode = this.config.verificationCode;
      const accessKeyId = configVerificationCode.accessKeyId;
      const secretAccessKey = configVerificationCode.secretAccessKey;
      smsClient = new SMSClient({accessKeyId, secretAccessKey});
    }
    const promise = new Promise(function(resolve, reject) {
      smsClient.sendSMS(option).then(function (res) {
        let {Code} = res;
        if (Code === 'OK') {
          resolve(Code);
        } else {
          reject(Code);
        }
      }, function (err) {
        reject(err);
      });
    });
    return promise;
  }

  /**
   * 发送短信验证码
   * @returns data
   */
  async sendVerifyCode(phoneNumber, code) {
    const ctx = this.ctx;
    const app = ctx.app;
    const {Op} = app.Sequelize;
    const sequelize = app.Sequelize;
    let configVerificationCode = this.config.verificationCode;
    let option = {};
    let templateParam = {code: code};
    option.PhoneNumbers = phoneNumber;
    option.SignName = configVerificationCode.SignName;
    option.TemplateCode = 'SMS_145594345';
    option.TemplateParam = JSON.stringify(templateParam);
    let sendStatus = await ctx.service.verificationCode.sendSMS(option);
    return sendStatus;
  }
}

module.exports = VerificationCodeService;