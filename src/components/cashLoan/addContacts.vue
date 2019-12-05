<template>
  <div>
    <div class="editPersonalInfoBox">
      <!-- 联系人1 -->
      <ul class="contactList">
        <li class="title">
          <p>联系人信息1</p>
        </li>
        <li class="switchLi">
          <p>与申请人关系</p>
          <p class="area_p">
            <select
              class="weui-select myIput contactRelation"
              name="select2"
              v-model="msgData.friendOne.contactRelationship"
              style="width:100%;"
            >
              <option
                v-for="(item,i) in contactRelationshipList"
                :key="i"
                class="carTrademarkOption"
                :value="item.itemNo"
              >{{item.itemName}}</option>
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
              v-model.trim="msgData.friendOne.contactName"
              placeholder="请输入联系人姓名"
              @blur="leave()"
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
              v-model="msgData.friendOne.contactPhone"
              placeholder="请输入手机号码"
              @blur="leave()"
            />
            <span class="mobileWarn hide">请输入正确的手机号码</span>
          </p>
        </li>
        <li class="switchLi">
          <p>所在地区</p>
          <p class="area_p">
            <input
              readonly
              type="text"
              v-model="msgData.address1"
              placeholder="请选择地区"
              class="personArea"
            />
            <selectAreaNew @getSubPageData="getSubPageDataFun1" class="personArea2"></selectAreaNew>
            <span class="compile"></span>
          </p>
        </li>
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
              v-model.trim="msgData.friendOne.contactAdd"
              @blur="leave()"
            >请输入详细地址</textarea>
          </p>
        </li>
      </ul>
      <!-- 联系人2 -->
      <ul class="contactList">
        <li class="title">
          <p>联系人信息2</p>
        </li>
        <li class="switchLi">
          <p>与申请人关系</p>
          <p class="area_p">
            <select
              class="weui-select myIput contactRelation"
              name="select2"
              v-model="msgData.friendTwo.contactRelationship"
              style="width:100%;"
            >
              <option
                v-for="(item,i) in contactRelationshipList"
                :key="i"
                class="carTrademarkOption"
                :value="item.itemNo"
              >{{item.itemName}}</option>
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
              v-model.trim="msgData.friendTwo.contactName"
              placeholder="请输入联系人姓名"
              @blur="leave()"
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
              v-model="msgData.friendTwo.contactPhone"
              placeholder="请输入手机号码"
              @blur="leave()"
            />
            <span class="mobileWarn hide">请输入正确的手机号码</span>
          </p>
        </li>
        <li class="switchLi">
          <p>所在地区</p>
          <p class="area_p">
            <input
              readonly
              type="text"
              v-model="msgData.address2"
              placeholder="请选择地区"
              class="personArea"
            />
            <selectAreaNew @getSubPageData="getSubPageDataFun2" class="personArea2"></selectAreaNew>
            <span class="compile"></span>
          </p>
        </li>
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
              v-model.trim="msgData.friendTwo.contactAdd"
              @blur="leave()"
            >请输入详细地址</textarea>
          </p>
        </li>
      </ul>
    </div>
    <div class="toastMessageFather">
      <button @click="next">下一步</button>
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
import selectAreaNew from "../assembly/selectAreaNewCl.vue";
import { bankCardAttribution } from "../../../static/js/bankCard.js";
import { Toast, Popup, Spinner } from "mint-ui";
import store from "store";
import { path } from "../../config";
import { debug } from "util";
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet,
  formatBankCardId,
  leave
} from "../../public/uilt.js";
export default {
  data() {
    return {
      msgData: {
        friendOne: {
          contactRelationship: "", //关系
          contactName: "", //名字
          contactPhone: "", //电话
          contactAdd: "", //地址
          province: "", //省
          city: "", //市
          district: "" //区
        },
        friendTwo: {
          contactRelationship: "", //关系
          contactName: "", //名字
          contactPhone: "", //电话
          contactAdd: "", //地址
          province: "", //省
          city: "", //市
          district: "" //区
        },
        address1: null,
        address2: null
      },
      serialNo: null, //合同号
      param: {
        customerId: null, //客户id
        customerCertId: null, //客户id
        customerName: null //客户id
      },
      waitData: false,
      contactRelationshipList: [] //联系人关系列表
    };
  },
  created() {
    //传参合同号
    if (store.get("serialNo")) {
      this.serialNo = store.get("serialNo");
    }
    //获取联系人关系列表
    this.queryCodeLibrary();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "添加联系人";
  },
  methods: {
    leave() {
      leave();
    },
    //获取联系人关系列表
    queryCodeLibrary() {
      let url = "queryInfo/queryClByCodeNo";
      this.$requestCl
        .get(`${url}?codeNo=RelationType`)
        .then(res => {
          if (res.data) {
            this.contactRelationshipList = res.data;
            //通过合同号查询客户id
            this.queryBySerialNo();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //通过合同号查询客户id
    queryBySerialNo() {
      let url = `businessContractInfoCtr/queryBySerialNo`;
      let param = {
        serialNo: this.serialNo
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data.customerCertId) {
            this.param.customerId = res.data.customerId;
            this.param.customerCertId = res.data.customerCertId;
            this.param.customerName = res.data.customerName;
            //获取联系人信息
            this.queryContactByCustomerId();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取联系人信息
    queryContactByCustomerId() {
      let url = `businessContractInfoCtr/queryContact?serialNo=${this.serialNo}`;
      this.$requestCl
        .get(url)
        .then(res => {
          if (res.data && res.data.length > 0) {
            //联系人1
            this.msgData.friendOne.contactRelationship =
              res.data[0].contactRelationship;
            this.msgData.friendOne.contactName = res.data[0].contactName;
            this.msgData.friendOne.contactPhone = res.data[0].contactPhone;
            this.msgData.friendOne.contactAdd = res.data[0].contactAdd;
            this.msgData.friendOne.province = res.data[0].province;
            this.msgData.friendOne.city = res.data[0].city;
            this.msgData.friendOne.district = res.data[0].district;
            //联系人2
            this.msgData.friendTwo.contactRelationship =
              res.data[1].contactRelationship;
            this.msgData.friendTwo.contactName = res.data[1].contactName;
            this.msgData.friendTwo.contactPhone = res.data[1].contactPhone;
            this.msgData.friendTwo.contactAdd = res.data[1].contactAdd;
            this.msgData.friendTwo.province = res.data[1].province;
            this.msgData.friendTwo.city = res.data[1].city;
            this.msgData.friendTwo.district = res.data[1].district;
            if (
              res.data[0].province &&
              res.data[0].city &&
              res.data[0].district
            ) {
              this.msgData.address1 =
                res.data[0].province + res.data[0].city + res.data[0].district;
            }
            if (
              res.data[1].province &&
              res.data[1].city &&
              res.data[1].district
            ) {
              this.msgData.address2 =
                res.data[1].province + res.data[1].city + res.data[1].district;
            }
          }
          if (store.get("userContactsMessage")) {
            let localMsg = JSON.parse(
              JSON.stringify(store.get("userContactsMessage"))
            );
            this.msgData = localMsg;
            this.msgData.friendOne = localMsg.friendOne;
            this.msgData.friendTwo = localMsg.friendTwo;
            //console.log(store.get("userContactsMessage"));
            //console.log(localMsg, 11);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //接收子页面传入地址
    getSubPageDataFun1(msg) {
      //console.log(`联系人1`, msg);
      this.msgData.friendOne.contactAddId = msg.countyId;
      this.msgData.friendOne.province = msg.provinceName;
      this.msgData.friendOne.city = msg.cityName;
      this.msgData.friendOne.district = msg.countyName;
      this.msgData.address1 = msg.provinceName + msg.cityName + msg.countyName;
    },
    getSubPageDataFun2(msg) {
      //console.log("联系人2", msg);
      this.msgData.friendTwo.contactAddId = msg.countyId;
      this.msgData.friendTwo.province = msg.provinceName;
      this.msgData.friendTwo.city = msg.cityName;
      this.msgData.friendTwo.district = msg.countyName;
      this.msgData.address2 = msg.provinceName + msg.cityName + msg.countyName;
    },
    //下一步
    next() {
      let msgArr = Object.values(this.msgData);
      for (let i = 0; i < msgArr.length; i++) {
        if (!msgArr[i]) {
          Toast("请检查还有未填信息");
          return;
        }
      }
      let msgArr1 = Object.values(this.msgData.friendOne);
      for (let i = 0; i < msgArr1.length; i++) {
        if (!msgArr1[i]) {
          //console.log(msgArr1);
          Toast("请检查还有未填信息");
          return;
        }
      }
      let msgArr2 = Object.values(this.msgData.friendTwo);
      for (let i = 0; i < msgArr2.length; i++) {
        if (!msgArr2[i]) {
          //console.log(msgArr2);
          Toast("请检查还有未填信息");
          return;
        }
      }
      //保存联系人信息
      let promise1 = this.saveBasicInfo();
      if (promise1 == false) {
        return;
      } else {
        Promise.all([promise1]).then(values => {
          store.remove("userContactsMessage");
          this.$router.push({
            path: "/bankCardPhoto",
            query: {
              serialNo: this.serialNo,
              customerId: this.param.customerId
            }
          });
        });
      }
    },
    //保存联系人信息
    saveBasicInfo() {
      // if (
      //   this.msgData.friendOne.contactRelationship ==
      //   this.msgData.friendTwo.contactRelationship
      // ) {
      //   Toast("与申请人关系不能重复");
      //   return false;
      // }
      if (
        this.msgData.friendOne.contactRelationship == "01" &&
        this.msgData.friendTwo.contactRelationship == "01"
      ) {
        Toast("与申请人关系不能重复");
        return false;
      }
      if (
        this.msgData.friendOne.contactRelationship == "02" &&
        this.msgData.friendTwo.contactRelationship == "02"
      ) {
        Toast("与申请人关系不能重复");
        return false;
      }
      if (
        this.msgData.friendOne.contactRelationship == "03" &&
        this.msgData.friendTwo.contactRelationship == "03"
      ) {
        Toast("与申请人关系不能重复");
        return false;
      }
      if (
        this.msgData.friendOne.contactName == this.msgData.friendTwo.contactName
      ) {
        Toast("联系人不能重复填写");
        return false;
      }
      if (
        this.msgData.friendOne.contactPhone ==
        this.msgData.friendTwo.contactPhone
      ) {
        Toast("联系人电话不能重复填写");
        return false;
      }
      if (
        this.msgData.friendOne.contactPhone.length != 11 ||
        this.msgData.friendTwo.contactPhone.length != 11
      ) {
        Toast("请输入正确的手机号");
        return false;
      }
      //保存联系人信息
      return this.updateContact(this.msgData.friendOne, this.msgData.friendTwo);
    },
    //修改联系人信息接口
    updateContact(friend1, friend2) {
      let url = "customerContactInfoCtr/save";
      let customerIdData = {
        serialNo: this.serialNo
      };
      //console.log(customerIdData);
      let param1 = Object.assign({}, friend1, customerIdData);
      let param2 = Object.assign({}, friend2, customerIdData);
      let param = [param1, param2];
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == "200") {
            console.log("保存联系人成功");
          } else {
            Toast("联系人信息保存失败");
            return false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    selectAreaNew
  },
  beforeDestroy() {
    store.set("userContactsMessage", this.msgData);
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
  color: #ccc !important;
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
  top: 0.37rem;
  right: 0.15rem;
  line-height: 1.1rem;
  background: url("../../../src/assets/img/xiala.png") no-repeat center/100%;
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
  padding-bottom: 1rem;
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
  /* margin-left: 0.2rem; */
  left: 1.82rem;
  top: 0.32rem;
  width: 5.5rem !important;
}

.BankCompile {
  width: 0.16rem;
  height: 0.27rem;
  position: absolute;
  top: 0.5rem;
  right: 0.15rem;
  line-height: 1rem;
  background: url("../../../src/assets/img/xiala.png") no-repeat center/100%;
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
  font-size: 0.3rem;
  color: #fff;
  margin: 0.8rem auto;
  margin-bottom: 1rem;
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
  //background: url("../../../src/assets/img/xiala.png") no-repeat center/100%;
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