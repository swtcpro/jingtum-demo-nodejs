<!--短信验证码对话框-->
<template>
  <el-dialog title="短信验证" :visible.sync="dialogVisible" width="400px"
             :close-on-click-modal="false" :close-on-press-escape="false">
    <el-input placeholder="请输入手机号"  v-model="phoneNumber" :maxlength="20"></el-input>
    <el-input placeholder="请输入验证码" clearable v-model="verifyCode" :maxlength="8" style="margin-top: 15px;">
      <el-button slot="append" style="width: 100px;">
        <span v-if="codeTimer">{{countDown}}秒</span>
        <span v-else @click="getVerifyCode">获取验证码</span>
      </el-button>
    </el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import Api from '@/api/api'
  import VerifyUtil from '@/api/VerifyUtil'
  export default {
    name: 'SmsCodeDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      submitFun: {
        type: Function
      }
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) {
          this.phoneNumber = '';
        }
      },
      dialogVisible(val) {
        this.$emit('update:visible', val);
      }
    },
    data() {
      return {
        phoneNumber: '',
        dialogVisible: false,
        verifyCode: '',
        codeTimer: null,
        countMax: 60,
        countDown: 0
      }
    },
    methods: {
      // 获取验证码
      getVerifyCode() {
        let _self = this;
        if (_self.codeTimer) {
          return;
        }
        if (!VerifyUtil.isPhoneNumber(_self.phoneNumber)) {
          _self.$alert('请输入正确的手机号！');
          return;
        }
        _self.countDown = _self.countMax;
        _self.codeTimer = setInterval(function () {
          _self.countDown--;
          if (_self.countDown <= 0) {
            clearInterval(_self.codeTimer);
            _self.codeTimer = null;
          }
        }, 1000);
        Api.base.sendSmsCode(_self.phoneNumber).then(function (data) {
          if (data.success) {
            _self.$message({message: '短信发送成功', type: 'success'});
          } else {
            clearInterval(_self.codeTimer);
            _self.codeTimer = null;
          }
        });
      },
      handleSubmit() {
        let _self = this;
        let data = {};
        if (!VerifyUtil.isPhoneNumber(_self.phoneNumber)) {
          _self.$alert('请输入正确的手机号！');
          return;
        }
        if (!_self.verifyCode) {
          _self.$alert('请输入验证码！');
          return;
        }
        data.phoneNumber = _self.phoneNumber;
        data.verifyCode = _self.verifyCode;
        _self.submitFun && _self.submitFun(data);
      }
    }
  }
</script>
