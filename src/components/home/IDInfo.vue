<template>
    <div class="idInfo">
        <div class="beCareful">注：在确认前，身份证文字类信息都可以点击修改。</div>
        <div class="ID_img">
            <div class="left box">
                <img :src="IDInfo.idCardFrontImageUrl" alt="">
            </div>
            <div class="right box">
                <img :src="IDInfo.idCardBehindImageUrl" alt="">
            </div>
        </div>
        <div class="content">
            <ul>
                <!-- 姓名 性别 民族 身份证号 出生年月日 公安局 住址 失效日期 -->
                <li class="li_Info">
                    <span class="text">姓名</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.name'>
                </li>
                <li class="li_Info">
                    <span class="text">性别</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.sex'>
                </li>
                <li class="li_Info">
                    <span class="text">民族</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.nation'>
                </li>
                <li class="li_Info">
                    <span class="text">身份证号</span>
                    <input class="ipt" maxlength="18"  type="text" v-model.trim='IDInfo.idcard'>
                </li>
                <li class="li_Info">
                    <span class="text">出生年月日</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.birth'>
                </li>
                <li class="li_Info">
                    <span class="text">签发机关</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.authority'>
                </li>
                <li class="li_Info">
                    <span class="text">住址</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.address'>
                </li>
                <li class="li_Info">
                    <span class="text">有效日期</span>
                    <input class="ipt"  type="text" v-model.trim='IDInfo.validDate'>
                </li>
            </ul>
        </div>

        <div class="btn_box">
            <button class="btn left" @click="againAddID"> 重新上传</button>
            <button class="btn right" @click="confirm"> 确认</button>
        </div>
    </div>
</template>

<script>
    import {
        MessageBox,
        Toast,
        Indicator
    } from 'mint-ui';
    import {
        randomWord
    } from '../../public/uilt.js'
    export default {
        data() {
            return {
                IDInfo: {},
                orderNo: null,
                nonce: null,
                appId: this.$baseInfo.VUE_APP_API_APPID,
                secret: this.$baseInfo.VUE_APP_API_SECRET,
                isShow: false,
            }
        },

        created() {
            console.log(this.$route.query.customername)
            
            this.IDInfo = JSON.parse(sessionStorage.getItem('IDInfo')) || {}
            // 缓存拿不到数据，去后台请求

            if (Object.keys(this.IDInfo).length <= 0) {
                this.getInfo();
                return;
            }


            if (this.$route.query.from == 'Authentication') {
                let instance = Toast({
                    message: '人脸核身验证失败',
                });
                setTimeout(() => {
                    instance.close();
                }, 1200);
            } else if (this.$route.query.from == "addID") {
                let instance = Toast({
                    message: '身份识别成功',
                    iconClass: 'icon icon-success'
                });
                setTimeout(() => {
                    instance.close();
                }, 1200);
            }
        },
        mounted() {
            this.orderNo = randomWord(false, 32);
            this.nonce = randomWord(false, 32);
            //活体检测回调判断
            let code = this.getQueryString('code')||'999999';
            if(sessionStorage.getItem("isOcrRetrun")=="isOcrRetrun"&&code!='0'&&code!='999999'){//等于0 表示成功  上线后记得改为 == 0
                sessionStorage.removeItem("isOcrRetrun");
                location.href = location.origin+'/#/e_signature_list?contractNo='+this.$route.query.contractNo+'&idCard='+this.$route.query.idCard;
            };
        },
        methods: {
            // 后台拿缓存的数据
            getInfo() {
               
                Indicator.open({
                    spinnerType: 'fading-circle'
                });
                this.$request.post('v5/getAPPIdentityinfo', {
                    moveId: this.$route.query.infoID
                }).then(res => {
                    Indicator.close();
                    if (res && res.returnCode == '200') {
                        this.IDInfo = res.data
                    }
                }).catch(error => {
                    Indicator.close();
                    console.log('error' + error)
                })
            },

            // 重新提交
            againAddID() {
                // this.$router.push({
                //     path: 'AddID'
                // })
                if(sessionStorage.getItem("isOcrRetrun")){
                    sessionStorage.removeItem("isOcrRetrun");
                };
                this.$router.go(-1)
            },
            // 
            confirm() {
                sessionStorage.setItem("isOcrRetrun","isOcrRetrun");
                //  authCustomerType    //认证客户类型     masterMan--主申人。 bondsMan--保证人
                if (this.IDInfo.name !== this.$route.query.customername||this.IDInfo.idcard !== this.$route.query.idCard) {
                    MessageBox('提示', '扫描身份证信息非申请者');
                    return;
                }
                MessageBox({
                    title: '提示',
                    message: '已完成身份信息的核对,确定提交审核?',
                    showCancelButton: true,
                    cancelButtonClass: 'cancel',
                    confirmButtonClass: 'cancel',
                }).then(async action => {

                    if (action == 'confirm') {
                        Indicator.open({
                            text: '上传中...',
                            spinnerType: 'fading-circle'
                        });
                        try {
                            // await this.saveIDInfo()
                            await this.livingBody()
                        } catch (error) {
                            Indicator.close();
                        }
                    }
                });
            },
            // 保存身份证信息（

            async saveIDInfo() {
                let validDate = this.IDInfo.validDate.split("-") || [];
                let expiryDate = validDate[1] == '长期' ? '29991230' : validDate[1];
                let param = {
                    name: this.IDInfo.name, //姓名
                    ethnic: this.IDInfo.nation, //民族
                    cardid: this.IDInfo.idcard, //证件号
                    birthDate: this.IDInfo.birth, //生日
                    address: this.IDInfo.address, //证件地址
                    authority: this.IDInfo.authority, //签证机构
                    expiryDate: expiryDate //失效期
                }
                const res = await this.$request.post('cardInfo/save', param);
                if (!res) {
                    throw new Error('res.data.msg')
                }
                let params = {
                    moveId: this.$route.query.infoID,
                    // 身份证信息
                    idCardFrontImageUrl: this.IDInfo.idCardFrontImageUrl,
                    idCardBehindImageUrl: this.IDInfo.idCardBehindImageUrl,
                    name: this.IDInfo.name,
                    sex: this.IDInfo.sex,
                    nation: this.IDInfo.nation,
                    idcard: this.IDInfo.idcard,
                    birth: this.IDInfo.birth,
                    authority: this.IDInfo.authority,
                    address: this.IDInfo.address,
                    validDate: this.IDInfo.validDate,
                }
                this.$request.post('v5/saveAPPIdentityinfo', params).then(res => {
                    console.log(res)
                }).catch(error => {
                    console.log('error' + error)
                })
            },

            // 活体识别
            async livingBody() {
                // 缓存个人身份信息（可能有修改）
                sessionStorage.setItem("sureIDInfo", JSON.stringify(this.IDInfo))

                let params = {
                    appId: this.appId, //腾讯云线下对接分配的 AppId 
                    secret: this.secret, //腾讯云线下对接分配的 AppId的密钥
                    orderNo: this.orderNo, //随机数订单号
                    name: this.IDInfo.name, //客户证件姓名
                    idNo: this.IDInfo.idcard, //客户证件号码
                    userId: this.$route.query.inputuserId, //用户id
                    version: '1.0.0', //版本号
                    nonceStr: this.nonce, //随机的32位字符串 
                    // url: `${this.$baseInfo.VUE_APP_Callback_URL}#/Authentication?infoID= ${this.$route.query.infoID}`, //完成后回调路径
                    url: location.href, //完成后回调路径
                    // url: 'http://10.81.2.192:8080/#/Authentication?infoID=' + this.$route.query
                    //     .infoID, //完成后回调路径
                    resultType: '0', // 是否显示结果页面 0显示 
                    from: 'browser', // 表示在哪里启动刷脸
                    sourcePhotoStr: '', // 比对源照片非必填 
                    sourcePhotoType: '1' /** 比对源照片类型 */
                }
                console.log("params",params);
                this.$request.post('H5FaceBody/H5FaceNuclearBody', params).then(res => {

                    Indicator.close();
                    console.log(res);
                    if (res.code == '200') {
                        window.location.href = res.data.redirectUrl
                    }
                    // 方便测试
                    // this.$router.push({
                    //     path: 'e_signature_list  ',
                    //     query: {
                    //         infoID: this.$route.query.infoID
                    //     }
                    // })
                }).catch(error => {
                    console.log('error' + error)
                })
            },
            getQueryString(name){
                let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                let r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            }
        }
    }
