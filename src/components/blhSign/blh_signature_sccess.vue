<template>
    <div class="bigBox">
        <div class="icon"></div>
        <div class="worning">
            <p>恭喜您，合同电子签名成功</p>
            <p>我司会尽快审核，请耐心等待，谢谢！</p>
        </div>
        <div class="myButton">
            <a href="javascript:;" class="weui-btn weui-btn_primary" @click="goHome">完成</a>
        </div>
    </div>
</template>

<script>
import { MessageBox, Indicator, Toast } from "mint-ui"; //要引入
import { path } from "../../config";
export default {
  data() {
    return {};
  },
  created() {
    if (sessionStorage.getItem("isVeiwList")) {
      sessionStorage.removeItem("isVeiwList");
    };
    if (sessionStorage.getItem("identifyingVal")) {
      sessionStorage.removeItem("identifyingVal");
    }
  },
  methods: {
    goHome() {
      //window.location = "http://baiqian-car-wx-test.52baiqian.cn/u/center";
      window.location = this.$baseInfo.VUE_APP_Wx_URL + "u/center";
    }
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "电子签名";
  }
};
</script>


<style lang='scss' scoped>
/* 页头导航条 */
.navBarTop {
  width: 100%;
  height: 0.45rem; /*实际40px*/
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: #15151a;
}
.navBar {
  height: 0.88rem;
  width: 100%;
  background: #15151a;
  font-family: "PingFangSC-Medium";
  color: #fff;
  position: fixed;
  left: 0;
  top: 0.4rem;
  z-index: 1000;
  .save {
    position: absolute;
    height: 0.88rem;
    line-height: 0.88rem;
    margin-left: 5.8rem;
    display: inline-block;
  }
}
.navBar .titleName {
  height: 0.88rem;
  width: 100%;
  line-height: 0.88rem;
  text-align: center;
  font-size: 0.36rem;
  font-family: "PingFangSC-Medium";
  color: #fff;
}
.goBackBtn {
  position: absolute;
  width: 1.5rem;
  height: 100%;
  left: 0;
  top: 0;
}
.navBar span {
  font-size: 0.28rem;
  position: absolute;
  top: 0;
  left: 0.73rem;
  height: 0.88rem;
  line-height: 0.88rem;
}
.navBar span:nth-of-type(1) {
  height: 0.9rem;
  line-height: 0.9rem;
}
.navBar i {
  display: inline-block;
  width: 0.23rem;
  height: 0.88rem;
  left: 0.3rem;
  line-height: 0.88rem;
  position: absolute;
  background: url("../../assets/img/contract/返回icon@2x.png") no-repeat
    center/100%;
}
// 内容区
body {
  background: #fff;
}
.bigBox {
  // margin-top: 1.28rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 2.2rem;
  padding-bottom: 0.3rem;
  .icon {
    width: 1.8rem;
    height: 1.8rem;
    margin: 0 auto;
    background: url("../../assets/img/contract/succIcon@2x.png") no-repeat
      center/100%;
  }
  .worning {
    text-align: center;
    font-family: "PingFangSC-Regular";
    font-size: 0.3rem;
    color: #333;
    margin-top: 0.8rem;
  }
}
.myButton {
  margin-top: 0.8rem;
  p {
    text-align: center;
    margin-top: 0.5rem;
  }
  a {
    width: 6.9rem;
    border-radius: 0.1rem;
    display: block;
    text-align: center;
    margin: 0 auto;
  }
}
.myButton2 {
  // margin-top: 0.2rem;
  position: absolute;
  right: 0.34rem;
  top: 0.24rem;
  font-size: 0.3rem;
  color: #2557f8;
  background: #fff;
  border-radius: 0.05rem;
  line-height: 0.4rem !important;
  width: 2.2rem;
  line-height: 0.8rem;
  border: 1px solid #2557f8;
  padding: 0;
  &:active {
    background: #dee5f8 !important;
  }
}
.weui-btn_primary {
  margin-top: 0.2rem;
  font-size: 0.3rem;
  color: #fff;
  background: #ff7f36;
  border-radius: 0;
  height: 0.8rem !important;
  line-height: 0.8rem;
  :active {
    background: #88421c !important;
  }
}
.weui-btn_primary:active {
  background: #c9622a !important;
}
</style>