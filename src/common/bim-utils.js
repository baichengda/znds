import emitter from '@/common/mybus.ts'
import { ElMessage } from 'element-plus'


//默认视角
export function defaultView(viewer, data, e) {
    try {
        if (!e) {
            window.yst_viewer = viewer || window.yst_viewer
            window?.yst_viewer?.clearSelection()
            window?.yst_viewer?.autocam?.goToView({
                position: new THREE.Vector3(
                    data.camera.position.x, data.camera.position.y, data.camera.position.z, //camera.position
                ), //!<<< 相机的新位置
                up: new THREE.Vector3(//target.autocamCamera.up
                    data.target.autocamCamera.up.x,
                    data.target.autocamCamera.up.y,
                    data.target.autocamCamera.up.z
                ),
                center: new THREE.Vector3(  //target.autocam.center
                    data.target.autocam.center.x,
                    data.target.autocam.center.y,
                    data.target.autocam.center.z
                ), //!<<< 相机的新焦点
                pivot: new THREE.Vector3(0, 0, 0), //!<<< 相机的新环绕（Orbit）中心
                fov: 53.13010235415598,
                worldUp: new THREE.Vector3(0, 0, 1),
                isOrtho: true,
            });
        } else {
            window.yst_viewer = viewer || window.yst_viewer
            window?.yst_viewer?.clearSelection()
            window?.yst_viewer?.autocam?.goToView({
                position: new THREE.Vector3(
                    data.posX, data.posY, data.posZ, //camera.position
                ), //!<<< 相机的新位置
                up: new THREE.Vector3(//target.autocamCamera.up
                    data.upX,
                    data.upY,
                    data.upZ
                ),
                center: new THREE.Vector3(  //target.autocam.center
                    data.centerX,
                    data.centerY,
                    data.centerZ
                ), //!<<< 相机的新焦点
                pivot: new THREE.Vector3(0, 0, 0), //!<<< 相机的新环绕（Orbit）中心
                fov: 53.13010235415598,
                worldUp: new THREE.Vector3(0, 0, 1),
                isOrtho: true,
            });
        }
    } catch (err) {

    }

}

//隐藏房间遮罩
export function goHideRoomMask() {
    //获取建筑模型数据，以及dbid并隐藏房间
    let modelcount = window.yst_viewer?.impl.modelQueue().getModels();
    // setTimeout(()=>{
    // console.log(window['models' + 1].getInstanceTree)
    modelcount.forEach((model) => {
        let getJZData = buildModelTree(model).children || [];
        let roomData = getJZData?.filter(item => item.name === "房间")
        // roomData[0].children.forEach(ele => {
        //     let arr = JSON.parse(JSON.stringify([ele.dbId]));
        //     window.yst_viewer?.impl?.visibilityManager.hide(arr,window.JZmodels);
        // });
        // console.log(window['models' + 1])
        // console.log(roomData)
        window.yst_viewer?.impl?.visibilityManager.hide(roomData.children, model);
        if (roomData.length) {
            roomData[0].children.forEach(item => {
                model.visibilityManager.setNodeOff(item.dbId, true);//使用此方法将构件彻底隐藏，但切换页面显示所有时需要单独再将其设置为false，才能显示
            })
        }
    })
    // }, 5000)
}

