<template>
  <div class="body_box">
    <p class="title">个人征信授权书</p>
    <div class="title_1 top_4 weight_600">重要提示：</div>
    <div
      class="title_1 indent weight_600 top_1"
    >为了保障您的合法权益，您应当阅读并遵守本授权书。请您务必审慎阅读、充分理解本授权书条款内容，特别是免除或者减轻被授权人责任，或限制您权利的条款，相关条款将以加粗形式提示您充分注意。</div>
    <div
      class="title_1 indent weight_600 top_4"
    >本授权书依据《征信业管理条例》等法律法规的相关规定拟定，百行征信有限公司是依据《征信业管理条例》成立和运营的持牌个人征信机构。除非您已阅读并接受本授权书所有条款，否则您无权使用被授权人服务平台借款服务。</div>
    <div class="title_2 indent color_666">本人向佰仟融资租赁有限公司、百行征信有限公司作以下不可撤销的授权：</div>
    <div
      class="title_2 color_666 strong"
    >一、本人同意佰仟融资租赁有限公司（本文简称“被授权人”）在办理以下涉及到本人或与本人有关的业务时，可按照法律法规的规定通过百行征信有限公司查询、使用本人信息：</div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 审核本人授信及贷款申请的；
    </div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 审核本人作为担保人或共同还款人的；
    </div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 受理法人、其他组织或自然人的授信、贷款申请及贷后风险管理时，需要查询本人作为法人、其他组织或自然人的法定代表人、出资人或关联方的信用状况的；
    </div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 受理本人担任法定代表人、负责人或出资人的法人、商户或其他组织的特约商户开户申请，需要查询本人信用状况的；
    </div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 处理贷后管理事务（包括贷款额度授予后对额度的管理），进行贷后风险管理；
    </div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 处理本人征信异议的。
    </div>
    <div class="color_666 top_4 strong">本授权书所指的本人信息包括本人基本信息、本人信贷信息以及与本人信用相关的其他信息</div>
    <div class="color_666 top_4">二、信息查询期限</div>
    <div
      class="color_666 indent top_1 strong"
    >本授权书下被授权人向百行征信有限公司查询本人信息的期限自本人确认本授权承诺之日起至本人在被授权人处所有相关业务终结之日止。</div>
    <div
      class="color_666 indent top_1 strong"
    >如下情形视为本人与被授权人的业务未终结：本人在被授权人处有信贷余额或有授信额度；本人提供担保的授信业务有信贷余额或有授信额度</div>
    <div class="color_666 top_4 strong">三、本人同意被授权人向百行征信有限公司报送本人信息（含历史信息、不良信息、负债信息及偿债履约能力判断信息等）。</div>
    <div
      class="color_666 top_4 strong"
    >四、本人同意百行征信有限公司可向被授权人和有关部门、单位（包括但不限于公安、司法、教育、全国公民身份证号码查询服务中心、通信运营商、社保、公积金、税务、民政、物流、电子商务平台、互联网平台、行业协会等合法留存本人信息的第三方机构等）采集、查询或验证本人信息，并可将采集或查询到的本人信息在本授权书第一条所列的情形下向被授权人提供。</div>
    <div class="color_666 top_4">五、授权人声明</div>
    <div class="color_666 indent top_1 strong">
      本人已知悉并理解本授权书所有内容
      <span class="color_333">（特别是加粗字体内容）</span>以及由此产生的法律效力，自愿作出上述授权。本授权书是本人真实的意思表示，本人同意承担由此带来的一切法律后果。
    </div>
    <div class="color_000 top_6 Signature">
      <p>
        本人姓名：
        <span class="name">{{name}}</span>
      </p>
      <p>
        身份证号码：
        <span class="cardNumber">{{idCard}}</span>
      </p>
      <p>
        签署日期：
        <span class="date">{{date}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import { getNowFormatDate } from "../../public/uilt.js";
import store from "store";
export default {
  data() {
    return {
      date: getNowFormatDate(" 年 ", " 月 ", " 日 ") || "查询中...",
      name: null,
      idCard: null,
      param: {}
    };
  },
  created() {
    this.name = store.get("userMessage").myName || "查询中...";
    this.idcard = store.get("userMessage").idCard || "查询中...";
    store.set("isPAT", true);
    this.param = this.$route.query;
    //获取合同信息
    this.getContractInfo();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "个人征信授权书";
  },
  methods: {
    //获取合同信息
    getContractInfo() {
      let url = "cashloan/getContractInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          this.name = res.data.customername;
          this.idCard = res.data.certid;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.body_box {
  background-color: #fff;
  padding: 0.5rem 0.3rem 1rem 0.3rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  line-height: 0.48rem;
  font-size: 0.28rem;

  .title {
    font-size: 0.34rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.34rem;
    text-align: center;
    font-weight: 500;
  }

  .title_1 {
    font-size: 0.28rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.48rem;
  }

  .title_2 {
    margin-top: 0.3rem;
  }

  .Signature {
    font-size: 0.3rem;
  }

  .indent {
    text-indent: 0.5rem;
  }

  .weight_600 {
    font-weight: 600;
  }

  .weight_700 {
    font-weight: 700;
  }

  .weight_800 {
    font-weight: 800;
  }

  .weight_900 {
    font-weight: 900;
  }

  .color_666 {
    color: #333333;
  }

  .color_333 {
    color: #333333;
  }

  .color_000 {
    color: #000000;
  }

  .color_FF3A31 {
    color: #333333;
  }

  .top_1 {
    margin-top: 0.1rem;
  }

  .top_2 {
    margin-top: 0.2rem;
  }

  .top_4 {
    margin-top: 0.4rem;
  }

  .top_6 {
    margin-top: 0.6rem;
  }

  .icon {
    display: inline-block;
    width: 0.25rem;
    height: 0.25rem;
    border: 0.01rem solid black;
    border-radius: 0.05rem;
    transform: translateY(0.02rem);
  }
  .strong {
    font-weight: 900;
  }
}
</style>