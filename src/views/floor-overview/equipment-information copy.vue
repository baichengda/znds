<template>
    <el-dialog
        v-model="infoModal"
        :title="infos.devName"
        draggable
        custom-class="eq-info"
        width="510Px"
        :transfer="false"
    >
        <dl class="equipment-information">
            <!-- 设备信息 -->
            <dd>
                <div class="parameters-icon">
                    <span>设备信息</span>
                </div>
            </dd>
            <dl class="device-names normal-style">
                <dd>
                    <div>
                        <span class="deviceTitle">设备名称:</span>
                        <span
                            type="text"
                            v-show="!editing0"
                            @dblclick="handleFocus('end',infos.devName,0)"
                            v-bind:title="infos.devName"
                            class="editor-input-style"
                            >{{ infos.devName }}</span
                        >
                        <!-- <p class="edit_ipt" v-show="editing0">{{ipt_text0.split('-')[0]}}</p> -->
                        <!-- <el-input class="edit_ipt" v-model="ipt_text0.split('-')[0]" ref="input0" v-show="editing0" disabled/> -->
                        <el-input class="edit_ipt" v-model="ipt_text0" ref="input0" v-show="editing0" @on-blur="save($event,0)" />
                    </div>
                    <div>
                        <span class="deviceTitle">设备编号:</span>
                        <span
                            v-show="!editing1" 
                            @dblclick="handleFocus('end',infos.devNumber,1)"
                            type="text"
                            v-bind:title="infos.devNumber"
                            class="editor-input-style can_edit"
                            >{{ infos.devNumber }}</span
                        >
                        <el-input class="edit_ipt" v-model="ipt_text1" ref="input1" v-show="editing1" @on-blur="save($event,1)" />
                    </div>
                </dd>
                <dd>
                    <div>
                        <span class="deviceTitle">设备型号:</span>
                        <span
                            type="text"
                            v-show="!editing2"
                            @dblclick="handleFocus('end',infos.devSpecifications,2)"
                            v-bind:title="infos.devSpecifications"
                            class="editor-input-style"
                            >{{ infos.devSpecifications }}</span
                        >
                        <el-input class="edit_ipt" v-model="ipt_text2" ref="input2" v-show="editing2" @on-blur="save($event,2)" />
                    </div>
                    <div>
                        <span class="deviceTitle">设备位置:</span>
                        <span
                            type="text"
                            v-show="!editing3"
                            @dblclick="handleFocus('end',infos.devLocation,3)"
                            v-bind:title="infos.devLocation"
                            class="editor-input-style can_edit"
                            >{{ infos.devLocation }}</span
                        >
                        <el-input class="edit_ipt" v-model="ipt_text3" ref="input3" v-show="editing3" @on-blur="save($event,3)" />
                    </div>
                </dd>
            </dl>

            <!-- 设备参数 -->
            <dd @click="showNext($event,1)" >
                <div class="parameters-icon">
                    <span>设备参数</span>
                    <img :src="flagObj.flag1 ? imgUp : imgDown" alt="" />
                </div>
            </dd>
            <dl
                class="device-names"
            >
                <dd class="device-param">
                    <div v-for="item in infos.deviceAlldetials && JSON.parse(infos.deviceAlldetials)">
                        <span 
                        class="deviceTitle"
                        v-bind:title="item.key"
                            >{{ item.key }}:</span
                        >
                        <span class="editor-input-style">
                            {{item.value}}
                        </span>
                        <!-- <input
                            type="text"
                            class="editor-input-style"
                            v-bind:title="item.value"
                            disabled
                            v-model="item.value"
                        /> -->
                    </div>
                </dd>
            </dl>

            <!-- 维保信息 -->
            <dd @click=" showNext($event,2)">
                <div class="parameters-icon">
                    <span>维保信息</span>
                    <img :src="flagObj.flag2 ? imgUp : imgDown" alt="" />
                </div>
            </dd> 
            <dl
                class="device-names normal-style"
            >
                <dd style="display: block;width: 100%">
                    <div style="width: 100%">
                        <span class="deviceTitle">设备厂家:</span>
                        <span
                            type="text"
                            class="editor-input-style"
                            >{{ infos.devManufacturer }}</span
                        >
                    </div>
                </dd>
                <dd>
                    <div>
                        <span class="deviceTitle">联系人:</span>
                        <span type="text" class="editor-input-style">{{
                            infos.manufacturerContact
                        }}</span>
                    </div>
                    <div>
                        <span class="deviceTitle">联系电话:</span>
                        <span type="text" class="editor-input-style">{{
                            infos.manufacturerContactNum
                        }}</span>
                    </div>
                </dd>
                <dd style="display: block;width: 100%">
                    <div style="width: 100%">
                        <span class="deviceTitle">供货厂家:</span>
                        <span
                            type="text"
                            class="editor-input-style"
                            >{{ infos.devSupplier }}</span
                        >
                    </div>
                </dd>
                <dd>
                    <div>
                        <span class="deviceTitle">联系人:</span>
                        <span type="text" class="editor-input-style">{{
                            infos.supplierContact
                        }}</span>
                    </div>
                    <div>
                        <span class="deviceTitle">联系电话:</span>
                        <span type="text" class="editor-input-style">{{
                            infos.supplierContactNum
                        }}</span>
                    </div>
                </dd>
                <dd>
                    <div>
                        <span class="deviceTitle">保修到期:</span>
                        <span type="text" class="editor-input-style">{{
                            infos.warrantyDeadline
                        }}</span>
                    </div>
                    <div>
                        <span class="deviceTitle">产品寿命:</span>
                        <span type="text" class="editor-input-style"
                            >{{ infos.devLife }}月</span
                        >
                    </div>
                </dd>
                <dd>
                    <div>
                        <span class="deviceTitle">检修周期:</span>
                        <span type="text" class="editor-input-style"
                            >{{ infos.maintenanceCycle }}月</span
                        >
                    </div>
                    <div>
                        <span class="deviceTitle">购置日期:</span>
                        <span type="text" class="editor-input-style">{{
                            infos.purchaseDate
                        }}</span>
                    </div>
                </dd>
            </dl>
            <!-- 设备文档 -->
            <dd @click="showNext($event,3)" class="normal-style">
                <div class="parameters-icon">
                    <span>设备文档</span>
                    <img :src="flagObj.flag3 ? imgUp : imgDown" alt="" />
                </div>
            </dd>
            <dl class="device-names padfs ">
                <dd
                    v-for="(item, index) in infos.uploadPdf"
                    :key="item.name"
                    class="pdf-model"
                >
                    <span style="margin-right: 5px;color: #96b2cf">{{ item.name }}</span>
                    <span
                        style="cursor: pointer; color: #00bcff"
                        @click="previewPDF(item.url)"
                    >
                        查看
                    </span>
                </dd>
            </dl>
        </dl>
    </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted,ref,getCurrentInstance,reactive } from 'vue'
