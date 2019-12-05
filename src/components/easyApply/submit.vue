<template>
  <div class="bigbox">
    <div class="editPersonalInfoBox">
      <ul>
        <li class="title">
          <p>您的申请信息如下</p>
        </li>
        <li>
          <p>申请金额</p>
          <p class="applyMoney">{{businesssum}}元</p>
        </li>
        <li>
          <p>分期期限</p>
          <p class="periods">{{periods}}期</p>
        </li>
        <li>
          <p>银行账号</p>
          <p class="bandNumber">{{replaceaccount}}</p>
        </li>
        <!-- <li>
          <p>日利率</p>
          <p class="monthlyInterestRate">{{dayFeeRate}}%</p>
        </li>-->
        <li>
          <p>每月还款</p>
          <p class="monthlyPayments">{{monthIncome}}元</p>
        </li>
      </ul>
    </div>
    <!-- <div class="contract">
      <input type="checkbox" class="check" id="checkboxInput" v-model="checked" />
      <label for="checkboxInput">
        <i></i>
      </label>
      同意
      <a @click="goZx">《百行个人征信授权书》</a>
    </div>
    <div>
      <button @click="submit" :class="{underChecked:!checked}">提交审核</button>
    </div>-->
    <div class="mobileBox">
      <div>
        <div class="mobileNumber clearfix">
          <p class="mobileClass">
            <span>输入验证码：</span>
            <span class="mobileNum">{{pageInfo.mobiletelephone}}</span>
          </p>
        </div>
        <div class="identifyingCode">
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
          <span :class="{changeBox:changeBox}" class="myCheckbox"></span>&nbsp;我已阅读并同意
        </span>
      </div>
      <div class="mrginTop">
        <span
          @click="goFileDetails(item)"
          v-for="(item,index) in fileList"
          :key="index"
          class="gray"
          :class="{myColor:item.isView}"
        >《{{item.docName}}》</span>
        <!-- <span
          @click="goFileDetails(item)"
          v-for="(item,index) in fileList"
          :key="index"
          class="gray"
          :class="{myColor:item.isView}"
          v-if="index==fileList.length-1"
        >《{{item.docName}}》</span>-->
        <span>全部条款和内容</span>
      </div>
      <div>并同意采取填写手机短信验证码的方式签署上述合同。</div>
      <div class="myColor2">（点击合同名称查看相应合同条款。）</div>
    </div>

    <div class="myButton">
      <a href="javascript:;" @click="submitFun" class="weui-btn weui-btn_primary">提交申请</a>
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
  getNowFormatDate
} from "../../public/uilt.js";
import { MessageBox, Indicator, Toast } from "mint-ui";
import store from "store";
import { path } from "../../config.js";
export default {
  data() {
    return {
      checked: false,
      param: {},
      businesssum: "", //申请金额
      periods: "", //分期期数
      replaceaccount: "", //放款账号
      businesstype: "", //产品编号
      dayFeeRate: "", //日费率
      monthIncome: "", //月还款额
      contractstatus: "", //合同状态
      //电子签数据
      identifying: true,
      identifyingVal: null, //挑战码
      changeBox: false, //同意勾选
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
        challengeCode: "", //挑战码
        challengeLogId: "", //后台返回
        fileInfoEntity: {} //签署文档
      },
      //页面数据
      pageInfo: {},
      certid: "",
      customername: "",
      mobilephone: "",
      productname: "",
      fileList: [], //文件列表
      isVeiwList: [] //文件阅读缓存列表
    };
  },
  created() {
    this.param = this.$route.query;
    //获取申请金额和银行卡号
    this.queryApply();
    if (
      sessionStorage.getItem("identifyingVal") &&
      sessionStorage.getItem("identifyingVal") != "undefined"
    ) {
      //有值
      this.identifyingVal = JSON.parse(
        sessionStorage.getItem("identifyingVal")
      );
    }
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "提交审核";
  },
  methods: {
    //获取申请金额和银行卡号
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
            this.businesssum = res.data.businesssum;
            this.replaceaccount = res.data.replaceaccount;
            //获取合同信息
            this.getContractInfo();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取合同信息
    getContractInfo() {
      let url = "cashloan/getContractInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          //合同状态（提交需要）
          this.contractstatus = res.data.contractstatus;
          //查询还款计划参数
          //this.businesssum = res.data.businesssum;
          this.businesstype = res.data.businesstype;
          this.periods = res.data.periods;
          this.customername = res.data.customername;
          this.certid = res.data.certid;
          //获取签署文件
          this.getPdfFile();
          //获取还款计划
          this.getRepaymentRelative();
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
          this.dayFeeRate = res.data.dayFeeRate;
          this.monthIncome = res.data.monthIncome;
          this.monthIncome2 = res.data.monthIncome2;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //提交信息
    saveOrUpdate() {
      let myDate = new Date();
      let time =
        myDate.getHours() +
        ":" +
        (myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()) +
        ":" +
        (myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds());
      let url = `cashloanAply/saveOrUpdate`;
      let param = {
        monthIncome2: this.monthIncome2,
        putoutno: this.param.serialno, //新合同号
        contractstatus: "060", //合同状态
        createdat: getNowFormatDate("/", "/", "/") + " " + time //申请时间
      };
      this.$requestWx
        .post(url, param)
        .then(res => {
          console.log(res, 905);
          store.remove("isVeiwList");
          store.remove("userMessage");
          store.remove("identifyingVal");
          this.$router.push({ path: "/over", query: {} });
        })
        .catch(error => {
          console.log(error);
        });
    },
    //提交电子签
    submitFun() {
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
      this.$requestWx
        .post("elecSignBLH/electronicSignForEmpower", this.postData)
        .then(res => {
          console.log(res.data, 111);
          Indicator.close();
          if (res.code == "8001") {
            Toast("电子签名成功！");
            this.saveOrUpdate();
            // let promise1 = this.saveOrUpdate();
            // Promise.all([promise1]).then(values => {
            //   store.remove("isVeiwList");
            //   store.remove("userMessage");
            //   store.remove("identifyingVal");
            //   this.$router.push({ path: "/over", query: {} });
            // });
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          Indicator.close();
          console.log("error" + error);
        });
    },
    //征信授权书
    goZx() {
      this.$router.push({ path: "/zx", query: this.param });
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
    //获取pdf文件
    getPdfFile() {
      let url = `elecSignBLH/previewFile?contractNo=${this.$route.query.serialno}&customerName=${this.customername}&certId=${this.certid}`;
      this.$requestWx
        .get(url)
        .then(res => {
          console.log(res);
          if (res.data && res.code == "200") {
            console.log("文件：" + res.data);
            this.mobilephone = res.data.mobiletelephone;
            this.productname = res.data.productname;
            let file = res.data.fileInfoEntity;
            this.postData.fileInfoEntity = file;
            this.fileList.push(file);
            this.isViewListSave();
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    goFileDetails(item) {
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
      console.log("fileList", this.fileList);
      console.log("isVeiwList", this.isVeiwList);
      if (
        item.filePDF.indexOf(".html") != -1 ||
        item.filePDF.indexOf(".jpg") != -1
      ) {
        location.href = item.fileHttpUrl;
      } else if (item.filePDF.indexOf(".pdf") != -1) {
        this.$router.push({
          path: "/pdfFlie",
          query: {
            filePDF: encodeURIComponent(item.filePDF)
          }
        });
      }
    },
    //验证码
    identifyingFun() {
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
          certid: this.certid,
          contractNo: this.$route.query.serialno,
          customername: this.customername,
          mobiletelephone: this.mobilephone,
          productname: this.productname,
          fileInfoEntity: this.fileList[0]
        };
        console.log(queryData);
        this.$requestWx
          .post("elecSignBLH/getChallengeCodeForEmpower", queryData)
          .then(res => {
            if (res.data && res.code == "8000") {
              Toast("获取验证码成功");
              let resData = res.data;
              this.postData.certid = resData.certid;
              this.postData.mobiletelephone = resData.mobiletelephone;
              this.postData.contractNo = resData.contractNo;
              this.postData.userType = resData.userType;
              this.postData.challengeLogId = resData.challengeLogId;
              console.log("aa", this.postData);
              console.log("resData", resData);
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
      }
      p:nth-of-type(2) {
        float: right;
        font-size: 0.3rem;
        color: #666;
        width: 3.5rem;
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
      background: #f4f4f4;
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
    color: #ff7f36;
  }
}
// .contract label {
//   cursor: pointer;
//   position: absolute;
//   width: 0.32rem;
//   height: 0.32rem;
//   background: #ccc;
//   border-radius: 0.06rem;
//   border:0.02rem solid #ff7f36;
// }
// .contract label i {
//   content: "";
//   position: absolute;
//   width: 8px;
//   height: 5px;
//   background: transparent;
//   top: 4px;
//   left: 4px;
//   border: 3px solid #fff;
//   border-top: none;
//   border-right: none;
//   -webkit-transform: rotate(-45deg);
//   -moz-transform: rotate(-45deg);
//   -o-transform: rotate(-45deg);
//   -ms-transform: rotate(-45deg);
//   transform: rotate(-45deg);
// }
// .checkbox input[type="checkbox"] + label i {
//   border-color: #fff;
// }
// .checkbox input[type="checkbox"]:checked + label i {
//   opacity: 1;
//   border-color: #fe5850;
// }
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
  margin-top: 0.2rem;
  span {
    display: inline-block;
    width: 0.34rem;
    height: 1rem;
  }
  input {
    box-sizing: border-box;
    height: 0.6rem;
    width: 4.5rem;
    vertical-align: top;
    font-size: 0.24rem;
    margin-left: 0.13rem;
    border: 1px solid #999;
    border-radius: 3px;
    background: #f5f5f5;
    color: #999;
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
  margin-top: 0.61rem;
  div {
    color: #676767;
    margin-top: 0.12rem;
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
      color: #999;
    }
    .myColor {
      color: #ff7f36;
    }
  }
  .mrginTop {
    margin-top: 0.2rem;
    a {
      line-height: 0.4rem;
    }
    span {
      line-height: 0.4rem;
    }
  }
}
.myColor2 {
  color: #b2b2b2 !important;
}

.bbb {
  position: relative;
}

.myButton {
  margin-top: 0.5rem;
  p {
    text-align: center;
    margin-top: 1.62rem;
    color: #ff5b5b;
  }
  a {
    width: 6.9rem;
    height: 0.9rem !important;
    line-height: 0.9rem !important;
    border-radius: 0.1rem;
    font-size: 0.3rem;
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
  right: 0.64rem;
  top: -0.5rem;
  font-size: 0.3rem;
  color: #fff;
  background: #ff7f36;
  border-radius: 0.05rem;
  // line-height:  0.4rem !important;
  width: 1.8rem;
  line-height: 0.4rem;
  border: 1px solid #ff7f36;
  padding: 0;
  &:active {
    background: #f8f1ed !important;
  }
}
.changeButton {
  background: #ff7f36;
  color: #fff;
}
.myCheckbox {
  // margin-top: 10px;
  color: #333333;
  position: absolute;
  left: -0.3rem;
  top: 0.04rem;
  vertical-align: center;
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
.aa {
  display: inline-block;
  width: 200px;
  height: 200px;
  background: url("../../assets/img/contract/成功icon@1x.png") no-repeat
    center/100%;
}
</style>