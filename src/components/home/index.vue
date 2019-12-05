<template>
    <div class="bigbox">
        <div class="top_images">
            <img src="../../assets/img/logo.png" alt="">
            <p class="title">感谢选择佰仟融资租赁</p>
            <p class="subTitle">实名认证成功后，您可以进行电子签名</p>
        </div>
        <div class="content" v-if='flags'>
            <!-- 主审人 -->
            <ul v-show="authCustomerType == 'masterMan'">
                <li>
                    <span class="text">经销商名称</span>
                    <input class="ipt" type="text" readonly v-model.trim='personalData.providersname'>
                </li>
                <!-- <li>
                    <span class="text">金融经理</span>
                    <input class="ipt" type="text" v-model.trim='personalData.manageusername'>
                </li> -->
                <li>
                    <span class="text">姓名</span>
                    <input class="ipt" readonly type="text">
                    <span class="scanningBtn" @click="goAddID"></span>
                </li>
                <li>
                    <span class="text">身份证号码</span>
                    <input class="ipt" readonly type="text">
                </li>
            </ul>
            <!-- 保证人 -->
            <ul v-show="authCustomerType == 'bondsMan'">
                <li>
                    <span class="text">合同号</span>
                    <input class="ipt" type="text" readonly v-model.trim='personalData.objectno'>
                </li>
                <li>
                    <span class="text">主申人</span>
                    <input class="ipt" type="text" readonly v-model.trim='personalData.applyName'>
                </li>
                <li>
                    <span class="text">姓名</span>
                    <input class="ipt" readonly type="text">
                    <span class="scanningBtn" @click="goAddID"></span>
                </li>
                <li>
                    <span class="text">身份证号码</span>
                    <input class="ipt" readonly type="text">
                </li>
            </ul>
        </div>

        <div class="mask" v-show="isShow">
            <div class="tips" @click="realize"></div>
        </div>
    </div>
</template>

<script>
    import {
        MessageBox,
        Indicator
    } from 'mint-ui'; //要引入
    import {
        getQueryString,
        isWeiXin,
        randomWord
    } from '../../public/uilt.js'

    export default {

        data() {
            return {
                isShow: false,
                timer: null,
                flags: true,
                authCustomerType: null,
                recordId: null,
                type: null,
                personalData: {},
                masterId: null,
                infoID: randomWord(false, 20),
            }
        },
        created() {

            // if (isWeiXin()) {
            //     MessageBox('提示', '请点击右上角选择其它浏览器进行访问');
            //     return
            // }

            //  authCustomerType    //认证客户类型     masterMan--主申人。 bondsMan--保证人
            //  获取URL传过来的参数  
            /*
             *失败 应该用路由接受参数     锚链接让url难看
             */
            this.authCustomerType = getQueryString('authCustomerType') || '';

            this.recordId = getQueryString('recordId') || ''; //查询数据ID

            this.type = getQueryString('type') || ''; //保证人  03个人 05公司

            this.masterId = getQueryString('masterId') || ''; //有配偶时   查询ID


            //  能去缓存的直接取缓存
            sessionStorage.setItem("authCustomerType", this.authCustomerType)
            sessionStorage.setItem("recordId", this.recordId)
            sessionStorage.setItem("type", this.type)


            if (this.authCustomerType && this.recordId) {
                // 获取主审人
                this.getAuditApplyByAuditNo()
            } else {
                this.flags = false;
                MessageBox('提示', '链接参数有误,请联系管理人员');
                return;
            }
            // /bqtd/v5/saveAPPIdentityinfo     /bqtd/v5/getAPPIdentityinfo 
        },
        methods: {
            // 点击跳转拍照页面
            goAddID() {

                // 关闭屏蔽层 才能跳转过去
                if (this.personalData == '{}') return;
                // 缓存url，预防在人脸识别失败跳回来
                sessionStorage.setItem("indexURl", window.location.href)
                console.log("aaa",this.infoID,this.personalData.inputuserId, this.personalData.customername)
                this.$router.push({
                    path: 'AddID',
                    query: {
                        infoID: this.infoID,
                        inputuserId: this.personalData.inputuserId,
                        customername: this.personalData.customername,
                    }
                })

            },
            // 关闭蒙层
            realize() {
                this.isShow = false;
            },

            // 显示屏蔽层
            isShowHand() {
                this.timer = setTimeout(() => {
                    this.isShow = true
                }, 1000);
            },

            // private String auditno;预审单号
            // private String objectno;合同号
            // private String type;类型(1主申人 2保证人) 
            // private String actionType;1：授权不过预审 2：预审操作类型 
            // private String customername;客户名名称
            // private String customerType; 客户类型 
            // private String producttype;产品类型
            // private String certid;证件号
            // private String isUseCar;是否实际用车人
            // private String isAnchored;是否挂靠
            // private String actionStatus;操作状态 1:已授权  2.未授权
            // private String mobileno;手机号
            // private String businessType;业务类型
            // private String providerscode; 经销商编号
            // private String providersname;经销商名称
            // private String manageuserid;金融经理id
            // private String manageusername;金融经理名称
            // private String inputuserId;操作人 
            // private String relationship;主申人关系
            // private String enterpriseCode;统一信用码

            // 获取
            getAuditApplyByAuditNo() {
                Indicator.open({
                    text: '加载中...',
                    spinnerType: 'fading-circle'
                });
                this.$request.post('v5/moveDelegate/getByIdInfo', {
                    id: this.recordId
                }).then(res => {

                    if (res.returnCode == '200') {
                        this.personalData = res.data || {};
                        sessionStorage.setItem("personalData", JSON.stringify(res.data))
                        sessionStorage.setItem("isReadonly", res.data.mobileno)
                        Indicator.close();
                        this.isShowHand() //开启屏蔽层
                        this.saveInfo() //后台缓存数据
                        if (this.type == '03' && this.personalData.relationship == '01') {
                            sessionStorage.setItem("masterId", this.masterId)
                        }
                    }

                }).catch(error => {
                    Indicator.close();
                    console.log('error' + error)
                })
            },

            // 后台 缓存数据 
            saveInfo() {
                let params = {
                    moveId: this.infoID,
                    authCustomerType: this.authCustomerType,
                    recordId: this.recordId,
                    type: this.type,
                    masterId: this.masterId,
                    // 个人信息
                    inputuserId: this.personalData.inputuserId,
                    relationship: this.personalData.relationship,
                    mobileno: this.personalData.mobileno,
                    customername: this.personalData.customername,
                    customerType: this.personalData.customerType,
                    inputuser: this.personalData.inputuser,
                    businessType: this.personalData.businessType,
                    providersname: this.personalData.providersname,
                    isUseCar: this.personalData.isUseCar,
                    manageuserid: this.personalData.manageuserid,
                    manageusername: this.personalData.manageusername,
                    objectno: this.personalData.objectno,
                    applyId: this.personalData.applyId,
                }
                this.$request.post('v5/saveAPPIdentityinfo', params).then(res => {
                    console.log(res)
                }).catch(error => {
                    console.log('error' + error)
                })
            }
        },
        beforeDestroy() {

            if (this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
                clearTimeout(this.timer); //关闭
            }
            this.isShow = false;
        },
        components: {},

    }
</script>


<style lang='scss' scoped>
    .bigbox {
        width: 100%;
        height: 100%;
        position: relative;
    }

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
                    z-index: 99;
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

    .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 1);
        opacity: 0.7;

        .tips {
            width: 3.1rem;
            height: 3.48rem;
            background: url('../../assets/img/ts_word@2x.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 6.1rem;
            left: 2.57rem;
        }
    }
</style>