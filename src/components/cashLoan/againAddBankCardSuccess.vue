<template>
  <div class="page">
    <div class="section">
      <img src="../../assets/img/success.png" />
      <h1>
        <p class="p1">银行卡变更成功!</p>
        <p class="p2">审核结果请留意短信或微信公众号通知</p>
      </h1>
    </div>
    <div class="line"></div>
    <button class="button" @click="goMine">返回个人中心</button>
  </div>
</template>

<script>
import store from "store";
import { Toast } from "vant";
export default {
  data() {
    return {};
  },
  created() {
    store.remove("userBankMessage"); //清除银行信息
    store.remove("userContactsMessage"); //清除联系人信息
    store.remove("userBankMessageNew"); //清除重绑卡银行信息
    store.remove("stageIndex"); //清除期数标识
    store.remove("applyDetailed"); //清除申请页面数据
    store.remove("tempDataSet"); //清除ocr信息 身份证和银行卡
    store.remove("serialNo"); //清除合同号
    store.remove("recordIdList"); //清除记录id列表
    store.remove("serialNoList"); //清除合同号列表
    sessionStorage.clear(); //清除阅读缓存
    // store.remove("verificationCode"); //清除金融验证码
    // store.remove("lasserialno"); //清除流水号
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "绑定成功";
  },
  methods: {
    goMine() {
      this.$router.push({
        path: "/mine",
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
    background: #fff;
    color: #000;
    padding: 0.8rem;
    img {
      display: inline-block;
      width: 0.8rem;
      height: 0.8rem;
      position: relative;
    }
    h1 {
      display: inline-block;
      font-size: 0.32rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      margin-left: 0.3rem;
      .p2 {
        font-size: 0.28rem;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 0.36rem;
        margin-top: 0.1rem;
      }
    }
  }
}
.line {
  width: 100%;
  height: 0.12rem;
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
  margin: 1rem auto;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  color: #fff;
}
</style>