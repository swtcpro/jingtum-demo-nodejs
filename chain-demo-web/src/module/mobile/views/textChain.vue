<template>
  <div class="page-text-chain">
    <section class="main-header">
      <h3 class="title">文本上链温馨提示</h3>
      <div class="desc">
        1. Demo演示了把文本框中输入的数据上传到区块链中，同时保存相关数据到本地业务系统的数据库中。
        <br>
        2. 从上传数据的记录列表中可以点击按钮，查看区块链上的数据，上链的数据保存在memos字段里面，最大字节数2k。memos里面可以自定义数据结构。
        <br>
        3. 为了更好地体验区块链新技术带来的全新感受，请用户遵守国家法律法规，不得上传法律法规禁止的文字、文件、图片、音频、视频等。
        <br>
        4. 上传人必须输入手机短信验证码，手机号码一起上链。上链后的信息将不可篡改，不可删除，全网公开。如发现不当内容，
        将移交给国家相关部门处理。
      </div>
    </section>
    <section class="feature-box">
      <div class="title">功能演示</div>
      <x-textarea title="文本：" v-model.trim="formInfo.inputText" :max="500"></x-textarea>
      <yd-flexbox class="scene-list">
        <yd-flexbox-item class="btn-box">
          <x-button type="default" @click.native="initPage()" class="btn-create">刷新数据</x-button>
        </yd-flexbox-item>
        <yd-flexbox-item class="btn-box">
          <x-button type="primary" class="btn-create" @click.native="dateToChainClick()">文本上链</x-button>
        </yd-flexbox-item>
      </yd-flexbox>
    </section>
    <section class="tab-list">
      <group class="detail-item" v-for="(item, index) in tabList" :key="item.id">
        <cell title="支付方" :value="item.payAddress" class="mini-cell"></cell>
        <cell title="接收方" :value="item.toAddress" class="mini-cell"></cell>
        <cell title="文本数据" class="mini-cell">
          <span>{{item.memos | GetMemosByKey('text')}}</span>
        </cell>
        <cell-form-preview :list="item.previewList" class="mini-cell"></cell-form-preview>
        <cell title="查询链上数据" is-link class="mini-cell" @click.native="getChainDetailClick(item, index)"></cell>
      </group>
      <load-more v-if="isLoading" :show-loading="isLoading" :tip="'正在加载...'" background-color="#fbf9fe"></load-more>
      <div class="btn-box" v-if="page.currentPage < page.totalPage">
        <x-button type="primary" action-type="button" @click.native="loadMoreClick()">加载更多</x-button>
      </div>
      <load-more v-else :show-loading="isLoading" :tip="'没有更多数据'" background-color="#fbf9fe"></load-more>
    </section>
    <!--查看数据对话框-->
    <popup v-model="dialogInfo.visible" height="80%" class="popup-json">
      <div >
        <vue-json-editor v-model="dialogInfo.chainInfo" :show-btns="false"></vue-json-editor>
      </div>
      <div class="btn-box">
        <x-button type="primary" class="btn-create" @click.native="dialogInfo.visible = false">关闭</x-button>
      </div>
    </popup>
    <sms-code-dialog :visible.sync="smsDialog.visible" :submitFun="smsDialog.submitFun"></sms-code-dialog>
  </div>
</template>
<script>
import { Group, XButton, CellFormPreview,CellBox,Cell,LoadMore,XInput,XTextarea,Loading,Popup } from 'vux'
import vueJsonEditor from 'vue-json-editor'
import Api from '@/api/api'
import SmsCodeDialog from '@/module/mobile/components/smsCodeDialog'
export default {
  name: 'PageTextChain',
  components: {
    vueJsonEditor,
    Group,
    XButton,
    CellFormPreview,
    CellBox,
    Cell,
    LoadMore,
    XInput,
    Loading,
    XTextarea,
    Popup,
    SmsCodeDialog
  },
  data() {
    return {
      tabList: [],
      transactionType: 2,
      dataType: 'text',
      isLoading: false,
      formInfo: {
        inputText: ''
      },
      page: {
        currentPage: 1,
        pageSize: 5,
        totalPage: 1,
        total: 0
      },
      dialogInfo: {
        visible: false,
        chainInfo: '',
        payInfo: ''
      },
      smsDialog: {
        visible: false,
        submitFun: null
      }
    }
  },
  created() {
    let _self = this;
    _self.initPage();
  },
  mounted() {
  },
  computed: {},
  methods: {
    initPage() {
      let _self = this;
      _self.formInfo.inputText = '';
      _self.tabList = [];
      _self.handleSearch(1);
    },
    handleSearch(currentPage) {
      let _self = this;
      _self.page.currentPage = currentPage || _self.page.currentPage;
      let params = {};
      params.currentPage = _self.page.currentPage;
      params.pageSize = _self.page.pageSize;
      params.type = _self.transactionType;
      _self.isLoading = true;
      Api.transaction.getTransactionList(params).then(function (data) {
        _self.isLoading = false;
        if (data.success) {
          data.data.list.forEach(function (item) {
            let previewList = [];
            previewList.push({label: '手续费', value: item.fee});
            previewList.push({label: '上链时间', value: item.payTime});
            item.previewList = previewList;
          });
          _self.tabList = _self.tabList.concat(data.data.list);
          _self.page.total = data.data.total;
          _self.page.totalPage = data.data.totalPage;
        }
      });
    },
    loadMoreClick() {
      let _self = this;
      _self.page.currentPage++;
      _self.handleSearch();
    },
    dateToChainClick() {
      let _self = this;
      if (!_self.formInfo.inputText) {
        _self.$dialog.alert({mes: '请输入文本数据！'});
        return;
      }
      let submitFun = function (verifyInfo) {
        let params = {};
        params.phone = verifyInfo.phoneNumber;
        params.verifyCode = verifyInfo.verifyCode;
        params.transactionType = _self.transactionType;
        params.text = _self.formInfo.inputText;
        params.dataType = _self.dataType;
        _self.$vux.loading.show({
          text: 'Loading'
        });
        Api.transaction.dataToChain(params).then(function (data) {
          _self.$vux.loading.hide();
          if (data.success) {
            _self.smsDialog.submitFun = null;
            _self.smsDialog.visible = false;
            _self.initPage();
          }
        });
      }
      _self.smsDialog.submitFun = submitFun;
      _self.smsDialog.visible = true;
    },
    getChainDetailClick(row) {
      let _self = this;
      let params = {};
      params.clientId = row.clientId;
      params.address = row.payAddress;
      _self.dialogInfo.visible = true;
      _self.$vux.loading.show({
        text: 'Loading'
      });
      Api.transaction.getTransactionChainDetail(params).then(function (data) {
        _self.$vux.loading.hide();
        if (data.success) {
          _self.dialogInfo.chainInfo = data.data.chainInfo;
          _self.dialogInfo.payInfo = data.data.payInfo;
        }
      });
    }
  }
}
</script>
<style lang='less'>
</style>
