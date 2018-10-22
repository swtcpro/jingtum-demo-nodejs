/**
 * Created by DELL on 2018/9/21.
 */
export default {
  isPhoneNumber(phone) {
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return reg.test(phone);
  }
}
