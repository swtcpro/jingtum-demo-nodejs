/**
 * 系统用户
 */
'use strict';
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const SysUser = app.model.define('SysUser', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: STRING,
      unique: true,
    },
    phoneNumber: {
      type: STRING,
      defaultValue: '',
    },
    address: {
      type: STRING,
      defaultValue: '',
    },
    secret: {
      type: STRING,
      defaultValue: '',
    },
    // 是否激活 0 没有激活 1 已激活
    isActivity: {
      type: INTEGER,
      defaultValue: 0,
    },
    password: {
      type: STRING,
      defaultValue: '',
    },
    realName: {
      type: STRING,
      defaultValue: '',
    },
    nickname: {
      type: STRING,
      defaultValue: '',
    },
    token: {
      type: STRING,
      defaultValue: '',
    },
    lastLoginTime: {
      type: DATE,
      get() {
        let str = this.getDataValue('lastLoginTime');
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
    updatedAt: 'lastLoginTime',
    tableName: 'sys_user',
  });
  return SysUser;
};
