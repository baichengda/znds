<!-- 组件说明 -->
<template>
    <div class="single-class">
        <el-sub-menu :index="o+''" class="classify-info1" v-for="(sys,o) in singleModelData">
            <!-- 系统或空间 -->
            <template #title>
                <div 
                    @click="clickOneLevel(sys,build)"
                    >
                    <!-- {{sys.sname}} -->
                </div>
            </template>
            <!-- 子系统 -->
            <el-menu-item 
                :index="index+'-'+ o +'-'+i" 
                v-for="(childSys,i) in sys.dataList"
                :key="childSys.deviceId"
                @click.native="clickTwoLevel(childSys,sys)"
                @dblclick.native="showUnbindModal">
                {{childSys.sname}}
            </el-menu-item>
        </el-sub-menu>
    </div>
</template>

<script setup lang="ts">
import { watch,ref } from 'vue';
import { useRoute } from 'vue-router'
let { name } = useRoute()
let unbindModal = ref(null)
//import x from ''
let singleModelData = ref([])
let props = defineProps({
    treeData: {
        type: Array
    },
    index: {
        type: Number
    },
    build: {
        type: Object
    }
})
watch(()=>props.treeData,(val)=>{
    singleModelData.value = val?.slice(0,1) || singleModelData.value
},{deep: true,immediate: true})
let emit = defineEmits(['handleClickOneLevel','handleClickTwoLevel','handlerClickBuild'])
let clickOneLevel = (sysData,build) => {
    emit('handleClickOneLevel',{sysData,build})
}
let clickTwoLevel = (childSysData,sysData) => {
    emit('handleClickTwoLevel',{childSysData,sysData})
}
//解绑弹窗
let showUnbindModal = () => {
    if (name == "monitoringCenter") {
        unbindModal.value.showUnbindModal(this.child)
    }
}
</script>

<style lang='scss' scoped>
.classify-info1 {
    margin-bottom: 10px;
    // min-width: 110px;
    :deep(.el-sub-menu__title) {
        display: none;
        height: 35Px;
        line-height: 35Px;
        color: #fff;
        background: linear-gradient(90deg, #005C7B 0%, rgba(4,127,170,0.3192) 42%,  rgba(10,177,236,0) 100%);
        border-radius: 30Px;
        .el-icon {
            display: none;
        }
    }
    :deep(.el-menu) {
        position: relative;
        background-color: transparent;
        padding: 15px 0px;
        background: rgba(0,188,255,0.1);
        border-radius: 70px;
        // &::before {
        //     content: '';
        //     height: calc(100% - 20Px);
        //     width: 1Px; 
        //     background: #E6E8EC;
        //     position: absolute;
        //     left: 2%;
        //     top: 0px;
        // }
        // &:after {
        //     content: '';
        //     width: 6px;
        //     height: 6px;
        //     background: #E6E8EC;
        //     position: absolute;
        //     left: 0%;
        //     top: 0;
        //     border-radius: 50%;
        // }
        li {
            position: relative;
            min-width: 60Px;
            font-size: 24px;
            // &::before {
            //     content: '';
            //     width: 12%;
            //     height: 1Px;
            //     background: #E6E8EC;
            //     position: absolute;
            //     left: 2%;
            //     top: 48%;
            // }
        }
        .el-menu-item {
            height: 60Px;
            line-height: 60Px;
            color: #fff;
            padding: 0Px;
            text-align: center;
            background: transparent;
            display: inherit;
            &.is-active {
                color: #00BCFF;
            }
        }

    }
}
:deep(.ivu-menu-vertical .ivu-menu-item:hover), 
:deep(.ivu-menu-vertical .ivu-menu-submenu-title:hover) {
    color: #00BCFF;
}
</style>