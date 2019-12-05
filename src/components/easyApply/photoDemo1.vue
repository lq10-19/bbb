<template>
  <div class="bigBox">
    <div class="title_box">
      <p class="title_p">申请人近照示例</p>
    </div>
    <div class="example">
      <img src="../../../src/assets/img/sfz/demoImg1.png" alt>
      <p>照片需五官清晰，免冠</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "示例";
  },
  methods: {},
  beforeDestroy() {},
  components: {}
};
</script>
<style lang='scss' scoped>
.bigBox {
  .title_box {
    height: 0.86rem;
    .title_p {
      color: #333;
      font-size: 0.28rem;
      margin-left: 0.3rem;
      box-sizing: border-box;
      padding-top: 0.3rem;
    }
  }
  .example {
    // margin-top: 0.3rem;
    width: 100%;
    height: 4.5rem;
    background: #f4f8fc;
    padding-top: 0.68rem;
    box-sizing: border-box;
    p {
      font-size: 0.28rem;
      box-sizing: border-box;
      text-align: center;
      margin-left: 0;
      color: #fc6e51;
    }
    img {
      width: 4.2rem;
      height: 2.64rem;
      margin: 0 auto 0.28rem auto;
    }
  }
}
</style>