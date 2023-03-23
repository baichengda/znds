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