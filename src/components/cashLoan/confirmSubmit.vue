<template>
  <div class="bigbox">
    <div class="editPersonalInfoBox">
      <ul>
        <li class="title">
          <p>您的融资信息如下：</p>
        </li>
        <li>
          <p>申请金额</p>
          <p class="applyMoney">{{pageInfo.applyAmount}}元</p>
        </li>
        <li>
          <p>分期期限</p>
          <p class="period">{{pageInfo.period}}期</p>
        </li>
        <li>
          <p>银行账号</p>
          <p class="bandNumber">{{pageInfo.customerBankNo}}</p>
        </li>
        <!-- <li>
          <p>日利率</p>
          <p class="monthlyInterestRate">{{dayFeeRate}}%</p>
        </li>-->
        <li>
          <p>
            每月还款额
            <span>（具体请以合同为准）</span>
          </p>
          <p id="monthlyPayments">{{pageInfo.monthRepaymentAmount}}元</p>
        </li>
      </ul>
    </div>

    <div class="mobileBox">
      <div>
        <!-- <div class="mobileNumber clearfix">
          <p class="mobileClass">
            <span>输入合同验证码：</span>
          </p>
        </div>-->
        <div class="identifyingCode">
          <span>合同验证码：</span>
          <input
            @blur="identifyingFun"
            v-model="identifyingVal"
            class="identifyingCodeIpt"
            type="number"
            placeholder="请输入验证码"
            oninput="if(value.length>6)value=value.slice(0,6)"
          />
          <button
            @click="getIdentifying"
            :class="{changeButton:changeButton}"
            class="myButton2"
          >{{buttonText}}</button>
          <p :class="{hide:identifying}" class="warning">请输入正确的验证码</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <div @click="changeBoxFun">
        <span class="bbb">
          <span :class="{changeBox:changeBox}" class="myCheckbox"></span>
          <p>我已阅读并同意以下全部条款和内容，并同意采取填写手机短信验证码的方式签署下述合同：</p>
        </span>
      </div>
      <div class="mrginTop">
        <span
          @click="goFileDetails(item,index)"
          v-for="(item,index) in fileList"
          :key="index"
          class="gray"
          :class="{myColor:item.isView}"
        >
          <span :class="{myColor1:item.isView}" class="hook"></span>
          《{{item.docName}}》
        </span>
        <!-- <span
          @click="goFileDetails(item)"
          v-for="(item,index) in fileList"
          :key="index"
          class="gray"
          :class="{myColor:item.isView}"
          v-if="index==fileList.length-1"
        >《{{item.docName}}》</span>-->
        <!-- <span>全部条款和内容</span> -->
      </div>
      <!-- <div>并同意采取填写手机短信验证码的方式签署上述合同。</div> -->
      <!-- <div class="myColor2">（点击合同名称查看相应合同条款。）</div> -->
    </div>

    <div class="myButton">
      <a href="javascript:;" @click="submit" class="weui-btn weui-btn_primary">提交申请</a>
    </div>
  </div>
