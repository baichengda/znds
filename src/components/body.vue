<template>
    <div class="website-body">
        <div class="body-t">
            <div class="body-t-l" id="body-t-l">
                <slot name="group"></slot>
                <!-- <el-carousel indicator-position="none" :autoplay="false" :arrow="carouselPage == 1 ? 'never' : 'always'">
                    <el-carousel-item v-for="item in groupData" :key="item">
                        <ul>
                            <li v-for="(o, index) in item" :key="index" @click="handleClickGroup()">{{ o.name }}</li>
                        </ul>
                    </el-carousel-item>
                </el-carousel> -->
            </div>
            <div class="body-t-r" id="body-t-r">
                <el-input v-model="firstInitial" @focus="inputFocus" size="large" placeholder="请输入姓名首拼音">
                    <template #suffix>
                        <el-icon class="el-input__icon" @click.native="handleSearch"><search /></el-icon>
                    </template>
                </el-input>
                <ul class="keyboard" id="keyboard" v-show="isFocus">
                    <li 
                        v-for="item in keyboardLetters" 
                        :key="item" 
                        @click="handleClickKeyboard(item)"
                        :class="activeInitial===item ? 'active':''">
                        <span>{{item}}</span>
                    </li>
                    <li @click="handleDelete">
                        <img v-show="!isClickDelect" src="@/assets/images/delete-letter.png" alt="">
                        <img v-show="isClickDelect" src="@/assets/images/delete-letter1.png" alt="">
                    </li>
                </ul>
            </div>
        </div>
        <div class="body-m" id="bodyM">
            <slot name="card"></slot>
            <!-- <template v-for="a in 10">
                <div class="card" v-for="item in cardList">
                    <div class="card-t">
                        <div class="name">{{ item.user.name }}</div>
                        <div class="detail">详情</div>
                    </div>
                    <div class="card-b">
                        <div class="card-photo">
                            <img :src="item.user.personalPhoto" alt="">
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

            </template> -->
        </div>
        <div class="body-b">
            <div class="progress">
                <el-slider v-model="currPage" :min="1" :max="totalPage" :step="1" />
                <span class="page-info">{{currPage}}/{{ totalPage }}</span>
            </div>
            <backButton />
            <div class="change-page">
                <button @click="prePage">上一页</button>
                <button @click="nextPage">下一页</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import backButton from '@/components/back-botton.vue'
import { ElMessage } from 'element-plus';
const props = defineProps({
    total: {
        type: Number,
        default: 1
    },
    // pageSize: {
    //     type: Number,
    //     default: 1
    // },
    pageCount: {
        type: Number
    }
})

watch(
    () => props.total,
    (val) => {
        // let { total } = val
        totalPage.value = val>0 ? Math.ceil(val / 12) : 1
    }
);
watch(
    () => props.pageCount,
    (val) => {
        totalPage.value = val
    }
);
// watch(
//     () => props.pageSize,
//     (val) => {
//         open.value = val;
//     }
// );


//组数据
// const groupList = ref([
//     { name: '全部' },
//     { name: '有机组' },
//     { name: '无机组' },
//     { name: '电镜组' },
//     { name: '痕量组' },
//     { name: '质量办' },
//     { name: '综合办' },
//     { name: '综合办' },
//     { name: '综合办' },
//     { name: '综合办' },
//     { name: '综合办' },
// ])

// const groupData = ref([])
// //判断数据需要几页
// const carouselPage = groupList.value.length ? Math.ceil(groupList.value.length / 8) : 1
// // 将多条数据根据需要分成几组
// let split = 9 //9条一组
// if (carouselPage > 1) {
//     for (let i = 0; i < carouselPage; i++) {
//         groupData.value.push(groupList.value.slice(i * split, (i + 1) * split))
//     }
// }

// 搜索
const firstInitial = ref('')
const activeInitial = ref('')
const isFocus = ref(false)
let timer = null
//键盘字母
const keyboardLetters= ref([
    "A","B","C","D","E",
    "F","G","H","I","J",
    "K","L","M","N","O",
    "P","Q","R","S","T",
    "U","V","W","X","Y",
    "Z"
])
//点击键盘
const handleClickKeyboard = (item) => {
    firstInitial.value+=item
    activeInitial.value = item
    window.clearTimeout(timer)
    timer = setTimeout(() => {
        activeInitial.value = ''
    },150)
}

//删除input中的内容
let isClickDelect = ref(false)
let timerDelete = null
const handleDelete = () => {
    firstInitial.value = firstInitial.value.slice(0,-1)
    isClickDelect.value = !isClickDelect.value
    window.clearTimeout(timerDelete)
    timerDelete = setTimeout(() => {
        isClickDelect.value = false
    },150)
}

