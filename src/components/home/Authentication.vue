<template>
    <div class="bigbox">
        <div class="top_images">
            <img src="../../assets/img/logo.png" alt="">
            <p class="title">感谢选择佰仟融资租赁</p>
            <p class="subTitle">实名认证成功后，您可以进行电子签名</p>
        </div>
        <div v-show='flags'>
            <div class="content">
                <ul>
                    <!-- 主审人 -->
                    <div v-if="authCustomerType=='masterMan'">
                        <li>
                            <span class="text">经销商名称</span>
                            <input class="ipt" type="text" readonly v-model.trim='personalData.providersname'>
                        </li>
                        <!-- <li>
                        <span class="text">合同号</span>
                        <input class="ipt" type="text" readonly v-model.trim='personalData.objectno'>
                    </li>
                    <li>
                        <span class="text">金融经理</span>
                        <input class="ipt" type="text" readonly v-model.trim='personalData.manageusername'>
                    </li> -->
                    </div>
                    <!-- 保证人 -->
                    <div v-if="authCustomerType=='bondsMan'">
                        <li>
                            <span class="text">合同号</span>
                            <input class="ipt" type="text" readonly v-model.trim='personalData.objectno'>
                        </li>
                        <li>
                            <span class="text">主申人</span>
                            <input class="ipt" type="text" readonly v-model.trim='personalData.applyName'>
                        </li>
                    </div>

                    <li>
                        <span class="text">姓名</span>
                        <input class="ipt" type="text" readonly v-model.trim='IDInfo.name'>
                        <span class="scanningBtn"></span>
                    </li>
                    <li>
                        <span class="text">身份证号码</span>
                        <input class="ipt" type="text" readonly v-model.trim='IDInfo.idcard'>
                    </li>
                    <li>
                        <span class="text">手机号码</span>

                        <input v-if='isReadonly' class="ipt" type="text" placeholder="请输入手机号码" readonly
                            v-model.trim='personalData.mobileno'>
                        <input v-else class="ipt" type="text" placeholder="请输入手机号码"
                            v-model.trim='personalData.mobileno'>
                    </li>
                </ul>
            </div>

            <div class="apply_title">申请人征信授权信息</div>

            <div class="ID_img">
                <div class="left box">
                    <img class="img" :src="IDInfo.idCardFrontImageUrl" alt="">
                </div>
                <div class="middle box">
                    <img class="img" :src="IDInfo.idCardBehindImageUrl" alt="">
                </div>
                <div class="right box">
                    <img class="img" src="../../assets/img/finish@2x.png" alt="">
                </div>
            </div>
            <div class="ID_img contes">
                <span class="wenzi">身份证(头像面)</span>
                <span class="wenzi">身份证(国徽面)</span>
                <span class="wenzi success ">完成活体检测</span>
            </div>

            <div class="note">
                <input class="ipt" type="text" placeholder="请输入短信验证码" v-model.trim='IDInfo.verificationCode'>
                <button class="btn" v-bind:class="{ color: content!=='获取验证码'}" @click="goSMS">{{content}}</button>
            </div>
            <div class="empower">
                <div class="left">
                    <label class="lab"><input ref="Fruit" type="radio" @click='checkedHand' :checked='IDInfo.isChck'
                            value="1" v-model='IDInfo.isChck' />
                    </label>
                </div>
                <div class="right">我已阅读并同意
                    <span v-if="authCustomerType=='masterMan'" :class="[isPCR?'red':'gray']"
                        @click="goPersonalCreditReporting">《授权书（个人征信业务）》</span>
                    <span v-if="authCustomerType=='bondsMan'" :class="[isPCRB?'red':'gray']"
                        @click="goPersonalCreditReportingB">《人行征信授权书》</span>、
                    <span :class="[isPAT?'red':'gray']" @click="goPersonalAuthorization">《百行征信授权书》</span>、
                    <span :class="[isIAT?'red':'gray']"
                        @click='goInformationAuthorization'>《三方征信授权书》</span>，并同意采取填写手机验证码方
                    式签署上述授权文件。
                    <span class="tishi">(点击文件名称查看相应文件条款)</span>
                </div>
                <div class="tips" v-show="isShow" @click="realize"></div>
            </div>
            <div class="sbmit">
                <button class="smt_btn" @click="submit">提交认证</button>
            </div>
            <div class="mask" v-show="isShow"></div>
        </div>
    </div>
</template>

