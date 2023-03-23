<template>
    <div class="room-introduction">
        <!-- 环境监测 -->
        <div v-show="isShowHuanJing" class="room-info">
            <div class="title-group">
                <h3>环境监测</h3>
            </div>
            <div class="room-menu">
                <div class="room-list" v-for="(item, index) in arr" :key="index">
                    <div class="room-value">
                        <div>
                            <span>{{ item.variable_type == '模拟量' ? ((item.value) * 1).toFixed(1) : ((item.value) * 1) }}</span><i>{{ judgeUnit(item.variable_name) }}</i>
                        </div>

                        <div class="variable">
                            <!-- <img src="@/assets/images/temp.png" alt=""> -->
                            <span style="font-size: 14px;" :title="item.variable_name">{{ item.variable_name | handleData(item.value) }}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- 门禁监控 -->
        <!-- <div v-show="isShowMenJin" class="access-menu">
        <div class="title-group">
            <h3>门禁监控</h3>
        </div>
        <div class="access-list">
            <Table ref="table" :columns="columns" :data="tableData" disabled-hover class="access-table"></Table>
        </div>
    </div> -->
        <!-- 通风柜 -->
        <div v-show="isShowTFG" class="TFG-menu">
            <div class="title-group">
                <h3>通风柜</h3>
                <div style="float:right">
                    <div class="legend" style="">
                        <div style=""></div>
                        <span>使用</span>
                    </div>
                    <div class="legend" style="margin-left: 15px;">
                        <div style="background: #25467A;"></div>
                        <span>闲置</span>
                    </div>
                </div>
            </div>
            <div class="TFG-legend">
                <div class="TFG-img">
                    <img src="../../assets/images/luoditongfengguiguan.png" alt="">
                </div>
                <div class="TFG-echart">
                    <div class="paifengJZ">
                        <div id="tongFeng"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 低温水箱 -->
        <!-- <div v-show="isShowBingXiang" class="water-tank">
        <div class="title-group">
            <h3>超低温冰箱</h3>
        </div>
        <div class="ydqs-echart">
            <div id="YDQS"></div>
        </div>
    </div> -->
    </div>


</template>

<script lang="ts" setup>
import { ref, reactive, onMounted,onUnmounted, nextTick, getCurrentInstance } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { judgeUnit } from '@/common/judge-unit.js'
import emitter from '@/common/mybus.ts'
import * as echarts from 'echarts';
let { name, path } = useRoute()
let router = useRouter()
let { appContext } = getCurrentInstance() as any
console.log(appContext)
let isShowHuanJing = ref(false)
let isShowMenJin = ref(true)
let isShowTFG = ref(false)
let isShowBingXiang = ref(true)
let nowClientWidth = document.documentElement.clientWidth
let ws = ref({} as any)
let TFGws = ref({} as any)
let powerTrendOption = ref({})
let nameArr = []
let oneUse = ref(0)
let twoUse = ref(0)
let threeUse = ref(0)
let fourUse = ref(0)
let roofUse = ref(0)
let oneunUse = ref(0)
let twounUse = ref(0)
let threeunUse = ref(0)
let fourunUse = ref(0)
let roofunUse = ref(0)
let Usedata = ref([] as any)
let unUsedata = ref([] as any)
let arr = ref([] as any)
let columns = [
    {
        title: '时间',
        key: 'date',
        align: 'center',
        ellipsis: true,
        tooltip: true,
        width: 116,
    },
    {
        title: '人员',
        key: 'personnel',
        // width: 65,
        align: 'center',
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '状态',
        key: 'state',
        align: 'center',
        // width: 65,
        ellipsis: true,
        tooltip: true,
    },
    {
        title: '照片/录像',
        key: 'photo',
        // width: 116,
        align: 'center',
        ellipsis: true,
        tooltip: true,
    },
]
let tableData = [
    { date: '2022-04-07 12: 23: 54', personnel: '张三', state: '正常', photo: '查看' },
    { date: '2022-04-07 12: 23: 54', personnel: '张三', state: '正常', photo: '查看' },
    { date: '2022-04-07 12: 23: 54', personnel: '张三', state: '正常', photo: '查看' },
    { date: '2022-04-07 12: 23: 54', personnel: '张三', state: '正常', photo: '查看' },
    { date: '2022-04-07 12: 23: 54', personnel: '张三', state: '正常', photo: '查看' },
]
let realDataRoomSendParam = ref({
    'dbId': null,
    'modelId': null,
})
let realDataTFGSendParam = ref({
    'storey': '',//楼层名
    'roomId': null,//房间名
})
let TFGlist = null
let tfChart = ref(null as any)
let powerTrendChart = ref(null as any)

