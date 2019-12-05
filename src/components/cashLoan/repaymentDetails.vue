<template>
  <div class="bigBox">
    <van-tabs @change="onChange($event)" color="#3354DF" class="van-tabs">
      <van-tab title="还款记录">
        <ul v-if="flag">
          <li class="item" v-for="(item,i) in orderList" :key="i">
            <div class="msg">
              <p class="money">
                还款金额
                <span>{{item.actualTotalAmt}}</span>元
              </p>
              <p class="time">{{item.finishDate}}</p>
            </div>
            <div class="state">
              <span>{{item.seqID}}/{{item.period}}</span>
              <!-- <p :class="item.finishDate? 'success' : 'fail'">{{item.finishDate? "还款成功" : "还款失败"}}</p> -->
              <p>{{item.repaymentState}}</p>
            </div>
          </li>
        </ul>
        <div class="bigbox" v-if="!flag">
          <img class="nullImg" src="../../assets/img/wu@2x.png" />
          <p class="nullTxt">暂时没有记录~</p>
        </div>
      </van-tab>

      <van-tab title="还款计划">
        <div class="line"></div>
        <div class="list" v-for="(item, index) in planList" :key="index">
          <div class="show" @click="change(item)">
            <img src="../../assets/img/cl/icon.jpg" class="icon" :class="{ 'active': item.show }" />
            <p>
              <span class="left">
                <h2>￥{{item.allMoney}}</h2>
                <h3>第{{item.seqID}}期</h3>
              </span>
              <span class="right">
                <h2>{{item.payDate}}</h2>
                <h3>还款日</h3>
              </span>
            </p>
          </div>
          <div class="hidden" v-if="item.show">
            <span></span>
            <p>月基本还款额:￥{{item.monthAddInteAmt}}</p>
            <p v-if="item.vipPage!=0">VIP包:￥{{item.vipPage}}</p>
            <p v-if="item.advanceFee!=0">手续费:￥{{item.advanceFee}}</p>
            <!-- <p v-if="item.manageFee!=0">管理费:￥{{item.manageFee}}</p> -->
            <!-- <p v-if="item.overDueAmt!=0">滞纳金:￥{{item.overDueAmt}}</p> -->
            <p v-for="(it, index) in item.dynamicTermList" :key="index">{{it.termName}}:￥{{it.payPrincipalamt}}</p>
            <h1>月还款总额:￥{{item.allMoney}}</h1>
          </div>
        </div>
        <div class="bigbox" v-if="!flag">
          <img class="nullImg" src="../../assets/img/wu@2x.png" />
          <p class="nullTxt">暂时没有记录~</p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast, Dialog, Collapse, CollapseItem } from "vant";
