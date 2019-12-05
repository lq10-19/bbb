<template>
  <div class="bigbox">
    <div class="contentBox">
      <ul class="contentUl">
        <li class="title">
          <p>佰乐花</p>
          <p class="refresh" @click="refresh" :class="{turnAround:turnAround}"></p>
        </li>
        <li class="currentState">
          <p>当前状态</p>
          <p v-if="(status == '070')||(status == '060')">审核中</p>
          <p v-else-if="(status == '080')||(status == '240')">审核通过</p>
          <p v-else-if="status == '010'">审核未通过</p>
        </li>
        <li class="appliedMoney">
          <p>申请金额</p>
          <p>￥{{businesssum}}元</p>
        </li>
        <li>
          <p>客户姓名</p>
          <p>{{customername}}</p>
        </li>
        <li>
          <p>产品名称</p>
          <p>佰乐花</p>
        </li>
        <li>
          <p>分期期限</p>
          <p>{{periods}}期</p>
        </li>
        <li>
          <p>月还款金额</p>
          <p>￥{{monthrepayment}}元</p>
        </li>
        <li>
          <p>合同编号</p>
          <p>{{serialno}}</p>
        </li>
        <li class="applideTime">
          <p>申请时间</p>
          <p>{{inputdate}}</p>
        </li>
      </ul>
    </div>
    <div class="contactUs" v-if="(status != '080' && status !='240')">
      <p>如有疑问，请拨打我们的客服热线：400-9987-103</p>
    </div>
    <div>
      <button @click="goBankCard" v-if="bankCard && (status == '080'|| status =='240')">绑定银行卡</button>
      <button @click="goContract" v-if="sign && (status == '080'|| status =='240')">合同签署</button>
    </div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import { Toast } from "mint-ui";
