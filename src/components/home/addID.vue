<template>
    <div class="addID">
        <div class="title">
            请上传二代身份证
        </div>
        <div class="box">
            <!--  人像面-->
            <div class="show">
                <div class="picture " :style="'backgroundImage:url('+portraitImage+')'"></div>
                <div class="upload" v-show="!portraitImage">
                    <input class="hides" ref="referenceUploadp" type="file" 
                        @change="upload($event,'portrait')">
                </div>
                <div v-show='portraitImage' class="mask">
                    <div class="identification">仅供本次业务使用</div>
                    <i class="delete" @click="deeImg('portraitImage')"></i>
                </div>
            </div>
            <div class="tips">请拍照上传身份证人像面</div>
            <!-- 国徽面 -->
            <div>
                <div class="show">
                    <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
                    <div class="upload" v-show="!headerImage">
                        <!-- accept="image/*;capture=camera" 直接调用了相机 -->
                        <input class="hides" ref="referenceUploadh" type="file" @change="upload($event,'Emblem')">
                    </div>
                    <div v-show='headerImage' class="mask">
                        <div class="identification">仅供本次业务使用</div>
                        <i class="delete" @click="deeImg('headerImage')"></i>
                    </div>
                </div>
                <div class="tips">请拍照上传身份证国徽面</div>
            </div>
        </div>
        <div class="waring">本操作将严格保护您的隐私安全，请放心操作</div>
        <div class="btn_box">
            <button class="btn" :class="{'green': headerImage&&portraitImage }" @click='submit'>提交</button>
        </div>
    </div>
</template>

