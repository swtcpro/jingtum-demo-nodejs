/**
 * Created by wyb
 */
import allConfig from '@/config/api'
import moment from 'moment'
export default{
  /* 去重添加数据 */
  addDataItem(obj, dataList, key) {
    let flag = true;
    for (let i = 0; i < dataList.length; i++) {
      let a = obj;
      let b = dataList[i];
      if (key) {
        a = obj[key];
        b = dataList[i][key];
      }
      if (a === b) {
        flag = false;
        break;
      }
    }
    if (flag) {
      dataList.push(obj);
    }
    return flag;
  },
  /* 数组转对象 */
  arrayToObj(list, key) {
    let obj = {};
    for (let i = 0; i < list.length; i++) {
      obj[list[i][key]] = list[i];
    }
    return obj;
  },
  /* 对象数组转化为多选列表options */
  arrayToCheckListOptions (list, labelKey) {
    let options = [];
    for (let i = 0; i < list.length; i++) {
      let obj = {};
      obj.label = list[i][labelKey];
      obj.value = list[i];
      options.push(obj);
    }
    return options;
  },
  /* 获取对象集合的某个字段的集合(可指定分隔符) */
  getKeysFromList (list, key, splitStr) {
    let keys = [];
    for (let i = 0; i < list.length; i++) {
      keys.push(list[i][key]);
    }
    splitStr = splitStr || ',';
    let keysStr = keys.join(splitStr);
    return keysStr;
  },
  /* 获取对象集合的某个字段的集合()数组 */
  getKeyArrFromList (list, key) {
    let keys = [];
    for (let i = 0; i < list.length; i++) {
      keys.push(list[i][key]);
    }
    return keys;
  },
  // 加法函数
  accAdd (arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error('The parameters must be Numbers：' + arg1 + ',' + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let r1,r2,m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10,Math.max(r1,r2));
    return ((Math.round(arg1 * m) + Math.round(arg2 * m)) / m);
  },
  // 减法函数
  Subtr (arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error('The parameters must be Numbers：' + arg1 + ',' + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let r1,r2,m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10,Math.max(r1,r2));
    return ((Math.round(arg1 * m) - Math.round(arg2 * m)) / m);
  },

  // 乘法函数
  accMul (arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error('The parameters must be Numbers：' + arg1 + ',' + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) {}
    try { m += s2.split(".")[1].length } catch (e) {}
    return (Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10,m));
  },

  // 除法函数
  accDiv (arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error('The parameters must be Numbers：' + arg1 + ',' + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let t1,t2,m;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) { t1 = 0 }
    try { t2 = arg2.toString().split(".")[1].length } catch (e) { t2 = 0 }
    m = Math.pow(10,Math.max(t1, t2));
    return Math.round(arg1 * m) / Math.round(arg2 * m);
  },
  // 是否是pc中打开
  isPcBrowser () {
    const userAgentInfo = navigator.userAgent;
    const Agents = ['Android', 'android' , 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod', 'mobile'];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  },
  /**
   * 生成文件名称
   * @param type
   * @param srcName
   */
  createFilename(srcName, type) {
    let num = moment().format('YYYYMMDDHHmmssSSS');
    let suffix = srcName.substring(srcName.lastIndexOf('.'));
    type = type || '';
    type = type.replace('/', '_');
    let filename = `chain-${type}-${num}${suffix}`;
    return filename;
  }
}
