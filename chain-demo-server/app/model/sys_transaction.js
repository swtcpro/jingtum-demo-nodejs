/**
 * 支付交易实体
 */
'use strict';
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE, DOUBLE } = app.Sequelize;

  const SysTransaction = app.model.define('SysTransaction', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: STRING,
      unique: true,
    },
    payAddress: {
      type: STRING,
      defaultValue: '',
    },
    toAddress: {
      type: STRING,
      defaultValue: '',
    },
    currency: {
      type: STRING,
      defaultValue: '',
    },
    // 货币发行方
    issuer: {
      type: STRING,
      defaultValue: '',
    },
    currencyValue: {
      type: DOUBLE,
      defaultValue: 0,
    },
    // 交易类型 0 普通转账 1 激活钱包 2 文本上链 3 图片上链 4 音视频上链
    transactionType: {
      type: INTEGER,
      defaultValue: 0,
    },
    memos: {
      type: STRING,
      defaultValue: '',
    },
    payTime: {
      type: DATE,
      get() {
        let str = this.getDataValue('payTime');
        if (str) {
          str = moment(str).format('YYYY-MM-DD HH:mm:ss');
        }
        return str;
      },
    },
    hash: {
      type: STRING,
      defaultValue: '',
    },
    // 支付状态 0 未支付 1 支付成功 2 支付失败
    status: {
      type: INTEGER,
      defaultValue: 0,
    },
    // 删除状态 0 未删除 1 已删除
    deleteState: {
      type: INTEGER,
      defaultValue: 0,
    },
    // 手续费
    fee: {
      type: DOUBLE,
      defaultValue: 0,
    },
    // 文件类型
    dataType: {
      type: STRING,
      defaultValue: '',
    },
    // hash类型
    hashType: {
      type: STRING,
      defaultValue: '',
    },
    // 文件hash
    fileHash: {
      type: STRING,
      defaultValue: '',
    },
    // 文件路径
    filePath: {
      type: STRING,
      defaultValue: '',
    },
    created_at: {
      type: DATE,
      get() {
        let str = this.getDataValue('created_at');
        if (str) {
          str = moment(str).format('YYYY-MM-DD HH:mm:ss');
        }
        return str;
      },
    },
  }, {
    timestamps: true,
    tableName: 'sys_transaction',
  });
  return SysTransaction;
};
