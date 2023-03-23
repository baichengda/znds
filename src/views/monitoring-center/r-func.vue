<!-- 组件说明 -->
<template>
    <div class='r-func' :class="{ 'enteractive': isEnter }">
        <!-- <div class="r-icons" @click="all">
            <img src="@/assets/images/func-icon/icon1.png" alt="显示所有导航" title="主视角">
        </div> -->
        <div class="r-icons" @click="orbit()">
            <img src="@/assets/images/monitoring-center/icon1.png" v-if="!isTranslate" title="动态观察">
            <img src="@/assets/images/monitoring-center/icon1-1.png" v-else title="动态观察">
            <p>动态观察</p>
        </div>
        <!-- <div class="r-icons">
            <div @click="controlGroup">
                <img src="@/assets/images/monitoring-center/icon2.png" title="显示控制">
                <p>显示控制</p>
            </div>
             
             <div v-show="funGroup" class="content">
                 <div @click="changeStatus('icon4'),conduit()">
                     <img v-if="icons.icon4" src="@/assets/images/monitoring-center/icon4.png" alt="">
                     <img v-else src="@/assets/images/monitoring-center/icon4-1.png" alt="">
                     <p>管道</p>
                 </div>
                 <div @click="changeStatus('icon5'),showOrHideRoomLabel()">
                     <img v-if="icons.icon5" src="@/assets/images/monitoring-center/icon5.png" alt="">
                     <img v-else src="@/assets/images/monitoring-center/icon5-1.png" alt="">
                     <p>房间</p>
                 </div>
                 <div @click="changeStatus('icon6')">
                     <img v-if="icons.icon6" src="@/assets/images/monitoring-center/icon6.png" alt="">
                     <img v-else src="@/assets/images/monitoring-center/icon6-1.png" alt="">
                     <p>数据标签</p>
                 </div>
                 <div @click="changeStatus('icon7'),environment('温度')">
                     <img v-if="icons.icon7" src="@/assets/images/monitoring-center/icon7.png" alt="">
                     <img v-else src="@/assets/images/monitoring-center/icon7-1.png" alt="">
                     <p>环境热力</p>
                 </div>
             </div>
        </div> -->
        <div class="r-icons">
            <div @click="changeStatus('icon5'),showOrHideRoomLabel()">
                <img src="@/assets/images/monitoring-center/icon5-1-1.png" alt="">
                <p>房间标签</p>
            </div>
        </div>
        <div class="r-icons" @click="showSearchModal">
             <img src="@/assets/images/monitoring-center/icon3.png" title="搜索">
             <p>搜索</p>
        </div>
        <!-- <div class="r-icons">
            <img src="@/assets/images/func-icon/icon3.png" alt="">
        </div> -->
        <!-- <div class="r-icons search">
            <img src="@/assets/images/func-icon/icon4.png" title="搜索" @click="openIpt" alt="">
                
            <div class="ipt" v-show="showIpt"> -->
                <!-- <el-input 
                v-model="keyWords" 
                ref="inputEvent" 
                @focus="test" 
                @blur="blurToggle"  
                @input="goSearch"
                id="txt_Search" 
                class="search-ipt" 
                placeholder="请输入关键字" 
                clearable /> -->
                <!-- <input 
                    type="text" 
                    class="nativeIpt" 
                    id="txt_Search" 
                    ref="inputEvent"
                    autocomplete="off"
                    v-on:focus='test()' 
                    v-on:blur="blurToggle()" 
                    v-model="keyWords" 
                    v-on:input="goSearch"
                    placeholder="请输入关键字" >
                <img src="@/assets/images/delete.png" class="delete-icon" @click="deleteIptText" alt="">
                <searchList :searchData="searchData" :showIpt="showIpt"/>
            </div> -->
            <!-- <div id="softkey" draggable></div> -->
        <!-- </div> -->
        <!-- <div class="r-icons">
            <img src="@/assets/images/func-icon/icon5.png" alt="">
        </div> -->
        <!-- <div class="r-icons" @click="showOrHideRoomLabel" title="控制房间标签">
            <img src="@/assets/images/func-icon/icon6.png" alt="">
        </div>
        <div class="r-icons" ref="rIcons">
            <img src="@/assets/images/huanjing.png" @click="toggleModal" alt="" title="热力图">
            <div class="hot" v-show="isShow">
                <span @click="environment('温度')" :class="{'active':currStatus=='温度'}">温度</span>
                <span @click="environment('湿度')" :class="{'active':currStatus=='湿度'}">湿度</span>
            </div>
        </div> -->
        <!-- <div class="r-icons">
            <img src="@/assets/images/func-icon/icon7.png" alt="">
        </div> -->
        <searchList :searchData="searchData" v-show="!dialogVisible" :showIpt="showIpt"/>
    </div>
    <el-dialog
        v-model="dialogVisible"
        :show-close="true"
        title=" "
        width="30%"
        custom-class="search-modal"
        :modal="false"
        :draggable="true"
    >
    <p class="title">智能导视系统</p>
    <div class="znds-search">
        <input 
            type="text" 
            class="nativeIpt" 
            id="txt_Search" 
            ref="inputEvent"
            autocomplete="off"
            v-on:focus='test()' 
            v-on:blur="blurToggle()" 
            v-model="keyWords" 
            :placeholder="placeholderText" >
        <el-button type="primary" class="search-btn" :loading="searching" @click.native="goSearch">搜索</el-button>
        <div class="search-icon">
            <img @click="goSearch" src="@/assets/images/monitoring-center/search.png" alt="">
        </div>
        <img src="@/assets/images/delete.png" class="delete-icon" @click="deleteIptText" alt="">
    </div>
    <p class="intro">帮助您找人、找仪器、找实验、找实验室</p>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick, getCurrentInstance, reactive } from 'vue'
