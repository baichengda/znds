<template>
    <div class="instrument-query">
        <Header>
            <slot>
                <img src="@/assets/images/title-img/instrument-query.png" alt="">
            </slot>
        </Header>

        <Body @goRequestPageData="goRequestPageData" @goSearch="goSearch" :total="total" :pageSize="pageSize">
            <template v-slot:group>
                <el-carousel indicator-position="none" :autoplay="false" :arrow="carouselPage == 1 ? 'never' : 'always'">
                    <el-carousel-item v-for="item in groupData" :key="Math.random()">
                        <ul class="list">
                            <li :class="{ 'activeGroup': largeCategoryId == '' }" @click="viewAll">全部</li>
                            <li v-for="(o, index) in item" :key="o" @click="handleClickLargeCategory(o)"
                                :class="{ 'activeGroup': largeCategoryId == o }">
                                {{ o }}
                            </li>
                        </ul>
                    </el-carousel-item>
                </el-carousel>
                <ul class="child-class" v-show="isShowSubClass">
                    <button class="clear-select" @click="clearSelect">
                        清楚条件
                    </button>
                    <li 
                        v-for="child in childData"
                        :key="child"
                        :class="{ 'activeSubGroup': subClassId == child }"
                        @click="handleClickSubClass(child)">
                        {{ child }}
                    </li>
                    <li v-if="!childData.length">暂无数据</li>
                </ul>
            </template>
            <template v-slot:card>
                <div class="card" v-for="item in cardList" @click="viewDetails(item)"
                    :class="{ selectedCard: selectUserId == item.instrumentId }" :key="item.id">
                    <div class="card-t">
                        <div class="name">{{ item.instrumentName }}</div>
                        <div class="detail">详情</div>
                    </div>
                    <div class="card-b">
                        <div class="card-photo">
                            <img :src="item?.imgList?.length ? facilityManagementUrl + item.imgList[0].url : instrumentPic"
                                alt="">
                        </div>
                        <div class="card-info">
                            <ul>
                                <li>型号： {{ item.instrumentSpecifications }}</li>
                                <li>位置： {{ item.instrumentLocation }}</li>
                                <li>管理员： {{ item.instrumentAdmin }}</li>
                                <li>电话： {{ item.adminPhone }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </template>
        </Body>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref,reactive,toRef } from 'vue'
import Header from '@/components/header.vue'
import Body from '@/components/body.vue'
import { ElMessage } from 'element-plus'
import { facilityManagementApi, facilityManagementUrl } from '@/common/request.js'
import instrumentPic from '@/assets/images/placeholder/placeholder-instrument.png'
import { useRouter } from "vue-router";

const router = useRouter();
//卡片数据
let cardList = ref([]) as any

//仪器大类
const groupData = ref([{},{},{}])

//子类数据
const childData = ref([])
//是否显示子类菜单
const isShowSubClass = ref(false)

//请求列表数据参数
const pageNum = ref(1)
const pageSize = ref(12)
const keywords = ref("")
const instrumentType = ref("")
const instrumentClassify = ref("")
const total = ref(0)


//选择大类
const largeCategoryId = ref(null)
const handleClickLargeCategory = (data) => {
    // let { id } = data || {}
    largeCategoryId.value = data //增加选中状态
    isShowSubClass.value = true //显示子类菜单

    instrumentType.value = data //用于搜索字段

    getInstrumentSubClass(data) //请求子类数据

    getInstrumentInfo() //请求仪器列表数据
}
//选择子类
const subClassId = ref(null)
const handleClickSubClass = (data) => {
    // let { id } = data || {}
    subClassId.value = data //增加选中状态
    instrumentClassify.value = data //用于搜索字段

    getInstrumentInfo() //请求仪器列表数据
}

//清楚选择的子类条件
const clearSelect = () => {
    //无数据的时候不用清空
    if (!childData.value.length) return

    // 将选中的状态清除
    subClassId.value = ""

    // 清除子类选择的数据
    instrumentClassify.value = ""

    //请求全部数据
    getInstrumentInfo() //请求仪器列表数据
}

//上一页、下一页
const goRequestPageData = (currpage) => {
    pageNum.value = currpage
    getInstrumentInfo() //请求仪器列表数据
}
//搜索
const goSearch = (keyword) => {
    keywords.value = keyword || ""
    getInstrumentInfo() //请求仪器列表数据
}

//查看详情
const selectUserId = ref(null)
const viewDetails = (data) => {
    selectUserId.value = data.instrumentId
    router.push({
        path: '/instrument-details',
        query: { instrumentId: data.instrumentId }
    });

}

