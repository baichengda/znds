<template>
<div class="roomModal">
    <Modal
        v-model="modal3"
        :draggable="true"
        :mask="false"
        sticky
        :reset-drag-position="true"
        :closable="false"
        class="addRoom"
        :class="{'roomModalStyle':$route.name==='monitoringCenter'}"
        title="">
        <div slot="header" class="modal-header">
            {{ `${isEditOrAdd?'编辑':'添加'}房间` }}
            <span style="float: right;font-size: 14px;vertical-align: middle;" v-permission="'空间管理-编辑'">
                三维可见
                <i-switch size="small" title="控制房间标签" v-model="roomInfo.whetherUse" />
            </span>
            
        </div>
        <Form :model="roomInfo" ref="formValidate" :rules="ruleValidate" label-position="left" class="modal-right" :label-width="85">
            <Row>
                <Col span="11">
                    <FormItem label="房间名称：" prop="rmName">
                        <Input 
                            v-model="roomInfo.rmName"
                            clearable
                            placeholder="请输入房间名称" 
                        />
                    </FormItem>
                </Col>
                <Col span="11" offset="2">
                    <FormItem label="门牌号：" prop="houseNumber">
                        <Input 
                            v-model="roomInfo.houseNumber"
                            clearable
                            placeholder="请输入门牌号" 
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <FormItem label="房间分类：">
                        <Select v-model="roomInfo.rmType">
                            <Option v-for="item in typeList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="11" offset="2">
                    <FormItem label="使用面积：" prop="rmArea">
                        <Input 
                            v-model="roomInfo.rmArea"
                            clearable
                            placeholder="" 
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <FormItem label="管 理 员：">
                        <Input 
                            v-model="roomInfo.rmAdmin"
                            disabled
                            clearable
                            placeholder="点击加号添加人员" 
                        />
                        <img @click="addSubscribers('rmAdmin')" v-show="isShowAddBtn" class="add-member" :src="publicPath+'img/add-device-icon.png'"  alt="">
                    </FormItem>
                </Col>
                <Col span="11" offset="2">
                    <FormItem label="联系方式：">
                        <Input 
                            v-model="roomInfo.contact"
                            clearable
                            @on-keyup="checkVal('contact')"
                            placeholder="" 
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                    <FormItem label="安 全 员：">
                        <Input 
                            v-model="roomInfo.rmSafety"
                            disabled
                            clearable
                            placeholder="点击加号添加人员" 
                        />
                        <img @click="addSubscribers('rmSafety')" v-show="isShowAddBtn" class="add-member" :src="publicPath+'img/add-device-icon.png'"  alt="">
                    </FormItem>
                </Col>
                <Col span="11" offset="2">
                    <FormItem label="联系方式：">
                        <Input 
                            v-model="roomInfo.safetyContact"
                            clearable
                            @on-keyup="checkVal('safetyContact')"
                            placeholder="" 
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row class="category">
                <Col span="24">
                    <img src="@/assets/images/space-management/add-class.png" @click="selectClass('危险类别',roomInfo.dangerous)" alt="">
                    <FormItem label="危险类别：">
                        <div> &nbsp;</div>
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.dangerous" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </FormItem>
                </Col>
                <Col span="24">
                    <img src="@/assets/images/space-management/add-class.png" @click="selectClass('防护要点',roomInfo.protect)" alt="">
                    <FormItem label="防护措施：">
                        <div> &nbsp;</div>
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.protect" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </FormItem>
                </Col>
                <Col span="24">
                    <img src="@/assets/images/space-management/add-class.png" @click="selectClass('灭火要点',roomInfo.outfire)" alt="">
                    <FormItem label="灭火要点：">
                        <div> &nbsp;</div>
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.outfire" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </FormItem>
                </Col>
                <Col span="24">
                    <img src="@/assets/images/space-management/add-class.png" @click="selectClass('救援类型',roomInfo.rescue)" alt="">
                    <FormItem label="救援类型：">
                        <div> &nbsp;</div>
                        <ul class="class-risk">
                            <li v-for="(item,index) in roomInfo.rescue" :style="styleChange()">{{ item.name }}</li>
                        </ul>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="房间用途：">
                        <Input 
                            type="textarea" 
                            v-model="roomInfo.rmUse"
                            :autosize="{ minRows: 3, maxRows: 5 }" class="textarea-style">
                        </Input>
                    </FormItem>
                </Col>
            </Row>
            
        </Form>
        <!-- <div class="content">
            <div class="roomInfo">
                <span>房间编号：</span>
                <Input 
                    v-model.number="roomInfo.rmNumber"
                    clearable
                    placeholder="请输入房间编号" 
                />
            </div>
            <div class="roomInfo" style="padding-left: 12px;">
                <span>房间名称：</span>
                <Input 
                    v-model="roomInfo.rmName"
                    clearable
                    placeholder="请输入房间名称" 
                />
            </div>
            <div class="roomInfo">
                <span>所在类型：</span>
                <Select v-model="roomInfo.rmType">
                    <Option v-for="item in typeList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </div>
            <div class="roomInfo" style="padding-left: 12px;">
                <span>所在楼层：</span>
                <Select v-model="roomInfo.rmLevel" @on-change="changeFloor">
                    <Option v-for="item in floorList" :value="item" :key="item" >{{ item }}</Option>
                </Select>
            </div>
            <div class="roomInfo">
                <span>管理员：</span>
                <Input 
                    v-model="roomInfo.rmAdmin"
                    disabled
                    clearable
                    placeholder="点击加号添加人员" 
                />
                <img @click="addSubscribers" v-show="isShowAddBtn" :src="publicPath+'img/add-device-icon.png'"  alt="">
            </div>
            <div class="roomInfo" style="padding-left: 12px;">
                <span>联系方式：</span>
                <Input 
                    v-model="roomInfo.contact"
                    clearable
                    placeholder="" 
                />
            </div>
           <div class="roomPurpose">
                <span>房间用途：</span>
                <Input 
                    type="textarea" 
                    v-model="roomInfo.rmUse"
                    :autosize="{ minRows: 3, maxRows: 5 }" class="textarea-style">
                </Input>
            </div>
        </div> -->
        
        <template slot="footer">
            <div class="footer-btn" v-permission="'空间管理-编辑'">
                <Button @click="modal3 = false">取消</Button>
                <Button @click="handleEditRoom('formValidate')" v-if="isEditOrAdd">保存</Button>
                <Button @click="handleAddRoom('formValidate')" v-else>保存</Button>
            </div>
        </template>
    </Modal>
    <!-- <memberModal ref="membersModal" @selectMembers="selectMembers"/>
    <classModal ref="classmodal" @selectAllData="selectAllData"/> -->
    </div>
