<template>
  <div class="bigBox">
    <form name="form1" id="form1">
      <div class="cadIdBox">
        <div class="subTitle">
          <p>身份证照片</p>
        </div>
        <!-- 1   -->
        <div class="content">
          <div v-if="!photoOneImage">
            <img class="cardFrontImg_1" src="../../assets/img/sfz/idCard_zhen@2x.png" alt />
            <div class="cardId upClick" id="upClick">
              <p class="imgName">身份证正面照片</p>
              <p class="upload upload_1">
                <span>点击上传</span>
                <input
                  class="change"
                  name="cardId_1"
                  id="fileBtn"
                  type="file"
                  accept="image/*"
                  @change="upload($event,'photoOne')"
                />
              </p>
            </div>
          </div>
          <div v-if="photoOneImage" class="mask" :style="'backgroundImage:url('+photoOneImage+')'">
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deeImg('photoOneImage')"></i>
          </div>
        </div>
        <!-- 2   -->
        <div class="content">
          <div v-if="!photoTwoImage">
            <img class="cardFrontImg_1" src="../../assets/img/sfz/idCard_fan@2x.png" alt />
            <div class="cardId upClick" id="upClick">
              <p class="imgName">身份证反面照片</p>
              <p class="upload upload_1">
                <span>点击上传</span>
                <input
                  class="change"
                  name="cardId_1"
                  id="fileBtn"
                  type="file"
                  accept="image/*"
                  @change="upload($event,'photoTwo')"
                />
              </p>
            </div>
          </div>
          <div v-if="photoTwoImage" class="mask" :style="'backgroundImage:url('+photoTwoImage+')'">
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deeImg('photoTwoImage')"></i>
          </div>
        </div>
      </div>

      <div class="cadIdBox">
        <div class="subTitle">
          <p class="fl">银行卡照片</p>
          <!-- <span class="person_worn">上传的银行卡照片信息与填写的银行卡信息要保持一致</span> -->
          <p class="demoClick fr" @click="goDemo0">查看示例图</p>
        </div>

        <!-- 3   -->
        <div class="content">
          <div v-if="!photoThreeImage">
            <img class="banckFrontImg_2" src="../../assets/img/sfz/bandCard_zhen@2x.png" alt />
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
          <div
            v-if="photoThreeImage"
            class="mask"
            :style="'backgroundImage:url('+photoThreeImage+')'"
          >
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deeImg('photoThreeImage')"></i>
          </div>
        </div>
        <!-- 4   -->
        <div class="content">
          <div v-if="!photoFourImage">
            <img class="banckFrontImg_2" src="../../assets/img/sfz/bankCard_fan@2x.png" alt />
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
          <div
            v-if="photoFourImage"
            class="mask"
            :style="'backgroundImage:url('+photoFourImage+')'"
          >
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deeImg('photoFourImage')"></i>
          </div>
        </div>
      </div>

      <!-- <div class="applyImg">
        <div class="subTitle">
          <p class="fl">申请人近照</p>
          <p class="demoClick fr" @click="goDemo1">查看示例图</p>
        </div>
        <div class="content closeUp">
          <div v-if="!photoFiveImage">
            <img class="cardFrontImg_3" src="../../assets/img/sfz/shenQingrenjinzhao@2x.png" alt>
            <div class="cardId">
              <p class="imgName">申请人近照</p>
              <p class="upload upload_3">
                <span>点击上传</span>
                <input
                  class="change"
                  name="cardId_3"
                  id="fileBtn"
                  type="file"
                  accept="image/*"
                  @change="upload($event,'photoFive')"
                >
              </p>
            </div>
          </div>
          <div
            v-if="photoFiveImage"
            class="mask"
            :style="'backgroundImage:url('+photoFiveImage+')'"
          >
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deeImg('photoFiveImage')"></i>
          </div>
        </div>
      </div>-->
      <div class="applyImg_2">
        <div class="subTitle">
          <p class="fl">申请人手持身份证和银行卡照片</p>
          <p class="demoClick demoClick_1 fr" @click="goDemo2">查看示例图</p>
        </div>
        <div class="content closeUp">
          <div v-if="!photoSixImage">
            <img class="applyCard" src="../../assets/img/sfz/shenQingrenshouchijinzhao@2x.png" alt />
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
          <div v-if="photoSixImage" class="mask" :style="'backgroundImage:url('+photoSixImage+')'">
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deeImg('photoSixImage')"></i>
          </div>
        </div>
      </div>
    </form>
    <div class="myButton">
      <!-- <p>车主易融会保护您的信息安全</p> -->
      <button @click="next">下一步</button>
    </div>
    <!-- //正在加载遮罩层 -->
    <div class="loading hide">
      <div></div>
    </div>
  </div>
