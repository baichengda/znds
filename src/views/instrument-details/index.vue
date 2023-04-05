<template>
    <div class="details">
        <Header>
            <slot>
                <img src="@/assets/images/title-img/instrument-details.png" alt="">
            </slot>
        </Header>
        <!-- <div class="instrument-details-body"> -->
        <!-- <div class="left-module"> -->
        <!-- <p class="instrument-name">{{ instrument.instrumentName }}</p>
                <div class="carousel" v-if="instrument.imgList.length">
                    <el-carousel indicator-position="none" loop="true" autoplay="true"
                        :arrow="instrument.imgList.length > 1 ? 'always' : 'never'">
                        <el-carousel-item v-for="item in instrument.imgList" :key="item">
                            <img :src="facilityManagementUrl + item.url" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="no-pic" v-else>
                    <img :src="instrumentPic" alt="">
                </div>
                <p class="describe">{{ instrument.instrumentDescribe }}</p>
                <div class="connect">
                    <h3>联系方式</h3>
                    <ul>
                        <li>管 理 员： {{ instrument.instrumentAdmin }}</li>
                        <li>电 话： {{ instrument.adminPhone }}</li>
                        <li>邮 箱： {{ instrument.adminEmail }}</li>
                    </ul>
                </div>
                <div class="characteristic">
                    <h3>主要技术特点</h3>
                    <ul>
                        <li v-for="(item, index) in instrument.instrumentCharacteristic" :key="index" v-show="item">{{ item
                        }}</li>
                    </ul>
                </div> -->
        <!-- </div> -->
        <!-- <div class="right-module"> -->
        <Details class="instrument-details">
            <template v-slot:detailsLeftModule>
                <p class="instrument-name">{{ instrument.instrumentName }}</p>
                <div class="carousel" v-if="instrument.imgList.length">
                    <el-carousel indicator-position="none" loop="true" autoplay="true"
                        :arrow="instrument.imgList.length > 1 ? 'always' : 'never'">
                        <el-carousel-item v-for="item in instrument.imgList" :key="item">
                            <img :src="facilityManagementUrl + item.url" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="no-pic" v-else>
                    <img :src="instrumentPic" alt="">
                </div>
                <p class="describe">{{ instrument.instrumentDescribe }}</p>
                <div class="connect">
                    <h3>联系方式</h3>
                    <ul>
                        <li>管 理 员： {{ instrument.instrumentAdmin }}</li>
                        <li>电 话： {{ instrument.adminPhone }}</li>
                        <li>邮 箱： {{ instrument.adminEmail }}</li>
                    </ul>
                </div>
                <div class="characteristic">
                    <h3>主要技术特点</h3>
                    <ul>
                        <li v-for="(item, index) in instrument.instrumentCharacteristic" :key="index" v-show="item">{{
                            item
                        }}</li>
                    </ul>
                </div>
            </template>
            <template v-slot:detailsTitle>
                <img src="@/assets/images/title-img/instrument-position.png" alt="">
            </template>
            <template v-slot:errtip>
                <div class="warn-text" v-show="isShowTip">
                    <img src="@/assets/images/warn.png" alt="">
                    <span>未找到所属房间</span>
                </div>
            </template>
        </Details>
        <!-- <div class="title">
                    <img src="@/assets/images/title-img/instrument-position.png" alt="">
                </div> -->
        <!-- <div class="warn-text" v-show="isShowTip">
                    <img src="@/assets/images/warn.png" alt="">
                    <span>未发现人员位置</span>
                </div> -->
        <!-- <backButton class="details"/> -->
        <!-- </div> -->
        <!-- </div> -->

    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { facilityManagementApi, facilityManagementUrl } from '@/common/request.js'
import Header from '@/components/header.vue'
import instrumentPic from '@/assets/images/placeholder/placeholder-instrument.png'
import { useRoute } from 'vue-router'
import { getFloorInfo, cutPlanModel, defaultView } from '@/common/bim-utils.js'
import { clickNavShowRoomIcon } from '@/common/space.js'
import emitter from '@/common/mybus.ts'
import backButton from '@/components/back-botton.vue'
import Details from '@/components/details.vue'

const route = useRoute()
const instrument = ref(
    {
        instrumentName: "",
        imgList: [],
        instrumentDescribe: '',
        instrumentAdmin: '',
        adminEmail: '',
        adminPhone: '',
        instrumentCharacteristic: '',
    }
) as any
let isShowTip = ref(false)

