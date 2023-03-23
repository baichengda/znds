<template>
    <div>
        <ul class="viewer-menu click-exclude">
            <li class="viewer-menu-item click-exclude" @click="viewDevInfo">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/device-info-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/device-info.png'" alt="">
                <p class="click-exclude">设备信息</p>
            </li>
            <!-- <li class="viewer-menu-item click-exclude" @click="goRepair">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/go-repair-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/go-repair.png'" alt="">
                <p class="click-exclude">我要报修</p>
            </li> -->
            
            <!-- <li class="viewer-menu-item click-exclude">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/report-details-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/report-details.png'" alt="">
                <p class="click-exclude">报修详情</p>
            </li>
            
            <li class="viewer-menu-item click-exclude">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/alarm-reset-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/alarm-reset.png'" alt="">
                <p class="click-exclude">报警复位</p>
            </li>
            <li class="viewer-menu-item click-exclude">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/transfer-floor-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/transfer-floor.png'" alt="">
                <p class="click-exclude">转至楼层</p>
            </li> -->
            <li class="viewer-menu-item click-exclude" @click="go2dConfig">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/go-repair-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/go-repair.png'" alt="">
                <p class="click-exclude">二维组态</p>
            </li>
            <li class="viewer-menu-item click-exclude" @click="goLabelConfig" v-show="$route.name=='modelConnection'">
                <img class="menu-img click-exclude" v-if="$route.name=='modelConnection'" :src="publicPath+'img/label-config-light.png'" alt="">
                <img class="menu-img click-exclude" v-else :src="publicPath+'img/label-config.png'" alt="">
                <p class="click-exclude">标签配置</p>
            </li>
        </ul>
        <EquipmentInformation />
        <RepairApplication />
        <labelConfig />
    </div>
</template>

<script>
    import EquipmentInformation from "@/views/monitoring-center/equipment-information.vue" //设备信息
    import RepairApplication from"@/views/monitoring-center/repair-application.vue" //设备报修
    import labelConfig from"@/views/configuration/model-connection/lable-configuration.vue" //设备报修
    
    export default {
        data () {
            return {
                viewerLocal: null,
                selectDbid: null,
                modelId: null,
                canvasX: null,
                canvasY: null
            };
        },
        components: {
            EquipmentInformation,
            RepairApplication,
            labelConfig,
        },
        mounted() {
            //监听点击模型事件获取dbid，判断是否显示右键菜单
            this.$EventBus.$on('handleSingleClick', opt => {
                //点击模型前先判断有没有显示着，如果显示就需要隐藏
                if(document.querySelector('.viewer-menu') && document.querySelector('.viewer-menu').className.includes('menu-show')) this.hideMenu();
                let { dbId,modelId } = opt
                this.selectDbid = dbId
                this.modelId = modelId
            })
            //监听右键事件
            this.$nextTick(() => {
                this.viewerLocal = document.querySelector('#viewer-local')
                this.viewerLocal.addEventListener('contextmenu', this.onContextMenu, false);
            })
        },
        computed: {

        },
        methods: {
            //打开菜单
            showMenu(x, y){
                var menu = document.querySelector('.viewer-menu');
                menu.style.left = x + 'px';
                menu.style.top = y + 'px';
                menu.classList.add('menu-show');
            },
            //隐藏菜单
            hideMenu(){
                var menu = document.querySelector('.viewer-menu');
                menu.classList.remove('menu-show');
            },
            //事件入口
            onContextMenu(e){
                //查看有没有被选中的构件，没有就不执行
                let select = window.yst_viewer.getAggregateSelection()
                if (!select.length) return this.selectDbid = null
                
                e.preventDefault();
                this.showMenu(e.offsetX, e.offsetY);
                document.addEventListener('mousedown', this.onMouseDown, false);
            },
            //鼠标点击事件
            onMouseDown(e){
                // 排除自己
                if(e.target.className.includes('click-exclude')) return
                this.hideMenu()
                document.removeEventListener('mousedown', this.onMouseDown);
            },
            //设备信息
            viewDevInfo() {
                this.$EventBus.$emit("rightmenu", {
                    dbid: this.selectDbid,
                    modelId: this.modelId
                });
            },
            //我要报修
            goRepair() {
                this.$EventBus.$emit("repairModel", {
                    dbid: this.selectDbid,
                });
            },
            //标签配置
            goLabelConfig() {
                this.$EventBus.$emit("labelCofig", {
                    dbid: this.selectDbid,modelId:this.modelId
                });
            },
            //二维组态
            go2dConfig() {
                this.$EventBus.$emit('2dConfig')
            }
        },
    }
</script>

<style lang='scss' scoped>
@import '@/assets/css/layout.scss';
/* Menu */

.viewer-menu {
    position: absolute;
    width: auto;
    min-width: 130Px;
    padding: 12Px 4Px;
    @include theme_color($theme-color1);
    // background: rgba(3, 19, 64, 0.8);
    z-index: 100;
    border-radius: 6px;
    // box-shadow: 0 0 8px 0 rgba(0, 143, 255, 60%);
    opacity: 0;
    transform: translate(0, 15px) scale(.95);
    transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    pointer-events: none;
}

.viewer-menu-item {
    display: flex;
    align-items: center;
    padding: 4Px 10Px;
    cursor: pointer;
    img {
        width: 20Px;
        margin-right: 6Px;
    }
    p {
        // color: #fff;
        @include font_color2($font-color3);
    }
    // justify-content: center;
}

.viewer-menu-item:hover { 
    color: #fff; 
    outline: none; 
    background-color: #00bcff;
    border-radius: 4Px;
}

.menu-item-disabled {
    opacity: .5;
    pointer-events: none;
}


.menu-item-submenu::after {
    content: "";
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left-color: #808080; 
}

.menu-item-submenu:hover::after {
    border-left-color: #fff;
}

.menu .menu {
    top: 4px;
    left: 99%;
}

.menu-show,
.viewer-menu-item:hover > .menu {
    opacity: 1;
    transform: translate(0, 0) scale(1);
    pointer-events: auto;
}

.viewer-menu-item:hover > .menu {
    transition-delay: 300ms;
}
</style>