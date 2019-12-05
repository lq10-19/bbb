<template>
  <div>
    <div class="editPersonalInfoBox">
      <ul>
        <li>
          <p>持卡人姓名</p>
          <p class="thisName myToast">{{msgData.customerName}}</p>
        </li>
        <li>
          <p>身份证号码</p>
          <p class="cardId">{{msgData.certId}}</p>
        </li>
        <li>
          <p>银行卡号</p>
          <p class="accountNumber">
            <input
              type="number"
              v-model="msgData.bankCard"
              oninput="if(value.length>19)value=value.slice(0,19)"
              placeholder="请扫描银行卡照片"
              class="myIput bankIput bankNumber"
              @blur="leave()"
            />
            <img src="../../assets/img/ocr@2x.png" @click="goUploadBankCard" />
          </p>
        </li>
        <li class="switchLi">
          <p>所属银行</p>
          <p class="area_p cardId" @click="openBank" :class="{cardId1:!msgData.bankName}">
            {{msgData.bankName?msgData.bankName:'请选择所属银行'}}
            <span class="compile"></span>
          </p>
          <!-- <p class="area_p cardId">
            {{msgData.bankName}}
          </p>-->
        </li>

        <li class="switchLi">
          <p>开户城市</p>
          <p class="area_p">
            <!-- <input class="personArea" type="text" readonly="readonly" value="查询中..."> -->
            <input
              readonly
              type="text"
              v-model="msgData.myBankAddress"
              placeholder="请选择地区"
              class="personArea"
            />
            <selectAreaNew @getSubPageData="getSubPageDataFun3" class="personArea2"></selectAreaNew>
            <span class="compile"></span>
          </p>
        </li>

        <li class="switchLi">
          <p>开户支行</p>
          <p class="area_p cardId" @click="openSubbranch" :class="{cardId1:!msgData.subbranch}">
            {{msgData.subbranch?msgData.subbranch:'请选择开户支行'}}
            <span class="compile"></span>
          </p>
        </li>

        <li>
          <p>预留手机号</p>
          <p class="area_p">
            <input
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              class="mobleNumber"
              v-model="msgData.bankPhoneNum"
              placeholder="请输入手机号码"
              @blur="leave()"
            />
          </p>
        </li>

        <li v-if="validateBtn">
          <p>验证码</p>
          <p>
            <input
              oninput="if(value.length>6)value=value.slice(0,6)"
              class="mobleNumber"
              v-model="msgData.verificationCode"
              placeholder="请输入验证码"
              :readonly="!validateBtn"
              @blur="leave()"
            />
            <span class="itemBtn" @click="submitCheck">{{buttonText}}</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="toastMessageFather">
      <button @click="nextGo">下一步</button>
    </div>
    <!-- 主行弹出框选择列表 -->
    <div class="bankListSelect mainBankList mark" v-if="showBank" @click="showBank=false">
      <ul class="bankCenterBox bankList_ul">
        <li v-for="(item,i) in bankList" :key="i" @click="selectBank(item)">
          <span :class="{checked:subBankSlect1==item.text}"></span>
          <p>{{item.text}}</p>
        </li>
      </ul>
    </div>
    <!-- 支行弹出框选择列表 -->
    <div class="bankListSelect subBankList mark" v-if="showSubbranch" @click="showSubbranch=false">
      <div id="ul" class="scrollable">
        <ul id="menuList" class="bankCenterBox subBankList_ul layerNode">
          <li @click="selectSubbranch(item)" v-for="(item,i) in subbranchList" :key="i">
            <span :class="{checked:subBankSlect2==item.name}"></span>
            <p>{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- Loading -->
    <div class="bankListSelect subBankList mark bg" v-if="waitData">
      <div class="center">
        <mt-spinner type="fading-circle" class="icon" color="rgba(51, 84, 223, 1)" :size="50"></mt-spinner>
        <p>数据上传中...</p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet,
  formatBankCardId,
  leave
} from "../../public/uilt.js";
import selectAreaNew from "../assembly/selectAreaNewCl.vue";
import { bankCardAttribution } from "../../../static/js/bankCard.js";
import { Toast, Popup, Spinner } from "mint-ui";
import { Dialog } from "vant";
import store from "store";
import { path } from "../../config";
import { debug } from "util";
export default {
  data() {
    return {
      serialNo: null, //合同号
      customerId: null, //客户id
      applyMoney: null,
      stageIndex: "0",
      subbranchList: [], //支行列表
      showBank: false,
      bankList: [
        {
          value: "102",
          text: "中国工商银行"
        },
        {
          value: "103",
          text: "中国农业银行"
        },
        {
          value: "104",
          text: "中国银行"
        },
        {
          value: "105",
          text: "中国建设银行"
        },
        {
          value: "308",
          text: "招商银行"
        },
        {
          value: "403",
          text: "邮政储蓄"
        }
      ], //银行列表
      showSubbranch: false,
      msgData: {
        customerName: "", //姓名
        certId: "", //身份证号
        bankName: "",
        bankCode: "", //总行编号
        myBankAddress: "", //开户行地区
        myBankProvinceName: "",
        myBankProvinceId: "",
        myBankCityName: "",
        myBankCityId: "",
        //cityCode: "", //城市编号(暂不用)
        bankCountyId: "", //银行所在城市编号（获取支行用）
        subbranch: "", //支行名称
        subbranchCode: "", //支行编码
        bankCard: "", //银行卡号
        bankPhoneNum: "", //银行预留手机
        verificationCode: "" //短信验证码
      },
      param: {},
      subBankSlect1: false, //选择总行
      subBankSlect2: false, //选择支行
      waitData: false,
      //获取验证码
      flag: true,
      second: 180,
      times: 0, //定时器
      buttonText: "获取验证码",
      validateBtn: true, //验证码按钮显示
      lasserialno: null, //外部流水号
      //重绑银行卡
      recordIdList: [], //重新绑定传入记录id数组
      serialNoList: [] //重新绑定传入合同号数组
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // const bankCardOcr = storeGet("bankCardOcr");
      // if (bankCardOcr) {
      //   vm.msgData.customerName = bankCardOcr.customerName;
      //   vm.msgData.certId = bankCardOcr.certId;
      //   vm.msgData.bankCard = bankCardOcr.cardNo;
      //   if (bankCardOcr.bankInfo == "102") {
      //     vm.msgData.bankName = "中国工商银行";
      //     vm.msgData.bankCode = "102";
      //   } else if (bankCardOcr.bankInfo == "103") {
      //     vm.msgData.bankName = "中国农业银行";
      //     vm.msgData.bankCode = "103";
      //   } else if (bankCardOcr.bankInfo == "104") {
      //     vm.msgData.bankName = "中国银行";
      //     vm.msgData.bankCode = "104";
      //   } else if (bankCardOcr.bankInfo == "105") {
      //     vm.msgData.bankName = "中国建设银行";
      //     vm.msgData.bankCode = "105";
      //   } else if (bankCardOcr.bankInfo == "308") {
      //     vm.msgData.bankName = "招商银行";
      //     vm.msgData.bankCode = "308";
      //   } else if (bankCardOcr.bankInfo == "403") {
      //     vm.msgData.bankName = "邮政储蓄";
      //     vm.msgData.bankCode = "403";
      //   } else {
      //     Dialog.confirm({
      //       message: "很抱歉，该业务暂不支持此银行，请更换银行卡！"
      //     })
      //       .then(() => {
      //         // on confirm
      //         vm.msgData.bankName = "";
      //         vm.msgData.bankCode = "";
      //         vm.msgData.bankCard = "";
      //       })
      //       .catch(() => {
      //         // on cancel
      //         vm.msgData.bankName = "";
      //         vm.msgData.bankCode = "";
      //         vm.msgData.bankCard = "";
      //       });
      //   }
      //   vm.msgData.myBankAddress = "";
      //   vm.msgData.subbranch = "";
      //   vm.msgData.bankPhoneNum = "";
      // }
      // //vm.msgData.bankPhoneNum = "";
      // vm.msgData.verificationCode = "";
    });
  },
  created() {
    this.param = this.$route.query;
    // //获取重新绑卡的记录号(数组)
    // if (this.$route.query.recordIdList) {
    //   this.recordIdList = JSON.parse(this.$route.query.recordIdList);
    // }
    // //获取重新绑卡的合同号(数组)
    // if (this.$route.query.serialNoList) {
    //   this.serialNoList = JSON.parse(this.$route.query.serialNoList);
    // }
    if (store.get("recordIdList")) {
      this.recordIdList = store.get("recordIdList");
      console.log(this.recordIdList, 101);
    }
    if (store.get("serialNoList")) {
      this.serialNoList = store.get("serialNoList");
      console.log(this.serialNoList, 202);
    }
    //通过客户id查询客户信息
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
      if (!storeGet("bankCardOcr")) {
        this.query();
      }
    }
    if (store.get("userBankMessageNew")) {
      this.msgData = store.get("userBankMessageNew");
    }
    //判断ocr返回信息
    this.haveOcr();
    //获取支行
    this.Obtain();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "更换银行卡";
  },
  beforeDestroy() {
    store.set("userBankMessageNew", this.msgData);
    store.remove("tempDataSet"); //清除ocr信息银行卡
  },
  components: {
    selectAreaNew
  },
  methods: {
    leave() {
      leave();
    },
    //判断ocr返回信息
    haveOcr() {
      const bankCardOcr = storeGet("bankCardOcr");
      if (bankCardOcr) {
        this.msgData.customerName = bankCardOcr.customerName;
        this.msgData.certId = bankCardOcr.certId;
        this.msgData.bankCard = bankCardOcr.cardNo;
        if (bankCardOcr.bankInfo == "102") {
          this.msgData.bankName = "中国工商银行";
          this.msgData.bankCode = "102";
        } else if (bankCardOcr.bankInfo == "103") {
          this.msgData.bankName = "中国农业银行";
          this.msgData.bankCode = "103";
        } else if (bankCardOcr.bankInfo == "104") {
          this.msgData.bankName = "中国银行";
          this.msgData.bankCode = "104";
        } else if (bankCardOcr.bankInfo == "105") {
          this.msgData.bankName = "中国建设银行";
          this.msgData.bankCode = "105";
        } else if (bankCardOcr.bankInfo == "308") {
          this.msgData.bankName = "招商银行";
          this.msgData.bankCode = "308";
        } else if (bankCardOcr.bankInfo == "100") {
          this.msgData.bankName = "邮政储蓄";
          this.msgData.bankCode = "403";
        } else {
          Dialog.confirm({
            message: "很抱歉，该业务暂不支持此银行，请更换银行卡！"
          })
            .then(() => {
              // on confirm
              this.msgData.bankName = "";
              this.msgData.bankCode = "";
              this.msgData.bankCard = "";
            })
            .catch(() => {
              // on cancel
              this.msgData.bankName = "";
              this.msgData.bankCode = "";
              this.msgData.bankCard = "";
            });
        }
        this.msgData.myBankAddress = "";
        this.msgData.subbranch = "";
        this.msgData.bankPhoneNum = "";
      }
      //this.msgData.bankPhoneNum = "";
      this.msgData.verificationCode = "";
    },
    //跳转银行卡ocr
    goUploadBankCard() {
      let serialNoList = "";
      this.serialNoList.forEach(element => {
        serialNoList = serialNoList + element + ",";
      });
      serialNoList = serialNoList.substr(0, serialNoList.length - 1);
      console.log("合同号组：", serialNoList);
      this.$router.push({
        path: "/uploadBankCard",
        query: {
          certId: this.msgData.certId,
          contractNo: serialNoList,
          customerName: this.msgData.customerName,
          from: 1
        }
      });
    },
    //选择总行
    selectBank(item) {
      this.subBankSlect1 = item.text;
      this.msgData.bankName = item.text;
      this.msgData.bankCode = item.value;
      this.showBank = !this.showBank;
      this.Obtain();
    },
    //选择支行
    selectSubbranch(item) {
      this.subBankSlect2 = item.name;
      this.msgData.subbranch = item.name;
      this.msgData.subbranchCode = item.bankCode;
      this.showSubbranch = !this.showSubbranch;
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
          if (res.data) {
            this.msgData.customerName = res.data.customername;
            this.msgData.certId = res.data.certid;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //传入查询支行的总行code和地区code
    getSubPageDataFun3(msg) {
      //console.log("银行所在地", msg);
      this.msgData.bankCountyId = msg.cityId;
      this.msgData.myBankAddress =
        msg.provinceName + msg.cityName + msg.countyName;
      this.msgData.myBankProvinceName = msg.provinceName;
      this.msgData.myBankProvinceId = msg.provinceId;
      this.msgData.myBankCityName = msg.cityName;
      this.msgData.myBankCityId = msg.cityId;
      //this.msgData.cityCode = msg.countyId;
      this.Obtain();
    },
    //获取支行
    Obtain() {
      let url = "queryInfo/getAllBankInfo";
      let param = {
        bankCode: this.msgData.bankCode,
        city: this.msgData.bankCountyId
      };
      //console.log(this.msgData.bankCountyId, 111);
      this.$requestCl
        .post(url, param)
        .then(res => {
          this.subbranchList = [];
          this.msgData.subbranch = "";
          this.msgData.bankPhoneNum = "";
          if (res.data && res.data.length > 0) {
            this.subbranchList = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //打开总行
    openBank() {
      this.showBank = !this.showBank;
    },
    //打开支行
    openSubbranch() {
      if (this.subbranchList.length > 0) {
        this.showSubbranch = !this.showSubbranch;
      } else {
        Toast("该地区没有支行,请重新选择银行或城市");
      }
    },
    //下一步
    nextGo() {
      //console.log(this.msgData);
      let msgArr = Object.values(this.msgData);
      for (let i = 0; i < msgArr.length; i++) {
        if (!msgArr[i]) {
          //console.log(msgArr);
          Toast("请检查还有未填信息");
          return;
        }
      }
      //保存修改银行信息
      this.update();
    },
    //保存银行信息（绑卡接口）
    update() {
      this.waitData = true;
      let url = "agreementPaymentCardCallback/tieOnCardApply";
      let param = {
        mark: "2", //重绑卡标识
        recordIdList: this.recordIdList, //记录ID
        lasserialno: this.lasserialno, //外部流水号
        verifycode: this.msgData.verificationCode, //短信验证码
        payacctno: this.msgData.bankCard, //"银行卡号"
        payacctname: this.msgData.customerName, // 客户姓名
        certid: this.msgData.certId, // 证件号
        mobile: this.msgData.bankPhoneNum, // 手机号
        payacctbankname: this.msgData.bankName, //"所属银行"
        payacctbankcode: this.msgData.bankCode, //"所属银行编号"
        customerBankProvince: this.msgData.myBankProvinceName, //"开户省份"
        customerBankProvinceId: this.msgData.myBankProvinceId, //"开户省份编号"
        customerBankCity: this.msgData.myBankCityName, //"开户城市"
        customerBankCityId: this.msgData.myBankCityId, //"开户城市编号"
        customerBranch: this.msgData.subbranch, //"开户支行"
        customerBranchId: this.msgData.subbranchCode //"开户支行编号"
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //缓存流水号
            //store.set("lasserialno", this.lasserialno);
            //缓存验证码
            //store.set("verificationCode", this.msgData.verificationCode);
            setTimeout(() => {
              //金融回调接口
              this.checkTieOnCardApply();
            }, 1000);
          } else {
            this.waitData = false;
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          this.waitData = false;
          console.log(error);
        });
    },
    //金融回调接口
    checkTieOnCardApply() {
      let url = `businessContractInfoCtr/checkTieOnCardApply`;
      let param = {
        verifycode: this.msgData.verificationCode,
        lasserialno: this.lasserialno,
        recordIdList: this.recordIdList
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            this.waitData = false;
            let serialNoList = JSON.stringify(this.serialNoList);
            this.$router.push({
              path: "/againBankCardPhoto",
              query: {
                serialNoList,
                customerId: this.customerId
              }
            });
          } else if (res.code == 9955) {
            this.waitData = false;
            if (
              res.data.serialNoList == [] ||
              res.data.serialNoList.length <= 0
            ) {
              Toast(`该银行卡信息与变更前一致，请更换银行卡`);
            } else {
              Dialog.confirm({
                message: `合同号：${res.data.serialNoListNo}无需变更，其余合同是否继续变更？`
              })
                .then(() => {
                  //获取新的记录id列表
                  this.recordIdList = res.data.recordIdList;
                  store.set("recordIdList", this.recordIdList);
                  //获取新的合同号列表
                  this.serialNoList = res.data.serialNoList;
                  store.set("serialNoList", this.serialNoList);
                  let serialNoList = JSON.stringify(this.serialNoList);
                  this.$router.push({
                    path: "/againBankCardPhoto",
                    query: {
                      serialNoList,
                      customerId: this.customerId
                    }
                  });
                })
                .catch(() => {
                  //点取消不做操作
                });
            }
          } else {
            this.waitData = false;
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          this.waitData = false;
          console.log(error);
        });
    },
    //获取验证码
    submitCheck() {
      if (this.flag == false) {
        return;
      }
      if (!/^1\d{10}$/.test(this.msgData.bankPhoneNum)) {
        Toast("请输入正确的手机号码");
        return;
      }
      if (this.flag == true) {
        this.flag = false;
        this.buttonText = this.second + "s后重试";
        this.times = setInterval(() => {
          Number(this.second--);
          if (this.second <= 0) {
            this.second = 181;
            clearInterval(this.times);
            this.buttonText = "获取验证码";
            this.flag = true;
          } else {
            this.buttonText = this.second + "s后重试";
          }
        }, 1000);
        //获取验证码（预绑卡结果）
        this.bankBinding();
      }
    },
    //获取验证码（预绑卡接口）
    bankBinding() {
      //校验手机号是否绑定
      let url = "agreementPaymentCardCallback/bankBinding";
      let param = {
        payacctbankcode: this.msgData.bankCode, // 银行编码
        payacctbankname: this.msgData.bankName, // 付款行名-所属银行
        payacctno: this.msgData.bankCard, // 付款帐号-银行卡号
        payacctname: this.msgData.customerName, // 付款账户名-客户姓名
        certid: this.msgData.certId, // 证件号
        mobile: this.msgData.bankPhoneNum, // 手机号
        //recordId: this.recordIdList, //记录ID列表
        serialno: this.serialNoList[0], //合同号列表
        customerBankProvince: this.msgData.myBankProvinceName, //开户省份
        customerBankProvinceId: this.msgData.myBankProvinceId, //开户省份编号
        customerBankCity: this.msgData.myBankCityName, //开户城市
        customerBankCityId: this.msgData.myBankCityId, //开户城市编号
        customerBranch: this.msgData.subbranch, //开户支行
        customerBranchId: this.msgData.subbranchCode, //开户支行编号
        sendtomq: 0
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //获取流水号
            this.lasserialno = res.data.lasserialno;
            if (res.data.verifycode == 888888) {
              this.flag = false;
              this.validateBtn = false;
              this.msgData.verificationCode = 888888;
              Toast("该手机已绑定，请点击确定");
            } else {
              Toast("获取验证码成功");
            }
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  //本地缓存
  // updated() {
  // }
};
</script>

<style lang='scss' scoped>
.editPersonalInfoBox {
  margin-top: 0;
  width: 100%;
  height: auto;
  background: #f4f4f4;
}

.editPersonalInfoBox ul {
  width: 100%;
  height: 100%;
}

.editPersonalInfoBox ul li {
  height: 1.1rem;
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
  padding: 0 0.32rem;
}

.editPersonalInfoBox ul li p {
  float: left;
  font-family: "PingFangSC-Regular";
  font-size: 0.3rem;
  color: #666;
  height: 1.1rem;
  line-height: 1.1rem;
}

.editPersonalInfoBox ul li p input,
.editPersonalInfoBox ul li p textarea {
  font-size: 0.3rem;
  color: #333;
}

.editPersonalInfoBox ul li p:nth-of-type(2) {
  float: right;
  font-size: 0.3rem;
  color: #333;
  width: 4.5rem;
  position: relative;
}

.editPersonalInfoBox ul li p:nth-of-type(2) textarea {
  resize: none;
  width: 4.74rem;
  font-size: 0.3rem;
  color: #333;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0.35rem;
  height: 0.35rem;
}

.editPersonalInfoBox ul li .detailedAddress {
  width: 4.5rem;
}

.editPersonalInfoBox ul li .person_worn {
  font-size: 0.2rem !important;
  color: red !important;
  float: left;
  height: 1.1rem;
  line-height: 1.1rem;
}

.editPersonalInfoBox ul li .person_worn_position {
  position: absolute;
  top: 0.36rem;
  left: 0.3rem;
}

.editPersonalInfoBox ul li .area_p {
  position: relative;
}

.editPersonalInfoBox ul li .area_p .compile {
  width: 0.16rem;
  height: 0.27rem;
  position: absolute;
  top: 0.4rem;
  right: 0.15rem;
  line-height: 1.1rem;
  background: url("../../assets/img/xiala.png") no-repeat center/100%;
}

.editPersonalInfoBox ul .detailedAddress {
  padding-right: 0.1rem;
}

.editPersonalInfoBox ul .detailedAddress p:nth-of-type(2) {
  width: 4.74rem;
}

.editPersonalInfoBox ul .title {
  background: #f4f4f4;
  position: relative;
  padding-right: 0;
  padding-top: 0.1rem;
  box-sizing: border-box;
  height: 0.86rem;
}

.editPersonalInfoBox ul .title p {
  line-height: 0.7rem;
  height: 0.76rem;
  color: #999;
  font-size: 0.28rem;
}

.editPersonalInfoBox ul .title span {
  line-height: 0.7rem;
  height: 0.76rem;
  color: #ccc;
  font-size: 0.22rem;
  margin-left: 0.1rem;
}

.contactRelation {
  direction: ltr;
}

/* 占位符颜色 */
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #ccc;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #ccc;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #ccc;
}

::-webkit-input-placeholder {
  color: #ccc;
}

:-moz-placeholder {
  color: #ccc;
}

::-moz-placeholder {
  color: #ccc;
}

:-ms-input-placeholder {
  color: #ccc;
}

.accountNumber {
  position: relative;
  img {
    display: inline-block;
    width: 0.32rem;
    height: 0.32rem;
    position: relative;
    top: 0.05rem;
    left: 0.6rem;
  }
  input {
    line-height: 0.3rem;
  }
}

.bankNumberWarn {
  position: absolute;
  top: 0.74rem;
  left: 0rem;
  color: #ccc;
  font-size: 0.22rem;
  height: 0.22rem;
  line-height: 0.22rem;
}

.mobileWarn {
  position: absolute;
  top: 0.74rem;
  left: 0rem;
  color: #ccc;
  font-size: 0.22rem;
  height: 0.22rem;
  line-height: 0.22rem;
}

.toastMessageFather {
  position: relative;
}

.toastMessageBox {
  position: absolute;
  top: -1.1rem;
  width: 100%;
}

.toastMessageText {
  display: table;
  background: #333;
  border-radius: 0.12rem;
  line-height: 0.4rem;
  padding: 0.15rem 0.49rem;
  font-size: 0.26rem;
  color: #fff;
  margin: 0 auto;
  text-align: center;
}

.weui-btn_primary {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  font-size: 0.3rem;
  width: 6.7rem;
  color: #fff;
  background: rgba(0, 137, 252, 1);
  border-radius: 0.1rem;
  height: 0.8rem !important;
  line-height: 0.8rem;
}

.weui-select {
  padding-left: 0;
}

.bankInfoWarn {
  float: left !important;
}

.bankInfoWarn {
  position: absolute !important;
  line-height: 0.3rem !important;
  left: 1.82rem;
  top: 0.32rem;
  width: 5.5rem !important;
}

.BankCompile {
  width: 0.16rem;
  height: 0.27rem;
  position: absolute;
  top: 0;
  right: 0.3rem;
  height: 1.1rem;
  line-height: 1.1rem;
}

.bankPosition {
  position: relative;
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
  box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  font-size: 0.34rem;
  color: #fff;
  margin: 1rem auto;
  text-align: center;
  line-height: 0.8rem;
}
select {
  background: #fff;
  font-size: 0.3rem;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
//伪元素箭头
.compile::after {
  //content: url("../../../src/assets/img/xiala.png");
  width: 0.1rem;
  height: 0.1rem;
  display: block;
}
//级联组件定位
.personArea2 {
  position: relative;
  z-index: 99;
  top: -1rem;
  left: 0;
  width: 75%;
}
.bankIput {
  width: 3.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 银行卡选择框 */

.bankListSelect {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.bankCenterBox {
  width: 6.5rem;
  max-height: 8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6.5rem;
  max-height: 8rem;
  background: #fff;
  color: #000;
  border-radius: 3px;
  box-shadow: 0px 0px 40px #3d3d3d;
  padding: 0.3rem 0;
  /* overflow: auto; */
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.bankListSelect ul li {
  position: relative;
  padding: 0.1rem 0.1rem 0.1rem 0.6rem;
}

.bankListSelect ul span {
  width: 12px;
  height: 12px;
  background: #fff;
  display: inline-block;
  border-radius: 8px;
  position: absolute;
  top: 0.15rem;
  left: 0.18rem;
  border: 1px solid #b3b3b3;
  box-sizing: border-box;
}

.bankListSelect ul i:active {
  background: #bed9fa;
}

.bankCenterBox::-webkit-scrollbar {
  display: none;
}

.bankListSelect p {
  text-align: left;
  font-size: 0.3rem;
  line-height: 0.4rem;
  box-sizing: border-box;
}

.bankListSelect ul .checked {
  border: 3px solid #3354df;
  box-sizing: border-box;
  background: #3354df;
}

.mainBank {
  word-break: break-all;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  white-space: nowrap !important;
}

.editPersonalInfoBox ul li .subBank {
  line-height: 0.35rem;
  height: 0.35rem;
  top: 50%;
  transform: translateY(-50%);
}

.mark {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  pointer-events: auto;
}

.bodyFixed {
  height: 100%;
  position: fixed;
  top: 0;
}
.cardId {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cardId1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #d0d0d0 !important;
}
.bg {
  background: #f2f3f5;
}
.center {
  width: 2rem;
  margin: auto;
  margin-top: 4rem;
  .icon {
    display: inline-block;
    margin: 0 0 0 0.4rem;
  }
  p {
    margin-top: 0.5rem;
    color: rgba(51, 84, 223, 1);
    font-size: 0.32rem;
    font-weight: 800;
  }
}
.mobleNumber {
  width: 2.6rem;
  line-height: 0.3rem;
}
.itemBtn {
  border-radius: 0.1rem;
  font-size: 0.3rem;
  padding: 0.12rem;
  border: 0.02rem solid rgba(51, 84, 223, 1);
  color: rgba(51, 84, 223, 1);
  background: #fff;
}
</style>