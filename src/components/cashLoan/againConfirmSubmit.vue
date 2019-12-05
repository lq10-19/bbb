<template>
  <div class="bigbox">
    <div class="editPersonalInfoBox">
      <ul>
        <li class="title">
          <p>您变更后银行卡信息如下：</p>
        </li>
        <li>
          <p>变更订单</p>
          <!-- <p class="contractId" @click="listShow">{{contractId}}</p> -->
          <van-dropdown-menu class="contractId">
            <van-dropdown-item v-model="value1" :options="option1" />
          </van-dropdown-menu>
        </li>
        <li>
          <p>所属银行</p>
          <p class="bank">{{bank}}</p>
        </li>
        <li>
          <p>开户城市</p>
          <p class="bankCity">{{bankCity}}</p>
        </li>
        <li>
          <p>开户支行</p>
          <p class="subbranch">{{subbranch}}</p>
        </li>
        <li>
          <p>银行卡号</p>
          <p class="bankCard">{{bankCard}}</p>
        </li>
        <li>
          <p>预留手机号</p>
          <p class="bankPhone">{{bankPhone}}</p>
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
          <span :class="{changeBox:changeBox}" class="myCheckbox"></span>&nbsp;我已阅读并同意
        </span>
        <router-link to="/clEnclosureMsg">
          <span @click="goClEnclosureMsg" class="a">《变更代扣银行账号申请函》</span>
        </router-link>
        <span>全部条款和内容，并同意采取填写手机短信验证码的方式签署上述合同。</span>
      </div>
      <!-- <div class="mrginTop">
        <router-link to="/clEnclosureMsg">
          <span @click="goClEnclosureMsg" class="a">《变更代扣银行账号申请函》</span>
        </router-link>
        <span>全部条款和内容</span>
      </div>
      <div>并同意采取填写手机短信验证码的方式签署上述合同。</div>
      <div class="myColor2">（点击合同名称查看相应合同条款。）</div>-->
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
import { DropdownMenu, DropdownItem } from "vant";
import { path } from "../../config.js";
export default {
  data() {
    return {
      value1: 0,
      option1: [], //合同号列表
      checked: false,
      param: {
        customerId: "",
        serialNoList: [],
        serialNo: ""
      },
      //contractId: "2019070900002", //订单id
      bank: null, //所属银行
      bankCity: null, //开户城市
      subbranch: null, //开户支行
      bankCard: null, //银行卡号
      bankPhone: null, //预留手机号
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
        //contractNo: "", //合同号
        mobiletelephone: "", //手机号
        challengeCode: "",
        fileType: "CREDIT" //重绑卡
      },
      //获取挑战码数据
      pageInfo: {}
    };
  },
  created() {
    //传参serialNoList、customerId
    if (this.$route.query) {
      this.param = this.$route.query;
      this.param.serialNoList = JSON.parse(this.$route.query.serialNoList);
    }
    if (store.get("serialNoList")) {
      this.serialNoList = store.get("serialNoList");
    }
    //通过客户id查询客户信息
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
      this.query();
    }
    //活体识别未通过
    let urlinfo = window.location.href;
    console.log(urlinfo);
    let search = "code=0";
    let start = urlinfo.indexOf(search);
    console.log(start);
    if (start == -1) {
      let serialNoList = JSON.stringify(this.serialNoList);
      this.$router.push({
        path: "/againBankCardPhoto",
        query: {
          serialNoList,
          customerId: this.customerId
        }
      });
    }
    //获取记录id缓存
    if (store.get("recordIdList")) {
      this.recordIdList = store.get("recordIdList");
      //通过记录id获取页面信息
      this.queryBanlCardChangeLogNew();
    }
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "变更银行卡确认";
  },
  methods: {
    //通过记录id获取页面信息
    queryBanlCardChangeLogNew() {
      let url = "bankCardChange/queryBanlCardChangeLogNew";
      this.$requestCl
        .post(url, this.recordIdList)
        .then(res => {
          if (res.code == 200) {
            //保存接口参数
            this.recordData = res.data;
            //页面数据对象
            let changeInfoResult = res.data.changeInfoResult;
            this.bank = changeInfoResult.customerBank;
            if (
              changeInfoResult.customerBankProvince ||
              changeInfoResult.customerBankCity
            ) {
              this.bankCity =
                changeInfoResult.customerBankProvince +
                changeInfoResult.customerBankCity;
            } else {
              this.bankCity = "";
            }
            this.subbranch = changeInfoResult.customerBranch;
            this.bankCard = changeInfoResult.customerBankNo;
            this.bankPhone = changeInfoResult.bankPhone;
            //合同号列表
            if (res.data.contractNoList && res.data.contractNoList.length > 0) {
              this.param.serialNo = res.data.contractNoList[0];
              for (let i = 0; i < res.data.contractNoList.length; i++) {
                let item = {};
                item.text = res.data.contractNoList[i];
                item.value = i;
                this.option1.push(item);
              }
            }
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //通过客户id查询客户信息
    query() {
      let url = "customerIndInfoCtr/query";
      let param = {
        customerid: this.customerId
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //获取电子签数据
            this.postData.mobiletelephone = res.data.mobiletelephone;
            this.postData.certid = res.data.certid;
            //获取挑战码数据
            this.pageInfo.mobiletelephone = res.data.mobiletelephone;
            this.pageInfo.certid = res.data.certid;
            this.pageInfo.customername = res.data.customername;
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //提交审核
    submit() {
      if (!this.checked) {
        Toast("请勾选'我已阅读并同意'");
      } else {
        //提交电子签
        this.submitFun();
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
        text: "提交中...",
        spinnerType: "fading-circle"
      });
      //电子签
      this.electronicSign();
    },
    //电子签
    electronicSign() {
      let url = "signature/electronicSign";
      let postData = {};
      let postDataList = [];
      for (let i = 0; i < this.serialNoList.length; i++) {
        postData = {
          certid: this.postData.certid,
          mobiletelephone: this.postData.mobiletelephone,
          challengeCode: this.postData.challengeCode,
          fileType: "CREDIT"
        };
        postData.contractNo = this.serialNoList[i];
        postDataList.push(postData);
      }
      this.$requestCl
        .post(url, postDataList)
        .then(res => {
          Indicator.close();
          if (res.code == 200) {
            //提交信息
            this.updateBankConfirmSubmit();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //提交信息
    updateBankConfirmSubmit() {
      let url = `businessContractInfoCtr/updateBankConfirmSubmit`;
      let param = this.recordData;
      // param.serialNoList = this.recordData.contractNoList;
      // param.customerId = this.customerId;
      // param.changeInfoResult.verifycode = store.get("verificationCode");
      // param.changeInfoResult.lasserialno = store.get("lasserialno");
      //param.hFiveMark = 5
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            Toast("电子签名成功！");
            Indicator.close();
            this.$router.push({
              path: "/againAddBankCardSuccess",
              query: {}
            });
          } else {
            Indicator.close();
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          Indicator.close();
          console.log(error);
        });
    },
    //勾选同意
    changeBoxFun() {
      this.changeBox = !this.changeBox;
      this.checked = !this.checked;
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
        let queryData = {};
        let queryDataList = [];
        for (let i = 0; i < this.serialNoList.length; i++) {
          queryData = {
            certid: this.pageInfo.certid,
            customername: this.pageInfo.customername,
            mobiletelephone: this.pageInfo.mobiletelephone,
            fileType: "CREDIT" //重绑卡
          };
          queryData.contractNo = this.serialNoList[i];
          queryDataList.push(queryData);
        }
        //console.log(queryData);
        this.$requestCl
          .post("signature/getChallengeCode", queryDataList)
          .then(res => {
            if (res.code == "9995") {
              Toast("获取验证码成功");
              // this.postData.certid = this.pageInfo.customerCertId;
              // this.postData.mobiletelephone = this.phone;
            } else {
              Toast(`${res.msg}`);
            }
          })
          .catch(error => {
            console.log("error" + error);
          });
      }
    },
    //查看附件详情
    goClEnclosureMsg() {
      //this.serialNoList = ['1619000053','1619000083','789']
      let serialNoList = JSON.stringify(this.serialNoList);
      this.$router.push({
        path: "/clEnclosureMsg",
        query: {
          serialNoList
        }
      });
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
        text-align: right;
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
      .subbranch {
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
        line-height: 0.5rem;
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
    color: #6976aa;
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
    // border: 1px solid #999;
    // border-radius: 3px;
    // background: #f5f5f5;
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
  width: 6.3rem;
  margin: 0 auto;
  font-size: 0.24rem;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 0.4rem;
  margin-top: 0.2rem;
  div {
    //color: #676767;
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
      color: #6976aa;
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
      margin-left: 0.8rem;
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
  margin: 1rem auto;
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
  right: 0.45rem;
  top: -0.5rem;
  font-size: 0.3rem;
  color: rgba(51, 84, 223, 1);
  background: #fff;
  border-radius: 0.05rem;
  // line-height:  0.4rem !important;
  width: 1.8rem;
  line-height: 0.4rem;
  border: 1px solid rgba(51, 84, 223, 1);
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
  left: -0.3rem;
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
/deep/ .van-dropdown-menu__item {
  justify-content: flex-end;
  color: #666;
  margin-right: 0.3rem;
}
.a {
  color: #7986B2;
}
</style>