import emitter from '@/common/mybus.ts'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { showAllModel, defaultView } from '@/common/bim-utils.js'
import { http } from '@/common/request.js'
import searchList from './search.vue'
import { onModelLoaded } from '@/views/bim-model/hot.js'
import { clickNavShowRoomIcon } from '@/common/space.js'

let saveAngle = null
let searchType = ref('')
let Conduit = ref(false)
let conduitDbids = ref([])
let modelId = ref('')
let isShow = ref(false)
let placeholderText = ref('请输入您要查找的对象')
const searchData = ref({})
const placeholderMap = {
    "空间":"快速查询实验室位置",
    "人员":"快速查找科研人员信息",
    "仪器":"快速查询科研仪器信息",
    "设备":"按实验内容查找实验空间",
}



let inputEvent = ref(null)
onMounted(() => {
    //判断当前模型是平移还是旋转
    getCurrModalStatus()
    //刷新加载完成模型时触发
    emitter.on('currModelStatue', () => {
        getCurrModalStatus()
    })
    emitter.on('sendSearchType', query => {
        searchType.value = query
        placeholderText.value = placeholderMap[query] || '请输入您要查找的对象'
        keyWords.value = ''
        searchData.value = {}
    })
    emitter.on('theConduit', e => {
        if(e.data != null){
            Conduit.value = e.item;//显示管道
            conduitDbids.value = e.data.useless;//管道的dbids
            modelId.value = e.data.uselessModelId || e.data.modelId;
            hideConduit();
        }
    })
    //点击导航上全部
    emitter.on('showAll',() => {
        all()
    })
    //点击导航清除热力图
    emitter.on('clearHeatMap',() => {
        handleDocumentClick()
    })
    // document.addEventListener('click', handleDocumentClick)
})
let rIcons = ref(null)
let handleDocumentClick = () => {
    // console.log(rIcons.value && rIcons.value.contains(e.target))
    // if (rIcons.value && rIcons.value.contains(e.target)) return
    isShow.value = false
    currStatus.value = ''
    onModelLoaded([],false)
}

//鼠标移入
let isEnter = ref(false)
const enter = () => {
    isEnter.value = true
}
//鼠标离开
const out = () => {
    isEnter.value = false
    // hideIpt()
}

let toggleModal = () => {
    isShow.value = !isShow.value
    currStatus.value = ''
    onModelLoaded([],isShow.value)
}
// let hideModal = () => {
//     isShow.value = false
//     currStatus.value = ''
// }

//回到主视角并还原所有
let all = () => {
    Conduit.value = true;
    showAllModel()
    hideConduit()
    onModelLoaded([],false) //清除热力图
    //删除人员轨迹
    emitter.emit('clearPath')
    http.post('model/getCoordinate', {}, { headers: { 'Content-Type': 'application/json' } }
    ).then((res) => {
        let {data} = res.data;
        //请求成功直接用数据库保存的，如果没成功用模型中默认的
        if (data.posX == 0 && data.posY == 0 && data.posZ == 0) {
            defaultView(window.yst_viewer, saveAngle, false);
        } else {
            defaultView(window.yst_viewer, data, true)
        }
    }).catch((error) => {
        console.log(error);
    });
    // (window as any).yst_viewer && (window as any).yst_viewer.unloadExtension('showRoomIconIcon');
    // $('.showRoomIcon-markup').remove();
    //隐藏房间标签
    clickNavShowRoomIcon([])
}

