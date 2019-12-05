<template>
  <div class="carEasyApplyContent">
    <div class="warn_top">
      <p>
        您可申请金额范围：
        <span
          v-if="userMsgList.thirtySixPeriodLimit&&userMsgList.thirtySixPeriodLimit!=0"
        >{{miniamount}}--{{userMsgList.thirtySixPeriodLimit}}</span>
        <span
          v-else-if="userMsgList.twentyFourPeriodLimit&&userMsgList.twentyFourPeriodLimit!=0"
        >{{miniamount}}--{{userMsgList.twentyFourPeriodLimit}}</span>
        <span
          v-else-if="userMsgList.eighteenPeriodLimit&&userMsgList.eighteenPeriodLimit!=0"
        >{{miniamount}}--{{userMsgList.eighteenPeriodLimit}}</span>
        <span
          v-else-if="userMsgList.twelvePeriodLimit&&userMsgList.twelvePeriodLimit!=0"
        >{{miniamount}}--{{userMsgList.twelvePeriodLimit}}</span>元，请输入您的申请金额。
      </p>
    </div>
    <div class="clearfix applyContentBox">
      <div>
        <p>姓名</p>
        <p class="thisName">{{userMsgList.customername}}</p>
      </div>
      <div>
        <p>身份证号码</p>
        <p class="thisCarId">{{userMsgList.idcard}}</p>
      </div>
      <div class="productName">
        <p>产品名称</p>
        <p class="productTitle">佰乐花</p>
      </div>
      <div class="moneyNumber2">
        <p>申请金额</p>
        <p>
          <input type="number" v-model="money" class="moneyNumber color#FC6E51" @input="inputMoney" />
        </p>
        <p class="mySpan">&nbsp;&nbsp;元</p>
        <p class="moneyWarn hide"></p>
      </div>
      <div class="switchP">
        <p>分期期限</p>
        <!-- <p class="periods_p">12期</p> -->
        <p class="periods_p">
          <select class="select1" name="select2" v-model="term" @change="changeTerm">
            <option
              class="carModelOption"
              v-if="userMsgList.twelvePeriodLimit&&userMsgList.twelvePeriodLimit!=0"
              value="12"
            >12期</option>
            <option
              class="carModelOption"
              v-if="userMsgList.eighteenPeriodLimit&&userMsgList.eighteenPeriodLimit!=0"
              value="18"
            >18期</option>
            <option
              class="carModelOption"
              v-if="userMsgList.twentyFourPeriodLimit&&userMsgList.twentyFourPeriodLimit!=0"
              value="24"
            >24期</option>
            <option
              class="carModelOption"
              v-if="userMsgList.thirtySixPeriodLimit&&userMsgList.thirtySixPeriodLimit!=0"
              value="36"
            >36期</option>
          </select>
          <!-- <span class="mySpan compile"></span> -->
        </p>
      </div>
      <!-- <div>
        <p>日费率</p>
        <p>
          <span>{{dayFeeRate}}</span>
        </p>
        <p>%</p>
      </div> -->
      <!-- <div>
        <p>应还总额</p>
        <p>
          <span class="sumMoney">100000.3256</span>
        </p>
        <p>&nbsp;&nbsp;元</p>
      </div>-->
      <div>
        <p>每月还款</p>
        <p>
          <span class="monthMoney">{{monthMoney}}</span>
        </p>
        <p>&nbsp;&nbsp;元</p>
      </div>
    </div>
    <button @click="start">开始申请</button>
  </div>
