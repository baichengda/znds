
import {http} from '@/common/request.js'
import emitter from '@/common/mybus.ts'
import {  defaultView } from '@/common/bim-utils.js'
//获取当前点击设备的信息
export function getSingleDeviceData(dbId,modelId) {
    let formData = new FormData()
    formData.append('dbId',dbId)
    formData.append('modelId',modelId)
    return new Promise((resolve, reject)=>{
        http.post(
            "modelTree/devicefenlei",
            formData,
            { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
            emitter.emit("deviceInfo",res.data);//发送到filter-nav,点击设备获取实时数据需要
            resolve(res.data || {})
    
        })
        .catch((error) => {
            console.log(error);
        });
    })
    
}
//获取模型视角
export function getModalCameraAngle() {
    http.post('model/getCoordinate',{},{headers: {'Content-Type': 'application/json'}}
            ).then((response)=> {
        let data = response.data.data;
        //请求成功直接用数据库保存的，如果没成功用模型中默认的
        if(data.posX == 0 && data.posY == 0 && data.posZ == 0){
            // defaultView();
        }else{
            defaultView(data,true)
        }
    }).catch((error)=> {
        console.log(error);
    });
}
//获取楼层视角
export function getFloorCameraAngle(sname) {
    let formData = new FormData();
    formData.append('storey',sname)
    http.post('model/getCoordinateByStroey',formData,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).then((response)=> {
        let data = response.data.data;
        //请求成功直接用数据库保存的，如果没成功用模型中默认的
        if(data.posX == 0 && data.posY == 0 && data.posZ == 0){
            defaultView();
        }else{
            defaultView(data)
        }
    }).catch((error)=> {
        console.log(error);
    });
}
//获取配置的静态标签
export function getStaticLabelData(floorName) {
    let formData = new FormData();
    formData.append('level',floorName)
    http.post('PointEquiment/listStaticICLabelConf',formData
    ).then((res)=> {
        console.log(res)
        let { data, code } = res.data || {}
        if(code===200) {
            window.staticIcon?.showStaticLabel(data)
        }
        
    }).catch((error)=> {
        console.log(error);
    });
}