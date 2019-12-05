<template>
  <div class="bigBox">
    <div class="editPersonalInfoBox">
      <li class="switchLi">
        <p class="p2">
          请选择变更原因
          <span class="red">*</span>
        </p>
        <p class="area_p">
          <select class="weui-select myIput contactRelation" name="select2" v-model="reasonId">
            <option value disabled selected style="display:none;">请选择</option>
            <option
              class="carTrademarkOption"
              :value="item.itemNo"
              v-for="(item, i) in reasonList"
              :key="i"
            >{{item.itemName}}</option>
          </select>
          <span class="compile"></span>
        </p>
      </li>
      <li v-if="reasonFlag" class="li2">
        <p>
          详细原因
          <span class="red">*</span>
        </p>
        <p>
          <textarea
            class="areaSelect areaSelect2 areaSelectVal"
            name
            id
            cols
            rows="1"
            placeholder="请详细说明，20字以内"
            v-model="detailedReasons"
            maxlength="20"
          >请说明原因，20字以内</textarea>
        </p>
      </li>
    </div>
    <div class="line"></div>
    <!-- <div class="line2"></div>
    <div class="line"></div>-->
    <div class="checkBox">
      <div class="checkTitle" v-if="flag">
        <!-- <input type="checkbox" @click="checkAll" v-model="checked" class="checkbox-list-input" /> -->
        <van-checkbox v-model="checked" @click="checkAll" checked-color="#3354df">请选择需要变更的订单</van-checkbox>
        <!-- <span>请选择需要变更的订单</span> -->
      </div>
      <ul v-if="flag">
        <van-checkbox-group class="li" v-model="checkModel" ref="checkboxGroup">
          <van-checkbox
            :name="item"
            class="item"
            v-for="(item,i) in orderList"
            :key="i"
            checked-color="#3354df"
          >
            <div class="box">
              <div class="msg">
                <p class="idCard">
                  业务编号：
                  <span>{{item.serialNo}}</span>
                </p>
                <p class="time">
                  {{item.productName}}：
                  <span>￥{{item.applyAmount}}</span>
                </p>
              </div>
              <div class="state">
                <span>放款成功</span>
                <!-- <p>￥{{item.applyAmount}}</p> -->
              </div>
            </div>
          </van-checkbox>
        </van-checkbox-group>

        <!-- <li class="item" v-for="(item,i) in orderList" :key="i">
          <input type="checkbox" v-model="checkModel" :value="item" class="checkbox-list-input" />
          <div class="box">
            <div class="msg">
              <p class="idCard">
                业务编号：
                <span>{{item.serialNo}}</span>
              </p>
              <p class="time">
                {{item.productName}}：
                <span>￥{{item.applyAmount}}</span>
              </p>
            </div>
            <div class="state">
              <span>放款成功</span>
            </div>
          </div>
        </li>-->
      </ul>
      <div class="bigbox" v-if="!flag">
        <img class="nullImg" src="../../assets/img/wu@2x.png" />
        <p class="nullTxt">暂时没有订单~</p>
      </div>
    </div>
    <button @click="goNext" class="button">变更银行卡</button>
  </div>
</template>

