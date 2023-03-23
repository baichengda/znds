function _ElectromeMQ(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
    this.type = [];
    this.array = [];
    this.init(this._viewer);
}
_ElectromeMQ.prototype.load = function() {
    var self = this;
    return this;
};
_ElectromeMQ.prototype.unload = function() {
    return true;
};
_ElectromeMQ.prototype.init = function(viewer) {
    this.viewer = viewer;
    var self = this;
    var jz_url = window.mq_url;
    var jz = false;
    var modelcount = self.viewer.impl.modelQueue().getModels();
    var aa =0 ;
    var globalConfig = JSON.parse(sessionStorage.getItem("appData")) || {}
        //加载前检查是否是更新，如果是则通过后台路径与模型中截取的路径做判断，卸载之前的模型
    if (modelcount.length == 1 && window.updateMQ) { //如果页面只有一个模型不能先卸载，将卸载的功能放到新加载模型成功后，否则model.getData报错
        jz = true;
    } else {
        for (var i = 0; i < modelcount.length; i++) {
            if (window.update_mqurl == undefined) {
                ///
            } else {
                var str = modelcount[i].loader.basePath;
                var modelPath = str.split(globalConfig.loadPortURL)[1];
                const pattern=/[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
                modelPath = modelPath.replace(pattern,"");


                var str1 = window.update_mqurl.split("/");
                for(let r=0;r<str1.length;r++){
                    let ul =str1[r];
                    if(ul == modelPath){
                        aa = r;
                    }
                }
                var dataPath =  str1[aa];
                if (dataPath == modelPath) {
                    self.viewer.impl.unloadModel(modelcount[i]);
                    console.log('更新模型')
                }
            }
        }
    }

    self.viewer.loadModel(globalConfig.$baseURL + jz_url + '/3d.svf', { globalOffset: self.viewer.model.getData().globalOffset },
        function(event) {
            setTimeout(function(){ 
                var numb = event.getData().instanceTree.objectCount - 1;
                window.dispatchEvent(
                    new CustomEvent('mqCount', {'detail': numb})
                );
            }, 1000);
            if (jz) {
                for (var h = 0; h < modelcount.length; h++) {
                    var str = modelcount[h].loader.basePath;
                    var modelPath = str.split(globalConfig.loadPortURL)[1];
                    const pattern=/[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
                    modelPath = modelPath.replace(pattern,"");


                    var str1 = window.update_mqurl.split("/");
                    var dataPath = str1[0];
                    if (dataPath == modelPath && window.update_mqurl != undefined) {
                        self.viewer.impl.unloadModel(modelcount[0]);
                        console.log('单个模型更新')
                    }
                }
            }
            console.log("load MQ success");
            // console.log(self.viewer.impl.modelQueue().getModels());

            // if (window.jz_switch) {
            //     JZ_modelLoadToDb(event)
            // }

            // function JZ_modelLoadToDb(model) {
            //     /**
            //      *
            //      * 建筑模型数据导入。
            //      *
            //      * */

            //     let jsonDataList = [];

            //     //  getDataForDbid(1);
            //     getDataForDbid(model, 1, execObj, endExec);

            //     function execObj(obj) {
            //         let tempData = {
            //             db_id: obj.dbId,
            //             element_id: -1,
            //             // parent_id:'',
            //             room_name: '',
            //             room_size: -1,
            //             room_ceilingheight: -1,
            //             floor_name: '-1'
            //         };
            //         for (let  index  in  obj.properties) {
            //             /**
            //              * 为指定内容查找。
            //              *
            //              */
            //             let  Prop  = obj.properties[index];

            //             // if(Prop.displayCategory=="常规"&&Prop.displayName=="设备编号"){
            //             //     tempData.device_number=Prop.displayValue;
            //             // }

            //             if (Prop.displayCategory == "标识数据" && Prop.displayName == "名称") {
            //                 tempData.room_name = Prop.displayValue == '' ? "目前模型.不存在" : Prop.displayValue;
            //             }


            //             if (Prop.displayCategory == "__revit-internal__" && Prop.attributeName == "element_id") {
            //                 tempData.element_id = Prop.displayValue == '' ? '-1' : Prop.displayValue;
            //             }

            //             if (Prop.displayCategory == "__parent__" && Prop.displayValue != "") {
            //                 tempData.parent_id = Prop.displayValue;
            //             }

            //             if (Prop.displayCategory == "尺寸标注" && Prop.attributeName == "面积") {
            //                 tempData.room_size = Prop.displayValue != "" ? Prop.displayValue : 0;
            //             }

            //             if (Prop.displayCategory == "尺寸标注" && Prop.attributeName == "房间标示高度") {
            //                 tempData.room_ceilingheight = Prop.displayValue != "" ? Prop.displayValue : 0;
            //             }



            //             if (Prop.displayCategory == "约束" && Prop.attributeName == "标高") {
            //                 tempData.floor_name = Prop.displayValue == '' ? "目前模型.不存在" : Prop.displayValue;
            //             }

            //         }

            //         // console.log(tempData);

            //         // 缺少一个 编号重命名。
            //         jsonDataList.push(tempData);

            //     }


            //     function endExec() {
            //         // console.log(jsonDataList.length);
            //         var a = jsonDataList;
            //         $.post("http://www.situos.cn:3003/Jz_model_data", encodeURI(JSON.stringify({ data: a })),
            //             function(data) {
            //                 let adata = JSON.parse(data);
            //                 if (adata.isLoad) {
            //                     console.log("loadOk");
            //                 } else {
            //                     console.log("loadErr");
            //                 }
            //             });
            //     }
            // }

            // function getDataForDbid(model, dbid, callback, endcall) {
            //     if (dbid < 1) dbid = 1;
            //     // if(dbid>10)return;
            //     model.getProperties(dbid, function(obj) {
            //         if (obj && obj.properties.length > 0) {
            //             callback(obj);
            //             getDataForDbid(model, dbid + 1, callback, endcall);
            //         } else {
            //             //检索不到的时候。结束检索。
            //             endcall();
            //         }
            //     });
            // }
            self.viewer.unloadExtension('uploadmq');
        });
};
export default Autodesk.Viewing.theExtensionManager.registerExtension('uploadmq', _ElectromeMQ);