export default {
  components: {},
  data() {
    return {
      serialNo: "",
      mobile: "13632675324",
      flag: true, //默认没有合同
      orderList: [
        // {
        //   payment: "2060.24",
        //   finishdate: "2019/07/24  20:34",
        //   seqid: "1",
        //   period: "12"
        // },
        // {
        //   payment: "2060.24",
        //   finishdate: "2019/08/24  20:34",
        //   seqid: "2",
        //   period: "12"
        // }
      ], //还款记录列表
      planList: [
        // {
        //   seqID: "", //期数
        //   payDate: "", //应还日期
        //   totalAmt: "", //应还金额
        //   payprincipalAmt: "", //本金
        //   inteAmt: "", //利息
        //   dynamicTermList: [
        //     {
        //       relativeObjectNo: null,
        //       relativeObjectType: null,
        //       objectType: null,
        //       objectNo: null,
        //       seqID: "1",
        //       payDate: "2019/10/26",
        //       paytype: "A15", //费用项编码
        //       payPrincipalamt: "125.50", //费用项金额
        //       termName: "管理费" //费用项名称
        //     }
        //   ], //费用项列表
        //   monthAddInteAmt: "", //月基本还款额
        //   allMoney: "" //月还款额
        //   //show: false
        // }
      ] //还款计划表
    };
  },
  created() {
    if (this.$route.query.serialNo) {
      this.serialNo = this.$route.query.serialNo;
    }
    //获取还款记录
    this.queryReimbursementAmountRecord();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "我的还款";
  },
  methods: {
    //切换标签
    onChange(event) {
      console.log(event);
      if (event == 0) {
        //获取还款记录
        this.queryReimbursementAmountRecord();
      } else if (event == 1) {
        //获取还款计划
        this.queryRepaymentPlan();
      }
    },
    //点击显示
    change(item) {
      item.show = !item.show;
      //console.log(item.show);
    },
    //获取还款记录
    queryReimbursementAmountRecord() {
      let url = `repayment/queryReimbursementAmountRecord?objectNo=${this.serialNo}`;
      // let param = {
      //   objectno: this.serialNo
      // };
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.code == 200) {
            this.orderList = res.data;
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //获取还款计划
    queryRepaymentPlan() {
      let url = `repayment/queryRepaymentPlan?objectNo=${this.serialNo}`;
      // let param = {
      //   objectno: this.serialNo
      // };
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.code == 200) {
            this.planList = res.data;
            for (let i = 0; i < this.planList.length; i++) {
              this.$set(this.planList[i], "show", false);
            }
          } else {
            Toast(`${res.msg}`);
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
  ul {
    width: 7.1rem;
    margin: 0.1rem auto;
    li {
      padding: 0.25rem;
      //height: 1.08rem;
      margin: 0.2rem auto;
      border-radius: 0.25rem;
      background: #fff;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.55rem;
      .msg {
        text-align: left;
        .time {
          color: #ccc;
        }
      }
      .state {
        span {
          display: inline-block;
          border-radius: 0.27rem;
          width: 100%;
          height: 0.54rem;
          text-align: right;
          line-height: 0.54rem;
        }
        p {
          font-size: 0.28rem;
          font-weight: 500;
          line-height: 0.56rem;
          text-align: right;
        }
        .success {
          color: #ccc;
        }
        .fail {
          color: red;
        }
      }
    }
  }
  // .touch {
  //   white-space: nowrap;
  //   overflow: auto;
  //   p {
  //     span {
  //       display: inline-block;
  //       width: 2rem;
  //       height: 1rem;
  //       line-height: 1rem;
  //       text-align: center;
  //       color: #000;
  //     }
  //     .span1 {
  //       color: rgb(87, 178, 252);
  //       border-bottom: 0.03rem solid rgb(87, 178, 252);
  //       font-weight: 500;
  //       font-size: 0.3rem;
  //       background: #fff;
  //     }
  //   }
  // }
  .list {
    width: 100%;
    border-bottom: 0.01rem solid #f2f3f5;
    .show {
      background: #fff;
      display: flex;
      align-items: center;
      .icon {
        display: inline-block;
        margin-left: 0.3rem;
        width: 0.12rem;
        height: 0.22rem;
      }
      .active {
        transform: rotate(90deg);
      }
      p {
        margin-left: 0.3rem;
        width: 85%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3rem 0;
        .left {
          h2 {
            font-size: 0.34rem;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(0, 0, 0, 1);
            line-height: 0.48rem;
          }
          h3 {
            margin-left: 0.1rem;
            font-size: 0.3rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(182, 184, 196, 1);
            line-height: 0.48rem;
          }
        }
        .right {
          h2 {
            font-size: 0.3rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(182, 184, 196, 1);
            line-height: 0.48rem;
          }
          h3 {
            font-size: 0.3rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(182, 184, 196, 1);
            line-height: 0.48rem;
            text-align: right;
          }
        }
      }
    }
    .hidden {
      span {
        background-color: #f2f3f5;
        display: block;
        position: relative;
        left: 1.1rem;
        top: -0.1rem;
        width: 0.2rem;
        height: 0.2rem;
        transform: rotate(45deg);
      }
      p {
        margin-left: 0.8rem;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 0.48rem;
      }
      h1 {
        margin-left: 0.8rem;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 84, 223, 1);
        line-height: 0.8rem;
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
/deep/ .van-tabs__wrap {
  position: fixed;
}
.line {
  width: 100%;
  height: 0.12rem;
  background: #f2f3f5;
}
</style>