</template>
<script>
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass,
  leave
} from "../../public/uilt.js";
import { MessageBox, Indicator, Toast } from "mint-ui";
import store from "store";
import { path } from "../../config.js";
export default {
  data() {
    return {
      phone: "",
      param: {
        serialNo: "",
        customerId: ""
      },
      businesssum: "", //申请金额
      period: "", //分期期数
      replaceaccount: "", //放款账号
      businesstype: "", //产品编号
      dayFeeRate: "", //日费率
      monthIncome: "", //月还款额
      contractstatus: "", //合同状态
      //电子签数据
      identifying: true,
      identifyingVal: null,
      changeBox: false, //同意勾选
      //获取验证码
      flag: true,
      second: 180,
      times: 0, //定时器
      changeButton: false,
      buttonText: "获取验证码",
      postData: {
        //认证数据
        certid: "", //身份证号
        contractNo: "", //合同号
        mobiletelephone: "", //手机号
        challengeCode: "",
        fileType: "CONTRACT" //电子签
      },
      //页面数据
      pageInfo: {},
      fileList: [], //文件列表
      isVeiwList: [] //文件阅读缓存列表
    };
  },
  created() {
    //传参serialNo、customerId
    if (this.$route.query) {
      this.param = this.$route.query;
    }
    if (store.get("serialNo")) {
      this.param.serialNo = store.get("serialNo");
    }
    if (store.get("customerId")) {
      this.param.customerId = store.get("customerId");
    }
    //活体识别未通过
    let urlinfo = window.location.href;
    console.log(urlinfo);
    let search = "code=0";
    let start = urlinfo.indexOf(search);
    console.log(start);
    if (start == -1) {
      this.$router.push({
        path: "/bankCardPhoto",
        query: {
          serialNo: this.param.serialNo,
          customerId: this.param.customerId
        }
      });
    }
    //查询合同详情
    this.queryOrderInfo();
    //获取pdf或html合同文件
    this.queryByContractNoAndFileType();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "融资确认";
  },
  methods: {
    //查询订单详情
    queryOrderInfo() {
      let url = "businessContractInfoCtr/queryOrderInfo";
      let param = {
        serialNo: this.param.serialNo
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            this.pageInfo = res.data.businessContractInfo;
            this.period = res.data.businessContractInfo.period;
            //根据姓名身份证查询客户信息中的手机号
            this.queryByCustomerCertId();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //根据姓名身份证查询客户信息
    queryByCustomerCertId() {
      let url = "customerIndInfoCtr/queryByCustomerCertId";
      let param = {
        certid: this.pageInfo.customerCertId,
        customername: this.pageInfo.customerName
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data.mobiletelephone) {
            this.phone = res.data.mobiletelephone;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //提交审核
    submit() {
      //console.log(!this.changeBox);
      if (!this.changeBox) {
        Toast("请查看相关文件后勾选“同意”");
      } else {
        //提交电子签
        this.submitFun();
      }
    },
    //提交电子签
    submitFun() {
      //测试用
      //this.update();
      if (!identifyingPass(this.identifyingVal)) {
        this.identifying = false;
        setTimeout(() => {
          this.identifying = true;
        }, 3000);
        return;
      } else if (!this.changeBox) {
        Toast("请勾选'我已阅读并同意'");
        return;
      }
      this.postData.challengeCode = this.identifyingVal;
      Indicator.open({
        text: "提交中...",
        spinnerType: "fading-circle"
      });
      this.$requestCl
        .post("signature/electronicSign", [this.postData])
        .then(res => {
          Indicator.close();
          if (res.code == 200) {
            Toast("电子签名成功！");
            //告诉后台电子签成功
            this.update();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          Indicator.close();
          console.log("error" + error);
        });
    },
    //提交信息
    update() {
      let productItem = {};
      if (store.get("productItem")) {
        productItem = store.get("productItem");
      }
      //console.log(productItem);
      let url = `businessContractInfoCtr/update`;
      let param = {
        serialNo: this.param.serialNo,
        customerId: this.pageInfo.customerId,
        period: this.period,
        productId: productItem.productId,
        versionId: productItem.versionId,
        applyAmount: this.pageInfo.applyAmount,
        customerName: this.pageInfo.customerName
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            store.remove("isVeiwList");
            store.remove("userMessage");
            this.$router.push({
              path: "/submitSuccess",
              query: {}
            });
          } else if (res.code == 1111) {
            Toast(`合同号：${res.msg}已完成签署，请勿重复提交`);
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
          this.$router.push({
            path: "/submitFail",
            query: {}
          });
        });
    },
    //勾选同意
    changeBoxFun() {
      this.changeBox = !this.changeBox;
      this.fileList.forEach((v, i) => {
        if (v.isView == false) {
          this.changeBox = false;
          Toast("请先阅读全部合同条款");
        }
      });
    },
    //阅读附件
    isViewListSave() {
      if (
        sessionStorage.getItem("isVeiwList") &&
        sessionStorage.getItem("isVeiwList") != "undefined"
      ) {
        //有值
        this.isVeiwList = JSON.parse(sessionStorage.getItem("isVeiwList"));
        console.log("有");
      } else {
        console.log("无");
        this.fileList.forEach((v, i) => {
          this.isVeiwList.push({ docName: v.docName, isView: false });
        });
      }
      this.fileList.forEach((v, i) => {
        this.isVeiwList.forEach((v2, i2) => {
          if (v.docName == v2.docName) {
            v.isView = v2.isView;
          }
        });
      });
      console.log("this.isVeiwList", this.isVeiwList);
      this.fileList = Object.assign([], this.fileList);
    },
    //获取pdf或html合同文件
    queryByContractNoAndFileType() {
      let url = `docAttachmentCtr/queryByContractNoAndFileType?fileType=CONTRACT&contractNo=${this.param.serialNo}`;
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.data && res.code == "200") {
            console.log("文件");
            this.fileList = res.data;
            this.isViewListSave();
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    goFileDetails(item, index) {
      if (this.identifyingVal) {
        sessionStorage.setItem("identifyingVal", this.identifyingVal);
      }
      this.isVeiwList.forEach((v, i) => {
        if (v.docName == item.docName) {
          v.isView = true;
        }
      });
      sessionStorage.setItem("isVeiwList", JSON.stringify(this.isVeiwList));
      this.isViewListSave();
      //console.log("fileList", this.fileList);
      //console.log("isVeiwList", this.isVeiwList);
      if (
        item.docPath.indexOf(".html") != -1 ||
        item.docPath.indexOf(".jpg") != -1
      ) {
        if (item.docName == "个人信息查询及使用授权书") {
          this.$router.push({
            path: "/PersonalInfoWarrant",
            query: { docType: item.docType, index }
          });
        } else if (item.docName == "个人消费分期服务申请表") {
          this.$router.push({
            path: "/PersonalConsumptionApplication",
            query: { docType: item.docType, index }
          });
        } else if (item.docName == "送达地址确认书") {
          this.$router.push({
            path: "/AddressConfirmation",
            query: { docType: item.docType, index }
          });
        } else if (item.docName == "个人消费分期服务协议") {
          this.$router.push({
            path: "/PersonalConsumption",
            query: { docType: item.docType, index }
          });
        } else if (item.docName == "个人消费分期贷款申请表") {
          this.$router.push({
            path: "/PersonalLoanApplication",
            query: { docType: item.docType, index }
          });
        } else if (item.docName == "个人消费分期贷款协议") {
          this.$router.push({
            path: "/PersonalLoan",
            query: { docType: item.docType, index }
          });
        }
        // this.$router.push({
        //   path: "/htmlShow",
        //   query: {
        //     serialNo: this.param.serialNo,
        //     index,
        //     docHttpUrl: encodeURIComponent(item.docHttpUrl)
        //   }
        // });
      } else if (item.docPath.indexOf(".pdf") != -1) {
        this.$router.push({
          path: "/clPdfFlie",
          query: {
            filePDF: encodeURIComponent(item.docPath)
          }
        });
      }
    },
    //验证码
    identifyingFun() {
      leave();
      if (!identifyingPass(this.identifyingVal)) {
        this.identifying = false;
        setTimeout(() => {
          this.identifying = true;
        }, 3000);
        return false;
      } else {
        return true;
      }
    },
    //获取验证码
    getIdentifying() {
      if (this.flag == true) {
        this.changeButton = true;
        this.buttonText = this.second + "S";
        var times = setInterval(() => {
          Number(this.second--);
          if (this.second == 0) {
            this.second = 181;
            this.flag = true;
            clearInterval(times);
            this.buttonText = "获取验证码";
            this.changeButton = false;
          } else {
            this.changeButton = true;
            this.buttonText = this.second + "S";
          }
        }, 1000);
        this.flag = false;
        let queryData = {
          certid: this.pageInfo.customerCertId,
          contractNo: this.pageInfo.serialNo,
          customername: this.pageInfo.customerName,
          mobiletelephone: this.phone,
          applyAmount: this.pageInfo.applyAmount,
          period: this.pageInfo.period,
          fileType: "CONTRACT" //电子签
        };
        //console.log(queryData);
        this.$requestCl
          .post("signature/getChallengeCode", [queryData])
          .then(res => {
            if (res.code == "9995") {
              Toast("获取验证码成功");
              this.postData.certid = this.pageInfo.customerCertId;
              this.postData.mobiletelephone = this.phone;
              this.postData.contractNo = this.pageInfo.serialNo;
            } else {
              Toast(`${res.msg}`);
            }
          })
          .catch(error => {
            console.log("error" + error);
          });
      }
    }
  },
  beforeDestroy() {},
  components: {}
};
</script>
<style lang='scss' scoped>
.editPersonalInfoBox {
  margin-top: 0;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  ul {
    width: 100%;
    height: 100%;
    li {
      height: 1rem;
      background: #fff;
      border-bottom: 1px solid #f4f4f4;
      padding: 0 0.32rem;
      p {
        float: left;
        font-family: "PingFangSC-Regular";
        font-size: 0.3rem;
        color: #333;
        height: 1rem;
        line-height: 1rem;
        span {
          font-size: 0.24rem;
          color: #aaa;
        }
      }
      p:nth-of-type(2) {
        float: right;
        text-align: right;
        font-size: 0.3rem;
        color: #666;
        width: 3.5rem;
      }
      #monthlyPayments {
        width: 2rem;
      }
      .person_worn {
        font-size: 0.16rem !important;
        color: red !important;
        float: left;
        height: 1rem;
        line-height: 1rem;
      }
      .person_worn_position {
        position: absolute;
        top: 0.36rem;
        left: 0.3rem;
      }
      .area_p {
        position: relative;
        .compile {
          width: 0.16rem;
          height: 0.27rem;
          position: absolute;
          top: 0;
          right: 0;
          height: 1rem;
          line-height: 1rem;
          background: url("../../../src/assets/img/sfz/bianJi@2x.png") no-repeat
            center/100%;
        }
      }
    }
    .title {
      background: #f2f3f5;
      position: relative;
      padding-right: 0;
    }
  }
}
.contactRelation {
  direction: ltr; //靠左
}
.contract {
  margin: auto;
  margin-top: 0.7rem;
  width: 55%;
  a {
    color: rgba(0, 137, 252, 1);
  }
}

button {
  display: block;
  width: 6.2rem;
  height: 0.9rem;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  border-radius: 0.44rem;
  font-size: 0.3rem;
  color: #fff;
  margin: 1rem auto;
  margin-top: 0.5rem;
  text-align: center;
  line-height: 0.8rem;
}
.underChecked {
  background: #ccc;
}
.mobileBox {
  // height: 3.27rem;
  background: #fff;
  font-family: "PingFangSC-Regular";
  box-sizing: border-box;
  > div {
    margin-top: 0.2rem;
    padding: 0.3rem 0;
  }
  .mobileNumber {
    text-align: left;
    margin-left: 0.32rem;
    color: #333;
    font-size: 0.3rem;
  }
}
.identifyingCode {
  box-sizing: border-box;
  height: 0.6rem;
  width: 100%;
  background: #fff;
  padding-left: 0.2rem;
  // background: red;
  position: relative;
  //margin-top: 0.2rem;
  span {
    display: inline-block;
    width: 2rem;
    height: 0.6rem;
    line-height: 0.6rem;
    margin-left: 0.1rem;
    font-size: 0.3rem;
    font-family: PingFang SC;
    color: #333;
    font-weight: 400;
  }
  input {
    box-sizing: border-box;
    height: 0.6rem;
    width: 2.5rem;
    vertical-align: top;
    font-size: 0.3rem;
    line-height: 0.3rem;
    //margin-left: 0.13rem;
    //border: 1px solid #999;
    //border-radius: 3px;
    //background: #f5f5f5;
    color: #b2b2b2;
    padding-left: 0.11rem;
  }
  .warning {
    position: absolute;
    top: 0.65rem;
    left: 0.35rem;
    color: #ff5b5b;
    font-size: 0.2rem;
  }
}
.footer {
  width: 100%;
  font-size: 0.24rem;
  line-height: 0.24rem;
  text-align: center;
  margin-top: 0.2rem;
  div {
    color: #676767;
    //margin-top: 0.12rem;
    input {
      width: 0.25rem;
      height: 0.25rem;
      margin-top: 0.08rem;
      vertical-align: top;
      border: red;
      &:active {
        background: red;
      }
      &:focus {
        background: red;
      }
    }
    .gray {
      color: #7686b2;
      .hook {
        margin: 0;
        display: inline-block;
        width: 0.23rem;
        height: 0.23rem;
        position: relative;
        background: none;
      }
      .myColor1 {
        margin: 0;
        display: inline-block;
        width: 0.23rem;
        height: 0.23rem;
        position: relative;
        background: url("../../assets/img/hook.png") no-repeat;
        background-size: 100% 100%;
        animation: fade-in;
        animation-duration: 0.2s;
        -webkit-animation: fade-in 0.2s;
      }
      @keyframes fade-in {
        0% {
          opacity: 0;
        } /*初始状态 透明度为0*/
        40% {
          opacity: 0.5;
        } /*过渡状态 透明度为0*/
        100% {
          opacity: 1;
        } /*结束状态 透明度为1*/
      }
      @-webkit-keyframes fade-in {
        /*针对webkit内核*/
        0% {
          opacity: 0;
        }
        40% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
    .myColor {
      color: #999;
    }
  }
  .mrginTop {
    //margin-top: 0.2rem;
    a {
      line-height: 0.4rem;
    }
    span {
      margin-left: 0.6rem;
      display: block;
      text-align: left;
      line-height: 0.4rem;
    }
  }
}
.myColor2 {
  color: #b2b2b2 !important;
}

.bbb {
  position: relative;
  font-size: 0.26rem;
  font-weight: 400;
  p {
    text-align: left;
    width: 6.2rem;
    margin: 0 auto;
    line-height: 0.4rem;
  }
}

.myButton {
  margin: 0.5rem auto;
  margin-bottom: 0;
  padding-top: 0.5rem;
  padding-bottom: 3rem;
  p {
    text-align: center;
    margin-top: 1.62rem;
    color: #ff5b5b;
  }
  a {
    width: 6.2rem;
    height: 0.9rem !important;
    line-height: 0.9rem !important;
    border-radius: 0.1rem;
    font-size: 0.34rem;
    display: block;
    text-align: center;
    margin: 0 auto;
  }
}
.myButton2 {
  // margin-top: 0.2rem;
  height: 0.6rem;
  box-sizing: border-box;
  position: absolute;
  right: 0.45rem;
  top: -0.5rem;
  font-size: 0.3rem;
  color: #3354df;
  background: #fff;
  border-radius: 0.05rem;
  // line-height:  0.4rem !important;
  width: 1.8rem;
  line-height: 0.4rem;
  border: 1px solid #3354df;
  padding: 0;
  &:active {
    background: #f8f1ed !important;
  }
}
.changeButton {
  background: rgba(0, 137, 252, 1);
  color: #fff;
}
.myCheckbox {
  // margin-top: 10px;
  color: #333333;
  position: absolute;
  left: 0.2rem;
  top: 0.08rem;
  //vertical-align: center;
  display: inline-block;
  width: 0.25rem;
  height: 0.25rem;
  box-sizing: border-box;
  background: url("../../assets/img/contract/checkBox@2x.png") no-repeat
    center/100%;
}
.changeBox {
  background: url("../../assets/img/contract/check@2x.png") no-repeat
    center/100%;
}

.weui-btn_primary {
  margin-top: 0.2rem;
  font-size: 0.3rem;
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
  border-radius: 0.44rem !important;
  height: 0.8rem !important;
  line-height: 0.8rem;
  :active {
    background: #1c4e88 !important;
  }
}
.weui-btn_primary:active {
  background: #2654b8 !important;
}
.aa {
  display: inline-block;
  width: 200px;
  height: 200px;
  background: url("../../assets/img/contract/成功icon@1x.png") no-repeat
    center/100%;
}
.bigbox {
  background: #f2f3f5;
}
</style>