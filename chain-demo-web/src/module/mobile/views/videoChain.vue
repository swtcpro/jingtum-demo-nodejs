<template>
  <div class="page-video-chain">
    <section class="main-header">
      <h3 class="title">音频/视频上链温馨提示</h3>
      <div class="desc">
        1. Demo中演示的是音频和视频上链的方式。选择音频或视频文件后，系统自动计算hash值和上传原文件到云服务器(未来将上传到IPFS子链)， 把音频/视频Hash值和存储路径上传到区块链，同时保存相关数据到业务数据库。
        <br>
        2. 从上传记录列表中，可以看到文件缩略图、存储路径、文件hash等信息，点击文件缩略图可以在线实时播放。可以实现一个去中心化音视频播放器。
        <br>
        3. 点击查询链上数据按钮，可以查看完整的链上数据结构。上链的数据保存在memos字段里面，包括音频或视频Hash值、存储路径等。memos最大字节2K，可以自定义数据结构。2K以内的文件可以直接存储在memos里面，但是不建议，最好使用IPFS。
        <br>
        4. 可以通过存储路径获取到音频或视频，再重新计算音频/视频的Hash值，跟区块链中存储的Hash值做比较，如果一致，则文件未被篡改，否则给出提示和警告信息。
        <br>
        5. 为了更好地体验区块链新技术带来的全新感受，请用户遵守国家法律法规，不得上传法律法规禁止的文字、文件、图片、音频、视频等。
        <br>
        6. 上传人必须输入手机短信验证码，手机号码一起上链。上链后的信息将不可篡改，不可删除，全网公开。如发现不当内容，将移交给国家相关部门处理。
      </div>
    </section>
    <section class="feature-box">
      <div class="title">功能演示</div>
      <step v-model="featureStepActive" background-color='#fbf9fe' class="center-step" gutter="0px">
        <step-item description="选择文件"></step-item>
        <step-item description="计算HASH"></step-item>
        <step-item description="上传服务器"></step-item>
        <step-item description="数据上链"></step-item>
      </step>
      <div class="step-box" v-if="featureStepActive === 0">
        <div class="step-body">
          <div class="upload-box">
            <label for="js_upload_file" class="upload-label">
              <span class="upload-btn">选择文件</span>
            </label>
            <input :key="uploadInfo.keyId" id="js_upload_file" class="upload-input" type="file" @change="handleFileChange" name="image"
                   ref="refInputFile" accept="video/*">
            <div class="name" v-if="uploadInfo.inputFile">{{uploadInfo.inputFile.name}}</div>
            <div class="clear-btn" v-if="uploadInfo.inputFile" @click="clearFile">清除</div>
          </div>
        </div>
        <yd-flexbox class="scene-list">
          <yd-flexbox-item class="btn-box">
            <x-button type="primary" @click.native="handleStepNext(1)" class="btn-create">下一步</x-button>
          </yd-flexbox-item>
        </yd-flexbox>
      </div>
      <div class="step-box" v-else-if="featureStepActive === 1">
        <div class="step-body">
          HASH: {{uploadInfo.MD5hash}}
        </div>
        <yd-flexbox class="scene-list">
          <yd-flexbox-item class="btn-box">
            <x-button :gradients="['#6E29F9', '#937BDD']" @click.native="handleMD5HashClick()" type="default"
                      class="btn-create">计算HASH</x-button>
          </yd-flexbox-item>
          <yd-flexbox-item class="btn-box">
            <x-button type="primary" @click.native="handleStepNext(2)" class="btn-create">下一步</x-button>
          </yd-flexbox-item>
        </yd-flexbox>
      </div>
      <div class="step-box" v-else-if="featureStepActive === 2">
        <div class="step-body">
          文件上传：
          <span v-if="uploadInfo.uploadStatus === 0">未上传</span>
          <span v-if="uploadInfo.uploadStatus === 1">上传成功</span>
          <span v-if="uploadInfo.uploadStatus === 2">上传失败</span>
        </div>
        <yd-flexbox class="scene-list">
          <yd-flexbox-item class="btn-box">
            <x-button :gradients="['#6E29F9', '#937BDD']" type="default" @click.native="submitUploadClick()"
                      class="btn-create">上传服务器</x-button>
          </yd-flexbox-item>
          <yd-flexbox-item class="btn-box">
            <x-button type="primary" @click.native="handleStepNext(3)" class="btn-create">下一步</x-button>
          </yd-flexbox-item>
        </yd-flexbox>
      </div>
      <div class="step-box" v-else-if="featureStepActive === 3">
        <div class="step-body">
          数据上链：
          <span v-if="uploadInfo.dataToChainStatus === 0">等待上链</span>
          <span v-if="uploadInfo.dataToChainStatus === 1">文件数据已上链完成</span>
        </div>
        <yd-flexbox class="scene-list">
          <yd-flexbox-item class="btn-box">
            <x-button :gradients="['#6E29F9', '#937BDD']" type="default" class="btn-create"
                      @click.native="dataToChainClick()">数据上链</x-button>
          </yd-flexbox-item>
          <yd-flexbox-item class="btn-box">
            <x-button type="primary" @click.native="handleStepNext(4)" class="btn-create">完成</x-button>
          </yd-flexbox-item>
        </yd-flexbox>
      </div>
      <div class="step-box" v-else-if="featureStepActive === 4">
        <image-preview>
          <div class="step-body">
            <div class="img-info">
              <image-cell imgClassName="img-cell" :src="uploadInfo.filePath"></image-cell>
              <div class="info-box">
                <div class="desc">{{uploadInfo.MD5hash}}</div>
              </div>
            </div>
          </div>
        </image-preview>
        <yd-flexbox class="scene-list">
          <yd-flexbox-item class="btn-box">
            <x-button :gradients="['#6E29F9', '#937BDD']" type="primary"
                      @click.native="getChainDetailClick(uploadInfo.dataDetail)" class="btn-create">查看链上数据</x-button>
          </yd-flexbox-item>
          <yd-flexbox-item class="btn-box">
            <x-button type="primary" @click.native="handleReStartStep()" class="btn-create">重新开始</x-button>
          </yd-flexbox-item>
        </yd-flexbox>
      </div>
    </section>
    <!--数据列表-->
    <section class="tab-list">
      <group class="detail-item" v-for="(item, index) in tabList" :key="item.id">
        <cell title="支付方" :value="item.payAddress" class="mini-cell"></cell>
        <cell title="接收方" :value="item.toAddress" class="mini-cell"></cell>
        <cell class="mini-cell image-info-cell">
          <div class="left-box" slot="title">
            <img src="../images/img-mp4-vedio.png" alt="视频" @click="playVideoClick(item)" class="img-cell">
          </div>
          <div class="right-box">
            <div class="desc">资源号：{{item.clientId}}</div>
            <div class="desc">HASH类型：{{item.hashType}}</div>
          </div>
        </cell>
        <cell title="文件HASH" class="mini-cell">
          <span>{{item.fileHash}}</span>
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
    <!--播放视频-->
    <x-dialog v-model="videoDialog.visible" hide-on-blur class="video-dialog"
              :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
      <video-player  class="video-player vjs-custom-skin" v-if="videoDialog.visible"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="videoDialog.playerOptions"></video-player>
      <div class="icon-inner">
        <x-icon type="ios-close-outline" style="fill:#fff;" @click.native="videoDialog.visible = false"></x-icon>
      </div>
    </x-dialog>
    <sms-code-dialog :visible.sync="smsDialog.visible" :submitFun="smsDialog.submitFun"></sms-code-dialog>
  </div>
