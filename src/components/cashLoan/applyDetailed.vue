<template>
  <div class="page">
    <div class="section">
      <p>申请金额</p>
      <h1>￥{{pageData.applyMoneyShow}}</h1>
    </div>
    <div class="line"></div>
    <div class="section2">
      <p>借款期数</p>
      <van-tabs
        type="card"
        class="van-tabs"
        :swipe-threshold="5"
        @click="chooseStage"
        title-inactive-color="#000"
        :active="stageIndex"
        :style="{ width: pageData.percentage }"
      >
        <van-tab
          v-for="(item,i) in pageData.periodsList"
          :key="i"
          :title="item.term + '期'"
          class="van-tab"
          :name="i"
        ></van-tab>
      </van-tabs>
      <!-- <span>*日利率{{pageData.dailyRate}}%</span> -->
    </div>

    <div class="additionalBusiness">
      <van-checkbox-group v-model="result" class="van-checkbox-group" @change="onChange">
        <van-cell-group class="van-cell-group">
          <van-cell
            class="van-cell"
            v-for="(item, index) in pageData.costList"
            clickable
            :key="index"
            :value="item.collectway=='01'?`${item.money}/月`:`${item.money}元`"
            @click="toggle(item, index)"
            :required="item.isDisplay=='01'"
            v-show="item.isDisplay!='03'"
          >
            <!-- v-show="item.isDisplay" -->
            <template slot="title" class="slot">
              <span>
                <van-checkbox
                  :name="item.termname"
                  ref="checkboxes"
                  slot="right-icon"
                  class="van-checkbox"
                  :disabled="item.isDisplay=='01'"
                />
              </span>
              <span class="custom-title">{{item.termname}}</span>
            </template>
            <van-icon
              v-if="item.termCode=='C01'"
              slot="right-icon"
              name="info-o"
              style="line-height: inherit;"
              color="#3354DF"
              @touchstart.stop="showTips()"
              @touchend="hideTips"
              @click.stop="showTips('click')"
            />
          </van-cell>

          <div class="tips" v-if="haveTips">
            <p>选择VIP包能为您提供优惠等尊享VIP服务，提前还款还可减免相应的手续费。</p>
            <!-- <p>提前还款还可减免相应的手续费。</p> -->
          </div>
        </van-cell-group>
      </van-checkbox-group>
    </div>

    <div class="monthRepayment">
      <P>
        <span class="sp1">每月还款额</span>
        <span class="sp2">（具体请以合同为准）</span>
        <span class="sp3">￥{{pageData.monthRepayment}}</span>
      </P>
    </div>
    <div class="line"></div>
    <div class="bankCard" @click="addBankCard">
      <van-cell title="银行卡" is-link :value="pageData.bankCardValue" class="bank" size="large" />
    </div>
    <div class="line"></div>
    <div class="btn">
      <button @click="next" class="button">下一步</button>
    </div>
  </div>
</template>

