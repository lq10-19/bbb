<template>
  <div class="addID">
    <p class="tip">拍摄时请确保银行卡边框完整、亮度均衡</p>
    <div class="title">请上传银行卡正面照片</div>
    <div class="box">
      <!--  正面-->
      <div class="show">
        <div class="picture" :style="'backgroundImage:url('+portraitImage+')'"></div>
        <div class="upload" v-show="!portraitImage">
          <input
            class="hides"
            ref="referenceUploadp"
            type="file"
            accept="image/*"
            @change="upload($event,'portrait')"
          />
        </div>
        <div v-show="portraitImage" class="mask">
          <div class="identification">仅供本次业务使用</div>
          <i class="delete" @click="deleteImg('portraitImage')"></i>
        </div>
      </div>
      <div class="tips">请拍照上传银行卡正面照片</div>
    </div>
    <div class="waring">本操作将严格保护您的隐私安全，请放心操作</div>
    <div class="btn_box">
      <button class="btn" :class="{'disable': !portraitImage }" @click="submit">下一步</button>
    </div>
    <van-loading
      size="50px"
      text-size="18"
      vertical
      class="loading"
      color="#1989fa"
      v-if="false"
    >{{text}}</van-loading>
    <!-- //正在加载遮罩层 -->
    <div class="Mask" v-if="showLoading">
      <van-loading size="36px" text-size="18px" vertical color="#fff">{{text}}</van-loading>
    </div>
  </div>
</template>

<script>
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet
} from "../../public/uilt.js";
import store from "store";
import { Toast } from "vant";
export default {
  data() {
    return {
      param: {},
      //headerImage: null,
      portraitImage: null,
      type: null,
      nonceSign: null,
      orderNo: null,
      nonce: null,
      inputuserId: null,
      infoID: null,
      showLoading: false,
      text: ""
    };
  },
  created() {
    //传参certId、contractNo、customerName、from
    if (this.$route.query) {
      this.param = this.$route.query;
    }
  },
  mounted() {
    this.orderNo = randomWord(false, 32);
    this.nonce = randomWord(false, 32);
    this.inputuserId = randomWord(false, 20);
    this.init();
  },
  methods: {
    async init() {
      try {
        this.text = "加载中...";
        this.showLoading = true;
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    //提交进行OCR
    async submit() {
      if (!this.portraitImage) {
        return;
      }
      this.showLoading = true;
      this.text = "上传中...";
      const param = {
        certId: this.param.certId,
        contractNo: this.param.contractNo,
        customerName: this.param.customerName,
        imageBase64: this.portraitImage.replace(/^.*?,/, "")
      };
      try {
        const resp = await this.$requestCl.post(
          "ocrController/getBankCardOcr",
          param
        );
        if (resp.code == "9966") {
          Toast(`${resp.msg}`);
          throw new Error(resp.msg);
        }
        const bankCardOcr = resp.data;
        storeSet(bankCardOcr, "bankCardOcr");
        if (this.$route.query.from) {
          this.$router.push({
            path: "/againAddBankCard"
          });
        } else if (this.$route.query.h5) {
          this.$router.push({
            path: "/addBankCard",
            query: {
              h5: 1
            }
          });
        } else {
          this.$router.push({
            path: "/addBankCard"
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    // 删除
    deleteImg(type) {
      if (type == "portraitImage") {
        this.portraitImage = null;
        this.$refs.referenceUploadp.value = null;
      } else {
        this.headerImage = null;
        this.$refs.referenceUploadh.value = null;
      }
    },
    // 上传银行卡
    async upload(e, type) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      try {
        this.text = "读取图片...";
        this.showLoading = true;
        if (type === "portrait") {
          this.portraitImage = await imgPreview(files[0]);
          //console.log("正面", this.portraitImage);
        } else {
          this.headerImage = await imgPreview(files[0]);
          //console.log("反面", this.headerImage);
        }
      } catch (error) {
        console.error(error);
        Toast("读取图片失败");
      } finally {
        this.showLoading = false;
      }
    }
  }
};
</script>


<style lang='scss' scoped>
.title {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  font-size: 0.3rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(0, 137, 252, 1);
  //margin-top: 0.2rem;
}
.tip {
  width: 100%;
  text-align: center;
  background-color: #f2f5ff;
  color: #3354df;
  padding: 0.2rem 0;
}
.tips {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  font-size: 0.28rem;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 0.2rem;
}

.box {
  .show {
    position: relative;
    top: 0;
    left: 0;
    margin: 0 auto;
    width: 5.8rem;
    height: 3.6rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.1rem;

    .picture {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 0.1rem;
    }

    .mask {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .identification {
      border: 2px solid rgba(255, 255, 255, 1);
      height: 0.42rem;
      line-height: 0.42rem;
      border-radius: 0.21rem;
      font-size: 0.24rem;
      width: 2.26rem;
      text-align: center;
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      color: rgba(255, 255, 255, 1);
    }

    .delete {
      display: block;
      height: 0.42rem;
      width: 0.42rem;
      background: url("../../assets/img/clear_icon.png") no-repeat;
      background-size: 100%;
      border-radius: 0.21rem;
      font-size: 0.24rem;
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      color: rgba(255, 255, 255, 1);
    }

    .upload {
      position: absolute;
      left: 2.35rem;
      top: 1.25rem;
      width: 1.1rem;
      height: 1.1rem;
      background: url("../../assets/img/add@2x.png") no-repeat;
      background-size: 100%;
      //z-index: 2;

      .hides {
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}

.waring {
  width: 100%;
  text-align: center;
  font-size: 0.26rem;
  color: rgba(248, 72, 89, 1);
}

.btn_box {
  width: 100%;
  display: flex;
  justify-content: center;
  .btn {
    display: block;
    width: 5.8rem;
    margin-top: 0.28rem;
    height: 0.9rem;
    background: linear-gradient(
      90deg,
      rgba(95, 127, 228, 1),
      rgba(58, 95, 238, 1)
    );
    box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
    border-radius: 0.44rem;
    font-weight: bold;
    line-height: 0.88rem;
    font-size: 0.36rem;
    color: #333;
    &.disable {
      background: rgba(220, 220, 220, 1);
      color: white;
    }
  }

  .green {
    background: linear-gradient(
      90deg,
      rgba(0, 137, 252, 1),
      rgba(1, 163, 246, 1)
    );
  }
}
.loading {
  position: fixed;
  top: 5rem;
  left: 2.9rem;
}
.Mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-top: 80%;
  background: rgba(0, 0, 0, 0.3);
  .van-loading__text {
    color: #fff;
  }
}
</style>