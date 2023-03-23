<template>
    <div class="verification-code">
        <h4>
            <div>输入验证码</div>
            <div>验证码已发送至 {{ 110 }}</div>
            <el-icon @click.native="goBack">
                <Back />
            </el-icon>
        </h4>
        <div class="g-remove-check-code_content" @keyup="fnCheckCodeKeyup" @keydown="fnCheckCodeKeydown"
            @input="fnCheckCodeInputEvent">
            <input :class="{ 'g-code-input_color': aCheckCodeInputComputed[0] !== '' }" max="9" min="0" maxlength="1"
                data-index="0" v-model.trim.number="aCheckCodeInputComputed[0]" type="number" ref="firstInputRef" />
            <input :class="{ 'g-code-input_color': aCheckCodeInputComputed[1] !== '' }" max="9" min="0" maxlength="1"
                data-index="1" v-model.trim.number="aCheckCodeInputComputed[1]" type="number" />
            <input :class="{ 'g-code-input_color': aCheckCodeInputComputed[2] !== '' }" max="9" min="0" maxlength="1"
                data-index="2" v-model.trim.number="aCheckCodeInputComputed[2]" type="number" />
            <input :class="{ 'g-code-input_color': aCheckCodeInputComputed[3] !== '' }" max="9" min="0" maxlength="1"
                data-index="3" v-model.trim.number="aCheckCodeInputComputed[3]" type="number" />
            <input :class="{ 'g-code-input_color': aCheckCodeInputComputed[4] !== '' }" max="9" min="0" maxlength="1"
                data-index="4" v-model.trim.number="aCheckCodeInputComputed[4]" type="number" />
            <input :class="{ 'g-code-input_color': aCheckCodeInputComputed[5] !== '' }" max="9" min="0" maxlength="1"
                data-index="5" v-model.trim.number="aCheckCodeInputComputed[5]" type="number" />
        </div>
        <div class="countdown">
            <div v-if="countdown">
                <span>{{countdown}}秒 </span>
                <span>后重新发送验证码</span>
            </div>
            <div v-else>
                <span class="resend" @click="handleResend">重新发送</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { http } from '@/common/request.js'

const aCheckCodeInput = ref(['', '', '', '', '', ''])	// 存储输入验证码内容
const aCheckCodePasteResult = ref([])				// 粘贴的验证码
const firstInputRef = ref(null)
onMounted(() => {
    nextTick(() => {
        firstInputRef.value.focus()
        
    })
    timeInterval()
})
let aCheckCodeInputComputed = computed(() => {
    if (aCheckCodePasteResult.value.length === 6) {
        return aCheckCodePasteResult.value;
    } else if (aCheckCodeInput.value && Array.isArray(aCheckCodeInput.value) && aCheckCodeInput.value.length === 6) {
        return aCheckCodeInput.value;
    } else if (/^\d{6}$/.test(aCheckCodeInput.value.toString())) {
        return aCheckCodeInput.value.toString().split("");
    } else {
        return new Array(6);
    }
})
//倒计时
let countdown = ref(60)
const timeInterval = () => {
    const timer = setInterval(() => {
        if(countdown.value==0) {
            window.clearInterval(timer)
            // countdown.value=5
        }else{
            countdown.value--
        }
        
    },1000)
}

//重新发送
const handleResend = () => {
    countdown.value = 60
    timeInterval()
}

// 输入验证码，更新验证码数据
const fnCheckCodeKeyup = (e) => {
    let index = e.target.dataset.index * 1;
    let el = e.target;
    // 解决输入e的问题
    el.value = el.value
        .replace(/Digit|Numpad/i, "")
        .slice(0, 1);
    if (/Digit|Numpad/i.test(e.code)) {
        // 必须在这里赋值，否则输入框会是空值
        aCheckCodeInput.value.splice(index, 1, e.code.replace(/Digit|Numpad/i, ""));
        el.nextElementSibling && el.nextElementSibling.focus();
        if (index === 5) {
            if (aCheckCodeInput.value.join("").length === 6) document.activeElement.blur();
            validatorCode()
        }
    }
}
const emit = defineEmits(['validatorCode','goBack'])
//验证
const validatorCode = () => {

    // http.post().then( res => {

    // })
    emit('changeComp',{ id: 3 })
}
const goBack = () => {
    emit('changeComp',{ id: 1 })
}

