<template>
  <div class="bigbox">
    <div class="title">
      <p>变更代扣银行账号申请函</p>
    </div>
    <div class="text">
      <p>贷款人、佰仟融资租赁有限公司（以下统称“贵司”）：</p>
      <p>本人因下列原因（请根据实际情况勾选或涂黑）：</p>
      <div class="reason">
        <span v-for="(item, i) in reasonList" :key="i">
          <input type="checkbox" disabled :checked="item.itemNo==userData.bankCardChangeType" />
          {{item.itemName}}
        </span>
      </div>
      <p class="explain">
        向贵司申请变更编号为
        <span>&emsp;&emsp;{{userData.contractNo}}&emsp;&emsp;</span>的《个人消费分期贷款协议》项下的“借款人银行账户”信息以及编号为
        <span>&emsp;&emsp;{{userData.contractNo}}&emsp;&emsp;</span>的《个人消费分期服务协议》项下的“客户银行账户”信息。本人授权贵司有权委托第三方支付机构从以下变更后的本人银行账户代扣本人在前述《个人消费分期贷款协议》、《个人消费分期服务协议》项下的全部应偿付款项。因该变更产生的全部风险由本人自行承担，如因此给贵司造成损失的，由本人全额赔偿。
      </p>
      <div class="msg">
        <h1>本人信息如下：</h1>
        <p>姓名：{{userData.createUserName}}</p>
        <p>公民身份号码：{{userData.customerCertId}}</p>
      </div>
      <div class="msg">
        <h1>原“借款人银行账户”、 “客户银行账户”信息：</h1>
        <p>户名：{{userData.createUserName}}</p>
        <p>开户行：{{userData.customerBankOld}}</p>
        <p>账号：{{userData.customerBankNoOld}}</p>
      </div>
      <div class="msg">
        <h1>变更后的“借款人银行账户”、 “客户银行账户”信息：</h1>
        <p>户名：{{userData.createUserName}}</p>
        <p>开户行：{{userData.customerBank}}</p>
        <p>账号：{{userData.customerBankNo}}</p>
      </div>
      <p>特此申请。</p>
      <div class="foot">
        <p>借款人/客户（签名）：</p>
        <p>日期：{{date}}</p>
      </div>
    </div>
    <fileButton path="/clEnclosureMsg" back="/clEnclosureMsg" index="7"></fileButton>
  </div>
</template>
<script>
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass
} from "../../public/uilt.js";
import store from "store";
import { path } from "../../config.js";
import { getNowFormatDate } from "../../public/uilt.js";
import fileButton from "../assembly/fileButton";
import { Toast } from "vant";
export default {
  data() {
    return {
      date: getNowFormatDate(" 年 ", " 月 ", " 日 ") || "查询中...",
      reasonList: [], //原因列表
      userData: {
        // bankCardChangeType: "01", //原因编号
        // contractNo: "123245646854641327",
        // createUserName: "张三",
        // customerCertId: "444444444444444444",
        // customerBankOld: "中国银行",
        // customerBankNoOld: "444444444444444444",
        // customerBank: "中国银行",
        // customerBankNo: "444444444444444444"
      },
      param: {
        serialNo: null,
        customerId: null
      }
    };
  },
  components: {
    fileButton
  },
  created() {
    if (this.$route.query.serialNo) {
      this.serialNo = this.$route.query.serialNo;
    }
    if (store.get("customerId")) {
      this.param.customerId = store.get("customerId");
    }
    //获取原因列表
    this.queryCodeLibrary();
    //获取变更银行卡数据
    this.queryByContractNoAndStatus();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent =
      "变更代扣银行账号申请函";
  },
  methods: {
    //获取原因列表
    queryCodeLibrary() {
      let url = "codeLibrary/queryCodeLibrary";
      this.$requestCl2
        .get(`${url}?codeNo=BankCardChangeType`)
        .then(res => {
          if (res.data) {
            this.reasonList = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取变更银行卡数据
    queryByContractNoAndStatus() {
      let url = `bankCardChange/queryByContractNoAndStatus?status=0&contractNo=${this.serialNo}`;
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.data) {
            this.userData = res.data[0];
            console.log(this.userData);
          } else {
            Toast("系统异常，请稍后再试");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  beforeDestroy() {}
};
</script>
<style lang='scss' scoped>
.bigbox {
  background-color: #fff;
  font-family: "PingFangSC-Medium", "PingFang SC";
  font-size: 0.26rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 0.4rem;

  .title {
    padding: 0.5rem 0.3rem;
    font-size: 0.36rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.36rem;
    text-align: center;
    font-weight: 800;
  }

  .text {
    width: 6.75rem;
    margin: 0.3rem auto;
    padding-bottom: 2rem;

    .reason {
      margin: 0.1rem 0;
      display: flex;
      flex-wrap: wrap;

      span {
        flex: auto;
      }
    }

    .explain {
      margin: 0.1rem 0;

      span {
        text-decoration: underline;
      }
    }

    .msg {
      margin: 0.5rem auto;

      h1 {
        background-color: #fff;
        font-family: PingFang SC;
        font-size: 0.26rem;
        font-family: PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 0.36rem;
      }
    }

    .foot {
      margin-left: 2.5rem;
    }
  }
}
</style>