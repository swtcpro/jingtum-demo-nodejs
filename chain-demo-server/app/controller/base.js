'use strict';
/**
 * 基础接口
 */
const Controller = require('egg').Controller;
const Crypto = require('crypto');
const moment = require('moment');
const Base64 = require('js-base64').Base64;

class BaseController extends Controller {

  /**
   * 获取阿里云OSS配置
   * @returns {Promise<void>}
   */
  async getAliOssToken() {
    const ctx = this.ctx;
    const app = ctx.app;
    const ossConfig = this.config.oss;
    let policyText = {};
    policyText.conditions = [];
    policyText.conditions.push(["content-length-range", 0, 1048576000]); // 设置上传文件的大小限制
    policyText.conditions.push(["starts-with", "$key", 'test/']); // 防止用户通过policy上传到别人的目录
    // 设置失效时间
    policyText.expiration = moment().add(10, 'minutes').toISOString();
    let accessId = ossConfig.client.accessKeyId;
    let accessKey = ossConfig.client.accessKeySecret;
    let policyBase64 = Base64.encode(JSON.stringify(policyText));
    let signature = Crypto.createHmac('sha1', accessKey);
    signature = signature.update(new Buffer(policyBase64, 'utf8')).digest('base64');
    let data = {};
    data.accessId = accessId;
    data.signature = signature;
    data.policyBase64 = policyBase64;
    data.expiration = policyText.expiration;
    data.policyText = policyText;
    data.dir = 'test/';
    data.host = "http://" + ossConfig.client.bucket + "." + ossConfig.client.endpoint;
    ctx.helper.resHandlerSuccess(data, '请求成功');
  }

  /**
   * 发送短信验证码
   * @returns {Promise.<void>}
   */
  async sendSMSVerifyCOde() {
    const ctx = this.ctx;
    const app = ctx.app;
    let params = ctx.request.query;
    let phone = params.phone;
    let msgInfo = await ctx.service.verificationCode.create(phone);
    if (!msgInfo.success) {
      ctx.helper.resHandlerError({}, msgInfo.message);
      return;
    }
    let sendStatus = await ctx.service.verificationCode.sendVerifyCode(msgInfo.data.content, msgInfo.data.code);
    ctx.helper.resHandlerSuccess({}, '请求成功');
  }
}

module.exports = BaseController;
