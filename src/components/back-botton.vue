
<template>
    <div class="goback" @click="goBack">
        返回
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter();
const goBack = () => {
    if(router.currentRoute.value.name==='personnelDetails' || router.currentRoute.value.name==='instrumentDetails') {
        router.go(-1);
    }else{
        router.push({
            path: '/screen-saver',
            query: { }
        });
    }
}
</script>
<style lang="scss" scoped>
.goback {
    width: 60px;
    height: 60px;
    background: linear-gradient(180deg, #0FC2F6 0%, #108EDF 100%);
    box-shadow: 0px 1px 12px 2px rgba(45,133,180,0.3781);
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
}
</style>