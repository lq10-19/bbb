<template>
  <div class="bigbox">
    <div class="applyCompleteBox">
      <div class="icon"></div>
      <p>正在审核您的申请</p>
    </div>
    <div>
      <button @click="goHome">返回首页</button>
    </div>

    <!-- <div class="applyCompleteBox applyCompleteBox2">
      <div class="icon icon2"></div>
      <p class="icon2_p">
        对不起，您暂不符合申请要求，给您造成的
        <br>不便，敬请谅解，谢谢！
      </p>
    </div>
    <div>
      <button @click="goHome">返回首页</button>
    </div>-->
  </div>
</template>
<script>
import { path } from "../../config";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "提交完成";
  },
  methods: {
    goHome() {
      //window.location = "http://baiqian-car-wx-test.52baiqian.cn/u/center";
      window.location = this.$baseInfo.VUE_APP_Wx_URL + "u/center";
    }
  },
  beforeDestroy() {},
  components: {}
};
</script>
<style lang='scss' scoped>
.applyCompleteBox {
  // margin-top: 0;
  width: 100%;
  padding-top: 2rem;
  .icon {
    margin: 0 auto;
    width: 1.8rem;
    height: 1.8rem;
    background: url("../../../src/assets/img/sfz/chengongicon@2x.png") no-repeat
      center/100%;
  }
  .icon2 {
    width: 1.8rem;
    height: 1.8rem;
    background: url("../../../src/assets/img/sfz/falseicon@2x.png") no-repeat
      center/100%;
  }
  p {
    width: 100%;
    text-align: center;
    font-size: 0.3rem;
    margin-top: 0.6rem;
    line-height: 0.58rem;
  }
  .icon2_p {
    margin-top: 0.78rem;
  }
}
.applyCompleteBox2 {
  padding-top: 2.2rem;
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
</style>