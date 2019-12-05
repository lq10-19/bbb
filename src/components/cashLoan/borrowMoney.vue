<template>
  <div class="page">
    <div class="section">
      <div class="img">
        <img src="../../assets/img/cl/banner(1).png" />
      </div>
    </div>
    <div class="list" v-if="!noProductFlag">
      <div @click="loanMain(item)" v-for="(item,i) in productList" :key="i" class="item">
        <h1>
          {{item.productName}}
          <span>高额度</span>
          <span>快速到帐</span>
        </h1>
        <h2>
          <div>
            <h3 class="max">￥100,000</h3>
            <p>最高额度（元）</p>
          </div>
          <!-- <div>
            <h3>0.057%</h3>
            <p>最低日费率</p>
          </div>-->
          <div class="fbtn">立即借钱</div>
        </h2>
      </div>
    </div>
    <div class="bigbox" v-if="noProductFlag">
      <img class="nullImg" src="../../assets/img/wu@2x.png" />
      <p class="nullTxt">暂无可用产品~</p>
    </div>
    <!-- //正在加载遮罩层 -->
    <div class="Mask" v-if="showLoading">
      <van-loading size="36px" text-size="18px" vertical color="#fff">加载中...</van-loading>
    </div>
    <van-tabbar active-color="#000" inactive-color="#000" route safe-area-inset-bottom>
      <van-tabbar-item to="/borrowMoney">
        <span>借钱</span>
        <img slot="icon" src="../../assets/img/icon/jieqian1.png" />
      </van-tabbar-item>
      <van-tabbar-item to="/mine">
        <span>我的</span>
        <img slot="icon" src="../../assets/img/icon/wode2.png" />
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
      customerid: "", //客户id
      productList: [], //产品列表
      mobile: "",
      customerName: "",
      customerCertId: "",
      bindIdCard: false,
      noProductFlag: false,
      showLoading: false,
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
      this.customerid = store.get("customerId");
    }
    this.showLoading = true;
    //查询绑定信息
    this.query();
    //通过手机号查询客户id
    this.queryByMobile();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "借钱";
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
    //查询绑定信息
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
            this.customerName = res.data.customername;
            this.customerCertId = res.data.certid;
            //已绑定
            if (res.data.status == 1) {
              this.bindIdCard = true;
              //获取产品列表
              this.queryProductList();
              //未绑定
            } else if (res.data.status == 0) {
              this.bindIdCard = false;
              this.goBind();
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
    //获取产品列表
    queryProductList() {
      let url = "productInfoController/queryProductList";
      let param = {
        certid: this.customerCertId
        //certid: "612301199207250736"
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          // if (res.code == 9938) {
          //   Toast(`暂无产品，敬请期待`);
          // } else
          // if (res.code == 9939) {
          //   Toast(`暂无申请额度`);
          // } else if (res.code == 200) {
          //   if (res.data && res.data.length > 0) {
          //     this.productList = res.data;
          //     this.noProductFlag = true;
          //   } else {
          //     Toast(`${res.msg}`);
          //   }
          // }
          if (res.code == 200) {
            if (res.data && res.data.length > 0) {
              this.productList = res.data;
              this.showLoading = false;
              this.noProductFlag = false; 
            }
          } else if (res.code == 9939) {
            this.showLoading = false;
            Toast(`暂无申请额度`);
            //9938 暂无产品
          } else if (res.code == 9938) {
            this.showLoading = false;
            this.noProductFlag = true;
          } else {
            this.showLoading = false;
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转产品进件
    loanMain(item) {
      if (this.bindIdCard == false) {
        this.goBind();
      } else {
        store.set("productItem", item);
        // if (item.productName == "佰乐花" || item.productName == "循环贷" || item.productName == "现金贷") {
        if (item.accountstatus == 5) {
          Toast("产品暂未开放，敬请期待");
        } else if (item.accountstatus == 2) {
          // Toast("您在我司的相关融资已逾期，请及时还款");
          this.$router.push({
            path: "/loanMain",
            query: {
              customerid: this.customerid, //客户id
              customerName: this.customerName,
              customerCertId: this.customerCertId,
              overdue: 1 //冻结1（逾期）
            }
          });
        } else {
          this.$router.push({
            path: "/loanMain",
            query: {
              customerid: this.customerid, //客户id
              customerName: this.customerName,
              customerCertId: this.customerCertId
            }
          });
        }
      }
      //}
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
  .section {
    width: 100%;
    padding-top: 0.2rem;
    .img {
      margin: auto 0.2rem;
      margin-bottom: 0.2rem;
      img {
        //height: 4rem;
        width: 100%;
        background-size: 100% 100%;
      }
    }
  }
  .list {
    .item {
      height: 2.2rem;
      color: #000;
      background: #fff;
      border: 0.01rem solid #fff;
      border-radius: 0.2rem;
      margin: 0.2rem;
      h1 {
        font-size: 0.34rem;
        font-weight: 900;
        margin-left: 0.4rem;
        margin-top: 0.3rem;
        span {
          font-size: 0.2rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 84, 223, 1);
          line-height: 0.3rem;
          background: rgba(232, 234, 254, 1);
          margin-left: 0.15rem;
          letter-spacing: 0.02rem;
          text-align: center;
        }
      }
      h2 {
        padding: 0.2rem 0.4rem 0 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.3rem;
        div {
          h3 {
            font-size: 0.4rem;
            font-family: SF UI Display;
            font-weight: 500;
          }
          .max {
            font-size: 0.5rem;
            font-family: SF UI Display;
            font-weight: 500;
            color: rgba(238, 156, 49, 1);
          }
          p {
            margin-top: 0.1rem;
            font-size: 0.22rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 0.3rem;
          }
        }
        .fbtn {
          width: 1.8rem;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          background: linear-gradient(
            90deg,
            rgba(95, 127, 228, 1),
            rgba(58, 95, 238, 1)
          );
          box-shadow: 0 0.08rem 0.18rem 0 rgba(186, 201, 254, 1);
          border-radius: 0.3rem;
          color: #fff;
        }
      }
    }
  }
}
.bigbox {
  position: absolute;
  width: 100%;
  font-size: 0.28rem;
  background: #f2f3f5;
  .nullImg {
    width: 3rem;
    height: 2rem;
    display: block;
    margin: 0 auto;
    margin-top: 1.5rem;
  }
  .nullTxt {
    width: 50%;
    margin: 0 auto;
    margin-top: 0.5rem;
    text-align: center;
    color: rgba(208, 208, 208, 1);
    font-size: 0.3rem;
  }
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
  /deep/ .van-loading__text {
    color: #fff;
  }
}
</style>