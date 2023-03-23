<template>
    <div class="model-content">
        <div id="viewer-local">
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import emitter from '@/common/mybus.ts'
import { defaultView, buildModelTree, showAllModel, goHideRoomMask, setModelOpacity } from '@/common/bim-utils.js'
import '@/assets/js/index.js'
import {http} from '@/common/request.js'
let { appContext } = getCurrentInstance() as any

let { name, path } = useRoute()

import { onModelLoaded, wsdPos, updataHot } from './hot.js'


let options = {
    env: "Local",
    document: "svf/JZ/3d.svf",
}
let piecesNumber1 = ref(null)
let viewer = ""
let other_list = []
let modelId = null
let update = false
let JZmodels = ""
let JDmodels = ""
let JGmodels = ""
let NZmodels = ""
let MQmodels = ""
let QZYmodels = ""
///////
let roomsData = []
let isUpload = false
let posX = null
let posY = null
let posZ = null
let centerX = null
let centerY = null
let centerZ = null
let upX = null
let upY = null
let upZ = null
let angle = {}
let CustomToolExtension = {}

watch(() => path, () => {
    routerChange()
})
let postionInfo = [
    {name:1 ,pos:{x: -4.439651432683625, y: 36.191368888933496, z: -4.183071136474609}},
    {name:2 ,pos:{x: -4.332670217767074, y: 36.43417932924389, z: -4.183071136474609}},
    {name:3 ,pos:{x: -4.282847288176086, y: 36.7988220889918, z: -4.183071136474609}},
    {name:4 ,pos:{x: -4.233024358585098, y: 37.16346484873968, z: -4.183071136474624}},
    {name:5 ,pos:{x: -4.183201428994096, y: 37.52810760848758, z: -4.183071136474609}},
    {name:6 ,pos:{x: -4.169038904375306, y: 37.811813554798675, z: -4.183071136474624}},
    {name:7 ,pos:{x: -4.269192950407621, y: 38.33918413998476, z: -4.183071136474624}},
    {name:8 ,pos:{x: -3.8397435301903755, y: 35.54045758718077, z: -4.183071136474624}},
    {name:9 ,pos:{x: -3.4816149199175044, y: 32.579857407503155, z: -4.183071136474609}},
    {name:0 ,pos:{x: -3.3584384329807904, y: 28.079749375397295, z: -4.183071136474609}},
    {name:11 ,pos:{x: -3.6358781301733742, y: 25.689123684035625, z: -4.183071136474609}},
    {name:12 ,pos:{x: -3.520545185821568, y: 22.932146835796914, z: -4.183071136474609}},
    {name:13 ,pos:{x: -3.312393551172015, y: 20.134274481557483, z: -4.183071136474624}},
    {name:14 ,pos:{x: -3.4891710154819364, y: 15.959622100327898, z: -4.183071136474624}},
    {name:15 ,pos:{x: -3.0953820002368744, y: 13.079958734087096, z: -4.183071136474609}},
    {name: 16,pos:{x: 2.696162402629857, y: 12.364553696174376, z: 1.2545935593417141}},
]
onMounted(() => {
    //测试
    $('#viewer-local').on('click', function(ev) {
        let intersections = [];
        const bounds = document.getElementById('viewer-local').getBoundingClientRect();
        window.yst_viewer.impl.castRayViewport(window.yst_viewer.impl.clientToViewport(ev.clientX - bounds.left, ev.clientY - bounds.top), false, null, null, intersections);
        if (intersections.length > 0) {
            const intersection = intersections[0];
            // $('#issue-part').val(intersection.dbId);
            // $('#issue-position-x').val(intersection.point.x.toFixed(2));
            // $('#issue-position-y').val(intersection.point.y.toFixed(2));
            // $('#issue-position-z').val(intersection.point.z.toFixed(2));
            
            
        }
    });
    
    
    
    (window as any).member_shadow = false;//控制构件阴影
    setTimeout(() => {
        if ((window as any).yst_viewer) {
            NOP_VIEWER.setEnvMapBackground(false);
            NOP_VIEWER.impl.renderer().setClearAlpha(0); //clear alpha channel
        }
    }, 500);
    emitter.on("update", (param) => {
        update = param.falg;
    });
    emitter.on("update1", (param) => {
        update = param.falg;
    });
    emitter.on("model_default", (param) => {
        var count1 = param.url;
        defaultRequest(param);
    });
    emitter.on("urls", (param) => {
        var params = param.url;
        if (z_index == "-1") {
            defaultRequest(param);
        } else {
            for (var h = 0; h < params.length; h++) {
                //更新时用
                var str = params[h].classify;
                isUpload = true;
                switch (true) {
                    case str.includes("建筑")://建筑
                        // viewer.unloadExtension('uploadjz');
                        if (update) {
                            window.updateJZ = true;
                        }
                        window.jz_url = params[h].url;
                        window.update_jzurl = params[h].url;
                        viewer.loadExtension("uploadjz");
                        // window.dispatchEvent(new CustomEvent('uploadARC'));
                        break;
                    case str.includes("机电")://机电
                        // viewer.unloadExtension('uploadjd');
                        if (update) {
                            window.updateJD = true;
                        }
                        window.jd_url = params[h].url;
                        window.update_jdurl = params[h].url;
                        viewer.loadExtension("uploadjd");
                        // window.dispatchEvent(new CustomEvent('uploadMEP'));
                        break;
                    case str.includes("结构"):
                        viewer.unloadExtension('uploadjg');
                        if (update) {
                            window.updateJG = true;
                        }
                        window.jg_url = params[h].url;
                        window.update_jgurl = params[h].url;
                        viewer.loadExtension("uploadjg");
                        break;
                    case str.includes("nz"):
                        // viewer.unloadExtension('uploadjs');
                        if (update) {
                            window.updateNZ = true;
                        }
                        window.nz_url = params[h].url;
                        window.update_nzurl = params[h].url;
                        viewer.loadExtension("uploadjs");
                        break;
                    case str.includes("mq"):
                        // viewer.unloadExtension('uploadmq');
                        if (update) {
                            window.updateMQ = true;
                        }
                        window.mq_url = params[h].url;
                        window.update_mqurl = params[h].url;
                        viewer.loadExtension("uploadmq");
                        break;
                    case str.includes("qzy"):
                        // viewer.unloadExtension('uploadqzy');
                        if (update) {
                            window.updateQZY = true;
                        }
                        window.qzy_url = params[h].url;
                        window.update_qzyurl = params[h].url;
                        viewer.loadExtension("uploadqzy");
                        break;
                }
            }
        }
    });
})
// let i=0
// let timer = setInterval(() => {
//         let arr = []
//         if(i>=postionInfo.length-1) {
//             i=0
//         }else{
//             i++
//         }
//         arr.push(postionInfo[i])
//         window.personnelPosition?.showLabel(arr)
//     },2000)
let routerChange = () => {
    
}
let preservation = () => {
    
}

