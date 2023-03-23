<template>
    <div class="search-res">
        <p v-if="Object.values(resData).flat().length && showText">找到 {{Object.values(resData).flat().length }} 个结果，供您选择：</p>
        <p v-if="!Object.values(resData).flat().length && showText">抱歉，未找到您要查找的信息</p>
        <template v-for="(item, index) in resData.device" :key="index">
            <!-- 设备查询 -->
            <div class="module-info">
                <div class="module-t">
                    <h4>
                        <div>{{item.devName}}</div>
                        <div>
                            <div @click="viewDevInfo(item)">
                                <img src="@/assets/images/search-res-icon/info.png" alt="">
                                <span>详情</span>
                            </div>
                            <div @click="handlenAvigation(item)">
                                <img src="@/assets/images/search-res-icon/position.png" alt="">
                                <span>导航</span>
                            </div>
                        </div>
                    </h4>
                </div>
                <div class="module-b">
                    <div class="module-b-l">
                        <img :src="getDevImg(item.imgList,'设备')" alt="">
                    </div>
                    <div class="module-b-r">
                        <p><span>设备品牌:</span>{{item.devManufacturer}}</p>
                        <p><span>设备型号:</span>{{item.devSpecifications}}</p>
                        <p><span>设备位置:</span>{{item.devLocation}}</p>
                    </div>
                </div>
            </div>
        </template>
        <template v-for="(item, index) in resData.instrument" :key="index">
            <!-- 仪器查询 -->
            <div class="module-info">
                <div class="module-t">
                    <h4>
                        <div>{{item.devName}}</div>
                        <div>
                            <div @click="viewDevInfo(item)">
                                <img src="@/assets/images/search-res-icon/info.png" alt="">
                                <span>详情</span>
                            </div>
                            <div @click="handlenAvigation(item)">
                                <img src="@/assets/images/search-res-icon/position.png" alt="">
                                <span>导航</span>
                            </div>
                        </div>
                    </h4>
                </div>
                <div class="module-b">
                    <div class="module-b-l">
                        <img :src="getDevImg(item.imgList,'仪器')" alt="">
                    </div>
                    <div class="module-b-r">
                        <p><span>仪器品牌:</span>{{item.devManufacturer}}</p>
                        <p><span>仪器型号:</span>{{item.devSpecifications}}</p>
                        <p><span>仪器位置:</span>{{item.devLocation}}</p>
                    </div>
                </div>
            </div>
        </template>
        <template v-for="(item, index) in resData.room" :key="index">
            <div class="module-info">
                <div class="module-t">
                    <h4>
                        <div>{{item.rmName}}</div>
                        <div>
                            <div @click="viewRoomInfo(item)">
                                <span style="margin-right: 2px">详情</span>
                                <img src="@/assets/images/search-res-icon/right-arrow.png" style="margin: 0" alt="">
                            </div>
                        </div>
                    </h4>
                </div>
                <div class="module-b">
                    <div class="module-b-l">
                        <img :src="getDevImg(item.imgList,'空间')" alt="">
                    </div>
                    <div class="module-b-r">
                        <p><span>房间编号:</span>{{item.rmNumber}}</p>
                        <p><span>房间位置:</span>{{item.rmLevel}}</p>
                        <p><span>管理员:</span>{{item.rmAdmin}}</p>
                    </div>
                </div>
            </div>
        </template>
        <template v-for="(item, index) in resData.person" :key="index">
            <!-- 人员查询 -->
            <div class="module-info">
                <div class="module-t">
                    <h4>
                        <div>{{ item.userName }}</div>
                    </h4>
                </div>
                <div class="module-b">
                    <div class="module-b-l">
                        <img :src="getimg(item.userHeadUrl)" alt="">
                    </div>
                    <div class="module-b-r">
                        <p><span>部门: </span>{{ item.dept }}</p>
                        <p><span>职位: </span>{{ item.position }}</p>
                        <p><span>电话: </span>{{ item.userPhone }}</p>
                        <p><span>当前位置: </span>{{ item.location }}</p>
                    </div>
                </div>
            </div>
        </template>
        <equipmentInformation ref="equipmentInfo"/>
        <roomModal @integratedQuery="integratedQuery" :floorList="floorList" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, reactive, getCurrentInstance, ref } from 'vue'
import emitter from '@/common/mybus.ts'
import roomModal from '@/views/management/space-management/room-modal.vue'
import {http,facilityManagementApi} from '@/common/request.js'
import equipmentInformation from './equipment-information.vue'
import { cutPlanModel,showAllModel,selectModelArtifacts } from '@/common/bim-utils.js'
import deviceImg from '@/assets/images/placeholder/placeholder-device.png'
import instrumentImg from '@/assets/images/placeholder/placeholder-instrument.png'
import spaceImg from '@/assets/images/placeholder/placeholder-space.png'
import personImg from '@/assets/images/placeholder/placeholder-person.png'
let { appContext } = getCurrentInstance() || {}
let props = defineProps({
    searchData: Object,
    showIpt: Boolean
})

