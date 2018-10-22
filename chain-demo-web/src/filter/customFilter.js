/**
 * Created by wyb
 */
import moment from 'moment'
import Utils from '@/api/Utils'
/* 解析date日期对象 */
const formatDate = function (date, format) {
  return moment(date).format(format);
}
export default {
  Date(date, format) {
    if (!date) {
      return '';
    }
    return formatDate(date, format || 'YYYY-MM-DD HH:mm');
  },
  /* 对象数组输出指定字符串 */
  ObjListToStr(list, key, splitStr) {
    return Utils.getKeysFromList(list, key, splitStr);
  },
  CharacterLength: function (value,length) {
    if (value === null) {
      return value;
    }
    if (value.length > length) {
      return value.substr(0,length) + '...';
    } else {
      return value;
    }
  },
  GetMemosByKey(value, key) {
    let str = '';
    let arr = value.split('$^$^$');
    for (let i = 0; i < arr.length; i++) {
      let itemArr = arr[i].split('=');
      if (itemArr[0] === key) {
        str = itemArr[1];
        break;
      }
    }
    return str;
  }
}
