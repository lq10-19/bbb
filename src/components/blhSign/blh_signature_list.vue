<template>
  <div>
    <div class="bigBox">
      <div class="info clearfix">
        <div class="clearfix">
          <p class="contractNumber">合同号：</p>
          <p class="content">
            <span>{{pageInfo.contractNo}}</span>
          </p>
          <p class="state">状态:{{pageInfo.contractStatus}}</p>
        </div>
        <div class="clearfix">
          <p class="yourName">客户姓名：</p>
          <p class="content">{{pageInfo.userName}}</p>
        </div>
        <div class="clearfix">
          <p class="carId">身份证号：</p>
          <p class="content">{{pageInfo.idCard}}</p>
        </div>
        <div class="clearfix">
          <p class="theTime">审批时间：</p>
          <p class="content">
            <span>{{pageInfo.signatureTime}}</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span></span>
          </p>
        </div>
      </div>
      <div class="mobileBox">
        <div>
          <div class="mobileNumber clearfix">
            <p class="mobileClass">
              <span>手机号：</span>
              <span class="mobileNum">{{pageInfo.mobiletelephone}}</span>
            </p>
          </div>
          <div class="identifyingCode">
            <input
              @blur="identifyingFun"
              v-model="identifyingVal"
              class="identifyingCodeIpt"
              type="number"
              placeholder="请输入6位合同验证码"
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
          v-if="index<fileList.length-1"
        >《{{item.docName}}》、</span>
        <span
          @click="goFileDetails(item)"
          v-for="(item,index) in fileList"
          :key="index"
          class="gray"
          :class="{myColor:item.isView}"
          v-if="index==fileList.length-1"
        >《{{item.docName}}》</span>
        <span>全部条款和内容</span>
      </div>
      <div>并同意采取填写手机短信验证码的方式签署上述合同。</div>
      <div class="myColor2">（点击合同名称查看相应合同条款。）</div>
    </div>

    <div class="myButton">
      <a href="javascript:;" @click="submitFun" class="weui-btn weui-btn_primary">提交电子签名</a>
      <!-- <p>如有问题可联系客服：400-9987-103</p> -->
      <!-- <button class="myButton" @click="goNext">下一步</button> -->
    </div>
    <!-- <a href="javascript:void(0);" @click="finPdf()">点击查看pdf</a> -->
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
        certid: "",
        contractNo: "",
        mobiletelephone: "",
        userType: "", //后台返回
        challengeCode: "",
        challengeLogId: "" //后台返回
      },
      //页面数据
      pageInfo: {},
      putoutNO: "", //合同号
      idCard: "",
      fileList: [],
      isVeiwList: [],
      contractStatusList: [
        //['110','190','160','260','270'];【已结清，已放款，提前还款结清，核销结清，逾期结清】
        { status: "080", text: "审批通过" },
        { status: "110", text: "已结清" },
        { status: "180", text: "待放款" },
        { status: "190", text: "已放款" },
        { status: "160", text: "提前还款结清" },
        { status: "260", text: "核销结清" },
        { status: "270", text: "逾期结清" }
      ]
    };
  },
  created() {
    this.pageInfo.contractNo = this.$route.query.contractNo;
    this.pageInfo.idCard = this.$route.query.idCard;
    this.pageInfo.userName = this.$route.query.userName;
    this.pageInfo.signatureTime = this.$route.query.signatureTime;
    this.pageInfo.contractStatus = this.$route.query.contractStatus;
    this.pageInfo.mobiletelephone = this.$route.query.mobiletelephone;
    this.contractStatusList.forEach((v, i) => {
      if (v.status == this.pageInfo.contractStatus) {
        this.pageInfo.contractStatus = v.text;
      }
    });
    this.getPdfFile();
    this.isViewListSave();
    if (sessionStorage.getItem("identifyingVal") &&sessionStorage.getItem("identifyingVal") != "undefined"){
        //有值
        this.identifyingVal = JSON.parse(sessionStorage.getItem("identifyingVal"));
      }
  },
  methods: {
    changeBoxFun() {
      this.changeBox = !this.changeBox;
      this.fileList.forEach((v, i) => {
        if (v.isView == false) {
          this.changeBox = false;
          Toast("请先阅读全部合同条款");
        }
      });
    },
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
    //获取页面信息
    getPageInfo() {
      this.$request
        .get(
          "electronAutographCtr/queryByPutoutNOAndIdCard?putoutNO=" +
            this.putoutNO +
            "&idCard=" +
            this.idCard
        )
        .then(res => {
          console.log(res);
          if (res.data && res.code == "200") {
            this.pageInfo = res.data;
            this.getPdfFile(this.pageInfo.serialNo, this.pageInfo.userType);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //获取pdf文件
    getPdfFile() {
      let url =
        "elecSignBLH/getFileByContractNo?contractNo=" +
        this.$route.query.contractNo;

      this.$request
        .get(url)
        .then(res => {
          console.log(res);
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
    goFileDetails(item) {
      if(this.identifyingVal){
        sessionStorage.setItem("identifyingVal",this.identifyingVal);
      };
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
          path: "blh_signature_flie",
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
          certid: this.$route.query.idCard,
          contractNo: this.$route.query.contractNo,
          customername: this.pageInfo.userName,
          mobiletelephone: this.pageInfo.mobiletelephone
        };
        console.log(queryData);
        this.$request
          .post("elecSignBLH/getChallengeCode", queryData)
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
                    text: '提交中...',
                    spinnerType: 'fading-circle',
                });
      this.$request
        .post("elecSignBLH/electronicSign", this.postData)
        .then(res => {
          console.log(res.data, 111);
          Indicator.close();
          if (res.code=="8001") {
            this.goNext();
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          Indicator.close();
          console.log("error" + error);
        });
    },
    goNext() {
      this.$router.push({
        path: "/blh_signature_sccess",
        query: {}
      });
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
.bigBox {
  margin-top: 0.2rem;
  background: #fff;
  font-size: 0.3rem;
  padding: 0.3rem;
  width: 100%;
  height: 6.14rem;
  box-sizing: border-box;
}
.info {
  height: 2.85rem;
  border-bottom: 1px solid #f3f3f3;
}
.info p {
  float: left;
  height: 0.7rem;
  color: #333;
  font-family: "PingFang SC";
}
.content {
  color: #666;
  font-family: "PingFang SC";
}
.info .state {
  float: right;
  color: #ff5b5b;
  font-family: "PingFang SC";
}
.mobileBox {
  // height: 3.27rem;
  background: #fff;
  font-family: "PingFangSC-Regular";
  box-sizing: border-box;
  > div {
    margin-top: 0.7rem;
  }
  .mobileNumber {
    text-align: center;
    // margin-top: 0.89rem;
    color: #333;
    font-size: 0.36rem;
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
    width: 3.5rem;
    vertical-align: top;
    font-size: 0.24rem;
    margin-left: 0.43rem;
    border: 1px solid #999;
    border-radius: 3px;
    background: #f5f5f5;
    color: #999;
    padding-left: 0.11rem;
  }
  .warning {
    position: absolute;
    top: 0.65rem;
    left: 0.65rem;
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
  font-size: 0.3rem;
  color: #ff7f36;
  background: #fff;
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