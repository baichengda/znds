import { ElMessage  } from 'element-plus'
function _Electrome3(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
    this.type = [];
    this.array = [];
    this.init(this._viewer);
    window.addEventListener(
        "uploadARC",
        () => {
            this.init(this._viewer);
            
        },
        false
    );
}
_Electrome3.prototype.load = function() {
    var self = this;
    return this;
};
_Electrome3.prototype.unload = function() {
    return true;
};
_Electrome3.prototype.init = function(viewer) {
    this.viewer = viewer;
    var self = this;
    var jz_url = window.jz_url;
    var jz = false;
    var modelcount = self.viewer.impl.modelQueue().getModels();
    var aa =0 ;
    var globalConfig = JSON.parse(sessionStorage.getItem("appData")) || {}
        //加载前检查是否是更新，如果是则通过后台路径与模型中截取的路径做判断，卸载之前的模型
    if (modelcount.length == 1 && window.updateJZ) { //如果页面只有一个模型不能先卸载，将卸载的功能放到新加载模型成功后，否则model.getData报错
        jz = true;
    } else {
        for (var i = 0; i < modelcount.length; i++) {
            if (window.update_jzurl == undefined) {
                ///
            } else {
                var str = modelcount[i].loader.basePath;
                var modelPath = str.split(globalConfig.loadPortURL)[1];
                const pattern=/[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
                modelPath = modelPath.replace(pattern,"");
                var dataPath = window.update_jzurl.replace(pattern,"");

                // var str1 = window.update_jzurl.split("/");
                // for(let r=0;r<str1.length;r++){
                //     let ul =str1[r];
                //     if(ul == modelPath){
                //         aa = r;
                //     }
                // }
                // var dataPath =  str1[aa];
                if (dataPath == modelPath) {
                    // self.viewer.tearDown();
                    self.viewer.impl.unloadModel(modelcount[i]);
                    console.log('更新模型')
                    ElMessage.success('更新成功!');
                }
            }
        }
    }
    self.viewer.loadModel(globalConfig.$baseURL + jz_url + '/3d.svf', { globalOffset: self.viewer.model.getData().globalOffset},
        function(event) {
            setTimeout(function() {
                var numb = event.getData().instanceTree.objectCount  -  1;
                window.dispatchEvent(
                    new CustomEvent('jzCount', { 'detail': numb })
                );
            }, 1000);
            if (jz) {
                for (var h = 0; h < modelcount.length; h++) {
                    var str = modelcount[h].loader.basePath;
                    var modelPath = str.split(globalConfig.loadPortURL)[1];
                    const pattern=/[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
                    modelPath = modelPath.replace(pattern,"");
                    var dataPath = window.update_jzurl.replace(pattern,"");

                    // var str1 = window.update_jzurl.split("/");
                    // var dataPath = str1[0];
                    if (dataPath == modelPath && window.update_jzurl != undefined) {
                        self.viewer.impl.unloadModel(modelcount[0]);
                        ElMessage.success('更新成功!');
                        console.log('单个模型更新')
                    }
                }
            }
            console.log("load JZ success");
            
            self.viewer.unloadExtension('uploadjz');
        });
};
export default Autodesk.Viewing.theExtensionManager.registerExtension('uploadjz', _Electrome3);