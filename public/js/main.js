$(function() {
    if (JHCYW.isloadSvf)
        var viewer = new Autodesk.Viewing.Private.GuiViewer3D(document.getElementById('viewer-local'), JHCYW);
    var options = {
        env: 'Local',
        offline: 'true',
        useADP: false
    };

    //  isExistFile = function (url) {
    //     var xmlHttp;
    //     if (window.ActiveXObject) {
    //         xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    //     }
    //     else if (window.XMLHttpRequest) {
    //         xmlHttp = new XMLHttpRequest();
    //     }
    //     xmlHttp.open("get", url, false);
    //     xmlHttp.send();
    //     if (xmlHttp.readyState == 4) {
    //         if (xmlHttp.status == 200) {
    //             return true;
    //         }else if (xmlHttp.status == 404) {
    //             return false;
    //         }else {
    //             return false;
    //         }
    //     }
    // }
    Autodesk.Viewing.Initializer(options, function() {
        var SumLen = 0;
        var _temp;
        var width = $('body').width(),
            width2 = $(".progress").width();
        var isaddPercent = true;
        viewer.addEventListener(Autodesk.Viewing.PROGRESS_UPDATE_EVENT,
            function(event) {
                if (isaddPercent) {
                    if (_temp) {
                        SumLen += (event.percent - _temp);
                    } else {
                        SumLen += event.percent;
                    }
                    _temp = event.percent
                }
            });
        //获取当前url
        JHCYW.LocationURL = getLocationURL();
        //加载模型
        globalPromise(viewer, JHCYW.models_urls, onLoadSuccess, onLoadError)
            //相机旋转事件
        viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT,
            function(event) {
                // console.log(event);
            })
    });

    function globalPromise(viewer, modelArray, success, error) {
        function promiseEachModel(index) {
            return new Promise(function(resolve, reject) {
                var modelName = modelArray[index];

                function _onLoadModelSuccess(model) {
                    var a = {};
                    a[modelArray[index]] = model;
                    JHCYW.models_obj.push(a); // [{"15号楼":model},{"17号楼":model}]
                    resolve(modelName + ': Load Model Succeeded!');

                }

                function _onLoadModelError() {
                    error && error();
                    reject(modelName + ': Load Model failed!');
                }

                if (index == 0) {
                    //JD建筑模型  JG结构   JD 机电模型
                    viewer.start("/svf/" + modelArray[index] + "/JZ/3d.svf", {},
                        _onLoadModelSuccess,
                        _onLoadModelError);
                } else {
                    viewer.loadModel("/svf/" + modelArray[index] + "/JZ/3d.svf", { globalOffset: viewer.model.getData().globalOffset },
                        _onLoadModelSuccess,
                        _onLoadModelError);
                }
            });
        }


        var indexArr = JHCYW.models_urls.map(function(item, index) {
            return index;
        });

        function processArray(array, fn) {
            var results = [];
            return array.reduce(function(p, item) {
                return p.then(function() {
                    return fn(item).then(function(data) {
                        results.push(data);
                        return results;
                    });
                });
            }, Promise.resolve());
        }

        //start to process
        processArray(indexArr, promiseEachModel).then(function(result) {
            console.log(result);
            success && success();
        }, function(reason) {
            console.log(reason);
        });
    };

    function onLoadSuccess() {
        // viewer.setProgressiveRendering(true);//关闭渐进式渲染(代价是漫游模型会很卡，甚至无法漫游)
        this._viewer = viewer;
        this.hideBox = [];
        var louceng = [];
        var tempLC = [];
        var html = "";
        defaultView();
        models0 = viewer.impl.modelQueue().getModels()[0]; //更换模型获取viewer.model
        models1 = viewer.impl.modelQueue().getModels()[1]; //更换模型获取viewer.model

        viewer.model.search('"F2"', function(item) {
            //lcarr.push(item);
            console.log(tempLC);
            console.log(item);
            var instanceTree = viewer.model.getData().instanceTree;
            //console.log(instanceTree);
            var Len = item.length - 1;
            var htmlArray = [];

            if (item.length <= 0)
                console.log("没有搜索到楼层！");
            item.map(function(res, index) {
                console.log(res);
                if (instanceTree.getNodeParentId(res) == viewer.model.getRootId()) {
                    var nodeFinalName = instanceTree.getNodeName(res);
                    console.log(nodeFinalName)
                        //脑科学数据
                    var arr1 = nodeFinalName + ' 22342';
                    var arr = arr1.split(' ');
                    //焦化厂原数据修改
                    // var arr1 = nodeFinalName;
                    // var arr2 = arr1.split("_");
                    // var arr = arr2.slice(1);
                    // console.log(arr);

                    if (arr.length == 2) {
                        var _index = louceng.indexOf(arr[0]);
                        if (_index >= 0) {
                            tempLC[_index][arr[0]].push(res);
                        } else {
                            louceng.push(arr[0]);
                            var a = {};
                            a[arr[0]] = [res];
                            tempLC.push(a); //[{'1F':[1,2,3]},{'2F':[1,2,3]}]
                            //增加楼层列表
                            htmlArray.push(arr);
                        }
                    }
                }
                if (index == Len) {
                    function _sort(array) {
                        if (array.length <= 1) return array;
                        array.sort(function(item, item2) {
                            //console.log(item);
                            var s1 = item[0].split("");
                            var s2 = item2[0].split("");
                            var Ns1 = [],
                                Ns2 = [];
                            s1.map(function(i, index) {
                                if (index > 0) {
                                    Ns1.push(i);
                                }
                            });
                            s2.map(function(i, index) {
                                if (index > 0) {
                                    Ns2.push(i);
                                }
                            });
                            return Number(Ns1.join("")) - Number(Ns2.join(""));
                        });
                        return array;
                    }

                    var as1 = [],
                        as2 = [],
                        as3 = [];
                    htmlArray.forEach(function(item) {
                        // console.log(item);
                        if (item[0].indexOf("R") >= 0) {
                            as1.push(item);
                        } else if (item[0].indexOf("B") >= 0) {
                            as2.push(item);
                        } else if (item[0].indexOf("F") >= 0) {
                            as3.push(item);
                        }
                    });
                    as1 = _sort(as1);
                    as2 = _sort(as2);
                    as3 = _sort(as3);
                    var As = as2.concat(as3).concat(as1);
                    As.map(function(arr) {
                        //html += '<span _name="' + arr[0] + '_' + arr[1] + '_' + Number(arr[2]) + '" class="tclccs" lc_id="' + arr[1] + '">' + arr[1] + '</span>';
                        //html += '<li  class="tclccs" lc_id="' + arr[0] + '">' + arr[0] + '</li>';
                        html += '<li class="handle-click"><a lc_id="' + arr[0] + '" href="#" class=" aa addnext active" style="background: rgba(9,68,123,0.8);">' + arr[0] + '<i></i></a><ul class="three-level"></ul></li>';
                    });
                    //html += '<span class="tclccs"  lc_id="all">' + 'ALL' + '</span>';
                    // console.log(html)

                    $(".two-level").html(" ").append(html);
                    //添加楼层列表点击事件
                    louCengEvent(tempLC);
                    louceng.length = 0;
                }
            })
        }, function() {}, "名称");

        //楼层列表点击事件
        function louCengEvent(loucengArray) {
            var lcDBids;
            var self = this;
            window.searchHide = self.hideBox;

            $(".aa").off('click');
            $(".aa").unbind().click(function() {
                $(".three-level").html(''); //点击获取列表前先清除
                viewer.impl.selector.setSelection(); //取消选中
                window.searchHide && window.searchHide.map(function(item) {
                    // console.log(item);
                    // self.viewer.impl.visibilityManager.show(item, viewer.model);
                    // viewer.model.visibilityManager.setNodeOff(item, false);
                });
                $(".aa").removeClass('LcChoosed');
                $(this).addClass('LcChoosed');
                $(this).siblings().toggle();
                if ($(this).siblings('ul').css('display') == 'block') {
                    $(this).parents('li').siblings('li').children('ul').css({ "display": "none" });
                }
                //清除选中项、显示隐藏的
                viewer.clearSelection(true);
                // showALlHideBox();
                var lc = $(this).attr("lc_id");
                var lc_name = $(this).text();
                $("#lcInput").val(lc_name).attr('lc_id', lc);
                if (lc == 'all') {
                    self.toLocalAndFit();
                } else {
                    //var lcDBids;
                    loucengArray.map(function(item) {
                        //console.log(item);
                        item[lc] && (lcDBids = item[lc]);
                    });
                    //console.log(lcDBids);
                    $('#lcInput').attr('lc_dbid', lcDBids[0]);
                    viewer.impl.fitToView(lcDBids, models0);
                    // 选中状态
                    // viewer.impl.selector.setSelection(lcDBids,viewer.model);

                }
                //判断是否是xx页面
                function getQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                }
                var urls = window.location.pathname;
                var pathName = urls.substr(-13);
                console.log(pathName)
                if (pathName == "fangjian.html") {
                    var planes = [];
                    var p1 = new THREE.Vector4(0, 0, 1, -1.2);
                    var p2 = new THREE.Vector4(0, 0, -1, -25.37664031982422);
                    planes.push(p1);
                    planes.push(p2);
                    viewer.setCutPlanes(planes);
                }

                // var selectLcId = viewer.getSelection();

                // viewer.model.search('"Room"', function (item) {
                //      var instanceTree = viewer.model.getData().instanceTree;
                var item = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; 
                item.map(function(item1) {  // var fjName=instanceTree.getNodeName(item1);
                      getFjByDbid(item1);   });               
                //   },'类别');


                var pqId = $(this).attr('lc_id');


                if (pqId == 'F2') {
                    showLcPage('A座二层'); //显示楼层
                    hidethb();
                }

                function lcBack() {
                    var JZmodelId = Object.values(models0.getData().instanceTree.nodeAccess.dbIdToIndex);
                    var JDmodelId = Object.values(models1.getData().instanceTree.nodeAccess.dbIdToIndex);
                    viewer.impl.visibilityManager.show(JZmodelId, models0);
                    viewer.impl.visibilityManager.show(JDmodelId, models1);
                }
                lcBack();
            });
        }

        //显示构件
        function showALlHideBox(view, dbid) {
            var self = this;
            // var allarry = [];
            self.hideBox.map(function(value) {
                // allarry.push(value);
                try {
                    viewer.impl.visibilityManager.show(value, viewer.model);
                    viewer.model.visibilityManager.setNodeOff(value, false);
                } catch (e) {}
            });
            self.hideBox = [];
        };

        //隐藏天花板
        function hidethb() {
            models0.search('"天花板"', function(item) {
                viewer.impl.visibilityManager.hide(item, models0);
                viewer.impl.visibilityManager.hide([1223], models0);
                // viewer.impl.visibilityManager.setNodeOff(item, true);
            }, '名称');
        }
        //设备-不追加设备列表
        //viewer.model.search("照明设备",function (item) {
        //    console.log(item);
        //    var MnameInfo;
        //    var MnameArr = new Array();
        //    var MnameArrdbId = new Array();
        //    var MnameL = item.length-1;
        //    var instanceTree = viewer.model.getData().instanceTree;
        //    //console.log(instanceTree)
        //    item.map(function (val, index) {
        //        //console.log(val);
        //        var Mname = instanceTree.getNodeName(val);
        //        MnameArr.push(Mname);
        //        MnameArrdbId.push(val);
        //        MnameInfo = {"name":MnameArr,"dbid":MnameArrdbId};
        //        if (MnameL == index){
        //            //$('#baseInfo-wrapper').append('<div class="layui-colla-item" id="Mlayui"></div>');
        //            //$(".xtlist").append('<li class="Lclick"><h5 class="layui-colla-title" id="KT"><i class="layui-icon layui-colla-icon"></i>空调</h5></li>')
        //                for (var i=0;i<MnameInfo.name.length;i++){
        //                    //if (MnameInfo.name[i].indexOf('[') >=0){
        //                    //    $(".Lclick").append('<div style="display: none"  class="layui-colla-content layuitool" ><a href="#" style="color: white" _dbid="'+MnameInfo.dbid[i]+'" class="Lclickdbid">'+MnameInfo.name[i]+'</a></div>')
        //                    //}
        //                    if (MnameInfo.name[i] == "空调"){
        //                        $(".xtlist").append('<li class="Lclickdbid" _dbid="'+MnameInfo.dbid[i]+'"><h5 >'+ MnameInfo.name[i] +'</h5></li>')
        //                        //$(".Lclick").append('<div style="display: none"  class="layui-colla-content layuitool" ><a href="#" style="color: white" _dbid="'+MnameInfo.dbid[i]+'" class="Lclickdbid">'+MnameInfo.name[i]+'</a></div>')
        //                    }
        //                }
        //
        //
        //            //
        //
        //        }
        //    });
        //    Lclick();
        //
        //     console.log(MnameInfo);
        //},'类别');
        //设备-追加设备列表
        //viewer.model.search("专用设备",function (item) {
        //    //console.log(item);
        //    var HnameInfo;
        //    var HnameArr = new Array();
        //    var HnameArrdbId = new Array();
        //    var HnameL = item.length-1;
        //    var instanceTree = viewer.model.getData().instanceTree;
        //    console.log(instanceTree);
        //    item.map(function (val, index) {
        //        var Hname = instanceTree.getNodeName(val);
        //        HnameArr.push(Hname);
        //        HnameArrdbId.push(val);
        //        //console.log(HnameArr);
        //        HnameInfo = {"name":HnameArr,"dbid":HnameArrdbId};
        //        if (HnameL == index){
        //            //$('#baseInfo-wrapper').append('<div class="layui-colla-item" id="Mlayui"></div>');
        //            $(".xtlist").append('<li class="Lclick"><h5 class="layui-colla-title" id="PF"><i class="layui-icon layui-colla-icon"></i>排风</h5></li>');
        //            for (var i=0;i<HnameInfo.name.length;i++){
        //                if (HnameInfo.name[i].indexOf('[') >=0){
        //                    $(".Lclick").append('<div style="display: none"  class="layui-colla-content layuitool" ><a style="color: white" href="#" _dbid="'+HnameInfo.dbid[i]+'" class="Lclickdbid">'+HnameInfo.name[i]+'</a></div>')
        //                }
        //            }
        //        }
        //        $('#PF').click(function(){
        //         var pf = $(this).siblings('.layui-colla-content');
        //            $(pf).toggle();
        //        });
        //    });
        //    Lclick();
        //    // console.log(MnameInfo);
        //},'类别');
        //设备列表click
        function Lclick() {
            $('.Lclickdbid').unbind().click(function() {
                //self._viewer.model = window.JDmodels;
                var el = $(this);
                $('#baseinfodiv').html('');
                viewer.impl.fitToView([Number($(this).attr('_dbid'))], viewer.model);
                viewer.impl.selector.setSelection([Number($(this).attr('_dbid'))], models0);
                //self._viewer.select([Number($(this).attr('_dbid'))]);
                //传入传感器dbid
                //var threeMesh = buildComponentMesh( viewer.model, Number($(this).attr('_dbid')) );
                //var basePos = new Object();
                //basePos.x = (threeMesh.boundingBox.max.x+threeMesh.boundingBox.min.x)/2;
                //basePos.y = (threeMesh.boundingBox.max.y+threeMesh.boundingBox.min.y)/2;
                //basePos.z = (threeMesh.boundingBox.max.z+threeMesh.boundingBox.min.z)/2;
                //viewer.loadExtension('Autodesk.FirstPerson')
                //    .then(function () {
                //        viewer.setActiveNavigationTool('firstperson'); //viewer3d需要开启第一视角工具
                //        //重新设置相机的位置
                //        //注意camera up vector 的方向，还有跟right vector的关系，以及pivot的位置
                //        viewer.navigation.setRequestTransitionWithUp(true,new THREE.Vector3(basePos.x-5,basePos.y-5, basePos.z),new THREE.Vector3(basePos.x,basePos.y, basePos.z),45,new THREE.Vector3(0,0,1),new THREE.Vector3(0,0,0));
                //        viewer.navigation.setPivotPoint(true); //更新到pivot
                //    });
            });
        }


        function getFjByDbid(val) {
            // console.log(val);//房间的selectId
            var html1 = '';
            var arr11 = [];
            var FjName = models0.getData().instanceTree.getNodeName(val);
            // console.log(val)
            // console.log(FjName);
            if (FjName.indexOf('[') >= 0) {
                var FjName = FjName.slice(0, -10)
                html1 += '<li class="fangjianclick" _id=' + val + '>' + '<a>' + FjName + '</a>' + '</li>';
                $(".three-level").append(html1);
            }
            $('.fangjianclick').off('click');
            $('.fangjianclick').click(function() {
                var  arr11  =   [];
                var fjId = $(this).attr('_id');
                var fjId = JSON.parse(fjId);
                arr11.push(fjId);
                viewer.impl.selector.setSelection(arr11);
                viewer.impl.fitToView(arr11, models0);
                var RoomName = $(this).children('a').text(); //获取房间名
                $('#selectRoomName').text(RoomName);
                showFjPage(); //显示房间页面
            });
        }
        // 显示房间页面
        function showFjPage() {
            $('.r-model').show(500);
            $('.lc-right-module').hide();
        };
        // 显示楼层页面
        function showLcPage(lcName) {
            console.log('楼层')
            $('.lc-right-module').show(500);
            $('.r-model').hide();
            $('.lc_name').text(lcName)
        };

        //插件注册
        Autodesk.Viewing.Extension.call(this, viewer, options);
        viewer.loadExtension("electrome");
        viewer.loadExtension("lclist");
        viewer.loadExtension("rightmenu");
        // viewer.loadExtension("markup3d");
        viewer.loadExtension("cgq_infor");
        // viewer.loadExtension("camera");
        viewer.loadExtension("Autodesk.ADN.Sample.CustomToolExtension");
        //改变背景色
        var urls = window.location.pathname;
        var pathName = urls.substr(-12);
        var timer = null;
        if (pathName == "/jiashi.html") {
            models0 = viewer.impl.modelQueue().getModels()[0];
            models1 = viewer.impl.modelQueue().getModels()[1];
            var selectArray = [2426, 2427];
            viewer.impl.setGhostingBrightness = function(darkerFade) {
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
            // viewer.setGhosting(true);
            viewer.impl.setGhostingBrightness(true);
            clearInterval(timer)
            var arrsd = false;
            viewer.setSelectionColor(new THREE.Color(1, 0, 0));
            timer = setInterval(function() {
                viewer.impl.selector.setSelection(); //去除选中颜色
                if (arrsd) {
                    viewer.impl.selector.setSelection(selectArray, models1)
                    arrsd = false
                } else {

                    viewer.impl.selector.setSelection();
                    arrsd = true
                }
            }, 1000)
            viewer.setBackgroundColor(22, 30, 65, 22, 30, 65);
            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, _onnodeAccess);

            function _onnodeAccess() {
                viewer.hide(models0.id,  models0)
            }


            defaultView1()
                //   function defaultViewJS(x){
                //       // var cos =Math.cos(3)
                //       viewer.navigation.setRequestTransitionWithUp(true,
                //           new THREE.Vector3(150*Math.cos(x*3.14/180.0),150*Math.sin(x*3.14/180.0), 50.0),
                //           viewer.impl.scene.position, 45,
                //           new THREE.Vector3(0,0, 1),
                //           new THREE.Vector3(0,0, 1),
                //           new THREE.Vector3(0, 0, 0));
                //   }
                //   i=0;
                //   setInterval(function() {
                //     i+=0.1;
                //     defaultViewJS(i)
                //   },10)

        }
        // else{
        //   viewer.setBackgroundColor(2,7,45,2,7,45);
        // }
        viewer.setBackgroundColor(2, 7, 45, 2, 7, 45);
        //鼠标滚轮翻转
        viewer.navigation.setReverseZoomDirection(true);

    }

    function onLoadError(event) {
        console.log('fail');
    }

    function getLocationURL() {
        //获取当前的路径
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        if (webName == "") {
            return window.location.protocol + '//' + window.location.host;
        } else {
            return window.location.protocol + '//' + window.location.host + '/' + webName;
        }
    }
    //回到初始视角并焦点楼层
    function toLocalAndFit() {
        viewer.navigation.setRequestTransitionWithUp(true, new THREE.Vector3(-400.0043366824929, -270.0816380112992, 170.3020853438724), viewer.impl.scene.position, 90, new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0))
    };
    //默认视角
    function defaultView() {
        viewer.navigation.setRequestTransitionWithUp(true,
            new THREE.Vector3(-202.52365266851024, -221.13912254991624, 63.44206377761842),
            viewer.impl.scene.position, 45,
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0));
    }

    function defaultView1() {
        viewer.navigation.setRequestTransitionWithUp(true,
            new THREE.Vector3(-104.88763125535569, -130.45172167304577, 103.94665839554708),
            viewer.impl.scene.position, 45,
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0));
    }
});