onMounted(() => {
    websocketinit();
    websocketTFGinit();
    emitter.on('showRoomInfo', (data) => {
        if (name == 'monitoringCenter') {
            let { dbid, modelId, name, roomId } = data
            realDataRoomSendParam.value.dbId = dbid;
            realDataRoomSendParam.value.modelId = modelId;
            realDataTFGSendParam.value.roomId = roomId;//房间名
            ws.value?.send(JSON.stringify(realDataRoomSendParam.value));
            TFGws.value?.send(JSON.stringify(realDataTFGSendParam.value));

        }
    })
    emitter.on('sendTFGrealData', (item) => {//点击楼层的时候赋值
        if (name == 'monitoringCenter') {
            realDataTFGSendParam.value.storey = item.sname;//楼层名
        }

    })


    nextTick(() => {
        // const tfChart = this.$echarts.init(document.getElementById('tongFeng'));
        // const ydqsChart = this.$echarts.init(document.getElementById('YDQS'));
        window.addEventListener("resize", function () {
            tfChart.value?.resize();
            powerTrendChart.value?.resize();
        });
        TongFeng(TFGlist);
        powerTrendData();
    })
})

const handleData = (value) => {
    if (!value) return ''
    if (value.length > 4) {
        return value.slice(0, 4) + '...'
    }
    return value
}