// 请求仪器列表数据
const getInstrumentInfo = () => {
    facilityManagementApi.post('instrument/getbyTypeAndClassifySign', {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        instrumentType: instrumentType.value,
        instrumentClassify: instrumentClassify.value,
        keyword: keywords.value
    }).then((res) => {
        let { data, code } = res.data;
        let { FmInstrument, Number } = data || {}
        if (code === 200) {
            cardList.value = FmInstrument || []
            total.value = Number || 0
        }
    }).catch((error) => {
        console.log(error);
    });
}
getInstrumentInfo()

//点击全部
const viewAll = () => {
    largeCategoryId.value = ""
    pageNum.value = 1
    pageSize.value = 12
    instrumentType.value = ""
    instrumentClassify.value = ""
    keywords.value = ""
    getInstrumentInfo()
}
//请求仪器大类
const getInstrumentLargeCategory = () => {
    facilityManagementApi.post('instrument/getTypeSign')
        .then((res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                splitLargeCategoryData(data)
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
getInstrumentLargeCategory()

//请求仪器子类
const getInstrumentSubClass = (value) => {
    let formData = new FormData()
    formData.append('instrumentType', value)
    facilityManagementApi.post('instrument/getclassifySign',formData)
        .then((res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                childData.value = data || []
            }else{
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}



const carouselPage = ref(1)
// 根据大类数据的多少分组，因为一行放不下太多，暂时9条一组，多个数据轮播
const splitLargeCategoryData = (data) => {
    let split = 9 //9条一组
    //数据多的情况下判断数据需要几页轮播
    carouselPage.value = data.length ? Math.ceil(data.length / split) : 1
    // 将多条数据根据需要分成几组
    if (carouselPage.value > 1) {
        for (let i = 0; i < carouselPage.value; i++) {
            groupData.value.push(data.slice(i * split, (i + 1) * split))
        }
    }else{
        groupData.value = ref(data) || []
    }
}


//监听点击子类模块以外的地方隐藏弹窗
document.addEventListener("click", e => {
    const contentWrap = document.getElementById("body-t-l");
    if (contentWrap) {
        if (!contentWrap.contains(e.target)) {
            isShowSubClass.value = false
        }
    }
});





</script>
<style lang="scss" scoped>
.instrument-query {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 9;
    background: #031138;
    .child-class {
        list-style: none;
        margin: 0;
        padding: 0;
        position: absolute;
        top: 70px;
        left: 0;
        background: #0A1F3B;
        border: 1px solid #53647B;
        border-radius: 8px;
        padding: 30px 28px 30px 50px;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        user-select: none;
        color: #fff;
        font-family: 'SourceHanSansCN-Regular';

        li {
            font-size: 24px;
            display: inline-block;
            margin-right: 5%;
            margin-bottom: 15px;
            cursor: pointer;

            &:last-child {
                margin-right: 0;
            }

            &.activeSubGroup {
                color: #00FFFF;
            }
        }

        .clear-select {
            // position: absolute;
            // top: 30px;
            // right: 28px;
            float: right;
            border: none;
            background: linear-gradient(180deg, #00FFFF 0%, #028EDE 100%);
            border-radius: 8px 8px 8px 8px;
            outline: none;
            padding: 0;
            width: 120px;
            height: 46px;
            line-height: 46px;
            text-align: center;
            color: #fff;
            font-size: 24px;
            font-family: 'SourceHanSansCN-Regular';
            cursor: pointer;
        }
    }
}
</style>
<style lang="scss">
/* //最外层div,修改背景色，边框 */
// .child-level-data.el-popover {
//   background-color: #0A1F3B;
//   border-color: #4a4a4b;
//   width: auto !important;
//   border-radius: 8px;
//   .child-class {
//     list-style: none;
//     margin: 0;
//     padding: 0;
//     li {
//         color: #fff;
//         font-size: 24px;
//         display: inline-block;
//         font-family: 'SourceHanSansCN-Regular';
//     }
//   }
// }
/* //修改title颜色 */
// .child-level-data .el-popover__title {
//   color: white;
// }
// /* //修改下面的小三角，属性名根据组件的placement位置做相应修改 */
// .child-level-data .popper__arrow::after {
//   border-top-color: #0A1F3B !important;
// }
// .child-level-data.is-light .el-popper__arrow::before {
//     background-color: #0A1F3B;
//     border:1px solid #4a4a4b;
// }
</style>