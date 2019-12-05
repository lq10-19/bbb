<template>
  <div class="bigbox">
    <div @click="aa" style="opacity:0;">请选择地址</div>
    <mt-popup v-model="popupVisible" position="bottom">
      <!-- <mt-picker :slots="slots" @change="onValuesChange" value-key='name'></mt-picker> -->
      <div class="wen_selected">
        <p @click="cancer">取消</p>
        <p @click="confirm">确定</p>
      </div>
      <mt-picker :slots="slots" value-key="name" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
// import cityData from "../../../static/json/pca-code.json"; //引入省市区数据
import { Picker, Popup } from "mint-ui";
import { Toast } from "mint-ui"; //要引入

export default {
  data() {
    return {
      handler: function(e) {
        e.preventDefault();
      }, //监听函数 解决页面穿透滑动问题
      popupVisible: false,
      noClose: false,
      content: "",
      cityData: [],
      cityObj: {
        provinceName: "",
        provinceId: "",
        cityName: "",
        cityId: "",
        countyName: "",
        countyId: ""
      },
      slots: [
        {
          flex: 1,
          values: [],
          defaultIndex: 0,
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          defaultIndex: 0,
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          defaultIndex: 0,
          className: "slot5",
          textAlign: "center"
        }
      ]
    };
  },
  created() {
    // this.slots[0].values = cityData;
    // this.slots[2].values = cityData[0].city;
    // this.slots[4].values = cityData[0].city[0].district;
    this.getCityList();
  },
  methods: {
    //接口平台获取城市列表
    getCityList() {
      let url = "cashloan/getProvince";
      this.$request2
        .get(url)
        .then(res => {
          this.cityData = res.data;
          // this.slots[0].values = this.cityData;
          // this.slots[2].values = Object.values(this.cityData[0].cityMapList)[0];
          // this.slots[4].values = Object.values(
          //   Object.values(this.cityData[0].cityMapList)[0][0].districtMap
          // )[0];
          this.slots[0].values = this.getProvinceArr();
          this.slots[2].values = this.getCityArr("北京市");
          this.slots[4].values = this.getCountyArr("北京市","市辖区");
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选择城市
    onValuesChange(picker, values) {
      // picker.setSlotValues(1, Object.values(values[0].cityMapList)[0]);
      // picker.setSlotValues(2, Object.values(values[1].districtMap)[0]);
      if(!values[0]){
        return;
      }
      picker.setSlotValues(1, this.getCityArr(values[0]["name"]));
      picker.setSlotValues(
        2,
        this.getCountyArr(values[0]["name"], values[1]["name"])
      );
      this.myAdress = values;
    },
    //遍历json，返回省级对象数组
    getProvinceArr() {
      let provinceArr = [];
      if (this.cityData.lenght <= 0) {
        return;
      }
      this.cityData.forEach(function(item) {
        let obj = {};
        obj.name = item.provinceName;
        obj.id = item.provinceCode;
        provinceArr.push(obj);
      });
      return provinceArr;
    }, //遍历json，返回市级对象数组
    getCityArr(province) {
      // console.log("省：" + province);
      let cityArr = [];
      if (this.cityData.lenght <= 0) {
        return;
      }
      this.cityData.forEach(function(item) {
        if (item.provinceName === province) {
          Object.values(item.cityMapList)[0].forEach(function(args) {
            let obj = {};
            obj.name = args.cityName;
            obj.id = args.cityCode;
            cityArr.push(obj);
          });
        }
      });
      return cityArr;
    }, //遍历json，返回县级对象数组
    getCountyArr(province, city) {
      let countyArr = [];
      if (this.cityData.lenght <= 0) {
        return;
      }
      this.cityData.forEach(function(item) {
        if (item.provinceName === province) {
          Object.values(item.cityMapList)[0].forEach(function(args) {
            if (args.cityName === city) {
              Object.values(args.districtMap)[0].forEach(function(param) {
                let obj = {};
                obj.name = param.areaName;
                obj.id = param.areaCode;
                countyArr.push(obj);
              });
            }
          });
        }
      });
      // console.log(countyArr);
      return countyArr;
    },
    aa() {
      this.popupVisible = true;
    },
    // 取消
    cancer() {
      this.popupVisible = false;
    },
    //确定
    confirm() {
      this.cityObj.provinceName = this.myAdress[0].name;
      this.cityObj.provinceId = this.myAdress[0].id;
      this.cityObj.cityName = this.myAdress[1].name;
      this.cityObj.cityId = this.myAdress[1].id;
      this.cityObj.countyName = this.myAdress[2].name;
      this.cityObj.countyId = this.myAdress[2].id;
      this.popupVisible = false;
      console.log(this.cityObj, 909);
      this.$emit("getSubPageData", this.cityObj);
    },
    // /*解决页面层级相互影响滑动的问题*/
    // closeTouch () {
    //     document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {passive:false})//阻止默认事件
    // },
    // openTouch () {
    //     document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {passive:false})//打开默认事件
    // }
    /*解决iphone页面层级相互影响滑动的问题*/
    closeTouch: function() {
      /*  弹层出现时调用  */
      document
        .getElementsByTagName("body")[0]
        .addEventListener("touchmove", this.handler, { passive: false }); //阻止默认事件
      console.log("closeTouch haved happened.");
    },
    openTouch: function() {
      /*  弹层关闭时调用  */
      document
        .getElementsByTagName("body")[0]
        .removeEventListener("touchmove", this.handler, { passive: false }); //打开默认事件
      console.log("openTouch haved happened.");
    },
    openPicker() {
      /* 弹层出现 */
      this.openTouch();
    },
    closePicker() {
      /* 弹层关闭   */
      this.openTouch();
    }
  },
  mounted() {
    // document.getElementsByTagName("title")[0].textContent='子页面';
  },
  //侦听属性
  watch: {
    //picker关闭没有回调函数，所以侦听该属性替代
    // popupHandleVisible (val){
    //     if(val) {
    //         this.closeTouch()
    //     } else {
    //         this.openTouch()
    //     }
    // }
    //解决页面穿透滑动问题
    maskShow: function(newvs, oldvs) {
      //picker关闭没有回调函数，所以侦听该属性替代
      if (newvs) {
        this.closeTouch();
      } else {
        this.openTouch();
      }
    }
  },
  updated() {},
  components: {}
};
</script>


<style lang='scss' scoped>
.mint-popup-bottom {
  width: 100%;
}
.wen_selected {
  height: 0.8rem;
  width: 100%;
  background: #fff;
  padding: 0 0.2rem;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  p {
    float: left;
    font-size: 0.36rem;
    line-height: 0.8rem;
  }
  p:nth-of-type(2) {
    float: right;
    color: #3354df;
  }
}
</style>