import emitter from '@/common/mybus.ts'
import {http} from '@/common/request.js'
import { ElMessage } from 'element-plus'
let { appContext } = getCurrentInstance() || {}

let editing0= ref(false)//双击编辑
let editing1= ref(false)//双击编辑
let editing2= ref(false)//双击编辑
let editing3= ref(false)//双击编辑
let ipt_text0= ref('')//编辑前默认值
let ipt_text1= ref('')//编辑前默认值
let ipt_text2= ref('')//编辑前默认值
let ipt_text3= ref('')//编辑前默认值
let current_dbid= ref('')
let publicPath= process.env.BASE_URL
let infoModal= ref(false)
let PDFModel= false
let infos= ref([] as any)
let artifactsName= "" //构件名称
let deviceFactory= "" //设备厂家
let status= "故障"
let statusDesc= "404" //状态描述
let failureNumber= 0 // 故障次数
let repairNumber= 0 //报修次数
let devicedetail= [] //设备参数
let deviceFactoryphone= "" //厂家电话
let repairPeriod= "" //报修期限
let productLife= "" //产品寿命
let repairCycle= "" // 报修周期
let attachment= "" // 产品附件
let repairs= [] //维保记录
let deviceMark= "" //设备型号
let deviceNumber= "" //设备编号
let deviceArea= "" //设备位置
let deviceinstalldate= "" //安装日期
let provideTime= "" //购置日期
let src= ""
let numPages= ""
let deviceId= ""
let repairContent= {
    checkUser: [],
    deviceName: "",
    repairSerial: "",
    repairDate: "",
    workUser: [],
    model_id: "",
    rightmenu: { dbid: "" },
}
let currentPage= 0 // pdf文件页码
let pageCount= 0 // pdf文件总页数
let fileType= "pdf" // 文件类型
let imgDown= new URL("../../assets/images/detail-down.png",import.meta.url).href
let imgUp= new URL("../../assets/images/detail-up.png",import.meta.url).href

