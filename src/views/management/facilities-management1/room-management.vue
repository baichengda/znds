<template>
  <div :class="$style.roomManagement" class="room-management">
      <Row>
        <Col span="12" class="floorName" style="text-align: left;margin-bottom:10px;">
          <ul class="all-floor">
            <li @click="allData">全部楼层</li>
          </ul>
          <Select v-model="floorName" placeholder="全部楼层" style="width:100px;margin-right: 15px;" @on-change="websocketonopen">
              <Option v-for="item in floorList" :value="item.floor_name" :key="item.floor_name">{{ item.floor_name }}</Option>
          </Select>
          <Input search placeholder="搜索" :class="$style.searchInp" @on-change="onSearch" v-model='search'>
            <Icon type="ios-search" slot="suffix" />
          </Input>
        </Col>
        <Col span="12" class="floorName">
          <li class="export" :class="$style.export" @click="Export_file()">
              <!-- <img src="@/common/img/export.png"> -->
              <span>导出</span>
          </li>
          <Upload action="" :class="$style.import" :before-upload='Import_file' accept=".xls,.xlt,.xlsx,.xlsm,.xml" :show-upload-list="false">
              <!-- <img src="@/common/img/import.png"> -->
              <span>导入</span>
          </Upload>
        </Col>
      </Row>
      <Table stripe :columns="columns" disabled-hover :data="tableData"></Table>
      <Page :total="total"  @on-change="handleChange" show-total :class="$style.page"  show-elevator class="page"/>
      <Modal
          v-model="modal"
          title="详细信息"
          width="600"
          class="model-style">

            <Form :model="formData" label-position="right" class="roomData" :label-width="100">
              <FormItem label="房间名称">
                {{formData.room_name}}
              </FormItem>
              <FormItem label="门牌号">
                {{formData.room_number}}
              </FormItem>
              <FormItem label="房间面积">
                {{formData.room_size}}
              </FormItem>
              <FormItem label="吊顶高度">
                {{formData.room_ceilingheight}}
              </FormItem>
              <FormItem label="洁净等级">
                {{formData.room_cleanlevel}}
              </FormItem>
              <FormItem label="设计温度">
                {{formData.room_setmintemperature}}-{{formData.room_setmaxtemperature}}
              </FormItem>
              <FormItem label="设计湿度">
                {{formData.room_setmaxdampness}}-{{formData.room_setmindampness}}
              </FormItem>
              <FormItem label="换气次数">
                {{formData.room_ACH}}
              </FormItem>
              <FormItem label="设计压力">
                {{formData.room_pressure}}
              </FormItem>
              <FormItem label="温度">
                {{formData.wenDu}}
              </FormItem>
              <FormItem label="湿度">
                {{formData.shiDu}}
              </FormItem>
              <FormItem label="压力">
                {{formData.yaLi}}
              </FormItem>
              <FormItem label="照度">
                {{formData.guangZhao}}
              </FormItem>
              <FormItem label="氨浓度">
                {{formData.anNongDu}}
              </FormItem>
              <FormItem label="用电">
                {{formData.yongDian}}
              </FormItem>
              <FormItem label="门禁">
                {{formData.menJin}}
              </FormItem>
              <FormItem label="视频监控">
                {{formData.jianKong}}
              </FormItem>
              <FormItem label="状态">
                {{formData.zhuangTai}}
              </FormItem>

          </Form>

      </Modal>
  </div>
</template>