</template>

<script>
// import memberModal from './member-modal.vue'
// import classModal from './class-modal.vue'
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
            modal1: false,
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
                rmName: [
                    { required: true, message: '请填写房间名称', trigger: 'blur' }
                ],
                houseNumber: [
                    { required: true, message: '请填写门牌号', trigger: 'blur' }
                ],
                rmArea: [
                    { required: true, message: '请填写使用面积', trigger: 'blur' }
                ],
            },
            typeList: [
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
                "试验室",
                "其他"
            ],
            baseData: [
                {
                    expand: false,
                    title: 'F01',
                    children: [
                        {
                            title: '理化室 101',
                            expand: true,
                            checked: false,
                        }, 
                        {
                            title: '理化室 102',
                            expand: true,
                            checked: false,
                        },
                        {
                            title: '理化室 103',
                            expand: true,
                            checked: false,
                        },
                    ]
                },
                {
                    expand: false,
                    title: 'F02',
                    children: [
                        {
                            title: '理化室 101',
                            expand: true,
                            checked: false,
                        }, 
                        {
                            title: '理化室 102',
                            expand: true,
                            checked: false,
                        },
                        {
                            title: '理化室 103',
                            expand: true,
                            checked: false,
                        },

                    ]
                },
            ],
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
    components: {
        // memberModal,
        // classModal,
    },
    mounted() {
        this.$EventBus.$on('showRoomModal', (item) => {
            this.roomInfo = this.defaultData
            // this.floorList = floorList
            this.modal3 = true;
            if(item) {
                //编辑
                this.getRoomInfo(item)
                this.isEditOrAdd = true
            }else{
                //添加
                this.isEditOrAdd = false
            }
          
        });

        this.$EventBus.$on('monitoringCenterViewRoomModal', data => {
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
            this.$facilityManagementApi.post('spaceMange/selectRoomById',formData)
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
        //添加人员
        addSubscribers(param) {
            this.selectRmAdminOrRmSafety = param
            this.$refs.membersModal.showModal(this.roomInfo)
        },
        //选择楼层
        changeFloor() {
            
        },
        //编辑房间
        handleEditRoom(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$facilityManagementApi.post('spaceMange/updateRoomById',this.roomInfo)
                    .then((res) => {
                        let { code,data } = res.data
                        if (code == 200) {
                            this.$Message.success(data)
                            this.$emit('integratedQuery')
                            this.modal3 = false
                            //在监控中心编辑后重新请求房间数据
                            if(this.$route.name == 'monitoringCenter'){
                                let { modelId, objectId, whetherUse } = this.roomInfo
                                this.$EventBus.$emit('refreshGetData') //请求房间数据
                                this.$EventBus.$emit('requestSubNavData') //请求导航当前点击层级数据
                                whetherUse ? $(`#room-${objectId}-${modelId}`).show() : $(`#room-${objectId}-${modelId}`).hide()
                            }
                        }else{
                            this.$Message.error(data)
                        }
                    })
                    .catch((error) => {
                        console.log('error');
                    });
                } else {
                    this.$Message.error('请检查必填项!');
                }
            })
            
        },
        //添加房间
        handleAddRoom(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$facilityManagementApi.post('spaceMange/addRoom',this.roomInfo)
                    .then((res) => {
                        let { code,message } = res.data
                        if (code === 200) {
                            this.$Message.success(message)
                            this.$emit('integratedQuery')
                            this.modal3 = false
                        }else{
                            this.$Message.error(message)
                        }
                    })
                    .catch((error) => {
                        console.log('error');
                    });
                } else {
                    this.$Message.error('请检查必填项!');
                }
            })
            
        },
        //选择的人员
        selectMembers(member) {
            if(this.selectRmAdminOrRmSafety=='rmAdmin') {
                this.roomInfo.rmAdmin = Array.from(new Set(member)).map( item => item.userName).join(',')
                this.roomInfo.contact = Array.from(new Set(member)).map( item => item.userPhone).join(',')
            }else{
                this.roomInfo.rmSafety = Array.from(new Set(member)).map( item => item.userName).join(',')
                this.roomInfo.safetyContact = Array.from(new Set(member)).map( item => item.userPhone).join(',')
            }
        },
        //切换可见隐藏
        // controlRoomLabel(data) {
        //     console.log(data)
        //     let { objectId,modelId } = this.roomInfo
        //     let formData = new FormData()
        //     formData.append('objectId',objectId)
        //     formData.append('modelId',modelId)
        //     formData.append('whetherUse',data)
        //     this.$facilityManagementApi.post('spaceMange/whethershow',formData)
        //         .then((res) => {
        //             console.log(res)
        //             let { data, code, message } = res.data
        //             if (code === 200) {
        //                 this.$Message.success(message)
        //                 data ? $(`#room-${objectId}-${modelId}`).show() : $(`#room-${objectId}-${modelId}`).hide()
        //             }else{
        //                 this.$Message.error(message)
        //             }
        //         })
        //         .catch((error) => {
        //             console.log('error');
        //         });
        // },

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
.footer-btn {
    // position: absolute;
    // bottom: 0;
    // left: 0;
    // right: 0;
    padding: 10Px 20Px 20Px 20Px;
    text-align: right;
    // display: flex;
    // align-items: center;
    // justify-content: end;
    button {
        margin-right: 20px;
        width: 46Px;
        height: 26Px;
        font-size: 12Px;
        padding: 0;
        cursor: pointer;
        margin-left: 0;

        &:nth-child(1) {
            background-color: transparent;
            color: #3A4C5E;
            border-color: #A3A9B0;
        }

        &:nth-child(2) {
            background-color: #00bcff;
            color: #fff;
            border-color: #00bcff;
            margin-right: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }
}
</style>