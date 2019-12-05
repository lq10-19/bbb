<template>
  <div class="page">
    <div class="section form">
      <div class="form">
        <p>绑定可立即查看可借额度</p>
        <button class="ocr" @click="ocr">
          <img src="../../assets/img/icon/ocr@2x.png" />
          身份证认证
        </button>
        <h1>
          <img src="../../assets/img/icon/name@2x.png" />
          <input v-model="name" placeholder="请先上传身份证" readonly />
        </h1>
        <h1>
          <img src="../../assets/img/icon/id@2x.png" />
          <input v-model="idCard" placeholder="请先上传身份证" readonly />
        </h1>
        <h1 v-if="emailFlag">
          <img src="../../assets/img/icon/email@2x.png" />
          <input v-model="email" placeholder="请输入电子邮箱" @blur="leave()" />
        </h1>
        <span @click="goMine">暂不绑定</span>
      </div>
      <button @click="bind" class="button">立即绑定</button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import store from "store";
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet
} from "../../public/uilt.js";
export default {
  data() {
    return {
      idCard: "",
      name: "",
      mobile: "",
      email: "",
      emailFlag: true,
      openid: ""
    };
  },
  created() {
    if (store.get("mobile")) {
      this.mobile = store.get("mobile");
    }
    if (store.get("openid")) {
      this.openid = store.get("openid");
    }
    if (this.$route.query.name) {
      this.name = this.$route.query.name;
    }
    if (this.$route.query.idCard) {
      this.idCard = this.$route.query.idCard;
    }
    //查询微信绑定表获取电子邮箱
    this.query();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
    document.getElementsByTagName("title")[0].textContent = "登录";
  },
  methods: {
    //失焦恢复视口
    leave() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    //查询微信绑定表信息(电子邮箱)
    query() {
      let url = "userBindingController/query";
      let param = {
        mobile: this.mobile,
        bindStatus: "88"
        //wechatNo: this.openid
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            // this.name = res.data.customername;
            // this.idCard = res.data.certid;
            if (res.data.email) {
              this.emailFlag = false;
              this.email = res.data.email;
            } else {
              this.emailFlag = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转OCR页
    ocr() {
      this.$router.push({
        path: "/uploadIdCard",
        query: {
          mobile: this.mobile
        }
      });
    },
    //立即绑定
    bind() {
      if (this.name && this.idCard) {
        if (this.email) {
          if (
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              this.email
            )
          ) {
            //保存信息（ocr数据->微信绑定表）
            this.checkWhiteListAndBindingAndGeo();
          } else {
            Toast("请输入正确的电子邮箱");
          }
        } else {
          Toast("请先输入电子邮箱");
        }
      } else {
        Toast("请先上传身份证");
      }
    },
    //保存信息（ocr数据->微信绑定表）
    checkWhiteListAndBindingAndGeo() {
      let url = "whiteListController/checkWhiteListAndBindingAndGeo";
      let param = {
        mobile: this.mobile,
        customername: this.name,
        certid: this.idCard,
        email: this.email,
        wechatNo: this.openid
        // mobile: "13300000001",
        // customername: "张三",
        // certid: "441302199008224483",
        // email: this.email,
        // wechatNo: this.openid
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          //身份证过期状态
          if (res.code == 200) {
            //if (res.data.isWhiteInfo) {
            store.remove("isWhiteInfo");
            //跳转借钱页
            this.goBorrowMoney();
            //} else {
            //store.remove("isWhiteInfo");
            //Toast(`${res.msg}`);
            //跳转我的
            //this.goMine();
            //}
          } else if (res.code == 9941) {
            store.set("isWhiteInfo", 1);
            //跳转我的(非白名单)
            this.goMine();
          } else {
            Toast(`${res.msg}`);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转借钱页
    goBorrowMoney() {
      this.$router.push({
        path: "/borrowMoney",
        query: {
          mobile: this.mobile
        }
      });
    },
    //暂不绑定
    goMine() {
      this.$router.push({
        path: "/mine",
        query: {
          mobile: this.mobile
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/cl/CLbg@2x.jpg");
  background-size: 100% 100%;
  .section {
    //height: 100%;
    padding-bottom: 0.6rem;
    padding-top: 5rem;
    background-image: url("../../assets/img/cl/CLbg@2x.jpg");
    background-size: 100% 100%;
    .img {
      img {
        //height: 4rem;
        width: 100%;
      }
    }
    .info {
      margin-bottom: 0;
      width: 100%;
      background-color: #ffffff;
      display: flex;
      padding: 0.2rem;
      border-radius: 3px;
      justify-content: space-around;
      box-sizing: border-box;
      .item {
        border: 0.03rem solid rgba(0, 137, 252, 1);
        width: 1.55rem;
        height: 1.55rem;
        border-radius: 1.55rem;
        line-height: 1.55rem;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
    }
    .form {
      margin: 0 auto;
      //margin-top: 5rem;
      width: 95%;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0.01rem 0.07rem 0.18rem 0px rgba(215, 51, 54, 0.78);
      border-radius: 0.41rem;
      padding-top: 0.4rem;
      padding-bottom: 0.3rem;
      p {
        width: 70%;
        font-size: 0.34rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        height: 0.4rem;
        line-height: 0.4rem;
        margin: 0 auto;
        margin-bottom: 0.4rem;
        text-align: center;
        color: #000;
        background-image: url("../../assets/img/cl/tittle@2x.png");
        background-size: 100% 100%;
        background-color: #fff;
      }
      .ocr {
        display: flex;
        justify-content: center;
        width: 90%;
        height: 0.75rem;
        border-radius: 0.41rem;
        border: 0.02rem solid #3a5fee;
        font-weight: bold;
        line-height: 0.75rem;
        font-size: 0.3rem;
        margin: 0.2rem auto;
        margin-bottom: 0;
        background: #fff;
        color: #3a5fee;
        img {
          display: inline-block;
          width: 0.32rem;
          height: 0.32rem;
          position: relative;
          top: 0.2rem;
          left: -0.2rem;
        }
      }
      h1 {
        width: 90%;
        border-radius: 0.41rem;
        border: 0.02rem solid #eee;
        background: rgba(245, 245, 245, 1);
        margin: 0 auto;
        margin-top: 0.3rem;
        img {
          display: inline-block;
          width: 0.36rem;
          height: 0.4rem;
          position: relative;
          top: 0.05rem;
          left: 0.35rem;
        }
        input {
          margin-left: 0.3rem;
          font-size: 0.3rem;
          text-indent: 0.3rem;
          line-height: 0.88rem;
          height: 0.75rem;
          display: inline-block;
        }
        /deep/ input {
          background: #f5f5f5;
        }
      }

      span {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        text-decoration: underline;
        color: #3b5eed;
        display: block;
        text-align: center;
        margin-top: 0.3rem;
        line-height: 0.3rem;
      }
      // .field {
      //   .item {
      //     border: 0.02rem solid #eee;
      //     border-radius: 0.1rem;
      //     margin: 0.1rem auto;
      //     .itemBtn {
      //       border: 0.01rem solid rgba(0, 137, 252, 1);
      //       color: rgba(0, 137, 252, 1);
      //       background: #fff;
      //     }
      //   }
      // }
    }
  }
}
.button {
  display: flex;
  justify-content: center;
  width: 80%;
  height: 0.98rem;
  border-radius: 0.45rem;
  font-weight: bold;
  line-height: 0.75rem;
  font-size: 0.36rem;
  margin: 0.4rem auto;
  background: linear-gradient(
    180deg,
    rgba(255, 227, 151, 1),
    rgba(255, 202, 54, 1)
  );
  color: #ad742c;
}

.line {
  width: 100%;
  height: 0.12rem;
  background: #f2f3f5;
}
</style>