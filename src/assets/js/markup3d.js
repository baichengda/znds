// MarkupExt.js
function markup3d(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);

    this.viewer = viewer;
    this.scene = viewer.impl.scene; // change this to viewer.impl.sceneAfter with transparency, if you want the markup always on top.
    this.markupItems = []; // array containing markup data

    this.camera = viewer.impl.camera;


}

markup3d.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
markup3d.prototype.constructor = markup3d;

markup3d.prototype.unload = function() {
    $('#_groupwarning').remove();
    return true;
};

markup3d.prototype.load = function() {
    var self = this;

    var parent = self.viewer.container;
    self.group = $("<div class='_groupwarning' id='_groupwarning'></div>");
    $(parent).append(self.group);


    // setup listeners for new data and mouse events
    window.addEventListener("newData", function(e) {
        //   console.log(e)
        self.setMarkupData(e.detail);
        self.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, caneraChange);
    }, false);

    function caneraChange(rt) {
        var DOMeles = self.group.children();

        DOMeles.each(function(index, item) {
            var divEle = $(item);
            //get out the 3D coordination
            var val = divEle.data('3DData');
            if (val) {
                try {
                    var pushpinModelPt = JSON.parse(val);
                } catch (e) {
                    //console.info(val);
                }

                //get the updated screen point
                if (pushpinModelPt && pushpinModelPt.x && pushpinModelPt.y && pushpinModelPt.z) {
                    var screenpoint = self.viewer.worldToClient(new THREE.Vector3(
                        pushpinModelPt.x,
                        pushpinModelPt.y,
                        pushpinModelPt.z));
                    divEle.css({
                        'left': screenpoint.x - pushpinModelPt.radius * 2,
                        'top': screenpoint.y - pushpinModelPt.radius
                    });
                }
            }
        });


    }

    function onMouseClick(event) {

        var screenPoint = {
            x: event.clientX,
            y: event.clientY
        };

        //get the selected 3D position of the object
        var hitTest = self.viewer.impl.hitTest(screenPoint.x, screenPoint.y, true);
        /* if(hitTest)
         {
             drawPushpin({x:hitTest.intersectPoint.x,
                 y:hitTest.intersectPoint.y,
                 z:hitTest.intersectPoint.z});
         }*/
    }

    // Load markup points into Point Cloud
    this.setMarkupData = function(data) {
        data.map(function(item) {
            // console.log(item.event)
            drawPushpin({
                x: item.x,
                y: item.y,
                z: item.z,
                dbid: item.dbid,
                type: item.type,
                name: item.name,
                eve: item.event,
            });
        });
        // this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, caneraChange);
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, caneraChange);

        //$( this.viewer.container).bind("click", onMouseClick);
    };


    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function drawPushpin(pushpinModelPt) {
        //   self.group.empty();
        //convert 3D position to 2D screen coordination
        var screenpoint = self.viewer.worldToClient(
            new THREE.Vector3(pushpinModelPt.x,
                pushpinModelPt.y,
                pushpinModelPt.z));

        //build the div container
        var randomId = makeid();

        var htmlMarker = '<div id="mymk' + randomId + '"  _dbid="' + pushpinModelPt.dbid + '" _name="' + pushpinModelPt.name + '"  _event="' + pushpinModelPt.eve + '"></div>';
        self.group.append(htmlMarker);
        $('#mymk' + randomId).css({
            'pointer-events': 'auto',
            'width': '28px',
            'height': '28px',
            'position': 'absolute',
            'overflow': 'visible',
            'cursor': 'pointer'
        });

        //build the svg element and draw a circle
        // $('#mymk' + randomId).append('<svg id="mysvg' + randomId + '" style="width:24px;height:24px;"></svg>');
        if (pushpinModelPt.type == '报警') {
            $('#mymk' + randomId).append('<img id="mysvg' + randomId + '" src="img/bj-icon1.png" style="width:24px;height:24px;"/>');
        } else if (pushpinModelPt.type == '预警') {
            $('#mymk' + randomId).append('<img id="mysvg' + randomId + '" src="img/bj-icon3.png" style="width:24px;height:24px;"/>');
        } else if (pushpinModelPt.type == '故障') {
            $('#mymk' + randomId).append('<img id="mysvg' + randomId + '" src="img/bj-icon2.png" style="width:24px;height:24px;"/>');
        }

        var imgs = $('#mysvg' + randomId)[0];
        var rad = 7;
        $(imgs).mouseover(function() {

            var detail = { dbid: $('#mymk' + randomId).attr('_dbid'), name: $('#mymk' + randomId).attr('_name'), shijian: $('#mymk' + randomId).attr('_event') };
            window.dispatchEvent(
                new CustomEvent('cgqInforOver', { 'detail': detail })
            );
            $('#cgq_info_contri').stop().fadeIn(500);

        });
        $(imgs).mouseout(function() {
            $('#cgq_info_contri').stop().fadeOut(500);
        });
        var $container = $('#mymk' + randomId);
        $container.css({
            'left': screenpoint.x - rad * 1,
            'top': screenpoint.y - rad
        });
        $container.click(function() {
                var dbid = $(this).attr('_dbid');
                var models0 = window.yst_viewer.impl.modelQueue().getModels()[0]; //更换模型获取viewer.model
                let JZmodelId = Object.values(models0.getData().instanceTree.nodeAccess.dbIdToIndex);
                window.yst_viewer.impl.setGhostingBrightness = function(darkerFade) {
                    if (darkerFade) {
                        // this.fadeMaterial.color = new THREE.Color(0x101010);
                        this.fadeMaterial.color = new THREE.Color("#fff");
                        //ghost 透明度
                        this.fadeMaterial.opacity = 0.04;
                    } else {
                        this.fadeMaterial.color = new THREE.Color(0xffffff);
                        this.fadeMaterial.opacity = 0.01;
                    }
                    this.fadeMaterial.needsUpdate = true;
                };
                window.yst_viewer.impl.setGhostingBrightness(true);
                // window.yst_viewer.impl.visibilityManager.hide(JZmodelId,models0);
                window.yst_viewer.impl.selector.setSelection([dbid], window.JZmodel);
                window.yst_viewer.fitToView([dbid], window.JZmodel);
                window.To_leftmenu(dbid); //与左侧列表关联

                // window.showButton([id]);
                window.rightLine(dbid);
                // $('.goujianbaoxiu').css({
                //     'position':'fixed',
                //     'display':'block'
                // })
            })
            //store 3D point data to the DOM
        var div = $('#mymk' + randomId);
        //add radius info with the 3D data
        pushpinModelPt.radius = rad;
        var storeData = JSON.stringify(pushpinModelPt);
        div.data('3DData', storeData);

        $('.sensor[_dbid=' + pushpinModelPt.dbid + ']').attr('sId', 'mymk' + randomId);
        $('svg[xmlns="http://www.w3.org/2000/svg"]').remove();

    };

    return true;
}



Autodesk.Viewing.theExtensionManager.registerExtension('markup3d', markup3d);