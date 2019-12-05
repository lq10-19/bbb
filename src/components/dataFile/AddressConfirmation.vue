<template>
  <div class="body_box">
    <div class="title">
      <p>送达地址确认书</p>
    </div>
    <div class="color_000 top_4 Signature weight_700">
      <p>
        确认人：
        <span class="name margin_2">{{userData.customerName}}</span>
      </p>
      <p>
        身份证号码：
        <span class="cardNumber">{{userData.customerCertId}}</span>
      </p>
    </div>
    <div class="title_1 indent">
      根据《中华人民共和国仲裁法》、《中华人民共和国民事诉讼法》、《中华人民共和国电子签名法》的规定，本人在履行《个人消费分期贷款协议》、《个人消费分期服务协议》（包括债权转让、置换、担保、追偿、保险代位求偿等关联纠纷）期间，对本人的各种通知、告知事项，资料、函件的送达，以及
      <span
        class="text_line weight_700"
      >仲裁机构、人民法院</span>
      或其他司法、行政机关在处理上述纠纷过程中，各种法律文书，通知、告知事项的送达，以下列任一方式作为本人的正式通知或送达方式，且适用于仲裁，一审、二审、执行以及审判监督程序。
    </div>

    <div class="indent top_1">
      <span class="color_333">（1）居住地：以本人签署之《个人消费分期服务申请表》所列居住地为准；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">（2）身份证所载地址：以本人签署之《个人消费分期服务申请表》所列户籍地为准；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">（3）电子邮件：以本人签署之《个人消费分期服务申请表》所列电子邮箱为准；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">（4）联系电话：以本人签署之《个人消费分期服务申请表》所列手机、住宅电话为准；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">（5）紧急联系人电话：以本人签署之《个人消费分期服务申请表》所列配偶、家庭成员电话为准；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">（6）QQ 号码：以本人签署之《个人消费分期服务申请表》所列QQ号码为准；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">（7）微信号：以本人签署之《个人消费分期服务申请表》所列微信号为准。</span>
    </div>
    <div class="indent top_1">
      <p class="color_333">
        根据意思自治原则以及《中华人民共和国仲裁法》、《最高人民法院关于适用&lt;中华人民共和国民事诉讼法&gt;的解释》第一百三十五条、第一百三十六条的规定，本人
        <span
          class="weight_700"
        >同意</span>
        优先接受以手机短信、电子邮件方式送达本人。
      </p>
    </div>
    <div class="title_1 top_4 weight_700 Signature">声明和承诺：</div>

    <div class="indent top_1">
      <span class="color_333">1. 以数据电文方式送达的，发件人系统成功发出即视为送达本人；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">2. 以邮寄方式送达并由他人代为签收的视为直接送达本人；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">3. 邮寄送达拒绝签收、无收件人、地址灭失而退回均视为已送达；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">4. 因时间推移，致使上述邮寄地址与本人实际居住地、户籍所在地、身份证所载地址不一致的，仍然可以上述地址作为送达地；</span>
    </div>
    <div class="indent top_1">
      <span class="color_333">5. 上述任一送达、联系方式变更的，须由本人书面确认，否则不发生变更效力。</span>
    </div>

    <div class="title_1 top_4 weight_700 Signature">特别说明：</div>

    <div
      class="title_1 top_4 indent"
    >本《送达地址确认书》由本人确认，并授权债权人（债权受让人）代本人向争议解决机关（机构）提交，以便及时处理相关纠纷。本确认书所载全部内容系本人真实意思表示，并由本人亲自签署（手签或电子签名、网签），合法、有效。</div>

    <div class="title_1 top_1 indent weight_700">如因仲裁条款无效、仲裁裁决被撤销、仲裁裁决被不予执行而形成诉讼的，本确认书适用于受案法院的司法送达。</div>

    <div class="color_000 top_6 Signature">
      <p>
        确认人：
        <span class="name"></span>
      </p>
      <p>
        签署日期：
        <span class="date">{{userData.applyDate}}</span>
      </p>
    </div>
    <fileButton path="/PersonalInfoWarrant" back="/confirmSubmit" index="4"></fileButton>
  </div>
</template>
<script>
import {
  randomWord,
  mobilePass,
  identifyingCodePass,
  namePass,
  cardIdPass,
  identifyingPass
} from "../../public/uilt.js";
import store from "store";
import { path } from "../../config.js";
import { getNowFormatDate } from "../../public/uilt.js";
import fileButton from "../assembly/fileButton";
export default {
  data() {
    return {
      userData: {},
      param: {
        serialNo: null,
        customerId: null,
        docType: null
      }
    };
  },
  created() {
    if (store.get("serialNo")) {
      this.param.serialNo = store.get("serialNo");
    }
    if (store.get("customerId")) {
      this.param.customerId = store.get("customerId");
    }
    if (this.$route.query.docType) {
      this.param.docType = this.$route.query.docType;
    }
    //获取表格数据
    this.getContractPara();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "送达地址确认书";
  },
  methods: {
    //获取表格数据
    getContractPara() {
      let url = `template/contractPrint/getContractPara?contractType=${this.param.docType}&serialNo=${this.param.serialNo}`;
      this.$requestCl2
        .get(url)
        .then(res => {
          if (res.data) {
            this.userData = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  beforeDestroy() {},
  components: {
    fileButton
  }
};
</script>
