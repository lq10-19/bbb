<template>
  <div class="bigBox">
    <van-tabs
      @change="onChange($event)"
      color="#3354df"
      title-active-color="#3354df"
      v-model="active"
    >
      <van-tab title="待提交">
        <ul v-if="unSubmitFlag">
          <li
            class="item"
            v-for="(item,i) in unSubmitList"
            :key="i"
            @click="goOrderDetails(item,0)"
          >
            <div class="msg">
              <p class="productName">{{item.productName}}</p>
              <span>{{item.orderPageState}}</span>
            </div>
            <div class="state">
              <p class="applyAmount">
                <span class="sp1">申请金额（元）</span>
                <span class="sp2">{{item.applyAmount}}</span>
              </p>
              <p class="serialNo">
                <span class="sp1">业务编号</span>
                <span class="sp2">{{item.serialNo}}</span>
              </p>
            </div>
            <div class="divbtn">
              <button
                v-if="item.orderPageState=='待提交申请'"
                class="continue"
                @click.stop="goAddBankCard(item,i)"
              >继续申请</button>
              <button
                v-if="item.orderPageState=='待提交申请'"
                class="cancel"
                @click.stop="cancel(item,i)"
              >取消订单</button>
            </div>
          </li>
        </ul>
        <div class="bigbox" v-if="!unSubmitFlag">
          <img class="nullImg" src="../../assets/img/wu@2x.png" />
          <p class="nullTxt">暂时没有订单~</p>
        </div>
      </van-tab>

      <van-tab title="已提交">
        <ul v-if="flag">
          <li class="item" v-for="(item,i) in orderList" :key="i" @click="goOrderDetails(item,1)">
            <div class="msg">
              <p class="productName">{{item.productName}}</p>
              <span>{{item.weChatShowStatus}}</span>
            </div>
            <div class="state">
              <p class="applyAmount">
                <span class="sp1">申请金额（元）</span>
                <span class="sp2">{{item.applyAmount}}</span>
              </p>
              <p class="serialNo">
                <span class="sp1">业务编号</span>
                <span class="sp2">{{item.serialNo}}</span>
              </p>
            </div>
            <div class="divbtn">
              <button
                class="withdraw"
                @click.stop="withdraw(item,i)"
                v-if="item.weChatShowStatus=='审核中'"
              >取消申请</button>
              <button
                class="bindBankCard"
                @click.stop="goChangeBankCard(item,i)"
                v-if="item.weChatShowButton==1"
              >更换银行卡</button>
              <span v-if="item.weChatShowButton==1">
                <img src="../../assets/img/cl/gth@2x.png" />
                {{item.bankCardChangeType}}
              </span>
            </div>
          </li>
        </ul>
        <div class="bigbox" v-if="!flag">
          <img class="nullImg" src="../../assets/img/wu@2x.png" />
          <p class="nullTxt">暂时没有订单~</p>
        </div>
      </van-tab>
    </van-tabs>
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
  formatMoney
} from "../../public/uilt.js";
import { Toast, Dialog } from "vant";
import store from "store";
export default {
  components: {},
  data() {
    return {
      active: 0,
      customerId: null,
      unSubmitList: [], //待提交合同列表
      unSubmitFlag: false, //默认没有待提交合同
      orderList: [
        // {
        //   serialNo: "1619000048",
        //   productName: "佰乐花",
        //   weChatShowStatus: "审批通过",
        //   applyAmount: "20000.00",
        //   weChatShowButton: "1",
        //   bankCardChangeType: "二类卡放款失败"
        // },
        // {
        //   serialNo: "987654321",
        //   productName: "佰乐花",
        //   weChatShowStatus: "审批中",
        //   applyAmount: "20000.00",
        //   weChatShowButton: "0",
        //   bankCardChangeType: "二类卡放款失败"
        // }
      ], //已提交合同列表
      flag: false //默认没有已提交合同
    };
  },
  created() {
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId;
    }
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
    }
    if (store.get("active")) {
      this.active = store.get("active");
    }
    //获取待提交订单列表
    this.queryUnSubmittOrder();
    //获取已提交订单列表
    this.querySubmittOrder();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "我的订单";
  },
  methods: {
    //切换标签
    onChange(event) {
      console.log(event);
      if (event == 0) {
        //获取待提交订单列表
        this.queryUnSubmittOrder();
        store.set("active", this.active);
      } else if (event == 1) {
        //获取已提交订单列表
        this.querySubmittOrder();
        store.set("active", this.active);
      }
    },
    //获取待提交订单列表
    queryUnSubmittOrder() {
      let url = "businessContractInfoCtr/queryUnSubmittOrder";
      let param = {
        customerId: this.customerId
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.unSubmitList = res.data;
            this.unSubmitList.forEach(element => {
              element.applyAmount = formatMoney(element.applyAmount);
            });
            this.unSubmitFlag = true;
          } else {
            this.unSubmitFlag = false;
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //获取已提交订单列表
    querySubmittOrder() {
      let url = "businessContractInfoCtr/querySubmittOrder";
      let param = {
        customerId: this.customerId
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.orderList = res.data;
            this.orderList.forEach(element => {
              element.applyAmount = formatMoney(element.applyAmount);
            });
            this.flag = true;
          } else {
            this.flag = false;
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //合同详情页
    goOrderDetails(item, from) {
      //from：pc进件待提交订单为0  所有已提交订单为1
      this.$router.push({
        path: "/orderDetails",
        query: {
          serialNo: item.serialNo,
          from
        }
      });
    },
    //取消订单
    cancel(item, i) {
      Dialog.confirm({
        title: "确定取消订单？",
        message: "",
        cancelButtonText: "返回修改"
      })
        .then(() => {
          //取消订单、申请接口
          this.cancelOrder(item, 0);
        })
        .catch(() => {
          // on cancel
        });
    },
    //继续申请
    goAddBankCard(item, i) {
      store.set("serialNo", item.serialNo);
      this.$router.push({
        path: "/addBankCard",
        query: {
          serialNo: item.serialNo,
          h5: 1 //PC端申请标识
        }
      });
    },
    //取消申请
    withdraw(item, i) {
      Dialog.confirm({
        title: "确定取消申请？",
        message: ""
      })
        .then(() => {
          //取消订单、申请接口
          this.cancelOrder(item, 1);
        })
        .catch(() => {
          // on cancel
        });
    },
    //取消订单、申请接口
    cancelOrder(item, i) {
      let url = "businessContractInfoCtr/cancelOrder";
      let param = {
        serialNo: item.serialNo
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            if (i == 0) {
              Toast("取消订单成功");
              //获取待提交订单列表
              this.queryUnSubmittOrder();
            } else if (i == 1) {
              Toast("取消申请成功");
              //获取已提交订单列表
              this.querySubmittOrder();
            }
          } else {
            if (i == 0) {
              Toast("取消订单失败，请联系客服人员");
            } else if (i == 1) {
              Toast("取消申请失败，请联系客服人员");
            }
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //重新绑卡
    goChangeBankCard(item, i) {
      this.$router.push({
        path: "/changeBankCard",
        query: { serialNo: item.serialNo }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  ul {
    width: 7.1rem;
    margin: 0.1rem auto;
    li {
      padding: 0.25rem;
      //height: 1.08rem;
      margin: 0.2rem auto;
      border-radius: 0.25rem;
      background: #fff;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.55rem;
      .msg {
        text-align: left;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        border-bottom: 0.01rem solid #b6b8c4;
        padding-bottom: 0.2rem;
        margin-bottom: 0.15rem;
        p {
          width: 2rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 0.48rem;
        }
        span {
          display: inline-block;
          width: 3rem;
          font-size: 0.28rem;
          height: 0.54rem;
          text-align: right;
          line-height: 0.48rem;
          color: #3354df;
        }
      }
      .state {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 0.2rem;
        p {
          font-size: 0.28rem;
          font-weight: 500;
          line-height: 0.56rem;
          span {
            display: block;
          }
          .sp1 {
            font-size: 0.26rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(182, 184, 196, 1);
            line-height: 0.48rem;
          }
          .sp2 {
            font-size: 0.3rem;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(50, 55, 84, 1);
            line-height: 0.48rem;
          }
        }
        .serialNo {
          margin-left: 1rem;
        }
      }
      .divbtn {
        button {
          margin-top: 0.1rem;
          border-radius: 0.1rem;
          margin-left: 0.1rem;
          width: 1.5rem;
          border: 0.01rem solid #000;
        }
        .continue {
          border-color: #3354df;
          background: #3354df;
          color: #fff;
        }
        .cancel {
          background: #fff;
          margin-left: 0.3rem;
          border-color: #3354df;
          color: #3354df;
        }
        .withdraw {
          width: 1.8rem;
          background: #fff;
          border-color: #3354df;
          color: #3354df;
        }
        .bindBankCard {
          width: 1.8rem;
          border-color: #3354df;
          background: #3354df;
          color: #fff;
        }
        span {
          width: 48%;
          display: inline-block;
          text-align: right;
          position: relative;
          left: 0.8rem;
          top: 0.1rem;
          font-size: 0.28rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(248, 101, 82, 1);
          line-height: 0.28rem;
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 2;
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: inline-block;
            position: relative;
            top: 0.03rem;
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
</style>