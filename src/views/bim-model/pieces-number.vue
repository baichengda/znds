<template>
    <div class="gj-number" v-show="numberPiecesVisible">
        <div v-show="JZ_NUM" class="component-number">
            <span>建筑构件数：</span>
            <span class="JZ_NUM">{{ JZ_NUM }}</span>
        </div>
        <div v-show="JG_NUM" class="component-number">
            <span>结构构件数：</span>
            <span class="JG_NUM">{{ JG_NUM }}</span>
        </div>
        <div v-show="JD_NUM" class="component-number">
            <span>机电构件数：</span>
            <span class="JD_NUM">{{ JD_NUM }}</span>
        </div>
        <div v-show="NZ_NUM" class="component-number">
            <span>内装构件数：</span>
            <span class="ZS_NUM">{{ NZ_NUM }}</span>
        </div>
        <div v-show="MQ_NUM" class="component-number">
            <span>幕墙构件数：</span>
            <span class="MQ_NUM">{{ MQ_NUM }}</span>
        </div>
        <div v-show="QZY_NUM" class="component-number">
            <span>全专业构件数：</span>
            <span class="QZY_NUM">{{ QZY_NUM }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            numberPiecesVisible: false, //构件数模块
            JZ_NUM: "",
            JD_NUM: "",
            JG_NUM: "",
            NZ_NUM: "",
            MQ_NUM: "",
            QZY_NUM: "",
            eventArr: [
                {"jgCount":"JG_NUM"},
                {"jzCount":"JZ_NUM"},
                {"jdCount":"JD_NUM"},
                {"nzCount":"NZ_NUM"},
                {"mqCount":"MQ_NUM"},
                {"qzyCount":"QZY_NUM"}
            ]
        }
    },
    watch: {
        $route: "routerChange"
    },
    mounted() {
        this.routerChange()

        //上传完成监听模型成功回调
        this.eventArr.forEach(ele => {
            let eventName = Object.keys(ele)[0]
            window.addEventListener(
                eventName,
                function (e) {
                    this[ele[eventName]] = e.detail;
                },
                false
            );
        });
    },
    methods: {
        //控制构件模块显示隐藏
        routerChange() {
            if(this.$route.name == "modelConnection") {
                this.numberPiecesVisible = true
            }else {
                this.numberPiecesVisible = false
            }
        },
        //获取构件数
        getModelsObjectNum(modeldata) {
            let models = modeldata
            for (var y = 0; y < models.length; y++) {
                var str = models[y].loader.basePath;
                let urlArr = str.split("/");
                let modelType = urlArr[3]
                // let modelType = (urlArr[urlArr.length-2])?.toUpperCase();
                if (modelType) {
                    switch (true) {
                        case str.includes("ARC"):
                            this.JZ_NUM = models[y].getData().instanceTree?.objectCount - 1;
                            break;
                        case str.includes("MEP"):
                            this.JD_NUM = models[y].getData().instanceTree?.objectCount - 1;
                            break;
                        case str.includes("jg"):
                            break;
                        case str.includes("nz"):
                            break;
                        case str.includes("mq"):
                            break;
                        case str.includes("qzy"):
                            break;
                    }
                    // this[`${modelType}_NUM`] = models[y].getData().instanceTree.objectCount - 1;
                }
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
.gj-number {
    position: absolute;
    bottom: 100px;
    right: 5%;
    z-index: 4;
    padding-left: 25px;
}
.gj-number span {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #2c3d4e;
    text-align: center;
}
</style>