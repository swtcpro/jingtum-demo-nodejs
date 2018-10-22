<!--短信验证码对话框-->
<template>
  <x-dialog title="短信验证" v-model="dialogVisible" width="400px" class="cms-code-dialog">
    <div style="text-align: center;line-height: 1rem;">短信验证</div>
    <x-input placeholder="请输入手机号" type="tel" title="手机号" v-model="phoneNumber" :max="20"></x-input>
    <x-input placeholder="请输入验证码" title="验证码" v-model="verifyCode" :max="8" style="margin-top: 15px;">
      <x-button slot="right" mini @click.native="getVerifyCode" style="width: 8em;" :type="codeTimer ? 'default' : 'primary'">
        <span v-if="codeTimer">{{countDown}}秒</span>
        <span v-else>获取验证码</span>
      </x-button>

    </x-input>
    <group>
      <flexbox :gutter="0">
        <flexbox-item>
          <div class="btn-cancel" @click="dialogVisible = false">取 消</div>
        </flexbox-item>
        <flexbox-item>
          <div class="btn-ok" @click="handleSubmit()">确 定</div>
        </flexbox-item>
      </flexbox>
    </group>
  </x-dialog>
</template>
<script>
  import Api from '@/api/api'
  import VerifyUtil from '@/api/VerifyUtil'
  import { XDialog,XInput,XButton,Group,Flexbox,FlexboxItem } from 'vux'
  export default {
    name: 'SmsCodeDialog',
    components: {
      XDialog,
      XInput,
      XButton,
      Group,
      Flexbox,
      FlexboxItem
    },
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
          _self.$vux.toast.text('请输入正确的手机号');
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
            _self.$vux.toast.text('短信发送成功!');
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
          _self.$vux.toast.text('请输入正确的手机号!');
          return;
        }
        if (!_self.verifyCode) {
          _self.$vux.toast.text('请输入验证码!');
          return;
        }
        data.phoneNumber = _self.phoneNumber;
        data.verifyCode = _self.verifyCode;
        _self.submitFun && _self.submitFun(data);
      }
    }
  }
</script>
<style lang='less'>
  .cms-code-dialog{
    .btn-cancel{
      text-align: center;
      line-height: 1rem;
      border-right: 1px solid #cccccc;
    }
    .btn-ok{
      text-align: center;
      line-height: 1rem;
      color: #0f88eb;
    }
  }
</style>