<script>
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet,
  formatMoney
} from "../../public/uilt.js";
import store from "store";
import { Toast } from "vant";
export default {
  data() {
    return {
      stageIndex: "0", //期数索引
      result: [], //放打勾的费用项名称
      pageData: {
        percentage: "100%",
        //非显示数据
        productId: null, //产品id
        serialNo: null, //合同号
        stage: null, //选择的期数
        stageid: null, //选择的期数id
        gradeId: null, //档位id
        customerId: null, //客户id
        customerCertId: null, //客户身份证
        customerName: null, //客户姓名
        lasserialno: null, //流水号
        moyMent: null, //月基本还款额
        loanAmount: null, //放款金额
        //显示数据
        applyMoney: null, //申请金额
        applyMoneyShow: null, //展示申请金额
        periodsList: [], //期数列表
        costList: [], //费用项列表
        monthRepayment: null, //月还款
        bankCardValue: "请绑定银行卡"
      },
      product: {}, //产品详细
      age: null, //年龄
      ageFlag: true,
      verifycode: null, //返回的验证码
      haveTips: false
    };
  },
  created() {
    //传参验证码
    if (this.$route.query.verifycode) {
      this.verifycode = this.$route.query.verifycode;
    }
    //合同号缓存
    if (store.get("serialNo")) {
      this.pageData.serialNo = store.get("serialNo");
    }
    //通过合同号查询客户id
    this.queryBySerialNo();
    //获取缓存产品信息
    if (store.get("productItem")) {
      this.product = store.get("productItem");
    }
    if (store.get("applyDetailed")) {
      console.log("页面缓存");
      this.pageData = store.get("applyDetailed");
      this.pageData.applyMoneyShow = formatMoney(this.pageData.applyMoney);
      if (store.get("stageIndex")) {
        console.log("期数缓存");
        this.stageIndex = store.get("stageIndex") * 1 - 1;
        if (store.get("costList")) {
          console.log("勾选缓存");
          this.result = store.get("costList");
        } else {
          //获取期数列表
          this.queryProductTerm(this.stageIndex * 1);
        }
      } else {
        //获取期数列表
        this.queryProductTerm(this.stageIndex * 1);
      }
    } else {
      //获取期数列表
      this.queryProductTerm(this.stageIndex * 1);
    }
    //传参银行名称（银行名+卡号后4位）
    if (this.$route.query.bankCardValue) {
      this.pageData.bankCardValue = this.$route.query.bankCardValue;
    }
    //传参流水号
    if (this.$route.query.lasserialno) {
      this.pageData.lasserialno = this.$route.query.lasserialno;
    }
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
    document.getElementsByTagName("title")[0].textContent = "借钱";
  },
  methods: {
    //通过合同号查询客户id
    queryBySerialNo() {
      let url = "businessContractInfoCtr/queryBySerialNo";
      let param = {
        serialNo: this.pageData.serialNo
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            this.pageData.customerName = res.data.customerName;
            this.pageData.customerCertId = res.data.customerCertId;
            this.pageData.customerId = res.data.customerId;
            //根据姓名身份证查询客户信息
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
        certid: this.pageData.customerCertId,
        customername: this.pageData.customerName
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data.age) {
            this.age = res.data.age;
            //判断年龄
            this.ageAndStage();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //判断年领与期数关系
    ageAndStage() {
      console.log(this.age, this.pageData.stage);
      let add = this.age * 1 + this.pageData.stage * 1;
      if (add > 60) {
        //Toast("您的年龄不符合当前分期，请选择更短分期");
        let minStage = this.pageData.periodsList[
          this.pageData.periodsList.length - 1
        ].term;
        console.log(this.pageData.stage, minStage, 123456);
        if (this.pageData.stage > minStage) {
          Toast(`您的借款期数不得高于${this.pageData.stage}期，请更换期数`);
        } else {
          Toast(
            `抱歉！您的借款期数不得高于${this.pageData.stage}期，目前无法申请借款`
          );
        }
        this.ageFlag = false;
      } else {
        this.ageFlag = true;
      }
    },
    //选择期数
    chooseStage(title, name) {
      //console.log("选择期数", title, name);
      //清空增值服务
      this.result = [];
      this.stageIndex = title;
      this.pageData.stage = this.pageData.periodsList[title].term;
      this.pageData.stageid = this.pageData.periodsList[title].termId;
      this.pageData.gradeId = this.pageData.periodsList[title].gradeId;
      //console.log(this.pageData.stage);
      //获取月还款额
      this.queryCostInfo();
      //判断年龄
      this.ageAndStage();
    },
    onChange(event) {
      //console.log(event,101);
    },
    //选择增值服务
    toggle(item, index) {
      //console.log(item, index, 999);
      if (item.isDisplay == "02") {
        item.selection = !item.selection;
        this.$refs.checkboxes[index].checked = !this.$refs.checkboxes[index]
          .checked;
        //console.log(item.termname,item.selection,this.$refs.checkboxes[index].checked);
      }
      //获取月还款额
      this.queryCostInfo();
    },
    //获取期数列表和费用项列表
    queryProductTerm(index) {
      let url = "productTermController/queryProductTerm";
      //let { product } = JSON.parse(this.$route.query.product);
      let param = {
        serialNo: this.pageData.serialNo,
        productId: this.product.productId,
        versionId: this.product.versionId, //版本
        grade: this.product.productgrade //档位
      };

      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //申请金额
            this.pageData.applyMoney = res.data.applyAmount;
            this.pageData.applyMoneyShow = formatMoney(
              this.pageData.applyMoney
            );
            //每月应还款金额
            this.pageData.monthRepayment = res.data.monthRepaymentAmount;
            //原封不动给保存接口
            this.pageData.moyMent = res.data.monthRepaymentAmountBasic;
            this.pageData.loanAmount = res.data.loanAmount;
            //期数列表
            this.pageData.periodsList = res.data.termList;
            //费用项列表
            this.pageData.costList = res.data.costInfo;
            this.pageData.costList.forEach((element, i) => {
              if (element.isDisplay == "01") {
                this.result.push(element.termname);
              }
            });
            if (this.pageData.periodsList.length == 1) {
              this.pageData.percentage = "25%";
            } else if (this.pageData.periodsList.length == 2) {
              this.pageData.percentage = "50%";
            } else if (this.pageData.periodsList.length == 3) {
              this.pageData.percentage = "75%";
            } else {
              this.pageData.percentage = "100%";
            }
            this.pageData.stage = this.pageData.periodsList[index].term;
            this.pageData.stageid = this.pageData.periodsList[index].termId;
            this.pageData.gradeId = this.pageData.periodsList[index].gradeId;
            console.log("期数", this.pageData.stage);
            //判断年龄
            this.ageAndStage();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取月还款额
    queryCostInfo() {
      let url = "queryInfo/queryCostInfo";
      let param = {
        serialNo: this.pageData.serialNo,
        amount: this.pageData.applyMoney,
        product: this.product.productId,
        version: this.product.versionId, //版本
        grade: this.product.productgrade, //档位
        termid: this.pageData.stageid, //期数id
        term: this.pageData.stage, //期数
        gradeId: this.pageData.gradeId, //档位id
        costInfo: this.pageData.costList //费用项详细
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //月还款总额（未显示费用项已算好）
            this.pageData.monthRepayment = res.data.moyMentCont;
            //原封不动给保存接口
            this.pageData.moyMent = res.data.moyMent;
            this.pageData.loanAmount = res.data.loanAmount;
            this.pageData.costList = res.data.costList;
            //费用项列表
            this.result = [];
            //console.log("勾选项清空", this.result);
            this.pageData.costList.forEach((element, i) => {
              if (element.selection) {
                this.result.push(element.termname);
              }
            });
            //console.log("勾选项", this.result);
            this.queryCostInfo2();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    queryCostInfo2() {
      let url = "queryInfo/queryCostInfo";
      let param = {
        serialNo: this.pageData.serialNo,
        amount: this.pageData.applyMoney,
        product: this.product.productId,
        version: this.product.versionId, //版本
        grade: this.product.productgrade, //档位
        termid: this.pageData.stageid, //期数id
        term: this.pageData.stage, //期数
        gradeId: this.pageData.gradeId, //档位id
        costInfo: this.pageData.costList //费用项详细
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //月还款总额（未显示费用项已算好）
            this.pageData.monthRepayment = res.data.moyMentCont;
            //原封不动给保存接口
            this.pageData.moyMent = res.data.moyMent;
            this.pageData.loanAmount = res.data.loanAmount;
            this.pageData.costList = res.data.costList;
            //费用项列表
            this.result = [];
            //console.log("勾选项清空", this.result);
            this.pageData.costList.forEach((element, i) => {
              if (element.selection) {
                this.result.push(element.termname);
              }
            });
            //console.log("勾选项", this.result);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //下一步
    next() {
      if (this.pageData.bankCardValue == "请绑定银行卡") {
        Toast("您还没有绑定银行卡");
      } else {
        //保存页面信息（传流水号）
        this.updateBankInfo();
      }
    },
    //保存页面信息（传流水号）
    updateBankInfo() {
      //判断年龄
      this.ageAndStage();
      if (!this.ageFlag) {
        //Toast("您的年龄不符合当前分期，请选择更短分期");
        let minStage = this.pageData.periodsList[
          this.pageData.periodsList.length - 1
        ].term;
        if (this.pageData.stage > minStage) {
          Toast(`您的借款期数不得高于${this.pageData.stage}期，请更换期数`);
        } else {
          Toast(
            `抱歉！您的借款期数不得高于${this.pageData.stage}期，目前无法申请借款`
          );
        }
        return;
      }
      //http://10.81.2.145:8008/
      let url = "businessContractInfoCtr/updateBankInfo";
      let param = {
        customerId: this.pageData.customerId,
        verifycode: this.verifycode, //验证码
        serialNoList: [this.pageData.serialNo], //合同号列表
        serialNo: this.pageData.serialNo, //合同号
        period: this.pageData.stage, //期数
        periodId: this.pageData.stageid, //期数id
        monthRepaymentAmount: this.pageData.monthRepayment, //月还款
        lasserialno: this.pageData.lasserialno, //外部流水号
        applyAmount: this.pageData.applyMoney, //申请金额
        monthRepaymentAmountBasic: this.pageData.moyMent, //月基本额
        loanAmount: this.pageData.loanAmount, //放款金额
        costInfo: this.pageData.costList //费用项对象
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            //跳转添加联系人
            this.goAddContacts();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转添加联系人
    goAddContacts() {
      store.set("stageIndex", this.stageIndex * 1 + 1); //选择期数的缓存
      store.set("applyDetailed", this.pageData); //页面数据缓存
      store.set("costList", this.result); //选择费用项的缓存
      this.$router.push({
        path: "/addContacts",
        query: {}
      });
    },
    //跳转添加银行卡
    addBankCard() {
      store.set("stageIndex", this.stageIndex * 1 + 1);
      store.set("applyDetailed", this.pageData);
      store.set("costList", this.result);
      this.$router.push({
        path: "/addBankCard",
        query: {}
      });
    },
    //触摸显示tips
    showTips(type) {
      if (type == "click") {
        this.haveTips = true;
        setTimeout(() => {
          this.haveTips = false;
        }, 2500);
      } else {
        this.haveTips = true;
      }
    },
    //离开隐藏tips
    hideTips() {
      this.haveTips = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .section {
    height: 2.9rem;
    background: linear-gradient(
      90deg,
      rgba(95, 127, 228, 1),
      rgba(58, 95, 238, 1)
    );
    p {
      padding-top: 0.6rem;
      margin-left: 0.6rem;
      color: #fff;
      font-size: 0.28rem;
    }
    h1 {
      padding-top: 0.3rem;
      margin-left: 0.4rem;
      color: #fff;
      font-size: 0.6rem;
    }
  }
  .section2 {
    margin: 0rem auto;
    padding: 0.3rem 0;
    width: 100%;
    background: #fff;
    p {
      margin-left: 0.3rem;
      margin-bottom: 0.5rem;
      font-size: 0.4rem;
      color: #000;
      font-weight: 500;
    }
    span {
      display: inline-block;
      margin-top: 0.2rem;
      margin-left: 0.3rem;
    }
  }
  .additionalBusiness {
    width: 90%;
    margin: 0.2rem auto;
    box-shadow: 0 0.01rem 0.18rem 0 rgba(23, 23, 23, 0.17);
    border-radius: 0.1rem;
    span {
      float: left;
    }
    .custom-title {
      margin-left: 0.3rem;
    }
    .tips {
      position: absolute;
      top: -1rem;
      left: 5.35rem;
      width: 1.6rem;
      border: 0.01rem solid #3354df;
      border-radius: 0.2rem;
      background-color: #eee;
      padding: 0.03rem;
      z-index: 999;
      p {
        //margin: 0.01rem 0;
        margin-left: 0.08rem;
        font-size: 0.2rem;
        line-height: 0.25rem;
        letter-spacing: 0.01rem;
        color: #f0f;
      }
    }
  }
  .monthRepayment {
    padding: 0.3rem;
    background-color: #fff;
    p {
      position: relative;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      .sp1 {
        font-size: 0.32rem;
        //font-weight: 500;
        color: #323233;
      }
      .sp2 {
        margin-left: 0.05rem;
        font-size: 0.26rem;
        color: #aaa;
      }
      .sp3 {
        position: absolute;
        right: 0;
        font-size: 0.32rem;
        font-weight: 500;
        color: #3354df;
      }
    }
  }
  .bankCard {
    .bank {
      height: 1rem;
    }
  }
}
.van-tabs__nav--card {
  margin: 0 !important;
}
.line {
  width: 100%;
  height: 0.02rem;
  background: #f2f3f5;
}
.button {
  display: flex;
  justify-content: center;
  width: 6.2rem;
  height: 0.9rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 0rem auto;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  color: #fff;
}
.btn {
  background: #fff;
  padding-top: 1rem;
}
.page[data-v-21dc55fc] {
  font-weight: 500;
}
/deep/ .van-tabs__nav--card {
  border: none;
  border-radius: 0.1rem;
}
/deep/ .van-tab:last-child {
  border: none;
  border-radius: 0.1rem;
}
/deep/ .van-tab {
  border: none;
  border-radius: 0.1rem;
}
/deep/ .van-ellipsis {
  border: 0.02rem solid #999;
  color: #999;
  border-radius: 0.1rem;
}
/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
  background: #fff;
  .van-ellipsis {
    border: 0.02rem solid rgb(51,84,223);
    border-color:  rgb(51,84,223);
    color: rgb(51,84,223);
  }
}
</style>