</template>
<script>
import { Group, XButton, CellFormPreview,CellBox,Cell,LoadMore,XInput,XTextarea,Loading,Popup,Step, StepItem,
  XProgress,Panel,XDialog } from 'vux'
import vueJsonEditor from 'vue-json-editor'
import SparkUtil from '@/api/SparkUtil'
import Api from '@/api/api'
import axios from 'axios';
import Utils from '@/api/Utils'
import SmsCodeDialog from '@/module/mobile/components/smsCodeDialog'
export default {
  name: 'PageVideoChain',
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
    Step,
    StepItem,
    XProgress,
    Panel,
    XDialog,
    SmsCodeDialog
  },
  data() {
    return {
      tabList: [],
      transactionType: 4,
      uploadInfo: {
        keyId: 1,
        action: 'https://jingtumt.oss-cn-shenzhen.aliyuncs.com',
        data: {},
        MD5hash: '',
        uploadFilename: '',
        filePath: '',
        // 0 未上传 1 成功 2 失败
        uploadStatus: 0,
        dataType: '',
        inputFile: '',
        dataToChainStatus: 0,
        dataDetail: '',
        phoneNumber: '',
        verifyCode: '',
        fileList: []
      },
      isLoading: false,
      featureStepActive: 0,
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
      videoDialog: {
        visible: false,
        playerOptions : {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "",
            src: "" // url地址
          }],
          poster: "", // 你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  // 全屏按钮
          }
        }
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
    // 重新开始
    handleReStartStep() {
      let _self = this;
      _self.clearFile();
      _self.uploadInfo.MD5hash = '';
      _self.featureStepActive = 0;
      _self.uploadInfo.MD5hash = '';
      _self.uploadInfo.uploadFilename = '';
      _self.uploadInfo.filePath = '';
      _self.uploadInfo.dataType = '';
      _self.uploadInfo.uploadStatus = 0;
      _self.uploadInfo.dataToChainStatus = 0;
      _self.uploadInfo.phoneNumber = '';
      _self.uploadInfo.verifyCode = '';
    },
    // 下一步
    handleStepNext(type) {
      let _self = this;
      if (type === 1) {
        if (!_self.uploadInfo.inputFile) {
          _self.$dialog.alert({mes: '请先选择文件！'});
          return;
        }
      } else if (type === 2) {
        if (!_self.uploadInfo.MD5hash) {
          _self.$dialog.alert({mes: '请计算文件HASH！'});
          return;
        }
      } else if (type === 3) {
        if (_self.uploadInfo.uploadStatus !== 1) {
          _self.$dialog.alert({mes: '请先上传文件'});
          return;
        }
      } else if (type === 4) {
        if (_self.uploadInfo.dataToChainStatus !== 1) {
          _self.$dialog.alert({mes: '请进行数据上链！'});
          return;
        }
        _self.initPage();
      }
      _self.featureStepActive++;
    },
    // 计算文件hash
    handleMD5HashClick() {
      let _self = this;
      if (!_self.uploadInfo.fileList.length) {
        _self.$dialog.alert({mes: '请先选择文件！'});
        return;
      }
      let file = _self.uploadInfo.fileList[0];
      _self.uploadInfo.dataType = file.type;
      SparkUtil.fileCalculateHash(file).then(function (hash) {
        _self.uploadInfo.MD5hash = hash;
      });
    },
    // 上传文件到服务器
    submitUploadClick() {
      let _self = this;
      if (!_self.uploadInfo.MD5hash) {
        _self.$dialog.alert({mes: '请先计算文件HASH'});
        return;
      }
      if (_self.uploadInfo.uploadStatus === 1) {
        _self.$dialog.alert({mes: '文件已上传！'});
        return;
      }
      _self.getOssToken(function (error, data) {
        if (error) {
          _self.$dialog.alert({mes: '获取oss token失败！'});
        } else {
          let file = _self.uploadInfo.inputFile;
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
          _self.uploadAjaxToServer(_self.onUploadProgress).then(function (data) {
            _self.$dialog.alert({mes: '上传成功！'});
            _self.uploadInfo.uploadStatus = 1;
          }).catch(() => {
            _self.$dialog.alert({mes: '上传失败！'});
          });
        }
      });
    },
    // 上传进度
    onUploadProgress(e) {
    },
    // 上传文件到服务器
    uploadAjaxToServer(onUploadProgress) {
      let _self = this;
      let params = new FormData();
      for (let key in _self.uploadInfo.data) {
        params.append(key, _self.uploadInfo.data[key]);
      }
      params.append('file', _self.uploadInfo.inputFile);
      let config = {
        headers:{'Content-Type':'multipart/form-data'},
        onUploadProgress: onUploadProgress
      };
      onUploadProgress && (config.onUploadProgress = onUploadProgress);
      return axios.post(_self.uploadInfo.action, params, config);
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
    // 清除文件
    clearFile() {
      let _self = this;
      _self.uploadInfo.keyId++;
      _self.uploadInfo.fileList = [];
      _self.uploadInfo.inputFile = '';
    },
    // 文件改变
    handleFileChange(e) {
      let _self = this;
      let fileList = _self.$refs['refInputFile'].files;
      let file = fileList[0];
      if (!((file.type.indexOf('video/') >= 0) || (file.type.indexOf('audio/') >= 0))) {
        _self.$dialog.alert({mes: '请选择音视频文件！'});
        _self.uploadInfo.keyId++;
        return;
      }
      if (file.size > 2097152) {
        _self.$dialog.alert({mes: '上传文件不能大于2M！'});
        _self.uploadInfo.keyId++;
        return;
      }
      _self.uploadInfo.fileList = fileList;
      _self.uploadInfo.inputFile = fileList[0];
    },
    // 数据上链
    dataToChainClick() {
      let _self = this;
      if (_self.featureStepActive < 3) {
        _self.$dialog.alert({mes: '请按步骤依次进行！'});
        return;
      }
      if (_self.uploadInfo.dataToChainStatus === 1) {
        _self.$dialog.alert({mes: '数据已经上链！'});
        return;
      }
      let submitFun = function (verifyInfo) {
        _self.uploadInfo.phoneNumber = verifyInfo.phoneNumber;
        _self.uploadInfo.verifyCode = verifyInfo.verifyCode;
        let params = {};
        params.phone = _self.uploadInfo.phoneNumber;
        params.verifyCode = _self.uploadInfo.verifyCode;
        params.filePath = _self.uploadInfo.filePath;
        params.fileHash = _self.uploadInfo.MD5hash;
        params.hashType = 'MD5';
        params.dataType = _self.uploadInfo.dataType;
        params.transactionType = _self.transactionType;
        Api.transaction.dataToChain(params).then(function (data) {
          if (data.success) {
            _self.$dialog.alert({mes: '图片数据上链完成！'});
            _self.initPage();
            _self.uploadInfo.dataToChainStatus = 1;
            _self.uploadInfo.dataDetail = data.data;
            _self.smsDialog.submitFun = null;
            _self.smsDialog.visible = false;
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
    },
    // 播放视频
    playVideoClick(row) {
      let _self = this;
      _self.videoDialog.playerOptions.sources = [];
      let obj = {};
      obj.src = row.filePath;
      obj.type = row.dataType;
      _self.videoDialog.playerOptions.sources.push(obj);
      _self.videoDialog.visible = true;
    }
  }
}
</script>
<style lang='less'>
</style>
