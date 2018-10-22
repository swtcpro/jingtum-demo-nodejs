/**
 * 校验token中间件
 * Created by DELL on 2018/6/13.
 */
'use strict';
module.exports = options => {
  return async function(ctx, next) {
    const token = ctx.request.header.authorization.split(' ')[1];
    const app = ctx.app;
    let decoded;
    try {
      decoded = app.jwt.verify(token, app.config.jwt.secret);
    } catch (err) {
      ctx.body = {
        message: 'token 无效',
        success: false,
        errors: err,
        code: -2,
        status: 401,
      };
      ctx.status = 401;
      return;
    }
    await next();
  };
};
