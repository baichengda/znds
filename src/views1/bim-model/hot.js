//热力图点位信息
let devices = []
export const wsdPos = (data) =>{
    
    devices = []
    return new Promise((resovle) => {
        var sensorPos = new Object();
        let arr= data
        for(let i=0;i<arr.length;i++){
            var threeMesh = buildComponentMesh(window['models'+window?.JDModelID?.map(item => item.modelId)?.join()], Number(arr[i]));
            var min = threeMesh.boundingBox.min;
            var max = threeMesh.boundingBox.max;
            sensorPos = new THREE.Vector3((max.x + min.x) / 2, (min.y + max.y) / 2, max.z);
            devices.push({
                id: "Sensor " + Number(i+1),
                position : sensorPos,
                // type: "combo",
                sensorTypes: ["temperature"],
                dbId: arr[i]
            })
        }
        resovle(devices)
    })
    

}


let sensorVals = [];
// for (let i = 0; i < devices.length; i++) {
//     sensorVals[i] = Math.random();
// }
let roomdata = []
let isActive = false
let dataVizExt
let realData = []
export const onModelLoaded = async function (data,controlShowOrHide) {
    // var viewer = data.target;
    if(data?.length) {
        roomdata = data
    }
    if(controlShowOrHide!=undefined) {
        isActive = controlShowOrHide
    }else{
        console.log(isActive)
        if(!isActive) return 
    }
    // isActive ? (data = roomdata) : (data = [])
    dataVizExt = await window.yst_viewer.loadExtension("Autodesk.DataVisualization");
    // const structureInfo = new Autodesk.DataVisualization.Core.ModelStructureInfo(window.models2);
    // Retrive all dbIds that compose the stadium roof.
    const it = window['models'+window?.JDModelID?.map(item => item.modelId)?.join()]?.getInstanceTree();
    const roofDbIds = [];
    let arr = data
    for(let i=0;i<arr.length;i++){
        it.enumNodeChildren(arr[i],(id) => {
                roofDbIds.push(id);
                console.log(id)
            },
            true
        );
    }
    const {
        SurfaceShadingData,
        SurfaceShadingPoint,
        SurfaceShadingNode,
    } = Autodesk.DataVisualization.Core;
    const shadingNode = new SurfaceShadingNode("Roof Panel", roofDbIds);
    devices.forEach((device) => {
        const shadingPoint = new SurfaceShadingPoint(
            device.id,
            device.position,
            device.sensorTypes,
            device.deviceCode,
            device.dbId,
            device.value,
        );
        shadingNode.addPoint(shadingPoint);
    });

    const heatmapData = new SurfaceShadingData();
    heatmapData.addChild(shadingNode);
    heatmapData.initialize(window['models'+window?.JDModelID?.map(item => item.modelId)?.join()]);
    // console.log(Autodesk.DataVisualization.Core)
    // Setup surface shading
    await dataVizExt.setupSurfaceShading(window['models'+window?.JDModelID?.map(item => item.modelId)?.join()], heatmapData);
    // dataVizExt.registerSurfaceShadingColors("co2", [0x0000FF, 0x008000,0xFFFF00, 0xFF0000]);
    dataVizExt.registerSurfaceShadingColors("temperature", [0x0000FF, 0x008000,0xFFFF00, 0xFF0000]);
    // dataVizExt.registerSurfaceShadingColors("co2", [0x0000FF, 0x008000,0xFFFF00, 0xFF0000]);
    dataVizExt.renderSurfaceShading("Roof Panel", "temperature", getSensorValue,{
            confidence: 360.0,
        });
    // dataVizExt.renderSurfaceShading("Roof Panel", "co2", getSensorValue, {
    //     confidence: 160.0,
    // });

    /**
     * Interface for application to decide the current value for the heatmap
     * @param {Object} device device
     * @param {string} sensorType sensor type
     */
    // dataVizExt.renderSurfaceShading("Roof Panel", "co2", getSensorValue);
    
    //更新点位状态
    // setInterval(() => {
        // for (let i = 0; i < devices.length; i++) {
        //     sensorVals[i] = Math.random();
        // }
        // console.log(getSensorValue)
        // updataHot()
    // }, 2000);
        
}
//热力图点位数据
const getSensorValue = (device,sensorType) => {
    return sensorVals[parseInt(device.id.slice(-1)) - 1];
}
//  export const 
export const updataHot = (data) => {
    sensorVals = data
    dataVizExt?.updateSurfaceShading(getSensorValue);
}