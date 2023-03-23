<template>
<div class="roomModal">
    <el-dialog
        v-model="modal3"
        :draggable="true"
        custom-class="addRoom"
        title="房间信息">
        <el-form :model="roomInfo" label-position="left" class="modal-right" :label-width="85">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="房间名称：">
                        <!-- <el-input 
                            v-model.number="roomInfo.rmNumber"
                            clearable
                            disabled
                            placeholder="请输入房间编号" 
                        /> -->
                        <span>{{roomInfo.rmName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="门牌号：">
                        <!-- <el-input 
                            v-model="roomInfo.rmName"
                            clearable
                            disabled
                            placeholder="请输入房间名称" 
                        /> -->
                        <span>{{roomInfo.houseNumber}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="房间分类：">
                        <!-- <el-select v-model="roomInfo.rmType" disabled>
                            <el-option v-for="item in typeList" :value="item" :key="item">{{ item }}</el-option>
                        </el-select> -->
                    </el-form-item>
                    <span>{{roomInfo.rmType}}</span>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="所在楼层：">
                        <!-- <el-select v-model="roomInfo.rmLevel" @on-change="changeFloor" disabled>
                            <el-option v-for="item in floorList" :value="item" :key="item" >{{ item }}</el-option>
                        </el-select> -->
                        <span>{{roomInfo.rmLevel}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="管  理  员：">
                        <!-- <el-input 
                            v-model="roomInfo.rmAdmin"
                            disabled
                            clearable
                            placeholder="点击加号添加人员" 
                        />
                        <img @click="addSubscribers" v-show="isShowAddBtn" class="add-member" :src="publicPath+'img/add-device-icon.png'"  alt=""> -->
                        <span>{{roomInfo.rmAdmin}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="联系方式：">
                        <!-- <el-input 
                            v-model="roomInfo.contact"
                            clearable
                            disabled
                            placeholder="" 
                        /> -->
                        <span>{{roomInfo.contact}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="房间用途：">
                        <!-- <el-input 
                            type="textarea" 
                            v-model="roomInfo.rmUse"
                            disabled
                            :autosize="{ minRows: 3, maxRows: 5 }" class="textarea-style">
                        </el-input> -->
                        <span>{{roomInfo.rmUse}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- <template #footer>
            <div class="footer-btn">
                <el-button @click="modal3 = false">取消</el-button>
                <el-button @click="handleEditRoom" v-if="isEditOrAdd">保存</el-button>
                <el-button @click="handleAddRoom" v-else>保存</el-button>
            </div>
        </template> -->
    </el-dialog>
    <!-- <memberModal ref="membersModal" @selectMembers="selectMembers"/> -->
    </div>
</template>

<script lang="ts" setup>
// import memberModal from './member-modal.vue'
import { ref,onMounted } from 'vue';
import emitter from '@/common/mybus.ts'
import {http,facilityManagementApi} from '@/common/request.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
    floorList: {
        type: Array,
        default: []
    }
})
let modal3 = ref(false)
let modal1 = false
let roomNumber = ''
let isShowAddBtn = true
let roomInfo = ref<any>({})
let defaultData ={
    accesssControlState: null,
    contact: null,
    envState: null,
    externalId: "",
    modelId: "",
    objectId: "",
    projectId: 0,
    projectName: "",
    rmAdmin: null,
    rmLevel: "",
    rmName: "",
    rmNumber: "",
    rmType: null,
    rmUse: null,
    roomId: null,
    videoSurveillance: null,
}
let typeList = ref([
    "生物类实验室",
    "化学类实验室",
    "物理类实验室",
    "科研办公区",
    "会议室、报告厅、多功能厅",
    "科研展示区",
    "一般仪器室",
    "暗室生物培养室接种间",
    "高精度天平室",
    "电镜室",
    "净化实验室",
    "试验室"
])
let isEditOrAdd = ref(false)
let membersModal = ref<any>(null)

onMounted(() => {
    emitter.on('showRoomModal', (item) => {
        roomInfo.value = defaultData
        console.log(item)
        // this.floorList = floorList
        modal3.value = true;
        if(item) {
            //编辑
            getRoomInfo(item)
            isEditOrAdd.value = true
        }else{
            //添加
            isEditOrAdd.value = false
        }
        
    });
})
//查询房间信息
let getRoomInfo = (item) => {
    let formData = new FormData();
    formData.append('roomId',item.roomId)
    facilityManagementApi.post('spaceMange/selectRoomById',formData)
        .then((res) => {
            console.log(res)
            let { data, code } = res.data
            if (code === 200) {
                roomInfo.value = data
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//添加人员
let addSubscribers = () => {
    membersModal.value?.showModal(roomInfo.value)
}
//选择楼层
let changeFloor = () => {
    
}

let emit = defineEmits(['integratedQuery'])
//编辑房间
let handleEditRoom = () => {
    facilityManagementApi.post('spaceMange/updateRoomById',roomInfo.value)
        .then((res) => {
            console.log(res)
            let { code,data } = res.data
            if (code == 200) {
                ElMessage.success(data)
                emit('integratedQuery')
                modal3.value = false
            }else{
                ElMessage.error(data)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//添加房间
let handleAddRoom = () => {
    facilityManagementApi.post('spaceMange/addRoom',roomInfo.value)
        .then((res) => {
            console.log(res)
            let { code,message } = res.data
            if (code === 200) {
                ElMessage.success(message)
                emit('integratedQuery')
                modal3.value = false
            }else{
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//选择的人员
let selectMembers = (member) => {
    roomInfo.value.rmAdmin = Array.from(new Set(member)).map( item => item?.userName).join(',')
    roomInfo.value.contact = Array.from(new Set(member)).map( item => item?.userPhone).join(',')
}
</script>
<style lang='scss'>
.addRoom,.selectSetUp{
    .ivu-modal-header{
        border-bottom: none !important;
    }
    .ivu-modal-header-inner {
        color: #304156;
        font-size: 16Px;
        font-family: PingFangSC-Medium, PingFang SC;
    }
    .ivu-modal-content{
       
    }
    .ivu-modal-body {
        min-height: 187Px;
        padding: 16px 20Px;
        .ivu-form-item-label {
            font-size: 12Px;
            text-align-last: justify;
        }
    }
    .ivu-modal-footer {
        border:none;
        padding: 0;
    }
}
.roomModal {
    .addRoom {
        width: 650px;
        background-color: rgba(5, 18, 54, 0.92);
        border: 1Px solid #1b4a7e;
        box-shadow: inset 0 0 24Px 0 rgb(0 143 255 / 54%);
        .el-dialog__header {
            text-align: left;
            span {
                color: #00FFFF;
            }
            .el-dialog__headerbtn .el-dialog__close {
                color: #00FFFF;
            }
        }
        .el-dialog__body {
            padding: 20px;
            .el-form-item__label {
                color: #00FFFF;
            }
            .el-form-item__content {
                span {
                    color: #96b2cf;
                }
            }
        }
        .el-input__wrapper {
            background-color: transparent !important;
            box-shadow: 0 0 0 1px #acadb0 inset;
        }
        .el-input.is-disabled .el-input__inner {
            color: #96b2cf;
        }
    }
}
</style>
<style lang='scss' scoped>
.roomModal {
    .addRoom {
        // /deep/ .el-dialog__header {
        //     text-align: left;
        // }
        // /deep/ .el-dialog__body {
        //     padding: 20px;
        // }
    }
}
// .modal-right {
//     display: inline-block;
//     width: 100%;
//     .add-member {
//         width: 22px;
//         position: absolute;
//         right: -24px;
//         top: 6px;
//         cursor: pointer;
//     }
    
//     ::v-deep.ivu-form-item {
//         margin-bottom: 10px;
//         .ivu-upload-list {
//             display: flex;
//             align-items: center;
//             flex-wrap: wrap;
//             .ivu-upload-list-file {
//                 padding: 0;
//                 .ivu-upload-list-remove {
//                     font-size: 20px;
//                     margin-top: 6px;
//                 }
//             }
//         }
//     }
// }
// .footer-btn {
//     // position: absolute;
//     // bottom: 0;
//     // left: 0;
//     // right: 0;
//     padding: 10Px 20Px 20Px 20Px;
//     text-align: right;
//     // display: flex;
//     // align-items: center;
//     // justify-content: end;
//     button {
//         margin-right: 20px;
//         width: 46Px;
//         height: 26Px;
//         font-size: 12Px;
//         padding: 0;
//         cursor: pointer;
//         margin-left: 0;

//         &:nth-child(1) {
//             background-color: transparent;
//             color: #3A4C5E;
//             border-color: #A3A9B0;
//         }

//         &:nth-child(2) {
//             background-color: #00bcff;
//             color: #fff;
//             border-color: #00bcff;
//             margin-right: 0;
//         }

//         &:last-child {
//             margin-right: 0;
//         }
//     }
// }
</style>