// 输入验证码，检测位置变化
const fnCheckCodeKeydown = (e) => {
    let index = e.target.dataset.index * 1;
    let el = e.target;
    if (e.key === "Backspace") {
        if (aCheckCodeInput.value[index].length > 0) {
            aCheckCodeInput.value.splice(index, 1, '');
        } else {
            if (el.previousElementSibling) {
                el.previousElementSibling.focus();
                aCheckCodeInput.value[index - 1] = '';
            }
        }
    } else if (e.key === 'Delete') {
        if (aCheckCodeInput.value[index].length > 0) {
            aCheckCodeInput.value.splice(index, 1, '');
        } else {
            if (el.nextElementSibling) {
                el.nextElementSibling.focus();
                aCheckCodeInput.value[++index] = '';
            }
        }
    } else if (e.key === "Home") {
        el.parentElement.children[0] && el.parentElement.children[0].focus();
    } else if (e.key === "End") {
        el.parentElement.children[aCheckCodeInput.value.length - 1] &&
            el.parentElement.children[aCheckCodeInput.value.length - 1].focus();
    } else if (e.key === "ArrowLeft") {
        if (el.previousElementSibling) el.previousElementSibling.focus();
    } else if (e.key === "ArrowRight") {
        if (el.nextElementSibling) el.nextElementSibling.focus();
    }
}

// 输入验证码，解决一个输入框输入多个字符的问题
const fnCheckCodeKeyPaste = (e) => {
    let index = e.target.dataset.index * 1;
    let el = e.target;
    el.value = el.value
        .replace(/Digit|Numpad/i, "")
        .slice(0, 1);
    aCheckCodeInput.value[index] = el.value;
}

// 验证码粘贴
const fnCheckCodeInputEvent = (e) => {

    e.clipboardData.items[0].getAsString((str) => {
        if (str.toString().length === 6) {
            aCheckCodePasteResult.value = str.split("");
            document.activeElement.blur();
            aCheckCodeInput.value = aCheckCodeInputComputed.value;
            aCheckCodePasteResult.value = [];
        } else {
            // 如果粘贴内容不合规，清除所有内容
            aCheckCodeInput.value = ['', '', '', '', '', ''];
        }
    });
}

</script>
<style lang="scss" scoped>
.verification-code {
    h4 {
        margin: 0 0 50px 0;
        text-align: center;
        position: relative;
        .el-icon {
            position: absolute;
            top: 18%;
            left: 0;
            font-size: 36px;
            cursor: pointer;
        }
        div {
            font-size: 36px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #242633;
            &:nth-child(2) {
                font-size: 18px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #304156;
                margin-top: 10px;
            }
        }
    }

    .g-remove-check-code_content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 400px;
        // padding: 28px 0 28px 0;
        margin: 0 auto;
        input {
            width: 50px;
            height: 50px;
            font-size: 20px;
            text-align: center;
            border: none;
            outline: none;
            border-bottom: solid 1px rgba(48, 65, 86, 1);
            background-color: transparent;
            -moz-appearance: textfield;
        }
        input.g-code-input_color {
            border-color: #5290FF;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            appearance: none;
            margin: 0;
        }
    }
    .countdown {
        margin-top: 46px;
        span {
            font-size: 18px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #00BCFF;
            &:nth-child(2) {
                color: #304156;
            }
        }
        .resend {
            cursor: pointer;
        }
    }

}
</style>

