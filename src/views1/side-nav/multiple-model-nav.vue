<!-- 组件说明 -->
<template>
    <el-sub-menu :index="index" class="build-info">
        <!-- 楼栋 -->
        <template #title>
            <div @click="handlerClickBuild(multipleModelData)">{{multipleModelData.sname}}</div>
        </template>
        <el-sub-menu :index="index+'-'+o" class="classify-info" v-for="(sys,o) in multipleModelData.dataList" :key="index+o">
            <!-- 系统或空间 -->
            <template #title>
                <div @click="clickOneLevel(sys,multipleModelData)">{{sys.sname}}</div>
            </template>
            <!-- 子系统 -->
            <el-menu-item 
                :index="index+'-'+ o +'-'+i" 
                v-for="(childSys,i) in sys.dataList"
                :key="childSys.deviceId"
                @click.native="clickTwoLevel(childSys,sys)"
                @dblclick.native="showUnbindModal"
            >
                {{childSys.sname}}
            </el-menu-item>
        </el-sub-menu>
    </el-sub-menu>
</template>

<script setup lang="ts">
import { watch,ref } from 'vue';
import { useRoute } from 'vue-router'
let { name } = useRoute()
let unbindModal = ref(null)
//import x from ''
let multipleModelData = ref({})
let props = defineProps({
    treeData: {
        type: Array
    },
    index: {
        type: Number
    }
})
watch(()=>props.treeData,(val)=>{
    multipleModelData.value = val || multipleModelData.value
},{deep: true,immediate: true})

let emit = defineEmits(['handleClickOneLevel','handleClickTwoLevel','handlerClickBuild'])
let clickOneLevel = (sysData,build) => {
    emit('handleClickOneLevel',{sysData,build})
}
let clickTwoLevel = (childSysData,sysData) => {
    emit('handleClickTwoLevel',{childSysData,sysData})
}
let handlerClickBuild = (multipleModelData) => {
    emit('handlerClickBuild',multipleModelData)
}
//解绑弹窗
let showUnbindModal = () => {
    if (name == "monitoringCenter") {
        unbindModal.value.showUnbindModal(this.child)
    }
}
</script>

<style lang='scss' scoped>
.build-info {
    min-width: 110px;
    :deep(.el-sub-menu__title) {
        padding-left: 0px !important;
        color: #fff;
        height: 35Px;
        line-height: 35Px;
        background-color: transparent;
        .el-icon {
            display: none;
        }
    }
    &>:deep(.el-sub-menu__title) {
        background: linear-gradient(90deg, #005C7B 0%, rgba(4,127,170,0.3192) 42%,  rgba(10,177,236,0) 100%);
        border-radius: 30Px;
        padding-left: 15px !important;
    }
    &>:deep(.el-menu) {
        background-color: transparent;
        padding-top: 10px;
        padding-left: 15px;
    }
}

//@import url()
.classify-info {
    min-width: 110px;
    :deep(.el-menu) {
        position: relative;
        background-color: transparent;
        .el-menu-item {
            background-color: transparent;
            padding-left: 30px;
            min-width: 110px;
            height: 40Px;
            line-height: 40Px;
            color: #fff;
            padding-left: 20px;
            &.is-active {
                color: #00BCFF;
            }
        }
        &::before {
            content: '';
            height: calc(100% - 20Px);
            width: 1Px;
            background: #E6E8EC;
            position: absolute;
            left: 1%;
            top: 0;
        }
        li {
            position: relative;
            &::before {
                content: '';
                width: 12%;
                height: 1Px;
                background: #E6E8EC;
                position: absolute;
                left: 1%;
                top: 48%;
            }
        }
        
    }
}
:deep(.ivu-menu-vertical .ivu-menu-item:hover), 
:deep(.ivu-menu-vertical .ivu-menu-submenu-title:hover) {
    color: #00BCFF;
}
</style>