const resData = ref<any>({
    device: [],
    instrument: [],
    person: [],
    room: []
})
const floorList = ref([])
let showText = ref(false)
watch(() => props.searchData, (val: any) => {
    console.log(val)
    resData.value = val || {}
    showText.value = true
}, {
    deep: true,
})


watch(() => props.showIpt, (val: any) => {
    showText.value = false
    console.log(123123123213)
}, {
    deep: true,
})

const type = ref('设备')
onMounted(() => {
    emitter.on('sendSearchType', query => {
        type.value = query || '设备'
    })
    showText.value = false
})

//拼接图片路径
const getDevImg = (param, name) => {
    if(param && param.length) {
        return appContext?.config.globalProperties.$baseURL+param[0].url
    }else{
        if(name=='设备') {
            return deviceImg
        }else if(name === '仪器') {
            return instrumentImg
        }else if(name ==='空间') {
            return spaceImg
        }else{
            return ''
        }
    }
}

const getimg = (value: string) => {
    // upload/qxzx.png
    if(value) {
        return appContext?.config.globalProperties.$baseURL+value
    }else{
        return personImg
    }
    
};
let equipmentInfo = ref(null)
//查看设备信息
const viewDevInfo = (infos) => {
    let { objectId, modelId } = infos || {}
    // emitter.emit("rightmenu", {
    //     dbid: objectId,
    //     modelId: modelId
    // });
    console.log(equipmentInfo.value)
    equipmentInfo.value.viewDevInfo({dbid:objectId,modelId})
}
//查看房间信息
const viewRoomInfo = (item) => {
    integratedQuery()
    emitter.emit('showRoomModal',item)
}
//仪器名称、仪器位置、管理员查询以及默认所有数据
const integratedQuery = () => {
    facilityManagementApi.post('spaceMange/listRoomLikeRmNameOrRmNumOrRmLevel',
        {
            rmName: '', //房间名称
            rmNumber: '',//房间编号
            rmLevel: '',//楼层
            pageNum: 1,
            pageSize: 15
        })
        .then((res) => {
            console.log(res)
            let { data, code } = res.data
            if (code === 200) {
                floorList.value = data.rmLevel
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//导航
let handlenAvigation = async(infos) => {
    let { objectId,modelId,devLevel } = infos || {}
    let data = await isTransferFloorOrSys(objectId,modelId) as any
    let { list, room, type } = data || {}
    console.log(data,infos)
    showAllModel()
    cutPlanModel(modelId, room?.bottom, room?.top, list,devLevel)
    emitter.emit('theConduit',{item:false,data:room})//管道控制
    selectModelArtifacts([objectId*1],modelId)
}
//判断是显示转至楼层还是系统
let isTransferFloorOrSys = (objectId,modelId) => {
    if(!objectId && !modelId) return 
    return new Promise((resolve) => {
        let formData = new FormData();
        formData.append('dbId',objectId)
        formData.append('modelId',modelId)
        http.post("/modelTree/alarmbydevice",formData,{headers: {"Content-Type": "application/json" }})
        .then((res) => {
            resolve(res.data.data)
            
        })
    })
    
}
</script>

<style lang='scss' scoped>
.search-res {
    height: 500px;
    overflow: auto;
    font-size: 16px;
    &::-webkit-scrollbar {
            width: 5px;
            /*对垂直流动条有效*/
            height: 5px;
            /*对水平流动条有效*/
            cursor: pointer;
        }

        /*定义滑块颜色、内阴影及圆角*/
        &::-webkit-scrollbar-thumb {
            border-radius: 7px;
            // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: rgba(152, 154, 156, 0.1);
        }

    &>p {
        color: #fff;
        font-size: 14px;
        text-align: left;
        margin: 12px 0px 5px;
    }

    .module-info {
        width: 300px;
        height: 135px;
        background: rgba(9, 19, 45, 0.8500);
        box-shadow: inset 0px 0px 8px 1px rgba(0, 77, 186, 0.7000);
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #0D3C56;
        padding: 10px 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;

        .module-t {
            h4 {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #00FFFF;
                margin: 0;

                &>div {
                    cursor: pointer;

                    &:nth-child(1) {
                        font-size: 14px;
                    }

                    &:nth-child(2) {
                        font-size: 12px;

                        div {
                            display: inline-block;
                            margin-left: 20px;
                        }

                        img {
                            width: 16px;
                            vertical-align: middle;
                            margin-right: 4px;
                        }
                    }
                }
            }
        }

        .module-b {
            font-size: 12px;
            display: flex;
            align-items: center;
            height: calc(100% - 25px);

            .module-b-l {
                width: 100px;
                height: 100%;
                margin-right: 2px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .module-b-r {
                p {
                    color: #C1C3C9;
                    margin: 0 0 6px;
                    text-align: left;

                    span {
                        color: #00FFFF;
                    }

                    &:last-child {
                        color: #00FFFF;
                    }
                }
            }
        }
    }
}
</style>