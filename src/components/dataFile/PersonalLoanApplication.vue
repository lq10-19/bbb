<template>
  <div class="bigbox">
    <div class="title">
      <p>个人消费分期贷款申请表</p>
    </div>
    <table
      border="1"
      cellspacing="1"
      class="bigTable"
      cellpadding="1"
      style="border-collapse:collapse"
    >
      <tr height="5%">
        <td class="tdTitle tdHead" colspan="6" rowspan="2" width="56%">个人消费分期贷款申请表</td>
        <td class="tdTitle tdMin" colspan="4" width="44%">
          条形码
          <img :src="userData.base64" class="img" />
        </td>
      </tr>
      <tr height="5%">
        <td class="tdTitle tdMin" colspan="4">
          协议编号：
          <span class="red">{{userData.serialNo}}</span>
          <br />申请日期：
          <span class="red">{{userData.applyDate}}</span>
        </td>
      </tr>
      <tr height="5%">
        <td colspan="10">
          贷款用途：
          <span class="underline">{{userData.loanUse}}</span>
        </td>
      </tr>
      <!-- <tr height="5%">
        <td colspan="10">
          产品代码：
          <span class="underline">{{userData.productId}}</span>&emsp;&emsp;&emsp;&emsp;
          过去在本公司有过几次分期申请：
          <span
            class="underline"
          >{{userData.applyCounts}}</span>
        </td>
      </tr> -->
      <tr height="10%">
        <td class="tdTitle" colspan="10">个人资料</td>
      </tr>
      <tr height="5%">
        <td colspan="2">
          1. 姓名：
          <span class="underline">{{userData.customerName}}</span>
        </td>
        <td colspan="2">
          2. 性别：
          <span class="underline">{{userData.sex}}</span>
        </td>
        <td colspan="3">
          3. 身份证号码：
          <br />
          <span class="underline">{{userData.customerCertId}}</span>
        </td>
        <td colspan="3">
          4. 身份证有效期至：
          <br />
          <span class="underline">{{userData.certEffectiveEndTime}}</span>
        </td>
      </tr>
      <tr height="5%">
        <td colspan="3">
          5. 电子邮箱：
          <span class="underline">{{userData.email}}</span>
        </td>
        <td colspan="2">
          6. 教育程度：
          <span class="underline">{{userData.eduExperience}}</span>
        </td>
        <td colspan="2">
          7. 婚姻状况：
          <span class="underline">{{userData.marriage}}</span>
        </td>
        <td colspan="3">
          8. 手机：
          <span class="underline">{{userData.mobileTelePhone}}</span>
        </td>
      </tr>
      <tr height="5%">
        <td colspan="10">
          9. 住宅地址：
          <span class="underline">{{userData.nativePlace}}</span>
        </td>
      </tr>
      <tr height="10%">
        <td class="tdTitle" colspan="10">个人消费分期服务内容</td>
      </tr>
      <tr height="5%">
        <td colspan="3">
          10. 贷款本金（元）：
          <span class="underline">{{userData.applyAmount}}</span>
        </td>
        <td colspan="2">
          11. 贷款分期期数：
          <span class="underline">{{userData.term}}</span>
        </td>
        <td colspan="2">
          12. 首次还款日：
          <br>
          <span class="underline">{{userData.payDate1}}</span>
        </td>
        <td colspan="3">
          13. 首次应还本息（元）：
          <span class="underline">{{userData.monthRepaymentPrincipal1}}</span>
        </td>
      </tr>
      <tr height="5%">
        <td colspan="3">
          14. 每月还款日：
          <span class="underline">{{userData.monthPayDay1}}</span>
        </td>
        <td colspan="4">
          15. 每月应还本息（元）：
          <span class="underline">{{userData.monthRepaymentPrincipal}}</span>
        </td>
        <td colspan="3">
          16. 月贷款利率（%）：
          <span class="underline">{{userData.monthCreditRate}}</span>
        </td>
      </tr>
      <tr height="10%">
        <td class="tdTitle" colspan="10">账户信息</td>
      </tr>
      <tr height="5%">
        <td colspan="7">
          17. 借款人银行账户信息（用于收款、扣款）：户名：
          <span class="underline">{{userData.customerName}}</span>&emsp;&emsp;开户行：
          <span class="underline">{{userData.customerBranch}}</span>&emsp;&emsp;账号：
          <span class="underline">{{userData.customerBankNo}}</span>
        </td>
        <td colspan="3">
          18. 是否银行代扣还款：
          <span class="underline">是</span>
        </td>
      </tr>
      <tr height="5%">
        <td
          colspan="10"
        >本人选择银行代扣还款，表明本人同意并授权佰仟融资租赁有限公司有权委托第三方支付机构从本人指定的银行账户（如第17项所示）划扣首次应还本息（如第13项所示）、每月应还本息（如第15项所示）及《个人消费分期贷款协议》项下其他应由本人偿还的款项。本人同意该账户同时可用于因提前还款等引起的资金往来。</td>
      </tr>
      <tr height="10%">
        <td class="tdTitle" colspan="10">配偶信息</td>
      </tr>
      <tr height="5%">
        <td colspan="3">
          19. 配偶姓名：
          <span class="underline">{{userData.spouseName}}</span>
        </td>
        <td colspan="3">
          20. 配偶移动电话：
          <span class="underline">{{userData.spouseTel}}</span>
        </td>
        <td colspan="4">
          21. 配偶身份证号码：
          <span class="underline">{{userData.spouseCertId}}</span>
        </td>
      </tr>
      <tr height="10%">
        <td class="tdTitle" colspan="10">其他联系人信息</td>
      </tr>
      <tr height="5%">
        <td colspan="3">
          22. 联系人姓名：
          <span class="underline">{{userData.contactName1}}</span>
        </td>
        <td colspan="3">
          23. 与申请人关系：
          <span class="underline">{{userData.contactRelationship1}}</span>
        </td>
        <td colspan="4">
          24. 联系电话：
          <span class="underline">{{userData.contactPhone1}}</span>
        </td>
      </tr>
      <tr height="5%">
        <td colspan="10">
          本人具有完全民事行为能力签署本申请表并承担相应责任。本人已仔细阅读并完全了解《个人消费分期贷款协议》，并且自愿遵守相关的协议规定。
          <br />本人保证在此表上填写、确认的内容及向贷款人提供的所有相关资料全部真实、有效，如本人提供虚假资料，将承担由此引起的一切责任及损失。本人在此同意贷款人按照相关法律法规的规定，向有权机构报送本人的个人信用信息，包括但不限于本申请表项下的信息，同时，授权贷款人和佰仟租赁向任何可能的来源查询本人及配偶的与贷款申请有关的个人信息和个人信用信息，相关查询结果的用途将用于贷款审查和贷款管理。假如本人违反《个人消费分期贷款协议》的任何约定（包括但不限于逾期偿还任何款项），本人同意贷款人、佰仟租赁直接或者经由第三方，通过当面拜访、电话、邮寄、网络等合法形式联系本申请表载明的本人配偶、家庭成员及其他联系人，因此产生的一切责任及后果均由本人自行承担。
          <br />本人同意如因单方面取消申请或不具备借款条件，申请不获批准，本表格及所有已提交的资料无须退还本人，由贷款人、佰仟租赁处理。贷款人有权拒绝本贷款申请而无须给予任何原因解释。
        </td>
      </tr>
      <tr height="5%">
        <td
          colspan="10"
          class="tdFoot"
        >申请人签名：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{userData.applyDate}}</td>
      </tr>
    </table>
    <fileButton path="/PersonalConsumptionApplication" back="/confirmSubmit" index="2"></fileButton>
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
      userData: {
        base64: ""
      },
      param: {
        serialNo: null,
        customerId: null,
        docType: null
      }
    };
  },
  components: {
    fileButton
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
    document.getElementsByTagName("title")[0].textContent =
      "个人消费分期贷款申请表";
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
            this.userData.base64 = "data:image/png;base64," + res.data.Barcode;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  beforeDestroy() {}
};
</script>
<style lang='scss' scoped>
.bigbox {
  background-color: #fff;
  font-family: "PingFangSC-Medium", "PingFang SC";
  line-height: 0.28rem;
  font-size: 0.13rem;
  padding-bottom: 0.2rem;

  .title {
    padding: 0.5rem 0.3rem;
    font-size: 0.36rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.36rem;
    text-align: center;
    font-weight: 800;
  }

  table,
  table tr th,
  table tr td {
    border: 1px solid #000;
  }

  .bigTable {
    /* border: 0.01rem solid #000; */
    margin: 0rem auto;
    margin-bottom: 2rem;
    width: 6.83rem;
    height: 8.91rem;
    table-layout: fixed;
    word-wrap: break-word;

    tr {
      td {
        padding: 0.06rem;
        color: #000;

        .underline {
          text-decoration: underline;
        }
      }

      .tdTitle {
        line-height: 0.56rem;
        font-size: 0.28rem;
        font-weight: 800;

        // .red {
        //   color: red;
        // }
      }

      .tdMin {
        line-height: 0.26rem;
        font-size: 0.13rem;
        .img {
          width: 2.6rem;
          height: 1rem;
        }
      }

      .tdHead {
        padding-left: 0;
        text-align: center;
      }

      .tdFoot {
        text-align: right;
        padding-right: 0.5rem;
      }
    }
  }
}
</style>