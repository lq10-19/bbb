<template>
  <div class="page">
    <div>
      <van-loading color="#3354DF" size="1rem" />
      <p>载入中...</p>
    </div>
  </div>
</template>

<script>
import store from "store";
import { Toast, Dialog } from "vant";
export default {
  data() {
    return {
      param: {
        //openid: "1159412413447"
        openid: "",
        bindStatus: "",
        wxMobile: ""
      } //微信传入参数
    };
  },
  created() {
    if (this.$route.query.openId) {
      this.param.openid = this.$route.query.openId;
      store.set("openid", this.param.openid);
    }
    if (this.$route.query.bindStatus) {
      this.param.bindStatus = this.$route.query.bindStatus;
    }
    if (this.$route.query.mobile) {
      this.param.wxMobile = this.$route.query.mobile;
    }
    //测试用 正式删除
    //store.set("openid", this.param.openid);
    //查询绑定微信用户的信息
    this.bandMobile();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "";
  },
  methods: {
    //判断是否已经绑定手机
    bandMobile() {
      //http://10.81.2.202:8008/
      let url = "userBindingController/query";
      let param = {
        wechatNo: this.param.openid,
        bindStatus: this.param.bindStatus,
        mobile: this.param.wxMobile
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            //已登录
            if (res.data.isLog == 1) {
              this.mobile = res.data.mobile;
              store.set("mobile", this.mobile);
              this.goBorrowMoney();
              // if (res.data.isEndDate == 0) {
              //   Dialog.confirm({
              //     message: "您的身份证已过期，是否重新绑定身份证？"
              //   })
              //     .then(() => {
              //       // on confirm
              //       this.bindIdCard();
              //     })
              //     .catch(() => {
              //       // on cancel
              //       this.goMine();
              //     });
              // } else {
              //   this.goMine();
              // }
              //未登录
            } else if (res.data.isLog == 0) {
              this.goSignIn();
              //未登录
            } else if (res.data == 0) {
              this.goSignIn();
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //借钱
    goBorrowMoney() {
      this.$router.push({
        path: "/borrowMoney",
        query: {
          // mobile: this.mobile
        }
      });
    },
    //登录
    goSignIn() {
      this.$router.push({
        path: "/signIn",
        query: {
          //openid: this.param.openid
        }
      });
    },
    //绑定身份证
    bindIdCard() {
      this.$router.push({
        path: "/bindIdCard",
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
  flex-direction: column;
  align-items: center;
  div {
    width: 30%;
    margin: 0 auto;
    padding-top: 50%;
    p {
      text-align: center;
      font-size: 0.36rem;
      margin-top: 0.24rem;
      color: #3354DF;
    }
  }
}
</style>