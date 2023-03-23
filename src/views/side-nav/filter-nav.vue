<template>
    <div class="l_tree_container" :class="name">
        <!-- <el-icon type="ios-loading" style="font-size: 14px" title="刷新导航数据" class="demo-spin"
            :class="{ 'demo-spin-icon-load': afreshGetData }" @click.native.prevent="handleUpdate"><RefreshRight /></el-icon> -->
        <div class="all-icon" @click="showAll">
            <img src="@/assets/images/monitoring-center/all.png" alt=""> 
            <p>全部</p>
        </div>
        
        <el-menu ref="SubmenuOpen" :default-active="activeIndex" class="build-group" :default-openeds="openNames">
            <div v-for="(build, index) in treeData" :key="index">
                <!-- <multipleModelNav @handlerClickBuild="handlerClickBuild" @handleClickOneLevel="handleClickOneLevel"
                    @handleClickTwoLevel="handleClickTwoLevel" :treeData="build" :index="index"
                    v-if="treeData.length > 1" /> -->
                <singleModelNav :build="build" :treeData="build.dataList" :index="index"
                    @handlerClickBuild="handlerClickBuild" @handleClickOneLevel="handleClickOneLevel"
                    @handleClickTwoLevel="handleClickTwoLevel" />
            </div>
        </el-menu>
        <!-- 绑定弹窗 -->
        <!-- <bind-modal
            :twoLevelData="twoLevelData"
            :formValidate="formValidate"
            ref="bindModal"
            @getFloorData="getFloorData"
        /> -->
        <!-- 解绑弹窗 -->
        <!-- <unbind-modal
            :twoLevelData="twoLevelData"
            @bindMainDefaultMenu="bindMainDefaultMenu"
            ref="unbindModal"
        /> -->
        <!-- 进入漫游显示退出漫游按钮 -->
        <!-- <roaming-button /> -->
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, nextTick, getCurrentInstance, reactive, onBeforeMount, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import emitter from '@/common/mybus.ts'
import { useRoute, useRouter } from 'vue-router'
import { setModelOpacity, showAllModel, defaultView, clearCutPlane, cutPlanModel, hideOtherModal } from '@/common/bim-utils.js'
import {http,operationManagementWs, personnelPositionWs,personnelPositionApi} from '@/common/request.js'
import { getSingleDeviceData } from './nav-utils.js'
import { clickNavShowRoomIcon, getFloorBottomAndTop } from '@/common/space.js'
// import roamingButton from './roaming-button.vue'
import multipleModelNav from './multiple-model-nav.vue'
import singleModelNav from './single-model-nav.vue'
import { judgeUnit } from '@/common/judge-unit.js'
import { onModelLoaded, wsdPos, updataHot } from '@/views/bim-model/hot.js'


let { appContext } = getCurrentInstance() as any
let { name } = useRoute()
const router = useRouter()
let floorData = null
let openNames = ref(['0'])
let treeData = ref([] as any[])
let wsIcon = ref(null)
let childArr = null //
let dblChild = ""//双击时所用数据
let treeData1 = []
let saveRoomDbIds = []//存放点击空间管理得时候获取得数据--白
let animatList = ref([])
let count = ref(0)
let timer = null
let startIndex = 0
let child = ref(null)
let modelId = ref(null)
let activeIndex = ref('')
let realDataSendParam = ref({ //设备实时数据发送的参数
    "dbid": null,
    "tableName": "state",
    "handleCode": "实时数据统计状态值安全警报",
    "field": null,
    "varID": null,
    "level": null,
    "dateTime": null,
    "connectionName": "JKZX",
    "Enforcement": true,
    "cycle": 5,
    'modelId': null,
    "st1Name": '',
})
let realDataIconSendParam = ref({ //监控中心图标的实时数据发送的参数
    "dbidList": [],
    "tableName": "redis",
    "handleCode": "实时数据安全警报",
    "field": null,
    "varID": null,
    "st1Name": '',
    "dateTime": null,
    "connectionName": "JKZX_ICON",
    "Enforcement": true,
    "cycle": 0,
    'modelId': null,
})
let twoLevelData = {
    sname: '',
    dbId: '',
}
let formValidate = ref({
    dbId: '',
})
let iconDataFlag = ref(true)
let isReciveRoomRealData = ref(true) //当隐藏房间标签的时候，不接受房间实时数据

//模型连接页面
let currentBindDbid = ref([]) //获取当前已经绑定的dbid

//控制房间标签显示隐藏使用
let iconList = ref([])
let st2Name = ''//子系统
let variableList = ref([])
let cameraList = ref([])
// let field=null
// let st1_name=null
let allData = null
let kjglName = null
let afreshGetData = ref(false) //刷新导航数据按钮动画
let saveAngleData = ref(null)
let wsInfo = ref(null)
let realDataInfoSendParam = ref({ //设备信息
    "dbidList": [],
    "tableName": "redis",
    "handleCode": "实时数据统计状态值安全警报",
    "field": null,
    "varID": null,
    "st1Name": '',
    "dateTime": null,
    "connectionName": "",
    "Enforcement": true,
    "cycle": 0,
    'modelId': null,
})
let systemAnddeviceInfoAlarmData = ref(true)//为了切换系统报警和单个设备报警
let ws = ref(null)

