<template>
  <div class="page">
    <div class="section">
      <span></span>
      <div>
        <h1>{{name}}</h1>
        <p>{{mobile}}</p>
      </div>
    </div>
    <div class="title">
      <div @click="myQuota">
        <img src="../../assets/img/icon/b'g@2x (1).png" />
        <p>额度</p>
      </div>
      <div @click="myOrder">
        <img src="../../assets/img/icon/b'g@2x (2).png" />
        <p>我的订单</p>
      </div>
      <div @click="myRepayment">
        <img src="../../assets/img/icon/b'g@2x (3).png" />
        <p>我的还款</p>
      </div>
    </div>

    <div class="list">
      <div class="list_item" @click="goChangeBankCard">
        <img src="../../assets/img/icon/b'g@2x (4).png" />
        <van-cell title="变更银行卡" is-link class="van-cell" size="large" />
      </div>
      <div class="list_item">
        <img src="../../assets/img/icon/b'g@2x (5).png" />
        <van-cell is-link class="van-cell" size="large">
          <template>
            <a href="tel:400-998-7103" class="a">
              我的客服
              <span>400-998-7103</span>
            </a>
          </template>
        </van-cell>
      </div>
      <div class="list_item" @click="setUp">
        <img src="../../assets/img/icon/b'g@2x (6).png" />
        <van-cell title="设置" is-link class="van-cell" size="large" />
      </div>
    </div>
    <van-tabbar active-color="#000" inactive-color="#000" route safe-area-inset-bottom>
      <van-tabbar-item to="/borrowMoney">
        <span>借钱</span>
        <img slot="icon" src="../../assets/img/icon/jieqian2.png" />
      </van-tabbar-item>
      <van-tabbar-item to="/mine">
        <span>我的</span>
        <img slot="icon" src="../../assets/img/icon/wode1.png" />
      </van-tabbar-item>
      <!-- <van-tabbar-item icon="vip-card" to="/borrowMoney">借钱</van-tabbar-item>
      <van-tabbar-item icon="manager" to="/mine">我的</van-tabbar-item>-->
    </van-tabbar>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import store from "store";
