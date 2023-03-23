var x = 0;
var y = 0;
var dbId = '';
// var device_data  = '';
var roomdata = '';
var mo_shi = '';
var feng_su = '';
var device_data;
// var box11;//包围盒线
var evet;
class CustomTool {
    constructor(viewer) {
        this._viewer = viewer;
        this._active = false;
        // this.lineGroups = [];//包围盒线
        // this.linesMaterial = this.createMaterial(0x0000FF);//包围盒线
        this._names = ['CustomTool'];
        // this._viewer.impl.createOverlayScene ('boundingBox',this.linesMaterial)//包围盒线
        var self = this;
        window.addEventListener("tools", function(e) {
            self.handleMouseMove(evet, '');
            // device_data = e.data;
        }, false);
        return true;
    }
    get viewer() {
        return this._viewer;
    }

    isActive() {
        return this._active;
    }

    getNames() {
        return this._names;
    }
    getName() {
        return this._names[0];
    }

    register() {}

    deregister() {}

    activate(name) {
        this._active = true;
    }

    update(highResTimestamp) {
        return false;
    }
    labelToBeat(ids, className) {
        var tempMarkup = $(className);

        for (var i = 0; i < tempMarkup.length; i++) {
            var dataId = tempMarkup[i].getAttribute('data-id');
            if (dataId == ids) {
                $(tempMarkup[i]).siblings().children('.temperature').removeClass('baojing')
                $(tempMarkup[i]).children('.temperature').addClass('baojing')
            }
            // else{
            //     $(tempMarkup[i]).children('.temperature').removeClass('baojing')
            // }
        }
    }
    handleSingleClick(event, button) {
        const result2 = this.viewer.impl.hitTest(event.canvasX, event.canvasY, false);
        if (result2) {
            var selectDbid = result2.dbId;
        }

        this.labelToBeat(selectDbid, '.markup'); //点击构件使相对应的图标跳动
        // console.log(event)
        if (selectDbid != null && event.button != 2) { //event.button != 2右击鼠标不请求
            window.dispatchEvent(
                new CustomEvent('db_id', { 'detail': selectDbid })
            );
        }

        // var it = this.viewer.model.getData().instanceTree;
        // console.log(it)
        // var tmpBox = new Float32Array(6);
        // it.enumNodeChildren(it.getRootId(), function (dbId) { 
        //     it.getNodeBox(dbId, tmpBox);
        // }, true);
        // console.log(tmpBox);
        ///////////////////////////
        // var threeMesh = buildComponentMesh(window.JZmodels, 111);
        // console.log(threeMesh.boundingBox)
        // box11 = threeMesh.boundingBox;//包围盒线
        //包围盒线
        // this.drawBox(box11);
    }

    //包围盒线
    // createMaterial (color = 0x000000, opacity = 1.0) {

    //     return new THREE.LineBasicMaterial({
    //       color: new THREE.Color(color),
    //       transparent: true,
    //       depthWrite: false,
    //       depthTest: true,
    //       linewidth: 10,
    //       opacity
    //     })
    // }
    //包围盒线
    // drawBox (bbox) {

    //     const geometry = new THREE.Geometry()

    //     const { min, max } = bbox
    //     geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
    //     geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))

    //     geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
    //     geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))

    //     geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
    //     geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))

    //     geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
    //     geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))

    //     geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))
    //     geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

    //     geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))
    //     geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

    //     geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))
    //     geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

    //     geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))
    //     geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

    //     geometry.vertices.push(new THREE.Vector3(min.x, min.y, min.z))
    //     geometry.vertices.push(new THREE.Vector3(min.x, max.y, min.z))

    //     geometry.vertices.push(new THREE.Vector3(max.x, min.y, min.z))
    //     geometry.vertices.push(new THREE.Vector3(max.x, max.y, min.z))

    //     geometry.vertices.push(new THREE.Vector3(max.x, min.y, max.z))
    //     geometry.vertices.push(new THREE.Vector3(max.x, max.y, max.z))

    //     geometry.vertices.push(new THREE.Vector3(min.x, min.y, max.z))
    //     geometry.vertices.push(new THREE.Vector3(min.x, max.y, max.z))

