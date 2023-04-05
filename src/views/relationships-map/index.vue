<template>
  <div class="monitoring" style="height: 100%">
    <Header style="
    position: absolute;
    top: 0;
    z-index: 99999;">
      <slot>
        <img src="@/assets/images/title-img/relationships-map.png" alt="">
      </slot>
    </Header>
    <div class="map-box">
      <div class="left">
        <el-input
            v-model="searchKeyWords"
            size="large"
            placeholder="搜索监控对象"
            suffix-icon="Search"
            @input="search"
            clearable
            class="search"
        />
        <div class="type">
          <div class="typelist">
            <div class="circle person"></div>
            <div class="typeName">人员</div>
            <div class="typeNumber">{{ person }}</div>
          </div>
          <div class="typelist">
            <div class="circle space"></div>
            <div class="typeName">房间</div>
            <div class="typeNumber">{{ space }}</div>
          </div>
          <div class="typelist">
            <div class="circle instrument"></div>
            <div class="typeName">仪器</div>
            <div class="typeNumber">{{ instrument }}</div>
          </div>
          <div class="typelist">
            <div class="circle group"></div>
            <div class="typeName">组别</div>
            <div class="typeNumber">{{ group }}</div>
          </div>

        </div>
      </div>
      <div class="right">
        <!--          房间-->
        <div class="room-introduce" v-if="spaceShow" @click="showRoomInfo">
          <div class="title-group">
            <h3>{{ spaceInfo.rmName }} {{ spaceInfo.rmNumber }}</h3>
            <span>详情</span>
          </div>
          <div class="introduce-menu">
            <div class="introduce">
              <div class="info-key">
                <div>使用面积：</div>
                <div>{{ spaceInfo.rmArea }}㎡</div>
              </div>
              <div class="info-value">
                <div>所在楼层：</div>
                <div>{{ spaceInfo.rmLevel }}</div>
              </div>
            </div>
            <div class="introduce">
              <div class="info-key">
                <div>管 理 员：</div>
                <div>{{ spaceInfo.rmAdmin }}</div>
              </div>
              <div class="info-value">
                <div>联系电话：</div>
                <div>{{ spaceInfo.contact }}</div>
              </div>
            </div>
          </div>
        </div>
        <!--          环境气体感知-->
        <!-- 环境监测 -->
        <div v-if="environmentShow">
          <!--          <template v-if="envAndGasArr[0].variableList.length > 0">-->
          <div class="room-info" v-for="(list) in envAndGasArr" :key="list.devType">
            <div class="title-group">
              <h3>{{
                  list.devType == '环境感知' ? '环境监测' : (list.devType == '气体感知' ? '气体监测' :
                      list.devType)
                }}</h3>
            </div>
            <div class="room-menu">
              <div class="room-list" v-for="(item, index) in list.variableList" :key="index">
                <div class="room-value">
                  <div class="variable">
                    <div class="variable-img">
                      <img v-show="matchIconsToVariables(item.variable_name)"
                           :src="matchIconsToVariables(item.variable_name)" alt="">
                    </div>
                  </div>
                  <div class="variable-content">
                    <div class="variable-name"
                         :title="item.aliasName || item.variable_name">
                      {{ (item.aliasName || item.variable_name) }}
                    </div>
                    <div class="variable-value"
                         :title="(item.variable_type == '模拟量' ? ((item.value) * 1).toFixed(1) : ((item.value) * 1)) + judgeUnit(item.variable_name)">
                                                        <span class="variable-data">
                                                            {{
                                                            item.variable_type == '模拟量' ? ((item.value) * 1).toFixed(1)
                                                                :
                                                                ((item.value) * 1)
                                                          }}
                                                        </span>
                      <span class="variable-company">{{
                          judgeUnit(item.variable_name)
                        }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--          </template>-->

        </div>
        <!--          仪器-->
        <div class="room-instrument" @click="viewInstrummentInfo()" v-if="instrumentShow">

          <div class="title-group">
            <h3>{{ instrumentInfo.instrumentName }} {{ instrumentInfo.instrumentNumber }}</h3>
            <span>详情</span>
          </div>
          <div class="instrument-menu">
            <div class="instrument-left">
              <img :src="instrumentImg" alt="" style="width: 100%;height: 100%;">
            </div>
            <div class="instrument-right">
              <div>品 牌：{{ instrumentInfo.instrumentBrand }}</div>
              <div>型 号：{{ instrumentInfo.instrumentSpecifications }}</div>
              <div>位 置：{{ instrumentInfo.instrumentLocation }}</div>
              <div>管理员：{{ instrumentInfo.instrumentAdmin }}</div>
              <div>电 话：{{ instrumentInfo.adminPhone }}</div>
            </div>
          </div>
        </div>
        <!--          人员-->
        <div class="room-person" @click="viewPersonnelInfo" v-if="personShow">
          <div class="title-group">
            <h3>{{ personInfo.name }}</h3>
            <span>详情</span>
          </div>
          <div class="instrument-menu">
            <div class="instrument-left">
              <img :src="userImg" alt="" style="width: 100%;height: 100%">
            </div>
            <div class="instrument-right">
              <div>部门：{{ personInfo.dept }}</div>
              <div>职位：{{ personInfo.position }}</div>
              <div>电话：{{ personInfo.userPhone }}</div>
              <div>当前位置：{{ personInfo.location }}</div>
            </div>
          </div>
        </div>
      </div>
      <d3graph :data="data" :names="names" :labels="labels" :linkTypes="linkTypes" :number='number'
               :keywords='KeyWords' @selct='selectData'/>
      <roomInfo></roomInfo>
      <backButton class="relationships"/>
    </div>

  </div>
</template>

<script setup lang="ts">
import Header from '@/components/header.vue'

</script>
<script lang="ts">
import {ElMessage} from 'element-plus'
import d3graph from './d3graph.vue'
import roomInfo from './room-modal.vue'
import {judgeUnit, matchIconsToVariables} from '@/common/judge-unit.js'
import {facilityManagementApi, userManagementUrl, facilityManagementUrl, http} from '@/common/request.js'
import Person from '@/assets/images/relationship/person.png'
import Instrument from '@/assets/images/relationship/instrument.png'
import {getCurrentInstance, ref} from 'vue'
import emitter from '@/common/mybus.ts'
import backButton from '@/components/back-botton.vue'
// import { useRouter } from "vue-router";
// const router = useRouter();
// let { appContext } = getCurrentInstance()
export default {
  components: {
    d3graph,
    roomInfo
  },
  data() {
    return {
      searchKeyWords: "",//搜索关键字
      KeyWords: '',
      active: false,//选择那个按钮
      number: 2,//显示隐藏关系
      peopleStreamGuideChart: '',
      // d3jsonParser()处理 json 后返回的结果
      data: {
        nodes: [],
        links: []
      },
      names: [],
      labels: ['instrument', 'person', 'space', 'group'],
      linkTypes: ['', 'type', 'locate', 'export'],
      envAndGasArr: [], //房间环境信息
      spaceInfo: {},//房间信息
      personInfo: {},//人员信息
      instrumentInfo: {},//仪器信息
      isshow: true,
      prompt: '',//没数据时提示内容
      realDataRoomSendParam: {//环境监控websocket入参
        'dbId': null,
        'modelId': null,
      },
      ws: '',//环境监控websocket
      spaceShow: false,//控制房间卡片显影
      environmentShow: false,//控制环境卡片
      personShow: false,//控制人员卡片显影
      instrumentShow: false,//控制仪器卡片显影
      person: 0,
      group: 0,
      instrument: 0,
      space: 0,
      instrumentImg: Instrument,
      userImg: Person

    }
  },
  beforeDestroy() {
    this.ws && this.ws.close();
  },
  mounted() {
    this.websocketinit()
    this.getData()

  },
  methods: {
    matchIconsToVariables,
    judgeUnit,
    //查看房间信息
    showRoomInfo() {
      console.log(1111)
      emitter.emit('showRoomModal', this.spaceInfo)
    },
    //仪器详情
    viewInstrummentInfo() {
      console.log(this.instrumentInfo)
      this.$router.push({
        path: '/instrument-details',
        query: {instrumentId: this.instrumentInfo.instrumentId}
      });
    },
    //人员详情
    viewPersonnelInfo() {
      // console.log(this.personInfo)
      this.$router.push({
        path: '/personnel-details',
        query: {
          userId: this.personInfo.id,
          phone: this.personInfo.userPhone
        }
      });
    },
    //选中单个球请求信息
    selectData(data) {
      this.envAndGasArr = []
      this.spaceShow = false
      this.personShow = false
      this.instrumentShow = false
      console.log(data)
      let formData = new FormData()
      formData.append('label', data.label)
      if (data.label == 'person') {
        this.personShow = true
        console.log(data.properties.phone)
        formData.append('phone', data.properties.phone)
        formData.append('roomExternalId', '')
        formData.append('instrumentId', '')
      } else if (data.label == 'space') {
        this.spaceShow = true
        formData.append('phone', '')
        formData.append('roomExternalId', data.properties.externalId)
        formData.append('instrumentId', '')
        this.realDataRoomSendParam.dbId = parseInt(data.properties.objectId)
        this.realDataRoomSendParam.modelId = data.properties.modelId
        if (this.ws) {
          console.log('发送数据')
          console.log(this.realDataRoomSendParam)
          this.ws.send(JSON.stringify(this.realDataRoomSendParam));
        }
      } else if (data.label == 'instrument') {
        this.instrumentShow = true
        formData.append('phone', '')
        formData.append('roomExternalId', '')
        formData.append('instrumentId', data.properties.instrumentId)
      }
      if (data.label != "group") {
        // this.$axios.post('http://192.168.31.147:9040/relation/getRelationInfoBySelected', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        facilityManagementApi.post('relation/getRelationInfoBySelected', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
          console.log(res)
          let code = res.data.code
          let info = res.data
          if (code == 200) {
            // spaceInfo:{},//房间信息
            // personInfo:{},//人员信息
            // instrumentInfo:{}//仪器信息
            console.log(info.data)
            if (data.label == 'person') {
              if (info.data.userPhoto) {
                this.userImg = facilityManagementUrl + info.data.userPhoto
              } else {
                this.userImg = Person
              }
              this.personInfo = info.data
              console.log(this.personInfo)
            } else if (data.label == 'space') {
              this.spaceInfo = info.data
            } else if (data.label == 'instrument') {
              if (info.data.imgList.length > 0) {
                this.instrumentImg = userManagementUrl + info.data.imgList[0].url
              } else {
                this.instrumentImg = Instrument
              }
              this.instrumentInfo = info.data
            }
          } else {
            ElMessage.error(res.data.message)
          }

        })
      }
    },

    //关系切换
    changeTextState(number) {
      this.number = number
      if (number == 0) {
        this.active = false
      } else {
        this.active = true
      }
    },
    search() {
      this.KeyWords = this.searchKeyWords || ''
    },
    websocketinit() {

      let user_id = localStorage.getItem('user_id');
      if (!this.ws) {
        // this.ws = new WebSocket(this.$ws + "/webSocketServerRoom/" + user_id);
        this.ws = new WebSocket('ws://' + `${getCurrentInstance().appContext.config.globalProperties.$ws}` + '/webSocketServerRoom/' + user_id);
        // this.ws = new WebSocket('ws://81.70.44.15:9022/webSocketServerRoom/292');

      }
      this.ws.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        this.ws.send(JSON.stringify(this.realDataRoomSendParam));
        console.log("空间管理数据发送中...");
        //开启心跳
      };
      this.ws.onmessage = (evt) => {
        let list = JSON.parse(evt.data);
        // console.log(list);
        //根据数据判断是否显示环境监测面板
        list.sort((a, b) => a.devType.localeCompare(b.devType)) //环境优先
        // console.log(list)

        this.envAndGasArr = list
        if (this.envAndGasArr.length > 1 || this.envAndGasArr[0].variableList.length > 0) {
          this.environmentShow = true
        } else {
          this.environmentShow = false
        }
        console.log(this.envAndGasArr)

        // console.log(list)
        // if(list.length > 0){
        //     list.forEach(element => {
        //         if(element.devType == '环境感知' && element.variableList.length > 0){ ///模拟数据暂时先写室内设备，后期改为环境监测
        //             this.arr = element.variableList;
        //             this.isShowHuanJing = true;
        //         }else{
        //             this.isShowHuanJing = false
        //         }
        //     });
        // }else{
        //     this.isShowHuanJing = false
        // }


        // this.TongFeng(list);
        // this.powerTrendOption.xAxis[0].data = newV.x
        // this.powerTrendOption.series[0].data = newV.y
        // this.powerTrendChart.setOption(
        // this.powerTrendOption,
        //     (window.onresize = this.powerTrendChart.resize)
        // );
      };
      this.ws.onclose = (e) => {
        console.log(
            "websocket 断开: " +
            e.code +
            " " +
            e.reason +
            " " +
            e.wasClean
        );
      };
      this.ws.onerror = (err) => {
        console.log("websocket服务出错了---onerror");
      };
      // 路由跳转时结束websocket链接
      this.$router.afterEach(() => {
        this.ws.close();
      });
    },
    getData() {
      facilityManagementApi.post('relation/getDimensionalRelations').then(res => {
        console.log(res)
        let {data} = res.data
        if (res.data.success) {
          this.d3jsonParser(data.data)
          this.instrument = data.instrument
          this.group = data.group
          this.person = data.person
          this.space = data.space
          // this.updateRelationship(data)
        } else {
          this.isshow = false
          this.prompt = res.data.message
        }
      })
    },
    /*eslint-disable*/
    // 解析json数据，主要负责数据的去重、标准化
    d3jsonParser(json) {
      const nodes = []
      const links = [] // 存放节点和关系
      const nodeSet = [] // 存放去重后nodes的id

      // 使用vue直接通过require获取本地json，不再需要使用d3.json获取数据
      // d3.json('./../data/records.json', function (error, data) {
      //   if (error) throw error
      //   graph = data
      //   console.log(graph[0].p)
      // })

      for (let item of json) {
        for (let segment of item.p.segments) {
          // 重新更改data格式
          if (nodeSet.indexOf(segment.start.identity) == -1) {
            nodeSet.push(segment.start.identity)
            nodes.push({
              id: segment.start.identity,
              label: segment.start.labels[0],
              properties: segment.start.properties
            })
          }
          if (nodeSet.indexOf(segment.end.identity) == -1) {
            nodeSet.push(segment.end.identity)
            nodes.push({
              id: segment.end.identity,
              label: segment.end.labels[0],
              properties: segment.end.properties
            })
          }
          links.push({
            source: segment.relationship.start,
            target: segment.relationship.end,
            type: segment.relationship.type,
            properties: segment.relationship.properties
          })
        }
      }
      // console.log(nodes)
      // console.log(links)
      // this.links = links
      // this.nodes = nodes
      this.data = {nodes, links}
      // return { nodes, links }
    }
  }

}
</script>
<style lang="scss" scoped>
.relationships {
  position: absolute;
  bottom: 60px;
  right: 40px;
  cursor: pointer;
  z-index: 9;
}
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #344F73 inset;
  border-color: #344F73;
  background-color: #030D26;
}