import { path } from "../../config";
export default {
  data() {
    return {
      turnAround: false,
      param: {
        serialno: "", //合同号
        customerid: "", //客户编号
        customertype: "03" //客户类型
      },
      businesssum: "", //申请金额
      customername: "", //客户名
      periods: "", //期数
      monthrepayment: "", //月还款
      serialno: "", //合同编号
      inputdate: "", //登记日期
      status: null, //合同状态
      bankCard: false, //是否需要绑卡
      sign: false, //是否需要签合同
      mobile:"",
      certid:"",
    };
  },
  created() {
    //console.log(this.$route.query);
    if (this.$route.query.serialno) {
      this.param.serialno = this.$route.query.serialno;
      this.param.customerid = this.$route.query.customerid;
      this.param.customertype = this.$route.query.customertype;
      this.param.customertype = "03";
    }
    //安硕获取申请金额
    if (this.$route.query.businesssum) {
      this.businesssum = this.$route.query.businesssum;
      this.inputdate = this.$route.query.inputdate;
    }
    if (this.$route.query.status) {
      // 070 060：审核中  080：审核通过  010：审核未通过  240：重新绑卡
      this.status = this.$route.query.status;
    }
    // if (this.$route.query.goBankCard) {
    //   this.bankCard = true;
    // }
    //获取合同信息
    this.getContractInfo();
    // if (this.$route.query.status == "080") {
    //   //查绑卡状态
    //   this.queryBinding();
    // }
    // this.queryBinding();
    // this.querySign()
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "进度查询";
  },
  methods: {
    //查绑卡状态
    queryBinding() {
      //let url = "http://10.80.12.37:8001/queryCashloan/queryBinding";
      let url = "queryCashloan/queryBinding";
      let param = {
        contractNo: this.param.serialno,
        payAcctBankNo: this.replaceaccount,
        customername:this.customername,
        mobile:this.mobile,
        certid:this.certid
      };
      this.$requestWx
        .post(url, param)
        .then(res => {
          console.log("绑卡状态:" + res.data.status);
          if (res.data) {
            //0 未绑卡
            if (res.data.status == 0) {
              this.bankCard = true;
              //2 绑定成功
            } else if (res.data.status == 2) {
              //查询合同签署状态
              // this.querySign();
              //直接打开电子签
              this.sign = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //查询合同签署状态
    // querySign() {
    //   let url = "queryCashloan/querySign";
    //   let param = {
    //     contractNo: this.param.serialno
    //   };
    //   this.$requestWx
    //     .post(url, param)
    //     .then(res => {
    //       console.log("合同状态");
    //       //1 未签
    //       if (res.data.status == 1) {
    //         this.sign = true;
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    //获取合同信息
    getContractInfo() {
      let url = "cashloan/getContractInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          //console.log(res, 1919);
          this.customername = res.data.customername;
          //this.monthrepayment = res.data.monthrepayment;
          this.serialno = res.data.serialno;
          //获取分期期数
          this.periods = res.data.periods;
          //获取产品编号
          this.businesstype = res.data.businesstype;
          //获取银行卡号
          this.replaceaccount = res.data.replaceaccount;
          this.mobile = res.data.mobile,
          this.certid = res.data.certid
          this.queryApply();
          if (this.status == '080'|| this.status =='240') {
            //查绑卡状态
            this.queryBinding();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取申请日期和金额
    queryApply() {
      let url = "queryCashloan/queryApply";
      let param = {
        contractNo: this.param.serialno
      };
      this.$requestWx
        .post(url, param)
        .then(res => {
          //console.log(res, 111);
          if (res.data) {
            if (this.businesssum) {
              this.getRepaymentRelative();
            } else {
              this.businesssum = res.data.businesssum;
              this.inputdate = res.data.createdat;
              this.getRepaymentRelative();
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取还款计划
    getRepaymentRelative() {
      let url = "cashloan/getRepaymentRelative";
      let param = {
        businessSum: this.businesssum + "", //融资金额
        typeNo: this.businesstype + "", //产品编号
        periods: this.periods + "" //分期期数
      };
      this.$request2
        .post(url, param)
        .then(res => {
          this.monthrepayment = res.data.monthIncome;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //刷新
    refresh() {
      this.turnAround = !this.turnAround;
      setTimeout(() => {
        this.turnAround = !this.turnAround;
        let promise1 = this.getContractInfo();
        Promise.all([promise1]).then(values => {
          Toast("数据已更新");
        });
      }, 1000);
    },
    //绑定银行卡
    goBankCard() {
      //console.log(111);
      //window.location = "http://baiqian-car-wx-test.52baiqian.cn/dk/banklist";
      window.location = this.$baseInfo.VUE_APP_Wx_URL + "dk/banklist";
    },
    //合同签署
    goContract() {
      //console.log(222);
      //window.location = path.urlWx + "qm/index";
      this.$router.push({
        path: "/blh_signature_index",
        query: { serialno: this.serialno }
      });
    }
  },
  beforeDestroy() {},
  components: {}
};
</script>
<style lang='scss' scoped>
.contentUl {
  background: #fff;
}
.contentUl {
  li {
    padding: 0 0.3rem;
    height: 0.72rem;
    line-height: 0.72rem;
    p:nth-of-type(1) {
      float: left;
    }
    p:nth-of-type(2) {
      float: right;
    }
    font-size: 0.28rem;
    color: #666;
    .refresh {
      margin-top: 0.22rem;
      height: 0.33rem;
      width: 0.33rem;
      background: url("../../../src/assets/img/refresh_icon@2x.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .title {
    padding-top: 0.1rem;
    background: #f4f4f4;
    color: #999;
    .turnAround:hover {
      animation: zhuan 1s linear 1;
    }
    @-webkit-keyframes zhuan {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  .currentState {
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #f4f4f4;
    p:nth-of-type(1) {
      color: #333;
      font-size: 0.3rem;
    }
    p:nth-of-type(2) {
      color: #ff7f36;
      font-size: 0.34rem;
    }
  }
  .appliedMoney {
    padding-top: 0.3rem;
  }
  .applideTime {
    padding-bottom: 0.3rem;
  }
}
.contactUs p {
  color: #e64340;
  text-align: center;
  font-size: 0.24rem;
  margin-top: 0.8rem;
}
button {
  display: block;
  width: 90%;
  height: 0.8rem;
  background-color: #ff7f36;
  font-size: 0.3rem;
  color: #fff;
  margin: 1rem auto;
  margin-top: 0.5rem;
  text-align: center;
  line-height: 0.8rem;
  border-radius: 0.08rem;
}
</style>