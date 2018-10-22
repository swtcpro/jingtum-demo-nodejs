/**
 * 工具类
 */
const Utils = {
  /**
   * 生成随机数字字符串
   * @param n
   * @returns {Promise<string>}
   */
  createRandomStr(n) {
    let rnd = "";
    let arr_number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < n; i++) {
      let id = Math.floor(Math.random() * 10);
      if (i === 0 && id === 0) id = 1;
      rnd += arr_number[id];
    }
    return rnd;
  }
}
module.exports = Utils;