let props = defineProps({
    spaceData: {
        type: Array
    }
})
let websocket = ref(null)
let currFloorSname = ref('')
let currHotType = ref('温度')
watch(() => props.spaceData, (newV) => {
    treeData.value = newV || treeData.value
}, { deep: true })
onMounted(() => {
    nextTick(() => {
    getFloorData();
    //在监控中心才能请求实时数据，在模型连接页面不请求（因为跟模型链接公用一个导航）
    if (name == "monitoringCenter" || name == "modelConnection") {
        // websocketinit();
        // websocketIcon();
        // websocketDeviceInfo();
    }

    //监听
    window.addEventListener("db_id", async (e) => {
        let { dbId, modelId: modelId1 } = e.detail
        modelId.value = modelId1;
        //点击构件展开监控中心右侧模块并请求实时数据（）
        let currentData = await getSingleDeviceData(dbId, modelId1);
        if (Object.keys(currentData).length) {
            formValidate.value.dbId = dbId + ''

            clickDeviceArtifacts(currentData); //点击模型中设备构件触发
        }
        emitter.emit("showRightModule", { item: currentData }) //控制安全警报显示对应设备信息--nai
    },
        false
    );
    //接收鼠标悬停显示数据标签事件
    emitter.on('movehouseShowLabel', data => {
        if (data != null) {
            let dbId = data.dbId;
            movehouseShowLabel(dbId);
        } else {
            $('.meetRoom-markup').remove()
        }

    });
    emitter.on('deviceAlarm', e => {
        systemAnddeviceInfoAlarmData.value = false;
    });
    emitter.on('autoClick', currentData => {
        autoClick1()
    });
    emitter.on('deviceInfo', data => {
        if (data) {
            st2Name = data.sonName;
        }
    });
    emitter.on('right-modular', () => {
        window.yst_viewer.clearSelection(true);
        // //清除剖切面
        clearCutPlane()
        let realDataIconSendParam = { //监控中心图标的实时数据发送的参数
            "dbidList": [],
            "tableName": "redis",
            "handleCode": "实时数据统计状态值安全警报",
            "field": '空间管理',
            "varID": null,
            "st1Name": null,
            "dateTime": null,
            "connectionName": "JKZX_ICON",
            "Enforcement": true,
            "cycle": 0,
            'modelId': 0,
        }
        wsIcon.value?.readyState && wsIcon.value.send(JSON.stringify(realDataIconSendParam));
        let realDataSendParam = { //设备实时数据发送的参数
            "dbid": null,
            "tableName": "state",
            "handleCode": "实时数据统计状态值安全警报",
            "field": null,
            "varID": null,
            "level": null,
            "dateTime": null,
            "connectionName": "JKZX",
            "Enforcement": true,
            "cycle": 5,
            'modelId': null,
            "st1Name": '',
        }
        ws.value?.readyState && ws.value.send(JSON.stringify(realDataSendParam));
        // let ids = '';
        // this.realDataSendParam.field = null;
        // this.realDataSendParam.st1Name = null;
        // this.realDataSendParam.modelId = this.allData.modelId;
        // ws.value?.readyState && ws.value.send(JSON.stringify(this.realDataSendParam));
        // wsIcon.value?.readyState && wsIcon.value.send(JSON.stringify(this.realDataIconSendParam));    
    });
    //默认首先读取缓存中数据
    treeData.value = JSON.parse(localStorage.getItem("treeData")) || [];

    //查看设备信息中修改完设备编号以及设备名称时触发
    emitter.on('updateNav', () => {
        getFloorData();
    });

    //绑定成功或者解绑，让标签显示或者隐藏，isClear如果有值表示是解绑，空代表提交
    // this.$EventBus.$off('bindSuccessOrUnbind')
    emitter.on('bindSuccessOrUnbind', (param, currentType, isClear) => {
        if (child.value) {
            getLabelDbid(child.value) //请求已绑定dbid
        } else {
            getLabelDbid()
        }
    });

    emitter.on('controlRoomLabel', item => {
        isReciveRoomRealData.value = item
        if (item) {
            //显示房间标签
            clickNavShowRoomIcon(child.value)
        } else {
            //隐藏房间标签
            clickNavShowRoomIcon([])
        }
    })
    //请求已绑定变量设备数据用于标签显示
    emitter.on('getBindDeviceIcon', () => {
        if (name == "modelConnection") {
            child.value = {}
            clearVarLabel()
        }
    })
    emitter.on('saveAngle', item => {
        saveAngleData.value = item;
    })
    //请求已绑定变量设备数据用于标签显示
    // emitter.on('systemIcon',() => {
    // this.field = childSysData.sname;//一直改变
    // this.st1_name = this.st2Name;//上一级
    // emitter.emit("showRightModule", { item:data1 });

    // console.log(666666,this.allData)
    // this.realDataSendParam.field = this.allData.sname;
    // this.realDataSendParam.st1Name = this.kjglName;//始终为空间管理
    // this.realDataSendParam.modelId = this.allData.modelId;
    // ws.value?.readyState && ws.value.send(JSON.stringify(this.realDataSendParam));
    // emitter.emit("showRightModule", { item:this.allData });
    // })
    cleanAllLabel()
    emitter.on('getHotRealData', (param) => {
        currHotType.value = param
        // if(currFloorSname.value) {
        websocket.value.send(JSON.stringify({FloorName: currFloorSname.value}));
        // }
    })
})
})
let SubmenuOpen = ref(null)
//显示所有
const showAll = () => {
    emitter.emit('showAll')
    websocket.value.send(JSON.stringify({FloorName: ''}));
    activeIndex.value= Math.random()+'' //去除选中状态
}