<script>
    import Exif from 'exif-js'

    import {
        MessageBox,
        Indicator
    } from 'mint-ui'; //要引入
    import {
        randomWord,getQueryString
    } from '../../public/uilt.js'
    export default {
        data() {
            return {
                headerImage: '',
                portraitImage: '',
                picValue: '',
                type: null,
                nonceSign: null,
                orderNo: null,
                nonce: null,
                appId: this.$baseInfo.VUE_APP_API_APPID,
                secret: this.$baseInfo.VUE_APP_API_SECRET,
                inputuserId: null,
                infoID: null,
                contractNo:this.$route.query.contractNo,
                idCard:this.$route.query.idCard
            }
        },
        created() {
            // 首页传过来 作为uerid
            console.log(this.$route, 789)
            // this.inputuserId = this.$route.query.inputuserId || '';
            this.infoID = this.$route.query.infoID || '';
        },
        mounted() {
            this.orderNo = randomWord(false, 32);
            this.nonce = randomWord(false, 32);
            this.inputuserId = randomWord(false, 32);
            // 获取签名
            setTimeout(()=>{
                console.log( "this.inputuserId",this.inputuserId);
                this.getSign();
            },500)
        },
        methods: {

            // 获取Sign
            getSign() {
                this.$request.post('OCRCtr/getTencentOcrData', {
                    appId: this.appId,
                    orderNo: this.orderNo,
                    nonceStr: this.nonce,
                    version: '1.0.0',
                    userId: this.inputuserId,
                    signType: 'SIGN',
                    secret: this.secret
                }).then(res => {
                    this.nonceSign = res.data.nonceSign
                    console.log("获取签名成功");
                }).catch(error => {
                    console.log('error' + error);
                })
            },

            // 提交进行OCR
            submit() {
                if (!this.portraitImage || !this.headerImage) {
                    return;
                }

                let param = {
                    frontBase: this.portraitImage.replace(/^.*?,/, ''), //正面
                    behindBase: this.headerImage.replace(/^.*?,/, ''), //反面
                    webankAppId: this.appId,
                    version: '1.0.0',
                    nonce: this.nonce,
                    sign: this.nonceSign,
                    orderNo: this.orderNo,
                    userId: this.inputuserId,
                    contractNo:this.contractNo 
                }
                console.log("照片信息",param)

                Indicator.open({
                    text: '上传中...',
                    spinnerType: 'fading-circle',
                });

                this.$request.post('OCRCtr/getOcrAPIData', param).then(res => {
                    Indicator.close();
                    if (res.code == '200') {

                        sessionStorage.setItem("IDInfo", JSON.stringify(res.data))

                        //this.saveInfo(res.data);

                        this.$router.push({
                            path: 'IDInfo',
                            query: {
                                from: 'addID',
                                infoID: this.infoID,
                                inputuserId: this.inputuserId,
                                customername: this.$route.query.customername || '',
                                contractNo:this.contractNo,
                                idCard:this.idCard
                            }
                        })
                    }
                }).catch(error => {
                    Indicator.close();
                })
            },
            saveInfo(resValue) {
                // 后台 缓存数据 
                let params = {
                    moveId: this.infoID,
                    // 身份证信息
                    idCardFrontImageUrl: resValue.idCardFrontImageUrl,
                    idCardBehindImageUrl: resValue.idCardBehindImageUrl,
                    name: resValue.name,
                    sex: resValue.sex,
                    nation: resValue.nation,
                    idcard: resValue.idcard,
                    birth: resValue.birth,
                    authority: resValue.authority,
                    address: resValue.address,
                    validDate: resValue.validDate,
                }
                this.$request.post('v5/saveAPPIdentityinfo', params).then(res => {
                    console.log(res)
                }).catch(error => {
                    console.log('error' + error)
                })
            },
            // 删除
            deeImg(res) {
                if (res == 'portraitImage') {
                    this.portraitImage = ''
                    this.$refs.referenceUploadp.value = null;
                } else {
                    this.headerImage = ''
                    this.$refs.referenceUploadh.value = null;
                }
            },
            upload(e, res) {

                this.type = res;
                let files = e.target.files || e.dataTransfer.files;

                if (!files.length) return;
                this.picValue = files[0];
                this.imgPreview(this.picValue, );

            },
            imgPreview(file) {

                let self = this;
                let Orientation;
                //去获取拍照时的信息，解决拍出来的照片旋转问题  
                Exif.getData(file, function () {
                    Orientation = Exif.getTag(this, 'Orientation');
                });
                // 看支持不支持FileReader  
                if (!file || !window.FileReader) return;

                if (/^image/.test(file.type)) {
                    // 创建一个reader  
                    let reader = new FileReader();
                    // 将图片2将转成 base64 格式  
                    reader.readAsDataURL(file);
                    // 读取成功后的回调  
                    reader.onloadend = function () {
                        let result = this.result;
                        let img = new Image();
                        img.src = result;
                        //判断图片是否大于100K,是就直接上传，反之压缩图片  
                        if (this.result.length <= (100 * 1024)) {
                            if (self.type == 'portrait') {
                                self.portraitImage = this.result;
                            } else {
                                self.headerImage = this.result;
                            }
                        } else {
                            img.onload = () => {
                                let data = self.compress(img, Orientation);
                                if (self.type == 'portrait') {
                                    self.portraitImage = data;
                                } else {
                                    self.headerImage = data;
                                }
                            }
                        }
                    }
                }
            },
            convertBase64UrlToBlob(urlData) {
                var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte  
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                };
                return new Blob([ab], {
                    type: 'image/png'
                });
            },

            //转换为file
            dataURLtoFile(dataurl, filename = 'file') {
                let arr = dataurl.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let suffix = mime.split('/')[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], `${filename}.${suffix}`, {
                    type: mime
                })
            },

            rotateImg(img, direction, canvas) {
                //最小与最大旋转方向，图片旋转4次后回到原方向      
                const min_step = 0;
                const max_step = 3;
                if (img == null) return;
                //img的高度和宽度不能在img元素隐藏后获取，否则会出错      
                let height = img.height;
                let width = img.width;
                let step = 2;
                if (step == null) {
                    step = min_step;
                }
                if (direction == 'right') {
                    step++;
                    //旋转到原位置，即超过最大值      
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                //旋转角度以弧度值为参数      
                let degree = step * 90 * Math.PI / 180;
                let ctx = canvas.getContext('2d');
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
                }
            },
            compress(img, Orientation) {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d');
                //瓦片canvas  
                let tCanvas = document.createElement("canvas");
                let tctx = tCanvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下  
                let ratio;
                if ((ratio = width * height / 4000000) > 1) {
                    console.log("大于400万像素")
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;
                //        铺底色  
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制  
                let count;
                if ((count = width * height / 1000000) > 1) {
                    console.log("超过100W像素");
                    count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片  
                    //            计算每块瓦片的宽和高  
                    let nw = ~~(width / count);
                    let nh = ~~(height / count);
                    tCanvas.width = nw;
                    tCanvas.height = nh;
                    for (let i = 0; i < count; i++) {
                        for (let j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0,
                                nw, nh);
                            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    ctx.drawImage(img, 0, 0, width, height);
                }
                //修复ios上传图片的时候 被旋转的问题  
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6: //需要顺时针（向左）90度旋转  
                            this.rotateImg(img, 'left', canvas);
                            break;
                        case 8: //需要逆时针（向右）90度旋转  
                            this.rotateImg(img, 'right', canvas);
                            break;
                        case 3: //需要180度旋转  
                            this.rotateImg(img, 'right', canvas); //转两次  
                            this.rotateImg(img, 'right', canvas);
                            break;
                    }
                }
                //进行最小压缩  
                let ndata = canvas.toDataURL('image/jpeg', 0.1);
                // console.log('压缩前：' + initSize);
                // console.log('压缩前：' + initSize / 1024 / 1024);
                // console.log('压缩后：' + ndata.length);
                // console.log('压缩后：' + ndata.length / 1024 / 1024);
                // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
            },

        }
    }
