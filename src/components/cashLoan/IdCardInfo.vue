<template>
  <div class="addID">
    <p class="tip">请核对自动识别结果，如有误请更正</p>
    <div class="bigBox">
      <div class="box">
        <div class="photo">
          <img :src="headerImageUrl" />
          <!-- <van-icon name="scan" class="icon" size="0.4rem" /> -->
          <div class="again" @click="againAddIdCard">
            <van-icon name="photograph" size="0.5rem" class="icon" color="#2951E7" />
            <span>重拍</span>
          </div>
        </div>
        <div class="information">
          <van-cell-group class="van-cell-group">
            <van-field v-model.trim="form.name" label="姓名" placeholder="请输入姓名" class="van-field" />
            <van-field
              v-model="form.idCard"
              label="身份证号"
              placeholder="请输入身份证号"
              class="van-field"
              @input="inputIdCard"
            />
            <van-field v-model="form.nation" label="民族" placeholder="请输入民族" class="van-field" />
            <van-field
              v-model.trim="form.cardAddress"
              label="住址"
              placeholder="请输入住址"
              class="van-field"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="box">
        <div class="photo">
          <img :src="portraitImageUrl" />
          <!-- <van-icon name="scan" class="icon" size="0.4rem" /> -->
          <div class="again" @click="againAddIdCard">
            <van-icon name="photograph" size="0.5rem" class="icon" color="#2951E7" />
            <span>重拍</span>
          </div>
        </div>
        <div class="information">
          <van-cell-group class="van-cell-group">
            <van-field
              v-model.trim="form.issueOffice"
              label="签发机关"
              placeholder="请输入签发机关"
              class="van-field"
            />
            <van-field v-model="form.validDate" label="有效期" placeholder="请输入有效期" class="van-field" />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div class="btn_box">
      <button class="btn" @click="submit">确定</button>
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
import store from "store";
import { Toast, Dialog, Icon } from "vant";
export default {
  data() {
    return {
      form: {
        age: 0,
        applicationId: "",
        areaId: "",
        areaName: "",
        birthday: "",
        cardAddress: "",
        cardBack: "",
        cardFront: "",
        cell: "",
        cityId: "",
        cityName: "",
        createDate: "",
        customerId: "",
        education: "",
        educationCode: "",
        houseAddress: "",
        houseType: "",
        houseTypeCode: "",
        householdRegister: "",
        idCard: "",
        issueOffice: "",
        marriageStatus: "",
        marriageStatusCode: "",
        mobile: "",
        modifyDate: "",
        name: "",
        nation: "",
        provinceId: "",
        provinceName: "",
        room: "",
        sex: "",
        street: "",
        township: "",
        validDate: "",
        validDateEnd: "",
        validDateStart: ""
      },
      nationList: [], //民族列表
      nationFlag: false,
      showLoading: false,
      headerImageUrl: "http://bqyx-qiniu.bqrzzl.com/idCard_zhen@2x.png",
      portraitImageUrl: "http://bqyx-qiniu.bqrzzl.com/idCard_fan@2x.png",
      mobile: "",
      openid: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const idCardOcr = storeGet("idCardOcr");
      if (idCardOcr) {
        vm.form.id = idCardOcr.id; //ocr保存表id
        vm.form.name = idCardOcr.name;
        vm.form.nation = idCardOcr.nation;
        vm.form.idCard = idCardOcr.idCard;
        vm.form.issueOffice = idCardOcr.authority;
        vm.form.cardAddress = idCardOcr.address;
        vm.form.validDate = idCardOcr.validDate;
        vm.form.validDateStart = idCardOcr.validDate.split("-")[0];
        vm.form.validDateEnd = idCardOcr.validDate.split("-")[1];
        vm.headerImageUrl = idCardOcr.idCardFrontFileUrl;
        vm.portraitImageUrl = idCardOcr.idCardBehindFileUrl;
      }
    });
  },
  created() {
    if (store.get("mobile")) {
      this.mobile = store.get("mobile");
    }
    if (store.get("openid")) {
      this.openid = store.get("openid");
    }
    //获取民族列表
    this.queryCodeLibrary();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
    document.getElementsByTagName("title")[0].textContent = "身份确认";
  },
  methods: {
    //获取民族列表
    queryCodeLibrary() {
      let url = "codeLibrary/queryCodeLibrary";
      this.$requestCl2
        .get(`${url}?codeNo=Nationality`)
        .then(res => {
          if (res.data) {
            res.data.forEach(element => {
              this.nationList.push(element.itemName);
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //重拍
    againAddIdCard() {
      this.$router.push({
        path: "uploadIdCard"
      });
    },
    //确定
    submit() {
      const form = this.form;
      if (!form.name) {
        Toast("请输入姓名");
        return;
      }
      if (!form.idCard) {
        Toast("请输入身份证号");
        return;
      }
      if (!form.nation) {
        Toast("请输入民族");
        return;
      }
      for (let i = 0; i < this.nationList.length; i++) {
        if (this.nationList[i].startsWith(form.nation)) {
          //console.log(this.nationList[i], form.nation);
          this.nationFlag = true;
        }
      }
      if (!this.nationFlag) {
        Toast("请输入正确的民族");
        return;
      }
      if (form.nation == "汉") {
        form.nation = "汉";
      } else if (!form.nation.endsWith("族")) {
        form.nation = form.nation + "族";
      }
      // if (this.nationList.indexOf(form.nation) == -1) {
      //   Toast("请输入正确的民族");
      //   return;
      // }
      if (!form.cardAddress) {
        Toast("请输入住址");
        return;
      }
      if (!form.issueOffice) {
        Toast("请输入签发机关");
        return;
      }
      if (!form.validDate) {
        Toast("请输入有效日期");
        return;
      } else if (form.validDate) {
        let validDateStart = form.validDate.split("-")[0];
        let validDateEnd = form.validDate.split("-")[1];
        let date = new Date();
        let year = date.getFullYear() + "";
        let month = date.getMonth() + 1 + "";
        if (month < 10) {
          month = "0" + month;
        }
        let strDate = date.getDate() + "";
        if (strDate < 10) {
          strDate = "0" + strDate;
        }
        let nowDate = year + month + strDate;
        //console.log(nowDate);
        if (validDateEnd == "长期") {
          if (
            /^[1-9]\d{7}$/.test(validDateStart) &&
            validDateStart <= nowDate
          ) {
            console.log("有效期正常");
          } else {
            Toast("有效期有误，请重新输入或扫描");
            return;
          }
        } else if (!/^[1-9]\d{7}$/.test(validDateEnd)) {
          Toast("有效期有误，请重新输入或扫描");
          return;
        } else if (validDateEnd < nowDate) {
          Toast("身份证已过期，请更换身份证扫描");
          return;
        } else {
          if (
            /^[1-9]\d{7}$/.test(validDateStart) &&
            validDateStart <= nowDate
          ) {
            console.log("有效期正常");
          } else {
            Toast("有效期有误，请重新输入或扫描");
            return;
          }
        }
      }
      Dialog.confirm({
        title: "身份有误会影响授信结果，请确认",
        message: `${this.form.name}\n${this.form.idCard}`,
        confirmButtonText: "确认无误",
        cancelButtonText: "返回修改",
        confirmButtonColor: "#3354DF",
        cancelButtonColor: "#B2B2B2"
      })
        .then(() => {
          //更新客户信息
          this.update();
        })
        .catch(() => {});
    },
    //判断民族
    validationNation() {},
    //监听输入身份证
    inputIdCard() {
      let value = this.form.idCard;
      this.form.idCard = this.form.idCard.toUpperCase();
      if (value.length > 18) {
        this.form.idCard = value.slice(0, 18);
      }
    },
    //更新客户信息
    update() {
      let idCardOcrMsg = storeGet("idCardOcr");
      let url = "userBindingController/saveRedis";
      let param = {
        phone: this.mobile,
        name: this.form.name,
        idCard: this.form.idCard,
        nation: this.form.nation,
        address: this.form.cardAddress,
        authority: this.form.issueOffice,
        validDate: this.form.validDate
      };
      let param1 = Object.assign({}, idCardOcrMsg, param);
      return this.$requestCl
        .post(url, param1)
        .then(res => {
          if (res.code == 200) {
            //跳转绑定身份证
            this.goBindIdCard();
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转绑定身份证
    goBindIdCard() {
      this.$router.push({
        path: "/bindIdCard",
        query: {
          name: this.form.name,
          idCard: this.form.idCard
        }
      });
    }
  }
};
</script>


<style lang='scss' scoped>
.tip {
  width: 100%;
  text-align: center;
  background-color: #f2f3f5;
  color: #888;
  padding: 0.2rem 0;
}
.bigBox {
  //margin-top: 1rem;
  .box {
    display: flex;
    //border-top: 0.01rem solid #333;
    .photo {
      width: 2rem;
      margin-left: 0.03rem;
      img {
        height: 1.2rem;
        width: 100%;
        margin-top: 0.5rem;
        border-radius: 0.1rem;
      }
      .again {
        width: 50%;
        margin: 0;
        position: relative;
        top: -1.05rem;
        left: 0.7rem;
        .icon {
          margin-left: 0.05rem;
        }
        span {
          display: block;
          font-size: 0.3rem;
          color: #2951e7;
        }
      }
    }
    .information {
      .van-cell-group {
        .van-field {
          height: 1.2rem;
          line-height: 1.2rem;
          //border-bottom: 0.01rem solid #333;
        }
      }
    }
  }
}
.btn_box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  .btn {
    display: block;
    width: 5.8rem;
    margin-top: 0.28rem;
    height: 0.9rem;
    background: linear-gradient(
      90deg,
      rgba(95, 127, 228, 1),
      rgba(58, 95, 238, 1)
    );
    box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
    border-radius: 0.44rem;
    font-weight: bold;
    line-height: 0.88rem;
    font-size: 0.36rem;
    color: #fff;
  }
}
</style>