/**
 * Created by DELL on 2018/8/29.
 */
module.exports = app => {
  app.validator.addRule('phone', (rule, value) => {
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(value)) {
      return 'not valid phone';
    }
  });
}