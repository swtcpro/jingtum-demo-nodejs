<template>
  <div class="page-wallet">
    <section class="main-header">
      <h3 class="title">钱包功能介绍</h3>
      <div class="desc">包括创建钱包、激活钱包、查询余额。这是业务应用结合区块链的第一步，所有的交易都要有发送方钱包地址和接收方的钱包地址。钱包激活才能使用，要激活钱包，必须向此钱包转入25个以上的SWTC，同时消耗0.01个SWTC。查询余额不会消耗SWTC。</div>
    </section>
    <section class="feature-box">
      <div class="title">功能演示</div>
      <x-input title="请输入手机号：" v-model="phoneNumber"></x-input>
      <yd-flexbox class="scene-list">
        <yd-flexbox-item class="btn-box">
          <x-button type="default" @click.native="initPage()" class="btn-create">刷新数据</x-button>
        </yd-flexbox-item>
        <yd-flexbox-item class="btn-box">
          <x-button type="primary" @click.native="createWalletClick()" class="btn-create">创建钱包</x-button>
        </yd-flexbox-item>
      </yd-flexbox>
    </section>
    <section class="tab-list">
      <group class="detail-item" v-for="(item, index) in tabList" :key="item.id">
        <cell title="地址" :value="item.address" class="mini-cell"></cell>
        <cell title="私钥" :value="item.secret" class="mini-cell"></cell>
        <cell-form-preview :list="item.previewList" class="mini-cell"></cell-form-preview>
        <cell title="状态" :is-link="!item.isActivity" class="mini-cell" @click.native="activityUserClick(item, index)">
          <span>
            <span v-if="item.isActivity">已激活</span>
            <span v-else>未激活，点击激活</span>
          </span>
        </cell>
        <cell title="余额" is-link :is-loading="item.isLoading" class="mini-cell" @click.native="getBalancesClick(item, index)">
          <span>
            <span v-if="item.swtVal">SWT：{{item.swtVal}}&nbsp;&nbsp;冻结：{{item.freezed}}</span>
            <span v-else>点击查询</span>
          </span>
        </cell>
      </group>
      <load-more v-if="isLoading" :show-loading="isLoading" :tip="'正在加载...'" background-color="#fbf9fe"></load-more>
      <div class="btn-box" v-if="page.currentPage < page.totalPage">
        <x-button type="primary" action-type="button" @click.native="loadMoreClick()">加载更多</x-button>
      </div>
      <load-more v-else :show-loading="isLoading" :tip="'没有更多数据'" background-color="#fbf9fe"></load-more>
    </section>

  </div>
</template>
<script>
import { Group, XButton, CellFormPreview,CellBox,Cell,LoadMore,XInput,Toast } from 'vux'
import Api from '@/api/api'
export default {
  name: 'PageWallet',
  components: {
    Group,
    XButton,
    CellFormPreview,
    CellBox,
    Cell,
    LoadMore,
    XInput,
    Toast
  },
  data() {
    return {
      phoneNumber: '',
      tabList: [],
      isLoading: false,
      page: {
        currentPage: 1,
        pageSize: 5,
        totalPage: 1,
        total: 0
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
      _self.tabList = [];
      _self.handleSearch(1);
    },
    handleSearch(currentPage) {
      let _self = this;
      _self.page.currentPage = currentPage || _self.page.currentPage;
      let params = {};
      params.currentPage = _self.page.currentPage;
      params.pageSize = _self.page.pageSize;
      _self.isLoading = true;
      Api.user.getUserList(params).then(function (data) {
        _self.isLoading = false;
        if (data.success) {
          data.data.list.forEach(function (item) {
            let previewList = [];
            previewList.push({label: '创建时间', value: item.created_at});
            previewList.push({label: '手机号', value: item.phoneNumber});
            item.previewList = previewList;
          });
          _self.tabList = _self.tabList.concat(data.data.list);
          _self.page.total = data.data.total;
          _self.page.totalPage = data.data.totalPage;
        }
      }).catch(() => {
        _self.isLoading = false;
      });
    },
    loadMoreClick() {
      let _self = this;
      _self.page.currentPage++;
      _self.handleSearch();
    },
    createWalletClick() {
      let _self = this;
      let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (!reg.test(_self.phoneNumber)) {
        _self.$dialog.alert({mes: '请输入正确的手机号！'});
        return false;
      }
      let params = {};
      params.phoneNumber = _self.phoneNumber;
      Api.user.create(params).then(function (data) {
        if (data.success) {
          _self.phoneNumber = '';
          _self.$dialog.alert({mes: '创建成功！'});
          _self.tabList = [];
          _self.handleSearch(1);
        }
      });
    },
    // 获取余额
    getBalancesClick(item, index) {
      let _self = this;
      item.isLoading = true;
      _self.$set(_self.tabList, index, item);
      Api.user.getBalances(item.id).then(function (data) {
        item.isLoading = false;
        if (data.success) {
          let obj = data.data[0];
          item.swtVal = obj.value;
          item.freezed = obj.freezed;
        }
        _self.$set(_self.tabList, index, item);
      });
    },
    activityUserClick(item, index) {
      let _self = this;
      if (item.isActivity === 1) {
        return;
      }
      Api.user.activityUser(item.id).then(function (data) {
        if (data.success) {
          _self.$vux.toast.show({
            type: 'text',
            text: '正在激活...'
          });
          setTimeout(function () {
            item.isActivity = 1;
            _self.$set(_self.tabList, index, item);
            _self.$vux.toast.show({
              type: 'text',
              text: '钱包已激活'
            });
          }, 3000);
        }
      });
    }
  }
}
</script>
<style lang='less'>
</style>
