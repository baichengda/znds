<template>
    <div class="personnel-details">
        <Header>
            <slot>
                <img src="@/assets/images/title-img/personnel-details.png" alt="">
            </slot>
        </Header>
        <Details>
            <template v-slot:detailsLeftModule>
                <div class="l-t">
                    <div class="header">
                        <div class="header-pic">
                            <img :src="personnel.user.headPortrait ? userManagementUrl + personnel.user.headPortrait : personPic"
                                alt="">
                        </div>
                        <p class="name">{{ personnel.user.name }}</p>
                        <p class="group">{{ personnel.groupNameList }}</p>
                    </div>
                    <p class="introduction">{{ personnel.user.introduction }}</p>

                    <ul class="info">
                        <li>职务：{{ personnel.user.position }}</li>
                        <li>电话：{{ personnel.user.phone }}</li>
                        <li>邮箱：{{ personnel.user.mail }}</li>
                        <li>当前位置：{{ }}</li>
                    </ul>
                </div>
                <div class="l-b">
                    <h3>管理图谱</h3>
                    <div class="map">
                      <d3graph :data="data" :names="names" :labels="labels" v-if="KeyWords" :linkTypes="linkTypes" :number='number'/>
                    </div>
                </div>
                </template>
                <template v-slot:detailsTitle>
                    <img src="@/assets/images/title-img/personnel-position.png" alt="">
                </template>
                <template v-slot:errtip>
                    <div class="warn-text" v-show="isShowTip">
                        <img src="@/assets/images/warn.png" alt="">
                        <span>未发现人员位置</span>
                    </div>
                </template>
        </Details>
        <!-- <div class="personnel-details-body">
            <div class="left-module">
                <div class="l-t">
                    <div class="header">
                        <div class="header-pic">
                            <img :src="personnel.user.headPortrait ? userManagementUrl + personnel.user.headPortrait : personPic"
                                alt="">
                        </div>
                        <p class="name">{{ personnel.user.name }}</p>
                        <p class="group">{{ personnel.groupNameList }}</p>
                    </div>
                    <p class="introduction">{{ personnel.user.introduction }}</p>

                    <ul class="info">
                        <li>职务：{{ personnel.user.position }}</li>
                        <li>电话：{{ personnel.user.phone }}</li>
                        <li>邮箱：{{ personnel.user.mail }}</li>
                        <li>当前位置：{{ }}</li>
                    </ul>
                </div>
                <div class="l-b">
                    <h3>管理图谱</h3>

                </div>
            </div>
            <div class="right-module">
                <div class="title">
                    <img src="@/assets/images/title-img/personnel-position.png" alt="">
                </div>
                <div class="warn-text" v-show="isShowTip">
                    <img src="@/assets/images/warn.png" alt="">
                    <span>未发现人员位置</span>
                </div>
                
            </div>
        </div> -->

    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userManagementApi, userManagementUrl, personnelPositionApi,facilityManagementApi,http } from '@/common/request.js'
import Header from '@/components/header.vue'
import personPic from '@/assets/images/placeholder/placeholder-person.png'
import { useRoute } from 'vue-router'
import { getFloorInfo, cutPlanModel, defaultView } from '@/common/bim-utils.js'
import { clickNavShowRoomIcon } from '@/common/space.js'
import emitter from '@/common/mybus.ts'
import Details from '@/components/details.vue'
import d3graph from './d3graph.vue'
import axios from 'axios'
const route = useRoute()
const personnel = ref({
    groupNameList: [],
    user: {
        headPortrait: '',
        name: '',
        introduction: '',
        position: '',
        phone: '',
        mail: '',
    }
}) as any
let isShowTip = ref(false)



