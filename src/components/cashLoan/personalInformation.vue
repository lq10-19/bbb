<template>
  <div class="page">
    <div class="line"></div>
    <van-field v-model="email" label="电子邮箱" placeholder="请输入电子邮箱" center clearable class="cell" />
    <div class="line"></div>
    <button @click="preservation" class="button">保存</button>
  </div>
</template>

<script>
import { Toast } from "vant";
import store from "store";
export default {
  data() {
    return {
      email: "",
      mobile: "",
      openid: "",
      customerId: ""
    };
  },
  created() {
    if (store.get("customerId")) {
      this.customerId = store.get("customerId");
    }
    if (store.get("mobile")) {
      this.mobile = store.get("mobile");
    }
    if (store.get("openid")) {
      this.openid = store.get("openid");
    }
    //查询email
    this.query();
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
    document.getElementsByTagName("title")[0].textContent = "个人信息";
  },
  methods: {
    //查询email
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
            this.email = res.data.email;
          }
        })
        .catch(error => {
          console.log(error);
        });
      Toast("保存成功");
    },
    //保存
    preservation() {
      if (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
      } else {
        Toast("请输入正确的电子邮箱");
        return;
      }
      let url = "userBindingController/update";
      let param = {
        wechatNo: this.openid,
        mobile: this.mobile,
        email: this.email,
        customerId: this.customerId
      };
      return this.$requestCl
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            Toast("保存成功");
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