</template>
<script>
import { getNowFormatDate } from "../../public/uilt.js";
import { Toast } from "mint-ui";
import { path } from "../../config";
export default {
  data() {
    return {
      age: "", //年龄
      param: {
        serialno: "", //合同号
        customerid: "", //客户编号
        customertype: "03" //客户类型
      },
      miniamount: 0, //最低申请金额
      maxapplysum: 0, //最高申请金额
      applyputoutno: "", //旧合同号
      money: "",
      //twelvePeriodLimit: '', //12期最大额度
      //eighteenPeriodLimit: '', //18期最大额度
      //twentyFourPeriodLimit: '', //24期最大额度
      //thirtySixPeriodLimit: '', //36期最大额度
      term: 12, //期数
      dayFeeRate: "", //日费率
      monthRate: "", //月费率
      monthMoney: "", //月还款
      totalRepayments: "", //应还总额
      businesstype: "", //产品编号
      productname: "", //产品名称
      userMsgList: {
        //customername: "",
        //idcard: ""
      }, //用户信息
      replaceaccount: "" //银行卡号
    };
  },
  created() {
    console.log(this.$route.query);
    if (this.$route.query.customerid) {
      this.param.serialno = this.$route.query.serialno;
      this.param.customerid = this.$route.query.customerid;
      this.param.customertype = this.$route.query.customertype;
      this.param.customertype = "03";
    }
    //PHP传入旧合同号
    if (this.$route.query.applyputoutno) {
      this.applyputoutno = this.$route.query.applyputoutno;
    }
    // this.applyputoutno ="1618009478"
    //PHP传入12期最低申请金额
    if (this.$route.query.miniamount) {
      this.miniamount = Math.ceil(this.$route.query.miniamount);
    }
    //PHP传入12期最高申请金额
    if (this.$route.query.maxapplysum) {
      this.maxapplysum = Math.floor(this.$route.query.maxapplysum);
    }
    //获取合同信息
    this.getContractInfo();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "申请信息";
  },
  computed: {},
  methods: {
    //获取合同信息
    getContractInfo() {
      let url = "cashloan/getContractInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          //console.log(res, 1919);
          //获取银行卡号
          this.replaceaccount = res.data.replaceaccount;
          //获取产品编号
          this.businesstype = res.data.businesstype;
          //产品名称
          this.productname = res.data.productname;
          //计算年龄
          let now = new Date();
          let nowYear = now.getFullYear();
          let idcardYear = res.data.certid.substr(6, 4);
          this.age = nowYear - idcardYear;
          console.log(this.age);
          this.getWhiteListInfo();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取白名单客户信息
    getWhiteListInfo() {
      let url = "cashloan/getWhiteListInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          this.userMsgList = res.data.rCasList[0];
          this.userMsgList.thirtySixPeriodLimit = 0;
          this.userMsgList.twentyFourPeriodLimit = 0;
          this.userMsgList.eighteenPeriodLimit = 0;
          this.userMsgList.customername = res.data.rCasList[0].customername;
          this.userMsgList.idcard = res.data.rCasList[0].idcard;
          this.userMsgList.twelvePeriodLimit = this.maxapplysum;
          //console.log(this.userMsgList,10);
          //可做期数 <= 65 - 客户年龄
          //let cando = 65 - this.age;
          //console.log(cando)
          // if (cando >= 36){
          //   this.userMsgList.twelvePeriodLimit = 0;
          //   this.userMsgList.thirtySixPeriodLimit = 0;
          //   this.userMsgList.twentyFourPeriodLimit = 0;
          //   this.userMsgList.eighteenPeriodLimit = 0;
          // } else if (cando < 12) {
          //   this.userMsgList.thirtySixPeriodLimit = 0;
          //   this.userMsgList.twentyFourPeriodLimit = 0;
          //   this.userMsgList.eighteenPeriodLimit = 0;
          //   this.userMsgList.twelvePeriodLimit = 0;
          // } else if (12 <= cando && cando < 18) {
          //   this.userMsgList.thirtySixPeriodLimit = 0;
          //   this.userMsgList.twentyFourPeriodLimit = 0;
          //   this.userMsgList.eighteenPeriodLimit = 0;
          // } else if (18 <= cando && cando < 24) {
          //   this.userMsgList.thirtySixPeriodLimit = 0;
          //   this.userMsgList.twentyFourPeriodLimit = 0;
          // } else if (24 <= cando && cando < 36) {
          //   this.userMsgList.thirtySixPeriodLimit = 0;
          // }
          // if(this.userMsgList.twelvePeriodLimit == 0){
          //   Toast("您的年龄不符合申请要求")
          // }

          if (
            this.userMsgList.twelvePeriodLimit &&
            this.userMsgList.twelvePeriodLimit != 0
          ) {
            this.money = this.userMsgList.twelvePeriodLimit;
          } else if (
            this.userMsgList.eighteenPeriodLimit &&
            this.userMsgList.eighteenPeriodLimit != 0
          ) {
            this.money = this.userMsgList.eighteenPeriodLimit;
          } else if (
            this.userMsgList.twentyFourPeriodLimit &&
            this.userMsgList.twentyFourPeriodLimit != 0
          ) {
            this.money = this.userMsgList.twentyFourPeriodLimit;
          } else if (
            this.userMsgList.thirtySixPeriodLimit &&
            this.userMsgList.thirtySixPeriodLimit != 0
          ) {
            this.money = this.userMsgList.thirtySixPeriodLimit;
          }
          this.getRepaymentRelative();
          //console.log(this.userMsgList);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //动态获取还款计划
    getRepaymentRelative() {
      let url = "cashloan/getRepaymentRelative";
      if (!this.money) {
        return;
      }
      let param = {
        businessSum: this.money + "", //融资金额
        typeNo: this.businesstype + "", //产品编号
        periods: this.term + "" //分期期数
      };
      this.$request2
        .post(url, param)
        .then(res => {
          console.log(res, 88);
          this.dayFeeRate = res.data.dayFeeRate;
          this.monthRate = res.data.monthRate;
          this.monthMoney = res.data.monthIncome;
          this.totalRepayments = res.data.totalRepayments;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //改变期数
    changeTerm() {
      if (this.term == 12) {
        this.money = this.userMsgList.twelvePeriodLimit;
      } else if (this.term == 18) {
        this.money = this.userMsgList.eighteenPeriodLimit;
      } else if (this.term == 24) {
        this.money = this.userMsgList.twentyFourPeriodLimit;
      } else if (this.term == 36) {
        this.money = this.userMsgList.thirtySixPeriodLimit;
      }
      this.getRepaymentRelative();
    },
    //改变金额
    inputMoney() {
      this.getRepaymentRelative();
    },
    //开始申请
    start() {
      //可做期数 <= 65 - 客户年龄
      let cando = 65 - this.age;
      if (cando < 12 || this.age < 0) {
        Toast("您的年龄不符合申请要求");
        return;
      }
      if (this.money % 100 == 0) {
        if (this.term == 12) {
          if (
            this.miniamount <= this.money &&
            this.money <= this.userMsgList.twelvePeriodLimit
          ) {
            this.goApply();
          } else {
            console.log(
              this.miniamount,
              this.money,
              this.userMsgList.twelvePeriodLimit
            );
            Toast("请核实您的申请金额是否超出可申请金额范围");
          }
        } else if (this.term == 18) {
          if (
            this.miniamount <= this.money &&
            this.money <= this.userMsgList.eighteenPeriodLimit
          ) {
            this.goApply();
          } else {
            Toast("请核实您的申请金额是否超出可申请金额范围");
          }
        } else if (this.term == 24) {
          if (
            this.miniamount <= this.money &&
            this.money <= this.userMsgList.twentyFourPeriodLimit
          ) {
            this.goApply();
          } else {
            Toast("请核实您的申请金额是否超出可申请金额范围");
          }
        } else if (this.term == 36) {
          if (
            this.miniamount <= this.money &&
            this.money <= this.userMsgList.thirtySixPeriodLimit
          ) {
            this.goApply();
          } else {
            Toast("请核实您的申请金额是否超出可申请金额范围");
          }
        }
      } else {
        Toast("申请金额必须为100的整数倍");
      }
    },
    //跳转开始申请
    goApply() {
      //提交信息
      let promise1 = this.saveOrUpdate();
      Promise.all([promise1]).then(values => {
        this.$router.push({
          path: "/info",
          query: {
            serialno: this.param.serialno,
            customerid: this.param.customerid,
            customertype: this.param.customertype,
            replaceaccount: this.replaceaccount
          }
        });
      });
    },
    //提交信息
    saveOrUpdate() {
      let url = "cashloanAply/saveOrUpdate";
      let param = {
        putoutno: this.param.serialno, //新合同号
        applyputoutno: this.applyputoutno, //旧合同号
        productid: this.businesstype, //产品id(产品编号)
        productname: this.productname, //产品名称
        customerid: this.param.customerid, //客户id
        customername: this.userMsgList.customername, //客户名称
        certid: this.userMsgList.idcard, //证件号
        applysum: this.money, //申请金额
        applyperiod: this.term, //分期期限
        rate: this.monthRate, //月费率
        repaysum: this.totalRepayments, //应还总额
        periodpaysum: this.monthMoney //每月还款金额
      };
      this.$requestWx
        .post(url, param)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.carEasyApplyContent {
  .warn_top {
    height: 0.6rem;
    background: #e64340;
    color: #fff;
    display: flex;
    i {
      width: 0.32rem;
      height: 0.6rem;
      line-height: 0.6rem;
      margin-left: 0.32rem;
    }
    p {
      font-size: 0.24rem;
      height: 0.6rem;
      line-height: 0.6rem;
      color: #fff;
      margin-left: 0.3rem;
    }
  }
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.carEasyApplyContent > div > div {
  box-sizing: border-box;
  height: 1rem;
  width: 100%;
  background: #fff;
  padding: 0 0.32rem;
  border-bottom: 1px solid #f4f4f4;
  p {
    float: left;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.3rem;
    font-family: "PingFangSC-Regular";
    color: #666;
    position: static;
    .numbers {
      position: absolute;
      z-index: 1000;
      color: #fff;
      right: 1rem;
    }
  }
  p:nth-of-type(1) {
    width: 2.26rem;
  }
  p:nth-of-type(2) {
    color: #333;
    font-size: 0.3rem;
    font-family: "PingFangSC-Regular";
    input,
    select {
      color: #333;
    }
  }
  p:nth-of-type(3) {
    float: right;
    font-size: 0.3rem;
    color: #333;
  }
}
.moneyNumber {
  text-align: left;
  color: #666;
  font-size: 0.3rem;
}
.moneyNumber2 {
  position: relative;
  .moneyWarn {
    position: absolute;
    top: 0.3rem;
    left: 1.4rem;
    color: red;
    font-size: 0.3rem;
  }
}
.mySpan {
  display: inline-block;
  height: 0.9rem;
  line-height: 0.9rem;
}
.compile {
  width: 0.16rem;
  height: 0.25rem;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}
.productName,
.applyContentBox {
  margin-top: 0.2rem;
}
.colorFC6E51 {
  color: #fc6e51;
}
.switchP::after {
  content: url("../../../src/assets/img/triangleChange.png");
  padding-top: 0.35rem;
  text-align: right;
  display: block;
}
.periods_p,
.productTitle {
  position: relative !important;
}
.select1 {
  width: 1.6rem;
  font-size: 0.3rem;
  background-color: #fff;
}
button {
  display: block;
  width: 90%;
  height: 0.8rem;
  background-color: #ff7f36;
  font-size: 0.3rem;
  color: #fff;
  margin: 1rem auto;
  text-align: center;
  line-height: 0.8rem;
  border-radius: 0.08rem;
}
select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>