<template>
  <div>
    <div class="bigBox">
      <div class="title">
        <p>电子签名服务</p>
      </div>
      <div class="content">
        <div class="icon"></div>
        <div class="cardId">
          <p>感谢选择佰仟融资租赁!</p>
          <p>实名认证成功后，您可以进行电子签名</p>
        </div>
      </div>
      <div class="info">
        <div>
          <span class="yourName"></span>
          <input readonly
            @blur="nameFun"
            v-model="queryData.name.val"
            class="yourNameIpt"
            type="text"
            placeholder="请输入姓名"
          />
          <P :class="{hide:queryData.name.hide}" class="yourNameWorm worm">请输入正确的姓名</P>
        </div>
        <div>
          <span class="cardId"></span>
          <input readonly
            @blur="cardIdFun"
            v-model="queryData.cardId.val"
            class="cardIdIpt"
            type="text"
            maxlength="18"
            placeholder="请输入身份证号码"
          />
          <P :class="{hide:queryData.cardId.hide}" class="cardIdWorm worm">请输入正确的身份证号码</P>
        </div>
        <div>
          <span class="contractNumber"></span>
          <input
            readonly
            v-model="queryData.contractNumber.val"
            class="contractNumberIpt"
            type="text"
            placeholder="请输入合同号"
          />
          <P :class="{hide:queryData.contractNumber.hide}" class="contractNumberWorm worm">请输入正确的合同号</P>
        </div>
        <div>
          <span class="mobileNumber"></span>
          <input 
            @blur="mobileFun"
            v-model="queryData.mobile.val"
            class="mobileIpt"
            type="number"
            placeholder="请输入预留手机号"
            oninput="if(value.length>6)value=value.slice(0,11)"
          />
          <P :class="{hide:queryData.mobile.hide}" class="mobileNumberWorm worm">请输入正确的手机号码</P>
        </div>
        <div>
          <span class="verification"></span>
          <input
            @blur="identifyingFun"
            v-model="queryData.identifying.val"
            class="identifyingCodeIpt"
            type="number"
            placeholder="请输入6位数字验证码"
            oninput="if(value.length>6)value=value.slice(0,6)"
          />
          <P :class="{hide:queryData.identifying.hide}" class="verificationWorm worm">请输入正确的验证码</P>
          <button
            @click="getCodeButton"
            :class="{changeButton:changeButton}"
            class="myButton2"
          >{{buttonText}}</button>
        </div>
      </div>
      <div class="myButton">
        <a href="javascript:;" @click="submit" class="weui-btn weui-btn_primary">认证</a>
        <p>POWERED BY 佰仟融资租赁</p>
        <!-- <button class="myButton" @click="goNext">下一步</button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Indicator, Toast } from "mint-ui"; //要引入
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass
} from "../../public/uilt.js";
export default {
  data() {
    return {
      checkSignDate:null,//签名检测是否一天内
      queryData: {
        name: {
          val: null,
          title: "姓名",
          hide: true
        },
        cardId: {
          val: null,
          title: "身份证号码",
          hide: true
        },
        contractNumber: {
          // val:'1619000174',
          val: null,
          title: "合同号",
          hide: true
        },
        mobile: {
          val: null,
          title: "手机号",
          hide: true
        },
        identifying: {
          val: null,
          title: "验证码",
          hide: true
        }
      },
      //获取验证码
      flag: true,
      second: 180,
      times: 0, //定时器
      changeButton: false,
      buttonText: "获取验证码",
      postData: {
        //认证数据
        certid: "",
        contractNo: "",
        mobiletelephone: "",
        userType: "", //后台返回
        challengeCode: "",
        challengeLogId: "" //后台返回
      }
    };
  },
  created() {
    this.getContractInfo();
    this.checkSignDateFun();
    // this.queryData.name.val = this.$route.query.customername;//手机号
    // this.queryData.cardId.val= this.$route.query.idCard;//身份证
    // this.queryData.mobile.val= this.$route.query.phoneNums;//手机号
    this.queryData.contractNumber.val = this.$route.query.contractNo; //合同号
  },
  methods: {
     //获取合同信息
    getContractInfo() {
      let url = "cashloan/getContractInfo";
      this.$request2
        .post(url, {serialno:this.$route.query.serialno})
        .then(res => {
          if(res.code==200){
            let data = res.data;
            this.queryData.name.val = data.customername;
            this.queryData.cardId.val = data.certid;
            this.queryData.contractNumber.val = data.serialno;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //判断是否一天内
    checkSignDateFun() {
      let url = "cashloanCheck/checkSignDate";
      this.$request2
        .post(url, {objectno:this.$route.query.serialno})
        .then(res => {
          if(res.code==200){
            this.checkSignDate = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //姓名验证
    nameFun() {
      if (!namePass(this.queryData.name.val)) {
        this.queryData.name.hide = false;
        setTimeout(() => {
          this.queryData.name.hide = true;
        }, 3000);
        return false;
      } else {
        return true;
      }
    },
    //身份证验证
    cardIdFun() {
      if (!cardIdPass(this.queryData.cardId.val)) {
        this.queryData.cardId.hide = false;
        setTimeout(() => {
          this.queryData.cardId.hide = true;
        }, 3000);
        return false;
      } else {
        return true;
      }
    },
    //手机验证
    mobileFun() {
      if (!mobilePass(this.queryData.mobile.val)) {
        this.queryData.mobile.hide = false;
        setTimeout(() => {
          this.queryData.mobile.hide = true;
        }, 3000);
        return false;
      } else {
        return true;
      }
    },
    //验证码
    identifyingFun() {
      if (!identifyingPass(this.queryData.identifying.val)) {
        this.queryData.identifying.hide = false;
        setTimeout(() => {
          this.queryData.identifying.hide = true;
        }, 3000);
        return false;
      } else {
        return true;
      }
    },
    //获取验证码
    getCodeButton() {
      if (!this.mobileFun()) {
        return;
      }
      if (this.flag == true) {
        this.flag = false;
        this.changeButton = true;
        this.buttonText = this.second + "s后重新获取";
        this.times = setInterval(() => {
          Number(this.second--);
          if (this.second <= 0) {
            this.second = 181;
            clearInterval(this.times);
            this.changeButton = false;
            this.buttonText = "获取验证码";
            this.flag = true;
          } else {
            this.changeButton = true;
            this.buttonText = this.second + "s后重新获取";
          }
        }, 1000);
        this.$request
          .get("sms/sendMsg?phoneNums=" + this.queryData.mobile.val)
          .then(res => {
            Indicator.close();
            console.log("a2a", res);
            if (res.data && res.code == "200") {
              let resData = res.data;
              Toast("获取验证码成功");
            }
          })
          .catch(error => {
            Indicator.close();
            console.log("error" + error);
          });
      }
    },
    submit() {
      if(!this.checkSignDate){
        Toast('暂不能签署合同，请联系您的销售经理');
        return
      }
      var allPass = true;
      for (var key in this.queryData) {
        if (!this.queryData[key].val) {
          // Toast("请输入"+this.queryData[key].title);
          this.queryData[key].hide = false;
          setTimeout(() => {
            for (var key2 in this.queryData) {
              this.queryData[key2].hide = true;
            }
          }, 3000);
          allPass = false;
        } else {
          this.queryData[key].hide = true;
        }
      }
      if (
        !allPass ||
        !this.nameFun() ||
        !this.cardIdFun() ||
        !this.mobileFun() ||
        !this.identifyingFun()
      ) {
        return;
      }
      console.log("走了");
      let putoutNO = this.queryData.contractNumber.val;
      let customername = this.queryData.name.val;
      let idCard = this.queryData.cardId.val;
      let verifiCode = this.queryData.identifying.val;
      let phoneNums = this.queryData.mobile.val;
      Indicator.open({
                    text: '认证中...',
                    spinnerType: 'fading-circle',
                });
      this.$request
        .get(
          "elecSignBLH/queryByParams?putoutNO=" +
            putoutNO +
            "&idCard=" +
            idCard +
            "&verifiCode=" +
            verifiCode +
            "&phoneNums=" +
            phoneNums +
            "&customername=" +
            customername
        )
        .then(res => {
          Indicator.close();
          console.log("res", res);
          if (res && res.code == "200") {
            let resData = res.data;
            this.$router.push({
              path: "blh_signature_list",
              query: {
                contractNo: resData.putoutNO,
                idCard: resData.idCard,
                userName: resData.userName,
                signatureTime:resData.signatureTime,
                contractStatus:resData.contractStatus,
                mobiletelephone:resData.phone
              }
            });
          }
        })
        .catch(error => {
          Indicator.close();
          console.log("error" + error);
        });
    },
    goNext() {
      this.$router.push({
        path: "/blh_signature_list",
        query: {
          
        }
      });
    }
  },
  watch: {
    queryData: {
      handler: function(newVal, oldVal) {},
      deep: true
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
  // background: url("../../assets/img/contract/返回icon@2x.png") no-repeat center/100%;
}
// 内容区r
.bigBox {
  // margin-top: 1.28rem;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  padding-bottom: 0.3rem;
  .title {
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    background: #ff5b5b;
    text-align: center;
    font-size: 0.3rem;
    color: #fff;
    box-sizing: border-box;
    p {
      color: #fff;
    }
  }

  .content {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    // height: 3.53rem;
    background: #f4f4f4;
    margin: 0 auto;
    .icon {
      width: 1.5rem;
      height: 1.5rem;
      background: url("../../assets/img/logo.png") no-repeat center/100%;
      margin: 0.4rem auto 0.3rem auto;
      box-sizing: border-box;
    }
    .cardId {
      width: 100%;
      height: 100%;
      top: 1.51rem;
      p {
        font-size: 0.3rem;
        text-align: center;
        color: #333;
      }
      p:nth-of-type(2) {
        font-size: 0.24rem;
      }
    }
  }
  .reverseSide {
    margin-top: 0.3rem;
    img {
      // background:url("../../assets/img/contract/身份证反面icon@2x.png") no-repeat center/100%;
    }
  }
  .closeUp {
    img {
      // background:url("../../assets/img/contract/申请人近照icon@2x.png") no-repeat center/100%;
    }
  }
  .example {
    margin-top: 0.3rem;
    width: 100%;
    height: 4.5rem;
    background: #f4f8fc;
    p {
      color: #fc6e51;
      font-size: 0.28rem;
      margin-left: 0.61rem;
    }
    p:nth-of-type(2) {
      text-align: center;
      margin-top: 0.41rem;
      margin-left: 0;
    }
    img {
      width: 3.5rem;
      height: 2.19rem;
      background: red;
      margin: 0.5rem auto 0 auto;
    }
  }
}
.info {
  width: 100%;
  height: 100%;
  background: #fff;
  margin-top: 0.3rem;
  div {
    box-sizing: border-box;
    height: 1rem;
    width: 100%;
    background: #fff;
    padding-left: 0.34rem;
    // background: red;
    border-bottom: 1px solid #f4f4f4;
    position: relative;
    span {
      display: inline-block;
      width: 0.34rem;
      height: 1rem;
    }
    input {
      height: 0.98rem;
      vertical-align: top;
      font-size: 0.26rem;
      margin-left: 0.4rem;
    }
    .yourName {
      background: url("../../assets/img/contract/nameIcon@2x.png") no-repeat
        center/100%;
    }
    .cardId {
      background: url("../../assets/img/contract/carIdIcon@2x.png") no-repeat
        center/100%;
    }
    .contractNumber {
      background: url("../../assets/img/contract/contractIcon@2x.png") no-repeat
        center/100%;
    }
    .mobileNumber {
      background: url("../../assets/img/contract/mobileIcon@2x.png") no-repeat
        center/100%;
    }
    .verification {
      background: url("../../assets/img/contract/verificationIcon@2x.png")
        no-repeat center/100%;
    }
  }
}
.myButton {
  // margin-top: 0.8rem;
  p {
    text-align: center;
    margin-top: 0.3rem;
    font-size: 0.2rem;
  }
  a {
    width: 6.9rem;
    display: block;
    text-align: center;
    border-radius: 0.1rem;
    margin: 0 auto;
  }
}
.myButton2 {
  height: 0.5rem;
  box-sizing: border-box;
  position: absolute;
  right: 0.3rem;
  top: 0.5rem;
  transform: translateY(-50%);
  font-size: 0.26rem;
  color: #ff7f36;
  background: #fff;
  border-radius: 0.05rem;
  // line-height:  0.4rem !important;
  width: 2rem;
  line-height: 0.4rem;
  border: 1px solid #ff7f36;
  padding: 0;
  &:active {
    background: #f8f1ed !important;
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
//警告提示语
.info input {
  position: relative;
}
.worm {
  position: absolute;
  z-index: 1000;
  left: 1.07rem;
  top: 0.65rem;
  color: #ff5b5b;
  font-size: 0.26rem;
}
.changeButton {
  background: #ff7f36;
  color: #fff;
}
</style>