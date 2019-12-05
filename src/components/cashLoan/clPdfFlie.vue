<template>
  <div id="container">
    <div class="pdfList"></div>
  </div>
</template>
<script>
import PDFJS from "pdfjs-dist";
import { MessageBox, Toast, Indicator } from "mint-ui";
export default {
  data() {
    return {
      pdfDataList: []
    };
  },
  created() {},
  mounted() {
    this.getBase64();
    document
      .getElementsByTagName("meta")
      [(name = "viewport")].setAttribute("content", "width=device-width");
  },
  destroyed() {
    document
      .getElementsByTagName("meta")
      [(name = "viewport")].setAttribute(
        "content",
        "width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
      );
  },
  methods: {
    getBase64() {
      Indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle"
      });
      //这里是我用来请求后台返回给我返回base64格式的文件发的ajax请求
      let url =
        "fileSignRule/getPdfBase64ByPath?filePath=" +
        this.$route.query.filePDF;
      this.$requestCl2
        .get(url)
        .then(res => {
          if (res.data) {
            this.pdfDataList.push({
              fileValue: res.data
            });
            this.showPdf();
          } else {
            Toast("获取文件失败，请稍后再试");
            Indicator.close();
          }
        })
        .catch(error => {
          Indicator.close();
          console.log("error" + error);
        });
    },
    async showPdf() {
      let pdfList = document.querySelector(".pdfList"); //通过querySelector选择DOM节点,使用document.getElementById()也一样
      for (let value of this.pdfDataList) {
        //遍历后台传过来的pdfDataList
        let base64 = value.fileValue; //获得bas464编码
        let decodedBase64 = atob(base64); //使用浏览器自带的方法解码
        let pdf = await PDFJS.getDocument({ data: decodedBase64 }); //返回一个pdf对象
        let pages = pdf.numPages; //声明一个pages变量等于当前pdf文件的页数
        for (let i = 1; i <= pages; i++) {
          //循环页数
          let canvas = document.createElement("canvas");
          let page = await pdf.getPage(i); //调用getPage方法传入当前循环的页数,返回一个page对象
          let scale = 2; //缩放倍数，1表示原始大小
          let viewport = page.getViewport(scale);
          let context = canvas.getContext("2d"); //创建绘制canvas的对象
          canvas.height = viewport.height; //定义canvas高和宽
          canvas.width = viewport.width;
          let renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          await page.render(renderContext);

          canvas.className = "canvas"; //给canvas节点定义一个class名,这里我取名为canvas
          pdfList.appendChild(canvas); //插入到pdfList节点的最后
          Indicator.close();
        }
      }
    }
  }
};
</script>