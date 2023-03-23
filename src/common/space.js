import {http} from '@/common/request.js'
import { cutPlanModel, goFitToView, selectModelArtifacts } from '@/common/bim-utils.js'
import emitter from '@/common/mybus.ts'
export function getFloorBottomAndTop(param) {
    let formData = new FormData();
    formData.append('floorName',param.sname);
    formData.append('modelId',param.modelId);
    http.post("/model/selectelevation",formData ).then((res) => {
        if(res.data.success){
            let { top,bottom,modelId } = res.data.data.selectelevation || {};
            // let top1 = (top - 800) * 0.0032808;
            // let bottom1 = bottom * 0.0032808;
            // console.log(modelId, bottom1, top1)
            cutPlanModel(modelId, bottom, top);//(modelId,bottom,top,routerName) 
        }
    })
}
//点击空间管理楼层，展示对应得房间标签
export function clickNavShowRoomIcon(data) {
    let model = window['models'+data.modelId]
    // data?.keyAndValuesList?.forEach( item => item.modelId = data?.modelId || '')
    window?.yst_viewer?.unloadExtension('showRoomIconIcon');
    window?.yst_viewer?.loadExtension('showRoomIconIcon', {
        button: {
            icon: 'fa-thermometer-half',
            tooltip: 'Show Temperature '
        },
        icons: data?.children || [],
        onClick: (dbid, name, roomId) => {
            // window.yst_viewer.impl.selector.setSelection([dbid], window['models'+data.modelId]);
            window.yst_viewer.clearSelection()
            goFitToView([dbid],data.modelId)
            selectModelArtifacts([dbid],data.modelId)
//             window.yst_viewer?.fitToView([dbid], window['models' + data.modelId]);
//             window.yst_viewer.impl.selector.setSelection([dbid], window['models' + 0]);
            emitter.emit('showSpaceVarModel',{dbid,modelId:data.modelId,name,roomId}) //空间组态
            emitter.emit('showRoomInfo',{dbid,modelId:data.modelId,name,roomId}) //控制监控中心房间信息模块
            emitter.emit("showRightModule", { item:'房间' }); 
        },
        dbClick: (dbid, curretElement) => {
            buildModelTree(window.yst_viewer,model,dbid)
            emitter.emit("showfirstbutton", true);//进入第一人称视角后，显示退出按钮。
            emitter.emit('escFirstChangeIconStatus'); //进入漫游后，默认将平移或者旋转图标设置成旋转状态
        },
        onMouseOver: (id) => { }
    })
}