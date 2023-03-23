<!-- 组件说明 -->
<template>
    <div class='r-func' :class="{ 'enteractive': isEnter }" @mouseenter='enter' @mouseleave='out'>
        <div class="r-icons" @click="all">
            <img src="@/assets/images/func-icon/icon1.png" alt="显示所有导航" title="主视角">
        </div>
        <div class="r-icons" @click="orbit()">
            <img src="@/assets/images/func-icon/icon2-1.png" v-if="isTranslate" title="动态观察">
            <img src="@/assets/images/func-icon/icon2.png" v-else title="动态观察">
        </div>
        <!-- <div class="r-icons">
            <img src="@/assets/images/func-icon/icon3.png" alt="">
        </div> -->
        <div class="r-icons search" @click="openIpt" >
            <img src="@/assets/images/func-icon/icon4.png" title="搜索" alt="">
            <div class="ipt" v-show="showIpt" @mouseleave='hideIpt'>
                <el-input v-model.trim="keyWords" @input="goSearch" class="search-ipt" placeholder="请输入关键字" clearable />
                <searchList :searchData="searchData" :showIpt="showIpt"/>
            </div>
        </div>
        <!-- <div class="r-icons">
            <img src="@/assets/images/func-icon/icon5.png" alt="">
        </div> -->
        <div class="r-icons" @click="showOrHideRoomLabel" title="控制房间标签">
            <img src="@/assets/images/func-icon/icon6.png" alt="">
        </div>
        <div class="r-icons" ref="rIcons">
            <img src="@/assets/images/huanjing.png" @click="toggleModal" alt="" title="热力图">
            <div class="hot" v-show="isShow">
                <span @click="environment('温度')" :class="{'active':currStatus=='温度'}">温度</span>
                <span @click="environment('湿度')" :class="{'active':currStatus=='湿度'}">湿度</span>
            </div>
        </div>
        <!-- <div class="r-icons">
            <img src="@/assets/images/func-icon/icon7.png" alt="">
        </div> -->
    </div>
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

let saveAngle = null
let searchType = ref('')
let Conduit = ref(false)
let conduitDbids = ref([])
let modelId = ref('')
let isShow = ref(false)
const searchData = ref({})
onMounted(() => {
    //判断当前模型是平移还是旋转
    getCurrModalStatus()
    //刷新加载完成模型时触发
    emitter.on('currModelStatue', () => {
        getCurrModalStatus()
    })
    emitter.on('sendSearchType', query => {
        searchType.value = query
        keyWords.value = ''
        searchData.value = {}
    })
    emitter.on('theConduit', e => {
        console.log(e)
        if(e.data != null){
            Conduit.value = e.item;//显示管道
            conduitDbids.value = e.data.useless;//管道的dbids
            modelId.value = e.data.uselessModelId || e.data.modelId;
            hideConduit();
        }
    })
    //点击导航清除热力图
    emitter.on('clearHeatMap',() => {
        handleDocumentClick()
    })
    // document.addEventListener('click', handleDocumentClick)
})
let rIcons = ref(null)
let handleDocumentClick = (e) => {
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
    hideIpt()
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
    http.post('model/getCoordinate', {}, { headers: { 'Content-Type': 'application/json' } }
    ).then((res) => {
        console.log(res)
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
        ElMessage.success({
            message: '开启平移',
            duration: 0,
            customClass: 'translate-rotate'
        });
    } else {
        (window as any).yst_viewer.setActiveNavigationTool("");
        ElMessage.success('关闭平移');
    }

}

//搜索
let showIpt = ref(false)
let keyWords = ref('')
const openIpt = () => {
    showIpt.value = true
}
const hideIpt = () => {
    showIpt.value = false
}
//根据设备编号搜索设备

const goSearch = (e) => {
    console.log(keyWords.value)
    http.get('PointEquiment/searchingFourDimensions', {
        params: {
            keyText: keyWords.value,
            searchType: searchType.value
        }
    }).then(res => {
        console.log(res)
        let { code, data } = res.data || {}
        if (code === 200) {
            searchData.value = data
        }
    })
}

//房间标签控制
let roomLabelStatus = false
const showOrHideRoomLabel = () => {
    roomLabelStatus = !roomLabelStatus
    emitter.emit('controlRoomLabel', roomLabelStatus)
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

</script>

<style lang='scss' scoped>
.r-func {
    padding: 10px 6px;
    opacity: 0.7;
    box-sizing: border-box;
    float: left;

    .r-icons {
        padding: 4px;
        position: relative;
        &:hover {
            background: rgba(0, 188, 255, 0.1000);
        }

        img {
            width: 24Px;
            height: 24Px;
            display: block;
            cursor: pointer;
            margin-bottom: 4px;
        }
        .ipt {
            width: 300px;
            position: absolute;
            top: 0;
            right: 30Px;
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
        
    }

}

.enteractive {
    background: rgba(0, 188, 255, 0.1000);
    border-radius: 4px;
    opacity: 1;
}
</style>