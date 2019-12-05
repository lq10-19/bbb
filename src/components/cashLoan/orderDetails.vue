<template>
  <div class="bigBox">
    <div class="msg">
      <div class="title">
        <div class="title_text">订单状态</div>
        <div class="title_state">{{bankMsg.weChatShowStatus}}</div>
      </div>
      <div>
        <van-cell title="业务编号：" :value="bankMsg.serialNo" size="large" :border="false" />
        <van-cell title="产品名称：" :value="bankMsg.productName" size="large" :border="false" />
        <!-- 已提交订单显示申请时间 -->
        <van-cell
          title="申请时间："
          v-if="flag==1"
          :value="bankMsg.applyDate"
          size="large"
          :border="false"
        />
        <van-cell title="申请金额：" :value="'￥' + bankMsg.applyAmount" size="large" :border="false" />
        <van-cell title="期数：" :value="bankMsg.period + '期'" size="large" :border="false">
          <label slot="title">期&emsp;&emsp;数：</label>
        </van-cell>
        <!-- 待提交订单显示每月还款额 -->
        <van-cell
          title="每月还款额"
          v-if="flag==0"
          :value="'￥'+bankMsg.monthRepaymentAmount"
          size="large"
          :border="false"
        />
      </div>
    </div>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="银行卡信息" name="1" size="large" :border="false" class="bank">
        <van-cell title="所属银行：" :value="bankMsg.customerBank" :border="false" />
        <van-cell title="开户支行：" :value="bankMsg.customerBranch" :border="false" />
        <van-cell title="银行卡号：" :value="bankMsg.customerBankNo" :border="false" />
        <van-cell title="预留手机号：" :value="bankMsg.bankPhone" :border="false" />
      </van-collapse-item>
      <van-collapse-item title="联系人信息" name="2" size="large" :border="false">
        <div v-for="(item,i) in contactsList" :key="i">
          <div class="title_contacts">联系人信息{{i+1}}</div>
          <van-cell title="关系：" :value="item.contactRelationship" :border="false" />
          <van-cell title="姓名：" :value="item.contactName" :border="false" />
          <van-cell title="手机号：" :value="item.contactPhone" :border="false" />
          <van-cell title="地址：" :value="item.contactAdd" :border="false" />
        </div>
      </van-collapse-item>
      <!-- 已提交订单显示合同文件 -->
      <van-collapse-item
        v-if="flag==1"
        title="合同文件"
        name="3"
        size="large"
        :border="false"
        class="text"
      >
        <van-cell
          v-for="(item,i) in serialList"
          :key="i"
          :title="'《'+item.docName+'》'"
          value
          :border="false"
          @click="goClPdfFlie(item)"
        />
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      serialNo: "", //合同号
      activeNames: [], //默认打开的折叠面板
      bankMsg: {
        // contractStatusName: "审批通过", //订单状态
        // contractNo: "123456789", //业务编号
        // productName: "佰乐花", //产品名称
        // applyDate: "2019/08/08 10:2:3", //申请时间
        // money: "20000.00", //融资金额
        // stages: "12", //期数
        // bankName: "中国银行",
        // bankCard: "6213246879685",
        // bankPhoto: "1333333333"
      }, //客户信息对象
      contactsList: [], //联系人列表
      serialList: [], //合同附件列表
      flag: 0 //pc进件待提交订单为0  所有已提交订单为1
    };
  },
  created() {
    if (this.$route.query.serialNo) {
      this.serialNo = this.$route.query.serialNo;
    }
    if (this.$route.query.from) {
      if (this.$route.query.from == 0) {
        this.flag = 0;
      } else if (this.$route.query.from == 1) {
        this.flag = 1;
      }
    }
    //查询合同详情
    this.queryOrderInfo();
    //查询附件详情
    this.queryBySerialNo();
  },
  mounted() {},
  methods: {
    //查询合同详情
    queryOrderInfo() {
      let url = "businessContractInfoCtr/queryOrderInfo";
      let param = {
        serialNo: this.serialNo
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            this.bankMsg = res.data.businessContractInfo;
            if (
              res.data.contactInfoList &&
              res.data.contactInfoList.length > 0
            ) {
              this.contactsList = res.data.contactInfoList;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取所有已签合同文件
    queryBySerialNo() {
      let url = `docAttachmentCtr/queryBySerialNo`;
      let param = {
        serialNo: this.serialNo
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.serialList = res.data;
            //console.log(this.serialList);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //跳转查看合同文件
    goClPdfFlie(item) {
      this.$router.push({
        path: "/clPdfFlie",
        query: {
          filePDF: encodeURIComponent(item.docPath)
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  .msg {
    width: 6.9rem;
    margin: 0.2rem auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.2rem;
    .title {
      padding: 0.3rem;
      // margin: 0 0.3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.34rem;
      font-weight: 500;
      color: #000;
      border-bottom: 0.01rem solid rgba(182, 184, 196, 1);
      .title_state {
        color: #3354df;
      }
    }
    .van-cell {
      background: none;
    }
    .van-cell__title {
      font-size: 0.3rem;
      font-weight: 400;
      color: rgba(182, 184, 196, 1);
    }
    .van-cell__value {
      font-size: 0.3rem;
      text-align: left;
      flex: 2;
      font-weight: 400;
      color: rgba(50, 55, 84, 1);
    }
  }
}
/deep/ .van-collapse-item {
  width: 6.9rem;
  margin: 0.2rem auto;
  .van-collapse-item__content {
    padding: 0;
  }
  .van-cell {
    font-size: 0.3rem;
    .van-cell__title {
      font-weight: 400;
      color: rgba(182, 184, 196, 1);
    }
    .van-cell__value {
      text-align: left;
      flex: 2;
      font-weight: 400;
      color: rgba(50, 55, 84, 1);
    }
  }
  .van-collapse-item__title {
    font-size: 0.32rem;
    font-family: PingFang SC;
    font-weight: 500;
    .van-cell__title {
      color: #000 !important;
    }
  }
  .van-cell--borderless {
    border-radius: 0.2rem 0.2rem 0 0;
  }
  .van-collapse-item__wrapper {
    border-radius: 0 0 0.2rem 0.2rem;
    .van-collapse-item__content {
      font-size: 0.3rem !important;
    }
  }
}
/deep/ .text {
  .van-cell {
    font-size: 0.3rem;
    .van-cell__title {
      flex: 10;
      font-weight: 400;
      color: rgba(182, 184, 196, 1);
    }
    .van-cell__value {
      flex: 0;
      text-align: left;
      font-weight: 400;
      color: rgba(50, 55, 84, 1);
    }
  }
}
.title_contacts {
  width: 6.3rem;
  height: 0.6rem;
  line-height: 0.6rem;
  margin: 0 0.3rem;
  padding-left: 0.1rem;
  background: #f6f8ff;
  color: #323754;
  font-size: 0.3rem;
  border-radius: 0.1rem;
}
.line {
  width: 100%;
  height: 0.12rem;
  background: #f2f3f5;
}
</style>