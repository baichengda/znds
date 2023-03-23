<template>
    <div class="deviceModal">
        <el-dialog v-model="modal3" :draggable="true"
            :custom-class="(hideOtherEle? '': 'rightMenuShowMdal')" title="设备信息">
            <div class="device-content">
                <div class="modal-left" v-if="hideOtherEle ? true : uploadList.length">
                    <div class="deviceImg">
                        <img v-show="uploadList.length" :src="facilityManagementUrl + picUrl" alt="">
                    </div>
                    <div label="现场照片" class="pic textarea-style manufacturer">
                        <div class="demo-upload-list" v-for="(item, index) in uploadList">
                            <template v-if="uploadList.length > 0">
                                <img :src="facilityManagementUrl + item.url" />
                                <div class="demo-upload-list-cover">
                                    <!-- <Icon type="ios-trash-outline" @click.native="handleRemove(item, index)"></Icon>
                                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon> -->
                                    <span  @click="handleView(item)">
                                        <el-icon><zoom-in /></el-icon>
                                    </span>
                                    
                                </div>
                            </template>
                            <!-- <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template> -->
                        </div>
                        <!-- <el-upload ref="upload" action="/" :show-upload-list="false"
                            :format="['jpg', 'jpeg', 'png', 'gif']" :max-size="2048" accept=".jpg,.jpeg,.png,.gif"
                            v-show="hideOtherEle" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                            :on-success="handleSuccess" :before-upload="handleBeforeUpload" multiple type="drag"
                            class="upload-pic">
                            <div class="upload-pic1">
                                <img src="@/assets/images/deviceInfo/addimg.png" alt="">
                            </div>
                        </el-upload> -->
                    </div>
                </div>
                <el-form :model="deviceInfo" label-position="left" class="modal-right" :label-width="85">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="设备名称：">
                                <!-- <el-input v-model="deviceInfo.devName" clearable placeholder="" /> -->
                                <span>{{deviceInfo.devName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="设备编号：">
                                <!-- <el-input v-model="deviceInfo.devNumber" clearable placeholder="" /> -->
                                <span>{{deviceInfo.devNumber}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="设备品牌：">
                                <!-- <el-input v-model="deviceInfo.devManufacturer" clearable placeholder="" /> -->
                                <span>{{deviceInfo.devManufacturer}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="设备型号：">
                                <!-- <el-input v-model="deviceInfo.devSpecifications" clearable placeholder="" /> -->
                                <span>{{deviceInfo.devSpecifications}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="设备位置：">
                                <!-- <el-input v-model="deviceInfo.devLocation" clearable placeholder="" /> -->
                                <span>{{deviceInfo.devLocation}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="购置日期：">
                                <!-- <DatePicker class="date-picker" @on-change="deviceInfo.purchaseDate = $event"
                                    @on-ok="changeGrade" placement="bottom" clearable type="date" format="yyyy-MM-dd"
                                    :value="deviceInfo.purchaseDate" placeholder="请选择时间段">
                                </DatePicker> -->
                                <span>{{deviceInfo.purchaseDate}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="保修到期：">
                                <!-- <DatePicker class="date-picker" @on-change="deviceInfo.warrantyDeadline = $event"
                                    placement="bottom" clearable type="date" format="yyyy-MM-dd"
                                    :value="deviceInfo.warrantyDeadline" placeholder="请选择时间段">
                                </DatePicker> -->
                                <span>{{deviceInfo.warrantyDeadline}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="产品寿命：">
                                <!-- <el-input v-model="deviceInfo.devLife" clearable placeholder=""
                                    @on-keyup="checkVal('devLife')">
                                <span slot="append">年</span>
                                </el-input> -->
                                <span>{{deviceInfo.devLife}}年</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="设备参数：">
                                <!-- textareaText -->
                                <!-- <el-input type="textarea" v-model="deviceInfo.devParameters"
                                    :autosize="{ minRows: 3, maxRows: 5 }" class="textarea-style"></el-input> -->
                                    <span>{{deviceInfo.devParameters}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="hideOtherEle">
                        <el-col :span="24" v-show="isEditOrAdd">
                            <el-form-item label="设备文档：">
                                <el-upload :on-preview='donwload' :on-remove='removefile' :before-upload='Upload_file'
                                    action="/" accept=".pdf" :show-upload-list="true" class="upload-file"
                                    :default-file-list='file_list'>
                                    <el-button class="upload-btn">
                                        <img width="20" src="@/assets/images/deviceInfo/upload.png" />
                                        上传文件
                                    </el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <h2>维保信息</h2>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="供货厂家：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.devSupplier" clearable
                                    placeholder="" />
                                <span v-show="!hideOtherEle">{{ deviceInfo.devSupplier }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="联系人：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.supplierContact" clearable
                                    placeholder="" />
                                <span v-show="!hideOtherEle">{{ deviceInfo.supplierContact }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="联系电话：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.supplierContactNum"
                                    @on-keyup="checkVal('supplierContactNum')" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{ deviceInfo.supplierContactNum }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="安装单位：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.devManufacturer" clearable
                                    placeholder="" />
                                <span v-show="!hideOtherEle">{{ deviceInfo.devManufacturer }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="联系人：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.manufacturerContact" clearable
                                    placeholder="" />
                                <span v-show="!hideOtherEle">{{ deviceInfo.manufacturerContact }}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="2">
                            <el-form-item label="联系电话：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.manufacturerContactNum"
                                    @on-keyup="checkVal('manufacturerContactNum')" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{ deviceInfo.manufacturerContactNum }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="!hideOtherEle">
                        <el-col :span="24">
                            <el-form-item label="设备文档：">
                                <el-upload :on-preview='donwload' :on-remove='removefile' :before-upload='Upload_file'
                                    action="/" accept=".pdf" :show-upload-list="true" class="upload-file"
                                    :default-file-list='file_list'>
                                    <!-- <el-button class="upload-btn">
                                        <img width="20" :src="publicPath + 'img/upload.png'" />
                                        上传文件
                                    </el-button> -->
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <template #footer v-show="hideOtherEle">
                <div class="footer-btn">
                    <el-button @click="modal3 = false">取消</el-button>
                    <el-button @click="modal3 = false">确定</el-button>
                    <!-- <el-button @click="handleEditDevice" v-if="isEditOrAdd">保存</el-button>
                    <el-button @click="handleAddDevice" v-else>保存</el-button> -->
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { nextTick, onUnmounted, ref, onMounted } from 'vue'
import emitter from '@/common/mybus.ts'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { showAllModel, defaultView } from '@/common/bim-utils.js'
import { http,facilityManagementApi,facilityManagementUrl } from '@/common/request.js'



let modal3 = ref(false)
let modal1 = false
let roomNumber = ''
let isShowAddBtn = true
let file_list = ref([])
let uploadList = ref([])
let picUrl = ref('') //大图路径
let upload = ref(null)
let uploadData = []
let deviceInfo= ref({} as any)//设备信息
let maintenanceInfo = {//维保信息
    manufactor: '',//供货厂家
    manufactorPerson: '',//供货联系人
    manufactorPhone: '',//供货联系人电话
    installCompany: '',//安装单位
    installPerson: '',//安装联系人
    installPhone: '',//安装联系人电话
}
let cityList = [
    {
        value: '电镜室',
        label: '电镜室'
    },
    {
        value: '实验室',
        label: '实验室'
    },
]
let floorList = [
    {
        value: 'F01',
        label: 'F01'
    },
    {
        value: 'F02',
        label: 'F02'
    },
]
let baseData = [
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
]
let textareaText = ''
let objectId = ref('')
let modelId = ref('')
let isEditOrAdd = ref(false)
let deviceId = ref(null)
let hideOtherEle = ref(true) //右键查看设备信息需要隐层一些元素

onMounted(() => {
    // this.uploadList = this.$refs.upload.fileList
    //模拟设备参数数据
    deviceInfo.value.parameter = '';
    let arr = []
    for (var i = 0; i < arr.length; i++) {
        deviceInfo.value.parameter += Object.keys(arr[i]) + ':' + Object.values(arr[i]) + ';  '
    }
    emitter.off('showDeviceInfoModal')
    emitter.on('showDeviceInfoModal', item => {
        //打开前先清空数据
        deviceInfo.value = {}
        file_list.value = []

        modal3.value = true;
        if (item) {
            let { deviceId:deviceId1, objectId:objectId1, modelId:modelId1 } = item || {}
            console.log(item)
            objectId.value = objectId1
            modelId.value = modelId1
            deviceId.value = deviceId1
            getCurrDeviceInfo()
            isEditOrAdd.value = true
        } else {
            isEditOrAdd.value = false
        }

    });
})
let changeGrade = () => {
    console.log(deviceInfo.value.purchaseDate)
}

//设备右键查看设备信息触发或者详情查看设备信息
let viewDevInfo = (param) => {
    viewInfo(param)
    modal3.value = true
    hideOtherEle.value = false
    isEditOrAdd.value = true
}
defineExpose({viewDevInfo})
//校验产品寿命只能输入整数int
let checkVal = (param) => {
    if (param == 0) {
        deviceInfo.value[param] = ""
    } else {
        deviceInfo.value[param] = deviceInfo.value[param].replace(/\D/g, '')
    }
}
//获取当前设备数据
let getCurrDeviceInfo = () => {
    let formData = new FormData()
    formData.append('deviceId', deviceId.value)
    facilityManagementApi.post('deviceMange/selectDeviceById', formData)
        .then((res) => {
            console.log(res)
            let { code, data } = res.data
            if (code == 200) {
                deviceInfo.value = data
                file_list.value = data.uploadPdf;
                uploadList.value = data.imgList
                picUrl.value = uploadList.value.length && uploadList.value[0].url
                
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//通过dbid modelId查看设备数据（右键设备信息）
let viewInfo = (param) => {
    let { dbid, modelId } = param || {}
    console.log(param)
    let formData = new FormData();
    formData.append("dbId", dbid)
    formData.append("modelId", modelId)
    facilityManagementApi.post('deviceMange/selectDeviceByDbIdAndModelId', formData)
        .then((res) => {
            console.log(res)
            let { code, data } = res.data || {}
            if (code === 200) {
                var list = data.data;
                deviceInfo.value = list
                file_list.value = list.uploadPdf;
                uploadList.value = list.imgList
                picUrl.value = uploadList.value.length && uploadList.value[0].url
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
let handleSuccess = (res, file) => {
    console.log(res, file);

}
let handleFormatError = () => {
    ElMessage.error("只支持jpg,jpeg,png,gif格式");
}
let handleMaxSize = () => {
    ElMessage.error("图片大小不能大于2M");
}
let handleBeforeUpload = (file) => {
    let splic = file.name.split(".");
    let imgArrLenght = uploadList.value
    console.log(file)
    if (
        splic[splic.length - 1] == "png" ||
        splic[splic.length - 1] == "jpg" ||
        splic[splic.length - 1] == "gif" ||
        splic[splic.length - 1] == "jpeg"
    ) {
        let check = imgArrLenght.length < 6;
        console.log(uploadList.value.length)
        if (check) {
            imgArrLenght.push(file)
            // 将图片展示出来
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                file.url = reader.result;
                console.log(file)
                // this.uploadList.push(file);
                goUploadPicture(file);//上传照片
            };
            console.log(uploadList.value)
        } else {
            ElMessage.error("最多上传6张图片");
        }
        return false;
    }

}
let goUploadPicture = (file) => { //上传照片
    console.log(uploadList.value)
    let data = new FormData();
    data.append("file", file);
    data.append("deviceId", deviceId.value);
    facilityManagementApi.post("deviceMange/testUploadimg", data)
        .then((res) => {
            console.log(res)
            let { status, data } = res
            if (status === 200) {
                ElMessage.success(data);
                getCurrDeviceInfo()
            } else {
                ElMessage.error(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
//删除图片
let handleRemove = (file, index) => {
    console.log(file)
    let data = new FormData();
    data.append("name", file.name);
    data.append("deviceId", deviceId.value);
    facilityManagementApi.post("deviceMange/DelectUploadimg", data)
        .then((res) => {
            console.log(res)
            let { status, data } = res
            if (status === 200) {
                ElMessage.success(data);
                getCurrDeviceInfo()
            } else {
                ElMessage.error(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

//查看
let handleView = (item) => {
    picUrl.value = item.url
}
//查看文档
let viewPdf = (items) => {
    window.open(facilityManagementUrl + items.url, "newwindow", "height=600, width=600,top=100,left=200,toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no,status=no")
}
//下载附件
let donwload = (file) => {
    var baseUrl = file.url;
    var location = facilityManagementUrl;
    var urls = `${location}${baseUrl}`;
    console.log(urls)
    window.open(urls)
}
//删除附件
let removefile = (item, index) => {
    console.log(item, index)
    let { name } = item
    facilityManagementApi.delete('deviceMange/delectpdf',
        { params: { deviceId: deviceInfo.value.deviceId, name } },
        { emulateJSON: true })
        .then((res) => {
            console.log(res)
            let { status, data,message } = res.data
            if (status == 200) {
                file_list.value.splice(index, 1);
                ElMessage.success(data)
            } else {
                ElMessage.error(message)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
//上传附件
let Upload_file = (response, file, fileList) => {
    console.log(response)
    let formData = new FormData();
    formData.append('file', response);
    formData.append('deviceId', deviceInfo.value.deviceId);
    facilityManagementApi.post('deviceMange/uploadPdf', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
            console.log(res)
            let { code, data, message } = res.data
            if (code == 200) {
                file_list.value = data.list
                ElMessage.success(message)
            } else {
                ElMessage.error(message)
            }

        })
}
//编辑设备
let handleEditDevice = () => {
    facilityManagementApi.post('deviceMange/updateDeviceById', deviceInfo.value)
        .then((res) => {
            console.log(res)
            let { code, message } = res.data
            if (code == 200) {
                emitter.emit('getTableData')
                modal3.value = false
                ElMessage.success(message)
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//添加设备
let handleAddDevice = () => {
    facilityManagementApi.post('deviceMange/addDevice', deviceInfo.value)
        .then((res) => {
            console.log(res)
            let { code, message } = res.data
            if (code == 200) {
                emitter.emit('getTableData')
                modal3.value = false
                ElMessage.success(message)
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
onUnmounted(() => {
    modal3.value = false
})

</script>
<style lang='scss'>
.addDevice {

    .ivu-modal-content {
        width: auto !important;
        // max-width: 700px;
    }

    .ivu-modal-header {
        border-bottom: none !important;
    }

    .ivu-modal-header-inner {
        color: #304156;
        font-size: 16Px;
        font-family: PingFangSC-Medium, PingFang SC;
    }

    .ivu-modal-body {
        min-height: 187Px;
        padding: 16Px 20Px;

        .ivu-form-item-label {
            font-size: 12Px;
            text-align-last: justify;
            padding-right: 0;
        }
    }

    .ivu-modal-footer {
        border: none;
        padding: 0;
    }
}

.rightMenuShowMdal {
    background-color: rgba(5, 18, 54, 0.92);
    border: 1Px solid #1b4a7e;
    box-shadow: inset 0 0 24Px 0 rgba(0, 143, 255, 54%);
    border-radius: 10px;
    width: fit-content;
    .el-dialog__header {
        text-align: left;
        span {
            color: #00FFFF;
        }
    }
    .el-dialog__body {
        padding: 10px 25px;
        .modal-right {
            // width: 500px;
        }
        .el-form-item {
            color: #fff;
            margin-bottom: 0;
            .el-form-item__content {
                span {
                    color: #96b2cf;
                    white-space:nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis; 
                }
            }
        }
        .el-form-item__label {
            color: #fff;
            padding: 0;
            
        }
        .el-input__wrapper {
            background-color: transparent;
        }
    }
    .el-dialog__footer {
        padding: 0;
    }

    .ivu-modal-header-inner {
        color: #00FFFF;
    }

    .ivu-modal-body {
        .ivu-form-item-label {
            color: #96b2cf;
        }

        .ivu-form-item {
            margin-bottom: 0 !important;

            .ivu-form-item-content {
                span {
                    color: #96b2cf;
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
    }

    .device-content {
        h2 {
            color: #00FFFF !important;
            background-color: transparent !important;
            margin-bottom: 0 !important;
            text-align: left;
            padding-left: 0 !important;
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
        border: none;
        color: #96b2cf;

        &::placeholder {
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
.device-content {
    display: flex;
    align-items: center;

    .modal-left {
        // width: 35%;
        width: 300px;
        display: inline-block;
        text-align: center;
        float: left;

        .deviceImg {
            width: 237px;
            height: 250px;
            margin: 0 auto;
            margin-bottom: 20px;

            img {
                object-fit: contain;
                width: 100%;
                height: 100%;
            }
        }

        .pic {
            :deep(.ivu-upload-drag) {
                border: none;
                border-radius: none;
                overflow: visible;
            }

            .ivu-form-item-content {
                line-height: 1;
            }

            .demo-upload-list {
                display: inline-block;
                width: 60px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                border: 1px solid transparent;
                border-radius: 4px;
                overflow: hidden;
                background: #fff;
                position: relative;
                box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
                margin-right: 4px;
            }

            .demo-upload-list img {
                width: 100%;
                object-fit: contain;
                height: 100%;
            }

            .demo-upload-list-cover {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                background: rgba(0, 0, 0, .6);
            }

            .demo-upload-list:hover .demo-upload-list-cover {
                display: block;
            }

            .demo-upload-list-cover i {
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                margin: 0 2px;
            }

            .upload-pic {
                display: inline-block;
                width: 55px;
                height: 55px;

                .upload-pic1 {
                    display: flex;
                }

                img {
                    width: 100%;
                }
            }
        }
    }

    .modal-right {
        width: 550px;
        // flex: 1;
        display: inline-block;

        ::v-deep.ivu-row {
            padding-left: 10px;
        }

        ::v-deep.ivu-form-item {
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

        .upload-btn {
            height: 26Px;

            img {
                vertical-align: middle;
            }
        }
    }

    h2 {
        display: inline-block;
        width: 100%;
        line-height: 38px;
        font-size: 16px;
        color: #17233d;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 12px;
        height: 38px;
        background: #F0F1F3;
        padding-left: 10px;
    }
}

.footer-btn {
    // position: absolute;
    // bottom: 0;
    // left: 0;
    // right: 0;
    padding: 10Px 20Px 20Px 20Px;
    // text-align: right;
    display: flex;
    align-items: center;
    justify-content: end;

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