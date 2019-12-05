<template>
  <div class="page">
    <div class="section">
      <div>
        <van-circle
          class="circle"
          v-model="rate"
          color="#3B5EFD"
          size="3.5rem"
          layer-color="#E9EDFF"
          :clockwise="false"
          :stroke-width="60"
        >
          <p>总额度(元)</p>
          <h1>￥{{maxMoney}}</h1>
        </van-circle>
      </div>
    </div>
    <div class="line"></div>
    <div class="section2">
      <div class="apply">
        <p class="icon">
          <van-icon name="balance-o" size="0.5rem" />
          <span>可用额度(元)</span>
        </p>
        <p class="num">￥{{surplusquota}}</p>
      </div>
      <div class="surplus">
        <p class="icon">
          <van-icon name="balance-o" size="0.5rem" />
          <span>已用额度(元)</span>
        </p>
        <p class="num">￥{{usedquota}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Circle } from "vant";
import store from "store";
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass,
  formatMoney
} from "../../public/uilt.js";
export default {
  data() {
    return {
      customerId: null,
      maxMoney: null, //最高额度
      usedquota: null, //已申请额度
      surplusquota: null, //剩余额度
      rate: null //已申请与最高比例
    };
  },
  created() {
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId;
    }
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
    }
    //获取授信额度信息
    this.queryBySerialNo();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "额度";
  },
  methods: {
    //获取授信额度信息
    queryBySerialNo() {
      let url = "rmesCreditLineController/queryByCustomerId";
      let param = {
        customerid: this.customerId
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            this.maxMoney = formatMoney(res.data.quota);
            this.usedquota = formatMoney(res.data.usedquota);
            this.surplusquota = formatMoney(res.data.surplusquota);
            this.rate = (res.data.surplusquota / res.data.quota) * 100;
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //格式化数字
    // formatMoney(number) {
    //   let dataval = parseInt(number);
    //   let data2 = dataval
    //     .toFixed(2)
    //     .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
    //   return data2;
    // }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .section {
    height: 5rem;
    background: #fff;
    div {
      position: relative;
      top: 0.15rem;
      width: 4.5rem;
      height: 4.5rem;
      margin: 0rem auto;
      display: flex;
      color: #000;
      .circle {
        margin: auto;
        font-size: 0.3rem;
        display: inline-block;
        p {
          display: block;
          width: 100%;
          height: 0.4rem;
          line-height: 0.4rem;
          position: relative;
          top: 0.9rem;
          text-align: center;
          font-size: 0.3rem;
        }
        h1 {
          display: inline-block;
          width: 100%;
          height: 0.5rem;
          line-height: 0.5rem;
          position: relative;
          top: 1.2rem;
          text-align: center;
          font-size: 0.5rem;
        }
      }
    }
  }
  .section2 {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    //background: #fff;
    font-size: 0.32rem;
    font-weight: 500;
    .apply {
      width: 3.3rem;
      height: 1.6rem;
      color: #fff;
      margin: 0.3rem;
      background: linear-gradient(
        -90deg,
        rgba(109, 136, 255, 1),
        rgba(59, 94, 253, 1)
      );
      border-radius: 0.26rem;
    }
    .surplus {
      width: 3.3rem;
      height: 1.6rem;
      color: #3b5efd;
      margin: 0.3rem;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0rem 0.1rem 0.22rem 0.02rem rgba(116, 116, 116, 0.08);
      border-radius: 0.26rem;
    }
    .icon {
      display: flex;
      align-items: center;
      margin-top: 0.2rem;
      margin-left: 0.35rem;
      text-align: center;
    }
    .num {
      margin-top: 0.2rem;
      text-align: center;
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
  width: 5rem;
  height: 0.9rem;
  border-radius: 0.1rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 2rem auto;
  background: linear-gradient(
    180deg,
    rgba(0, 137, 252, 1),
    rgba(1, 163, 246, 1)
  );
  color: #fff;
}
</style>