//获取默认平移或者旋转状态
let isTranslate = ref(true)
let getCurrModalStatus = () => {
    if ((window as any).yst_viewer) {
        isTranslate.value = (window as any).yst_viewer.getActiveNavigationTool() == "pan" ? true : false
    }
}

//开启关闭平移
let orbit = () => {
    //默认开启平移的方法写到了meetRoomIcon.js中
    isTranslate.value = !isTranslate.value;
    // if(this.select = '2'){
    //     this.isOperation = true;
    // }else{
    //     this.isOperation = false;
    // }
    if (isTranslate.value) {
        (window as any).yst_viewer.setActiveNavigationTool("pan");
        ElMessage.success('开启平移');
    } else {
        (window as any).yst_viewer.setActiveNavigationTool("");
        ElMessage.success('关闭平移');
    }

}

//搜索
let showIpt = ref(false)
let keyWords = ref('')
const openIpt = () => {
    showIpt.value = !showIpt.value
}
const hideIpt = () => {
    showIpt.value = false
}

//显示搜索弹窗
let dialogVisible = ref(false)
const showSearchModal = () => {
    dialogVisible.value = true
    searchData.value = {}
}
//根据设备编号搜索设备
let searching = ref(false)
const goSearch = () => {
    searching.value = true
    http.get('PointEquiment/searchingFourDimensions', {
        params: {
            keyText: keyWords.value,
            searchType: searchType.value
        }
    }).then(res => {
        let { code, data } = res.data || {}
        if (code === 200) {
            if(Object.values(data).flat().length) {
                dialogVisible.value = false
            }
            console.log(111111111,data)
            searchData.value = data
        }
        searching.value = false
    })
}



