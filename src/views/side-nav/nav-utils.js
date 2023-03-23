
import {http} from '@/common/request.js'
import emitter from '@/common/mybus.ts'
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