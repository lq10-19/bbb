<template>
  <div class="bigBox">
    <form name="form1" id="form1">
      <div class="cadIdBox">
        <div class="subTitle">
          <p class="fl">银行卡照片</p>
          <!-- <span class="person_worn">上传的银行卡照片信息与填写的银行卡信息要保持一致</span> -->
          <p class="demoClick fr" @click="goDemo0">查看示例图</p>
        </div>
        <!-- 银行卡正面 -->
        <div class="content">
          <div v-if="!photoThreeImage">
            <img class="banckFrontImg_2" src="../../assets/img/sfz/jia.png" alt />
            <div class="cardId">
              <p class="imgName">银行卡正面照片</p>
              <p class="upload upload_2">
                <span>点击上传</span>
                <input
                  class="change"
                  name="cardId_2"
                  id="fileBtn"
                  type="file"
                  accept="image/*"
                  @change="upload($event,'photoThree')"
                />
              </p>
            </div>
          </div>
          <div v-if="photoThreeImage" class="mask">
            <img :src="photoThreeImage" alt />
            <!-- <div class="identification">仅供本次业务使用</div> -->
            <i class="delete" @click="deeImg('photoThreeImage')"></i>
            <p class="imgName2">银行卡正面照片</p>
          </div>
        </div>
        <!-- 银行卡反面 -->
        <div class="content">
          <div v-if="!photoFourImage">
            <img class="banckFrontImg_2" src="../../assets/img/sfz/jia.png" alt />
            <div class="cardId">
              <h1>注：银行卡反面必须签名</h1>
              <p class="imgName">银行卡反面照片</p>
              <p class="upload upload_2">
                <span>点击上传</span>
                <input
                  class="change"
                  name="cardId_2"
                  id="fileBtn"
                  type="file"
                  accept="image/*"
                  @change="upload($event,'photoFour')"
                />
              </p>
            </div>
          </div>
          <!-- <div
            v-if="photoFourImage"
            class="mask"
            :style="'backgroundImage:url('+photoFourImage+')'"
          >-->
          <div v-if="photoFourImage" class="mask">
            <img :src="photoFourImage" alt />
            <!-- <div class="identification">仅供本次业务使用</div> -->
            <i class="delete" @click="deeImg('photoFourImage')"></i>
            <h1>注：银行卡反面必须签名</h1>
            <p class="imgName2">银行卡反面照片</p>
          </div>
        </div>
      </div>
      <!-- 手持银行卡 -->
      <div class="cadIdBox">
        <div class="subTitle">
          <p class="fl">申请人手持身份证和银行卡照片</p>
          <p class="demoClick demoClick_1 fr" @click="goDemo2">查看示例图</p>
        </div>
        <div class="content closeUp">
          <div v-if="!photoSixImage">
            <img class="applyCard" src="../../assets/img/sfz/jia.png" alt />
            <div class="cardId">
              <p class="imgName">申请人手持身份证和银行卡照片</p>
              <p class="upload upload_3">
                <span>点击上传</span>
                <input
                  class="change"
                  name="cardId_3"
                  id="fileBtn"
                  type="file"
                  accept="image/*"
                  @change="upload($event,'photoSix')"
                />
              </p>
            </div>
          </div>
          <!-- <div v-if="photoSixImage" class="mask" :style="'backgroundImage:url('+photoSixImage+')'"> -->
          <div v-if="photoSixImage" class="mask">
            <img :src="photoSixImage" alt />
            <!-- <div class="identification">仅供本次业务使用</div> -->
            <i class="delete" @click="deeImg('photoSixImage')"></i>
            <p class="imgName2">申请人手持身份证和银行卡照片</p>
          </div>
        </div>
      </div>
    </form>
    <div class="myButton">
      <button @click="next">下一步</button>
    </div>
    <!-- //正在加载遮罩层 -->
    <div class="Mask" v-if="showLoading">
      <van-loading size="36px" text-size="18px" vertical color="#fff">加载中...</van-loading>
    </div>
  </div>
