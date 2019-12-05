<template>
  <div class="page">
    <div class="section form">
      <div class="form">
        <van-cell-group class="field">
          <p>
            <van-field
              v-model.trim="mobile"
              placeholder="请输入手机号码"
              class="item"
              left-icon
              center
              clearable
              oninput="if(value.length>11)value=value.slice(0,11)"
              @blur="leave()"
            >
              <template slot="left-icon">
                <span class="icon1"></span>
              </template>
            </van-field>
          </p>
          <p class="p2">
            <van-field
              v-model="sms"
              center
              clearable
              placeholder="请输入验证码"
              class="item"
              oninput="if(value.length>6)value=value.slice(0,6)"
              @blur="leave()"
            >
              <template slot="left-icon">
                <span class="icon2"></span>
              </template>
              <!-- <van-button
                slot="button"
                size="small"
                type="primary"
                class="itemBtn"
                @click="submitCheck"
              >{{buttonText}}</van-button>-->
            </van-field>
            <button class="itemBtn" @click="submitCheck">{{buttonText}}</button>
          </p>
        </van-cell-group>
      </div>
      <button @click="sign" class="button">立即登录</button>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import store from "store";
import { debug } from "util";
export default {
  data() {
    return {
      openid: "",
      mobile: "", //手机号
      sms: null, //验证码
      //获取验证码
      flag: true,
      second: 180,
      times: 0, //定时器
      buttonText: "获取验证码"
    };
  },
  created() {
    if (store.get("openid")) {
      this.openid = store.get("openid");
    }
  },
  mounted() {
    //document.getElementsByTagName("body")[0].style.background = "#fff";
    document.getElementsByTagName("title")[0].textContent = "登录";
    // if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL);
    //   window.addEventListener("popstate", this.goBack, false);
    // }
  },
  // destroyed() {
  //   window.removeEventListener("popstate", this.goBack, false);
  // },
  beforeRouteLeave(to, from, next) {
    if (to.name == "loading" || to.name == "setUp") {
      Dialog.confirm({
        message: "确定返回公众号？"
      })
        .then(action => {
          Toast(`${action}`);
          window.location = "http://baiqian-car-wx-test.52baiqian.cn";
        })
        .catch(() => {});
    } else {
      next();
    }
  },
  methods: {
    //失焦恢复视口
    leave() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    // goBack() {
    //   history.pushState(null, null, document.URL);
    //   Dialog.confirm({
    //     message: "确定返回公众号？"
    //   })
    //     .then(action => {
    //       //this.$router.go(-2);
    //       window.location =
    //         "http://baiqian-car-wx-test.52baiqian.cn/xjd/loading";
    //     })
    //     .catch(() => {});
    // },
    //获取验证码
    submitCheck() {
      if (this.flag == false) {
        return;
      }
      if (!/^1\d{10}$/.test(this.mobile)) {
        Toast("请输入正确的手机号码");
        return;
      }
      if (this.flag == true) {
        this.flag = false;
        this.buttonText = this.second + "s后重试";
        this.times = setInterval(() => {
          Number(this.second--);
          if (this.second <= 0) {
            this.second = 181;
            clearInterval(this.times);
            this.buttonText = "获取验证码";
            this.flag = true;
          } else {
            this.buttonText = this.second + "s后重试";
          }
        }, 1000);
        this.$requestCl
          .get("userBindingController/sendLoginMsg?phoneNums=" + this.mobile)
          .then(res => {
            if (res.code == "200") {
              Toast("获取验证码成功");
            } else {
              Toast(`${res.msg}`);
            }
          })
          .catch(error => {
            console.log("error" + error);
          });
      }
    },
    //立即登录
    sign() {
      if (!this.mobile) {
        Toast("您还未输入手机号");
      } else if (!this.sms) {
        Toast("您还未输入验证码");
      } else {
        //验证验证码
        this.$requestCl
          .get(
            `sms/checkPhoneNumsAndCode?phoneNums=${this.mobile}&verifiCode=${this.sms}`
          )
          .then(res => {
            if (res.code == "200") {
              //判断是否已经绑定身份证
              this.bandIdCard();
            } else {
              Toast(`${res.msg}`);
            }
          })
          .catch(error => {
            console.log("error" + error);
          });
      }
    },
    //判断是否已经绑定身份证
    bandIdCard() {
      let url = "userBindingController/save";
      let param = {
        wechatNo: this.openid,
        mobile: this.mobile
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //已绑定
            if (res.data.status == 1) {
              this.goBorrowMoney();
              //未绑定
            } else if (res.data.status == 0) {
              this.goBindIdCard();
            }
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //绑定身份证
    goBindIdCard() {
      this.$router.push({
        path: "/bindIdCard",
        query: {
          mobile: this.mobile
        }
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
    }
  },
  updated() {
    store.set("mobile", this.mobile);
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
    padding-top: 3.2rem;
    background-image: url("../../assets/img/cl/CLbg@2x.jpg");
    background-size: 100% 100%;
    // .img {
    //   div {
    //     //height: 4rem;
    //     width: 100%;
    //   }
    // }
    // .info {
    //   width: 80%;
    //   display: flex;
    //   padding: 0.2rem;
    //   border-radius: 3px;
    //   justify-content: space-around;
    //   box-sizing: border-box;
    //   .item {
    //     border: 0.03rem solid #3354df;
    //     width: 1.55rem;
    //     height: 1.55rem;
    //     border-radius: 1.55rem;
    //     line-height: 1.55rem;
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    //   }
    //   img {
    //     width: 0.8rem;
    //     height: 0.8rem;
    //   }
    // }
    .form {
      margin: 0 auto;
      margin-top: 3.6rem;
      width: 90%;
      background: transparent;
      .field {
        box-shadow: 0.01rem 0.07rem 0.18rem 0px rgba(215, 51, 54, 0.78);
        border-radius: 0.32rem;
        padding: 0.1rem 0;
        p {
          margin: 0.3rem;
          text-align: center;
          color: #cccccc;
          width: 6.18rem;
          height: 0.84rem;
          background: rgba(245, 245, 245, 1);
          border-radius: 0.41rem;
          .item {
            margin: 0.1rem auto;
            height: 0.84rem;
            line-height: 1rem;
            .icon1 {
              display: inline-block;
              margin: 0 0.1rem;
              margin-top: 0.4rem;
              height: 0.4rem;
              width: 0.36rem;
              background: url("../../assets/img/icon/phone@2x.png");
              background-size: cover;
            }
            .icon2 {
              display: inline-block;
              margin: 0 0.1rem;
              margin-top: 0.4rem;
              height: 0.4rem;
              width: 0.36rem;
              background: url("../../assets/img/icon/code@2x.png");
              background-size: cover;
            }
          }
        }
        .p2 {
          width: 55%;
          .itemBtn {
            position: relative;
            top: -0.9rem;
            left: 3.2rem;
            border: 0.01rem solid #3354df;
            color: #3354df;
            border-radius: 0.4rem;
            height: 0.75rem;
            width: 2rem;
            background: #fff;
          }
        }
      }
    }
  }
}
.button {
  display: flex;
  justify-content: center;
  width: 80%;
  height: 0.9rem;
  border-radius: 0.45rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 0.5rem auto;
  background: linear-gradient(
    180deg,
    rgba(255, 227, 151, 1),
    rgba(255, 202, 54, 1)
  );
  color: rgba(173, 116, 44, 1);
}
/deep/ .van-button--primary {
  color: #fff;
  background-color: #fff;
  border: 1px solid #fff;
}
/deep/ .van-cell {
  background-color: transparent;
}
/deep/ [class*="van-hairline"]::after {
  border: 0;
}
/deep/ .van-field__control {
  height: 0.5rem;
  padding: 0.1rem 0;
  line-height: 0.5rem;
}
.line {
  width: 100%;
  height: 0.12rem;
  background: #f2f3f5;
}
</style>