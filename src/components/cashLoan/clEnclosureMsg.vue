<template>
  <div class="bigBox">
    <div class="form">
      <div class="title">附件信息</div>
      <ul>
        <li class="item" @click="goDetails(item)" v-for="(item,i) in msgData" :key="i">
          <span class="key">{{item.serialNo}}</span>
          <span class="key">《{{item.docName}}》</span>
          <img src="../../../src/assets/img/sfz/bianJi@2x.png" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import store from "store";
export default {
  components: {},
  data() {
    return {
      serialNoList: [],
      objectno: "",
      msgData: [{ serialNo: "合同号1", docName: "文件1", docPath: "文件地址1" }] //附件列表
    };
  },
  created() {
    //传参serialNoList
    if (this.$route.query.serialNoList) {
      this.serialNoList = JSON.parse(this.$route.query.serialNoList);
    }
    if (store.get("serialNoList")) {
      this.serialNoList = store.get("serialNoList");
    }
    //根据合同号列表和附件类型查询附件
    this.queryByContractNoAndDocType();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "附件信息";
  },
  methods: {
    //查看详图
    goDetails(item) {
      //fullpath
      if (
        item.docPath.indexOf(".html") != -1 ||
        item.docPath.indexOf(".jpg") != -1
      ) {
        // this.$router.push({
        //   path: "/htmlShow",
        //   query: {
        //     docHttpUrl: encodeURIComponent(item.docHttpUrl)
        //   }
        // });
        this.$router.push({
          path: "/ChangeBankCardApplication",
          query: {
            serialNo: item.serialNo,
            index: 7
          }
        });
      } else if (item.docPath.indexOf(".pdf") != -1) {
        this.$router.push({
          path: "/clPdfFlie",
          query: {
            filePDF: encodeURIComponent(item.docPath)
          }
        });
      }
    },
    //获取附件信息
    queryByContractNoAndDocType() {
      let url = "docAttachmentCtr/queryByContractNoAndDocType";
      let data = {};
      let param = [];
      this.serialNoList.forEach(element => {
        let docType = "CCS_1001";
        data = {
          docType,
          serialNo: element
        };
        param.push(data);
      });
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            console.log("获取成功");
            this.msgData = res.data;
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;

  .form {
    width: 100%;
    .title {
      margin-left: 0.3rem;
      color: rgba(136, 136, 136, 1);
      font-size: 0.3rem;
      line-height: 1rem;
      text-align: left;
    }
    ul {
      width: 100%;

      .item {
        width: 100%;
        height: 1rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f2f3f5;

        .key {
          font-size: 0.26rem;
          line-height: 1rem;
          margin-left: 0.3rem;
          text-align: left;
          color: rgba(0, 0, 0, 1);
          .value {
            text-align: left;
            font-size: 0.28rem;
            color: rgba(153, 153, 153, 1);
          }
        }

        img {
          width: 0.12rem;
          height: 0.22rem;
          margin-right: 0.3rem;
        }
      }
    }
  }
}
</style>