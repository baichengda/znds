export function judgeUnit(varName) {
    let mapUnit = {
        '温度': ' ℃',
        '湿度': ' %',
        '控制': ' %',
        '压力': ' Pa',
        '频率': ' Hz',
        '电流': ' A',
        '电压': ' V',
        '风量': ' m³/h',
        '功率': ' kw',
        '风速': ' m/s',
        '压差': ' Pa',
        '高度': ' mm',
        '开度': ' %',
    }
    let currOption = Object.keys(mapUnit).find(item => varName && varName.includes(item))
    if (currOption) {
        return mapUnit[currOption]
    } else {
        return '-'
    }
}
//根据变量名模糊匹配该变量配置（三维组态修改变量表格中的数据）
export function fuzzyMatchVarConfig(varName) {
    let config = {
        '启停': [{ value: 0, describ: '关机' }, { value: 1, describ: '开机' }], //启停状态
        '开机': [{ value: 0, describ: '关机' }, { value: 1, describ: '开机' }], //开机状态
        '故障': [{ value: 0, describ: '正常' }, { value: 1, describ: '故障' }], //故障状态
        '缺风': [{ value: 0, describ: '正常' }, { value: 1, describ: '缺风' }], //缺风状态
        '手自动': [{ value: 0, describ: '手动' }, { value: 1, describ: '自动' }], //手自动状态
        '初效': [{ value: 0, describ: '正常' }, { value: 1, describ: '报警' }], // 初效状态
        '中效': [{ value: 0, describ: '正常' }, { value: 1, describ: '报警' }], //中效状态
    }
    let currOption = Object.keys(config).find(item => varName && varName.includes(item))
    if (currOption) {
        return config[currOption]
    } else {
        return [{ value: 0, describ: '' }, { value: 1, describ: '' }]
    }
}
//根据变量名，匹配对应的图标（监控中心房间信息）
import anqi from '@/assets/images/environmental-monitoring/anqi.png'                     //氨气
import bingxi from '@/assets/images/environmental-monitoring/bingxi.png'                 //丙烯
import pm25 from '@/assets/images/environmental-monitoring/PM25.png'                     //PM2.5
import eryanghuadan from '@/assets/images/environmental-monitoring/eryanghuadan.png'     //二氧化氮
import eryanghualiu from '@/assets/images/environmental-monitoring/eryanghualiu.png'     //二氧化硫
import eryanghuatan from '@/assets/images/environmental-monitoring/eryanghuatan.png'     //二氧化碳
import guangqi from '@/assets/images/environmental-monitoring/guangqi.png'               //光气
import huanyangyiwan from '@/assets/images/environmental-monitoring/huanyangyiwan.png'   //环氧乙烷
import jiejingdu from '@/assets/images/environmental-monitoring/jiejingdu.png'           //洁净度
import liuhuaqing from '@/assets/images/environmental-monitoring/liuhuaqing.png'         //硫化氢
import lvhuaqing from '@/assets/images/environmental-monitoring/lvhuaqing.png'           //氯化氢
import lvqi from '@/assets/images/environmental-monitoring/lvqi.png'                     //氯气
import meiqi from '@/assets/images/environmental-monitoring/meiqi.png'                   //煤气
import qingqi from '@/assets/images/environmental-monitoring/qingqi.png'                 //氢气
import shidu from '@/assets/images/environmental-monitoring/shidu.png'                   //湿度
import wendu from '@/assets/images/environmental-monitoring/wendu.png'                   //温度
import yacha from '@/assets/images/environmental-monitoring/yacha.png'                   //压差
import yali from '@/assets/images/environmental-monitoring/yali.png'                     //压力
import yangnongdu from '@/assets/images/environmental-monitoring/yangnongdu.png'         //氧浓度
import yiyanghuadan from '@/assets/images/environmental-monitoring/yiyanghuadan.png'     //一氧化氮
import yiyanghuatan from '@/assets/images/environmental-monitoring/yiyanghuatan.png'     //一氧化碳
import yique from '@/assets/images/environmental-monitoring/yique.png'                   //乙炔
import zaoyin from '@/assets/images/environmental-monitoring/zaoyin.png'                 //噪音
import zhaodu from '@/assets/images/environmental-monitoring/zhaodu.png'                 //照度
import keranqiti from '@/assets/images/environmental-monitoring/keranqiti.png'                 //照度
import voc from '@/assets/images/environmental-monitoring/voc.png'                       //voc
import defaultIcon from '@/assets/images/environmental-monitoring/default.png'                 //default
export function matchIconsToVariables(varName) {
    let mapData = {
        "氨气": anqi,
        "NH3": anqi,
        "丙烯": bingxi,
        "C3H6": bingxi,
        "PM": pm25,
        "二氧化氮": eryanghuadan,
        "NO2": eryanghuadan,
        "二氧化硫": eryanghualiu,
        "SO2": eryanghualiu,
        "二氧化碳": eryanghuatan,
        "CO2": eryanghuatan,
        "光气": guangqi,
        "环氧乙烷": huanyangyiwan,
        "C2H4O": huanyangyiwan,
        "洁净度": jiejingdu,
        "硫化氢": liuhuaqing,
        "H2S": liuhuaqing,
        "氯化氢": lvhuaqing,
        "HCL": lvhuaqing,
        "氯气": lvqi,
        "CL2": lvqi,
        "煤气": meiqi,
        "氢气": qingqi,
        "可燃": keranqiti,
        "H2": qingqi,
        "温度": wendu,
        "湿度": shidu,
        "压差": yacha,
        "压力": yali,
        "氧浓度": yangnongdu,
        "氧气": yangnongdu,
        "O2": yangnongdu,
        "一氧化氮": yiyanghuadan,
        "NO": yiyanghuadan,
        "一氧化碳": yiyanghuatan,
        "CO": yiyanghuatan,
        "乙炔": yique,
        "C2H2": yique,
        "噪音": zaoyin,
        "噪声": zaoyin,
        "照度": zhaodu,
        "VOC":voc
    }
    let currOption = Object.keys(mapData).find(item => varName.toLocaleUpperCase().includes(item))
    if(currOption) {
        return mapData[currOption]
    }else{
        return defaultIcon
    }
}