let default1 = () => {
    let formData = new FormData();
    // formData.append('companyName','ZSH');
    // formData.append('projectName','runhuayou');
    http.get("model/modelDefault",{headers: { "Content-Type": "application/json" },
        }).then((res) => {
            var tabledata = res.data.data.list;
            if (tabledata != "") {
                
                defaultRequest({
                    url: JSON.parse(JSON.stringify(tabledata)),
                });
            }
        });
}
default1()
//加载默认模型
let noMepModel = ref([])
let defaultRequest = (param) => {
    var mo_list = param.url;
    console.log(param)
    noMepModel.value = mo_list.filter(item => item.classify!='机电')
    window.JDModelID = mo_list.filter(item => item.classify=='机电')
    console.log(window.JDModelID)
    if (
        mo_list[0].classify == "建筑" ||
        mo_list[0].classify == "机电" ||
        mo_list[0].classify == "结构" ||
        mo_list[0].classify == "内装" ||
        mo_list[0].classify == "幕墙" ||
        mo_list[0].classify == "全专业"
    ) {
        var defaultjz = mo_list[0].url;
        // mo_list.splice(0,1);
        // mo_list.slice(1);
        other_list = mo_list.slice(1);
        initializeViewer(defaultjz);
    } else {
        document.getElementsByClassName(
            "adsk-viewing-viewer"
        )[0].style.opacity = "0";
    }
}