<script>
import { Toast, Dialog, Checkbox, CheckboxGroup } from "vant";
import { fips } from "crypto";
import store from "store";
export default {
  components: {},
  data() {
    return {
      //active: 0,
      mobile: null,
      flag: false, //默认没有合同
      reasonList: [], //原因列表
      reasonId: "", //默认原因01
      reasonFlag: false, //详细原因开关
      detailedReasons: null, //详细原因
      orderList: [
        {
          serialNo: "123456789",
          productName: "佰乐花",
          applyAmount: "20000.00"
        },
        {
          serialNo: "987654321",
          productName: "佰乐花",
          applyAmount: "20000.00"
        }
      ],
      checked: false, //是否全选
      checkModel: [], //双向数据绑定的数组，item
      serialNo: null, //单笔合同传入合同号
      customerId: null //个人中心传入客户id
    };
  },
  watch: {
    //监听全选按钮
    // checkModel() {
    //   if (this.checkModel.length == this.orderList.length) {
    //     this.checked = true;
    //   } else {
    //     this.checked = false;
    //   }
    //   console.log("选中单", this.checkModel);
    // },
    //监听选择原因
    reasonId() {
      if (this.reasonId == 99) {
        this.reasonFlag = true;
      } else {
        this.reasonFlag = false;
      }
    }
  },
  created() {
    store.remove("userBankMessageNew"); //清除重绑卡银行信息
    store.remove("tempDataSet"); //清除ocr信息 身份证和银行卡
    store.remove("recordIdList"); //清除记录id列表
    store.remove("serialNoList"); //清除合同号列表
    // store.remove("verificationCode"); //清除金融验证码
    // store.remove("lasserialno"); //清除流水号
    if (this.$route.query.mobile) {
      this.mobile = this.$route.query.mobile;
    }
    //获取重新绑卡的合同号
    if (this.$route.query.serialNo) {
      this.serialNo = this.$route.query.serialNo;
      console.log("合同号", this.serialNo);
    }
    //获取客户id
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId;
      console.log("客户id", this.customerId);
    }
    //获取原因列表
    this.queryCodeLibrary();
    //获取订单列表
    this.getGoodsList();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "变更银行卡";
  },
  methods: {
    //全选
    checkAll() {
      console.log(this.$refs.checkboxGroup);
      this.$refs.checkboxGroup.toggleAll(true);
    },
    //获取原因列表
    queryCodeLibrary() {
      let url = "codeLibrary/queryCodeLibrary";
      this.$requestCl2
        .get(`${url}?codeNo=BankCardChangeType`)
        .then(res => {
          if (res.data) {
            this.reasonList = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //切换标签
    // onChange(event) {
    //   console.log(event, 111);
    // },
    //获取订单列表
    getGoodsList() {
      if (this.$route.query.customerId) {
        let url = `bankCardChange/queryLoanSuccessInfo?customerId=${this.customerId}`;
        let param = {
          customerId: this.customerId
        };
        this.$requestCl
          .get(url)
          .then(res => {
            if (res.data && res.data.length > 0) {
              this.orderList = res.data;
              this.flag = true;
            }
          })
          .catch(error => {
            console.log("error" + error);
          });
      } else if (this.$route.query.serialNo) {
        let url = `bankCardChange/queryLoanSuccessInfo?serialNo=${this.serialNo}`;
        let param = {
          serialNo: this.serialNo
        };
        this.$requestCl
          .get(url)
          .then(res => {
            if (res.data && res.data.length > 0) {
              this.orderList = res.data;
              this.flag = true;
            }
          })
          .catch(error => {
            console.log("error" + error);
          });
      }
    },
    //重绑银行卡页
    goNext() {
      //判断填写信息
      if (this.reasonId) {
        if (this.reasonId == 99) {
          if (!this.detailedReasons) {
            Toast("请填写详细原因");
            return;
          } else {
            if (this.checkModel.length <= 0) {
              Toast("请选择要变更的订单");
              return;
            }
          }
        } else {
          if (this.checkModel.length <= 0) {
            Toast("请选择要变更的订单");
            return;
          }
        }
      } else {
        Toast("请选择变更原因");
        return;
      }

      //变更银行卡传合同号列表
      this.insertBanlCardChangeLog();
    },
    //变更银行卡保存记录接口
    insertBanlCardChangeLog() {
      let checkModelMsg = [];
      this.checkModel.forEach(element => {
        element.bankCardChangeType = this.reasonId;
        element.bankCardChangeDetailed = this.detailedReasons;
        checkModelMsg.push(element);
      });
      let url = `bankCardChange/insertBanlCardChangeLog`;
      let param = {
        listCustomerId: checkModelMsg
      };
      this.$requestCl
        .post(url, checkModelMsg)
        .then(res => {
          if (res.code == 200) {
            //保存记录id
            this.recordIdList = res.data.recordIdList;
            store.set("recordIdList", res.data.recordIdList);
            this.serialNoList = res.data.serialNoList;
            store.set("serialNoList", res.data.serialNoList);
            //跳转重新添加银行卡
            this.goAgainAddBankCard();
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //跳转重新添加银行卡
    goAgainAddBankCard() {
      // let serialNoList = JSON.stringify(this.serialNoList);
      // let recordIdList = JSON.stringify(this.recordIdList);
      this.$router.push({
        path: "/againAddBankCard",
        query: {
          // serialNoList,
          // recordIdList
        }
      });
    },
    //全选
    checkAll() {
      if (this.checked) {
        this.checkModel = [];
      } else {
        this.orderList.forEach(item => {
          if (this.checkModel.indexOf(item) == -1) {
            this.checkModel.push(item);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  .checkBox {
    .checkTitle {
      background: #fff;
      color: #000;
      font-size: 0.3rem;
      line-height: 0.8rem;
      padding-left: 0.43rem;
      padding-top: 0.15rem;
      height: 0.8rem;
      span {
        margin-left: 0.27rem;
      }
    }
  }
  ul {
    width: 100%;
    //margin: 0.1rem auto;
    .li {
      padding: 0.4rem 0;
      padding-top: 0;
      padding-left: 0.43rem;
      margin: 0.2rem auto;
      margin-top: 0;
      border-top: 0.01rem solid #eee;
      //border-radius: 0.25rem;
      background: #fff;
      .item {
        width: 100%;
        height: 1.5rem;
      }
      input {
        display: inline;
        position: relative;
        top: 0.45rem;
      }
      .box {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 0.55rem;
        position: relative;
        top: 0.27rem;
        .msg {
          text-align: left;
        }
        .state {
          span {
            display: inline-block;
            border-radius: 0.27rem;
            width: 100%;
            height: 0.54rem;
            text-align: right;
            line-height: 0.54rem;
            color: #3354df;
            margin-left: 0.3rem;
          }
          p {
            font-size: 0.28rem;
            font-weight: 500;
            line-height: 0.56rem;
            text-align: right;
          }
          button {
            margin-top: 0.1rem;
            border-radius: 0.1rem;
            margin-left: 0.1rem;
            width: 1.5rem;
            border: 0.01rem solid #000;
          }
          .cancel {
            background: #fff;
          }
          .continue {
            border-color: rgba(0, 137, 252, 1);
            background: rgba(0, 137, 252, 1);
            color: #fff;
          }
          .withdraw {
            width: 1.8rem;
            background: #fff;
          }
          .bindBankCard {
            width: 1.8rem;
            border-color: rgba(0, 137, 252, 1);
            background: rgba(0, 137, 252, 1);
            color: #fff;
          }
        }
      }
    }
  }
  .bigbox {
    position: absolute;
    width: 100%;
    font-size: 0.28rem;
    background: #f2f3f5;
    .nullImg {
      width: 3rem;
      height: 2rem;
      display: block;
      margin: 0 auto;
      margin-top: 3rem;
    }
    .nullTxt {
      width: 50%;
      margin: 0 auto;
      margin-top: 0.5rem;
      text-align: center;
      color: rgba(208, 208, 208, 1);
      font-size: 0.3rem;
    }
  }
}
/deep/ .van-tabs__wrap {
  position: fixed;
}
.line {
  width: 100%;
  height: 0.15rem;
  background: #f2f3f5;
}
.line2 {
  width: 100%;
  height: 0.04rem;
  background: #3354df;
}
.button {
  display: flex;
  justify-content: center;
  width: 5rem;
  height: 0.9rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 1rem auto;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  color: #fff;
}
.editPersonalInfoBox {
  margin-top: 0;
  width: 100%;
  height: auto;
  background: #f4f4f4;
  color: #000;
}

.editPersonalInfoBox {
  width: 100%;
  height: 100%;
}

.editPersonalInfoBox li {
  height: 0.8rem;
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
  padding: 0.1rem 0.48rem;
  padding-bottom: 0;
  padding-top: 0.3rem;
}

.editPersonalInfoBox .li2 {
  height: 1.3rem;
  background: #fff;
  border-bottom: 1px solid #f4f4f4;
  padding: 0.1rem 0.48rem;
  padding-bottom: 0;
}
.editPersonalInfoBox li p {
  float: left;
  font-family: "PingFangSC-Regular";
  font-size: 0.3rem;
  height: 1rem;
  line-height: 0.7rem;
}
.editPersonalInfoBox li p textarea {
  font-size: 0.3rem;
  width: 4.65rem;
  margin-left: 0.2rem;
  height: 1.1rem;
  border: 0.01rem solid rgba(221, 221, 221, 1);
  border-radius: 0.06rem;
  padding-left: 0.1rem;
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

.red {
  color: #f00;
}
.weui-select {
  margin-left: 0.3rem;
  padding-left: 0;
  font-size: 0.3rem;
  background: #fff;
  width: 3.8rem;
  height: 0.68rem;
  border: 0.01rem solid rgba(221, 221, 221, 1);
  border-radius: 0.06rem;
}
.contactRelation {
  direction: ltr;
}
//自定义勾选框
.van-checkbox {
  display: inline-flex;
}
</style>