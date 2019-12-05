<template>
  <div class="bigBox">
    <img :src="imgUrl" />
  </div>
</template>

<script>
//import { ImagePreview } from "vant";
export default {
  components: {},
  data() {
    return {
      imgUrl: "",
      objectno: "",
      fullpath: ""
    };
  },
  created() {
    this.objectno = this.$route.query.objectno;
    this.fullpath = this.$route.query.fullpath;
    this.pdfToJpg();
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "附件信息";
  },
  methods: {
    // viewDetails(img) {
    //   ImagePreview([img]);
    // },
    //查询附件图片
    pdfToJpg() {
      let url = "cashloan/pdfToJpg";
      let param = {
        fullPath: this.fullpath //附件pdf
      };
      this.$request2
        .get(url, { params: param })
        .then(res => {
          //console.log(res, 909);
          this.imgUrl = res.data;
        })
        .catch(error => {
          console.log("error" + error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  width: 100%;
  img {
    display: inline-block;
    width: 100%;
  }
}
</style>