<script>
    import {
        getQueryString
    } from '../../public/uilt.js'
    import {
        MessageBox,
        Toast,
        Indicator
    } from 'mint-ui';
    export default {

        data() {
            return {
                isShow: false,
                timer: null,
                mobile: '',
                isPCR: false,
                isPAT: false,
                isIAT: false,
                isPCRB: false,
                content: '获取验证码',
                setInterval: null,
                code: null,
                orderNo: null,
                newSignature: null,
                h5faceId: null,
                IDInfo: {},
                personalData: {},
                authCustomerType: null,
                recordId: null,
                type: null,
                isReadonly: null,
                spouseInfo: {},
                flags: true
            }
        },
        created() {
            // 腾讯URL返回的参数
            this.code = getQueryString('code'); //
            this.orderNo = getQueryString('orderNo') //订单号
            this.newSignature = getQueryString('newSignature'); //签名
            this.h5faceId = getQueryString('h5faceId'); //唯一标识

            // // // 方便测试关闭
            // if (this.code != '0') {
            //     MessageBox('提示', '人脸识别失败，请返回首页重新操作').then(action => {
            //         if (sessionStorage.getItem("indexURl")) {
            //             window.location.href = sessionStorage.getItem("indexURl")
            //         }
            //     });
            //     this.flags = false
            //     return;
            // }

            this.isPCR = sessionStorage.getItem("isPCR") || false;
            this.isPAT = sessionStorage.getItem("isPAT") || false;
            this.isIAT = sessionStorage.getItem("isIAT") || false;
            this.isPCRB = sessionStorage.getItem("isPCRB") || false;


            this.IDInfo = JSON.parse(sessionStorage.getItem('sureIDInfo')) || {};
            this.personalData = JSON.parse(sessionStorage.getItem('personalData')) || {};
            // 缓存验证码
            this.IDInfo.verificationCode = sessionStorage.getItem("verificationCode") || ''
            // 缓存拿不到数据，去后台请求

            if (Object.keys(this.IDInfo).length <= 0 || Object.keys(this.personalData).length <= 0) {
                Toast('缓存被清,后台请求数据');
                this.getInfo();
                return;
            }

            //  authCustomerType    //认证客户类型     masterMan--主申人。 bondsMan--保证人
            this.authCustomerType = sessionStorage.getItem('authCustomerType') || '';
            this.recordId = sessionStorage.getItem('recordId') || '';
            this.type = sessionStorage.getItem('type') || '';
            this.isReadonly = sessionStorage.getItem('isReadonly') || '';

            // 缓存拿不到数据，去后台请求 (理论上不会，预防)
            if (!this.authCustomerType || !this.recordId || !this.isReadonly) {
                Toast('缓存被清,后台请求数据');
                this.getInfo();
                return;
            }
            // 配偶
            if (this.type == '03' && this.personalData.relationship == '01') {
                this.getSpouse(sessionStorage.getItem("masterId") || '')
            }
            console.log(sessionStorage.getItem("verificationCode"))
            console.log(this.IDInfo)
        },
        computed: {},
        methods: {
            getInfo() {
                Indicator.open({
                    spinnerType: 'fading-circle'
                });
                this.$request.post('v5/getAPPIdentityinfo', {
                    moveId: this.$route.query.infoID || ""
                }).then(res => {
                    Indicator.close();
                    if (res && res.returnCode == '200') {
                        this.IDInfo = res.data;
                        this.personalData = res.data;
                        this.authCustomerType = res.data.authCustomerType || '';
                        this.recordId = res.data.recordId || '';
                        this.type = res.data.type || '';
                        this.isReadonly = res.data.mobileno || '';
                        this.IDInfo.verificationCode = sessionStorage.getItem("verificationCode") || '';
                        //   配偶信息
                        if (res.data.type == '03' && res.data.relationship == '01') {
                            this.getSpouse(res.data.masterId)
                        }

                    }
                }).catch(error => {
                    Indicator.close();
                    console.log('error' + error)
                })
            },
            // 拉取配偶信息
            getSpouse(resID) {
                // resID  =  masterId
                this.$request.post('v3/guarantor/querySpouse', {
                    customerId: resID
                }).then(res => {
                    if (res.returnCode == '200') {
                        this.spouseInfo = res.data;
                    }
                }).catch(error => {
                    console.log('error' + error)
                })
            },
            // submit
            submit() {
                // 验证是否阅读相关文件

                if (!this.IDInfo.isChck) {
                    Toast({
                        message: '请阅读并同意授权文件',
                        duration: 1600
                    });
                    return;
                }
                if (this.authCustomerType == 'masterMan') {
                    if (!this.isPCR || !this.isPAT || !this.isIAT) {
                        this.isShow = true
                        return;
                    }
                }
                if (this.authCustomerType == 'bondsMan') {
                    if (!this.isPCRB || !this.isPAT || !this.isIAT) {
                        this.isShow = true
                        return;
                    }
                }

                if (!this.IDInfo.verificationCode) {
                    Toast('请先获取短信验证');
                    return
                }

                Indicator.open({
                    text: '上传中...',
                    spinnerType: 'fading-circle'
                });

                let params = {};
                let url = null;
                let validDate = this.IDInfo.validDate.split("-") || [];
                if (this.authCustomerType == 'masterMan') {
                    // 主审人
                    url = 'v3/AuditApply/saveAudit.do'
                    params = {
                        applyUserid: this.personalData.inputuserId, //登录用户ID
                        customerName: this.personalData.customername, //客户名称 与扫描结果对比
                        customerType: this.personalData.customerType, //客户类型 03：个人 05：公司
                        documentNumber: this.IDInfo.idcard, //身份证号码
                        verificationCode: this.IDInfo.verificationCode, //短信 验证码
                        idCardFrontImageUrl: this.IDInfo.idCardFrontImageUrl, //身份证 正面
                        idCardBehindImageUrl: this.IDInfo.idCardBehindImageUrl, //身份证 反面
                        inputuserId: this.personalData.inputuser, //登录用户ID
                        certDateStart: validDate[0], //身份证有效时间 开始
                        certDateSnd: validDate[1], //身份证有效时间 结束
                        nationality: this.IDInfo.nation, //民族
                        productType: this.personalData.businessType, //业务类型
                        dealerName: this.personalData.providersname, //经销商名称
                        orderNumber: this.orderNo, //订单号
                        phoneNumber: this.personalData.mobileno, //电话号码
                    }

                } else if (this.authCustomerType == 'bondsMan') {
                    // 保证人
                    if (this.type == '03') {
                        //客户类型 03：个人 05：公司
                        // 个人进件保证人保存接口：
                        url = 'v3/guarantor/saveGuarantorList'
                        params = {
                            "mobiletelephone": this.personalData.mobileno, //手机号
                            "customerrelation": this.personalData.relationship, //与主申人关系
                            "isActualCarMan": this.personalData.isUseCar, //是否实际用车人 1-是 2-否
                            "customername": this.IDInfo.name, //客户名称
                            "customerrole": "03", //申请角色
                            "userId": this.personalData.manageuserid, //金融经理id
                            "certtype": "Ind01", //证件类型
                            "nationality": this.IDInfo.nation, //民族
                            "overduedate": this.IDInfo.validDate, //身份证有效期
                            "userName": this.personalData.manageusername, //金融经理
                            "verificationCode": this.IDInfo.verificationCode, //短信 验证码
                            "inputuserid": this.personalData.inputuserId, //操作用户ID
                            "serialno": this.personalData.objectno, //合同号
                            "orderNumber": this.orderNo, //订单号
                            "certid": this.IDInfo.idcard, //身份证号
                            "relationstatus": "03", //客户类型
                            'moveId': this.recordId //app 带过来的iD
                        }
                        if (this.personalData.relationship == '01') {

                            params = Object.assign({}, params, {
                                marriage: this.spouseInfo.marriage, //婚姻状况
                                mobiletelephone: this.spouseInfo.spousetel, //配偶电话号码
                                childrentotal: this.spouseInfo.childrentotal, //配偶子女数
                                workcorp: this.spouseInfo.spouseworkcorp, //配偶单位名称
                                workAddId: this.spouseInfo.spouseAddId, //配偶单位地址id
                                workAddDetail: this.spouseInfo.spouseAddDetail, //单位地址详情
                            })
                        }
                    };
                    if (this.type == '05') {
                        //客户类型 03：个人 05：公司
                        // 公司进件保证人保存接口：
                        url = 'v5/guarantor/saveDetails'
                        params = {
                            "idCardBehindImageUrl": this.IDInfo.idCardBehindImageUrl, //身份证 反面
                            "customerrelation": this.personalData.relationship, //与主申人关系
                            "phone": this.personalData.mobileno, //手机号
                            "nationality": this.IDInfo.nation, //民族
                            "customername": this.IDInfo.name, //客户名称
                            "customerrole": "03", //角色
                            "idCardFrontImageUrl": this.IDInfo.idCardFrontImageUrl, //身份证 正面
                            "verificationCode": this.IDInfo.verificationCode, //短信 验证码
                            "serialno": this.personalData.objectno, //合同号
                            "inputuserid": this.personalData.inputuserId, //操作用户ID
                            "orderNumber": this.orderNo, //订单号
                            "applyId": this.personalData.applyId, //申请编号
                            "certid": this.IDInfo.idcard, //身份证号
                            "overduedate": this.IDInfo.validDate, //身份证有效期
                            "customertype": '03', //不管个人或公司进件 默认是个人类型的保证人
                            'moveId': this.recordId //app 带过来的iD}
                        };
                    }
                }

                this.$request.post(url, params).then(res => {

                    Indicator.close();
                    if (res.returnCode == '200') {
                        this.$router.push({
                            path: 'Success'
                        })
                    }
                }).catch(error => {
                    Indicator.close();
                    console.log('error' + error)
                })
            },
            // 关闭蒙层
            realize() {
                this.isShow = false
            },
            //    《授权书（个人征信业务）》
            goPersonalCreditReporting() {

                this.$router.push({
                    name: 'PersonalCreditReporting',
                    params: {
                        name: this.IDInfo.name,
                        idcard: this.IDInfo.idcard
                    }
                })
            },
            //  保证人  《人行征信授权书》
            goPersonalCreditReportingB() {
                this.$router.push({
                    name: 'PersonalCreditReportingB',
                    params: {
                        name: this.IDInfo.name,
                        idcard: this.IDInfo.idcard
                    }
                })
            },
            //    《百行征信授权书》
            goPersonalAuthorization() {

                this.$router.push({
                    name: 'PersonalAuthorization',
                    params: {
                        name: this.IDInfo.name,
                        idcard: this.IDInfo.idcard
                    }
                })
            },
            //    《百行征信授权书》
            goInformationAuthorization() {
                this.$router.push({
                    name: 'InformationAuthorization',
                    params: {
                        name: this.IDInfo.name,
                        idcard: this.IDInfo.idcard
                    }
                })
            },
            // 点击获取短信
            goSMS() {

                const _this = this
                if (!this.personalData.mobileno) {
                    Toast('请输入验证手机号');
                    return;
                } else if (!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.personalData.mobileno))) {
                    Toast('请输入正确的手机号码');
                    return;
                }

                if (this.content !== '获取验证码') return;
                let timer = 1;
                this.content = `已发送(${timer}S)`
                this.setInterval = setInterval(() => {
                    timer++;
                    this.content = `已发送(${timer}S)`
                    if (timer == 60) {
                        _this.content = '获取验证码'
                        clearInterval(_this.setInterval)
                    }
                }, 1000);

                this.$request.post('send/sendMsgYz', {
                    phoneNums: this.personalData.mobileno
                }).then(res => {
                    if (res && res.data.smsStatus == 'N') {
                        this.IDInfo.verificationCode = res.data.verificationCode || ''
                    }
                }).catch(error => {
                    console.log('error' + error)
                })
            },

            // 选择阅读
            checkedHand() {

                if (this.authCustomerType == 'masterMan') {
                    if (!this.isPCR || !this.isPAT || !this.isIAT) {
                        setTimeout(() => {
                            this.IDInfo.isChck = false;
                        }, 0);
                        Toast('请先阅读授权文件');
                        return;
                    }
                }
                if (this.authCustomerType == 'bondsMan') {
                    if (!this.isPCRB || !this.isPAT || !this.isIAT) {
                        setTimeout(() => {
                            this.IDInfo.isChck = false;
                        }, 0);
                        Toast('请先阅读征信授权书');
                        return;
                    }
                }
            }
        },

        components: {},
        beforeDestroy() {
            sessionStorage.setItem("verificationCode", this.IDInfo.verificationCode || '')

            clearInterval(this.setInterval)
        },
    }