onMounted(() => {
  getMapData()
  // setInterval(() => {
  //     // console.log(22222,window.myIpcRenderer)
  // })
  // let events = window.versions.myIpcRenderer()
  // events.send("checkForUpdate");
})
//查询人员信息
let { userId,phone } = route.query as any || {};
const getPersonnelInfo = () => {
    let formData = new FormData()
    formData.append('userId',userId)
    userManagementApi.post('user/getUserInfoById',formData)
        .then((res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                data.groupNameList = data.groupNameList.join('')
                personnel.value = data
                getRoomsByPersonnel()
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
getPersonnelInfo()

//关系图谱
const names = reactive([])
const labels = reactive(['instrument', 'person', 'space', 'group'])
const number = ref(0)
const linkTypes = reactive(['', 'type', 'locate', 'export'])
const KeyWords = ref(false)
const data = reactive({
  nodes: [],
  links: []
})
const d3jsonParser = (json)=>{
  const nodes = []
  const links = [] // 存放节点和关系
  const nodeSet = [] // 存放去重后nodes的id
  for (let item of json) {
    for (let segment of item.p.segments) {
      // 重新更改data格式
      if (nodeSet.indexOf(segment.start.identity) == -1) {
        nodeSet.push(segment.start.identity)
        nodes.push({
          id: segment.start.identity,
          label: segment.start.labels[0],
          properties: segment.start.properties
        })
      }
      if (nodeSet.indexOf(segment.end.identity) == -1) {
        nodeSet.push(segment.end.identity)
        nodes.push({
          id: segment.end.identity,
          label: segment.end.labels[0],
          properties: segment.end.properties
        })
      }
      links.push({
        source: segment.relationship.start,
        target: segment.relationship.end,
        type: segment.relationship.type,
        properties: segment.relationship.properties
      })
    }
  }

  data.nodes = nodes
  data.links =links
  setTimeout(() => {
    KeyWords.value = true
  },100)
}
const getMapData = ()=>{
  let data = new FormData()
  data.append('phone',phone)
  facilityManagementApi.post('relation/getDimensionalRelationsByUserPhone',data).then(res=>{
    if(res.data.code == 200){
      // setTimeout(()=>{
        d3jsonParser(res.data.data.data)
      // },2000)
    }
  })
}




//根据人员查询人员管辖房间的信息
let timer = null
const getRoomsByPersonnel = () => {
    let formData = new FormData()
    formData.append('userId',userId)
    return userManagementApi.post('user/getRoomByUserId',formData)
        // .then(async (res) => {
        //     console.log(res)
        //     let { data, code, message } = res.data
        //     if (code === 200) {
        //         if(Array.isArray(data) && data?.length) {
                    
        //             let { model_id:modelId, object_id:objectId } = data[0]
        //             let floorData = await getFloorInfo(objectId,modelId)
        //             console.log(floorData)
        //             let { room } = floorData || {}
        //             window.clearTimeout(timer)
        //             timer = setTimeout(() => {
        //                 cutPlanModel(room.modelId,room.bottom,room.top)
        //                 room.children = room.roomlist
        //                 clickNavShowRoomIcon(room)
        //                 emitter.emit('theConduit', { item: false, data: room })
        //                 setFloorCamera(room.rmLevel)
        //                 $(`#room_${objectId}_${modelId}`).addClass('go-beat')
        //             },100)
                    
        //         }else{
        //             isShowTip.value = true
        //         }
        //     } else {
        //         ElMessage.error(message)
        //     }
        // })
        // .catch((error) => {
        //     console.log('error');
        // });
}

// 楼层映射
let obj = {
    "1F":"F01",
    "2F":"F02",
    "3F":"F03",
    "4F":"F04",
    "5F":"F05",
    "6F":"F06",
}
let floorName = ''
//根据人员id请求人员当前的位置
const getPositionByPersonnel = () => {
    let formData = new FormData()
    formData.append('userId',userId)
    return personnelPositionApi.post('Position/getPosition',formData)
        // .then(async (res) => {
        //     console.log(res)
        //     let { data, code, message } = res.data
        //     if (code === 200) {
        //         // 显示人员位置
        //         window.personnelPosition?.showLabel(data)
        //         getFloorDataByFloorName(obj[data.MAP_ID])
        //     } else {
        //         ElMessage.error(message)
        //     }
        // })
        // .catch((error) => {
        //     console.log('error');
        // });
}

//根据定位数据中的楼层,请求对应的楼层信息,以便于剖切和显示房间标签
let personTimer =null
let personPositionData = []
const getFloorDataByFloorName = (name) => {
    let formData = new FormData()
    formData.append('level',name)
    http.post('PointEquiment/listRoomInfoByLevel',formData)
        .then(async (res) => {
            let data = res.data
            data.children = res.data.fmRoomInfos
            data.level = name
            window.clearTimeout(personTimer)
            personTimer = setTimeout(() => {
                commonActive(data)
                // 显示人员位置
                window?.personnelPosition?.showLabel(personPositionData)
            },100)
        })
        .catch((error) => {
            console.log('error');
        });
}

const requestAll = async () => {
    // getPositionByPersonnel()//云大没有实时定位所以从all方法中拿出来了
    axios.all([()=>{},getRoomsByPersonnel()])
    .then(axios.spread(async (res1,res2) => {
        let { code:positionCode,data:positionData} = res1?.data || {} //人员定位数据
        let { code, data, message } = res2.data || {} //人员管辖范围数据
        // console.log(res2)
        //如果有人员定位,就不需要展示管辖房间
        if(positionCode===200 && positionData) {
            if(Array.isArray(positionData)) {
                personPositionData = positionData
            }else{
                personPositionData.push(positionData)
            }
            getFloorDataByFloorName(obj[positionData.MAP_ID]) //请求楼层数据
        } else {
            //管辖房间
            if(code===200) {
                if(Array.isArray(data) && data?.length) {
                    let { model_id:modelId, object_id:objectId } = data[0]
                    let floorData = await getFloorInfo(objectId,modelId)
                    let { room } = floorData || {}
                    let roomData = room
                    roomData.children = room?.roomlist || []
                    window.clearTimeout(timer)
                    timer = setTimeout(() => {
                        commonActive(roomData)
                        $(`#room_${objectId}_${modelId}`).addClass('go-beat')
                    },100)
                    
                }else{
                    ElMessage.error(message)
                }
            }else{
                ElMessage.error(message)
            }
            isShowTip.value = true
        }
    }))
    
}
requestAll()

//共同需要执行的操作(剖切)
const commonActive = (data) => {
    let { modelId,bottom,top, roomlist,rmLevel} = data || {}
    cutPlanModel(modelId,bottom,top)
    clickNavShowRoomIcon(data)
    emitter.emit('theConduit', { item: false, data: data })
    setFloorCamera(rmLevel)
}

//写死的楼层视角
const setFloorCamera = (sname) => {
    let obj = {
            F01:{
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


//刷新页面后,监听模型加载事件,加载完成后再请求
emitter.on('modelLoaded', requestAll)

onUnmounted(() => {
    $(`.xitong-icons`).addClass('go-beat')
})
</script>
<style lang="scss" scoped>
.personnel-details {
    height: 100%;
}

// .details-body {
//     height: calc(100% - 76px);
//     padding: 30px 20px 20px;
//     box-sizing: border-box;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;

    :deep(.left-module) {
        width: 420px;
        height: 100%;
        .l-t,
        .l-b {
            width: 100%;
            background: #0A1F3B;
            box-sizing: border-box;
            border-radius: 8px;
        }

        .l-t {
            padding: 20px 20px 5px;
            height: calc(100% - 345px - 20px);
            margin-bottom: 20px;
            overflow: auto;
            .header {
                .header-pic {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 1px solid;
                    text-align: center;
                    margin: 0 auto;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                p {
                    margin: 0;
                    line-height: 1;
                }

                .name {
                    font-size: 24px;
                    color: #fff;
                    font-family: 'SourceHanSansCN-Medium';
                    margin: 16px 0 12px;
                }

                .group {
                    color: #B4BECD;
                    font-size: 18px;
                    font-family: 'SourceHanSansCN-Regular';
                }
            }

            .introduction {
                font-family: 'SourceHanSansCN-Regular';
                color: #B4BECD;
                font-size: 18px;
                text-align: left;
                margin: 30px 0 30px;
            }

            .info {
                margin: 0;
                padding: 0;
                list-style: none;
                color: #B4BECD;
                font-size: 18px;
                font-family: 'SourceHanSansCN-Regular';
                text-align: left;
                li {
                    line-height: 1;
                    margin-bottom: 15px;
                }
            }
            // 全局滚动条样式
            &::-webkit-scrollbar {
            width: 2px; /*对垂直流动条有效*/
            height: 2px; /*对水平流动条有效*/
            cursor: pointer;
            }
            /*定义滑块颜色、内阴影及圆角*/
            &::-webkit-scrollbar-thumb{
            border-radius: 7px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: rgb(152, 154, 156);
            }
            /*定义两端按钮的样式*/
            &::-webkit-scrollbar-button {
            background-color:transparent;
            }
        }

        .l-b {
            padding: 20px;
            height: 345px;
            text-align: left;
            display: flex;
            flex-direction: column;
            h3 {
                color: #FFFFFF;
                font-size: 22px;
                font-family: 'SourceHanSansCN-Medium';
                margin: 0;
                line-height: 1;
            }
            .map{
                margin-top: 5px;
                flex-grow: 1;
                //background-color: red;
            }
        }
    }

//     .right-module {
//         background: #0A1F3B;
//         width: calc(100% - 30px - 420px);
//         height: 100%;
//         border-radius: 8px;
//         position: relative;
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
        
//     }
// }
</style>