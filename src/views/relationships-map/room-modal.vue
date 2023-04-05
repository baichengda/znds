<template>
<div class="roomModal">
    <el-dialog
        v-model="modal3"
        :draggable="true">
        <template class="modal-header" #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <span :class="titleClass">{{ '理化实验室-1201' }}</span>
            </div>
        </template>
        <el-form :model="roomInfo" ref="formValidate" :rules="ruleValidate" label-position="left" class="modal-right" :label-width="85">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="房间名称：" prop="rmName">
                        <!-- <el-input 
                            v-model="roomInfo.rmName"
                            clearable
                            placeholder="请输入房间名称" 
                        /> -->
                        <span>{{ roomInfo.rmName }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="门牌号：" prop="houseNumber">
                        <!-- <el-input 
                            v-model="roomInfo.houseNumber"
                            clearable
                            placeholder="请输入门牌号" 
                        /> -->
                        <span>{{ roomInfo.houseNumber }}</span>
                        
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="房间分类：">
                        <!-- <el-select v-model="roomInfo.rmType">
                            <Option v-for="item in typeList" :value="item" :key="item">{{ item }}</Option>
                        </el-select> -->
                        <span>{{ roomInfo.rmType }}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="使用面积：" prop="rmArea">
                        <!-- <el-input 
                            v-model="roomInfo.rmArea"
                            clearable
                            placeholder="" 
                        /> -->
                        <span>{{ roomInfo.rmArea }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="管 理 员：">
                        <!-- <el-input 
                            v-model="roomInfo.rmAdmin"
                            disabled
                            clearable
                            placeholder="点击加号添加人员" 
                        /> -->
                        <span>{{ roomInfo.rmAdmin }}</span>
                        <!-- <img @click="addSubscribers('rmAdmin')" v-show="isShowAddBtn" class="add-member" :src="publicPath+'img/add-device-icon.png'"  alt=""> -->
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="联系方式：">
                        <!-- <el-input 
                            v-model="roomInfo.contact"
                            clearable
                            @on-keyup="checkVal('contact')"
                            placeholder="" 
                        /> -->
                        <span>{{ roomInfo.contact }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="安 全 员：">
                        <!-- <el-input 
                            v-model="roomInfo.rmSafety"
                            disabled
                            clearable
                            placeholder="点击加号添加人员" 
                        /> -->
                        <span>{{ roomInfo.rmSafety }}</span>
                        <!-- <img @click="addSubscribers('rmSafety')" v-show="isShowAddBtn" class="add-member" :src="publicPath+'img/add-device-icon.png'"  alt=""> -->
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="联系方式：">
                        <!-- <el-input 
                            v-model="roomInfo.safetyContact"
                            clearable
                            @on-keyup="checkVal('safetyContact')"
                            placeholder="" 
                        /> -->
                        <span>{{ roomInfo.safetyContact }}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="category">
                <el-col :span="24">
                    <!-- <img src="@/assets/images/space-management/add-class.png" @click="selectClass('危险类别',roomInfo.dangerous)" alt=""> -->
                    <el-form-item label="危险类别：">
                        <div> &nbsp;</div>
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.dangerous" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- <img src="@/assets/images/space-management/add-class.png" @click="selectClass('防护要点',roomInfo.protect)" alt=""> -->
                    <el-form-item label="防护措施：">
                        <!-- <div> &nbsp;</div> -->
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.protect" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- <img src="@/assets/images/space-management/add-class.png" @click="selectClass('灭火要点',roomInfo.outfire)" alt=""> -->
                    <el-form-item label="灭火要点：">
                        <!-- <div> &nbsp;</div> -->
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.outfire" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <!-- <img src="@/assets/images/space-management/add-class.png" @click="selectClass('救援类型',roomInfo.rescue)" alt=""> -->
                    <el-form-item label="救援类型：">
                        <!-- <div> &nbsp;</div> -->
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.rescue" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="房间用途：">
                        <el-input 
                            type="textarea"
                            readonly="true"
                            v-model="roomInfo.rmUse"
                            :autosize="{ minRows: 3, maxRows: 5 }" class="textarea-style">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import emitter from '@/common/mybus.ts'
import { facilityManagementApi } from '@/common/request.js'
export default {
    props: {
        // floorList: {
        //     type: Array,
        //     default: []
        // }
    },
    data() {
        return {
            modal3: false,
            roomNumber: '',
            isShowAddBtn: true,
            roomInfo: {
                //危险类别
                dangerous: [
                    // {name: '易燃气体',type: ''},
                ], 
                //防护措施
                protect: [
                    // {name: '禁带火种',type: ''},
                ],
                //灭火要点
                outfire: [
                    // {name: '手提二氧化碳灭火器',type: ''},
                ],
                //救援类型
                rescue: [],
            },
            defaultData:{
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
                houseNumber: "",
                rmType: null,
                rmArea: null,
                roomId: null,
                videoSurveillance: null,
                rmSafety: '',
                safetyContact: '',
                whetherUse: true
            },
            ruleValidate: {
                
            },
            
            isEditOrAdd: false,
            selectRmAdminOrRmSafety: '', //区分是往安全员中添加数据还是管理员中添加数据
            
            randomColor: [
                {
                    backgroundColor: 'rgba(22, 156, 252, 0.18)',
                    color: '#169CFC',
                    borderColor: 'rgba(22, 156, 252, 0.15)'
                },
                {
                    backgroundColor: 'rgba(95, 129, 253, 0.15)',
                    color: '#486FFD',
                    borderColor: 'rgba(95, 129, 253, 0.1))'
                },
                {
                    backgroundColor: 'rgba(138, 56, 245, 0.12)',
                    color: '#8A38F5',
                    borderColor: 'rgba(138, 56, 245, 0.1)'
                },
                {
                    backgroundColor: 'rgba(18, 174, 226, 0.1)',
                    color: '##0DC3DF',
                    borderColor: 'rgba(18, 174, 226, 0.15)'
                }
            ],
            className: '', //选择的是那个类别，回调回显时显到哪个里边
        }
    },
    mounted() {
        
        emitter.on('showRoomModal', (item) => {
            this.roomInfo = this.defaultData
            this.modal3 = true;
            this.getRoomInfo(item)
        });

        emitter.on('monitoringCenterViewRoomModal', data => {
            this.modal3 = true;
            this.getRoomInfo(data)
        })
    },
    methods: {
        //选择类别弹窗回调
        selectAllData(data) {
            
            switch(this.className) {
                case '危险类别':
                    this.$set(this.roomInfo,'dangerous',data)
                    break;
                case '防护措施':
                    this.$set(this.roomInfo,'protect',data)
                    break;
                case '灭火要点':
                    this.$set(this.roomInfo,'outfire',data)
                    break;
                case '救援类型':
                    this.$set(this.roomInfo,'rescue',data)
                    break;
            }
        },
        //选择类别
        selectClass(className,data) {
            this.className = className
            this.$refs.classmodal.showModal(className,data)
        },
        //随机颜色
        styleChange() {
            let index = Math.ceil(Math.random()*3)
            return this.randomColor[index]
        },
        //校验产品寿命只能输入整数int
        checkVal(param) {
            if(this.value == 0){
                this.roomInfo[param] = ""
            }else{
                this.roomInfo[param] = this.roomInfo[param].replace(/\D/g,'')
            }
        },
        //查询房间信息
        getRoomInfo(item) {
            let formData = new FormData();
            formData.append('roomId',item.roomId)
            facilityManagementApi.post('spaceMange/selectRoomById',formData)
                .then((res) => {
                    let { data, code } = res.data
                    if (code === 200) {
                        this.roomInfo = data
                    }
                })
                .catch((error) => {
                    console.log('error');
                });
        },
    }
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
            text-align: right;
            // text-align-last: justify;
        }
    }
    .ivu-modal-footer {
        border:none;
        padding: 0;
    }
}
.roomModalStyle {
    .modal-header {
        color: #96b2cf;
        .ivu-switch-checked {
            border-color: #00bcff;
            background-color: #00bcff;
        }
    }
    .ivu-modal-content {
        background-color: rgba(5, 18, 54, 0.92);
        border: 1Px solid #1b4a7e;
        box-shadow: inset 0 0 24Px 0 rgba(0, 143, 255, 54%);
    }
    .ivu-modal-header-inner {
        color: #00FFFF;
    }
    .ivu-modal-body {
        .ivu-form-item-label {
            color: #96b2cf;
        }
        .ivu-form-item {
            // margin-bottom: 0 !important;
            .ivu-form-item-content {
                span {
                    color: #96b2cf;
                }
                .ivu-select-single .ivu-select-selection {
                    background-color: transparent;
                    border-color: rgba(0, 188, 255, 0.5);
                }
            }   
            .ivu-upload-list {
                margin-top: 0;
                .ivu-upload-list-file {
                    background-color: transparent;
                    &:hover {
                        color: #00FFFF;
                    }
                }
            }
        }
        .ivu-row {
            margin-bottom: 10px;
        }
    }
    .device-content {
        h2 {
            color: #00FFFF !important;
            background-color: transparent !important;
            margin-bottom: 0 !important;
        }
        .modal-left .pic .demo-upload-list {
            background: transparent !important;
            // border-color: #96b2cf !important;
        }
        .upload-file {
            display: flex;
            align-items: center;
        }
        .ivu-upload-drag {
            background: transparent;
            border: 1px solid #96b2cf;
        }
    }
    .ivu-input {
        background-color: transparent;
        border-color: rgba(0, 188, 255, 0.5);
        color: #96b2cf;
        &::placeholder{
            color: #96b2cf;
        }
    }
    .footer-btn {
        button {
            &:nth-child(1) {
                color: #96b2cf !important;
            }
        }
    }
}
.roomModal {
    .el-overlay {
        .el-dialog {
            background: rgba(10,31,59,0.95);
            border-radius: 8px;
            width: 650px;
            .el-form-item {
                margin-bottom: 10px;
                font-family: 'SourceHanSansCN-Regular';
                font-size: 16px;
                .el-form-item__label {
                    color: #fff;
                    justify-content: flex-end;
                    span {
                        color: #9DA5B1;
                    }
                }
                .el-form-item__content {
                    span {
                        color: #9DA5B1;
                    }
                }
                .el-textarea__inner {
                    font-family: 'SourceHanSansCN-Regular';
                    background-color: transparent;
                    border: 1px solid #344F73;
                    border-radius: 8px;
                    color: #9DA5B1;
                    box-shadow: none;
                }
            }
            .el-dialog__body {
                padding-top: 10px;
            }
        }
    }
    .my-header {
        text-align: left;
        span {
            font-family: 'SourceHanSansCN-Regular';
            color: #fff;
            font-size: 18px;
        }
    }
    
}
</style>
<style lang='scss' scoped>
.addRoom {
    ::v-deep .ivu-modal-header {
        padding: 20px 20Px 10px;
        .modal-header {
            font-size: 18px;
        }
    }
    
}
.modal-right {
    display: inline-block;
    width: 100%;
    .add-member {
        width: 20px;
        position: absolute;
        right: -24px;
        top: 6px;
        cursor: pointer;
    }
    
    ::v-deep .ivu-form-item {
        margin-bottom: 10px;
        .ivu-upload-list {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .ivu-upload-list-file {
                padding: 0;
                .ivu-upload-list-remove {
                    font-size: 20px;
                    margin-top: 6px;
                }
            }
        }
    }
    .category {
        position: relative;
        img {
            position: absolute;
            right: 0;
            width: 20px;
            cursor: pointer;
            z-index: 2;
        }
        .class-risk {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            max-height: 90px;
            overflow: hidden;
            &:hover {
                overflow: auto;
                &::-webkit-scrollbar {
                    width: 5px; /*对垂直流动条有效*/
                    height: 5px; /*对水平流动条有效*/
                    cursor: pointer;
                }
                /*定义滑块颜色、内阴影及圆角*/
                &::-webkit-scrollbar-thumb{
                    border-radius: 7px;
                    // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
                    background-color: rgba(152, 154, 156,0.3);
                }
            }
            li {
                width: auto;
                height: 24px;
                font-size: 14px;
                border: 1px solid;
                line-height: 24px;
                text-align: center;
                padding: 0 4px;
                border-radius: 2px;
                margin-right: 10px;
                margin-bottom: 10px;
            }
        }
    }
}
.roomModal {
    color: #fff;
    .el-overlay {
        color: #fff;
        .el-dialog {
            background: rgba(10,31,59,0.95);
            border-radius: 8px;
        }
    }
    
}
</style>