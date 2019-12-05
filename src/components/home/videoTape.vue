<template>
    <div class="bigbox">
        <h4>上传视频demo</h4>
        <span>code码:0表示人活体检测成功; {{code}}</span>
        <span>orderNo: 订单号; {{orderNo}}</span>
        <span>newSignature 对 URL 参数 AppID、code、orderNo 和 SIGN ticket 的签名; {{newSignature}}</span>
        <span>liveRate 人活体检测结果分数; {{liveRate}}</span>
    </div>
</template>

<script>
    // import {
    //     getQueryString
    // } from '../../public/uilt.js'

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    export default {
        data() {
            return {
                nonceSign: null,
                info: null,
                code: null,
                orderNo: null,
                newSignature: null,
                liveRate: null,
            }
        },
        created() {
            this.info = this.$route.query;
            console.log(this.$route.query, 1123)
            this.code = getQueryString('code')
            this.orderNo = getQueryString('orderNo')
            this.newSignature = getQueryString('newSignature')
            this.liveRate = getQueryString('liveRate')
            //这样调用：alert(getQueryString("参数名1"))
        },
        mounted() {
        },
        methods: {},
        components: {},
    }
</script>
<!-- @ApiModelProperty(value = "预审单号")
  private String auditno;

  @ApiModelProperty(value = "申请用户ID")
  private String applyUserId;

  @ApiModelProperty(value = "申请单id")
  private String contractno;

  @ApiModelProperty(value = "客户名称")
  private String customername;

  @ApiModelProperty(value = "身份证号")
  private String certid;

  @ApiModelProperty(value = "手机号")
  private String mobileno;

  @ApiModelProperty(value = "信息录入人员账号")
  private String inputuser;

  @ApiModelProperty(value = "录入时间")
  private String inputtime;

  @ApiModelProperty(value = "返回码")
  private String returncode;

  @ApiModelProperty(value = "返回信息")
  private String returnmsg;

  @ApiModelProperty(value = "更新时间")
  private String updatetime;

  @ApiModelProperty(value = "调用第三方征信后的状态")
  private String calltdstatus;

  @ApiModelProperty(value = "调用第三方征信后的状态")
  private String callbrstatus;

  @ApiModelProperty(value = "调用第三方征信后的状态")
  private String calltxskstatus;

  @ApiModelProperty(value = "调用第三方征信的时间")
  private String calltdtime;

  @ApiModelProperty(value = "调用第三方征信的时间")
  private String callbrtime;

  @ApiModelProperty(value = "调用第三方征信的时间")
  private String calltxsktime;

  @ApiModelProperty(value = "预审状态")
  private String auditstatus;

  @ApiModelProperty(value = "产品类型")
  private String producttype;

  @ApiModelProperty(value = "经销商编码,名称")
  private String providersname;

  @ApiModelProperty(value = "授权pdf附件路径")
  private String imgUrl;

  @ApiModelProperty(value = "身份证正面路径")
  private String idCardFrontImageUrl;

  @ApiModelProperty(value = "身份证反面路径")
  private String idCardBehindImageUrl;

  @ApiModelProperty(value = "主申请人征信授权书")
  private String principalApplicantImageUrl;

  @ApiModelProperty(value = "身份证有效日期")
  private String certDateStart;

  @ApiModelProperty(value = "身份证有效日期")
  private String certDateSnd;

  @ApiModelProperty(value = "与申请人关系")
  private String applicantRelationCode;

  @ApiModelProperty(value = "客户类型")
  private String customerType;

  @ApiModelProperty(value = "业务类型")
  private String businessType;

  @ApiModelProperty(value = "是否实际用车人  默认: 1:是,2:否;")
  private String isUseCar;

  @ApiModelProperty(value = "数据来源系统(安卓/ios)")
  private String dataSourceSystem;


  @ApiModelProperty(value = "金融经理id")
  private String manageuserid;

  @ApiModelProperty(value = "金融经理")
  private String managername;

  @ApiModelProperty(value = "是否挂靠:1:挂靠;2:非挂靠")
  private String isAnchored;

  @ApiModelProperty(value = "统一社会信用代码")
  private String agreeSocialcreditCode;

  @ApiModelProperty(value = "申请编号")
  private String applyId;

  @ApiModelProperty(value = "保证人授权书PDF路径")
  private String guarantorReportingPdf;

  @ApiModelProperty(value = "保证人授权书jpg路径")
  private String guarantorReportingJpg;

  @ApiModelProperty(value = "民族")
  private String nationality; -->

<style lang='scss' scoped>
    .bigbox {
        width: 100%;

        span {
            display: inline-block;
            width: 100%;
            margin: 0.6rem;
            font-size: 0.36rem;
        }
    }
</style>