let initializeViewer = (jz_url) => {
    var myViewerDiv = document.getElementById("viewer-local");
    Autodesk.Viewing.Private.InitParametersSetting.alpha = true; //渲染viewer时提前设置

    viewer = new Autodesk.Viewing.Private.GuiViewer3D(myViewerDiv);
    var options = {
        env: "Local",
        offline: "true",
        useADP: false,
    };
    Autodesk.Viewing.Initializer(options, function () {
        globalPromise(
            viewer,
            options,
            onLoadSuccess,
            onLoadError,
            jz_url
        );
    });
}

let globalPromise = (viewer, modelArray, success, error, jz_url) => {
    var startedCode = viewer.start();
    if (startedCode > 0) {
        console.error(
            "Failed to create a Viewer: WebGL not supported."
        );
        return;
    }
    viewer.loadModel(
        appContext.config.globalProperties.$baseURL + jz_url + "/3d.svf",
        undefined,
        onLoadSuccess,
        onLoadError
    );
}
let onLoadError = () => {

}

let onLoadSuccess = () => {
    console.log('load JZ success')
    window.yst_viewer = viewer;
    window.selectDbid = true;//防止点击构件请求实时数据时触发默认模型定位功能
    window.edge_line = false;//控制模型线的隐藏
    // window.Ghosting = false;//配合设置透明度时无法隐藏模型线的问题,改为false,强行隐藏,但是会影响透明度设置,所以根据项目更改
    viewer.autocam.shotParams.destinationPercent = 1;
    viewer.autocam.shotParams.duration = 1;
    //触摸屏或者移动端，触发选中构件发送实时数据右侧弹窗展示功能
    window.addEventListener("touchend", () => {
        setTimeout(()=>{
            let selectCurr = viewer?.getAggregateSelection()[0]
            if(selectCurr){
                var id = selectCurr.selection[0];     
                let url = selectCurr.model.loader.basePath
                let modelId = url.split('/')[url.split('/').length-2]
                if (id != null) {
                    window.dispatchEvent(
                        new CustomEvent('db_id', { 'detail':{dbId:id,modelId} })
                    );
                }
            }      
         },500)
    });
    viewer.addEventListener(
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, //!<<<< 事件名称
        (event) => { //!<<<< 回调函数（匿名函数）
            // console.log(event.selections[0].dbIdArray[0]);
        });
    // 获取构件数
    viewer.addEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        async (e) => {
            // var basePath = e.model.loader.basePath;
            var modeltype = viewer.impl.modelQueue().getModels();

            for (let i = 0; i < modeltype.length; i++) {
                var str = modeltype[i].loader.basePath;
                var urlArr = str.split('/')
                console.log(str)
                window['models' + urlArr[urlArr.length - 2]] = modeltype[i]
            }

            noMepModel.value.forEach( item => {
                window['models'+item.modelId]?.setAllVisibility(false);
            })

            setModelOpacity()
            viewer.impl.toggleGhosting(true)
            //加载扩展
            try {
                //人员定位
                window.personnelPosition = await viewer?.loadExtension('personnelPosition')
                // let roomData = [
                //     {
                //         objectId: "65",
                //         fdList: [
                //             [

                //             ]
                //         ]
                //     }
                // ]
                // setInterval(async() => {
                //     //实时数据
                //     let val = [
                //         {dbId:1393,value: Math.random()},
                //         {dbId:1392,value: Math.random()},
                //         {dbId:2876,value: Math.random()}
                //     ];


                //     let deviceDbid = val.map(item => item.dbId)
                //     let realData = val.map(item => item.value)
                //     // 房间
                //     let roomId = [65,47,146,55]
                //     onModelLoaded(roomId)
                //     console.log(deviceDbid)
                //     let device = await wsdPos(deviceDbid)
                //         console.log(device)
                    
                //     updataHot(realData)
                // },5000)
                
            } catch (ex) {

            }
            goHideRoomMask()
            // 模型加载完后，需要知道现在模型属于平移还是旋转状态
            emitter.emit('currModelStatue')
        }
    );
    let h = 0;//如果有多个同类模型时需要在加载一遍,建筑不需要，优先上传建筑
    for (var i = 0; i < other_list.length; i++) {
        if (other_list[i].classify == "建筑") {
            window.updateJZ = false;
            var defaultjz = other_list[i].url;
            window.jz_url = defaultjz;
            viewer.loadExtension("uploadjz");
            if (isUpload) {//更新模型时触发
                window.dispatchEvent(new CustomEvent('uploadARC'));
            }

        } else if (other_list[i].classify == "结构") {
            window.updateJG = false;
            var defaultjg = other_list[i].url;
            window.jg_url = defaultjg;
            viewer.loadExtension("uploadjg");
            if (isUpload) {//更新模型时触发
                window.dispatchEvent(new CustomEvent('uploadjg'));
            }
        } else if (other_list[i].classify == "机电") {
            h = h + 1;
            window.updateJD = false;
            var defaultjd = other_list[i].url;
            window.jd_url = defaultjd;
            viewer.loadExtension("uploadjd");
            if (isUpload) {//更新模型时触发
                window.dispatchEvent(new CustomEvent('uploadMEP'));
            }
            if (h > 1) {
                window.dispatchEvent(new CustomEvent('uploadMEP'));
                h = 0;
            }
        } else if (other_list[i].classify == "内装") {
            window.updateNZ = false;
            var defaultjs = other_list[i].url;
            window.nz_url = defaultjs;
            viewer.loadExtension("uploadjs");
            if (isUpload) {
                window.dispatchEvent(new CustomEvent('uploadjg'));
            }
        } else if (other_list[i].classify == "幕墙") {
            window.updateMQ = false;
            var defaultjs = other_list[i].url;
            window.mq_url = defaultjs;
            viewer.loadExtension("uploadmq");
        } else if (other_list[i].classify == "全专业") {
            window.updateQZY = false;
            var defaultjs = other_list[i].url;
            window.qzy_url = defaultjs;
            viewer.loadExtension("uploadqzy");
        }
    }
    //右键菜单
    viewer.registerContextMenuCallback(
        "MyChangingColorMenuItems",
        (menu, status) => {
            setTimeout(() => {
                // console.log(document.querySelector('.menu'))
                document.querySelector('.menu') && (document.querySelector('.menu').parentNode.style.display = 'none')
            }, 0)
            if (false) {
                
            } else {
                menu.length = 0
            }


        }
    );
    // viewer.loadExtension("Autodesk.ADN.Viewing.Extension.ContextMenu")
    Autodesk.Viewing.theExtensionManager.registerExternalExtension(
        "uploadjd",
        "../../../public/js/extensions/upload-jd.min.js"
    );

    Autodesk.Viewing.theExtensionManager.registerExternalExtension(
        "uploadjg",
        "../../../public/js/extensions/upload-jg.min.js"
    );

    Autodesk.Viewing.theExtensionManager.registerExternalExtension(
        "uploadjs",
        "../../../public/js/extensions/upload-js.min.js"
    );

    Autodesk.Viewing.theExtensionManager.registerExternalExtension(
        "uploadjz",
        "../../../public/js/extensions/upload-jz.min.js"
    );

    Autodesk.Viewing.theExtensionManager.registerExternalExtension(
        "uploadmq",
        "../../../public/js/extensions/upload-mq.min.js"
    );

    Autodesk.Viewing.theExtensionManager.registerExternalExtension(
        "uploadqzy",
        "../../../public/js/extensions/upload-qzy.min.js"
    );
    // Autodesk.Viewing.theExtensionManager.registerExternalExtension(
    //     "first",
    //     "../../../public/js/extensions/first.js"
    // );
    //  viewer.loadExtension("uploadjz");

    viewer.loadExtension(
        "Autodesk.ADN.Sample.CustomToolExtension"
    ).then((item) => {
        CustomToolExtension = item;

        //监听鼠标移动事件（控制通风柜上方标签显示）
        // if(name==="monitoringCenter") {
        CustomToolExtension._tool.handleMouseMove = (e) => {
            const result = viewer.impl.hitTest(e.canvasX, e.canvasY, false);
            if (e) {
                emitter.emit("movehouseShowLabel", result);//变量数据标签
            }
            if (!result) {
                window.connectType = null
                window.dbID = null
                return;
            }
            window.dbID = result?.dbId;
            // result1.model.loader.basePath.includes('jd')
            // let type = ['JZ','JD','JG','QZY','MQ','NZ'];
            // let currType = type.filter( item => result?.model?.loader?.basePath.includes(item.toLowerCase()));
            var str = result?.model?.loader?.basePath || '';
            var splitUrl = str.split('/')
            var currType = splitUrl[splitUrl.length - 2]
            window.connectType = currType
            if (e && name === "monitoringCenter") {
                // this.showdata = []
                let data = [{ dbid: 1388 }]

                let dbId = result.dbId
                // this.moveMouseGetDbid = dbId;
                let currData = data.filter(opt => dbId == opt.dbid)
                window?.TFGLabelIcon?.showTFGLabels(currData)


            }
        }
        CustomToolExtension._tool.handleSingleClick = (e) => {
            const result = viewer.impl.hitTest(e.canvasX, e.canvasY, false);
            let str = result?.model?.loader?.basePath || '';
            let splitUrl = str.split('/')
            let modelId = splitUrl[splitUrl.length - 2]
            modelId = modelId;
            let dbId = result?.dbId || null

            if (dbId != null && e.button != 2) { //event.button != 2右击鼠标不请求
                window.dispatchEvent(
                    new CustomEvent('db_id', { 'detail': { dbId, modelId } })
                );
            }
            if (e.button != 2) {
                //右键调用二维组态使用dbid
                emitter.emit('handleSingleClick', { dbId: result ? result.dbId : null, modelId })
            }
            if (name == 'modelConnection') {
                emitter.emit("getVariableList", { dbId, modelId });
            }

        }
        // }
    });
    // viewer.loadExtension('labelIcon');

    // Autodesk.Viewing.Extension.call(this, viewer);
    // defaultView(viewer);
    preservation();
    // if(name == 'realMonitoring'){
    // viewer.setBackgroundColor(237,241,244,237,241,244);
    // }else{
    // viewer.setBackgroundColor(255,255,255,255,255,255);
    // }
    //设置forge透明度
    // Autodesk.Viewing.Private.InitParametersSetting.alpha=true;//加载模型成功前设置
    viewer.setEnvMapBackground(true);
    viewer.impl.renderer().setClearAlpha(0); //clear alpha channel
    // viewer.impl.glrenderer().setClearColor( 0xffffff, 0 ) //可以不设置
    // viewer.impl.invalidate(true) //可以不设置
    //鼠标滚轮翻转
    viewer.navigation.setReverseZoomDirection(true);
    viewer.impl.hideLines(false)
    viewer.impl.toggleGhosting(false)
    viewer.impl.setDisplayEdges(true);

    setTimeout(() => {
        viewer.setGroundShadow(false);
        if (
            name == "monitoringCenter" ||
            name == "driving"
        ) {
            viewer.setActiveNavigationTool("pan");
        } else {
            viewer.setActiveNavigationTool("");
        }
    }, 1000);
}
let cutPlanView = () => {
    viewer.autocam.goToView({
        position: new THREE.Vector3(
            -34.004335487593956, -114.33533236339532, 112.46310571561423,
        ), //!<<< 相机的新位置
        up: new THREE.Vector3(
            0.313057877414841,
            0.5482889262086771,
            0.7754830873626132
        ),
        center: new THREE.Vector3(
            24.440311684430796,
            -13.129708349333406,
            17.314054357412154
        ), //!<<< 相机的新焦点
        pivot: new THREE.Vector3(0, 0, 0), //!<<< 相机的新环绕（Orbit）中心
        fov: 53.13010235415598,
        worldUp: new THREE.Vector3(0, 0, 1),
        isOrtho: true,
    });
}
</script>