</template>
<script>
import Exif from "exif-js";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      dataMsg: {}, //客户信息
      photoOneFile: null,
      photoTwoFile: null,
      photoThreeFile: null,
      photoFourFile: null,
      photoSixFile: null,
      photoOneImage: "",
      photoTwoImage: "",
      photoThreeImage: "",
      photoFourImage: "",
      //photoFiveImage: "",
      photoSixImage: "",
      param: {}
    };
  },
  created() {
    this.param = this.$route.query;
    //获取合同信息
    this.getContractInfo();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "附件上传";
  },
  methods: {
    //获取合同信息
    getContractInfo() {
      let url = "cashloan/getContractInfo";
      this.$request2
        .post(url, this.param)
        .then(res => {
          this.dataMsg = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 删除
    deeImg(res) {
      if (res == "photoOneImage") {
        this.photoOneFile = null;
        this.photoOneImage = "";
        // this.$refs.referenceUploadp.value = null;
      } else if (res == "photoTwoImage") {
        this.photoTwoFile = null;
        this.photoTwoImage = "";
      } else if (res == "photoThreeImage") {
        this.photoThreeFile = null;
        this.photoThreeImage = "";
      } else if (res == "photoFourImage") {
        this.photoFourFile = null;
        this.photoFourImage = "";
      } else if (res == "photoSixImage") {
        this.photoSixFile = null;
        this.photoSixImage = "";
      }
    },
    //附件上传
    uploadImg(name, file, fileType) {
      let formdata = new FormData();
      formdata.append(name, file);
      // formdata.append("type", fileType);
      // formdata.append("applyId", this.param.serialno);
      // formdata.append("cid", this.dataMsg.certid);
      // formdata.append("cname", this.dataMsg.customername);
      // formdata.append("customerid", this.param.customerid);
      return this.$request2({
        method: "post",
        url: "contract/uploadImg",
        //url: "http://10.80.12.33:8765/contract/uploadImg",
        data: formdata,
        params: {
          type: fileType, //附件类型
          applyId: this.param.serialno, //合同号
          cid: this.dataMsg.certid, //身份证ID
          cname: this.dataMsg.customername, //客户名称
          //isMust: "", //是否必传
          customerid: this.param.customerid //客户id
        },
        config: { headers: { "Content-Type": "multipart/form-data" } }
      })
        .then(function(response) {
          //handle success
          console.log(response);
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
      // let url = "contract/uploadImg";
      // let param = {
      //   type: fileType, //附件类型
      //   applyId: this.param.serialno, //合同号
      //   cid: this.dataMsg.certid, //身份证ID
      //   cname: this.dataMsg.customername, //客户名称
      //   customerid: this.param.customerid, //客户id
      // };
      // this.$request2
      //   .post(url, param)
      //   .then(res => {
      //     console.log(res, 905);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
    upload(e, res) {
      this.type = res;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      if (this.type == "photoOne") {
        this.photoOneFile = this.picValue;
        //console.log(this.photoOneFile);
      } else if (this.type == "photoTwo") {
        this.photoTwoFile = this.picValue;
        //console.log(this.photoTwoFile);
      } else if (this.type == "photoThree") {
        this.photoThreeFile = this.picValue;
      } else if (this.type == "photoFour") {
        this.photoFourFile = this.picValue;
      } else if (this.type == "photoSix") {
        this.photoSixFile = this.picValue;
      }
      //console.log(this.picValue);
      //console.log(this.photoOneImage);
      //上传单张
      //this.uploadImg();
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
            if (self.type == "photoOne") {
              self.photoOneImage = this.result;
            } else if (self.type == "photoTwo") {
              self.photoTwoImage = this.result;
            } else if (self.type == "photoThree") {
              self.photoThreeImage = this.result;
            } else if (self.type == "photoFour") {
              self.photoFourImage = this.result;
            } else if (self.type == "photoSix") {
              self.photoSixImage = this.result;
            }
          } else {
            img.onload = () => {
              let data = self.compress(img, Orientation);
              if (self.type == "photoOne") {
                self.photoOneImage = data;
              } else if (self.type == "photoTwo") {
                self.photoTwoImage = data;
              } else if (self.type == "photoThree") {
                self.photoThreeImage = data;
              } else if (self.type == "photoFour") {
                self.photoFourImage = data;
              } else if (self.type == "photoSix") {
                self.photoSixImage = data;
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
      //        铺底色
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
      if (!this.photoOneImage) {
        Toast("请上传身份证正面照片");
      } else if (!this.photoTwoImage) {
        Toast("请上传身份证反面照片");
      } else if (!this.photoThreeImage) {
        Toast("请上传银行卡正面照片");
      } else if (!this.photoFourImage) {
        Toast("请上传银行卡反面照片");
      } else if (!this.photoSixImage) {
        Toast("请上传手持身份证照片");
      } else {
        let promise1 = this.uploadImg("idcard1", this.photoOneFile, "A0019");
        // let promise2 = this.uploadImg("idcard2", this.photoTwoFile, "A0020");
        // let promise3 = this.uploadImg("bankcard1", this.photoThreeFile, "BLH001");
        // let promise4 = this.uploadImg("bankcard2", this.photoFourFile, "BLH002");
        // let promise5 = this.uploadImg("selfphoto", this.photoSixFile, "A0025");
        promise1
          .then(() => {
            return this.uploadImg("idcard2", this.photoTwoFile, "A0020");
          })
          .then(() => {
            return this.uploadImg("bankcard1", this.photoThreeFile, "BLH001");
          })
          .then(() => {
            return this.uploadImg("bankcard2", this.photoFourFile, "BLH002");
          })
          .then(() => {
            return this.uploadImg("selfphoto", this.photoSixFile, "A0025");
          })
          .then(() => {
            this.$router.push({ path: "/submit", query: this.param });
          });
        // Promise.all([promise1]).then(values => {
        //   this.$router.push({ path: "/submit", query: this.param });
        // });
      }
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
  background: #fff;
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
  .subTitle {
    background: #fff;
    font-size: 0.3rem;
    color: #333;
    padding: 0 0.32rem;
    height: 0.94rem;
    box-sizing: border-box;
    padding-top: 0.4rem;
  }
  .content {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    width: 6.86rem;
    height: 4rem;
    border: 1px dashed #fc6e51;
    margin: 0 auto;
    border-radius: 0.12rem;
    box-sizing: border-box;
    padding: 0.1rem;
    margin-top: 0.1rem;
    img {
      margin: 0 auto;
      box-sizing: border-box;
      border: none;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
    .cardId {
      position: absolute;
      width: 100%;
      height: 1rem;
      top: 1.51rem;
      right: 0;
      h1 {
        position: absolute;
        color: #fc6e51;
        font-size: 0.3rem;
        line-height: 0.5rem;
        text-align: center;
        top: -0.5rem;
        width: 100%;
      }
      p {
        font-size: 0.3rem;
        line-height: 0.5rem;
        text-align: center;
        color: #333;
      }
      p:nth-of-type(2) {
        color: #fc6e51;
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
      background: url("../../assets/img/clear_icon(1).png") no-repeat;
      background-size: 100%;
      border-radius: 0.21rem;
      font-size: 0.24rem;
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      color: rgba(255, 255, 255, 1);
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
      color: #fc6e51;
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
  color: #e64340 !important;
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
  color: #ff7f36;
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
  margin-top: 0.8rem;
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
  background: #ff7f36;
  border-radius: 0;
  height: 0.8rem !important;
  line-height: 0.8rem;
  :active {
    background: #88421c !important;
  }
}

.weui-btn_primary:active {
  background: #c9622a !important;
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
  top: -1.9rem;
  opacity: 0;
  width: 6.6rem;
  height: 3.8rem;
}

img {
  // border-style:none !important;
  // border-width:0 !important;
  // border:0;
  border-color: red;
}
button {
  display: block;
  width: 90%;
  height: 0.8rem;
  background-color: #ff7f36;
  font-size: 0.3rem;
  color: #fff;
  margin: 1rem auto;
  text-align: center;
  line-height: 0.8rem;
  border-radius: 0.08rem;
}
</style>