/**
 * 系统验证码
 */
'use strict';
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const SysVerificationCode = app.model.define('SysVerificationCode', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: STRING,
      primaryKey: true
    },
    code: {
      type: STRING,
      defaultValue: '',
    },
    validTime: {
      type: DATE,
      get() {
        let str = this.getDataValue('validTime');
        if (str) {
          str = moment(str).format('YYYY-MM-DD HH:mm:ss');
        }
        return str;
      }
    },
    // 验证码状态 0 失效 1 有效
    status: {
      type: INTEGER,
      defaultValue: 0,
    },
    count: {
      type: INTEGER,
      defaultValue: 0,
    },
    riseTime: {
      type: DATE,
      get() {
        let str = this.getDataValue('riseTime');
        if (str) {
          str = moment(str).format('YYYY-MM-DD HH:mm:ss');
        }
        return str;
      }
    },
    dayCount: {
      type: INTEGER,
      defaultValue: 0,
    },
    dayMax: {
      type: INTEGER,
      defaultValue: 5,
    },
    updated_at: {
      type: DATE,
      get() {
        let str = this.getDataValue('updated_at');
        if (str) {
          str = moment(str).format('YYYY-MM-DD HH:mm:ss');
        }
        return str;
      },
    },
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    timestamps: true,
    tableName: 'sys_verification_code',
  });
  return SysVerificationCode;
};
