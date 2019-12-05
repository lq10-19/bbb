<template>
  <div>
    <div class="editPersonalInfoBox">
      <ul>
        <li class="title clearfix">
          <p>个人信息</p>
          <span class="person_worn">如信息有变更，请拨打客服热线：400-9987-103</span>
        </li>
        <li>
          <p>姓名</p>
          <p class="thisName myToast">{{msgData.customername}}</p>
        </li>
        <li>
          <p>性别</p>
          <p class="sex">{{msgData.sex==1?"男":"女"}}</p>
        </li>
        <li>
          <p>身份证号码</p>
          <p class="cardId">{{msgData.certid}}</p>
        </li>
        <li>
          <p>手机号码</p>
          <p class="cardId">{{msgData.mobiletelephone}}</p>
          <!-- <p class="area_p">
            <input
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              class="mobleNumber"
              v-model="msgData.myPhoneNum"
              placeholder="请输入手机号码"
            >
            <span class="mobileWarn hide">请输入正确的手机号码</span>
          </p>-->
        </li>
        <li>
          <p>所在地区</p>
          <p class="cardId">{{msgData.myAddress}}</p>
          <!-- <p class="area_p">
            <input
              readonly
              type="text"
              v-model="msgData.myAddress"
              placeholder="请选择地区"
              class="myIput area1"
            >
            <selectAreaNew @getSubPageData="getSubPageDataFun0" class="personArea2"></selectAreaNew>
            <span class="compile"></span>
          </p>-->
        </li>
        <li class="detailedAddress" id="myDetailedAddress">
          <p>详细地址</p>
          <!-- <p id="cardId1">{{msgData.countryside}}</p> -->
          <p>
            <textarea
              class="areaSelect areaSelect2 areaSelectVal"
              name
              id
              cols
              rows="1"
              readonly="readonly"
              style="background-color:#fff"
              placeholder="请输入详细地址"
              v-model="msgData.countryside"
            >请输入详细地址</textarea>
          </p>
        </li>
      </ul>
      <ul class="bank_ul">
        <li class="title">
          <p>银行卡信息</p>
          <p class="person_worn bankInfoWarn">填写的银行卡信息与上传的银行卡照片信息要保持一致</p>
        </li>
        <li class="switchLi">
          <p>开户银行</p>
          <p class="area_p cardId" @click="openBank">
            {{msgData.bankName}}
            <!-- <select
              placeholder="请输入开户银行"
              class="myIput bankIput mainBank"
              v-model="msgData.bankName"
              @change="Obtain"
            >
              <option
                class="carTrademarkOption"
                v-for="(item,i) in bankList"
                :key="i"
                :value="item.text"
              >{{item.text}}</option>
            </select>-->
            <span class="compile"></span>
          </p>
        </li>

        <li class="switchLi">
          <p>所在地区</p>
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
          <p class="area_p cardId" @click="openSubbranch">
            {{msgData.subbranch}}
            <!-- <select
              type="text"
              v-model="msgData.subbranch"
              placeholder="请输入开户支行"
              class="myIput bankIput subBank"
              @change="changeSubbranch"
            >
              <option
                class="carTrademarkOption"
                v-for="(item,i) in subbranchList"
                :key="i"
                :value="item.bankCode"
                ref="newBank"
              >{{item.name}}</option>
            </select>-->
            <span class="compile"></span>
          </p>
        </li>

        <li>
          <p>账户名</p>
          <p class="accounName">{{msgData.customername}}</p>
        </li>
        <li>
          <p>账号</p>
          <p class="accountNumber">
            <input
              type="number"
              v-model="msgData.bankCard"
              oninput="if(value.length>19)value=value.slice(0,19)"
              placeholder="请输入银行卡账号"
              class="myIput bankIput bankNumber"
            />
            <span class="bankNumberWarn hide">请输入16位、18位或19位正确的银行卡号</span>
          </p>
        </li>

        <li>
          <p>预留手机号码</p>
          <p class="area_p">
            <input
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              class="mobleNumber"
              v-model="msgData.bankPhoneNum"
              placeholder="请输入手机号码"
            />
            <span class="mobileWarn hide">请输入正确的手机号码</span>
          </p>
        </li>
      </ul>

      <ul class="contactList" v-for="(item,i) in msgData.friend" :key="i">
        <li class="title">
          <p>联系人信息</p>
        </li>
        <li class="switchLi">
          <p>与申请人关系</p>
          <p class="area_p">
            <select
              class="weui-select myIput contactRelation"
              name="select2"
              v-model="item.participantstatus"
            >
              <option class="carTrademarkOption" value="01">配偶</option>
              <option class="carTrademarkOption" value="02">父亲</option>
              <option class="carTrademarkOption" value="03">母亲</option>
              <option class="carTrademarkOption" value="04">直系亲属</option>
              <option class="carTrademarkOption" value="05">非直系亲属</option>
              <option class="carTrademarkOption" value="06">同事</option>
              <option class="carTrademarkOption" value="07">朋友</option>
              <option class="carTrademarkOption" value="99">其他</option>
            </select>
            <span class="compile"></span>
          </p>
        </li>
        <li>
          <p>联系人姓名</p>
          <p>
            <input
              type="text"
              class="personName"
              v-model="item.participantname"
              placeholder="请输入联系人姓名"
            />
          </p>
        </li>
        <li>
          <p>手机号码</p>
          <p class="area_p">
            <input
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              class="mobleNumber"
              v-model="item.participantphone"
              placeholder="请输入手机号码"
            />
            <span class="mobileWarn hide">请输入正确的手机号码</span>
          </p>
        </li>
        <!-- <li class="switchLi">
          <p>所在地区</p>
          <p class="area_p">
            <input
              readonly
              type="text"
              v-model="msgData.friendAddress1"
              placeholder="请选择地区"
              class="personArea"
            >
            <selectAreaNew @getSubPageData="getSubPageDataFun1" class="personArea2"></selectAreaNew>
            <span class="compile"></span>
          </p>
        </li>-->
        <li class="detailedAddress">
          <p>详细地址</p>
          <p>
            <textarea
              class="areaSelect areaSelect2 areaSelectVal"
              name
              id
              cols
              rows="1"
              placeholder="请输入详细地址"
              v-model="item.participantadd"
            >请输入详细地址</textarea>
          </p>
        </li>
      </ul>
      <!-- <ul class="contactList">
        <li class="title">
          <p>联系人信息2</p>
        </li>
        <li class="switchLi">
          <p>与申请人关系</p>
          <p class="area_p">
            <select
              class="weui-select myIput contactRelation"
              name="select2"
              v-model="msgData.friend[1].participantstatus"
            >
              <option class="carTrademarkOption" value="01">配偶</option>
              <option class="carTrademarkOption" value="02">父亲</option>
              <option class="carTrademarkOption" value="03">母亲</option>
              <option class="carTrademarkOption" value="04">直系亲属</option>
              <option class="carTrademarkOption" value="05">非直系亲属</option>
              <option class="carTrademarkOption" value="06">同事</option>
              <option class="carTrademarkOption" value="07">朋友</option>
              <option class="carTrademarkOption" value="99">其他</option>
            </select>
            <span class="compile"></span>
          </p>
        </li>
        <li>
          <p>联系人姓名</p>
          <p>
            <input
              type="text"
              class="personName"
              v-model="msgData.friend[1].participantname"
              placeholder="请输入联系人姓名"
            >
          </p>
        </li>
        <li>
          <p>手机号码</p>
          <p class="area_p">
            <input
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              class="mobleNumber"
              v-model="msgData.friend[1].participantphone"
              placeholder="请输入手机号码"
            >
            <span class="mobileWarn hide">请输入正确的手机号码</span>
          </p>
        </li>
        <li class="detailedAddress">
          <p>详细地址</p>
          <p>
            <textarea
              class="areaSelect areaSelect2"
              name
              id
              cols
              rows="1"
              placeholder="请输入详细地址"
              v-model="msgData.friend[1].participantadd"
            ></textarea>
          </p>
        </li>
      </ul>-->
    </div>
    <div class="toastMessageFather">
      <button @click="next">已确认全部信息</button>
    </div>
    <!-- 主行弹出框选择列表 -->
    <div class="bankListSelect mainBankList mark" v-if="showBank">
      <ul class="bankCenterBox bankList_ul">
        <li v-for="(item,i) in bankList" :key="i" @click="selectBank(item)">
          <i :class="{checked:subBankSlect1==item.name}"></i>
          <p>{{item.text}}</p>
        </li>
      </ul>
    </div>
    <!-- 支行弹出框选择列表 -->
    <div class="bankListSelect subBankList mark" v-if="showSubbranch">
      <div id="ul" class="scrollable">
        <ul id="menuList" class="bankCenterBox subBankList_ul layerNode">
          <li @click="selectSubbranch(item)" v-for="(item,i) in subbranchList" :key="i">
            <i :class="{checked:subBankSlect2==item.name}"></i>
            <p>{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- Loading -->
    <div class="bankListSelect subBankList mark bg" v-if="waitData">
      <div class="center">
        <mt-spinner type="fading-circle" class="icon" color="#26a2ff" :size="50"></mt-spinner>
        <p>数据加载中...</p>
      </div>
    </div>
  </div>
</template>
<script>
import selectAreaNew from "../assembly/selectAreaNew.vue";
import { bankCardAttribution } from "../../../static/js/bankCard.js";
//import { getBank } from "../../../static/js/bank.js";
import { Toast, Popup, Spinner } from "mint-ui";
import store from "store";
import { path } from "../../config";
import { debug } from "util";
export default {
  data() {
    return {
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
        customername: "", //姓名
        sex: "", //1:男
        certid: "", //身份证号
        mobiletelephone: "", //手机号
        myAddress: "", //本人地址
        familyadd: "", //地区编号
        countryside: "", //详细地址
        bankName: "中国工商银行",
        bankCode: "102", //总行编号
        myBankAddress: "", //开户行地区
        myBankProvinceName: "",
        myBankProvinceId: "",
        myBankCityName: "",
        myBankCityId: "",
        cityCode: "", //城市编号
        bankCountyId: "", //银行所在城市编号
        subbranch: "", //支行名称
        subbranchCode: "", //支行编码
        bankCard: "", //银行卡号
        bankPhoneNum: "", //银行预留手机
        friend: [
          {
            participantstatus: "", //关系
            participantname: "", //名字
            participantphone: "", //电话
            participantadd: "" //地址
          },
          {
            participantstatus: "",
            participantname: "",
            participantphone: "",
            participantadd: ""
          }
        ]
      },
      param: {},
      subBankSlect1: false, //选择总行
      subBankSlect2: false, //选择支行
      waitData: true
    };
  },
  created() {
    this.param = this.$route.query;
    if (store.get("userMessage")) {
      let localMsg = store.get("userMessage");
      this.msgData = localMsg;
    }
    //获取银行卡号
    if (this.$route.query.replaceaccount) {
      this.msgData.bankCard = this.$route.query.replaceaccount;
    }
    //获取客户信息
    this.getPersonInfo();
    //获取联系人信息
    this.findGuarantee();
    //获取支行
    this.Obtain();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "信息确认";
  },
  components: {
    selectAreaNew
  },
  methods: {
    //接口平台获取城市列表
    getCityList() {
      let url = "cashloan/getProvince";
      this.$request2
        .get(url)
        .then(res => {
          let ProvinceNum = this.msgData.familyadd.substr(0, 2);
          let CityNum = this.msgData.familyadd.substr(0, 4);
          let CountyNum = this.msgData.familyadd.substr(0, 6);
          let provinceName = "";
          let cityName = "";
          let areaName = "";
          let ProvinceArr = res.data;
          ProvinceArr.forEach(element => {
            if (element.provinceCode == ProvinceNum + "0000") {
              let cityArr = Object.values(element.cityMapList)[0];
              provinceName = element.provinceName;
              cityArr.forEach(ele => {
                if (ele.cityCode == CityNum + "00") {
                  let CountyArr = Object.values(ele.districtMap)[0];
                  cityName = ele.cityName;
                  CountyArr.forEach(e => {
                    if (e.areaCode == CountyNum) {
                      this.msgData.myAddress =
                        provinceName + cityName + e.areaName;
                      this.msgData.countryside =
                        this.msgData.myAddress + this.msgData.countryside;
                      this.waitData = !this.waitData;
                    }
                  });
                }
              });
            }
          });
          if (this.waitData) {
            this.msgData.myAddress = provinceName + cityName + areaName;
            this.waitData = !this.waitData;
          }
        })
        .catch(error => {
          console.log(error);
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
    //获取客户信息
    getPersonInfo() {
      let url = "cashloan/getPersonInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          // console.log(res,667);
          this.msgData.customername = res.data.customername;
          this.msgData.sex = res.data.sex;
          this.msgData.certid = res.data.certid;
          this.msgData.mobiletelephone = res.data.mobiletelephone;
          this.msgData.familyadd = res.data.familyadd;
          //console.log(this.msgData.familyadd)
          //详细住址（省市区+乡镇+街区+小区+房号）
          this.msgData.countryside =
            (res.data.countryside ? res.data.countryside : "") +
            (res.data.villagecenter ? res.data.villagecenter : "") +
            (res.data.plot ? res.data.plot : "") +
            (res.data.room ? res.data.room : "");
          //获取城市列表
          this.getCityList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取联系人信息
    findGuarantee() {
      let url = "cashloan/findGuarantee";
      this.$request2
        .post(url, this.param)
        .then(res => {
          this.msgData.friend = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //接收子页面传入地址
    // getSubPageDataFun0(msg) {
    //   //console.log("本人", msg);
    //   this.msgData.myCountyId = msg.countyId;
    //   this.msgData.myAddress = msg.provinceName + msg.cityName + msg.countyName;
    // },
    // getSubPageDataFun1(msg) {
    //   //console.log("联系人1", msg);
    //   this.msgData.friendOneCountyId = msg.countyId;
    //   this.msgData.friendAddress1 =
    //     msg.provinceName + msg.cityName + msg.countyName;
    // },
    // getSubPageDataFun2(msg) {
    //   //console.log("联系人2", msg);
    //   this.msgData.friendTwoCountyId = msg.countyId;
    //   this.msgData.friendAddress2 =
    //     msg.provinceName + msg.cityName + msg.countyName;
    // },
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
      this.msgData.cityCode = msg.countyId;
      this.Obtain();
    },
    //获取支行
    Obtain() {
      let url = "cashloan/getAllBankInfo";
      let param = {
        bankCode: this.msgData.bankCode,
        city: this.msgData.bankCountyId
      };
      //console.log(this.msgData.bankCountyId, 111);
      this.$request2
        .post(url, param)
        .then(res => {
          if (res.data.bank.length <= 0) {
            this.subbranchList = [];
          } else {
            this.subbranchList = [];
            this.subbranchList.push(...res.data.bank);
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
    changeSubbranch() {
      //console.log(this.$refs.newBank);
      //this.msgData.subbranch = this.$refs.newBank[this.subbranchList].name
    },
    //银行卡
    // changeBankCard() {
    //   //通过卡号获得银行名称
    //   //console.log(bankCardAttribution(`${this.msgData.bankCard}`))
    //   this.msgData.bankName = bankCardAttribution(
    //     `${this.msgData.bankCard}`
    //   ).bankName;
    // },
    //下一步
    next() {
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
      let promise1 = this.updateBankInfo();
      //保存联系人信息
      let promise2 = this.saveBasicInfo();
      //提交信息
      let promise3 = this.saveOrUpdate();
      // [promise1, promise2, promise3]
      if (promise2 == false) {
        return;
      } else {
        Promise.all([promise1, promise2, promise3]).then(values => {
          this.$router.push({
            path: "/photo",
            query: this.param
          });
        });
      }
    },
    //保存修改银行信息
    updateBankInfo() {
      let url = "contract/updateBankInfo";
      let param = {
        serialno: this.param.serialno, //合同号
        openbank: this.msgData.bankCode, //代扣开户行编码，同放款开户行银行行号
        openbankname: this.msgData.bankName, //代扣开户行名称，同放款开户行银行名称
        openbranch: this.msgData.subbranchCode, //代扣开户支行编码，同放款开户支行行号
        openbranchname: this.msgData.subbranch, //代扣开户支行名称，同放款开户支行名称
        prephone: this.msgData.bankPhoneNum, //银行预留手机号
        putoutcity: this.msgData.myBankCityName, //代扣开户行城市
        putoutprovince: this.msgData.myBankProvinceName, //代扣开户行省份
        replaceaccount: this.msgData.bankCard, //代扣账号，同放款账号
        replacename: this.msgData.customername, //代扣账号户名，同放款账户名称
        replacecity: this.msgData.myBankCityName, //城市
        replaceprovince: this.msgData.myBankProvinceName //省份
      };
      this.$request2
        .post(url, param)
        .then(res => {
          console.log("保存银行信息成功：", res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //判断重复
    isRepeat(arr) {
      var hash = {};
      for (var i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i]] = true;
      }
      return false;
    },
    //保存联系人信息
    saveBasicInfo() {
      let arrName = [];
      let arrPhone = [];
      this.msgData.friend.forEach(element => {
        arrName.push(element.participantname);
        arrPhone.push(element.participantphone);
      });
      console.log(this.isRepeat(arrName));
      if (this.isRepeat(arrName)) {
        Toast("联系人不能重复填写");
        return false;
      }
      if (this.isRepeat(arrPhone)) {
        Toast("联系人电话不能重复填写");
        return false;
      }
      let url = "saveBasicInfo/entranceCheck";
      let param = {
        customerParticipantList: this.msgData.friend
      };
      this.$request2
        .post(url, param)
        .then(res => {
          console.log("保存联系人成功：", res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //提交信息
    saveOrUpdate() {
      let url = "cashloanAply/saveOrUpdate";
      let param = {
        putoutno: this.param.serialno, //新合同号
        mobiletelephone: this.msgData.mobiletelephone, //手机号
        region: this.msgData.myBankProvinceId, //开户支行所在省
        address: this.msgData.myBankCityId, //开户支行所在市
        bankaccountnum: this.msgData.bankCard, //银行卡帐号
        openbank: this.msgData.bankCode, //银行卡开户银行编码
        openbranch: this.msgData.subbranchCode, //银行卡开户支行编码
        openbankname: this.msgData.bankName, //银行卡开户银行名称
        openbranchname: this.msgData.subbranch, //银行卡开户支行名称
        reservemobile: this.msgData.bankPhoneNum, //银行预留手机号码
        accountName: this.msgData.customername, //账户名称
        intInfoAdderss: this.msgData.myAddress, //本人地址
        intInfoAdder: this.msgData.familyadd, //本人地址编码
      };
      this.$requestWx
        .post(url, param)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  //本地缓存
  updated() {
    store.set("userMessage", this.msgData);
    //console.log(window.localStorage.getItem('userMessage'))
  }
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
  height: 1rem;
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
  padding: 0 0.32rem;
}

.editPersonalInfoBox ul li p {
  float: left;
  font-family: "PingFangSC-Regular";
  font-size: 0.3rem;
  color: #666;
  height: 1rem;
  line-height: 1rem;
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
  width: 4.52rem;
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
  width: 4.52rem;
}

.editPersonalInfoBox ul li .person_worn {
  font-size: 0.2rem !important;
  color: red !important;
  float: left;
  height: 1rem;
  line-height: 1rem;
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
  top: 0;
  right: 0;
  height: 1rem;
  line-height: 1rem;
  //background: url("../images/bianJi@2x.png") no-repeat center/100%;
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
  color: #e64340;
  font-size: 0.22rem;
  margin-left: 0.1rem;
}

.contactRelation {
  direction: ltr;
}

/* 占位符颜色 */
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #e64340;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #e64340;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #e64340;
}

::-webkit-input-placeholder {
  color: #e64340;
}

:-moz-placeholder {
  color: #e64340;
}

::-moz-placeholder {
  color: #e64340;
}

:-ms-input-placeholder {
  color: #e64340;
}

.accountNumber {
  position: relative;
}

.bankNumberWarn {
  position: absolute;
  top: 0.74rem;
  left: 0rem;
  color: red;
  font-size: 0.22rem;
  height: 0.22rem;
  line-height: 0.22rem;
}

.mobileWarn {
  position: absolute;
  top: 0.74rem;
  left: 0rem;
  color: red;
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
  background: #ff7f36;
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
  /* margin-left: 0.2rem; */
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
  height: 1rem;
  line-height: 1rem;
  //background: url("../images/bianJi@2x.png") no-repeat center/100%;
}

.bankPosition {
  position: relative;
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
select {
  background: #fff;
  font-size: 0.3rem;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
//伪元素箭头
.compile::after {
  content: url("../../../src/assets/img/triangleChange.png");
  width: 0.1rem;
  height: 0.1rem;
  // padding-top: 0.35rem;
  // text-align: right;
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
  width: 4rem;
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
  /* overflow: hidden; */
  /* z-index: 9999; */
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

.bankListSelect ul i {
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
  /* background: red; */
  border: 3px solid #509eff;
  box-sizing: border-box;
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
// #myDetailedAddress {
//   min-height: 2rem;
//   width: 7.5rem;
//   white-space: pre-wrap;
//   //word-break:break-all;
//   //word-wrap:break-word;

// }
// #cardId1 {
//   min-height: 2rem;
//   width: 4.5rem;
//   line-height: 1rem;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   margin-right: 0.7rem;
//   //white-space: nowrap;
//   // white-space: pre-wrap;
// }
.cardId {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    color: #26a2ff;
    font-size: 0.32rem;
    font-weight: 800;
  }
}
</style>