<style lang="scss">
body,
html {
    overflow: hidden;
}
.model-content {
    width: 100%;
    height: 100%;
}
#viewer-local {
    // z-index: -1;
    position: absolute;
    // top: 0;
    // left:0;
    width: 100%;
    height: 100%;
}

.localStyle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.localStyle-connection {
    z-index: -1;
    position: absolute;
    // left: calc(24% - (-25px));
    right: 0px;
    top: 0px;
    height: 100%;
    width: 84%;
}

.viewcubeWrapper {
    display: none !important;
}

//自定义右键菜单样式
.adsk-viewing-viewer.dark-theme .docking-panel-container-solid-color-a {
    background-color: transparent !important;
    display: none;
}

.menu.docking-panel {
    border: none;
    box-shadow: none !important;
    min-width: 0;
}

#tooltip-info {
    display: none;
}

div[data-i18n="设备信息"]+div {
    display: none !important;
}

div[data-i18n="Isolate"] {
    display: none !important;
}

div[data-i18n="Hide Selected"] {
    display: none !important;
}

div[data-i18n="Focus"] {
    display: none !important;
}

div[data-i18n="Show All Objects"] {
    display: none !important;
}

div[data-i18n="Clear Selection"] {
    display: none !important;
}

div[data-i18n="Section Box"] {
    display: none !important;
}