</template>
<script>
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet
} from "../../public/uilt.js";
import Exif from "exif-js";
import { Toast } from "mint-ui";
import { log, debug } from "util";
export default {
  data() {
    return {
      uploadImgFalg: false, //判断上传接口是否成功
      h5: true,
      dataMsg: {}, //客户信息
      photoThreeFile: null,
      photoFourFile: null,
      photoSixFile: null,
      photoThreeImage: "",
      photoFourImage: "",
      photoSixImage: "",
      deleteCCS001: 2, //0:上传 1:逻辑删除再上传 2:不做操作
      deleteCCS002: 2,
      deleteCCS003: 2,
      param: {},
      headerImageUrl: null,
      portraitImageUrl: null,
      orderNo: null,
      nonce: null,
      appId: this.$baseInfo.VUE_APP_API_APPID,
      secret: this.$baseInfo.VUE_APP_API_SECRET,
      isShow: false,
      href: null,
      showLoading: false,
      needLive: false, //活体检测开关
      url: this.$baseInfo.VUE_APP_Ccscallback_URL
    };
  },
  created() {
    //继续申请跳转
    if (this.$route.query.h5) {
      this.h5 = false;
    }
    //传参serialNo、customerId
    if (this.$route.query) {
      this.param = this.$route.query;
    }
    //通过合同号查询客户信息
    this.queryBySerialNo();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "上传附件";
    this.orderNo = randomWord(false, 32);
    this.nonce = randomWord(false, 32);
  },
  methods: {
    //通过合同号查询客户信息
    queryBySerialNo() {
      let url = "businessContractInfoCtr/queryBySerialNo";
      let param = {
        serialNo: this.param.serialNo
      };
      this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            this.customerName = res.data.customerName;
            this.customerCertId = res.data.customerCertId;
            if (this.h5) {
              //查询银行卡ocr信息(银行卡正面)
              //this.queryBankCardOcrResultLog()
              //获取附件信息H5(3张图片)
              this.queryTypeDoc("CCS001")
                .then(res => {
                  return this.queryTypeDoc("CCS002");
                })
                .then(res => {
                  return this.queryTypeDoc("CCS003");
                });
            } else {
              //获取附件信息PC(3张图片)
              this.queryPcBankImg("CCS001")
                .then(res => {
                  return this.queryPcBankImg("CCS002");
                })
                .then(res => {
                  return this.queryPcBankImg("CCS003");
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //查询银行卡ocr信息
    // queryBankCardOcrResultLog() {
    //   let url = `ocrController/queryBankCardOcrResultLog?certId=${this.customerCertId}&contractNo=${this.param.serialNo}&customerName=${this.customerName}`;
    //   return this.$requestCl
    //     .get(url)
    //     .then(res => {
    //       if (res.data) {
    //         const temp = "data:image/jpeg;base64," + res.data.fileBase64;
    //         this.photoThreeImage = temp;
    //         //console.log(this.photoThreeImage);
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    //获取附件信息(H5进件)
    queryTypeDoc(doctype) {
      let url = `docAttachmentCtr/queryTypeDoc`;
      let param = {
        docType: doctype,
        serialNo: this.param.serialNo
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data && res.code == "200") {
            let temp = res.data[0].docHttpUrl;
            if (doctype == "CCS001") {
              this.photoThreeImage = temp;
            } else if (doctype == "CCS002") {
              this.photoFourImage = temp;
            } else if (doctype == "CCS003") {
              this.photoSixImage = temp;
            }
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //获取附件信息(pc进件)
    queryPcBankImg(doctype) {
      let url = `docAttachmentCtr/queryPcBankImg`;
      let param = {
        docType: doctype,
        serialNo: this.param.serialNo
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data && res.code == "200") {
            let temp = "data:image/jpeg;base64," + res.data.fileBase64;
            if (doctype == "CCS001") {
              this.photoThreeImage = temp;
            } else if (doctype == "CCS002") {
              this.photoFourImage = temp;
            } else if (doctype == "CCS003") {
              this.photoSixImage = temp;
            }
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //删除
    deeImg(res) {
      if (res == "photoThreeImage") {
        this.photoThreeFile = null;
        this.photoThreeImage = "";
        this.deleteCCS001 = 1;
      } else if (res == "photoFourImage") {
        this.photoFourFile = null;
        this.photoFourImage = "";
        this.deleteCCS002 = 1;
      } else if (res == "photoSixImage") {
        this.photoSixFile = null;
        this.photoSixImage = "";
        this.deleteCCS003 = 1;
      }
    },
    //附件上传
    uploadImg(name, file, fileType, deleteCCS) {
      //console.log(file);
      this.showLoading = true;
      let url = "docAttachmentCtr/uploadImg";
      let param = {
        customerName: this.customerName,
        serialNo: this.param.serialNo, //合同号
        docName: name, //附件名称
        docType: fileType, //附件类型
        imgStr: file,
        fileType: "file",
        changeFileType: deleteCCS
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            this.showLoading = false;
            console.log("上传成功");
            this.uploadImgFalg = true;
          } else {
            this.showLoading = false;
            Toast(`${res.msg}`);
            this.uploadImgFalg = false;
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log(error);
          this.uploadImgFalg = false;
        });
    },
    upload(e, res) {
      this.type = res;
      console.log("图：", e.srcElement.value);
      if (
        e.srcElement.files[0].type == "image/jpeg" ||
        e.srcElement.files[0].type == "image/png"
      ) {
        if (e.srcElement.files[0].size < 102400) {
          Toast("请上传大于100k的照片");
          e.srcElement.value = "";
        } else {
          let files = e.target.files || e.dataTransfer.files;
          if (!files.length) return;
          this.picValue = files[0];
          this.imgPreview(this.picValue);
          if (this.type == "photoThree") {
            this.photoThreeFile = this.picValue;
          } else if (this.type == "photoFour") {
            this.photoFourFile = this.picValue;
          } else if (this.type == "photoSix") {
            this.photoSixFile = this.picValue;
          }
        }
      } else {
        Toast("请上传jpg或png格式的照片");
        e.srcElement.value = "";
      }
    },
    imgPreview(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            if (self.type == "photoThree") {
              self.photoThreeImage = this.result;
              if (self.h5) {
                self.deleteCCS001 = 1;
              }
              self.uploadImg(
                "bankcardzheng",
                self.photoThreeImage,
                "CCS001",
                self.deleteCCS001
              );
            } else if (self.type == "photoFour") {
              self.photoFourImage = this.result;
              if (self.h5) {
                self.deleteCCS002 = 1;
              }
              self.uploadImg(
                "bankcardfan",
                self.photoFourImage,
                "CCS002",
                self.deleteCCS002
              );
            } else if (self.type == "photoSix") {
              self.photoSixImage = this.result;
              if (self.h5) {
                self.deleteCCS003 = 1;
              }
              self.uploadImg(
                "handheldbankcard",
                self.photoSixImage,
                "CCS003",
                self.deleteCCS003
              );
            }
          } else {
            img.onload = () => {
              let data = self.compress(img, Orientation);
              if (self.type == "photoThree") {
                self.photoThreeImage = data;
                if (self.h5) {
                  self.deleteCCS001 = 1;
                }
                self.uploadImg(
                  "bankcardzheng",
                  self.photoThreeImage,
                  "CCS001",
                  self.deleteCCS001
                );
              } else if (self.type == "photoFour") {
                self.photoFourImage = data;
                if (self.h5) {
                  self.deleteCCS002 = 1;
                }
                self.uploadImg(
                  "bankcardfan",
                  self.photoFourImage,
                  "CCS002",
                  self.deleteCCS002
                );
              } else if (self.type == "photoSix") {
                self.photoSixImage = data;
                if (self.h5) {
                  self.deleteCCS003 = 1;
                }
                self.uploadImg(
                  "handheldbankcard",
                  self.photoSixImage,
                  "CCS003",
                  self.deleteCCS003
                );
              }
            };
          }
        };
      }
    },
    convertBase64UrlToBlob(urlData) {
      var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {
        type: "image/png"
      });
    },

    //转换为file
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
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
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
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
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
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
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
      );

      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      //console.log(ndata);
      return ndata;
    },
    //示例
    goDemo0() {
      this.$router.push({ path: "/photoDemo0" });
    },
    goDemo1() {
      this.$router.push({ path: "/photoDemo1" });
    },
    goDemo2() {
      this.$router.push({ path: "/photoDemo2" });
    },
    //下一步
    next() {
      if (!this.photoThreeImage) {
        Toast("请上传银行卡正面照片");
      } else if (!this.photoFourImage) {
        Toast("请上传银行卡反面照片");
      } else if (!this.photoSixImage) {
        Toast("请上传手持身份证照片");
      } else {
        // if (this.h5) {
        //   this.deleteCCS001 = 1;
        //   this.deleteCCS002 = 1;
        //   this.deleteCCS003 = 1;
        // }
        // this.uploadImg(
        //   "bankcardzheng",
        //   this.photoThreeImage,
        //   "CCS001",
        //   this.deleteCCS001
        // )
        //   .then(res => {
        //     if (this.uploadImgFalg) {
        //       return this.uploadImg(
        //         "bankcardfan",
        //         this.photoFourImage,
        //         "CCS002",
        //         this.deleteCCS002
        //       );
        //     } else {
        //       Toast("附件上传失败，请重新上传");
        //     }
        //   })
        //   .then(res => {
        //     if (this.uploadImgFalg) {
        //       return this.uploadImg(
        //         "handheldbankcard",
        //         this.photoSixImage,
        //         "CCS003",
        //         this.deleteCCS003
        //       );
        //     } else {
        //       Toast("附件上传失败，请重新上传");
        //     }
        //   })
        //   .then(res => {
        //     if (this.uploadImgFalg) {
        //       this.confirm();
        //     }
        //   });
        this.confirm();
      }
    },
    async confirm() {
      this.showLoading = true;
      try {
        //生成合同文件
        let a = await this.generateContractList();
        console.log(999, a);
        if (!a) {
          return;
        }
        //测试用
        if (this.needLive) {
          console.log("进入活体检测");
          const resp = await this.livingBody();
          storeSet(this.orderNo, "livingBodyOrderNo");
          this.jump(resp);
        } else {
          console.log("活体检测关闭");
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    //生成合同文件
    async generateContractList() {
      try {
        let url = "template/contractPrint/generateContractList";
        let param = {
          serialNo: this.param.serialNo, //合同号
          fileType: "CONTRACT"
        };
        return this.$requestCl2
          .post(url, param)
          .then(res => {
            if (res.code == 200) {
              this.$router.push({
                path: "/confirmSubmit",
                query: {
                  //测试用 正式关
                  code: 0,
                  customerId: this.param.customerId,
                  serialNo: this.param.serialNo
                }
              });
              return true;
            } else {
              this.showLoading = false;
              Toast(`${res.msg}`);
              return false;
            }
          })
          .catch(error => {
            this.showLoading = false;
            console.log(error);
            return false;
          });
      } catch (error) {
        this.showLoading = false;
        console.log(error, 111);
        return false;
      } finally {
        console.log(222);
      }
    },
    //活体识别数据
    async livingBody() {
      // const returnUrl = window.location.href.replace(
      //   "bankCardPhoto",
      //   "confirmSubmit"
      // );
      const returnUrl = `${this.url}confirmSubmit`;
      //console.log(returnUrl, 11);
      //let returnUrl = null;
      //returnUrl = "http://10.80.12.58:8080/#/confirmSubmit";
      const params = {
        //appId: this.appId, //腾讯云线下对接分配的 AppId
        //secret: this.secret, //腾讯云线下对接分配的 AppId的密钥
        orderNo: this.orderNo, //随机数订单号
        name: this.customerName, //客户证件姓名
        idNo: this.customerCertId, //客户证件号码
        userId: 1234, //用户id
        version: "1.0.0", //版本号
        nonceStr: this.nonce, //随机的32位字符串
        resultType: "0", // 是否显示结果页面 0显示
        from: "browser", // 表示在哪里启动刷脸
        sourcePhotoStr: "", // 比对源照片非必填
        sourcePhotoType: "1", //** 比对源照片类型 */
        url: `${returnUrl}?customerId=${this.param.customerId}&serialNo=${this.param.serialNo}`
      };
      //https://bqyx.bqzulin.com/bqyx/cdd/ocr/h5LiveDetection(车抵贷)
      return this.$requestCl
        .post("ocrController/h5LiveDetection", params)
        .then(res => {
          if (res.code != "200") {
            Toast("发起活体检测失败");
            return Promise.reject();
          }
          console.log(res);
          return Promise.resolve(res);
        });
    },
    //跳转第三方活体检测页面
    jump(resp) {
      console.log(resp);
      const url = resp.data.redirectUrl + "&t=" + Date.now();
      window.location.href = url;
    }
  },

  beforeDestroy() {},
  components: {}
};
</script>
<style lang='scss' scoped>
.bigBox {
  margin-top: 0rem;
  box-sizing: border-box;
  width: 100%;
  // height: 100%;
  background: #f2f3f5;
  padding-bottom: 0.3rem;
  .title {
    width: 100%;
    height: 0.8rem;
    background: #f4f8fc;
    text-align: center;
    font-size: 0.3rem;
    color: #333;
    padding-top: 0.2rem;
    box-sizing: border-box;
  }
  .cadIdBox {
    background: #fff;
    .subTitle {
      background: #f2f3f5;
      font-size: 0.3rem;
      color: #888;
      padding: 0 0.32rem;
      height: 0.94rem;
      box-sizing: border-box;
      padding-top: 0.4rem;
    }
    .content {
      display: inline-block;
      position: relative;
      width: 50%;
      background: #fff;
      height: 4rem;
      margin: 0 auto;
      border-radius: 0.12rem;
      box-sizing: border-box;
      //padding: 0.1rem;
      img {
        margin: 0.4rem auto;
        box-sizing: border-box;
        border: none;
        width: 2.6rem;
        height: 1.7rem;
        max-width: 100%;
        max-height: 100%;
        border: 1px solid rgba(51, 84, 223, 1);
        border-radius: 0.12rem;
      }
      .cardId {
        position: absolute;
        width: 100%;
        height: 2.8rem;
        top: 1.4rem;
        right: 0;
        h1 {
          position: absolute;
          color: #f53d3d;
          font-size: 0.22rem;
          line-height: 0.5rem;
          text-align: center;
          top: 1rem;
          width: 100%;
        }
        p:nth-of-type(1) {
          position: absolute;
          top: 1.5rem;
          width: 100%;
          font-size: 0.3rem;
          line-height: 0.5rem;
          text-align: center;
          color: #000;
          font-weight: 400;
        }
        p:nth-of-type(2) {
          width: 100%;
          font-size: 0.3rem;
          line-height: 0.5rem;
          text-align: center;
          color: #3354df;
        }
      }
      .mask {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.1);
        background: no-repeat;
        background-size: 100%;
      }
      // .identification {
      //   border: 2px solid rgba(255, 255, 255, 1);
      //   height: 0.4rem;
      //   line-height: 0.4rem;
      //   border-radius: 0.21rem;
      //   font-size: 0.24rem;
      //   width: 2.26rem;
      //   text-align: center;
      //   position: absolute;
      //   top: 0.6rem;
      //   right: 0.7rem;
      //   color: rgba(255, 255, 255, 1);
      // }
      .delete {
        display: block;
        height: 0.4rem;
        width: 0.4rem;
        background: url("../../assets/img/clear_icon(1).png") no-repeat;
        background-size: 100%;
        border-radius: 0.21rem;
        font-size: 0.24rem;
        position: absolute;
        top: 0.55rem;
        left: 0.7rem;
        color: rgba(255, 255, 255, 1);
      }
      .imgName2 {
        position: absolute;
        top: 2.9rem;
        width: 100%;
        font-size: 0.3rem;
        line-height: 0.5rem;
        text-align: center;
        color: #000;
        font-weight: 400;
      }
      h1 {
        position: absolute;
        color: #f53d3d;
        font-size: 0.22rem;
        line-height: 0.5rem;
        text-align: center;
        top: 2.4rem;
        width: 100%;
      }
    }
    .closeUp {
      margin-left: 1.5rem;
      width: 60%;
      .delete {
        left: 1.1rem;
      }
    }
  }
  .reverseSide2 {
    margin-top: 0.3rem;
  }
  .example {
    margin-top: 0.3rem;
    width: 100%;
    height: 4.5rem;
    background: #f4f8fc;
    p {
      color: #3354df;
      font-size: 0.28rem;
      margin-left: 0.61rem;
      box-sizing: border-box;
      padding-top: 0.3rem;
    }
    p:nth-of-type(2) {
      text-align: center;
      margin-top: 0rem;
      margin-left: 0;
    }
    img {
      width: 3.5rem;
      height: 2.19rem;
      //background: url("../images/demoImg1.png") no-repeat center/100%;
      margin: 0.3rem auto 0 auto;
    }
  }
}

.person_worn {
  font-size: 0.22rem !important;
  color: #3354df !important;
  float: left;
  margin-top: 0.09rem;
  margin-left: 0.05rem; // height: 1rem;
  // line-height: 1rem;
}

.banckImg_1 {
  position: absolute;
  top: 0rem;
  left: 0.1rem;
}

.demoClick {
  width: 2rem;
  text-align: right;
  color: #3354df;
  font-weight: 700;
}

//正在加载遮罩层
.loading {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  div {
    width: 0.64rem;
    height: 0.64rem;
    //background: url("../images/loading.gif") no-repeat center/100%;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    opacity: 0.6;
  }
}

.myButton {
  width: 100%;
  margin: 0.8rem auto;
  p {
    text-align: center;
  }
  a {
    width: 6.9rem;
    border-radius: 0.1rem;
  }
}

.weui-btn_primary {
  margin-top: 0.2rem;
  font-size: 0.3rem;
  color: #fff;
  background: #3354df;
  border-radius: 0;
  height: 0.8rem !important;
  line-height: 0.8rem;
  :active {
    background: #1c5488 !important;
  }
}

.weui-btn_primary:active {
  background: #3354df !important;
}

//input上传文件样式合为一体
.upload {
  position: relative;
  span {
    font-weight: 700;
  }
}

.change {
  position: absolute;
  overflow: hidden;
  right: 50%;
  transform: translateX(50%);
  top: -0.8rem;
  opacity: 0;
  width: 100%;
  height: 1.7rem;
  background: #333;
}

img {
  // border-style:none !important;
  // border-width:0 !important;
  // border:0;
  border-color: red;
}
button {
  display: block;
  width: 6.2rem;
  height: 0.9rem;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  font-size: 0.3rem;
  color: #fff;
  margin: 1rem auto;
  text-align: center;
  line-height: 0.9rem;
}
.Mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-top: 80%;
  background: rgba(0, 0, 0, 0.3);
  /deep/ .van-loading__text {
    color: #fff;
  }
}
</style>
