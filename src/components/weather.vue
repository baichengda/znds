<template>
    <div id="he-plugin-simple"></div>
</template>
<script lang="ts" setup>
import { nextTick } from 'vue'

nextTick(()=>{
    window.WIDGET = {
        "CONFIG": {
            "modules": "0234",
            "background": "5",
            "tmpColor": "333333",
            "tmpSize": "14",
            "cityColor": "333333",
            "citySize": "14",
            "aqiColor": "333333",
            "aqiSize": "14",
            "weatherIconSize": "20",
            "alertIconSize": "14",
            "padding": "10px 10px 10px 10px",
            "shadow": "1",
            "language": "auto",
            "borderRadius": "10",
            "fixed": "false",
            "vertical": "top",
            "horizontal": "left",
            // "city": "CN101120104",
            "key": "8f3d7bb78f394302916162f32694061a"
        }
    }
let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0';
document.getElementsByTagName('head')[0].appendChild(script);
})
</script>
<style lang="scss">
#he-plugin-simple {
    font-family: PingFangSC-Medium !important;
    position: relative;
    z-index: 2;
    div {
        color: #fff !important;
        &:last-child {
            display: none;
        }
    }
    .s-sticker-alarm {
        display: none;
    }
}

</style>