    //     const lines = new THREE.Line(geometry,
    //       this.linesMaterial,
    //       THREE.LinePieces)

    //     this.lineGroups.push(lines)

    //     this._viewer.impl.addOverlay('boundingBox', lines)

    //     this._viewer.impl.invalidate(
    //       true, true, true)
    //   }

    handleMouseMove(event, button) {
        var self = this;
        device_data = window.roomValue;
        // var device_data =[];//没设计好  暂时设置为空
        var html1 = null;
        // $(".lab").remove();
        // $('.meetRoom-markup').remove();
        evet = event;
        // console.log(evet)
        if (evet) { //如果没发送实时数据，会导致window.dbID无法赋值，所以重新获取
            const result1 = this.viewer.impl.hitTest(evet.canvasX, evet.canvasY, false);
            if (result1) {
                if (result1.model.loader.basePath.includes('jd')) {
                    window.connectType = 'JD';
                    window.dbID = result1.dbId;
                } else if (result1.model.loader.basePath.includes('jz')) {
                    window.connectType = 'JZ';
                    window.dbID = result1.dbId;
                } else if (result1.model.loader.basePath.includes('jg')) {
                    window.connectType = 'JG';
                    window.dbID = result1.dbId;
                } else if (result1.model.loader.basePath.includes('nz')) {
                    window.connectType = 'NZ';
                    window.dbID = result1.dbId;
                } else if (result1.model.loader.basePath.includes('mq')) {
                    window.connectType = 'MQ';
                    window.dbID = result1.dbId;
                } else if (result1.model.loader.basePath.includes('qzy')) {
                    window.connectType = 'QZY';
                    window.dbID = result1.dbId;
                }
            }
        }
        if (evet && device_data &&  window.routerName  !=  'monitoringCenter_driving') {
            $(".lab").remove();
            $('.meetRoom-markup').remove();
            const result = this.viewer.impl.hitTest(evet.canvasX, evet.canvasY, false);
            if (result) { window.dbID = result.dbId; }

            // //鼠标移开设备时显示默认状态标签
            // for(var m=0;m<device_data.length;m++){
            //     if(result && result.dbId == device_data[m].dbId){

            //     }else if(result && result.dbId != device_data[m].dbId){
            //         $(".mysvg"+device_data[m].dbId).css('display','block')
            //     }else if (result == null) {
            //         $(".lab").remove();
            //         $(".meetRoom-markup").remove();
            //         $(".mysvg"+device_data[m].dbId).css('display','block')
            //     }
            // }



            //原版
            // for(var i=0; i<device_data.length;i++){
            //     if (result && result.dbId == device_data[i].dbId && device_data[i].variableStatus.includes('正常') && device_data[i].account >= 2 ) {
            //         $(".mysvg"+device_data[i].dbId).css('display','none');
            //         if(html1 == null){
            //             html1 = `
            //             <div class="lab">
            //                 <div style="position: relative;" class="anim">
            //                     <div style="position: absolute;bottom:0;left: 0;width:200px;height: 300px">
            //                         <img class="aaa" style="width: 100%;height: 100%"  src="http://www.situos.cn:3003/_load/_img/hover.png"/>
            //                         <div class="bianliang" style="position: absolute;top: 20px; left: 35px;width: 100%;font-size: 12px">
            //                             <div class="Value11" style="margin-left:10px">
            //                                 <span style="width: auto;display: inline-block">${device_data[i].deviceName}</span></br>
            //                                 <span style="color:#fff;margin-left:27%">${ device_data[i].deviceNum}</span>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //             `
            //             $(".adsk-viewing-viewer").append(html1);
            //         }
            //         // for(var p=0;p<device_data[i].serComAddrList.length;p++){
            //             var hhh= `
            //                 <div class="Value" style="margin:3px 0px 0px 15px">
            //                     <span style="width: 80px;display: inline-block">${Object.keys(device_data[i].value)[0]}:</span>
            //                     <span style="color:#00BCFF">${ Object.values(device_data[i].value)[0]}</span>
            //                 </div>
            //             `
            //             $(".bianliang").append(hhh);
            //         // }
            //         dbId = Number(result.dbId)
            //         var rad = 7;
            //         var threeMesh = buildComponentMesh(window.JGmodels, dbId);
            //         // console.log(threeMesh.boundingBox)
            //         // box11 = threeMesh.boundingBox;//包围盒线
            //         var sensorPos = new Object();
            //         sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
            //         sensorPos.y = threeMesh.boundingBox.max.y;
            //         sensorPos.z = threeMesh.boundingBox.max.z;
            //         var screenpoint = self._viewer.worldToClient(
            //             new THREE.Vector3(sensorPos.x,
            //                 sensorPos.y,
            //                 sensorPos.z));
            //         $('.lab').css({
            //             'left': screenpoint.x - rad * 1 +10,
            //             'top': screenpoint.y
            //         });

            //         $('.lab').css({
            //             'width': '10px',
            //             'height': '10px',
            //             'position': 'absolute',
            //             'z-index': 99,
            //         });
            //         $('.Value').css({

            //         })
            //     }else if(result && result.dbId == device_data[i].dbId && device_data[i].variableStatus.includes('故障')){
            //         $(".mysvg"+device_data[i].dbId).css('display','none')
            //         let html1 = `
            //         <label class="meetRoom-markup markup meetRoom-update meetRoom-normal " data-id="${device_data[i].dbId}" data-name="${1}">
            //             <div class="temperature">
            //             <span>故障原因:${device_data[i].serComAddrList[0].anotherName}</span>
            //             <div class="vertical-bar"></div>
            //             <img src="./img/spread.gif" width="25" height="20"/>
            //             </div>
            //         </label>
            //     `
            //         $(".adsk-viewing-viewer").append(html1);
            //         dbId = Number(result.dbId)
            //         var rad = 7;
            //         var threeMesh = buildComponentMesh(window.JGmodels, dbId);
            //         var sensorPos = new Object();
            //         sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
            //         sensorPos.y = threeMesh.boundingBox.max.y;
            //         sensorPos.z = threeMesh.boundingBox.max.z;
            //         var screenpoint = self._viewer.worldToClient(
            //             new THREE.Vector3(sensorPos.x,
            //                 sensorPos.y,
            //                 sensorPos.z));
            //         $('.meetRoom-markup').css({
            //             'left': screenpoint.x - rad * 1 - 30 ,
            //             'top': screenpoint.y - 20
            //         });

            //         $('.meetRoom-markup').css({
            //             'width': '10px',
            //             'height': '10px',
            //             'position': 'absolute',
            //             'z-index': 99,
            //         });
            //     }else if(result && result.dbId == device_data[i].dbId && device_data[i].account < 2 &&
            //         device_data[i].serComAddrList.length > 0 && 
            //         device_data[i].deviceState.includes('正常')){
            //         $(".mysvg"+device_data[i].dbId).css('display','none')
            //         let html1 = `
            //         <label class="meetRoom-markup markup meetRoom-update meetRoom-normal " data-id="${device_data[i].dbId}" data-name="${1}">
            //             <div class="temperature">
            //             <span>${device_data[i].serComAddrList[0].variableName}:${device_data[i].serComAddrList[0].newValue}
            //             <div class="vertical-bar"></div>
            //             <img src="./img/spread.gif" width="25" height="20"/>
            //             </div>
            //         </label>
            //     `
            //         $(".adsk-viewing-viewer").append(html1);
            //         dbId = Number(result.dbId)
            //         var rad = 7;
            //         var threeMesh = buildComponentMesh(window.JGmodels, dbId);
            //         var sensorPos = new Object();
            //         sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
            //         sensorPos.y = threeMesh.boundingBox.max.y;
            //         sensorPos.z = threeMesh.boundingBox.max.z;
            //         var screenpoint = self._viewer.worldToClient(
            //             new THREE.Vector3(sensorPos.x,
            //                 sensorPos.y,
            //                 sensorPos.z));
            //         $('.meetRoom-markup').css({
            //             'left': screenpoint.x - rad * 1 - 20 ,
            //             'top': screenpoint.y - 20
            //         });

            //         $('.meetRoom-markup').css({
            //             'width': '10px',
            //             'height': '10px',
            //             'position': 'absolute',
            //             'z-index': 99,
            //         });
            //     }
            //     else if(result && result.dbId != device_data[i].dbId){
            //         $(".mysvg"+device_data[i].dbId).css('display','block')
            //     }
            //     else if (result == null) {
            //         $(".lab").remove();
            //         $(".meetRoom-markup").remove();
            //         $(".mysvg"+device_data[i].dbId).css('display','block')
            //     }
            // }

            //////////  
            for (var i = 0; i < device_data.length; i++) {
                var Icondata = device_data[i];
                for (var h = 0; h < Icondata.length; h++) {
                    if (Icondata[h].signal == 'good') { //先判断是否在线
                        if (result && result.dbId == Icondata[h].dbId && Icondata[h].variableStatus.includes('故障')) {
                            //模型设备上如果出现故障不显示其它任何数据，只显示故障标签
                        } else if (result && result.dbId == Icondata[h].dbId && Icondata[h].variableStatus.includes('报警')) {
                            if (Icondata[h].serComAddr.dataType == '布尔') {
                                //开关量报警后不显示其它任何数据，只显示报警标签
                            } else if (Icondata[h].serComAddr.dataType != '布尔' && Icondata[h].account >= 2) { //如果是模拟量报警且数据条数大于等于2，用大标签展示所有数据
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none');
                                if (html1 == null) {
                                    html1 = `
                                <div class="lab">
                                    <div style="position: relative;" class="anim">
                                        <div style="position: absolute;bottom:0;left: 0;width:200px;height: 300px">
                                            <img class="aaa" style="width: 100%;height: 100%"  src="http://www.situos.cn:3003/_load/_img/hover.png"/>
                                            <div class="bianliang" style="position: absolute;top: 20px; left: 35px;width: 100%;font-size: 12px">
                                                <div class="Value11" style="margin-left:10px">
                                                    <span style="width: auto;margin: 35px;">${Icondata[h].service_name}</span></br>
                                                    <span style="color:#fff;margin-left:27%">${Icondata[h].point_ip}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                    $(".adsk-viewing-viewer").append(html1);
                                }
                                // for(var p=0;p<device_data[i].serComAddrList.length;p++){
                                var hhh = `
                                    <div class="Value" style="margin:3px 0px 0px 15px">
                                        <span style="width: 115px;display: inline-block">${Icondata[h].serComAddr.variableName}:</span>
                                        <span style="color:#00BCFF">${Icondata[h].serComAddr.newValue}</span>
                                    </div>
                                `
                                $(".bianliang").append(hhh);
                                // }
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                // console.log(threeMesh.boundingBox)
                                // box11 = threeMesh.boundingBox;//包围盒线
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.lab').css({
                                    'left': screenpoint.x - rad * 1 + 10,
                                    'top': screenpoint.y
                                });

                                $('.lab').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                                $('.Value').css({

                                })
                            } else if (Icondata[h].account < 2) { //模拟量报警且数据条数小于2，则用小标签展示数据
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none')
                                let html1 = `
                            <label class="meetRoom-markup markup meetRoom-update meetRoom-normal " data-id="${Icondata[h].dbId}" data-name="${1}">
                                <div class="temperature">
                                <span>${Icondata[h].serComAddr.variableName}:${Icondata[h].serComAddr.newValue}</span>
                                <div class="vertical-bar"></div>
                                <img src="http://36.112.118.18:8512/web_resources/sq/img/spread.gif" width="25" height="20"/>
                                </div>
                            </label>
                        `
                                $(".adsk-viewing-viewer").append(html1);
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.meetRoom-markup').css({
                                    'left': screenpoint.x - rad * 1 - 25,
                                    'top': screenpoint.y - 20
                                });

                                $('.meetRoom-markup').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                            }
                        } else if (result && result.dbId == Icondata[h].dbId && Icondata[h].variableStatus.includes('预警')) {
                            if (Icondata[h].account >= 2) { //数据条数大于2，大标签展示数据
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none');
                                if (html1 == null) {
                                    html1 = `
                                <div class="lab">
                                    <div style="position: relative;" class="anim">
                                        <div style="position: absolute;bottom:0;left: 0;width:200px;height: 300px">
                                            <img class="aaa" style="width: 100%;height: 100%"  src="http://www.situos.cn:3003/_load/_img/hover.png"/>
                                            <div class="bianliang" style="position: absolute;top: 20px; left: 35px;width: 100%;font-size: 12px">
                                                <div class="Value11" style="margin-left:10px">
                                                    <span style="width: auto;margin: 35px;">${Icondata[h].service_name}</span></br>
                                                    <span style="color:#fff;margin-left:27%">${Icondata[h].point_ip}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                    $(".adsk-viewing-viewer").append(html1);
                                }
                                // for(var p=0;p<device_data[i].serComAddrList.length;p++){
                                var hhh = `
                                    <div class="Value" style="margin:3px 0px 0px 15px">
                                        <span style="width: 115px;display: inline-block">${Icondata[h].serComAddr.variableName}:</span>
                                        <span style="color:#00BCFF">${Icondata[h].serComAddr.newValue}</span>
                                    </div>
                                `
                                $(".bianliang").append(hhh);
                                // }
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                // console.log(threeMesh.boundingBox)
                                // box11 = threeMesh.boundingBox;//包围盒线
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.lab').css({
                                    'left': screenpoint.x - rad * 1 + 10,
                                    'top': screenpoint.y
                                });

                                $('.lab').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                                $('.Value').css({

                                })
                            } else if (Icondata[h].account < 2) {
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none')
                                let html1 = `
                            <label class="meetRoom-markup markup meetRoom-update meetRoom-normal " data-id="${Icondata[h].dbId}" data-name="${1}">
                                <div class="temperature">
                                <span>${Icondata[h].serComAddr.variableName}:${Icondata[h].serComAddr.newValue}</span>
                                <div class="vertical-bar"></div>
                                <img src="http://36.112.118.18:8512/web_resources/sq/img/spread.gif" width="25" height="20"/>
                                </div>
                            </label>
                        `
                                $(".adsk-viewing-viewer").append(html1);
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.meetRoom-markup').css({
                                    'left': screenpoint.x - rad * 1 - 25,
                                    'top': screenpoint.y - 20
                                });

                                $('.meetRoom-markup').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                            }
                        } else if (result && result.dbId == Icondata[h].dbId && Icondata[h].serComAddr.dataType == '布尔') {
                            if (Icondata[h].account >= 2) { //数据条数大于2，大标签展示数据
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none');
                                if (html1 == null) {
                                    html1 = `
                                <div class="lab">
                                    <div style="position: relative;" class="anim">
                                        <div style="position: absolute;bottom:0;left: 0;width:200px;height: 300px">
                                            <img class="aaa" style="width: 100%;height: 100%"  src="http://www.situos.cn:3003/_load/_img/hover.png"/>
                                            <div class="bianliang" style="position: absolute;top: 20px; left: 35px;width: 100%;font-size: 12px">
                                                <div class="Value11" style="margin-left:10px">
                                                    <span style="width: auto;margin: 35px;">${Icondata[h].service_name}</span></br>
                                                    <span style="color:#fff;margin-left:27%">${Icondata[h].point_ip}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                    $(".adsk-viewing-viewer").append(html1);
                                }
                                // for(var p=0;p<device_data[i].serComAddrList.length;p++){
                                var hhh = `
                                    <div class="Value" style="margin:3px 0px 0px 15px">
                                        <span style="width: 115px;display: inline-block">${Icondata[h].serComAddr.variableName}:</span>
                                        <span style="color:#00BCFF">${(Icondata[h].serComAddr.newValue) }</span>
                                    </div>
                                `
                                $(".bianliang").append(hhh);
                                // }
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                // console.log(threeMesh.boundingBox)
                                // box11 = threeMesh.boundingBox;//包围盒线
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.lab').css({
                                    'left': screenpoint.x - rad * 1 + 10,
                                    'top': screenpoint.y
                                });

                                $('.lab').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                                $('.Value').css({

                                })
                            } else if (Icondata[h].account < 2) {
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none')
                                let html1 = `
                            <label class="meetRoom-markup markup meetRoom-update meetRoom-normal " data-id="${Icondata[h].dbId}" data-name="${1}">
                                <div class="temperature">
                                <span>${Icondata[h].serComAddr.variableName}:${Icondata[h].serComAddr.newValue}</span>
                                <div class="vertical-bar"></div>
                                <img src="http://36.112.118.18:8512/web_resources/sq/img/spread.gif" width="25" height="20"/>
                                </div>
                            </label>
                        `
                                $(".adsk-viewing-viewer").append(html1);
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.meetRoom-markup').css({
                                    'left': screenpoint.x - rad * 1 - 25,
                                    'top': screenpoint.y - 20
                                });

                                $('.meetRoom-markup').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                            }
                        } else if (result && result.dbId == Icondata[h].dbId && Icondata[h].variableStatus.includes('正常')) { //判断是否为开关量
                            if (Icondata[h].account >= 2) {
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none');
                                if (html1 == null) {
                                    html1 = `
                                <div class="lab">
                                    <div style="position: relative;" class="anim">
                                        <div style="position: absolute;bottom:0;left: 0;width:200px;height: 300px">
                                            <img class="aaa" style="width: 100%;height: 100%"  src="http://www.situos.cn:3003/_load/_img/hover.png"/>
                                            <div class="bianliang" style="position: absolute;top: 20px; left: 35px;width: 100%;font-size: 12px">
                                                <div class="Value11" style="margin-left:10px">
                                                    <span style="width: auto;margin: 35px;">${Icondata[h].service_name}</span></br>
                                                    <span style="color:#fff;margin-left:27%">${Icondata[h].point_ip}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                                    $(".adsk-viewing-viewer").append(html1);
                                }
                                // for(var p=0;p<device_data[i].serComAddrList.length;p++){
                                var hhh = `
                                    <div class="Value" style="margin:3px 0px 0px 15px">
                                        <span style="width: 115px;display: inline-block">${Icondata[h].serComAddr.variableName}:</span>
                                        <span style="color:#00BCFF">${Icondata[h].serComAddr.newValue}</span>
                                    </div>
                                `
                                $(".bianliang").append(hhh);
                                // }
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                // console.log(threeMesh.boundingBox)
                                // box11 = threeMesh.boundingBox;//包围盒线
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.lab').css({
                                    'left': screenpoint.x - rad * 1 + 10,
                                    'top': screenpoint.y
                                });

                                $('.lab').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                                $('.Value').css({

                                })
                            } else if (Icondata[h].account < 2) {
                                $(".mysvg" + Icondata[h].dbId).css('display', 'none')
                                let html1 = `
                            <label class="meetRoom-markup markup meetRoom-update meetRoom-normal " data-id="${Icondata[h].dbId}" data-name="${1}">
                                <div class="temperature">
                                <span>${Icondata[h].serComAddr.variableName}:${Icondata[h].serComAddr.newValue}</span>
                                <div class="vertical-bar"></div>
                                <img src="http://36.112.118.18:8512/web_resources/sq/img/spread.gif" width="25" height="20"/>
                                </div>
                            </label>
                        `
                                $(".adsk-viewing-viewer").append(html1);
                                dbId = Number(result.dbId)
                                var rad = 7;
                                var threeMesh = buildComponentMesh(window.JDmodels, dbId);
                                var sensorPos = new Object();
                                sensorPos.x = (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
                                sensorPos.y = threeMesh.boundingBox.max.y;
                                sensorPos.z = threeMesh.boundingBox.max.z;
                                var screenpoint = self._viewer.worldToClient(
                                    new THREE.Vector3(sensorPos.x,
                                        sensorPos.y,
                                        sensorPos.z));
                                $('.meetRoom-markup').css({
                                    'left': screenpoint.x - rad * 1 - 25,
                                    'top': screenpoint.y - 20
                                });

                                $('.meetRoom-markup').css({
                                    'width': '10px',
                                    'height': '10px',
                                    'position': 'absolute',
                                    'z-index': 99,
                                });
                            }
                        } else if (result && result.dbId != Icondata[h].dbId) {
                            $(".mysvg" + Icondata[h].dbId).css('display', 'block')
                        } else if (result == null) {
                            $(".lab").remove();
                            $(".meetRoom-markup").remove();
                            $(".mysvg" + Icondata[h].dbId).css('display', 'block')
                        }
                    }
                    ////////////////////
                }

            } //for循环
        } //最外层      
    }
}