:deep(.el-input__inner) {
  color: #83868F;
  font-size: 18px;
}

.map-box {
  position: relative;
  z-index: 10;
  background-color: #030D26;
  // height: 100vh;
  height: 100%;

  .left {
    color: white;
    position: absolute;
    top: 106px;
    left: 30px;
    //width: 200px;
    //height: 200px;
    //background-color: red;
    .search {
      color: #83868F;
      width: 400px;
      height: 40px;

    }

    .type {
      //display: flex;
      margin-top: 30px;

      .typelist {
        height: 25px;
        font-size: 18px;
        display: flex;
        line-height: 25px;
        align-items: center;
        margin-bottom: 15px;

        .circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .instrument {
          background-color: #14AFFF;
        }

        .person {
          background-color: #073AB2;
        }

        .space {
          background-color: #156DFF;
        }

        .group {
          background-color: #00CEF7;
        }

        div {
          margin-right: 28px;
        }
      }

    }
  }

  .right {
    color: white;
    text-align: left;
    //background-color: red;
    position: absolute;
    top: 106px;
    right: 30px;

    .room-introduce {
      background-color: #0A1F3B;
      // margin-top: 32px;
      width: 420px;
      height: auto;
      //background: rgba(3,19,64,0.64);
      box-shadow: 0px 1px 5px 1px rgba(10, 89, 151, 0.298);
      border-radius: 10px 10px 10px 10px;
      opacity: 1;
      padding: 16px;

      //border: 1px solid rgba(0,188,255,0.5);
      .title-group {
        display: flex;
        align-items: center;

        h3 {
          flex-grow: 1;
          width: 80%;
          line-height: 1;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          font-weight: 500;
          //color: #00FFFF;
          line-height: 1;
          margin: 0 0 18px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        span {
          display: inline-block;
          margin: 0 0 18px;
          cursor: pointer;

          &:hover {
            color: #00BCFF;
          }
        }
      }

      .introduce-menu {
        //padding: 20px 10px 0px 10px;
        width: 100%;

        .introduce {
          width: 100%;
          margin-bottom: 15px;
          display: inline-block;
          //color:#fff;
          font-size: 14px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;

          .info-key {
            font-size: 14px;
            width: 50%;
            display: inline-block;
            text-align: left;
            // margin-right: 20px;
            div {
              display: inline-block;
            }
          }

          .info-value {
            font-size: 14px;
            width: 50%;
            display: inline-block;
            text-align: left;

            div {
              display: inline-block;
            }
          }

          &:nth-child(2) {
            margin-bottom: 0px;
          }
        }
      }
    }

    .room-info {
      background-color: #0A1F3B;
      // margin-top: 32px;
      //width: 420px;
      //height: 200px;
      //background: rgba(3, 19, 64, 0.64);
      box-shadow: 0px 1px 5px 1px rgba(10, 89, 151, 0.2980);
      border-radius: 10px;
      //border: 1px solid rgba(0, 188, 255, 0.5);
      overflow: hidden;
      padding: 16px;
      box-sizing: border-box;

      .title-group {
        display: flex;
        align-items: center;

        h3 {
          flex-grow: 1;
          width: 80%;
          line-height: 1;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          font-weight: 500;
          //color: #00FFFF;
          line-height: 1;
          margin: 0 0 18px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        span {
          display: inline-block;
          margin: 0 0 18px;
          cursor: pointer;

          &:hover {
            color: #00BCFF;
          }
        }
      }

      .room-menu {
        width: 100%;
        // max-height: 170px;
        // overflow-y: scroll;
        height: auto;
        overflow-x: hidden;
        padding-left: 8px;

        .room-list {
          width: 50%;
          display: inline-block;
          margin-bottom: 0px;

          .room-value {
            width: 100%;
            display: inline-block;
            text-align: left;
            //margin-top: 20px;

            &:nth-child(2) {
              margin-top: 10px;
            }

            .variable {
              display: inline-block;
              align-items: center;
              justify-content: left;

              .variable-img {
                background-color: #000;
                width: 45px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                border-radius: 50%;
                background: linear-gradient(360deg, #1B51BB 0%, #1DC7DE 100%);

                img {
                  width: 36px;
                  vertical-align: middle;
                }
              }
            }

            .variable-content {
              display: inline-block;
              margin-left: 5px;
              vertical-align: middle;
              width: calc(100% - 60px);
              height: 45px;

              .variable-name {
                display: block;
                color: #fff;
                font-size: 14px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #FFFFFF;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 70px;
              }

              .variable-value {
                font-weight: 700;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                color: #fff;

                .variable-data {
                  max-width: 50px;
                  height: 20px;
                  font-size: 20px;

                  font-family: Helvetica Neue-常规体, Helvetica Neue;
                  font-weight: normal;
                  color: #00BCFF;
                  line-height: 20px;
                }

                .variable-company {
                  font-size: 10px;
                  font-family: Helvetica Neue-常规体, Helvetica Neue;
                  font-weight: normal;
                  color: #85909A;
                }
              }
            }
          }
        }

      }

      ::-webkit-scrollbar {
        width: 3px;
        /*对垂直流动条有效*/
        height: 3px;
        /*对水平流动条有效*/
        cursor: pointer;
      }

      /*定义滑块颜色、内阴影及圆角*/
      ::-webkit-scrollbar-thumb {
        border-radius: 7px;
        background-color: rgba(3, 19, 64, 0.64);
      }

      /*定义两端按钮的样式*/
      ::-webkit-scrollbar-button {
        background-color: transparent;
      }

      // #tongFeng {
      //     width: 400px;
      //     height: 100px;
      // }
      // .paifengJZ {
      //     margin-top: 20px;
      //     // h5 {
      //     //     color: #00FFFF;
      //     //     font-family: PingFangSC-Regular;
      //     // }
      // }
    }

    .room-instrument {
      background-color: #0A1F3B;
      // margin-top: 32px;
      width: 420px;
      height: auto;
      //background: rgba(3,19,64,0.64);
      box-shadow: 0px 1px 5px 1px rgba(10, 89, 151, 0.298);
      border-radius: 10px 10px 10px 10px;
      opacity: 1;
      padding: 16px;

      //border: 1px solid rgba(0,188,255,0.5);
      .title-group {
        display: flex;
        align-items: center;

        h3 {
          flex-grow: 1;
          width: 80%;
          line-height: 1;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          font-weight: 500;
          //color: #00FFFF;
          line-height: 1;
          margin: 0 0 18px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        span {
          display: inline-block;
          margin: 0 0 18px;
          cursor: pointer;

          &:hover {
            color: #00BCFF;
          }
        }
      }

      .instrument-menu {
        display: flex;
        //padding: 20px 10px 0px 10px;
        width: 100%;

        .instrument-left {
          width: 176px;
          height: 176px;
        }

        .instrument-right {
          font-size: 14px;
          width: calc(100% - 176px);
          margin-left: 12px;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
        }
      }
    }

    .room-person {
      background-color: #0A1F3B;
      // margin-top: 32px;
      width: 420px;
      height: auto;
      //background: rgba(3,19,64,0.64);
      box-shadow: 0px 1px 5px 1px rgba(10, 89, 151, 0.298);
      border-radius: 10px 10px 10px 10px;
      opacity: 1;
      padding: 20px;

      //border: 1px solid rgba(0,188,255,0.5);
      .title-group {
        display: flex;
        align-items: center;

        h3 {
          flex-grow: 1;
          width: 80%;
          line-height: 1;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          font-weight: 500;
          //color: #00FFFF;
          line-height: 1;
          margin: 0 0 18px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        span {
          display: inline-block;
          margin: 0 0 18px;
          cursor: pointer;

          &:hover {
            color: #00BCFF;
          }
        }
      }

      .instrument-menu {
        display: flex;
        width: 100%;

        .instrument-left {
          width: 140px;
          height: 140px;
          //background-color: red;
        }

        .instrument-right {
          font-size: 14px;
          margin-left: 12px;
          height: 140px;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
        }
      }
    }
  }
}


</style>