let flagObj = reactive({
    flag1: true,
    flag2: true,
    flag3: true,
})
let transf= ""
let shebei_cj= ""
let shebei_person= ""
let shebei_phone= ""
let gonghuo_cj= ""
let gonghuo_person= ""
let gonghuo_phone: ""

onMounted(() => {
    //接收右键设备信息ID
        emitter.on("rightmenu", (param) => {
            // this.rightmenu = param;
            let {dbid,modelId} = param
            viewInfo(dbid,modelId);
        });
        // emitter.on("goRepair", (currentData) => {
        //     this.goRepair(currentData);
        // });
        // emitter.on("viewInfo", (currentData) => {
        //     let {dbid,modelId} = currentData
        //     viewInfo(dbid,modelId);
        // });
        // window.toShowDeviceInfoModel = (param) => {
        //     let { dbid } = param
        //     //查看设备信息
        //     this.viewInfo(dbid);
        // };
        // window.toShowRepairInfoModel = (dbid) => {
        //     //我要报修
        //     this.goRepair(dbid);
        // };
        // window.toShowIgnoreInfoModel = (dbid) => {
        //     //忽略警报
        //     this.handleIgnoreWarning(dbid);
        // };
        // this.$EventBus.$on("saveSelectDbid", (list) => {
        //     this.deviceId = list.model_id;
        // });
        // // 多模型的选择集变更事件的监听方式
        // var self = this;
        // window.yst_viewer&&yst_viewer.addEventListener( //弹窗弹出状态下点击构件请求相对应得构件信息并显示
        // Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, //!<<<< 事件名称
        // function (event) { //!<<<< 回调函数（匿名函数）
        //     let selections = event.selections;
        //     if(selections.length>0&&self.infoModal) {
        //         let dbid = selections[0].dbIdArray[0]
        //         self.viewInfo(dbid)
        //     }
            
        // });
})