<script>
export default {
  name: 'roomManagement',
  data() {
    return {
      modal: false,
      formData: {},
      columns: [
          {
              title: '房间名称',
              key: 'room_name',
              align: 'center',
              // sortable: true,
              render:(h,params)=>{
                return h('div',{
                    style:{
                       cursor: 'pointer',
                       color: '#00A5FF'
                    },
                    on :{
                       click: (index)=>{
                         this.showModel(params.row)
                       }
                    },
                },params.row.room_name)
              }
          },
          {
              title: '门牌号',
              key: 'room_number',
              align: 'center',
              // sortable: true,
          },
          {
              title: '温度',
              key: 'wenDu',
              align: 'center',
              tooltip: true,
              render: (h, params) => {
                let wenDu = params.row.wenDu;
                return h('div', [
                  h('span',{

                  },wenDu),
                  h('span',{
                    style: {
                      color: '#B0B0B0'
                    },
                  },' ℃')
                ])
              }
          },
          {
              title: '湿度',
              key: 'shiDu',
              align: 'center',
              tooltip: true,
              render: (h, params) => {
                let shiDu = params.row.shiDu;
                return h('div', [
                  h('span',{

                  },shiDu),
                  h('span',{
                    style: {
                      color: '#B0B0B0'
                    },
                  },' %'),
                ])
              }
          },
          {
              title: '用电',
              key: 'yongDian',
              align: 'center',
              tooltip: true,
              render: (h, params) => {
                let yongDian = params.row.yongDian;
                return h('div', [
                  h('span',{

                  },yongDian),
                  h('span',{
                    style: {
                      color: '#B0B0B0'
                    },
                  },' kw·h'),
                ])
              }
          },
          {
              title: '门禁',
              key: 'menJin',
              align: 'center',
              tooltip: true,
          },
          {
              title: '视频监控',
              key: 'jianKong',
              align: 'center',
              tooltip: true,
          },
          {
              title: '状态',
              key: 'zhuangTai',
              tooltip: true,
              align: 'center',
              sortable: true,
              render:(h,params)=>{
                return h('span',{
                    style:{
                       color: (params.row.zhuangTai=='正常')?"#49C657":(params.row.zhuangTai=='故障'?"#FA9F2C":"#E52E2E")
                    }
                },params.row.zhuangTai)
              }
          }
      ],
      tableData: [],
      total: 0,  //总页数
      currPage: 1, //默认显示第一页
      search: '',
      floorList: [],
      floorName: '',
    }
  },
  mounted() {
    this.initWebSocket();
    this.open();
    this.getfloorData();
    // this.websocketonopen()
  },
  methods: {
    initWebSocket(){ //初始化weosocket
      const wsuri = this.$ws;
      this.websock = new WebSocket('ws://' + wsuri);
    },
    open() {
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(){ //连接建立之后执行send方法发送数据
      let actions = {"href":"room_info","page": this.currPage,"pageSize": 13,"keyword": this.search,"floor_name": this.floorName};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror(){//连接建立失败重连

    },
    websocketonmessage(e){ //数据接收
      let JsonData = JSON.parse(e.data)
      let data = JsonData.fangJian;
      this.total = JsonData.rowCount;
      this.tableData=data;
    },
    websocketsend(Data){//数据发送
      this.websock.send(Data);
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
    },
    handleChange(pageNum) {
      this.currPage = pageNum
      this.websocketonopen();
    },
    //模糊搜索
    onSearch(search) {
      this.websocketonopen();
    },
    //导出表格
    Export_file(){
        this.$axios.post('/down_room_xlsx',{keyword:this.search})
          .then((response)=> {
           var location = this.htmlURL;
           var dataurl = response.data._url;
           var fileurl = location +'/'+ dataurl;
           window.location.href = fileurl;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    //导入表格
     Import_file:function(response, file, fileList){
      //上传文件成功之后将此文件数据追加至file_list，file_list需要重新赋值，response.files为最新数据
      let formData = new FormData();
      formData.append('data',response);
      this.$axios.post('/upload_room_xlsx',formData,
      {headers:{'Content-Type': 'multipart/form-data'}})
        .then((response)=> {
          if(response.data.errCount<0) {
            this.$Message.success('上传成功 '+ response.data.sucCount + ' 条');
            setTimeout(()=> {
              this.$Message.error(response.data.tip);
            },2000)
            this.$Message.config({
              duration: 3
            });
          }else {
            this.$Message.success('上传成功 '+ response.data.sucCount + ' 条');
            setTimeout(()=> {
              window.location.reload()
            },2000)

          }

        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 请求楼层下拉数据
    getfloorData() {
      this.$axios.post('/room_nav',{},
     {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then((response)=> {
          let data = response.data
          this.floorList = data.floorList;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    showModel(param) {
      this.modal=true;
      this.formData=param;
    },
    // 点击全部楼层请求数据
    allData () {
      this.floorName= '';
      this.websocketonopen();
    }
  },
}
</script>

<style lang="scss" module>
@import '@/common/css/layout.scss';
.roomManagement {
  min-width: 550px;
  overflow-x: auto;
  background: #fff;
  height: 100%;
  padding-bottom: 50px;
  position: relative;
  .searchInp {
    height: 32px;
    width: auto;
    input {
      background-color: transparent;
      color: #fff;
      text-indent: 20px;
    }
  }
  .import {
    margin-right: 15px;
    margin-left: 15px;
    color: #FFBD00;
    border: 1px solid #FFBD00;
  }
  .export{
    color: #49C657;
    border: 1px solid #49C657;
  }
  .import,.export{
    // color: #FFBD00;
    height: 32px;
    line-height: 30px;
    background-color: #fff;
    text-align: center;
    border-radius: 13px;
    padding: 0 15px;
    margin-right: 15px;
    font-size: $font14;
    display: inline-block;
   
     &:hover{
       background: none;cursor: pointer;
     }
    img,span{
      vertical-align: middle;font-size: $font14;
    }
  }
  .page {
    float: right;
    margin-top: 30px;
    margin-right: 50px;
    position: absolute;
    bottom: 30px;
    right: 0;
  }

}
</style>
<style lang="scss">
@import '@/common/css/layout.scss';
.room-management .ivu-table td,.room-management .ivu-table th{
  color: #212121 !important;
  border: 1px solid #E7E7E7;
}
.room-management .ivu-table thead{
  background: #ECEFF4;
}
.room-management {
    ::v-deep.ivu-input-icon{
        left:0px !important;
    }
}

.room-management .ivu-table:before {
  background-color: transparent;
}
.room-management .ivu-table-header thead tr th {
  /* background:rgba(9,41,83,0.6); */
}
.floorName {
  text-align: right;padding: 32px 32px 0;
  .ivu-select-selection {
    background-color: transparent;
    color: #fff;
  }
}
.roomData .ivu-form-item {
  width: 50%;
  display: inline-block;
  color: #fff;
  margin-bottom: 15px;
  text-align: center;
  .ivu-form-item-label {
    color: #fff;
  }
}
.all-floor {
  display: inline-block;
  li {
    display: inline-block;
    line-height: 30px;
    font-size: $font14;
    color: #fff;
    padding:2px 12px ;
    border-radius:4px;
    background-color: #38ADFF;
    margin-right: 12px;
    cursor: pointer;
  }
}
.model-style {
  .ivu-modal-footer {
    text-align: center;
    padding: 40px 0;
    button{
      height: 28px;
      width: 70px;
      &:nth-child(1) {
        margin-right: 48px;
        border: 1Px solid #3EC0FA;
        background-color: transparent;
      }
    }
  }
}
</style>
