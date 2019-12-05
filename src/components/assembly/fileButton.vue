<template>
  <div class="btn">
    <button @click="goBack" class="btn1">返回</button>
    <button @click="next" class="btn2" v-if="showNext">下一份文件</button>
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
import store from "store";
import { path } from "../../config.js";
export default {
  data() {
    return {
      //path: null, //下一个文件地址
      index: null, //第几个文件
      showNext: true,
      isVeiwList: [],
      serialNo: null,
      fileList: []
    };
  },
  props: ["path", "back"],
  created() {
    if (this.$route.query.index != "") {
      this.index = this.$route.query.index;
      //勾选（已读）
      if (this.index <= 5) {
        this.isViewListSave(this.index);
      }
    }
    if (this.index >= 5) {
      this.showNext = false;
    }
    if (store.get("serialNo")) {
      this.serialNo = store.get("serialNo");
    }
    //获取pdf或html合同文件
    this.queryByContractNoAndFileType();
  },
  mounted() {},
  methods: {
    //获取pdf或html合同文件
    queryByContractNoAndFileType() {
      let url = `docAttachmentCtr/queryByContractNoAndFileType?fileType=CONTRACT&contractNo=${this.serialNo}`;
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.data && res.code == "200") {
            this.fileList = res.data;
            console.log("文件", this.fileList);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //返回
    goBack() {
      console.log("返回");
      this.$router.push({
        path: this.back,
        query: {
          code: 0
        }
      });
    },
    //下一页
    next() {
      //阅读附件
      //this.isViewListSave(this.index);
      console.log(this.path);
      //let nextIndex = this.index * 1 + 1;
      console.log(this.fileList, this.nextIndex);
      this.$router.push({
        path: this.path,
        query: {
          docType: this.fileList[this.nextIndex].docType,
          index: this.nextIndex
        }
      });
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
  computed: {
    nextIndex() {
      return this.index * 1 + 1;
    }
  }
};
</script>
<style lang='scss' scoped>
.btn {
  position: fixed;
  z-index: 999;
  bottom: 0.5rem;
  left: 1rem;
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
    margin-left: 0.5rem;
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