div[data-i18n="Pivot"] {
    display: none !important;
}

#guiviewer3d-toolbar,
.orbit-gizmo {
    display: none !important;
}

// 模型加载进度条
.progressbg {
    display: none;
}

#remote-crosshair {
    display: none !important;
}

.infoButton {
    display: none;
}

.homeViewWrapper {
    display: none;
}

.viewcube {
    width: 80px;
    height: 80px;
}

.adsk-viewing-viewer {
    background: transparent !important;
    z-index: -3;
}
label.position-update {
    position: absolute;
}
label.showRoomIcon-markup {
    position: absolute;
    width: auto;
    cursor: pointer;
    .follow-btn {
        position: absolute;
        left: 50px;
        top: -20px;
        min-width: 130Px;
        display: none;
        // @include theme_color($theme-color1);
        border-radius: 6px;
        padding: 12Px 4Px;
        div {
            // background: rgba(3, 19, 64, 0.61);
            // border: 1px solid #00bcff;
            // box-shadow: 0 0 6px 0 rgba(0, 143, 255, 0.6);
            // border-radius: 20px;
            // font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #00ffff;
            // @include font_color2($font-color3);
            padding: 4Px 10Px;
            // padding: 2px 8px;
            // min-width: 75Px;
            text-align: center;
            display: flex;
            align-items: center;
            cursor: pointer;
            // &:nth-child(1) {
            //     margin-bottom: 10px;
            // }
            img {
                width: 20Px;
                margin-right: 6Px;
            }
            &:hover {
                color: #fff; 
                outline: none; 
                background-color: #00bcff;
                border-radius: 4Px;
            }
        }
    }
    .xitong-icons {
        cursor: pointer;
    }
    //点击导航图标跳to-beat动
    .go-beat {
        animation: rotate 1.5s linear infinite;
    }
    @keyframes rotate {
        0% {
            transform: translateY(-10px);
        }
        25% {
            transform: translateY(-20px);
        }
        50% {
            transform: translateY(-30px);
        }
        75% {
            transform: translateY(-20px);
        }
        100% {
            transform: translateY(-10px);
        }
    }
    .room-real-data {
        text-align:center;
        font-size:14px;
        color:#1afa29;
        font-weight: bold;
        text-shadow: 1px 1px #1d1a1a;
    }
}
.room-icon-bg {
    width: auto;
    min-width: 50px;
    min-height: 24px;
    padding: 2px 10px;
    font-size: 14px;
    color: #00FFFF;
    line-height: 24px;
    text-align: center;
    min-width: 50px;
    white-space: nowrap;
    background: rgba(3, 19, 64, 0.8);
    background-repeat: no-repeat;
    border-radius: 4px;
    // background: rgba(3, 19, 64, 0.8);
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
    border: 1px solid;
    position: relative;
    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 3Px;
        height: 80%;
        background: #00FFFF;
        transform: translate(-60%,-50%);
    }
}
.room-vertical-bar {
    width: 2px;
    height: 70px;
    background: linear-gradient(
        180deg,
        rgba(0, 255, 255, 0.9) 0%,
        rgba(0, 255, 255, 0.1) 100%
    );
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.5);
    margin: 0 auto;
    border-bottom-right-radius: 100%;
    border-bottom-left-radius: 100%;
}
</style>