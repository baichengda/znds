import { update } from "lodash";

//热力图点位信息
let devices = []
export const wsdPos = (data) =>{
    return new Promise((resovle) => {
        var sensorPos = new Object();
        let arr= []
        data.forEach((item) => {
            let a = {dbId:item.dbId,deviceCode:item.devicecode}
            arr.push(a)
        })
        for(let i=0;i<arr.length;i++){
            var threeMesh = buildComponentMesh(window.models1, Number(arr[i].dbId));
            var min = threeMesh.boundingBox.min;
            var max = threeMesh.boundingBox.max;
            sensorPos = new THREE.Vector3((max.x + min.x) / 2, (min.y + max.y) / 2, max.z);
            devices.push({
                id: "Sensor " + Number(i+1),
                position : sensorPos,
                type: "combo",
                sensorTypes: ["temperature", "co2"],
                deviceCode:arr[i].deviceCode,
                dbId:arr[i].dbId
            })
        }
        resovle(devices)
    })
    

}


let sensorVals = [];
for (let i = 0; i < devices.length; i++) {
    sensorVals[i] = Math.random();
}
export const onModelLoaded = async function (data) {
    
    // var viewer = data.target;
    const dataVizExt = await window.yst_viewer.loadExtension("Autodesk.DataVisualization");
    // Retrive all dbIds that compose the stadium roof.
    const it = window.models1.getInstanceTree();
    const roofDbIds = [];
    let arr = data
    for(let i=0;i<arr.length;i++){
        it.enumNodeChildren(arr[i],(id) => {
                roofDbIds.push(id);
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
        );
        shadingNode.addPoint(shadingPoint);
    });

    const heatmapData = new SurfaceShadingData();
    heatmapData.addChild(shadingNode);
    heatmapData.initialize(window.models1);
    // Setup surface shading
    await dataVizExt.setupSurfaceShading(window.models1, heatmapData);

    // dataVizExt.registerSurfaceShadingColors("co2", [0xFF0000, 0x800080]);
    dataVizExt.registerSurfaceShadingColors("co2", [0x0000FF, 0x008000,0xFFFF00, 0xFF0000],0.5);
    /**
     * Interface for application to decide the current value for the heatmap
     * @param {Object} device device
     * @param {string} sensorType sensor type
     */
    dataVizExt.renderSurfaceShading("Roof Panel", "co2", getSensorValue);

    //更新点位状态
    setInterval(() => {
        for (let i = 0; i < devices.length; i++) {
            sensorVals[i] = Math.random();
        }
        dataVizExt.updateSurfaceShading(getSensorValue);
    }, 2000);
        
}
//热力图点位数据
const getSensorValue = (device) => {
    return sensorVals[parseInt(device.id.slice(-1)) - 1];
}
