<template>
    <ul class="r-control">
        <li v-for="(item,index) in icons.data" :key="item.id" @click="controlShow(item.id,item.name)">
            <img :src="item.url" alt="">
            <p>{{ item.name }}</p>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import icon1 from '@/assets/images/floor-overview/r-icon1.png'
import icon2 from '@/assets/images/floor-overview/r-icon2.png'
import icon3 from '@/assets/images/floor-overview/r-icon3.png'
import icon4 from '@/assets/images/floor-overview/r-icon4.png'
let icons = reactive({
    data: [
        {   
            id: 1,
            name: '冲淋洗眼',
            url: icon1,
        },
        {   
            id: 2,
            name: '消防栓',
            url: icon2,
        },
        {   
            id: 3,
            name: '药箱',
            url: icon3,
        },
        {   
            id: 4,
            name: '安全出口',
            url: icon4,
        },
    ]
})

const controlShow = (param: any,name) => {
    // $("label").each(function() {
    //     if($(this).attr('data-iconclass')) {
    //         if(!arr.includes($(this).attr('data-iconclass'))) {
    //             arr.push($(this).attr('data-iconclass'))
    //         }
    //     }
    // })
    let status = $(`label[data-controlname='${name}']`).css('display')=='none' ? 'inline-block' : 'none'
    $(`label[data-controlname='${name}']`).css('display', status)
}

</script>
<style lang="scss" scoped>
.r-control {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 36px;
    right: 50px;
    cursor: pointer;
    li {
        margin-bottom: 40px;
        text-align: center;
        img {
            width: 40px;
        }
        p {
            line-height: 1;
            margin: 0;
            margin-top: 16px;
            font-size: 16px;
            color: #fff;
            font-family: 'SourceHanSansCN-Regular';
        }
    }
    
}
</style>