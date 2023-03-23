<template>
    <div class="deviceModal">
        <el-dialog v-model="modal3" sticky :draggable="true" :mask="true" :closable="true" :class="{'rightMenuShowMdal':!hideOtherEle}" class="addDevice"
            title="设备信息">
            <div class="device-content">
                <div class="modal-left" v-if="hideOtherEle ? true : uploadList.length">
                    <div class="deviceImg">
                        <img v-show="uploadList.length" :src="$facilityManagementUrl+picUrl" alt="">
                    </div>
                    <div label="现场照片" class="pic textarea-style manufacturer">
                        <div class="demo-upload-list" v-for="(item,index) in uploadList">
                            <template v-if="uploadList.length > 0">
                                <img :src="$facilityManagementUrl+item.url" />
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item,index)"></Icon>
                                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
                        <el-upload ref="upload" action="/" :show-upload-list="false" 
                            :format="['jpg', 'jpeg', 'png', 'gif']" :max-size="2048"
                            accept=".jpg,.jpeg,.png,.gif"
                            v-show="hideOtherEle"
                            :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize"
                            :on-success="handleSuccess" :before-upload="handleBeforeUpload" multiple type="drag"
                            class="upload-pic">
                            <div class="upload-pic1">
                                <img :src="publicPath + 'img/addimg.png'" alt="">
                            </div>
                        </el-upload>
                    </div>
                </div>
                <el-form :model="deviceInfo" label-position="left" class="modal-right" :label-width="65">
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="设备名称：">
                                <el-input v-model="deviceInfo.devName" clearable placeholder="" />
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="设备编号：">
                                <el-input v-model="deviceInfo.devNumber" clearable placeholder="" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="设备品牌：">
                                <el-input v-model="deviceInfo.devManufacturer" clearable placeholder="" />
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="设备型号：">
                                <el-input v-model="deviceInfo.devSpecifications" clearable placeholder="" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="设备位置：">
                                <el-input v-model="deviceInfo.devLocation" clearable placeholder="" />
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="购置日期：">
                                <el-date-picker
                                    class="date-picker"
                                    @on-change="deviceInfo.purchaseDate = $event"
                                    @on-ok="changeGrade"
                                    placement="bottom"
                                    clearable
                                    type="date"
                                    format="yyyy-MM-dd"
                                    :value="deviceInfo.purchaseDate"
                                    placeholder="请选择时间段">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="保修到期：">
                                <el-date-picker
                                    class="date-picker"
                                    @on-change="deviceInfo.warrantyDeadline = $event"
                                    placement="bottom"
                                    clearable
                                    type="date"
                                    format="yyyy-MM-dd"
                                    :value="deviceInfo.warrantyDeadline"
                                    placeholder="请选择时间段">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="产品寿命：">
                                <el-input v-model="deviceInfo.devLife" clearable placeholder="" @on-keyup="checkVal(deviceInfo.devLife)" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="24">
                            <el-form-item label="设备参数：">
                                <!-- textareaText -->
                                <el-input type="textarea" v-model="deviceInfo.devParameters"
                                :autosize="{ minRows: 3, maxRows: 5 }" class="textarea-style"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="hideOtherEle">
                        <el-col span="24" v-show="isEditOrAdd">
                            <el-form-item label="设备文档：">
                                <el-upload :on-preview='donwload' :on-remove='removefile' :before-upload='Upload_file' action="/"
                                    accept=".pdf" :show-upload-list="true" class="upload-file"
                                    :default-file-list='file_list'>
                                    <Button class="upload-btn">
                                        <img width="20" :src="publicPath + 'img/upload.png'" />
                                        上传文件
                                    </Button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <h2>维保信息</h2>
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="供货厂家：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.devSupplier" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{deviceInfo.devSupplier}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="联系人：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.supplierContact" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{deviceInfo.supplierContact}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="联系电话：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.supplierContactNum" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{deviceInfo.supplierContactNum}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="安装单位：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.devManufacturer" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{deviceInfo.devManufacturer}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col span="11">
                            <el-form-item label="联系人：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.manufacturerContact" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{deviceInfo.manufacturerContact}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col span="11" offset="2">
                            <el-form-item label="联系电话：">
                                <el-input v-show="hideOtherEle" v-model="deviceInfo.manufacturerContactNum" clearable placeholder="" />
                                <span v-show="!hideOtherEle">{{deviceInfo.manufacturerContactNum}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  v-show="!hideOtherEle">
                        <el-col span="24">
                            <el-form-item label="设备文档：">
                                <el-upload :on-preview='donwload' :on-remove='removefile' :before-upload='Upload_file' action="/"
                                    accept=".pdf" :show-upload-list="true" class="upload-file"
                                    :default-file-list='file_list'>
                                    <!-- <Button class="upload-btn">
                                        <img width="20" :src="publicPath + 'img/upload.png'" />
                                        上传文件
                                    </Button> -->
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <template slot="footer" v-show="hideOtherEle">
                <div class="footer-btn">
                    <Button @click="modal3 = false">取消</Button>
                    <Button @click="handleEditDevice" v-if="isEditOrAdd">保存</Button>
                    <Button @click="handleAddDevice" v-else>保存</Button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
let modal3= false
let modal1= false
let roomNumber= ''
let isShowAddBtn= true
let file_list= []
let uploadList= []
let picUrl= '' //大图路径
let upload= null
let uploadData= []
let deviceInfo= {//设备信息
}
maintenanceInfo= {//维保信息
    manufactor: '',//供货厂家
    manufactorPerson: '',//供货联系人
    manufactorPhone: '',//供货联系人电话
    installCompany: '',//安装单位
    installPerson: '',//安装联系人
    installPhone: '',//安装联系人电话
}
let cityList= [
    {
        value: '电镜室',
        label: '电镜室'
    },
    {
        value: '实验室',
        label: '实验室'
    },
]
let floorList= [
    {
        value: 'F01',
        label: 'F01'
    },
    {
        value: 'F02',
        label: 'F02'
    },
]
let baseData= [
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
let textareaText= ''
let objectId= ''
let modelId= ''
let isEditOrAdd= false
let deviceId= null
let hideOtherEle= true //右键查看设备信息需要隐层一些元素

onMounted(() => {
     //模拟设备参数数据
        this.deviceInfo.parameter = '';
        let arr = []
        for (var i = 0; i < arr.length; i++) {
            this.deviceInfo.parameter += Object.keys(arr[i]) + ':' + Object.values(arr[i]) + ';  '
        }
        this.$EventBus.$off('showDeviceInfoModal')
        this.$EventBus.$on('showDeviceInfoModal', item => {
            //打开前先清空数据
            this.deviceInfo = {}
            this.file_list = []

            this.modal3 = true;
            if(item) {
                let { deviceId,objectId,modelId } = item || {}
                console.log(item)
                this.objectId = objectId
                this.modelId = modelId
                this.deviceId = deviceId
                this.getCurrDeviceInfo()
                this.isEditOrAdd=true
            }else{
                this.isEditOrAdd=false
            }
            
        });
})
let changeGrade = () => {
    console.log(this.deviceInfo.purchaseDate)
}
//设备右键查看设备信息触发或者详情查看设备信息
let viewDevInfo = (param) => {
    this.viewInfo(param)
    this.modal3 = true
    this.hideOtherEle = false
    this.isEditOrAdd=true
}
//校验产品寿命只能输入整数int
let checkVal = () => {
    if(this.value == 0){
        this.deviceInfo.devLife = ""
    }else{
        this.deviceInfo.devLife = this.deviceInfo.devLife.replace(/\D/g,'')
    }
}
//获取当前设备数据
let getCurrDeviceInfo = () => {
    let formData = new FormData()
    formData.append('deviceId',this.deviceId)
    this.$facilityManagementApi.post('deviceMange/selectDeviceById', formData)
        .then((res) => {
            console.log(res)
            let { code,data } = res.data
            if(code == 200) {
                this.deviceInfo = data
                this.file_list = data.uploadPdf;
                this.uploadList = data.imgList
                this.picUrl = this.uploadList.length && this.uploadList[0].url
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//通过dbid modelId查看设备数据（右键设备信息）
let viewInfo = (param) => {
    let { dbid,modelId } = param || {}
    console.log(param)
    let formData = new FormData();
    formData.append("dbId",dbid)
    formData.append("modelId",modelId)
    this.$facilityManagementApi.post('deviceMange/selectDeviceByDbIdAndModelId',formData)
        .then((res)=> {
            console.log(res)
            let { code, data } = res.data || {}
            if(code === 200) {
                var list = data.data;
                this.deviceInfo = list
                this.file_list = list.uploadPdf;
                this.uploadList = list.imgList
                this.picUrl = this.uploadList.length && this.uploadList[0].url
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
    this.$Message.error("只支持jpg,jpeg,png,gif格式");
}
let handleMaxSize = () => {
    this.$Message.error("图片大小不能大于2M");
}
let handleBeforeUpload = (file) => {
    let splic = file.name.split(".");
    let imgArrLenght = this.uploadList
    console.log(file)
    if (
        splic[splic.length - 1] == "png" ||
        splic[splic.length - 1] == "jpg" ||
        splic[splic.length - 1] == "gif" ||
        splic[splic.length - 1] == "jpeg"
    ) {
        let check = imgArrLenght.length < 6;
        console.log(this.uploadList.length)
        if (check) {
            imgArrLenght.push(file)
            // 将图片展示出来
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = (e) => {
                file.url = reader.result;
                console.log(file)
                // this.uploadList.push(file);
                this.goUploadPicture(file);//上传照片
            };
            console.log(this.uploadList)
        } else {
            this.$Message.error("最多上传6张图片");
        }
        return false;
    }

}
let goUploadPicture = (file) => { //上传照片
    console.log(this.uploadList)
    let data = new FormData();
    data.append("file", file);
    data.append("deviceId", this.deviceId);
    this.$facilityManagementApi.post("deviceMange/testUploadimg", data)
        .then((res) => {
            console.log(res)
            let { status,data } = res
            if (status === 200) {
                this.$Message.success(data);
                this.getCurrDeviceInfo()
            }else{
                this.$Message.error(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
//删除图片
let handleRemove = (file,index) => {
    console.log(file)
    let data = new FormData();
    data.append("name", file.name);
    data.append("deviceId", this.deviceId);
    this.$facilityManagementApi.post("deviceMange/DelectUploadimg", data)
        .then((res) => {
            console.log(res)
            let { status,data } = res
            if (status === 200) {
                this.$Message.success(data);
                this.getCurrDeviceInfo()
            }else{
                this.$Message.error(data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

//查看
let handleView = (item) => {
    this.picUrl = item.url
}
//查看文档
let viewPdf = (items) => {
    window.open(this.$facilityManagementUrl + items.url, "newwindow", "height=600, width=600,top=100,left=200,toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no,status=no")
}
//下载附件
let donwload = (file) => {
    var baseUrl = file.url;
    var location = this.$facilityManagementUrl;
    var urls = `${location}${baseUrl}`;
    console.log(urls)
    window.open(urls)
}
//删除附件
let removefile = (item, index) => {
    console.log(item,index)
    let { name } = item
    this.$facilityManagementApi.delete('deviceMange/delectpdf', 
    { params: { deviceId: this.deviceInfo.deviceId, name} }, 
    { emulateJSON: true })
        .then((res) => {
            console.log(res)
            let { status, data } = res.data
            if (status==200) {
                this.file_list.splice(index, 1);
                this.$Message.success(data)
            }else{
                this.$Message.error(message)
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
    formData.append('deviceId', this.deviceInfo.deviceId);
    this.$facilityManagementApi.post('deviceMange/uploadPdf', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((res) => {
            console.log(res)
            let { code, data, message } = res.data
            if(code == 200) {
                this.file_list = data.list
                this.$Message.success(message)
            }else{
                this.$Message.error(message)
            }
            
        })
}
//编辑设备
let handleEditDevice = () => {
    this.$facilityManagementApi.post('deviceMange/updateDeviceById', this.deviceInfo)
        .then((res) => {
            console.log(res)
            let { code, message } = res.data
            if(code == 200) {
                this.$emit('getTableData')
                this.modal3 = false
                this.$Message.success(message)
            }else{
                this.$Message.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
//添加设备
let handleAddDevice = () => {
    this.$facilityManagementApi.post('deviceMange/addDevice', this.deviceInfo)
        .then((res) => {
            console.log(res)
            let { code,message } = res.data
            if(code == 200) {
                this.$emit('getTableData')
                this.modal3 = false
                this.$Message.success(message)
            }else{
                this.$Message.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
export default {
    data() {
        return {
            modal3: false,
            modal1: false,
            roomNumber: '',
            isShowAddBtn: true,
            file_list: [],
            uploadList: [],
            picUrl: '', //大图路径
            upload: null,
            uploadData: [],
            deviceInfo: {//设备信息
            },
            maintenanceInfo: {//维保信息
                manufactor: '',//供货厂家
                manufactorPerson: '',//供货联系人
                manufactorPhone: '',//供货联系人电话
                installCompany: '',//安装单位
                installPerson: '',//安装联系人
                installPhone: '',//安装联系人电话
            },
            cityList: [
                {
                    value: '电镜室',
                    label: '电镜室'
                },
                {
                    value: '实验室',
                    label: '实验室'
                },
            ],
            floorList: [
                {
                    value: 'F01',
                    label: 'F01'
                },
                {
                    value: 'F02',
                    label: 'F02'
                },
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
            textareaText: '',
            objectId: '',
            modelId: '',
            isEditOrAdd: false,
            deviceId: null,
            hideOtherEle: true, //右键查看设备信息需要隐层一些元素
        }
    },
    watch: {
        textareaText(val) {
            console.log(val)
            this.deviceInfo.devParameters = val
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.uploadList = this.$refs.upload.fileList
            console.log(2222,this.uploadList)
        })
        // this.uploadList = this.$refs.upload.fileList
        //模拟设备参数数据
        this.deviceInfo.parameter = '';
        let arr = []
        for (var i = 0; i < arr.length; i++) {
            this.deviceInfo.parameter += Object.keys(arr[i]) + ':' + Object.values(arr[i]) + ';  '
        }
        this.$EventBus.$off('showDeviceInfoModal')
        this.$EventBus.$on('showDeviceInfoModal', item => {
            //打开前先清空数据
            this.deviceInfo = {}
            this.file_list = []

            this.modal3 = true;
            if(item) {
                let { deviceId,objectId,modelId } = item || {}
                console.log(item)
                this.objectId = objectId
                this.modelId = modelId
                this.deviceId = deviceId
                this.getCurrDeviceInfo()
                this.isEditOrAdd=true
            }else{
                this.isEditOrAdd=false
            }
            
        });
        //设备右键查看设备信息触发
        // this.$EventBus.$off('viewDevInfo')
        // this.$EventBus.$on('viewDevInfo',(param) => {
        //     this.viewInfo(param)
        //     this.modal3 = true
        //     this.hideOtherEle = false
        //     this.isEditOrAdd=true
        // })
    },
    methods: {
        changeGrade() {
            console.log(this.deviceInfo.purchaseDate)
        },
        //设备右键查看设备信息触发或者详情查看设备信息
        viewDevInfo(param) {
            this.viewInfo(param)
            this.modal3 = true
            this.hideOtherEle = false
            this.isEditOrAdd=true
        },
        //校验产品寿命只能输入整数int
        checkVal() {
            if(this.value == 0){
                this.deviceInfo.devLife = ""
            }else{
                this.deviceInfo.devLife = this.deviceInfo.devLife.replace(/\D/g,'')
            }
        },
        //获取当前设备数据
        getCurrDeviceInfo() {
            let formData = new FormData()
            formData.append('deviceId',this.deviceId)
            this.$facilityManagementApi.post('deviceMange/selectDeviceById', formData)
                .then((res) => {
                    console.log(res)
                    let { code,data } = res.data
                    if(code == 200) {
                        this.deviceInfo = data
                        this.file_list = data.uploadPdf;
                        this.uploadList = data.imgList
                        this.picUrl = this.uploadList.length && this.uploadList[0].url
                    }
                })
                .catch((error) => {
                    console.log('error');
                });
        },
        //通过dbid modelId查看设备数据（右键设备信息）
        viewInfo(param) {
            let { dbid,modelId } = param || {}
            console.log(param)
            let formData = new FormData();
            formData.append("dbId",dbid)
            formData.append("modelId",modelId)
            this.$facilityManagementApi.post('deviceMange/selectDeviceByDbIdAndModelId',formData)
                .then((res)=> {
                    console.log(res)
                    let { code, data } = res.data || {}
                    if(code === 200) {
                        var list = data.data;
                        this.deviceInfo = list
                        this.file_list = list.uploadPdf;
                        this.uploadList = list.imgList
                        this.picUrl = this.uploadList.length && this.uploadList[0].url
                    }
                })
                .catch(function (error) {
                console.log(error);
                });
        },
        handleSuccess(res, file) {
            console.log(res, file);
            
        },
        handleFormatError() {
            this.$Message.error("只支持jpg,jpeg,png,gif格式");
        },
        handleMaxSize() {
            this.$Message.error("图片大小不能大于2M");
        },
        handleBeforeUpload(file) {
            let splic = file.name.split(".");
            let imgArrLenght = this.uploadList
            console.log(file)
            if (
                splic[splic.length - 1] == "png" ||
                splic[splic.length - 1] == "jpg" ||
                splic[splic.length - 1] == "gif" ||
                splic[splic.length - 1] == "jpeg"
            ) {
                let check = imgArrLenght.length < 6;
                console.log(this.uploadList.length)
                if (check) {
                    imgArrLenght.push(file)
                    // 将图片展示出来
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = (e) => {
                        file.url = reader.result;
                        console.log(file)
                        // this.uploadList.push(file);
                        this.goUploadPicture(file);//上传照片
                    };
                    console.log(this.uploadList)
                } else {
                    this.$Message.error("最多上传6张图片");
                }
                return false;
            }

        },
        goUploadPicture(file) { //上传照片
            console.log(this.uploadList)
            let data = new FormData();
            data.append("file", file);
            data.append("deviceId", this.deviceId);
            this.$facilityManagementApi.post("deviceMange/testUploadimg", data)
                .then((res) => {
                    console.log(res)
                    let { status,data } = res
                    if (status === 200) {
                        this.$Message.success(data);
                        this.getCurrDeviceInfo()
                    }else{
                        this.$Message.error(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        //删除图片
        handleRemove(file,index) {
            console.log(file)
            let data = new FormData();
            data.append("name", file.name);
            data.append("deviceId", this.deviceId);
            this.$facilityManagementApi.post("deviceMange/DelectUploadimg", data)
                .then((res) => {
                    console.log(res)
                    let { status,data } = res
                    if (status === 200) {
                        this.$Message.success(data);
                        this.getCurrDeviceInfo()
                    }else{
                        this.$Message.error(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        
        //查看
        handleView(item) {
            this.picUrl = item.url
        },
        //查看文档
        viewPdf(items) {
            window.open(this.$facilityManagementUrl + items.url, "newwindow", "height=600, width=600,top=100,left=200,toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no,status=no")
        },
        //下载附件
        donwload(file) {
            var baseUrl = file.url;
            var location = this.$facilityManagementUrl;
            var urls = `${location}${baseUrl}`;
            console.log(urls)
            window.open(urls)
        },
        //删除附件
        removefile(item, index) {
            console.log(item,index)
            let { name } = item
            this.$facilityManagementApi.delete('deviceMange/delectpdf', 
            { params: { deviceId: this.deviceInfo.deviceId, name} }, 
            { emulateJSON: true })
                .then((res) => {
                    console.log(res)
                    let { status, data } = res.data
                    if (status==200) {
                        this.file_list.splice(index, 1);
                        this.$Message.success(data)
                    }else{
                        this.$Message.error(message)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //上传附件
        Upload_file(response, file, fileList) {
            console.log(response)
            let formData = new FormData();
            formData.append('file', response);
            formData.append('deviceId', this.deviceInfo.deviceId);
            this.$facilityManagementApi.post('deviceMange/uploadPdf', formData,
                { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((res) => {
                    console.log(res)
                    let { code, data, message } = res.data
                    if(code == 200) {
                        this.file_list = data.list
                        this.$Message.success(message)
                    }else{
                        this.$Message.error(message)
                    }
                    
                })
        },
        //编辑设备
        handleEditDevice() {
            this.$facilityManagementApi.post('deviceMange/updateDeviceById', this.deviceInfo)
                .then((res) => {
                    console.log(res)
                    let { code, message } = res.data
                    if(code == 200) {
                        this.$emit('getTableData')
                        this.modal3 = false
                        this.$Message.success(message)
                    }else{
                        this.$Message.error(message)
                    }
                })
                .catch((error) => {
                    console.log('error');
                });
        },
        //添加设备
        handleAddDevice() {
            this.$facilityManagementApi.post('deviceMange/addDevice', this.deviceInfo)
                .then((res) => {
                    console.log(res)
                    let { code,message } = res.data
                    if(code == 200) {
                        this.$emit('getTableData')
                        this.modal3 = false
                        this.$Message.success(message)
                    }else{
                        this.$Message.error(message)
                    }
                })
                .catch((error) => {
                    console.log('error');
                });
        }
    },
    beforeDestroy() {
        this.modal3 = false
    }
}
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
        width: 500px;
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