//管道的显示隐藏
let conduit = () => {
    Conduit.value = !Conduit.value;
    hideConduit();
}
let hideConduit = () => {
    var instanceTree = window['models' + modelId.value]?.getData().instanceTree.nodeAccess.dbIdToIndex;
    let arr = [];
    for (var key in instanceTree) {
        arr.push(Number(key))
    }
    if (Conduit.value) {
        //显示所有
        arr.forEach(item => {
            window['models' + modelId.value].visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
        conduitDbids.value.forEach(item => {
            window['models' + modelId.value].visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
    } else {
        //隐藏，只隐藏管道，先隐藏全部，再把所有设备显示
        arr.forEach(item => {
            window['models' + modelId.value].visibilityManager.setNodeOff(item, true);//使用此方法将构件彻底隐藏，单独再将其设置为true，才能隐藏
        })
        conduitDbids.value.forEach(item => {
            window['models' + modelId.value].visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为false，才能显示
        })
    }
}

//热力图控制
let currStatus = ref('')
let environment = (param) => {
    currStatus.value = param
    emitter.emit('getHotRealData',param)
}


//虚拟键盘
const test = () => {
    // window?.VirtualKeyboard?.toggle('txt_Search', 'softkey')
    // $("#kb_langselector,#kb_mappingselector,#copyrights").css("display", "none")
}
const blurToggle = () => {
    // window?.VirtualKeyboard.toggle('txt_Search','softkey')
    // console.log($('#txt_Search').val())
    // keyWords.value = $('#txt_Search').val()
    // goSearch()
}

//清空内容
const deleteIptText = () => {
    keyWords.value = ''
    inputEvent.value.focus();
}

//显示控制（功能按钮组合）
let funGroup = ref(false)
const controlGroup = () => {
    funGroup.value = !funGroup.value    
}
//功能组中状态切换
let icons = reactive({
    icon4: false, //管道
    icon5: true, //房间
    icon6: false, //数据标签
    icon7: false, //环境热力
})
const changeStatus = (param) => {
    icons[param] = !icons[param]
}

//房间标签控制
// let roomLabelStatus = false
const showOrHideRoomLabel = () => {
    emitter.emit('controlRoomLabel', icons.icon5)
}
</script>
<style lang="scss">
#VirtualKeyboardIME {
    left: 50.4% !important;
}
.search-modal {
    background-color: rgba(4,13,38,.8);
    width: 500px;
    height: auto;
    border-radius: 6px;
    box-shadow: 0px 0px 18px 0px rgba(0,143,255,0.6);
    // min-height: 350px;
    // background: rgba(9,19,45,0.85);
    // box-shadow: none;
    // background-image: url('../../assets/images/monitoring-center/search-bg.png');
    // background-size: cover;
    // background-repeat: no-repeat;
    // background-position: bottom;
    .title {
        background: linear-gradient(180deg, #008FDC 0%, #0FEFFF 100%);
        font-size: 30px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1;
        margin: 0px 0 40px;
        letter-spacing: 9px;
    }
    .intro {
        background: linear-gradient(180deg, #008FDC 0%, #0FEFFF 100%);
        font-size: 30px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 8px;
        font-size: 16px;
        line-height: 35px;
        margin: 0;
    }
    .znds-search {
        position: relative;
        display: inline-block;
        .search-btn {
            background: #00BCFF;
            border-radius: 8px 8px 8px 8px;
            height: 50px;
            width: 70px;
            margin-left: 10px;
        }
        input {
            width: 343px;
            height: 48px;
            outline: none;
            background-color: transparent;
            box-shadow: 0px 0px 8px 0px rgba(0,188,255,0.7);
            border: none;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            padding-left: 45px;
            box-sizing: border-box;
        }
        input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.575);
        }
        .search-icon {
            position: absolute;
            top: 0;
            width: 40px;
            left: 0px;
            height: 100%;
            line-height: 56px;
            img {
                width: 20px;
                height: 20px;
            }
            &::after {
                content: "";
                position: absolute;
                top: 22%;
                right: 0;
                height: 25px;
                width: 1px;
                // background: #2171D1;
                background: linear-gradient(90deg, #3DCEF2 0%, #2171D1 100%);
            }
        }
        .delete-icon {
            width: 16Px;
            height: 16Px;
            position: absolute;
            display: none;
            cursor: pointer;
        }
        &:hover .delete-icon {
            display: block;
            top: 31%;
            right: 22%;
        }
    }
}
</style>
<style lang='scss' scoped>

.r-func {
    padding: 10px 6px;
    opacity: 1;
    box-sizing: border-box;
    float: left;

    .r-icons {
        position: relative;
        margin-bottom: 40px;
        &:hover {
            // background: rgba(0, 188, 255, 0.1000);
        }
        p {
            font-size: 16px;
            color: #00FFFF;
            margin: 0;
            margin-top: 5px;
        }
        img {
            width: 60Px;
            height: 60Px;
            display: block;
            cursor: pointer;
        }
        .ipt {
            width: 300px;
            position: absolute;
            top: 0;
            right: 40Px;
            .delete-icon {
                width: 16Px;
                height: 16Px;
                position: absolute;
                display: none;
            }
            &:hover .delete-icon {
                display: block;
                top: 6px;
                right: 8px;
            }
        }
        #softkey {
                position: absolute;
                right: 47px;
                top: 80Px;
            }
        .hot {
            position: absolute;
            top: 0;
            right: 40Px;
            width: 90Px;
            height: 35Px;
            // padding: 0 20px;
            background-color: rgba(0,188,255,.4);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-around;
            border-radius: 2px;
            span {
                cursor: pointer;
                display: inline-block;
                &:nth-child(1) {
                    // margin-right: 20px;
                }
            }
            .active {
                color: rgba(0,188,255,1)
            }
        }
        .content {
            background: rgba(9,19,45,0.85);
            box-shadow: inset 0px 0px 8px 0px rgba(0,77,186,0.7);
            border: 1px solid #0D3C56;
            border-radius: 4px;
            position: absolute;
            right: 80Px;
            top: 0;
            z-index: 999;
            width: 320px;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
    }

    .search {
        position: relative;
        .search-ipt {
            :deep(.el-input__wrapper) {
                background-color: rgba(9, 19, 45, 0.8500);
                box-shadow: inset 0px 0px 8px 1px rgba(0, 77, 186, 0.6500);
                border-radius: 4px;

                .el-input__inner {
                    color: #fff;
                }
            }
        }
        .nativeIpt {
            background-color: rgba(9, 19, 45, 0.8500);
            box-shadow: inset 0px 0px 8px 1px rgba(0, 77, 186, 0.6500);
            border-radius: 4px;
            border: 1px solid rgba(0, 77, 186, 0.6500);
            color: #fff;
            outline: none;
            width: 100%;
            height: 30Px;
            padding: 0 10px;
            box-sizing: border-box;
        }
        
        
    }

}

.enteractive {
    background: rgba(0, 188, 255, 0.1000);
    border-radius: 4px;
    opacity: 1;
}
</style>