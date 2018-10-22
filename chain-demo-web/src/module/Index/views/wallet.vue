<template>
  <div class="page-wallet">
    <section class="main-header">
      <div class="section-content">
        <h3 class="title">钱包功能介绍</h3>
        <div class="desc">包括创建钱包、激活钱包、查询余额。这是业务应用结合区块链的第一步，所有的交易都要有发送方钱包地址和接收方的钱包地址。钱包激活才能使用，要激活钱包，必须向此钱包转入25个以上的SWTC，同时消耗0.01个SWTC。查询余额不会消耗SWTC。</div>
      </div>
    </section>
    <section class="feature-box">
      <div class="section-content">
        <h3 class="title">功能演示</h3>
        <div class="input-box">
          <el-input placeholder="请输入手机号" v-model="phoneNumber" type="tel">
            <el-button slot="append" icon="el-icon-search" @click="createWalletClick">创建钱包</el-button>
          </el-input>
        </div>
        <div class="table-inner">
          <el-table :data="tabList" stripe>
            <el-table-column  align="center" width="120" label="手机号" prop="phoneNumber" ></el-table-column>
            <el-table-column  align="center" min-width="300" label="钱包地址" prop="address" ></el-table-column>
            <el-table-column  align="center" min-width="280" label="私钥" prop="secret" ></el-table-column>
            <el-table-column  align="center" width="120" label="激活状态" prop="isActivity" >
              <template slot-scope="props">
                <span>{{props.row.isActivity ? '已激活' : '未激活'}}</span>
              </template>
            </el-table-column>
            <el-table-column  align="center" min-width="160" label="创建时间" prop="created_at" ></el-table-column>
            <el-table-column  align="center" width="160" label="操作" >
              <template slot-scope="props">
                <el-button type="primary" size="mini" @click="getBalancesClick(props.row)">余额</el-button>
                <el-button v-if="!props.row.isActivity" type="warning" size="mini" @click="activityUserClick(props.row)">激活</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-inner">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="page.currentPage" :page-size="page.pageSize" :page-sizes="page.pageSizes"
                           layout="total, prev, pager, next, jumper" :total="page.total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Api from '@/api/api'
export default {
  name: 'PageWallet',
  data() {
    return {
      tabList: [],
      phoneNumber: '',
      page: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5],
        total: 0
      }
    }
  },
  created() {
    let _self = this;
    _self.handleSearch(1);
  },
  mounted() {
  },
  components: {},
  computed: {},
  methods: {
    createWalletClick() {
      let _self = this;
      let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (!reg.test(_self.phoneNumber)) {
        _self.$alert('请输入正确的手机号！');
        return false;
      }
      let params = {};
      params.phoneNumber = _self.phoneNumber;
      Api.user.create(params).then(function (data) {
        if (data.success) {
          _self.handleSearch(1);
        }
      });
    },
    handleSearch(currentPage) {
      let _self = this;
      _self.page.currentPage = currentPage || _self.page.currentPage;
      let params = {};
      params.currentPage = _self.page.currentPage;
      params.pageSize = _self.page.pageSize;
      Api.user.getUserList(params).then(function (data) {
        if (data.success) {
          _self.tabList = data.data.list;
          _self.page.total = data.data.total;
        }
      });
    },
    handleCurrentChange (val) {
      let _self = this;
      _self.page.currentPage = val;
      _self.handleSearch();
    },
    handleSizeChange (val) {
      let _self = this;
      _self.page.pageSize = val;
      _self.handleSearch(1);
    },
    // 获取余额
    getBalancesClick(row) {
      let _self = this;
      Api.user.getBalances(row.id).then(function (data) {
        if (data.success) {
          let obj = data.data[0];
          _self.$alert(`${obj.currency}: ${obj.value} freezed: ${obj.freezed}`);
        }
      });
    },
    activityUserClick(row) {
      let _self = this;
      Api.user.activityUser(row.id).then(function (data) {
        if (data.success) {
          _self.$alert('激活成功！');
          _self.handleSearch(1);
        }
      });
    }
  }
}
</script>
<style lang='less'>
@import "../style/home";
</style>
