<template>
  <div class="page-text-chain">
    <section class="main-header">
      <div class="section-content">
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
      </div>
    </section>
    <section class="feature-box">
      <div class="section-content">
        <h3 class="title">功能演示</h3>
        <div class="input-box">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" :maxlength="512"
                    placeholder="请输入内容" v-model.trim="formInfo.inputText">
          </el-input>
        </div>
        <div class="btn-group-box">
          <el-button type="warning" @click="formInfo.inputText = ''">清除文本</el-button>
          <el-button type="primary" @click="dateToChainClick()">文本上链</el-button>
        </div>
        <div class="table-inner">
          <div class="table-btn-right">
            <el-button type="text" @click="handleSearch(1)">刷新数据</el-button>
          </div>
          <el-table :data="tabList" stripe>
            <el-table-column  align="center" width="190" label="交易ID" prop="clientId" ></el-table-column>
            <el-table-column  align="center" min-width="180" label="文本数据" prop="memos" >
              <template slot-scope="props">
                {{props.row.memos | GetMemosByKey('text')}}
              </template>
            </el-table-column>
            <el-table-column  align="center" min-width="160" label="上链地址" prop="payAddress" ></el-table-column>
            <el-table-column  align="center" min-width="160" label="接收方地址" prop="toAddress" ></el-table-column>
            <el-table-column  align="center" width="80" label="手续费" prop="fee" ></el-table-column>
            <el-table-column  align="center" width="160" label="上链时间" prop="payTime" ></el-table-column>
            <el-table-column  align="center" width="120" label="操作">
              <template slot-scope="props">
                <el-button type="primary" size="mini" @click="getChainDetailClick(props.row)">查询链上数据</el-button>
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
    <!--显示数据详情-->
    <el-dialog title="链上交易数据" :visible.sync="dialogInfo.visible" width="800px">
      <el-row :gutter="20" class="detail-row">
        <el-col :span="24" class="detail-col">
          交易hash：{{dialogInfo.chainInfo.hash}}
        </el-col>
      </el-row>
      <vue-json-editor v-model="dialogInfo.chainInfo" :show-btns="false"></vue-json-editor>
      <div slot="footer">
        <el-button @click="dialogInfo.visible = false">取 消</el-button>
      </div>
    </el-dialog>
    <sms-code-dialog :visible.sync="smsDialog.visible" :submitFun="smsDialog.submitFun"></sms-code-dialog>
  </div>
</template>
<script>
import Api from '@/api/api'
import vueJsonEditor from 'vue-json-editor'
import SmsCodeDialog from '@/module/index/components/smsCodeDialog'
export default {
  name: 'PageTextChain',
  components: {
    vueJsonEditor,
    SmsCodeDialog
  },
  data() {
    return {
      tabList: [],
      transactionType: 2,
      dataType: 'text',
      formInfo: {
        inputText: ''
      },
      dialogInfo: {
        visible: false,
        chainInfo: '',
        payInfo: ''
      },
      page: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5],
        total: 0
      },
      smsDialog: {
        visible: false,
        submitFun: null
      }
    }
  },
  created() {
    let _self = this;
    _self.handleSearch(1);
  },
  mounted() {
  },
  computed: {},
  methods: {
    handleSearch(currentPage) {
      let _self = this;
      _self.page.currentPage = currentPage || _self.page.currentPage;
      let params = {};
      params.currentPage = _self.page.currentPage;
      params.pageSize = _self.page.pageSize;
      params.type = _self.transactionType;
      Api.transaction.getTransactionList(params).then(function (data) {
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
    dateToChainClick() {
      let _self = this;
      if (!_self.formInfo.inputText) {
        _self.$alert('请输入文本数据！');
        return;
      }
      let submitFun = function (verifyInfo) {
        let params = {};
        params.phone = verifyInfo.phoneNumber;
        params.verifyCode = verifyInfo.verifyCode;
        params.transactionType = _self.transactionType;
        params.text = _self.formInfo.inputText;
        params.dataType = _self.dataType;
        Api.transaction.dataToChain(params).then(function (data) {
          if (data.success) {
            _self.smsDialog.visible = false;
            _self.smsDialog.submitFun = null;
            _self.handleSearch(1);
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
      Api.transaction.getTransactionChainDetail(params).then(function (data) {
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
@import "../style/home";
</style>