//输入框失去焦点
// const inputBlur = () => {
//     isFocus.value = false
// }
// //输入框获取焦点
const inputFocus = (e) => {
    isFocus.value = true
}
const emit = defineEmits(["goRequestPageData","goSearch"])
//点击搜索按钮
const handleSearch =() => {
    isFocus.value = false
    emit("goSearch",firstInitial.value)
    
}

//监听输入框数据变化
watch(firstInitial,(newValue) => {
    emit("goSearch",newValue)
})
//监听点击输入框模块以外的地方隐藏弹窗
document.addEventListener("click", e => {
    const contentWrap = document.getElementById("body-t-r");
    if (contentWrap) {
        if (!contentWrap.contains(e.target)) {
            isFocus.value = false
        }
    }
});





//滑动条bar第几页数据
const currPage = ref(1)
const totalPage = ref(1)
//上一页
const prePage = () => {
    if(currPage.value<=1) {
        currPage.value=1
        return ElMessage({
            message: '已经是第一页了哦',
            type: 'warning',
        })
    }else{
        currPage.value--
    }
    // emit("goRequestPageData",currPage.value)
}
//下一页
const nextPage = () => {
    if(currPage.value>=totalPage.value) {
        currPage.value = totalPage.value
        return ElMessage({
            message: '已经是最后一页了哦',
            type: 'warning',
        })
    }else{
        currPage.value++
    }
    // emit("goRequestPageData",currPage.value)
    
}
//滑动滑块翻页
// const sliderChange = (data) => {
//     // console.log(data)
//     currPage.value = data
//     emit("goRequestPageData",currPage.value)
// }
//监听滑块数值变化，请求对应页数据
watch(currPage,(newValue) => {
    currPage.value = newValue || 1
    emit("goRequestPageData",currPage.value)
})
onMounted(() => {
    
})


