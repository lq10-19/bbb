<template>
  <div class="bigBox">
    <div class="form">
      <div class="title">附件信息</div>
      <ul>
        <li class="item" @click="goDetails(item.fullpath)" v-for="(item,i) in msgData" :key="i">
          <span class="key">{{item.typename}}</span>
          <img src="../../../src/assets/img/sfz/bianJi@2x.png" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  components: {},
  data() {
    return {
      objectno: "",
      msgData: [] //附件列表
    };
  },
  created() {
    if(this.$route.query.objectno){
      this.objectno = this.$route.query.objectno;
    }
    this.getSigningAnnex();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "附件信息";
  },
  methods: {
    //查看详图
    goDetails(fullpath) {
      this.$router.push({
        path: "/enclosureDetails",
        query: { objectno: this.objectno, fullpath }
      });
    },
    // 获取附件信息
    getSigningAnnex() {
      let url = "cashloan/getSigningAnnex";
      let param = {
        //objectno: "1619041668" //合同号
        objectno: this.objectno //合同号
      };
      this.$request2
        .post(url, param)
        .then(res => {
          //console.log(res, 1010);
          this.msgData = res.data;
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
      font-size: 0.28rem;
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