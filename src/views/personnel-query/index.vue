<template>
    <div class="personnel-query" id="personnelQuery">
        <Header>
            <slot>
                <img src="@/assets/images/title-img/personnel-query.png" alt="">
            </slot>
        </Header>
        <Body @goRequestPageData="goRequestPageData" @goSearch="goSearch" :pageCount="pageCount" :pageNum="pageNum">
            <template v-slot:group>
                <el-carousel indicator-position="none" :autoplay="false" :arrow="carouselPage == 1 ? 'never' : 'always'">
                    <el-carousel-item v-for="(item,index) in carouselPage" :key="index">
                        <ul class="list">
                            <li :class="{'activeGroup':selectGroupId==''}" @click="viewAll">全部</li>
                            <li 
                                v-for="(o, i) in groupData.data[index]" 
                                :key="o.id" 
                                @click="handleClickGroup(o)"
                                :class="{'activeGroup':selectGroupId==o.id}">
                                {{ o.name }}
                            </li>
                        </ul>
                    </el-carousel-item>
                </el-carousel>
            </template>
            <template v-slot:card>
                <div 
                class="card" 
                v-for="item in cardList" 
                @click="viewDetails(item)"
                :class="{selectedCard:selectUserId==item.user.id}"
                :key="item.user.id">
                    <div class="card-t">
                        <div class="name">{{ item.user.name }}</div>
                        <div class="detail">详情</div>
                    </div>
                    <div class="card-b">
                        <div class="card-photo">
                            <img :src="item.user.personalPhoto ? userManagementUrl+item.user.personalPhoto : personPic" alt="">
                        </div>
                        <div class="card-info">
                            <ul>
                                <li>部门： {{ item.groupNameList.join(',') }}</li>
                                <li>职务： {{ item.user.position }}</li>
                                <li>电话： {{ item.user.phone }}</li>
                                <li>当前位置： {{ item.user.location }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </template>
            
        </Body>
    </div>
    <!-- <div class="goback" @click="goBack">
        返回
    </div> -->
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import Header from '@/components/header.vue'
import Body from '@/components/body.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";
import { userManagementApi, userManagementUrl } from '@/common/request.js'
import personPic from '@/assets/images/placeholder/placeholder-person.png'

const router = useRouter();
let cardList = ref([])

//组数据
const groupData = reactive({
    data:[]
})

//请求列表数据参数
const pageNum = ref('1')
const pageSize = ref('12')
const keywords = ref("")
const total = ref(0)
const pageCount = ref('')
//选择组织
const selectGroupId = ref("")
const handleClickGroup = (data) => {
    let { id } = data || {}
    selectGroupId.value = id
    getPersonInfo()
}
//点击全部
const viewAll = () => {
    selectGroupId.value = ""
    pageNum.value = '1'
    pageSize.value = '12'
    keywords.value = ""
    selectUserId.value = ""
    getPersonInfo()
}

//上一页、下一页
const goRequestPageData = (currpage) => {
    pageNum.value = currpage
    getPersonInfo() //请求人员列表数据
}


//搜索
const goSearch = (keyword) => {
    keywords.value = keyword || ""
    getPersonInfo() //请求人员列表数据
}

//查看详情
const selectUserId = ref(null)
const viewDetails = (data) => {
    selectUserId.value = data.user.id
    router.push({
        path: '/personnel-details',
        query: { 
            userId: data.user.id,
            phone:  data.user.phone
        }
    });
}

//请求组织
const getGroupData = () => {
    userManagementApi.post('userGroup/selectOrganizationTree')
        .then((res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                let arr=[]
                data.forEach(element => {
                    if(element.children.length) {
                        arr.push(...arr,...element.children)
                    }
                });
                splitLargeCategoryData(arr)
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
getGroupData()

//请求人员
const getPersonInfo = () => {
    let data = new FormData();
    data.append("groupId", selectGroupId.value);
    data.append("pageSize", pageSize.value);
    data.append("pageNum", pageNum.value);
    data.append("keyWord", keywords.value);
    userManagementApi.post('userGroup/getUserListByGroupIdInPage',data)
        .then((res) => {
            let { data, code, message } = res.data
            if (code === 200) {
                cardList.value = data.data || []
                pageCount.value = data.pageCount || 1
                pageNum.value = data.pageNum || 1
            } else {
                ElMessage.error(message)
            }
        })
        .catch((error) => {
            console.log('error');
        });
}
getPersonInfo()
const carouselPage = ref(1)
// 根据大类数据的多少分组，因为一行放不下太多，暂时9条一组，多个数据轮播
const splitLargeCategoryData = (data) => {
    let split = 9 //9条一组
    //数据多的情况下判断数据需要几页轮播
    carouselPage.value = data.length ? Math.ceil(data.length / split) : 1
    // 将多条数据根据需要分成几组
    if (carouselPage.value > 1) {
        for (let i = 0; i < carouselPage.value; i++) {
            groupData.data.push(data.slice(i * split, (i + 1) * split))
        }
    }else{
        groupData.data = [data]
    }
}


</script>
<style lang="scss" scoped>
.personnel-query {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 9;
    background: #031138;
}
</style>