//查询仪器信息
let { instrumentId } = route.query as any || {};
const getInstrumaneInfo = () => {
    let formData = new FormData()
    formData.append('instrumentId', instrumentId)
    facilityManagementApi.post('instrument/selectInstrumentById', formData)
        .then((res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                splitData(data?.instrumentCharacteristic)
                instrument.value = data
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
getInstrumaneInfo()

//查询仪器所在房间
let timer = ref(null)
const getInstrumaneByRoom = () => {
    let formData = new FormData()
    formData.append('instrumentId', instrumentId)
    facilityManagementApi.post('instrument/getroom', formData)
        .then(async (res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                if(data) {
                    let { modelId, objectId } = data || {};
                    let floorData = await getFloorInfo(objectId, modelId)
                    let { room } = floorData || {}
                    window.clearTimeout(timer)
                    timer = setTimeout(() => {
                        cutPlanModel(room.modelId, room.bottom, room.top)
                        room.children = room.roomlist
                        clickNavShowRoomIcon(room)
                        emitter.emit('theConduit', { item: false, data: room })
                        setFloorCamera(room.rmLevel)
                        $(`#room_${objectId}_${modelId}`).addClass('go-beat')
                    }, 100)
                    isShowTip.value = false
                }else{
                    isShowTip.value = true
                }
            } else {
                // ElMessage.error(message)
                isShowTip.value = true
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
getInstrumaneByRoom()

//刷新页面后,监听模型加载事件,加载完成后再请求
emitter.on('modelLoaded', getInstrumaneByRoom)



//写死的楼层视角
const setFloorCamera = (sname) => {
    let obj = {
        F01: {
            posX: -0.625197878318783,
            posY: -90.35795781634819,
            posZ: 175.03820662654556,
            upX: 0,
            upY: 0,
            upZ: 1,
            centerX: -0.0032495933423632335,
            centerY: -0.46965389412250347,
            centerZ: -0.24086397142634736,
        },
        F02: {
            posX: 0.8452283288227198,
            posY: -90.578405805329,
            posZ: 174.88967828098117,
            upX: 0.0010369348552279507,
            upY: 0.8810693654045317,
            upZ: 0.47298593859834986,
            centerX: 0.9550612501286265,
            centerY: 2.745125357337571,
            centerZ: 1.0481080388507564,
        },
        F03: {
            posX: 4.713954394913801,
            posY: -90.68957913158872,
            posZ: 207.08011335232425,
            upX: 0.004036496720954617,
            upY: 0.8923191448048581,
            upZ: 0.4513870296197581,
            centerX: 1.8892622238022616,
            centerY: -5.674243110340157,
            centerZ: 39.043805049477754,
        },
        F04: {
            posX: 4.107973899257094,
            posY: -80.75737700344213,
            posZ: 179.62376179707465,
            upX: 0.002563784140615725,
            upY: 0.8613580543019151,
            upZ: 0.5079918594821174,
            centerX: 5.41420314370079,
            centerY: 19.219269976136495,
            centerZ: 9.875422828480197,
        },
        F05: {
            posX: 3.9381209503866303,
            posY: -57.89401001925116,
            posZ: 188.5458714583435,
            upX: 0.004257921866552958,
            upY: 0.9053509586769681,
            upZ: 0.4246428048655401,
            centerX: 4.33544424178759,
            centerY: 26.58781798238848,
            centerZ: 8.424143579740075,
        }
    }
    defaultView(obj[sname || 'F02'], true)
}

//把中文的；号全部替换为英文的;号
const splitData = (instrumentCharacteristic) => {
    if (instrumentCharacteristic) {
        let BString = instrumentCharacteristic.replace(/[\uff1b]/g, ";")
        instrumentCharacteristic = BString.split(';')
    }
}

onUnmounted(() => {
    $(`.xitong-icons`).addClass('go-beat')
})



</script>
<style lang="scss" scoped>
.details {
    position: relative;
    height: 100%;
    // overflow-y: auto;

    // .details-body {
    //     padding: 30px 20px 20px;
    //     box-sizing: border-box;
    //     height: calc(100% - 76px);
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    .instrument-details {
        :deep(.left-module) {
            background: #0A1F3B;
            // box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.302);
            // width: 420px;
            padding: 20px 20px 38px;
            // box-sizing: border-box;
            // height: 100%;
            // border-radius: 8px;
            // text-align: left;
            // color: #B4BECD;
            // font-family: 'SourceHanSansCN-Regular';
            // font-size: 18px;
            // overflow-y: auto;
            // overflow-x: hidden;
            overflow-y: auto;
            overflow-x: hidden;

            h3 {
                color: #fff;
                margin: 0;
                margin-bottom: 13px;
                line-height: 1;
            }

            .instrument-name {
                height: 40px;
                margin: 0;
            }

            .carousel {
                width: 380px;
                height: 380px;

                :deep(.el-carousel) {
                    width: 100%;
                    height: 100%;

                    .el-carousel__container {
                        width: 100%;
                        height: 100%;
                    }

                    img {
                        // width: 100%;
                    }
                }

            }

            .no-pic {
                width: 380px;
                height: 380px;
                background-color: #d3dce6;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .describe {
                margin: 20px 0;
            }

            .connect {
                margin-bottom: 30px;
            }

            .connect {
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
            }

            .characteristic {
                ul {
                    padding: 0;
                    margin-left: 20px;
                }
            }

            // 全局滚动条样式
            &::-webkit-scrollbar {
                width: 2px;
                /*对垂直流动条有效*/
                height: 2px;
                /*对水平流动条有效*/
                cursor: pointer;
            }

            /*定义滑块颜色、内阴影及圆角*/
            &::-webkit-scrollbar-thumb {
                border-radius: 7px;
                -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                background-color: rgb(152, 154, 156);
            }

            /*定义两端按钮的样式*/
            &::-webkit-scrollbar-button {
                background-color: transparent;
            }
        }
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
            top: 0;
            left: 0;

            img {
                width: 185px;
            }
        }

        // .details {
        //     position: absolute;
        //     // bottom: 80px;
        //     // right: 50px;
        //     bottom: 60px;
        //     right: 40px;
        //     z-index: 999;
        // }
    }

    // }



    .el-carousel__item {
        background-color: #d3dce6;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>