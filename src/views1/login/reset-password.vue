<template>
    <div class="reset-passw">
        <h4>重置密码</h4>
        <el-form v-if="!isResetSucc" ref="ruleFormRef" :model="ruleForm" label-position="top" :rules="rules" class="demo-ruleForm"
            :size="formSize" status-icon>
            <el-form-item prop="password1">
                <el-input v-model="ruleForm.password1" autocomplete="off"
                    :type="passwordIcon.isShowPassword1 ? 'text' : 'password'" placeholder="请重新输入新密码">
                    <template #prefix>
                        <img src="@/assets/images/login/user-name.png" class="ipt-icon" alt="">
                    </template>
                    <template #suffix>
                        <img @click="handleSwitchVisible(1)"
                            :src="`${passwordIcon.isShowPassword1 ? showPasswIcon : hidePasswIcon}`" class="ipt-icon"
                            alt="">
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password2" class="password">
                <el-input v-model="ruleForm.password2" :type="passwordIcon.isShowPassword2 ? 'text' : 'password'"
                    placeholder="请再次输入新密码">
                    <template #prefix>
                        <img src="@/assets/images/login/pasword-icon.png" class="ipt-icon" alt="">
                    </template>
                    <template #suffix>
                        <img @click="handleSwitchVisible(2)"
                            :src="`${passwordIcon.isShowPassword2 ? showPasswIcon : hidePasswIcon}`" class="ipt-icon"
                            alt="">
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="footer-btn">
                <el-button type="primary" :loading="isLoading" @click="nextStep(ruleFormRef)">下一步</el-button>
            </el-form-item>
        </el-form>
        <div v-else class="reset-success">
            <p>密码重置成功，请前往登录</p>
            <p>
                <span>{{countdownNum}}秒</span>后，
                页面自动跳转
            </p>
            <div class="footer-btn">
                <el-button type="primary" :loading="isLoading" @click="goLogin">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { http } from '@/common/request.js'

import showPasswIcon from '@/assets/images/login/show-password.png'
import hidePasswIcon from '@/assets/images/login/hide-password.png'

let router = useRouter()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    password1: '',
    password2: '',
}) as any
const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (ruleForm.password2 !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('password2', () => null)
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    console.log(value)
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.password1) {
        callback(new Error("两次输入不相同"))
    } else {
        callback()
    }
}
const rules = reactive<FormRules>({
    password1: [{ validator: validatePass, trigger: 'blur' }],
    password2: [{ validator: validatePass2, trigger: 'blur' }],
})
let isLoading = ref(false) //重置密码loading
let isResetSucc = ref(false) //是否显示重置成功
//下一步
const nextStep = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            isResetSucc.value = true
            startCountdown()
        } else {
            console.log('error submit!')
            return false
        }
    })
}

//重置成功后开始倒计时
let countdownNum = ref(3)
const startCountdown = () => {
    let timer = setInterval(() => {
        if(countdownNum.value==0) {
            window.clearInterval(timer)
            goLogin()
        }else{
            countdownNum.value--
        }
        
    },1000)
}


//密码可见
let passwordIcon = reactive({
    isShowPassword1: false,
    isShowPassword2: false,
})
const handleSwitchVisible = (param) => {
    passwordIcon['isShowPassword' + param] = !passwordIcon['isShowPassword' + param]
}

//登录
const emit = defineEmits(['goLogin'])
const goLogin = () => {
    emit('changeComp',{id:0})
}
</script>
<style lang="scss" scoped>
.reset-passw {
    h4 {
        font-size: 36px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        color: rgba(36, 38, 51, 1);
        margin: 0 0 10px 0;
        text-align: center;
        margin-bottom: 40px;
    }

    .reset-success {
        p {
            font-size: 18px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #304156;
            line-height: 1;
            margin: 0;
            &:nth-child(2) {
                margin: 30px 0 50px;
            }
            span {
                color: rgba(0, 188, 255, 1);
            }
        }
        .footer-btn {
            .el-button  {
                width: 100%;
                height: 50px;
                font-size: 20px;
            }
        }
    }

}
</style>