//点击导航（设备）或者点击模型中设备
let clickDeviceArtifacts = (currentData) => {
    let { dbId, modelId, deviceId } = currentData || {};
    let params = JSON.parse(JSON.stringify(realDataInfoSendParam.value))
    params.dbid = dbId || deviceId
    params.modelId = modelId
    wsInfo.value?.readyState && wsInfo.value.send(JSON.stringify(params));
}
// 清除所有标签
let cleanAllLabel = () => {
    //清空页面上已绑定变量后显示的标签
    addConnectedIcon([])
    //清空房间标签
    clickNavShowRoomIcon([])
    //清空在线离线标签
    // window.iconClass?.showTiconClasss(true,[])
    showIcon([])
}



let AllMepDbIdList = []//所有机电dbdi集合
//获取左侧导航
let getFloorData = () => {
    http.post("modelTree/sqselectModel", {},
        { headers: { "Content-Type": "application/json" } }
    )
        .then((res) => {
            let { data } = res.data || {}
            if (data.allDataList.length) {
                let datas = toAddField(data.allDataList)
                localStorage.setItem("treeData", JSON.stringify(datas))
                treeData.value = datas;
                openNames.value = ['0']
                AllMepDbIdList = datas[0].allMepDbIdList
                setTimeout(() => {
                    SubmenuOpen.value.open(openNames.value)
                }, 2000)
            } else {
                treeData.value = []
            }
            setTimeout(() => {
                afreshGetData.value = false
            }, 2000)
        })
        .catch((error) => {
            afreshGetData.value = false
        });

}
let toAddField = (arr1) => {
    //为数据添加一些属性rightModel，好判断点击导航下一级右侧模块显示隐藏
    arr1.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
            animatList.value.push(item.sname) //将获取得数组放到本地缓存，用于自动浏览
            item.count = count.value++ //识别第几个数据，用于自动操作
            toAddField(item.children, item);
        } else {
            if (item.name == 'system' || item.name == 'floor') {
                delete item.children;
            }
        }

    });
    return arr1;
}
// 点击系统以及空间---------------
//点击楼栋----
let handlerClickBuild = (build) => {
    // do something...

}


