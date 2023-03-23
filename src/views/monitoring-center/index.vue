<template>
    <div class="monitoring">
        <header>
            <!-- <weather1/> -->
            <div>
                <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=tv&skin=grape&color=FFFFFF&fontsize=14"
                    frameborder="0" width="150" height="25" allowtransparency="true">
                </iframe>
            </div>

            <div class="top-text">
                <img src="@/assets/images/logo-text.png" alt="">
            </div>
            <dateTime />
        </header>
        <div class="right-module">
            <rfunc />
            <!-- <roomInfo /> -->
        </div>
        
    </div>
    <div class="goback" @click="goBack">
        返回
    </div>
    <carousels ref="carousel" class="carouselModel"/>
    <!-- <SimpleKeyboard
      :ref="keyboardClass1"
      :keyboardClass="keyboardClass"
      @onChange="onChange"
      @onKeyPress="onKeyPress"
      :input="inputValue"
      :maxLength="maxlength"
    /> -->
    
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import rfunc from './r-func.vue'
// import roomInfo from './room-info.vue'
// import weather1 from "@/components/weather.vue"; //天气
import dateTime from '@/components/date-time-module.vue' //时间日期
import carousels from './carousel.vue'
// import SimpleKeyboard from '@/components/simpleKeyboard.vue';
let carousel = ref<any>(null)
const goBack = () => {
    carousel.value.showCarousel()
}
let keyboardClass1 = ref(null)
let keyboardClass = ref('znds-keybords')
let inputValue = ref('')
let maxlength = ref('')
onMounted(()=>{
    document.addEventListener('touchmove', (event)=> {
        event.preventDefault();
    },false);
    $('.monitoring').each((index, el)=> {
    el.addEventListener('touchmove', (event) => {
        event.preventDefault();
    }, false);
});
}) 

let onChange = () => {

}
let onKeyPress = () => {

}

</script>
<style lang="scss" scoped>
.monitoring {
    position: relative;
    z-index: 2;

    header {
        width: auto;
        height: 94px;
        // padding: 17px 120px 0 70px;
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 26px;
        .top-text {
            background-image: url('@/assets/images/top-bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 100%;
            flex: 1;
            margin: 0 10px;

            img {
                width: 38%;
                margin: 0 auto;
                // margin-left: 7.5%;
            }
        }
    }

    .right-module {
        position: absolute;
        right: 36px;
        top: 92px;
        display: flex;

    }
    
}
.goback {
    width: 60Px;
    height: 60Px;
    background: linear-gradient(180deg, #0FC2F6 0%, #108EDF 100%);
    box-shadow: 0px 1px 12px 2px rgba(45,133,180,0.3781);
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 60px;
    right: 40px;
    cursor: pointer;
    z-index: 9;
}
</style>