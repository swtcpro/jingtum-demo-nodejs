<template>
  <div class="page-picture-chain">
    <section class="main-header">
      <div class="section-content">
        <h3 class="title">图片/PDF上链温馨提示</h3>
        <div class="desc">
          1. Demo中演示的是图片文件上链的方式。选择图片文件后，系统自动计算hash值和上传图片原文件到云服务器(未来将上传到IPFS子链)， 把图片Hash值和存储路径上传到区块链，同时保存相关数据到业务数据库。
          <br>
          2. 从上传记录列表中，可以看到图片存储的路径和缩略图。点击查询链上数据按钮，可以查看完整的链上数据结构。上链的数据保存在memos字段里面，包括图片Hash值、存储路径等。memos最大字节2K，可以自定义数据结构。2K以内的文件可以直接存储在memos里面，但是不建议，最好是使用IPFS。
          <br>
          3. 可以通过存储路径获取到图片，再重新计算图片Hash值，跟区块链中存储的Hash值做比较，如果一致，则图片未被篡改，否则给出提示和警告信息。
          <br>
          4. 为了更好地体验区块链新技术带来的全新感受，请用户遵守国家法律法规，不得上传法律法规禁止的文字、文件、图片、音频、视频等。
          <br>
          5. 上传人必须输入手机短信验证码，手机号码一起上链。上链后的信息将不可篡改，不可删除，全网公开。如发现不当内容，将移交给国家相关部门处理。
        </div>
      </div>
    </section>
    <section class="feature-box">
      <div class="section-content">
        <h3 class="title">功能演示</h3>
        <el-steps :active="featureStepActive" align-center class="step-list-box">
          <el-step title="选择文件">
            <div slot="description" class="step-detail">
              <el-upload ref="refUpload" :limit="1" :action="uploadInfo.action" :on-exceed="handleFileExceed"
                         :data="uploadInfo.data" :before-upload="handleImageBeforeUpload" :on-change="handleImageChange"
                         list-type="picture" :file-list="uploadInfo.fileList" :on-success="handleFileSuccess"
                         :on-error="handleFileError" :accept="'.jpeg,.pdf,.png,.jpg,.gif'" :on-remove="clearFileListClick"
                         :on-preview="handleImagePreview" :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button type="warning" size="small" icon="el-icon-delete" @click="clearFileListClick()"></el-button>
              </el-upload>
            </div>
          </el-step>
          <el-step title="计算文件hash">
            <div slot="description" class="step-detail">
              <el-button size="small" type="success" @click="handleMD5HashClick()">计算文件MD5 HASH</el-button>
              <div class="desc-info">{{uploadInfo.MD5hash}}</div>
            </div>
          </el-step>
          <el-step title="上传服务器">
            <div slot="description" class="step-detail">
              <el-button size="small" type="success" @click="submitUploadClick">上传到服务器</el-button>
              <div class="desc-info">
                <span v-if="uploadInfo.uploadStatus === 0">未上传</span>
                <span v-if="uploadInfo.uploadStatus === 1">上传成功</span>
                <span v-if="uploadInfo.uploadStatus === 2">上传失败</span>
              </div>
            </div>
          </el-step>
          <el-step title="数据上链">
            <div slot="description" class="step-detail">
              <el-button size="small" type="success" @click="dataToChainClick">数据上链</el-button>
              <el-button v-if="featureStepActive === 4" size="small" type="primary" @click="initUploadInfo">重置</el-button>
              <div class="desc-info">
                <span v-if="featureStepActive === 4">文件数据已上链完毕</span>
              </div>
            </div>
          </el-step>
        </el-steps>

        <div class="table-inner">
          <div class="table-btn-right">
            <el-button type="text" @click="handleSearch(1)">刷新数据</el-button>
          </div>
          <el-table :data="tabList" stripe>
            <el-table-column  align="center" min-width="100" label="图片/pdf">
              <template slot-scope="props">
                <img :src="props.row.filePath" alt="图片" class="thumb-img">
              </template>
            </el-table-column>
            <el-table-column  align="center" min-width="160" label="交易ID" prop="clientId" ></el-table-column>
            <el-table-column  align="center" min-width="160" label="上链地址" prop="payAddress" ></el-table-column>
            <el-table-column  align="center" width="80" label="手续费" prop="fee" ></el-table-column>
            <el-table-column  align="center" min-width="160" label="文件hash" prop="fileHash" ></el-table-column>
            <el-table-column  align="center" min-width="180" label="文件路径" prop="filePath" ></el-table-column>
            <el-table-column  align="center" min-width="160" label="上链时间" prop="payTime" ></el-table-column>
            <el-table-column  align="center" min-width="160" label="操作" >
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
import SparkUtil from '@/api/SparkUtil'
import Utils from '@/api/Utils'
import SmsCodeDialog from '@/module/index/components/smsCodeDialog'
export default {
  name: 'PagePictureChain',
  components: {
    vueJsonEditor,
    SmsCodeDialog
  },
  data() {
    return {
      tabList: [],
      transactionType: 3,
      uploadInfo: {
        action: 'https://jingtumt.oss-cn-shenzhen.aliyuncs.com',
        data: {},
        MD5hash: '',
        uploadFilename: '',
        filePath: '',
        // 0 未上传 1 成功 2 失败
        uploadStatus: 0,
        dataType: '',
        fileList: []
      },
      featureStepActive: 0,
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
    // 初始化上传
    initUploadInfo() {
      let _self = this;
      _self.$refs['refUpload'].clearFiles();
      _self.featureStepActive = 0;
      _self.uploadInfo.MD5hash = '';
      _self.uploadInfo.uploadFilename = '';
      _self.uploadInfo.filePath = '';
      _self.uploadInfo.uploadStatus = 0;
      _self.uploadInfo.fileList = [];
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
    },
    handleImagePreview(file) {
    },
    handleImageBeforeUpload(file) {
      let _self = this;
      const promise = new Promise(function(resolve, reject) {
        _self.getOssToken(function (error, data) {
          if (error) {
            reject(error);
          } else {
            _self.uploadInfo.action = data.host;
            let obj = {};
            let filename = Utils.createFilename(file.name, file.type);
            obj.name = file.name;
            obj.key = data.dir + filename;
            obj.policy = data.policyBase64;
            obj.OSSAccessKeyId = data.accessId;
            obj.success_action_status = 200;
            obj.signature = data.signature;
            _self.uploadInfo.uploadFilename = filename;
            _self.uploadInfo.filePath = `${data.host}/${obj.key}`;
            _self.uploadInfo.data = obj;
            _self.uploadInfo.uploadStatus = 0;
            resolve();
          }
        });
      });
      return promise;
    },
    handleImageChange(srcFile, fileList) {
      let _self = this;
      if (srcFile.status === 'ready') {
        let file = srcFile.raw;
        if (file.type.indexOf('image/') < 0) {
          _self.$alert('请选择图片文件！');
          _self.initUploadInfo();
          return;
        }
        if (file.size > 2097152) {
          _self.$alert('上传文件不能大于2M！');
          _self.initUploadInfo();
          return;
        }
        _self.featureStepActive = 1;
        _self.uploadInfo.fileList = fileList;
      }
    },
    // 清除文件列表
    clearFileListClick() {
      let _self = this;
      _self.initUploadInfo();
    },
    // 计算文件hash
    handleMD5HashClick() {
      let _self = this;
      if (!_self.uploadInfo.fileList.length) {
        _self.$alert('请先选择文件！');
        return;
      }
      let file = _self.uploadInfo.fileList[0].raw;
      _self.uploadInfo.dataType = file.type;
      SparkUtil.fileCalculateHash(file).then(function (hash) {
        _self.uploadInfo.MD5hash = hash;
        _self.featureStepActive = 2;
      });
    },
    getOssToken(callback) {
      let _self = this;
      Api.base.getAliOssToken().then(function (data) {
        if (data.success) {
          callback(null, data.data);
        } else {
          callback(data.message, data.data);
        }
      });
    },
    submitUploadClick() {
      let _self = this;
      if (_self.featureStepActive < 2) {
        _self.$alert('请按步骤依次进行！');
        return;
      }
      _self.$refs['refUpload'].submit();
    },
    // 文件超出提示
    handleFileExceed() {
      let _self = this;
      _self.$alert('每次上传只能选择一个文件！');
    },
    handleFileSuccess(response, file, fileList) {
      let _self = this;
      _self.featureStepActive = 3;
      _self.uploadInfo.uploadStatus = 1;
    },
    handleFileError(err, file, fileList) {
      let _self = this;
      _self.$alert(`上传失败！${err}`);
      _self.featureStepActive = 2;
      _self.uploadInfo.uploadStatus = 2;
    },
    // 数据上链
    dataToChainClick() {
      let _self = this;
      if (_self.featureStepActive < 3) {
        _self.$alert('请按步骤依次进行！');
        return;
      }
      let submitFun = function (verifyInfo) {
        let params = {};
        params.phone = verifyInfo.phoneNumber;
        params.verifyCode = verifyInfo.verifyCode;
        params.filePath = _self.uploadInfo.filePath;
        params.fileHash = _self.uploadInfo.MD5hash;
        params.hashType = 'MD5';
        params.dataType = _self.uploadInfo.dataType;
        params.transactionType = _self.transactionType;
        Api.transaction.dataToChain(params).then(function (data) {
          if (data.success) {
            _self.$alert('图片数据上链完成！');
            _self.handleSearch(1);
            _self.featureStepActive = 4;
            _self.smsDialog.visible = false;
            _self.smsDialog.submitFun = null;
          }
        });
      }
      _self.smsDialog.submitFun = submitFun;
      _self.smsDialog.visible = true;
    }
  }
}
</script>
<style lang='less'>
@import "../style/home";
</style>
