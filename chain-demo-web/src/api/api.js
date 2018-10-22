import Ajax from './Ajax'
import apiConfig from '@/config/api'
import Qs from 'qs';
const baseUrl = apiConfig[apiConfig.RUN_ENV];

export default {
  user: {
    create(params) {
      return Ajax.post(`${baseUrl}/api/v1/user/create`, params)
    },
    getBalances(id) {
      let params = {id: id};
      return Ajax.get(`${baseUrl}/api/v1/user/balances`, params)
    },
    getUserList(params) {
      return Ajax.get(`${baseUrl}/api/v1/user/list`, params)
    },
    activityUser(id) {
      let params = {id: id};
      return Ajax.get(`${baseUrl}/api/v1/user/activity`, params)
    }
  },
  transaction: {
    dataToChain(params) {
      return Ajax.post(`${baseUrl}/api/v1/transaction/data`, params)
    },
    getTransactionList(params) {
      return Ajax.get(`${baseUrl}/api/v1/transaction/list`, params)
    },
    getTransactionChainDetail(params) {
      return Ajax.get(`${baseUrl}/api/v1/transaction/detail`, params)
    }
  },
  base: {
    getAliOssToken() {
      return Ajax.get(`${baseUrl}/api/v1/base/oss/token`)
    },
    sendSmsCode(phone) {
      let params = {};
      params.phone = phone;
      return Ajax.get(`${baseUrl}/api/v1/base/sms/code`, params)
    }
  }
}
