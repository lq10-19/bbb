<template>
  <div class="page">
    <div class="line"></div>
    <van-cell title="手机号" :value="mobile" size="large" class="cell" />
    <div class="line"></div>
    <van-cell
      title="身份证绑定"
      v-if="expire"
      :value="idCardBind?'已绑定':'未绑定'"
      size="large"
      class="cell"
    />
    <van-cell title="身份证绑定" v-if="!expire" value="已过期" size="large" class="cell"/>
    <div class="line"></div>
    <van-cell is-link title="个人信息" @click="goPersonalInformation" size="large" class="cell" />
    <div class="line"></div>
    <button @click="logOut" class="button">退出登录</button>
  </div>
</template>

<script>
import store from "store";
import { Toast } from "vant";
export default {
  data() {
    return {
      mobile: "",
      idCardBind: false, //是否绑定
      expire: false //是否过期
    };
  },
  created() {
    if (store.get("mobile")) {
      this.mobile = store.get("mobile");
    }
    //查询手机号和身份证绑定状态
    this.query();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "设置";
  },
  methods: {
    //查询手机号和身份证绑定状态
    query() {
      let url = "userBindingController/query";
      let param = {
        mobile: this.mobile,
        bindStatus: "88"
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.data) {
            //未绑定
            if (res.data.status == 0) {
              this.idCardBind = false;
              console.log('未绑定')
              //已绑定
            } else if (res.data.status == 1) {
              this.idCardBind = true;
              console.log('已绑定')
              //未过期
              if (res.data.isEndDate == 1) {
                this.expire = true;
                console.log('未过期')
                //已过期
              } else if (res.data.isEndDate == 0) {
                this.expire = false;
                console.log('已过期')
              }
            }
            // if (res.data.isEndDate == 0) {
            //   this.expire = true;
            //   //未过期
            // } else if (res.data.isEndDate == 1) {
            //   this.expire = false;
            //   //已绑定
            //   if (res.data.status == 1) {
            //     this.idCardBind = true;
            //     //未绑定
            //   } else if (res.data.status == 0) {
            //     this.idCardBind = false;
            //   }
            // }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //个人信息
    goPersonalInformation() {
      if (!this.idCardBind) {
        Toast("请先绑定身份证");
        return;
      }
      if (!this.expire) {
        Toast("请重新绑定身份证");
        return;
      }
      this.$router.push({
        path: "/personalInformation",
        query: {
          mobile: this.mobile
        }
      });
    },
    //退出登录
    logOut() {
      let url = "userBindingController/isLog";
      let param = {
        mobile: this.mobile,
        isLog: "0"
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            store.remove("mobile");
            store.remove("customerId");
            store.remove("isWhiteInfo");
            this.$router.push({
              path: "/signIn",
              query: {}
            });
          } else {
            Toast(`${res.msg}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .cell {
    height: 1rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.2rem;
    width: 7.1rem;
    margin: 0 auto;
  }
}
.button {
  display: flex;
  justify-content: center;
  width: 6.2rem;
  height: 0.9rem;
  border-radius: 0.45rem;
  font-weight: bold;
  line-height: 0.88rem;
  font-size: 0.36rem;
  margin: 1rem auto;
  background: linear-gradient(
    90deg,
    rgba(95, 127, 228, 1),
    rgba(58, 95, 238, 1)
  );
  box-shadow: 0px 0.14rem 0.16rem 0px rgba(186, 201, 254, 1);
  border-radius: 0.44rem;
  color: #fff;
}
.line {
  width: 100%;
  height: 0.2rem;
  background: #f2f3f5;
}
</style>