</script>


<style lang='scss' scoped>
    .title {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.3rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 137, 252, 1);
        margin-top: 0.2rem;
    }

    .tips {
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        font-size: 0.28rem;
        color: rgba(102, 102, 102, 1);
        margin-bottom: 0.2rem;
    }

    .box {
        .show {
            position: relative;
            top: 0;
            left: 0;
            margin: 0 auto;
            width: 5.8rem;
            height: 3.6rem;
            background: rgba(255, 255, 255, 1);
            border-radius: 0.1rem;

            .picture {
                width: 100%;
                height: 100%;
                overflow: hidden;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 100%;
                border-radius: 0.1rem;
            }

            .mask {
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: absolute;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.1);
            }

            .identification {
                border: 2px solid rgba(255, 255, 255, 1);
                height: 0.42rem;
                line-height: 0.42rem;
                border-radius: 0.21rem;
                font-size: 0.24rem;
                width: 2.26rem;
                text-align: center;
                position: absolute;
                top: 0.2rem;
                right: 0.2rem;
                color: rgba(255, 255, 255, 1);
            }


            .delete {
                display: block;
                height: 0.42rem;
                width: 0.42rem;
                background: url('../../assets/img/clear_icon(1).png') no-repeat;
                background-size: 100%;
                border-radius: 0.21rem;
                font-size: 0.24rem;
                position: absolute;
                top: 0.2rem;
                left: 0.2rem;
                color: rgba(255, 255, 255, 1);
            }

            .upload {
                position: absolute;
                left: 2.35rem;
                top: 1.25rem;
                width: 1.1rem;
                height: 1.1rem;
                background: url('../../assets/img/add@2x.png') no-repeat;
                background-size: 100%;
                z-index: 2;

                .hides {
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }
        }
    }

    .waring {
        width: 100%;
        text-align: center;
        font-size: 0.26rem;
        color: rgba(248, 72, 89, 1);
    }

    .btn_box {
        width: 100%;

        .btn {
            display: block;
            width: 5.8rem;
            line-height: 0.94rem;
            background: rgba(220, 220, 220, 1);
            border-radius: 0.26rem;
            margin: 0.36rem auto;
            font-size: 0.36rem;
            font-family: PingFangSC-Regular;
            color: rgba(255, 255, 255, 1);
        }

        .green {
            background: linear-gradient(90deg, rgba(0, 137, 252, 1), rgba(1, 163, 246, 1));
        }
    }
</style>