</script>
<style lang="scss">
    .cancel {
        font-size: 0.36rem
    }

    .idInfo {
        width: 100%;
        background-color: #fff;

        .beCareful {
            width: 100%;
            text-align: center;
            height: 0.6rem;
            line-height: 0.6rem;
            background: rgba(248, 72, 89, 1);

            font-size: 0.28rem;
            font-family: PingFangSC-Regular;
            color: rgba(255, 255, 255, 1);
        }

        .ID_img {
            width: 100%;
            height: 2.1rem;
            margin: 0.07rem 0;
            display: flex;
            justify-content: space-around;

            .box {
                width: 3.2rem;
                height: 2.1rem;
                border: 1px solid #000;

                img {
                    width: 3.2rem;
                    height: 2.1rem;
                }
            }
        }

        .content {
            width: 100%;
            padding-bottom: 0.94rem;

            ul {
                width: 100%;

                .li_Info {
                    width: 100%;
                    height: 1rem;
                    line-height: 1rem;
                    background: #fff;
                    display: flex;
                    justify-content: space-between;

                    .text {
                        width: 2.0rem;
                        margin-left: 0.3rem;
                        font-size: 0.3rem;
                        color: #666666;
                    }

                    .ipt {
                        flex: 1;
                        margin-right: 0.3rem;
                        text-align: right;
                        font-size: 0.3rem;
                        color: #333333;
                    }
                }
            }
        }

        .btn_box {
            width: 100%;
            height: 0.94rem;
            position: fixed;
            bottom: 0;

            .btn {
                width: 50%;
                height: 100%;
                line-height: 0.94rem;
            }

            .left {
                background-color: #fff;
                font-size: 0.36rem;
                color: rgba(0, 137, 252, 1);
            }

            .right {
                background: linear-gradient(90deg, rgba(0, 137, 252, 1), rgba(1, 163, 246, 1));
                font-size: 0.36rem;
                color: rgba(255, 255, 255, 1);
            }
        }
    }
</style>