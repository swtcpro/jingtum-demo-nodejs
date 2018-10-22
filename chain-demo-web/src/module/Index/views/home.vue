<template>
  <div class="page-home">
    <section class="banner-box">
      <div class="banner-body">

        <el-carousel>
          <el-carousel-item v-for="(item, index) in bannerList" :key="index">
            <img :src="item" alt="banner" class="banner">
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>







    <!--场景-->
    <section class="scene-box">
      <div class="section-content">
        <h3 class="title">应用场景</h3>
        <el-row :gutter="20" class="scene-list">
          <el-col :span="6">
            <div class="scene-item">
              <img src="../images/icon-wallet.png" alt="" class="image">
              <div>创建钱包</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="scene-item">
              <img src="../images/icon-text.png" alt=""class="image">
              <div>文本上链</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="scene-item">
              <img src="../images/icon-picture.png" alt="" class="image">
              <div>图片/PDF上链</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="scene-item">
              <img src="../images/icon-video.png" alt="" class="image">
              <div>音视频上链</div>
            </div>
          </el-col>
        </el-row>
      </div>-
    </section>
    <section class="about-box">
      <el-container class="section-content">
        <el-aside width="300px" class="left-box">
          <img src="../images/img-desc.png" alt="" class="image">
        </el-aside>
        <el-main>
          <h3 class="title">概要</h3>
          <p class="desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;展示数据上链的步骤，揭开区块链结合业务应用的神秘面纱。
            在理解业务数据上链的流程操作后，业务主体相关人员更好地关注业务，寻找业务跟区块链结合的场景。
            可以缩短业务应用开发人员学习井通区块链接口的时间。</p>
        </el-main>
      </el-container>
    </section>
    <section class="about-box even">
      <el-container class="section-content">
        <el-aside width="300px" class="left-box">
          <img src="../images/img-wallet.png" alt="" class="image">
        </el-aside>
        <el-main>
          <h3 class="title">钱包</h3>
          <p class="desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;包括创建钱包、激活钱包、查询余额。这是业务应用结合区
            块链的第一步，所有的交易都要有发送方钱包地址和接收方的钱包地址。
            钱包激活才能使用，要激活钱包，必须向此钱包转入25个以上的SWTC，同时消耗0.01个SWTC。查询余额不会消耗SWTC。</p>
        </el-main>
      </el-container>
    </section>
    <section class="about-box">
      <el-container class="section-content">
        <el-aside width="300px" class="left-box">
          <img src="../images/img-text.png" alt="" class="image">
        </el-aside>
        <el-main>
          <h3 class="title">文本上链</h3>
          <p class="desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文本上链是区块链应用最常见的场景。从业务系统中提取要
            上链防篡改的数据，以某种格式和顺序上传到区块链。同时，
            业务系统保存上链用的ClientID和返回的Hash值，以便可以从区块链中检索数据。</p>
        </el-main>
      </el-container>
    </section>
    <section class="about-box even">
      <el-container class="section-content">
        <el-aside width="300px" class="left-box">
          <img src="../images/img-picture.png" alt="" class="image">
        </el-aside>
        <el-main>
          <h3 class="title">图片/PDF上链</h3>
          <p class="desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图片/PDF上链也是区块链应用常见的场景之一。
            图片/PDF上链最大目的之一也是防篡改，提高信任度。
            比如产品溯源中的产品生产过程的照片、认证照片等，检验检测行业中的检验检测报告。图片/PDF上链可分两种，
            一种是图片/PDF计算Hash上链的同时把图片/PDF上传到云服务器(未来将上传到IPFS子链)，这种方式的好处是可以防止图片/PDF篡改又减轻了上传到区块链中的
            性能和成本的开销。另一种是整张图片/PDF上链，以Base64或二进制的方式。</p>
        </el-main>
      </el-container>
    </section>
    <section class="about-box">
      <el-container class="section-content">
        <el-aside width="300px" class="left-box">
          <img src="../images/img-video.png" alt="" class="image">
        </el-aside>
        <el-main>
          <h3 class="title">音视频上链</h3>
          <p class="desc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;音视频上链也是区块链应用常见的场景之一。
            音视频上链最大目的之一也是防篡改，提高信任度。音视频上链可分两种，
            一种是音视频计算Hash上链的同时把音视频文件上传到云服务器(未来将上传到IPFS子链)，这种方式的好处是可以防止音频被篡改又减轻了上传到区块链中
            的性能和成本的开销。另一种是整个音视频文件以二进制的方式上链。</p>
        </el-main>
      </el-container>
    </section>
  </div>
</template>
<script>
export default {
  name: 'PageHome',
  data() {
    return {
      bannerList: [
        '../static/images/banner/banner-2.jpg',
        '../static/images/banner/banner-3.jpg'
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  components: {},
  computed: {},
  methods: {
  }
}
</script>
<style lang='less'>
@import "../style/home";
</style>