let handleClickOneLevel = ({ sysData = {}, build = {} } = data) => {
    modelId.value = sysData.modelId;
    realDataSendParam.value.modelId = modelId.value;
    //空间管理
    if (sysData.sname === '空间管理') {
        //显示所有模型
        showAllModel()
        // defaultView()
        preservation();
        child.value = {}
        onModelLoaded([]) //清除热力图
        window['models'+sysData.modelId]?.setAllVisibility(true);
        AllMepDbIdList.forEach(item =>{
            window['models' + sysData.modelId].visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
    } else {
        //一体化冷水机组、风冷热泵 //排风系统//新风系统
        //获取所有模型并判断需要显示哪个模型
        excludeSpace(sysData.modelId, sysData.dbidList)
        child.value = sysData

        // var instanceTree = window['models' + sysData.modelId].getData().instanceTree.nodeAccess.dbIdToIndex;
        // let arr = [];
        // for (var key in instanceTree) {
        //     arr.push(Number(key))
        // }
        //先将所有的机电隐藏
        AllMepDbIdList.forEach(item =>{
            window['models' + sysData.modelId].visibilityManager.setNodeOff(item, true);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
        //再显示所点击的机电模型
        let ids = sysData.dbidList
        ids.forEach(item =>{
            window['models' + sysData.modelId].visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
        currFloorSname.value = ''
        onModelLoaded([],false) //清除热力图
    }
    //清空页面上已绑定变量后显示的标签
    addConnectedIcon([])

    //点击一级二级导航共同执行的方法(1代表系统空间这一层级)
    clickOneLevelOrTwoLevel(sysData, build, 1)


    //点击导航将设备联网设定的数据清除
    emitter.emit('clearSetData');

    // 清空房间标签
    clickNavShowRoomIcon([])

    //隐藏房间标签控制按钮
    emitter.emit('showRoomControlBtn', false)
    emitter.emit('showJiGuiControlBtn', false)//显示控制引线数据标签
    emitter.emit('showControlIcon', false)//显示控制面板按钮
    emitter.emit('controlBtns', false)//设备控制按钮

    //点击系统和空间实时数据部分
    sysAndSpaceRealData(sysData, build, 1)
}

//点击子系统
let handleClickTwoLevel = ({ childSysData = {}, sysData = {} } = data) => {
    // this.st2Name = childSysData.sname;
    // this.modelId =childSysData.modelId;
    if (sysData.sname === '空间管理') { //点击楼层
        let { modelId, bottom, top,sname } = childSysData
        floorData = childSysData;//楼层默认隐藏管道，直接切换至子系统时会显示不完整，获取不到楼层管道的dbids
        let roomDbids = childSysData.children;//房间信息
        showAllModel();//防止导航全部展开情况下，从子系统切换至楼层显示不完整问题
        // preservation();//防止从子系统切换至楼层视角保持子系统问题
        clickNavShowRoomIcon(childSysData)//显示房间标签
        cutPlanModel(modelId, bottom, top, roomDbids)

        onModelLoaded([]) //清除热力图

        emitter.emit('showRoomControlBtn', true)//显示控制房间标签
        // emitter.emit('showJiGuiControlBtn', true)//显示控制引线数据标签
        // emitter.emit('showCameraControlBtn', true)//显示控制摄像头标签
        // emitter.emit('showControlIcon', true)//显示控制面板按钮
        emitter.emit('theConduit', { item: false, data: childSysData })//管道控制


        emitter.emit('sendTFGrealData', childSysData)
        clickFloor(childSysData, sysData, 2);
        getLabelDbid(childSysData) //请求已绑定dbid
        appContext.config.globalProperties.$cutPlan = true;
        currFloorSname.value = sname
        websocket.value?.send(JSON.stringify({FloorName: currFloorSname.value}));
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
        defaultView(window.yst_viewer, obj[sname], true)
        

    } else { //点击子系统
        emitter.emit('theConduit', { item: true, data: floorData })//从楼层直接点击子系统导航的数据不是之前楼层的数据，所以用变量floorData
        clickNavShowRoomIcon([]);//防止从楼层直接切换至子系统无法清除房间标签问题
        //获取所有模型并判断需要显示哪个模型
        excludeSpace(childSysData.modelId, childSysData.ids)
        //在模型连接页面才请求

        getLabelDbid(childSysData) //请求已绑定dbid

        // this.bindMainDefaultMenu(childSysData);
        childSys(childSysData, sysData, 2)
        //右侧模块实时数据
        clickDeviceArtifacts(childSysData)
        emitter.emit('showControlIcon', false)//显示控制面板按钮
        appContext.config.globalProperties.$cutPlan = false;
        // var instanceTree = window['models' + childSysData.modelId].getData().instanceTree.nodeAccess.dbIdToIndex;
        // let arr = [];
        // for (var key in instanceTree) {
        //     arr.push(Number(key))
        // }
        AllMepDbIdList.forEach(item =>{
            window['models' + childSysData.modelId].visibilityManager.setNodeOff(item, true);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
        let ids = childSysData.ids
        ids.forEach(item =>{
            window['models' + sysData.modelId].visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
        
        systemAnddeviceInfoAlarmData.value = true;

        currFloorSname.value = ''
        onModelLoaded([],false) //清除热力图
    }

    child.value = childSysData

    //点击一级二级导航共同执行的方法(2代表子系统和楼层这一层级)
    clickOneLevelOrTwoLevel(childSysData, sysData, 2)

    
}
//点击系统和空间实时数据部分
let sysAndSpaceRealData = (data1, data2, level) => {
    //图标（报警、离在线）实时数据
    let realDataIcon = JSON.parse(JSON.stringify(realDataIconSendParam.value))
    realDataIcon.field = data1.sname //点击哪个导航就赋值导航的名
    realDataIcon.handleCode = "实时数据统计状态值安全警报"
    realDataIcon.st1Name = null //当前导航上一级
    realDataIcon.modelId = Number(data1.modelId);
    wsIcon.value?.readyState && wsIcon.value.send(JSON.stringify(realDataIcon));
    //系统其他实时数据（引线标签）
    let realData = JSON.parse(JSON.stringify(realDataSendParam.value))
    realData.handleCode = "实时数据统计状态值安全警报"
    realData.field = data1.sname
    realData.st1Name = null//空间管理需要显示设备监控所以为空间管理添加
    realData.level = data1.sname == '空间管理' ? null : level + ''
    realData.modelId = data1.modelId;
    ws.value?.readyState && ws.value.send(JSON.stringify(realData));
    //系统右侧模块（设备监控、安全警报）实时数据
    let realData1 = JSON.parse(JSON.stringify(realDataSendParam.value))
    realData1.handleCode = "实时数据统计状态值安全警报"
    realData1.field = data1.sname
    realData1.st1Name = null//空间管理需要显示设备监控所以为空间管理添加
    realData1.level = level + ''
    realData1.modelId = data1.modelId;
    wsInfo.value?.readyState && wsInfo.value.send(JSON.stringify(realData1));
}
// 子系统报警标签及右侧设备实时数据
let childSys = (childSysData, sysData, level) => {
    //图标（报警、离在线）实时数据
    let realDataIcon = JSON.parse(JSON.stringify(realDataIconSendParam.value))
    realDataIcon.field = childSysData.sname; //点击哪个导航就赋值导航的名
    realDataIcon.st1Name = childSysData.st1name; //始终是上一级
    realDataIcon.modelId = Number(modelId.value);
    wsIcon.value?.readyState && wsIcon.value.send(JSON.stringify(realDataIcon));
    //变量实时数据标签
    let realData1 = JSON.parse(JSON.stringify(realDataSendParam.value))
    realData1.dbid = childSysData.deviceId
    realData1.handleCode = "实时数据序列数据"
    realData1.field = childSysData.sname //点击哪个导航就赋值导航的名
    realData1.st1Name = sysData.sname//空间管理需要显示设备监控所以为空间管理添加,始终是上一级
    realData1.level = level + ''
    realData1.cycle = 0
    realData1.modelId = childSysData.modelId + '';
    ws.value?.readyState && ws.value.send(JSON.stringify(realData1));
}
//点击楼层显示该楼层所有报警、实时数据标签
let clickFloor = (childSysData, sysData, level) => {
    //图标（报警、离在线）实时数据
    let realDataIcon = JSON.parse(JSON.stringify(realDataIconSendParam.value))
    realDataIcon.field = childSysData.sname; //点击哪个导航就赋值导航的名
    realDataIcon.st1Name = sysData.sname;
    realDataIcon.modelId = Number(modelId.value);
    wsIcon.value?.readyState && wsIcon.value.send(JSON.stringify(realDataIcon));
    //系统右侧模块（设备监控、安全警报）实时数据
    let realData = JSON.parse(JSON.stringify(realDataSendParam.value))
    realData.dbid = childSysData.deviceId
    realData.handleCode = "实时数据统计状态值安全警报"
    realData.field = childSysData.sname //点击哪个导航就赋值导航的名
    realData.st1Name = sysData.sname//空间管理需要显示设备监控所以为空间管理添加,始终是上一级
    realData.level = level + ''
    realData.cycle = 0
    realData.modelId = childSysData.modelId;
    ws.value?.readyState && ws.value.send(JSON.stringify(realData));
}


//热力图实时数据

let connectWebsocket = () => {
    if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
    } else {
        // 打开一个websocket
        let user_id = localStorage.getItem('user_id');
        websocket.value = !websocket.value && new WebSocket(`${appContext.config.globalProperties.$ws}/webSocketServerSensor/${user_id}`);
        // 建立连接
        websocket.value.onopen = () => {
            // 发送数据
            websocket.value.send(JSON.stringify({FloorName: ''}));
            console.log("websocket发送数据中");
        };
        // 客户端接收服务端返回的数据
        websocket.value.onmessage = evt => {
            // console.log(JSON.parse(evt.data))
            // { damp,roomName, temp }
            // let data = JSON.parse(evt.data) || {}
            
            let { roomdbis, sensor } = JSON.parse(evt.data) || {}
            if(!roomdbis?.length || !Object.keys(sensor)?.length) return 
            let devicedbids = Object.keys(sensor)
            let tempData=[],humpData=[]
            devicedbids.forEach( item => {
                tempData.push((sensor[item].find( o => o.variable_name.includes('温度')).value)/100)
                humpData.push((sensor[item].find( o => o.variable_name.includes('湿度')).value)/100)
            })
            let roomdbis1 = roomdbis.map( o => o*1 )
            let currTypeData = []
            if(currHotType.value=='温度') {
                currTypeData = tempData
            }else if(currHotType.value=='湿度') {
                currTypeData = humpData
            }
            if(!currFloorSname.value) return
            // onModelLoaded(roomdbis1,true)
            wsdPos(devicedbids)
            updataHot(currTypeData)
            //  onModelLoaded([],false)
        };
        // 发生错误时
        websocket.value.onerror = evt => {
            console.log("websocket错误：", evt);
        };
        // 关闭连接
        websocket.value.onclose = evt => {
            console.log("websocket关闭：", evt);
        };
    }
}
connectWebsocket()
let personPositionWs = ref(null)
//导航一级、二级共同执行的逻辑
let clickOneLevelOrTwoLevel = (data1, data2, level) => {

    //实时数据发送
    // this.websocketRealDataSend(data1,data2,level)
    // this.websocketRealDataIconSend(data1,data2,level)
    
    //清除显示设备状态在线离线标签
    // $('._groupwarning').empty();
    personPositionWs.value?.send(JSON.stringify({FloorName: data1.sname}));
    //清楚构件右键菜单（我要报修、设备信息）
    $(".followButton-markup").remove();
    //控制监控中心右侧的模块
    emitter.emit("showRightModule", { item: data1 });
    emitter.emit('preventDragVarBind', { level }) //限制变量挂接，必须在楼层或者子系统下绑定
    emitter.emit('clearHeatMap')
    //清除人员定位标签
    window.personnelPosition?.showLabel([])
    //删除人员轨迹
    emitter.emit('clearPath')
}
let preservation = () => {
    http.post('model/getCoordinate', {}, { headers: { 'Content-Type': 'application/json' } }
    ).then((response) => {
        let data = response.data.data;
        //请求成功直接用数据库保存的，如果没成功用模型中默认的
        if (data.posX == 0 && data.posY == 0 && data.posZ == 0) {
            defaultView(window.yst_viewer, saveAngleData.value, false);
        } else {
            defaultView(window.yst_viewer, data, true)
        }
    }).catch((error) => {
        console.log(error);
    });
}
//除去空间管理逻辑
let excludeSpace = (modelId, ids) => {
    //清除剖切面
    clearCutPlane()

    //设置模型透明度
    setModelOpacity()
    //获取所有模型并判断需要显示哪个模型
    hideOtherModal(modelId, ids)
}
let websocketinit = () => {
    let user_id = localStorage.getItem('user_id');
    ws.value = ws.value ? ws.value : new WebSocket(appContext.config.globalProperties.$ws + "/websocket/JKZX" + user_id);
    ws.value.onopen = () => {
        ws.value.send(JSON.stringify({ //设备实时数据发送的参数
    "dbid": null,
    "tableName": "state",
    "handleCode": "实时数据统计状态值安全警报",
    "field": null,
    "varID": null,
    "level": null,
    "dateTime": null,
    "connectionName": "JKZX",
    "Enforcement": true,
    "cycle": 5,
    'modelId': null,
    "st1Name": '',
}));
        console.log("监控中心实时数据...");
    };
    ws.value.onmessage = (evt) => {
        if (evt.data) {
            let list = JSON.parse(evt.data)['JKZX' + user_id];
            if (list) {
                let variableList = [];
                let showlanguageList = [];
                if (list.hasOwnProperty('realData')) {
                    let arr = list.realData;
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].IcLabelConf != 'null') {
                            if (arr[i].IcLabelConf.labelType == 1 && arr[i].variableList.length) {
                                arr[i].variableList = arr[i].variableList.filter(item => item.visible)
                                arr[i].variableList.forEach((item) => {
                                    let findData = item.switchDescribs.find(o => o.value == item.value * 1)
                                    item.fkAlias = (findData && findData.describ) || ""
                                    item.unit = judgeUnit(item.variable_name)

                                    item.value = item.variable_type == '模拟量' ? ((item.value) * 1).toFixed(1) : ((item.value) * 1)
                                })
                                variableList.push(arr[i])
                            }
                            if (arr[i].IcLabelConf.labelType == 2) {
                                arr[i].variableList.forEach((item) => {
                                    item.unit = judgeUnit(item.variable_name)
                                })
                                showlanguageList.push(arr[i])
                            }
                        }
                    }

                }
                let variable = variableList;
                if (variable.length > 0) {
                    variable.forEach(item => {
                        item.variableList.sort(function (a, b) {
                            return (a.variableSort - b.variableSort)
                        });
                    })
                }
                //离在线报警故障标签数据
                let iconList = list.deviceIconDbids;
                if (iconList.length > 0) {
                    showIcon(iconList);
                }
                variableList.value = variable;//悬停显示标签需要
                emitter.emit("AllData", list); //获取得设备信息发送到右侧设备信息
                if (systemAnddeviceInfoAlarmData.value) {
                    emitter.emit("deviceAlarmData", list); //该系统的报警列表
                }
                // showVariableLabel(variable)//持久化显示标签需要
                // languageShowLabel(showlanguageList)//显示文字样式标签

            }
        }
    };
    ws.value.onclose = (e) => {
        console.log("监控中心实时数据websocket断开");
        ws.value = null;
    };
    ws.value.onerror = (err) => {
        console.log("监控中心实时数据websocket服务出错了---onerror");
    };
    // 路由跳转时结束websocket链接
    // this.$router.afterEach(() => {
    //     ws.value && ws.value.close();
    // });
}
let websocketIcon = () => {
    let user_id = localStorage.getItem('user_id');
    wsIcon.value = wsIcon.value ? wsIcon.value : new WebSocket(appContext.config.globalProperties.$ws + "/websocket/JKZX_ICON" + user_id);
    wsIcon.value.onopen = () => {
        wsIcon.value.send(JSON.stringify(realDataIconSendParam.value));
        console.log("监控中心ICON数据...");
    };
    wsIcon.value.onmessage = (evt) => {
        if (!iconDataFlag.value) return //当浏览器离开tab页面时不接收数据
        let data = JSON.parse(evt.data)
        // if(data.hasOwnProperty('shexiangtou')){
        //     data = data.shexiangtou
        //     for(let h=0;h<data.length;h++){
        //         if(data[h].subSpaRelations == '视频监控'){
        //             this.cameraList = data[h].value;
        //         }
        //     }

        // }else{
        cameraList.value = []
        iconList.value = JSON.parse(evt.data)['JKZX_ICON' + user_id] || {};
        // window.iconClass?.showTiconClasss(true,[])

        for (let h = 0; h < iconList.value?.shexiangtou?.length; h++) {
            if (iconList.value.shexiangtou[h].subSpaRelations == '视频监控') {
                cameraList.value = iconList.value.shexiangtou[h].value;
            }
        }
        //因为房间也可能绑定变量，但是不需要显示标签
        if (child.value && name != 'modelConnection') {
            // if(this.child && this.child.name!=='floor') {
            // 0  是lost   1  是good   2 是error   3  是 good && error
            // window.iconClass?.showTiconClasss(true,iconList.value.devValue)
        } else {
            // if(this.isReciveRoomRealData) { //不隐藏房间显示全部
            //     let roomInfo = this.child || [];
            //     this.iconList.forEach( item => {
            //         let currIndex = roomInfo?.keyAndValuesList?.findIndex( opt => opt.dbId == item.dbid)
            //         if(currIndex>=0) {
            //             roomInfo[currIndex].value = item.value;
            //         }
            //     })
            //     clickNavShowRoomIcon(roomInfo);
            // }else{ //隐藏房间只显示变量
            //     clickNavShowRoomIcon(this.iconList);
            // }

        }
        // }
        // addCamera();
    };
    wsIcon.value.onclose = (e) => {
        console.log("websocket断开");
        wsIcon.value = null;
    };
    wsIcon.value.onerror = (err) => {
        console.log("websocket服务出错了---onerror");
    };
}
//请求设备信息右侧模块实时数据
let websocketDeviceInfo = () => {
    let user_id = localStorage.getItem('user_id');
    wsInfo.value = wsInfo.value ? wsInfo.value : new WebSocket(appContext.config.globalProperties.$ws + "/devinformation/" + user_id);
    
    wsInfo.value.onopen = () => {
        wsInfo.value.send(JSON.stringify(realDataInfoSendParam.value));
        console.log("右侧设备数据实时数据...");
    };
    wsInfo.value.onmessage = (evt) => {
        if (evt.data) {
            let list = JSON.parse(evt.data)[user_id];
            list?.deviceInFo?.forEach(item => {
                let findData = item.switchDescribs.find(o => o.value == item.value * 1)
                item.fkAlias = (findData && findData.describ) || ""
                item.value = item.variable_type == '模拟量' ? ((item.value) * 1).toFixed(1) : ((item.value) * 1)
            })
            if (list) {
                emitter.emit("deviceData", list); //获取得设备信息发送到右侧设备信息
                if (systemAnddeviceInfoAlarmData.value == false) {
                    emitter.emit("deviceAlarmData", list); //单个设备的报警记录
                }
            }
        }
    };
    wsInfo.value.onclose = (e) => {
        console.log("右侧设备实时数据websocket断开");
        wsInfo.value = null;
    };
    wsInfo.value.onerror = (err) => {
        console.log("右侧设备实时数据websocket服务出错了---onerror");
    };
}
//长显
// let showVariableLabel = (data) => {
//     window?.yst_viewer?.unloadExtension('jiGuiIcon');
//     window?.yst_viewer?.loadExtension('jiGuiIcon', {
//         icons: data || [],
//         onClick: (dbid, name) => {

//         },
//         dbClick: (dbid, curretElement) => {

//         },
//         onMouseOver: (id) => { }
//     })
// }
//鼠标移动显示
let movehouseShowLabel = (dbId) => {
    if (variableList.value.length > 0) {
        window?.yst_viewer?.unloadExtension('movehouseShowIcon');
        window?.yst_viewer?.loadExtension('movehouseShowIcon', {
            icons: { list: variableList.value || [], dbId: dbId },
            onClick: (dbid, name) => {

            },
            dbClick: (dbid, curretElement) => {

            },
            onMouseOver: (id) => { }
        })
    }
}
//文字显示变量数据
// let languageShowLabel = (list) => {
//     // if(list.length > 0){
//     window.yst_viewer?.unloadExtension("labelwenzi");
//     window.yst_viewer?.loadExtension("labelwenzi", {
//         button: {
//             icon: "fa-thermometer-half",
//             tooltip: "",
//         },
//         icons: list,
//         onClick: (id) => { },
//         onMouseOver: (id) => { },
//     });
//     // }

// }
//摄像头
// let addCamera = () => {
//     window.yst_viewer && window.yst_viewer.unloadExtension("cameraIcon");
//     window.yst_viewer && window.yst_viewer.loadExtension("cameraIcon", {
//         button: {
//             icon: "fa-thermometer-half",
//             tooltip: "",
//         },
//         icons: cameraList.value,
//         onClick: (id, modelId) => {
//             // let formdata = new FormData();
//             // formdata.append('dbid',id);
//             // this.$localUrl.post('camera/getCamera',formdata,{headers: {'Content-Type': 'application/json'}}
//             // ).then((res)=> {
//             //     let videoUrl = res.data.data;
//             //     this.openCamera(videoUrl);

//             // }).catch((error)=> {
//             //     console.log(error);
//             // });
//             emitter.emit('showCameraIcon', { dbid: id, modelId: modelId });
//         },
//         onMouseOver: (id) => { },
//     });
// }
//点击图标手动刷新导航数据
let handleUpdate = () => {
    afreshGetData.value = true
    getFloorData()
}
//开启自动操作 APP中
let autoClick1 = () => {
    let len = animatList.value.length - 1
    if (startIndex.value > len) {
        router.push({ name: 'energyAnalysis' })
    } else {
        treeData.value = this.filterCurr(treeData.value, startIndex.value)
    }
    startIndex.value++;
}
//清空页面上已绑定变量后显示的标签
let clearVarLabel = (param) => {
    addConnectedIcon([]) //点击清空房间标签
}
//只要变量挂接到构件成功就显示标签，点击标签弹出配置变量弹窗
let addConnectedIcon = (list) => {
    if (name === 'modelConnection') {
        window?.configPointLabel?.showConfigPointLabel(list)
    } else {
        window?.configPointLabel?.showConfigPointLabel([])
    }
    if (window?.configPointLabel) {
        window.configPointLabel.onClick = (dbid, modelId) => {
            emitter.emit('openConfigVarModel', { dbid, modelId })
        }
    }

}
//q请求已经绑定变量的dbid
let getLabelDbid = (childrenArray) => {
    if (name != "modelConnection") return
    let st2name = childrenArray?.sname || ''
    let formDatas = new FormData();
    formDatas.append("seekKey", st2name)
    http.post('PointEquiment/bindLabel', formDatas
    ).then((res) => {
        if (res.data.message == 'true') {
            currentBindDbid.value = res.data.data.list;
            addConnectedIcon(currentBindDbid.value);
        }
    }).catch((error) => {
        console.log(error);
    });
}
let showIcon = (data) => {
    // window.yst_viewer && window.yst_viewer.unloadExtension("deviceIcon");
    // window.yst_viewer && window.yst_viewer.loadExtension("deviceIcon", {
    //     button: {
    //         icon: "fa-thermometer-half",
    //         tooltip: "",
    //     },
    //     icons: data,
    //     onClick: (id, modelId) => {

    //     },
    //     onMouseOver: (id) => { },
    // });
}
//人员定位数据

const personPositionData = (sname) => {
    let user_id = localStorage.getItem('user_id');
    personPositionWs.value = personPositionWs.value 
    ? personPositionWs.value 
    // : new WebSocket(appContext.config.globalProperties.$personPositionws + "/webSocketPersonnel/"+user_id);
    : new WebSocket( personnelPositionWs + "webSocketPersonnel/"+user_id);
    personPositionWs.value.onopen = () => {
        // personPositionWs.value.send(JSON.stringify({floorName: }));
        console.log("人员定位...");
    };
    personPositionWs.value.onmessage = (evt) => {
        let data = JSON.parse(evt.data)
        // 显示人员位置
        window.personnelPosition?.showLabel(data)
    };
    personPositionWs.value.onclose = (e) => {
        console.log("人员定位websocket断开");
        personPositionWs.value = null;
    };
    personPositionWs.value.onerror = (err) => {
        console.log("人员定位websocket服务出错了---onerror");
    };
}
personPositionData()


onMounted(() => {
    emitter.off('autoClick');
    clearVarLabel()
    wsIcon.value && wsIcon.value.close()
    ws.value && ws.value.close()
    wsInfo.value && wsInfo.value.close()

    // window.iconClass?.showTiconClasss(true,[])
    $('.followButton-markup-wenzi').remove();
    $('.jiGui-markup').remove();
})
onBeforeUnmount(() => {
    websocket.value?.close()
    personPositionWs.value?.close()
})
onBeforeMount(() => {
    showIcon([])
})
</script>
<style lang="scss" scoped>
.l_tree_container {
    top: 100px;
    max-height: 85%;
    overflow: hidden;
    z-index: 10;
    left: 30px;
    position: absolute;
    display: inline-block;
    &:hover {
        overflow: auto;
        &::-webkit-scrollbar {
            width: 3px; /*对垂直流动条有效*/
            height: 3px; /*对水平流动条有效*/
            cursor: pointer;
        }
        /*定义滑块颜色、内阴影及圆角*/
        &::-webkit-scrollbar-thumb{
            border-radius: 7px;
            // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: rgba(152, 154, 156,0.1);
        }
    }
    .all-icon {
        img {
            width: 40Px;
            height: 40Px;
        }
        p {
            color: #00FFFF;
            font-size: 18px;
            margin: 10px 0 20px;
        }
        cursor: pointer;
    }
    /*定义两端按钮的样式*/
    &::-webkit-scrollbar-button {
        background-color: transparent;
    }
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    .demo-spin {
        position: absolute;
        left: 5px;
        top: 11Px;
        z-index: 1000;
        cursor: pointer;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }

        50% {
            transform: rotate(180deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
}

.build-group {
    max-height: calc(100% - 100px);
    height: auto;
    overflow-y: auto;
    width: auto !important;
    border: none;
    background-color: transparent;
    // min-width: 125Px !important;
    // max-width: 200Px;
    color: #303447;
    // border-radius: 100px;
    &.ivu-menu-light {
        background: transparent;
    }

    &:after {
        display: none;
    }

    &.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        background: transparent;

        &::after {
            background: transparent;
        }
    }

    :deep(.ivu-menu-submenu-title) {
        // background: linear-gradient(270deg, rgba(10, 178, 237, 0) 0%, rgba(5, 127, 171, 0.32) 42%, #005C7B 100%);
        background: #F1F2F4;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        border-radius: 40px;

    }

    :deep(.ivu-menu-item),
    :deep(.ivu-menu-submenu-title) {
        padding: 0Px 1.5rem;
        height: 32Px;
        line-height: 32Px;
    }

    :deep(.ivu-menu-submenu) {
        margin-bottom: 10Px;
    }

    :deep(.ivu-menu) {
        li {
            background: transparent !important;
            padding-left: 1.5rem !important;

            &:after {
                display: none !important;
            }
        }

        .ivu-menu-item-active {
            color: #00BCFF;
        }
    }

    :deep(.ivu-menu-opened) {
        &>.ivu-menu-submenu-title {
            color: #00BCFF;
            margin-bottom: 5Px;
        }
    }

    &::-webkit-scrollbar {
        width: 0px;
        /*对垂直流动条有效*/
        height: 5px;
        /*对水平流动条有效*/
        cursor: pointer;
    }

    :deep(li) {
        .ivu-icon {
            display: none;
        }
    }
}

.l_tree_container.monitoringCenter {
    // left: 30px;
    color: #FFF;

    .ivu-menu {
        color: #FFF;

        :deep(.ivu-menu-submenu-title) {
            background: linear-gradient(270deg, rgba(10, 178, 237, 0) 0%, rgba(5, 127, 171, 0.32) 42%, #005C7B 100%);
        }

        :deep(.ivu-menu-opened) {
            .ivu-menu {
                position: relative;
                color: #FFF;
                padding-top: 10px;

                &:before,
                &:after {
                    background: #0088B8;
                }

                li {
                    &::before {
                        background: #0088B8;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>
:deep(.ivu-menu-vertical .ivu-menu-item:hover),
:deep(.ivu-menu-vertical .ivu-menu-submenu-title:hover) {
    color: #00BCFF;
}
</style>