export default {
  data() {
    return {
      customerId: "",
      name: "",
      mobile: "",
      bindIdCard: false, //默认没绑定身份证
      isWhiteInfo: true //默认是白名单
    };
  },
  created() {
    store.remove("userBankMessage"); //清除银行信息
    store.remove("userContactsMessage"); //清除联系人信息
    store.remove("userBankMessageNew"); //清除重绑卡银行信息
    store.remove("stageIndex"); //清除期数标识
    store.remove("costList"); //清除勾选标识
    store.remove("applyDetailed"); //清除申请页面数据
    store.remove("tempDataSet"); //清除ocr信息 身份证和银行卡
    store.remove("serialNo"); //清除合同号
    store.remove("productItem"); //清除产品
    store.remove("applyMoney"); //清除申请金额
    sessionStorage.clear(); //清除阅读缓存
    if (store.get("mobile")) {
      this.mobile = store.get("mobile");
    }
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
    }
    //判断是否属于白名单
    if (store.get("isWhiteInfo")) {
      this.isWhiteInfo = false;
    }
    //判断是否已经绑定身份证
    this.query();
    //通过手机号查询客户id
    this.queryByMobile();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "loading") {
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
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
    document.getElementsByTagName("title")[0].textContent = "我的";
  },
  methods: {
    //通过手机号查询客户id
    queryByMobile() {
      let url = `customerIndInfoCtr/queryByMobile?mobile=${this.mobile}`;
      return this.$requestCl
        .get(url)
        .then(res => {
          if (res.code == 200) {
            if (res.data.customerid) {
              this.customerId = res.data.customerid;
              store.set("customerId", res.data.customerid);
            }
          } else if (res.code == 9996) {
            //去绑定身份证
            this.goBind();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //判断是否已经绑定身份证
    query() {
      let url = "userBindingController/query";
      let param = {
        mobile: this.mobile,
        bindStatus: "88"
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            this.name = res.data.customername;
            //已绑定
            if (res.data.status == 1) {
              this.bindIdCard = true;
              //未绑定
            } else if (res.data.status == 0) {
              this.bindIdCard = false;
            }
            //已过期
            if (res.data.isEndDate == 0) {
              this.bindIdCard = false;
              Dialog.confirm({
                message: "您的身份证已过期，是否重新绑定身份证？"
              })
                .then(() => {
                  // on confirm
                  this.$router.push({
                    path: "/bindIdCard",
                    query: {
                      mobile: this.mobile
                    }
                  });
                })
                .catch(() => {
                  // on cancel
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //额度
    myQuota() {
      if (this.bindIdCard == false) {
        this.goBind();
      } else if (!this.isWhiteInfo) {
        Toast("暂无额度");
      } else {
        this.$router.push({
          path: "/myQuota",
          query: {
            customerId: this.customerId
          }
        });
      }
    },
    //订单
    myOrder() {
      if (this.bindIdCard == false) {
        this.goBind();
      } else if (!this.isWhiteInfo) {
        Toast("暂无订单");
      } else {
        this.$router.push({
          path: "/myOrder",
          query: {
            customerId: this.customerId
          }
        });
      }
    },
    //还款
    myRepayment() {
      if (this.bindIdCard == false) {
        this.goBind();
      } else if (!this.isWhiteInfo) {
        Toast("暂无记录");
      } else {
        this.$router.push({
          path: "/myRepayment",
          query: {
            customerId: this.customerId
          }
        });
      }
    },
    //变更银行卡
    goChangeBankCard() {
      if (this.bindIdCard == false) {
        this.goBind();
      } else if (!this.isWhiteInfo) {
        Toast("功能逐步开放中");
      } else {
        this.$router.push({
          path: "/changeBankCard",
          query: {
            customerId: this.customerId
          }
        });
      }
    },
    //设置
    setUp() {
      this.$router.push({
        path: "/setUp",
        query: {
          mobile: this.mobile
        }
      });
    },
    //未绑定前往绑定身份证
    goBind() {
      Dialog.confirm({
        message: "您还未绑定身份证，请先前往绑定"
      })
        .then(() => {
          // on confirm
          this.$router.push({
            path: "/bindIdCard",
            query: {
              mobile: this.mobile
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  .section {
    //background-color: rgba(0, 137, 252, 1);
    background-image: url("../../assets/img/cl/bg@2x.png");
    background-size: 100% 100%;
    height: 3rem;
    display: flex;
    span {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      background-image: url("../../assets/img/cl/touxiang@2x.png");
      background-size: contain;
      background-repeat: no-repeat;
    }
    div {
      h1 {
        color: #fff;
        font-size: 0.44rem;
        margin-left: 0.5rem;
        padding-top: 0.5rem;
      }
      p {
        color: #fff;
        font-size: 0.36rem;
        margin-left: 0.5rem;
        padding-top: 0.2rem;
      }
    }
  }
  .title {
    //margin: 0.5rem auto;
    position: relative;
    top: -1rem;
    width: 95%;
    margin: 0rem auto;
    padding: 0.4rem 0;
    background: #fff;
    box-shadow: 0px 0.1rem 0.22rem 0.02rem rgba(116, 116, 116, 0.08);
    border-radius: 0.26rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    div {
      width: 1.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
      p {
        margin-top: 0.1rem;
        font-size: 0.26rem;
        font-weight: 400;
        color: #000;
      }
    }
  }
  .list {
    position: relative;
    top: -0.5rem;
    margin-left: 0.4rem;
    .list_item {
      display: flex;
      align-items: center;
      margin: 0.1rem auto;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
      .van-cell__title {
        flex: 1 1 auto;
        color: #000;
        font-weight: 500;
      }
      .van-cell__right-icon {
        color: #000;
      }
    }
  }
}
.a {
  color: #000;
  font-weight: 500;
  font-size: 0.32rem;
  span {
    margin-left: 2rem;
    color: #999999;
  }
}
.line {
  width: 100%;
  height: 0.12rem;
  background: #f2f3f5;
}
/deep/ #app {
  background-color: #fff;
}
</style>