let save = (e,current) => {
    // let inpText = this['ipt_text'+current];
    // switch (current) {
    //     case 0:
    //         let name = inpText.split('-')[0]
    //         infos.value.devName = inpText
    //         $store.commit('changeDeviceName',inpText)
    //         break;
    //     case 1:
    //         infos.value.devNumber = inpText
    //         this.$store.commit('changeDeviceNum',inpText)
    //         break;
    //     case 2:
    //         infos.value.devSpecifications = inpText
    //         break;
    //     case 3:
    //         infos.value.devLocation = inpText
    //         break;
    //     default:
    //         break;
    // }
    // this['editing'+current] = false;
    // this.edit_save()
    // this.inpChange = ''
}
let handleFocus = (type,param,current) => { //双击编辑
    // this['ipt_text'+current] = param
    // this['editing'+current] = true
    // this.$nextTick(()=> {
    //     this.$refs['input'+current].focus({
    //         cursor: type
    //     });
    // })
}
let showNext = (e, index) => {
    flagObj['flag'+index] = !flagObj['flag'+index]
    // this['flag'+index] = !this['flag'+index];
    $(e.currentTarget).next().toggle(200);
}
// 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
let changePdfPage = (val) => {
    // console.log(val)
    // if (val === 0 && this.currentPage > 1) {
    //     this.currentPage--;
    //     // console.log(this.currentPage)
    // }
    // if (val === 1 && this.currentPage < this.pageCount) {
    //     this.currentPage++;
    //     // console.log(this.currentPage)
    // }
}
// pdf加载时
let loadPdfHandler = (e) => {
    // this.currentPage = 1; // 加载的时候先加载第一页
}
let handleIgnoreWarning = () => {
    // $("._groupwarning").empty();
    // $(".goujianbaoxiu").animate({ opcity: "0" });
    // this.$Message.info("已忽略");
}
//预览pdf
let previewPDF = (url) => {
    window.open(appContext?.config.globalProperties.$baseURL+url,"newwindow","height=600, width=600,top=100,left=200,toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no,status=no")
}
//修改设备编号或者设备位置后保存
let edit_save = () => {
    http.post('/sheshiguanli_data/updateDeviceMessage',{
        "objectId":current_dbid.value,
        "devLocation":infos.value.devLocation,
        "devNumber":infos.value.devNumber,
        "devName":infos.value.devName,
        "devSpecifications":infos.value.devSpecifications
        },{emulateJSON:true})
        .then((res)=> {
            if(res.data.success) {
                ElMessage.success(res.data.message)
                emitter.emit('updateNav')
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
let viewInfo = (dbId,modelId) => {
    //调出设备信息框
    current_dbid.value = dbId;
    let formData = new FormData();
    formData.append("dbId",dbId)
    formData.append("modelId",modelId)
    http.post('/sheshiguanli_data/popup',formData,{emulateJSON:true})
        .then((res)=> {
            if(res.data.success) {
                var list = res.data.data.list;
                infoModal.value = true;
                infos.value = list;
            }
        })
        .catch(function (error) {
        console.log(error);
        });
}

</script>
<style lang="scss">
.eq-info {
    background: rgba(5, 18, 54, 0.92);
    border: 1Px solid #1b4a7e;
    box-shadow: inset 0 0 24Px 0 rgba(0, 143, 255, 54%);
    .el-dialog__header {
        text-align: left;
        span {
            color: #00FFFF;
        }
    }
}
</style>
<style lang="scss" scoped>
.eq-info {
    background: rgba(5, 18, 54, 0.92);
    border: 1Px solid #1b4a7e;
    box-shadow: inset 0 0 24Px 0 rgba(0, 143, 255, 54%);
    
    .equipment-information {
        &>dd {
            margin: 8Px 0;
        }
        
        
        .parameters-icon {
            color:#00FFFF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            img {
                width: 15Px;
                position: relative;
                transition: all 0.3s ease-in;
            }
            span {
                font-size: 18px;
            }
        }
        .device-names {
            .editor-input-style {
                padding-left: 5Px;
                width: calc(100% - 115Px);
                color: #96b2cf;
                font-size: 14Px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .can_edit {
                cursor: pointer;
                height: 14Px;
            }
            .deviceTitle {
                color: #96b2cf;
                display: inline-block;
                font-size: 14Px;
                text-align: left ;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            dd {
                color:#00FFFF;
                font-size: 14Px;
                line-height: 1;
                width: 100%;
                margin: 0;
                text-align: left;
                div {
                    display: inline-flex;
                    align-items: flex-end;
                    width: 50%;
                    margin-bottom: 5Px;
                    .edit_ipt {
                        margin-bottom: 0;
                        :deep(input) {
                            height: 14Px;
                            line-height: 11Px;
                            font-size: 12px;
                            background: transparent;
                            color: #96b2cf;
                            border: 1Px solid transparent;
                            box-shadow: none;
                        }
                    }
                }
            }
            .pdf-model {
                margin-bottom: 6Px;
            }
            .device-param {
                max-height: 160Px;
                overflow-y: auto;
                &::-webkit-scrollbar {
                    width: 4Px !important; /*对垂直流动条有效*/
                }
                &::-webkit-scrollbar-thumb {
                    background-color: #0f3060 !important;
                }
            }
        }
        .normal-style {
            .editor-input-style {
                width: calc(100% - 70Px);
                color: #96b2cf;
                font-size: 14Px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: 2Px;
            }
            .deviceTitle {
                color: #96b2cf;
                display: inline-block;
                width: 65Px;
                font-size: 14Px;
                text-align: left ;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .padfs {
            max-height: 100Px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 4Px !important; /*对垂直流动条有效*/
            }
            &::-webkit-scrollbar-thumb {
                background-color: #0f3060 !important;
            }
        }
    }
}


</style>