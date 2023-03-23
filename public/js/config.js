var JHCYW = {
    //是否加载模型
    isloadSvf: true,
    //是否开启弹窗
    isinfowindow: true,
    viewer_opts: {
        extensions: [
            "Autodesk.Viewing.ZoomWindow"
        ],
        disabledExtensions: {
            measure: false,
            section: false,
        },
        memory: {
            limit: 32 * 1024    //32 GB
        }
    },

    //地面以上的模型  直接输入楼栋序号  地面以下的模型  单个地下模型由两个模型组成：机电模型和 建筑及结构合并模型
    models_urls:["SQ"],
    models_obj:[],
    totalSrc:window.Path,
};
