/**
 * Created by DELL on 2018/6/7.
 */
'use strict';
module.exports = {
  // 处理成功响应
  resHandlerSuccess(data, message = '请求成功', code = 0) {
    const { ctx } = this;
    ctx.body = {
      success: true,
      code,
      data,
      message,
    };
    ctx.status = 200;
  },
  // 处理错误响应
  resHandlerError(data, message = '请求失败', code = -1) {
    const { ctx } = this;
    ctx.body = {
      success: false,
      code,
      data,
      message,
      status: 500,
    };
    ctx.status = 500;
  },
};
