<template>
    <Button 
        @click.native="escFirst();first=false"
        v-show="first"
        class="first-btn">
        退出漫游
    </Button>
</template>

<script>
import { defaultView } from '@/common/bim-utils.js'
import emitter from '@/common/bus.js'
export default {
    data() {
        return {
            //控制退出漫游按钮显示隐藏
            first: false,
        }
    },
    mounted() {
        //控制第一人称退出按钮
        emitter.on("showfirstbutton", (param) => {  
            this.first = param;
            if(!param){
                defaultView()
            }
        });
    },
    methods: {
        escFirst(){  //退出第一人称
            NOP_VIEWER.setActiveNavigationTool('');
            defaultView()
            this.$EventBus.$emit('escFirstChangeIconStatus')
        },
        //t退出第一人称后调整
        // defaultView1() {
            // window.yst_viewer.autocam.goToView({
            //     position: new THREE.Vector3(
            //         -74.6484616011124,
            //         -132.02403552895515,
            //         90.71303548126126
            //     ), //!<<< 相机的新位置
            //     up: new THREE.Vector3(
            //         0.3368237225681348,
            //         0.592842387588433,
            //         0.7314968785947007
            //     ),
            //     center: new THREE.Vector3(
            //         -10.084517609892579,
            //         -20.47739332197108,
            //         -4.44536992862581
            //     ), //!<<< 相机的新焦点
            //     pivot: new THREE.Vector3(0, 0, 0), //!<<< 相机的新环绕（Orbit）中心
            //     fov: 53.13010235415598,
            //     worldUp: new THREE.Vector3(0, 0, 1),
            //     isOrtho: true,
            // });
        // },
    }
}
</script>
<style lang="scss" scoped>

</style>