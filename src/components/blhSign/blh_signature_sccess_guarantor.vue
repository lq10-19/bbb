<template>
    <div class="bigBox1">
          <div class="bigBox">
        <div class="topTitle">
            <p class="title">&emsp;&emsp;恭喜您，主申人合同电子签名成功！ </p>
            <p class="titleSub">请复制下方链接<br>转发给担保人签署电子签名。 </p>
        </div>
        <div class="content">
            <ul>
                <li style="height:1rem;border-bottom:1px solid #f2f3f5;" class="clearfix">
                    <p style="font-weight:700;line-height:1rem;">合同号:</p>
                    <p style="color:#666;font-size:0.3rem;line-height:1rem;">{{this.$route.query.contractNo}}</p>
                </li>
                <li style="height:0.52rem;margin-top:0.2rem;">
                    <p style="font-size:0.24rem;">签约进度：（{{isSlecSign.length}}/{{listData.length}}）</p>
                </li>
                <li style="height:0.1rem;width:6rem;background:#ddd;border-radius:0.05rem;margin-left:0.29rem;padding:0;margin-bottom:0.4rem;">
                    <p :style="{width:isSlecSign.length/listData.length*100+'%'}" style="border-radius:0.05rem;background:#51B56B;height:100%;"></p>
                </li>
             
                <li v-for="(item,index) in listData" :key="index" style="" class="people_li">
                    <p style="font-weight:700;">{{item.userType=='01'?'主申人':'保证人'}}</p>
                    <p style="color:#999;">{{item.customername}}</p>
                    <p :class="{disabled:item.elecSignStatus=='1'}" class="status">{{item.elecSignStatus=='1'?'已签':'未签'}}</p>
                </li>
            </ul>
        </div>
    </div>
    <input  style="" type="text" value="" readonly v-model="webLink"  id="textAreas"/>
    <div style="width:4.8rem;height:0.78rem;background-color:#FF7F36;margin:0.8rem auto 0.8rem auto;">
        <p style="font-size:0.3rem;color:#fff;text-align:center;line-height:0.78rem;border-radius:0.06rem;" class="cuteShareBtn" v-clipboard:copy="webLink"  v-clipboard:success="onCopy" v-clipboard:error="onError" id="copy">复制链接</p>
    </div>
    </div>
</template>

<script>
    import { MessageBox, Indicator,Toast} from 'mint-ui'; //要引入
   
    export default {
        data() {
            return {
               listData:[],
               isSlecSign:[],
               webLink:''
            }
        },
        created() {
            console.log("bbb",location.href)
            this.webLink = location.origin+'/#/e_signature_index?userType=03&contractNo='+this.$route.query.contractNo;      
            this.listData = JSON.parse(this.$route.query.data);
            this.listData.forEach((v,i)=>{
                if(v.elecSignStatus=='1'){
                    this.isSlecSign.push(v);
                }
            })
            
        },
        methods: {
            onCopy: function (e) {
                Toast("复制成功"); 
            },
            onError: function (e) {
                Toast("复制失败"); 
            },
             copyText() { //做废
                // var e=document.getElementById("textAreas");//对象是copy-num1  
                // e.select(); //选择对象  
                // document.execCommand("Copy"); //执行浏览器复制命令  
                // Toast("复制成功"); 
                // ------------------------
                var input = document.createElement('input');
                input.value = this.webLink;
                document.body.appendChild(input);
                input.select();
                input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
                document.body.removeChild(input);
                // -------------------------
                Toast("复制成功"); 
            }
        },
        mounted() {
            document.getElementsByTagName("body")[0].style.background = "#f2f3f5";
            document.getElementsByTagName("title")[0].textContent = "电子签名";
        },
    }
</script>


<style lang='scss' scoped>
          ul,li,p,div,body,input{
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .bigBox{
            padding:0 0.3rem;
            box-sizing: border-box;
        }
        .topTitle{
            margin-top: 1rem;
        }
        .topTitle .title{
            font-size: 0.3rem;
            color:#000;
            font-weight: 700;
            text-align: center;
            position: relative;
        }
        .topTitle .title::before{
            content: "";
            display: block;
            width: 0.4rem;
            height: 0.4rem;
            position: absolute;
            top: 50%;
            left: 12%;
            transform: translateY(-50%);
            background: url("../../assets/img/contract/succIcon@2x.png") no-repeat center/100%;
        }
        .topTitle .titleSub{
            font-size: 0.26rem;
            color:#666;
            text-align: center;
            line-height: 0.5rem;
            margin-top: 0.3rem;
        }
        .content{
            height: auto;
            background: #fff;
            border-radius: 0.03rem;
            font-size: 0.32rem;
            width: 6.9rem;
            margin-top: 0.4rem;
           
        }
        .clearfix:after{
            content:"";
            display:block;
            height:0;
            line-height:0;
            visibility:hidden;
            clear:both;
        }
        .content li{
            width: 100%;
            padding-left: 0.29rem;
        }
        .content li p{
            float: left;
        }
        .content li p:nth-of-type(1){
            padding-right: 0.22rem;
        }
        .people_li{
            height: 0.6rem;
        }
         .people_li:nth-of-type(1){
             margin-top: 0.4rem !important;
         }
        .people_li p{
            font-size: 0.3rem;
            line-height: 0.6rem;
        }
        .people_li .status{
            width:0.92rem;
            height: 0.4rem;
            color: #fff;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.24rem;
            margin-top: 0.1rem;
            margin-left: 0.5rem;
            border-radius: 0.06rem;
            background: #FF7F36;
            
        }
        .people_li .disabled{
            background: #DDDDDD;
        }
      
        #textAreas{
            width:6.9rem;height:1.18rem;border:none;border-radius:0.03rem;display:block;margin:0.5rem auto 0 auto;font-size:0.24rem;line-height:0.4rem;
            box-sizing: border-box;
            padding-left: 0.2rem;
        }
</style>