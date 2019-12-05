<template>
  <div class="box">
    <div class="iframe">
      <iframe
        :src="html"
        scrolling="auto"
        id="iframe"
        frameborder="0"
        class="ifr"
        :style="{width:'100%',height:screenHeight-80+'px'}"
      ></iframe>
    </div>
    <div class="btn">
      <button @click="goBack" class="btn1">返回</button>
      <button @click="next" v-if="noNext" class="btn2">下一页</button>
    </div>
  </div>
</template>
<script>
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass
} from "../../public/uilt.js";
import { MessageBox, Indicator, Toast } from "mint-ui";
import store from "store";
import { path } from "../../config.js";
export default {
  data() {
    return {
      customerId: null,
      serialNo: null,
      html: null,
      index: null,
      screenWidth: null,
      screenHeight: null,
      fileList: [],
      noNext: true,
      isVeiwList: []
    };
  },
  created() {
    //传参serialNo、docHttpUrl、index
    if (this.$route.query.docHttpUrl) {
      this.serialNo = this.$route.query.serialNo;
      this.html = decodeURIComponent(this.$route.query.docHttpUrl);
      this.index = this.$route.query.index;
      console.log(this.index);
    }
    if (store.get("serialNo")) {
      this.serialNo = store.get("serialNo");
    }
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
    }
    if (this.index >= 5) {
      this.noNext = false;
    }
    //获取宽高
    this.getKG();
    //获取文件
    this.queryByContractNoAndFileType();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "查看附件";
    this.$forceUpdate();
    // //获取宽高
    // this.getKG();
    // //获取文件
    // this.queryByContractNoAndFileType()
  },
  methods: {
    getKG() {
      this.screenWidth = document.body.clientWidth;
      //console.log(this.screenWidth);
      this.screenHeight = document.body.clientHeight;
      //console.log(this.screenHeight);
    },
    //获取pdf或html合同文件
    queryByContractNoAndFileType() {
      let url = `docAttachmentCtr/queryByContractNoAndFileType?fileType=CONTRACT&contractNo=${this.serialNo}`;
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.data && res.code == "200") {
            console.log("文件");
            this.fileList = res.data;
            console.log(this.fileList, 101);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    goBack() {
      console.log(111);
      this.$router.push({
        path: "/confirmSubmit",
        query: {
          code: 0,
          customerId: this.customerId,
          serialNo: this.serialNo
        }
      });
    },
    //下一页
    next() {
      this.index = this.index * 1 + 1;
      if (this.index >= 5) {
        this.noNext = false;
      }
      this.isViewListSave(this.index);
      console.log(this.index);
      console.log(this.fileList[this.index].docName);
      document.getElementById("iframe").src = this.fileList[
        this.index
      ].docHttpUrl;
    },
    //阅读附件
    isViewListSave(i) {
      this.isVeiwList = JSON.parse(sessionStorage.getItem("isVeiwList"));
      this.isVeiwList[i].isView = true;
      sessionStorage.setItem("isVeiwList", JSON.stringify(this.isVeiwList));
      console.log("this.isVeiwList", this.isVeiwList);
    }
  },
  beforeDestroy() {},
  components: {}
};
</script>
<style lang='scss' scoped>
.btn {
  // position: fixed;
  // bottom: 0.5rem;
  // left: 0.5rem;
  // z-index: 9999;
  //position: fixed;
  display: flex;
  margin-top: 0.3rem;
  justify-content: space-around;
  // bottom: 0;
  .btn1 {
    width: 2.58rem;
    height: 0.7rem;
    background: rgba(255, 255, 255, 1);
    border: 0.02rem solid rgba(88, 121, 230, 1);
    border-radius: 0.35rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(66, 102, 236, 1);
    line-height: 0.7rem;
  }
  .btn2 {
    margin-left: 1.2rem;
    width: 2.58rem;
    height: 0.7rem;
    background: linear-gradient(
      90deg,
      rgba(95, 127, 228, 1),
      rgba(58, 95, 238, 1)
    );
    box-shadow: 0px 0.14rem 0.16rem 0px rgba(186, 201, 254, 0.5);
    border-radius: 0.35rem;
    font-size: 0.28rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: #fff;
    line-height: 0.7rem;
  }
}
</style>