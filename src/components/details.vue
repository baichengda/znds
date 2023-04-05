<template>
    <div class="details">
        <!-- <Header>
            <slot>
                <img src="@/assets/images/title-img/instrument-details.png" alt="">
            </slot>
        </Header> -->
        <div class="details-body">
            <div class="left-module">
                <slot name="detailsLeftModule"></slot>
            </div>
            <div class="right-module">
                <div class="title">
                    <slot name="detailsTitle"></slot>
                </div>
                <slot name="errtip"></slot>
                
                <backButton class="details-back"/>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import backButton from '@/components/back-botton.vue'

const route = useRoute()


onUnmounted(() => {
    $(`.xitong-icons`).addClass('go-beat')
})



</script>
<style lang="scss" scoped>
.details {
    position: relative;
    height: 100%;
    // overflow-y: auto;

    .details-body {
        padding: 30px 20px 20px;
        box-sizing: border-box;
        height: calc(100% - 76px);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left-module {
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.302);
            width: 420px;
            // padding: 20px 20px 38px;
            box-sizing: border-box;
            height: 100%;
            border-radius: 8px;
            text-align: left;
            color: #B4BECD;
            font-family: 'SourceHanSansCN-Regular';
            font-size: 18px;
            position: relative;
            z-index: 9999;

            // h3 {
            //     color: #fff;
            //     margin: 0;
            //     margin-bottom: 13px;
            //     line-height: 1;
            // }

            // .instrument-name {
            //     height: 40px;
            //     margin: 0;
            // }

            // .carousel {
            //     width: 380px;
            //     height: 380px;

            //     :deep(.el-carousel) {
            //         width: 100%;
            //         height: 100%;

            //         .el-carousel__container {
            //             width: 100%;
            //             height: 100%;
            //         }

            //         img {
            //             // width: 100%;
            //         }
            //     }

            // }

            // .no-pic {
            //     width: 380px;
            //     height: 380px;
            //     background-color: #d3dce6;
            //     display: flex;
            //     align-items: center;
            //     justify-content: center;
            // }

            // .describe {
            //     margin: 20px 0;
            // }

            // .connect {
            //     margin-bottom: 30px;
            // }

            // .connect {
            //     ul {
            //         margin: 0;
            //         padding: 0;
            //         list-style: none;
            //     }
            // }

            // .characteristic {
            //     ul {
            //         padding: 0;
            //         margin-left: 20px;
            //     }
            // }

            // // 全局滚动条样式
            // &::-webkit-scrollbar {
            //     width: 2px;
            //     /*对垂直流动条有效*/
            //     height: 2px;
            //     /*对水平流动条有效*/
            //     cursor: pointer;
            // }

            // /*定义滑块颜色、内阴影及圆角*/
            // &::-webkit-scrollbar-thumb {
            //     border-radius: 7px;
            //     -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            //     background-color: rgb(152, 154, 156);
            // }

            // /*定义两端按钮的样式*/
            // &::-webkit-scrollbar-button {
            //     background-color: transparent;
            // }
        }

        .right-module {
            background: #0A1F3B;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.302);
            width: calc(100% - 30px - 420px);
            height: 100%;
            border-radius: 8px;
            position: relative;
            .warn-text {
                color: #FF0000;
                font-size: 20px;
                font-family: 'SourceHanSansCN-Regular';
                position: absolute;
                top: 30px;
                left: 210px;
                z-index: 99;

                img {
                    width: 28px;
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }

            .title {
                position: absolute;
                top: 12px;
                left: 0;

                img {
                    width: 185px;
                }
            }
            .details-back {
                position: absolute;
                // bottom: 80px;
                // right:50px;
                bottom: 60px;
                right: 40px;
                z-index: 999;
            }
        }
    }



    .el-carousel__item {
        background-color: #d3dce6;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}</style>