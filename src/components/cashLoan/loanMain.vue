<template>
  <div class="page">
    <div class="section">
      <p>当前可借额度</p>
      <h1>￥{{maxMoneyShow}}</h1>
    </div>
    <div class="line"></div>
    <div class="section2">
      <p>申请金额</p>
      <van-cell-group class="van-cell-group">
        <van-field
          v-model="applyMoney"
          value="请输入申请金额"
          class="van-field"
          type="number"
          size="large"
          @keyup.enter="apply"
          :placeholder="'最小申请额度'+minMoney"
        >
          <template slot="left-icon" class="symbol">
            ￥
            <!-- <van-icon name="balance-o" size="0.8rem" /> -->
          </template>
        </van-field>
      </van-cell-group>
      <!-- <span>*最小申请额度{{minMoney}}</span> -->
    </div>
    <button
      @click="apply"
      :class="applyMoney?'button':'disbutton'"
      :disabled="applyMoney?false:true"
    >立即申请</button>
  </div>
</template>

<script>
import { Toast } from "vant";
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass,
  formatMoney
} from "../../public/uilt.js";
import store from "store";
export default {
  data() {
    return {
      param: {},
      product: {},
      minMoney: "", //最小额度
      maxMoney: "", //剩余额度
      maxMoneyShow: "",
      applyMoney: "", //申请额度
      serialNo: null //合同号
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
    store.remove("applyMoney"); //清除申请金额
    sessionStorage.clear(); //清除阅读缓存
    //获取缓存产品信息
    if (store.get("productItem")) {
      this.product = store.get("productItem");
      this.maxMoney = this.product.surplusquota;
      this.maxMoneyShow = formatMoney(this.product.surplusquota);
      this.minMoney = this.product.lowprincipal;
    }
    //获取客户id、产品id、剩余额度（最高额度）、最低额度
    if (this.$route.query) {
      this.param = this.$route.query;
    }
    if (store.get("customerId")) {
      this.param.customerid = store.get("customerId");
    }
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
    document.getElementsByTagName("title")[0].textContent = "借钱";
  },
  methods: {
    // //输入格式化
    // inputFormat() {
    //   this.applyMoney = formatMoney(this.applyMoney);
    // },
    //立即申请
    apply() {
      if (this.applyMoney % 100 == 0) {
        if (
          this.applyMoney <= this.maxMoney * 1 &&
          this.applyMoney >= this.minMoney * 1
        ) {
          if (this.$route.query.overdue) {
            Toast("您在我司的相关融资已逾期，请及时还款");
          } else {
            //保存申请信息
            this.save();
          }
        } else {
          Toast(`请核实您的申请金额是否超出可申请金额范围`);
        }
      } else {
        Toast("申请金额必须为100的整数倍");
      }
    },
    //保存合同（后台新生成合同号）
    save() {
      //console.log(this.applyMoney);
      let url = "businessContractInfoCtr/save";
      let param1 = {
        applyAmount: this.applyMoney,
        customerId: this.param.customerid,
        customerName: this.param.customerName,
        customerCertId: this.param.customerCertId
      };
      let param = Object.assign({}, this.product, param1);
      return this.$requestCl
        .post(url, param)
        .then(res => {
          //console.log(res, 11);
          if (res.code == "200") {
            //获取合同号
            this.serialNo = res.data.serialNo;
            store.set("serialNo", this.serialNo);
            this.applyMoney = (this.applyMoney * 1).toFixed(2);
            store.set("applyMoney", this.applyMoney);
            //保存成功跳转
            this.applyDetailed();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转申请详情
    applyDetailed() {
      this.$router.push({
        path: "/applyDetailed",
        query: {}
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
    height: 2.9rem;
    background: linear-gradient(
      90deg,
      rgba(95, 127, 228, 1),
      rgba(58, 95, 238, 1)
    );
    p {
      padding-top: 0.6rem;
      margin-left: 0.6rem;
      color: #fff;
      font-size: 0.28rem;
    }
    h1 {
      padding-top: 0.3rem;
      margin-left: 0.4rem;
      color: #fff;
      font-size: 0.6rem;
    }
  }
  .section2 {
    margin: 0.5rem auto;
    width: 90%;
    p {
      font-size: 0.4rem;
      color: #000;
      font-weight: 600;
    }
    .van-hairline--top-bottom::after {
      border-top: none;
    }
    .van-cell-group {
      margin-top: 1rem;
      .van-cell {
        font-size: 0.6rem;
        /deep/ .van-field__left-icon {
          font-weight: 500;
          font-size: 0.8rem;
          margin-right: 0.2rem;
          margin-top: 0.1rem;
        }
        /deep/ .van-field__control::placeholder {
          font-size: 0.4rem;
          color: #B2B2B2;
          font-weight: 0;
        }
      }
    }
    span {
      margin-left: 0.3rem;
    }
  }
}
.line {
  width: 100%;
  height: 0.02rem;
  background: #f2f3f5;
}
.button {
  display: flex;
  justify-content: center;
  width: 6.2rem;
  height: 0.9rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 2rem auto;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0px 14px 16px 0px rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  color: #fff;
}
.disbutton {
  display: flex;
  justify-content: center;
  width: 6.2rem;
  height: 0.9rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 2rem auto;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 0.5),
    rgba(58, 95, 238, 0.5)
  );
  box-shadow: 0px 14px 16px 0px rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  color: #fff;
}
/deep/ .van-cell {
  font-size: 0.36rem;
  font-weight: 600;
}
</style>