let websocketinit = () => {
    let user_id = localStorage.getItem('user_id');
    if (!ws.value) { ws.value = new WebSocket(appContext.config.globalProperties.$ws + "/webSocketServerRoom/" + user_id); }

    ws.value.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.value.send(JSON.stringify(realDataRoomSendParam.value));
        console.log("空间管理数据发送中...");
        //开启心跳
    };
    ws.value.onmessage = (evt) => {
        let list = JSON.parse(evt.data);
        //根据数据判断是否显示环境监测面板
        if (list.length > 0) {
            list.forEach(element => {
                if (element.devType == '环境感知' && element.variableList.length > 0) { ///模拟数据暂时先写室内设备，后期改为环境监测
                    arr = element.variableList;
                    isShowHuanJing.value = true;
                } else {
                    isShowHuanJing.value = false
                }
            });
        } else {
            isShowHuanJing.value = false
        }


        // this.TongFeng(list);
        // this.powerTrendOption.xAxis[0].data = newV.x
        // this.powerTrendOption.series[0].data = newV.y
        // this.powerTrendChart.setOption(
        // this.powerTrendOption,
        //     (window.onresize = this.powerTrendChart.resize)
        // );
    };
    ws.value.onclose = (e) => {
        console.log(
            "websocket 断开: " +
            e.code +
            " " +
            e.reason +
            " " +
            e.wasClean
        );
    };
    ws.value.onerror = (err) => {
        console.log("websocket服务出错了---onerror");
    };
    // 路由跳转时结束websocket链接
    router.afterEach(() => {
        ws.value.close();
    });
}
let websocketTFGinit = () => {
    let user_id = localStorage.getItem('user_id');
    if (!TFGws.value) { TFGws.value = new WebSocket(appContext?.config.globalProperties.$ws + "/WebSocketServerRommData/" + user_id); }
    TFGws.value.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        TFGws.send(JSON.stringify(realDataTFGSendParam.value));
        console.log("通风柜数据发送中...");
        //开启心跳
    };
    TFGws.value.onmessage = (evt) => {
        let list = JSON.parse(evt.data);

        //根据数据判断是否显示通风柜面板
        if (list?.use == 0 && list?.unused == 0) {
            isShowTFG.value = false
        } else {
            isShowTFG.value = true
            TongFeng(list);
        }



    };
    TFGws.value.onclose = (e) => {
        console.log(
            "websocket 断开: " +
            e.code +
            " " +
            e.reason +
            " " +
            e.wasClean
        );
    };
    TFGws.value.onerror = (err) => {
        console.log("websocket服务出错了---onerror");
    };
    // 路由跳转时结束websocket链接
    router.afterEach(() => {
        TFGws.value.close();
    });
}
//通风柜使用情况
let TongFeng = (list) => {
    unUsedata.value = [];
    Usedata.value = [];
    oneUse.value = 0;
    oneunUse.value = 0;
    if (list != null) {
        oneUse.value = list?.use;
        oneunUse.value = list?.unused + oneUse.value;
        unUsedata.value.push(oneunUse.value)
        Usedata.value.push(oneUse.value)
    }
    tfChart.value = echarts.init(document.getElementById('tongFeng') as HTMLElement);
    let tfoption = {
        color: ['#00DFFF', '#0D4364'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // Use axis to trigger tooltip
                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        // legend: {
        //     data: ['使用', '闲置'],
        //     padding:[2,35,0,0],
        //     x:'right',
        //     icon: 'circle',
        //     textStyle: {
        //         color: '#FFFFFF',
        //         fontSize: this.nowClientWidth>1200?'12':(640<this.nowClientWidth<1200?'10':'8'),
        //     },
        //     itemWidth:5,
        //     itemHeight:5
        // },
        grid: {
            top: '45%',
            left: '0',
            right: '14%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false
            },
            //x轴字体设置
            axisLabel: {
                rotate: 0,
                show: false,
                textStyle: {

                },
            },
        },
        yAxis: {
            type: 'category',
            data: nameArr,
            // max: 1,
            // min: 0,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#9499AF',
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                rotate: 0,
                show: true,
                textStyle: {
                    fontSize: 11,
                    fontFamily: 'PingFangSC-Regular',
                    color: '#fff',
                },
            },
        },
        series: [
            {
                name: '使用',
                type: 'bar',
                stack: 'total',
                barWidth: '12',//柱子高度
                label: {
                    show: false,
                    position: 'right',
                    // formatter: function(a) {
                    //     if(a.name == 'F1'){
                    //         oneUse = a.value;
                    //     }else if(a.name == 'F2'){
                    //         twouse = a.value;
                    //     }else if(a.name == 'F3'){
                    //         threeUse = a.value;
                    //     }else if(a.name == 'F4'){
                    //         fourUse = a.value;
                    //     }else if(a.name == '屋顶层'){
                    //         roofUse = a.value;
                    //     }
                    // }
                },
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    normal: {
                        //这里是重点
                        color: function (params) {
                            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                            var colorList = ['#00DFFF', '#00DFFF', '#00DFFF'];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data: Usedata.value
            },
            {
                name: '闲置',
                type: 'bar',
                stack: 'total',
                barCategoryGap: '10%',
                barWidth: '12',//柱子高度
                label: {
                    show: true,
                    position: 'right',
                    formatter: function (b) {
                        return oneUse.value + '/' + (oneunUse.value - oneUse.value)
                        //    return used + '/' + b.value
                    },
                    textStyle: {//最右端字体颜色
                        fontSize: 11,
                        color: '#fff'
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                itemStyle: {
                    normal: {
                        //这里是重点
                        color: function (params) {
                            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                            var colorList = ['#0D4364', '#0D4364', '#0D4364'];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data: unUsedata.value
            },
        ]
    }
    tfChart.value && tfChart.value.setOption(tfoption, window.onresize = tfChart.value.resize);
}
//折线图
let powerTrendData = () => {
    if (!document.getElementById("YDQS")) return;
    powerTrendChart.value = !powerTrendChart.value && echarts.init(
        document.getElementById("YDQS") as HTMLElement
    );
    powerTrendOption.value = {
        tooltip: {
            trigger: "item",
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "line", // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        grid: {
            top: "5%",
            left: "4%",
            right: "4%",
            bottom: "15%",
            containLabel: true,
        },
        color: ["#00FFFF"],
        xAxis: [
            {
                type: "category",
                data: [2, 4, 3, 8, 10, 12, 14, 16, 18, 20, 22, 24],
                axisTick: {
                    show: true,
                    alignWithLabel: true,
                },
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#E9EAEB",
                        width: 1,
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: "#FFFFFF",
                        fontSize: "12",
                    },
                    // rotate:45,
                    interval: 0,
                },
            },
        ],
        yAxis: [
            {
                min: 0,
                max: 1000,
                type: "value",
                name: "",
                splitNumber: "5",
                axisLabel: {
                    // formatter: '{value}',
                    textStyle: {
                        color: "#FFFFFF",
                        fontSize: "12",
                    },
                },
                splitArea: {
                    show: false,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: 1,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#4C566E",
                        width: 1,
                        type: "solid",
                    },
                },
                axisTick: {
                    show: false,
                },
            },
        ],
        series: [
            {
                name: "",
                type: "line",
                symbol: "circle", //拐点样式
                symbolSize: 4, //拐点大小
                itemStyle: {
                    normal: {
                        color: "#00CDEE",
                        lineStyle: {
                            color: "#00CDEE",
                            width: 2,
                        },
                    },
                },
                // data:[280,280,200,200, 220,300,490,390, 450,500,580,680,700,600, 800,500,590,490, 450,700,280,280,260,290]
                data: [
                    280,
                    280,
                    200,
                    200,
                    220,
                    300,
                    490,
                    390,
                    450,
                    500,
                    580,
                    680,
                    700,
                    600,
                    800,
                    500,
                    590,
                    490,
                    450,
                    700,
                    280,
                    280,
                    260,
                    290,
                ],
            },
        ],
    };
    powerTrendChart.value.setOption(powerTrendOption.value, (window.onresize = powerTrendChart.value.resize));
}

onUnmounted(() => {
    ws.value && ws.value.close();
    TFGws.value && TFGws.value.close();
})
</script>

<style lang="scss">
.room-introduction {
    // margin-left: 25px;
    float: right;
    .room-info {
        width: 400px;
        height: 200px;
        background: rgba(3, 19, 64, 0.64);
        box-shadow: 0px 1px 5px 1px rgba(11, 89, 151, 0.3);
        border-radius: 10px;
        border: 1px solid rgba(0, 188, 255, 0.5);
        overflow: hidden;
        padding: 16px;
        box-sizing: border-box;

        .title-group {
            padding-left: 8px;

            h3 {
                line-height: 1;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                font-weight: 500;
                color: #00FFFF;
                line-height: 1;
                margin-right: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .room-menu {
            width: 100%;
            max-height: 170px;
            overflow-y: scroll;

            .room-list {
                width: 25%;
                display: inline-block;
                margin-bottom: 5px;

                .room-value {
                    width: 90px;
                    display: inline-block;
                    text-align: center;
                    padding-top: 15px;

                    span {
                        width: 24px;
                        height: 28px;
                        font-size: 20px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #00FFFF;
                        line-height: 28px;
                    }

                    i {
                        width: 14px;
                        height: 20px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 20px;
                    }

                    .variable {
                        img {
                            width: 20px;
                            vertical-align: middle;
                        }

                        span {
                            width: 29px;
                            height: 20px;
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #FFFFFF;
                            line-height: 20px;
                        }
                    }
                }
            }

        }

        ::-webkit-scrollbar {
            width: 3Px;
            /*对垂直流动条有效*/
            height: 3Px;
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

    .access-menu {
        margin-top: 5px;
        width: 400px;
        height: 200px;
        background: rgba(3, 19, 64, 0.64);
        box-shadow: 0px 1px 5px 1px rgba(11, 89, 151, 0.3);
        border-radius: 10px;
        border: 1px solid rgba(0, 188, 255, 0.5);
        padding: 16px;

        .title-group {
            padding-left: 8px;

            h3 {
                line-height: 1;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                font-weight: 500;
                color: #00FFFF;
                line-height: 1;
                margin-right: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .access-list {
            width: 100%;

            .access-table {
                width: 100%;
                height: 100%;

                .ivu-table {
                    color: #FFFFFF;
                    font-size: 14px;
                    background-color: transparent;

                }

                .ivu-table-body {
                    max-height: 100px;
                    overflow-y: auto;

                    &::-webkit-scrollbar {
                        width: 0px !important;
                        background-color: transparent !important;
                    }

                    &::-webkit-scrollbar-track {
                        background-color: transparent !important;
                    }

                    &::-webkit-scrollbar-button {
                        background-color: transparent !important;
                    }

                    &::-webkit-scrollbar-thumb {
                        background-color: #0f3060 !important;
                    }
                }

                .ivu-table td,
                .ivu-table th {
                    border-bottom: none;
                    font-family: PingFangSC-Regular, PingFang SC;
                    height: 47px;
                    color: #FFFFFF;
                    background-color: transparent;
                }

                .ivu-table th {
                    background-color: transparent;
                    font-size: 14px;
                    color: #FFFFFF;
                    font-family: PingFangSC-Medium, PingFang SC;
                }

                .ivu-table:before {
                    display: none;
                }
            }
        }
    }

    .TFG-menu {
        margin-top: 5px;
        width: 400px;
        height: 166px;
        background: rgba(3, 19, 64, 0.64);
        box-shadow: 0px 1px 5px 1px rgba(11, 89, 151, 0.3);
        border-radius: 10px;
        border: 1px solid rgba(0, 188, 255, 0.5);
        padding: 16px;

        .title-group {
            padding-left: 8px;

            h3 {
                line-height: 1;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                font-weight: 500;
                color: #00FFFF;
                line-height: 1;
                margin-right: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: inline-block;
            }

            .legend {
                display: inline-block;

                div {
                    width: 8px;
                    height: 8px;
                    background: #00BCFF;
                    border-radius: 4px;
                    display: inline-block;
                    margin-right: 5px;
                }

                span {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                }
            }
        }

        .TFG-legend {
            width: 100%;
            margin-top: 8px;

            .TFG-img {
                width: 20%;
                display: inline-block;

                img {
                    width: 80px;
                    // height:85px
                }
            }

            .TFG-echart {
                float: right;
                width: 80%;
                display: inline-block;
                padding: 13px 0px 0px 31px;

                .paifengJZ {
                    width: 100%;

                    #tongFeng {
                        width: 260px;
                        height: 50px;
                    }
                }
            }
        }
    }

    .water-tank {
        margin-top: 5px;
        width: 400px;
        height: 200px;
        background: rgba(3, 19, 64, 0.64);
        box-shadow: 0px 1px 5px 1px rgba(11, 89, 151, 0.3);
        border-radius: 10px;
        border: 1px solid rgba(0, 188, 255, 0.5);
        padding: 16px;

        .title-group {
            padding-left: 8px;

            h3 {
                line-height: 1;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                font-weight: 500;
                color: #00FFFF;
                line-height: 1;
                margin-right: 10px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: inline-block;
            }
        }

        .ydqs-echart {
            width: 100%;
            padding: 14px 18px 0px 0px;

            #YDQS {
                height: 150px;
                width: 360px;
            }
        }
    }
}
</style>