</script>
<style lang="scss">
.website-body {
    height: calc(100% - 76px);
    box-sizing: border-box;
    padding: 35px 50px 25px;

    .body-t {
        height: 54px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .body-t-l {
            height: 100%;
            background: #0A1F3B;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.302);
            border-radius: 8px;
            width: 74.34%;
            position: relative;
            .el-carousel {
                height: 100%;

                .el-carousel__arrow--left {
                    left: 0;
                }

                .el-carousel__arrow--right {
                    right: 0;
                }
            }

            .el-carousel__item h3 {
                display: flex;
                color: #475669;
                opacity: 0.75;
                line-height: 300px;
                margin: 0;
            }

            .el-carousel__container {
                height: 100%;
            }

            .el-carousel__item:nth-child(2n) {
                background-color: transparent;
            }

            .el-carousel__item:nth-child(2n + 1) {
                background-color: transparent;
            }

            .list {
                list-style: none;
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
                white-space: nowrap;
                text-align: left;
                overflow-x: auto;
                overflow-y: hidden;
                user-select: none;
                li {
                    color: #fff;
                    font-size: 24px;
                    font-family: 'SourceHanSansCN-Regular';
                    margin-left: 5%;
                    display: inline-block;
                    height: 100%;
                    line-height: 54px;
                    width: auto;
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    &:first-child {
                        margin-left: 50px;
                    }
                    &.activeGroup {
                        color: #00FFFF;
                    }
                }

                &::-webkit-scrollbar {
                    width: 2px;
                    /*对垂直流动条有效*/
                    height: 3px;
                    /*对水平流动条有效*/
                    cursor: pointer;
                }

                /*定义滑块颜色、内阴影及圆角*/
                &::-webkit-scrollbar-thumb {
                    border-radius: 7px;
                    // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
                    background-color: rgb(152, 154, 156);
                }

                /*定义两端按钮的样式*/
                &::-webkit-scrollbar-button {
                    background-color: transparent;
                }
            }
        }

        .body-t-r {
            height: 100%;
            width: 23.08%;
            background: #0A1F3B;
            position: relative;
            .keyboard {
                position: absolute;
                top: 74px;
                left: 0;
                width: 100%;
                background: #0A1F3B;
                padding: 20px 15px;
                color: #fff;
                font-weight: 700;
                font-size: 32px;
                font-family: 'SourceHanSansCN-Bold';
                box-sizing: border-box;
                list-style: none;
                margin: 0;
                text-align: left;
                li {
                    width: 25%;
                    height: 60px;
                    text-align: center;
                    display: inline-block;
                    cursor: pointer;
                    user-select: none;
                    span {
                        display: inline-block;
                        width: 60px;
                        height: 60px;
                        text-align: center;
                        line-height: 60px;
                        border-radius: 50%;
                    }
                    &.active {
                        span {
                            background: linear-gradient(180deg, #00FFFF 0%, #028EDE 100%);
                        }
                    }
                    img {
                        width: 40px;
                    }
                }
            }

            .el-input {
                height: 100%;
                .el-input__inner {
                    color: #fff;
                    font-size: 24px;
                    font-family: 'SourceHanSansCN-Regular';
                }
                .el-input__icon {
                    cursor: pointer;
                }
            }


            .el-input__wrapper {
                background-color: transparent;
                border: none;
                box-shadow: none;
                caret-color: #00FFFF;
            }

            .el-input__suffix {
                color: #00FFFF;
                font-size: 24px;
            }

            //提示框的字体颜色
            input::-webkit-input-placeholder {
                /* WebKit browsers */
                color: #9DA5B1;
                font-size: 24px;
            }

            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #9DA5B1;
                font-size: 24px;
            }

            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #9DA5B1;
                font-size: 24px;
            }

            input:-ms-input-placeholder {
                /* Internet Explorer 10+ */
                color: #9DA5B1;
                font-size: 24px;
            }
        }
    }

    .body-m {
        // display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        height: calc(100% - 54px - 20px - 70px - 25px);
        // border: 1px solid red;
        // overflow: hidden;
        // margin: 20px 0 25px;
        padding: 20px 0 25px;
        text-align: left;
        .card {
            width: 23.1%;
            height: calc((100% - 48px) / 3);
            background: #0A1F3B;
            box-shadow: 0px 4px 8px 2px rgba(5, 28, 42, 0.4);
            border-radius: 8px 8px 8px 8px;
            border: 1px solid #0A1F3B;
            box-sizing: border-box;
            padding: 20px 5px 20px 20px;
            cursor: pointer;
            margin-right: 2.53%;
            margin-bottom: 1%;
            overflow: hidden;
            display: inline-block;
            &:nth-child(4n) {
                margin-right: 0;
            }
            &.selectedCard {
                border-color: #00FFFF;
                box-shadow: 0px 0px 20px 3px rgba(7,163,236,0.72);
            }
            .card-t {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 15px;
                margin-bottom: 4%;
                height: 20px;

                .name {
                    font-size: 22px;
                    font-family: 'SourceHanSansCN-Medium';
                    font-weight: 500;
                    color: #fff;
                    width: calc(100% - 60px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .detail {
                    color: #B4BECD;
                    font-size: 18px;
                    font-family: 'HelveticaNeue-Regular';
                    width: 60px;
                    text-align: right;
                }
            }

            .card-b {
                display: flex;
                justify-content: flex-start;
                align-items: stretch;
                height: calc(100% - 20px - 4% - 20px);

                .card-photo {
                    width: 30%;
                    height: 100%;
                    min-width: 100px;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    img {
                        width: auto;
                        height: auto;
                        max-width: 100%;
                        max-height: 100%;
                    }
                }

                .card-info {
                    margin-left: 20px;
                    text-align: left;
                    width: calc(100% - 30% - 20px);

                    ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;

                        li {
                            color: #B4BECD;
                            font-size: 18px;
                            font-family: 'SourceHanSansCN-Regular';
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }
    }

    .body-b {
        height: 70px;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;

        .progress {
            width: 74.34%;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            .el-slider__bar {
                background: linear-gradient(180deg, #00FFFF 0%, #028EDE 100%);
            }

            .el-slider__button {
                background: linear-gradient(180deg, #00FFFF 0%, #028EDE 100%);
                box-shadow: 0px 0px 6px 0px #181A1B;
                border: none;
            }

            .el-slider__runway {
                background: #0A1F3B;
            }
            .page-info {
                color: #fff;
                display: inline-block;
                font-size: 24px;
                font-family: 'HelveticaNeue-Regular';
                margin-left: 15px;
            }
        }

        // .goback {
        //     width: 70px;
        //     height: 70px;
        //     border-radius: 50%;
        //     background: linear-gradient(360deg, #0092E1 0%, #04E9E6 100%);
        //     box-shadow: 0px 0px 16px 1px rgba(0, 140, 255, 0.8);
        //     text-align: center;
        //     line-height: 70px;
        //     font-size: 24px;
        //     color: #fff;
        //     font-family: 'SourceHanSansCN-Medium';
        //     cursor: pointer;
        // }

        .change-page {
            button {
                width: 150px;
                height: 54px;
                line-height: 54px;
                padding: 0;
                text-align: center;
                border-radius: 8px;
                border: 1px solid;
                outline: none;
                font-size: 24px;
                font-family: 'SourceHanSansCN-Regular';
                cursor: pointer;

                &:nth-child(1) {
                    border-color: #04B5E6;
                    color: #03C8E5;
                    background-color: transparent;
                }

                &:nth-child(2) {
                    background: linear-gradient(180deg, #00DBF3 0%, #0086D9 100%);
                    box-shadow: 0px 0px 16px 1px rgba(0, 140, 255, 0.8);
                    border-color: rgba(0, 140, 255, 0.8);
                    color: #fff;
                    margin-left: 12px;
                }
            }
        }
    }
}</style>