</script>


<style lang='scss' scoped>
    .bigbox {
        width: 100%;
        height: 100%;
        position: relative;


        .top_images {
            height: 3.12rem;
            padding-top: 0.4rem;
            box-sizing: border-box;

            img {
                width: 1.2rem;
                height: 1.2rem;
                margin: 0 auto;
            }

            .title {
                font-size: 0.3rem;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                line-height: 0.86rem;
                text-align: center;
            }

            .subTitle {
                font-size: 0.28rem;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                text-align: center;
                line-height: 0.32rem;
            }
        }

        .content {
            ul {
                li {
                    border-bottom: 1px solid #f3f3f3;
                    width: 100%;
                    background: #fff;
                    position: relative;
                    min-height: 1rem;
                    line-height: 1rem;

                    /* display: inline; */
                    display: flex;
                    justify-content: space-between;

                    .text {
                        display: block;
                        width: 2rem;
                        font-size: 0.3rem;
                        font-weight: 400;
                        color: rgba(102, 102, 102, 1);
                        margin-left: 0.3rem;
                    }

                    .ipt {
                        flex: 1;
                        font-size: 0.3rem;
                        color: rgba(51, 51, 51, 1);
                        margin-right: 0.3rem;
                    }

                    .scanningBtn {
                        display: inline-block;
                        position: absolute;
                        z-index: 1;
                        top: 0;
                        right: 0;
                        width: 1.3rem;
                        height: 2.01rem;
                        background: #fff;
                        background: url("../../assets/img/scanningBtn.png") no-repeat center #fff;
                        background-size: 0.5rem 0.48rem;
                        border-left: 1px solid #f3f3f3;
                    }
                }
            }
        }

        .apply_title {
            /* width: 100%; */
            font-size: 0.28rem;
            font-family: PingFangSC-Regular;
            color: rgba(136, 136, 136, 1);
            line-height: 1rem;
            padding-left: 0.2rem
        }

        .ID_img {
            width: 98%;
            padding: 0 1%;
            padding-top: 0.4rem;
            display: flex;
            justify-content: space-around;
            background: rgba(255, 255, 255, 1);

            .box {
                width: 2.3rem;
                height: 1.5rem;
                border: 1px dashed #999;
                background: url('../../assets/img/1@2x.png') no-repeat center;
                background-size: 102% 102%;

                display: flex;
                justify-content: center;
                align-items: center;

                .img {
                    width: 2.05rem;
                    height: 1.3rem;
                    border: none;
                }
            }

            .right {
                width: 1.68rem;

                .img {
                    width: 0.71rem;
                    height: 0.71rem;
                }
            }
        }

        .contes {
            padding: 0.2rem 1%;

            .wenzi {
                width: 2.3rem;
                text-align: center;
                font-size: 0.22rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }

            .success {
                width: 1.8rem;
            }
        }

        .note {
            width: 100%;
            height: 1rem;
            margin: 0.2rem 0;
            display: flex;
            justify-content: space-between;

            .btn {
                width: 2.16rem;
                font-size: 0.3rem;
                background-color: #fff;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(0, 137, 252, 1);
            }

            .color {
                font-size: 0.3rem;
                color: rgba(153, 153, 153, 1);
            }

            .ipt {
                flex: 1;
                line-height: 1rem;
                padding-left: 0.3rem;
                font-size: 0.3rem;
            }
        }


        .empower {
            position: relative;
            top: 0;
            left: 0;
            z-index: 99;
            padding: 0.2rem;
            font-size: 0.24rem;
            background: #fff;
            font-family: PingFangSC-Regular;
            color: rgba(0, 0, 0, 1);
            line-height: 0.36rem;
            display: flex;

            .left {
                z-index: 3;

                .lab {
                    input {
                        margin: 0.1rem;
                    }
                }
            }

            .right {
                position: relative;
                z-index: 3;
                line-height: 0.36rem;
                font-size: 0.24rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(0, 0, 0, 1);


                .red {
                    color: red;
                }

                .gray {
                    color: #7986B2;
                }

                .tishi {
                    font-size: 0.24rem;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                }
            }
        }

        .sbmit {
            width: 100%;

            .smt_btn {
                display: block;
                width: 5.8rem;
                height: 0.94rem;
                margin: 0.6rem auto;
                background: linear-gradient(90deg, rgba(0, 137, 252, 1), rgba(1, 163, 246, 1), );
                border-radius: 0.26rem;


                font-size: 0.36rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 0.94rem;
            }
        }

        .mask {
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 2;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 1);
            opacity: 0.7;


        }

        .tips {
            width: 3.95rem;
            height: 1.77rem;
            background: url('../../assets/img/ts_word 2@2x.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: -2.2rem;
            left: 2.57rem;
        }
    }
</style>