//遍历模型获取房间名获取模型结构信息
export function buildModelTree(model) {
    //builds model tree recursively
    function _buildModelTreeRec(node) {
        it?.enumNodeChildren(node.dbId, function (childId) {
            node.children = node.children || [];
            var childNode = {
                dbId: childId,
                name: it?.getNodeName(childId)
            };
            node.children.push(childNode);
            _buildModelTreeRec(childNode);
        });
    }
    //get model instance tree and root component
    var it = model?.getData()?.instanceTree;
    var rootId = it?.getRootId();
    var rootNode = {
        dbId: rootId,
        name: it?.getNodeName(rootId)
    };
    _buildModelTreeRec(rootNode);
    return rootNode;
}
//前往房间内部
export function goRoom(viewer, JZmodels, dbid) {
    var sensorPos = new Object();
    // this.viewer.select([Number(dbid)]);
    var threeMesh = buildComponentMesh(JZmodels, Number(dbid));
    sensorPos.x =
        (threeMesh.boundingBox.max.x + threeMesh.boundingBox.min.x) / 2;
    sensorPos.y =
        (threeMesh.boundingBox.max.y + threeMesh.boundingBox.min.y) / 2;
    sensorPos.z =
        (threeMesh.boundingBox.max.z + threeMesh.boundingBox.min.z) / 2;
    //重新设置相机的位置
    //注意camera up vector 的方向，还有跟right vector的关系，以及pivot的位置
    viewer.navigation.setRequestTransitionWithUp(
        true,
        new THREE.Vector3(
            sensorPos.x + 4,
            sensorPos.y + 4,
            sensorPos.z
        ),
        new THREE.Vector3(sensorPos.x, sensorPos.y, sensorPos.z),
        45,
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0)
    );
    viewer.navigation.setPivotPoint(true); //更新到pivot
    viewer.setActiveNavigationTool("bimwalk");
    window.selectDbid = false;
    emitter.emit("showfirstbutton", true);//进入第一人称视角后，显示退出按钮。
}
//删除模型
export function deleteModel(viewer, param) {
    // var aa = 0;
    var data = JSON.parse(JSON.stringify(param));
    var modelcount = viewer.impl.modelQueue().getModels();
    for (var j = 0; j < data.length; j++) {
        for (var n = 0; n < modelcount.length; n++) {
            var str = modelcount[n].loader.basePath;
            var test = data[j].url;
            let appData = sessionStorage.getItem("appData")
            var modelPath = str.split(appData.portURL)[1];

            const pattern = /[`~!@#$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g;
            modelPath = modelPath.replace(pattern, "");
            test = test.replace(pattern, "");
            if (test == modelPath) {
                viewer.impl.unloadModel(modelcount[n]);
                if (
                    viewer.impl.modelQueue().getModels().length < 1
                ) {
                    $("#viewer-local").css("z-index", "-1");
                }
            }
        }
    }
    ElMessage.success('删除成功!');
}

/* ----
*   剖切模型
*   modelId: 模型类型
*   bottom: 剖切底
*   top: 剖切顶
*   routerName: 因为模型需要根据路由切换展示不同的形态
*/
export function cutPlanModel(modelId, bottom, top, roomDbids, sname, routerName = "xxx") {
    if (!bottom || !top || !window['models' + modelId]) return
    let top1 = (top - 800) * 0.0032808;
    let bottom1 = bottom * 0.0032808;
    roomDbids && roomDbids.forEach(item => {
        window['models' + modelId].visibilityManager.setNodeOff(item.dbId, true);//使用此方法将构件彻底隐藏，但切换页面显示所有时需要单独再将其设置为false，才能显示
    })
    // showAllModel() //剖切前显示所有模型
    let GobalOffset1 = window['models' + modelId]?.getData().globalOffset;
    let z1 = bottom1 - GobalOffset1.z;
    let GobalOffset2 = window['models' + modelId]?.getData().globalOffset;
    let z2 = top1 - GobalOffset2.z;
    let planes = [...[new THREE.Vector4(0, 0, -1, z1)], ...[new THREE.Vector4(0, 0, 1, -(z2))]];
    // planes.push(new THREE.Vector4(0, 0, -1, z1));
    // planes.push(new THREE.Vector4(0, 0, 1, -(z2)));
    window.createMyOwnPlane(window.yst_viewer.impl, planes, 'XX');

}

/* 显示所有模型 */
export function showAllModel() {
    window?.yst_viewer?.clearSelection()
    let visibleModels = window.yst_viewer?.getVisibleModels() || []
    let hiddenModels = window.yst_viewer?.getHiddenModels() || []
    let allModels = [...visibleModels, ...hiddenModels]
    // allModels.forEach(model => {
    //     // window?.yst_viewer?.showModel(model)
    //     model.setAllVisibility(true)
    //     var instanceTree = model.getData().instanceTree.nodeAccess.dbIdToIndex;
    //     let arr = [];
    //     for (var key in instanceTree) {
    //         arr.push(Number(key))
    //     }
    //     arr.forEach(item => {
    //         model.visibilityManager.setNodeOff(item, false);//使用此方法将构件彻底隐藏，单独再将其设置为true，才能隐藏
    //     })
    // })
    allModels.forEach(model => {
        model.setAllVisibility(true);
    })
    hiddenModels.forEach((model) => {
        window?.yst_viewer?.showModel(model)
    })
    //恢复isolate
    window.yst_viewer?.impl?.visibilityManager.isolate([])
    //清除剖切面
    clearCutPlane()
    //恢复默认视角
    // defaultView()
    //隐藏房间
    setTimeout(() => {
        goHideRoomMask()
    }, 10)

}

//清除剖切面
export function clearCutPlane() {
    if (window?.yst_viewer?.getCutPlanes().length) {
        window.createMyOwnPlane(window.yst_viewer.impl, [], 'homeIndex');
    }
}

// 设置模型透明度
export function setModelOpacity() {
    // if(!window?.yst_viewer) return
    window.yst_viewer?.clearSelection()
    if (!window.yst_viewer) return
    window.yst_viewer.impl.setGhostingBrightness = function (
        darkerFade
    ) {
        if (darkerFade) {
            // this.fadeMaterial.color = new THREE.Color(0x101010);
            this.fadeMaterial.color = new THREE.Color("#00BCFF");
            //ghost 透明度
            this.fadeMaterial.opacity = 0.03;
        } else {
            this.fadeMaterial.color = new THREE.Color(0x00BCFF);
            this.fadeMaterial.opacity = 0.03;
        }
        this.fadeMaterial.needsUpdate = true;
    };
    window?.yst_viewer?.impl?.setGhostingBrightness(true);
}
//模型拉近
export function goFitToView(dbIds, modelId) {
    if (!dbIds.length || !modelId) {
        window.yst_viewer?.fitToView()
    } else {
        window.yst_viewer?.fitToView(dbIds, window['models' + modelId]);
    }
}

//选中构件
export function selectModelArtifacts(dbids, modelId) {
    if (!window['models' + modelId]) return

    let modelArr = window?.yst_viewer.impl.modelQueue().getModels()
    if (modelArr.length === 1) {
        window.yst_viewer.select(dbids)
    } else if (modelArr.length > 1) {
        window.yst_viewer?.impl.selector.setSelection(
            dbids,
            window['models' + modelId]
        );
    }
}

//隐藏除当前类型模型外其他模型
export function hideOtherModal(modelId, dbIds) {
    if (!window['models' + modelId]) return
    var models = window.yst_viewer.impl.modelQueue().getModels();
    models.forEach(model => {
        if (model.id === window['models' + modelId].id) {
            window.yst_viewer?.impl?.visibilityManager.isolate(
                dbIds,
                window['models' + modelId]
            );
            //拉近模型
            // goFitToView(dbIds, modelId)
        } else {
            model.setAllVisibility(false);
            // window.yst_viewer?.hideModel(model)
        }
    })
}