<template>
  <div class="bigBox">
    <ul v-if="flag">
      <li class="item" v-for="(item,i) in orderList" :key="i" @click="goRepaymentDetails(item)">
        <div class="msg">
          <p class="productName">{{item.productName}}</p>
          <!-- <span v-if="item.contractStatusMinor=='190010'">财务放款中</span>
          <span v-if="item.contractStatusMinor=='190020'">逾期还款中</span>
          <span v-if="item.contractStatusMinor=='190030'">正常还款中</span> -->
          <span>{{item.contractStatusName}}</span>
        </div>
        <div class="state">
          <p class="applyAmount">
            <span class="sp1">申请金额（元）</span>
            <span class="sp2">{{item.applyAmount}}</span>
          </p>
          <p class="serialNo">
            <span class="sp1">业务编号</span>
            <span class="sp2">{{item.serialNo}}</span>
          </p>
        </div>
      </li>
    </ul>

    <div class="bigbox" v-if="!flag">
      <img class="nullImg" src="../../assets/img/wu@2x.png" />
      <p class="nullTxt">暂时没有订单~</p>
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
      customerId: "",
      mobile: "13632675324",
      flag: true, //默认没有合同
      orderList: [] //还款合同列表
    };
  },
  created() {
    if (this.$route.query.mobile) {
      this.mobile = this.$route.query.mobile;
    }
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId;
    }
    // if (store.get("customerId")) {
    //   this.customerId = store.get("customerId");
    // }
    //获取还款订单列表
    this.qyeryAllRepaymentPlan();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "我的还款";
  },
  methods: {
    //获取还款订单列表
    qyeryAllRepaymentPlan() {
      let url = `repayment/qyeryAllRepaymentPlan?customerId=${this.customerId}`;
      // let url = `repayment/qyeryAllRepaymentPlan?customerId=2015020200000288`;
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.code == 200) {
            if (res.data && res.data.length > 0) {
              this.orderList = res.data;
            } else {
              this.flag = false;
            }
          } else {
            this.flag = false;
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //还款详情页
    goRepaymentDetails(item) {
      this.$router.push({
        path: "/repaymentDetails",
        query: {
          serialNo: item.serialNo
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  ul {
    width: 7.1rem;
    margin: 0.1rem auto;
    li {
      padding: 0.25rem;
      //height: 1.08rem;
      margin: 0.2rem auto;
      border-radius: 0.25rem;
      background: #fff;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.55rem;
      .msg {
        text-align: left;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        border-bottom: 0.01rem solid #b6b8c4;
        padding-bottom: 0.2rem;
        margin-bottom: 0.15rem;
        p {
          width: 2rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 0.48rem;
        }
        span {
          display: inline-block;
          width: 3rem;
          font-size: 0.28rem;
          height: 0.54rem;
          text-align: right;
          line-height: 0.48rem;
          color: rgba(0, 137, 252, 1);
        }
      }
      .state {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 0.2rem;
        p {
          font-size: 0.28rem;
          font-weight: 500;
          line-height: 0.56rem;
          span {
            display: block;
          }
          .sp1 {
            font-size: 0.26rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(182, 184, 196, 1);
            line-height: 0.48rem;
          }
          .sp2 {
            font-size: 0.3rem;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(50, 55, 84, 1);
            line-height: 0.48rem;
          }
        }
        .serialNo {
          margin-left: 1rem;
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
      margin-top: 3rem;
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
}
</style>