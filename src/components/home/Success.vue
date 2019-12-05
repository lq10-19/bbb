<template>
    <div class="sucess">
        <div class="icon"></div>
        <p class="isSmbit">信息已提交！</p>
        <div class="close">
            <button class="btn">请静候审核结果</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                nonceSign: null
            }
        },
        created() {

        },
        methods: {

        },
        components: {},
    }
</script>
<style lang='scss' scoped>
    .sucess {
        width: 100%;

        .icon {
            display: block;
            margin: 0.6rem auto;
            margin-top: 0.8rem;
            width: 1.2rem;
            height: 1.2rem;
            background: url("../../assets/img/sucess@2x.png") no-repeat center;
            background-size: 100%;
        }

        .isSmbit {
            text-align: center;
            font-size: 0.32rem;
            font-family: PingFangSC-Medium;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
        }

        .close {
            width: 100%;
            margin: 1rem 0;

            .btn {
                display: block;
                margin: 0 auto;
                width: 5.8rem;
                height: 0.94rem;
                background: linear-gradient(90deg, rgba(0, 137, 252, 1), rgba(1, 163, 246, 1));
                border-radius: 0.26rem;

                font-size: 0.36rem;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 1rem;
            }
        }
    }
</style>