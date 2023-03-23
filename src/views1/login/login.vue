<template>
    <div class="login">
        <h4>登录</h4>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="top" :rules="rules" class="demo-ruleForm"
            :size="formSize" status-icon>
            <el-form-item prop="userPhone">
                <el-input v-model="ruleForm.userPhone" placeholder="请输入用户名">
                    <template #prefix>
                        <img src="@/assets/images/login/user-name.png" class="ipt-icon" alt="">
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="userPassword" class="password">
                <el-input v-model="ruleForm.userPassword" :type="isShowPassword?'text':'password'" placeholder="请输入密码" >
                    <template #prefix>
                        <img src="@/assets/images/login/pasword-icon.png" class="ipt-icon" alt="">
                    </template>
                    <template #suffix>
                        <img @click="handleSwitchVisible" :src="`${isShowPassword ? showPasswIcon : hidePasswIcon}`" class="ipt-icon" alt="">
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="forgot-password">
                <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
                <!-- <p @click="forgotPass">忘记密码</p> -->
            </el-form-item>
            <el-form-item class="footer-btn">
                <el-button type="primary" :loading="isHandleLogin" @click="submitForm(ruleFormRef)">登录</el-button>
                <el-button type="primary" :loading="isHandleLogin" @click="submitFormDevice(ruleFormRef)">设备登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { http, userManagementApi } from '@/common/request.js'
import { useRouter } from 'vue-router'
import { Encrypt, Decrypt } from './secret.js'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

import showPasswIcon from '@/assets/images/login/show-password.png' 
import hidePasswIcon from '@/assets/images/login/hide-password.png' 


const router = useRouter()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    userPhone: '',
    userPassword: '',
})
const rememberMe = ref(false) //记住密码
const rules = reactive<FormRules>({
    userPhone: [
        { required: true, message: '账号不能为空', trigger: 'blur' },
    ],
    userPassword: [
        { required: true, message: '密码不能为空',trigger: 'blur'},
    ],
})
// 初始化页面时获取cookie
const getCookie = () => {
    const userPhoneCookie = Cookies.get("userPhoneCookie");
    const passwordCookie = Cookies.get("passwordCookie");
    const rememberMeCookie = Cookies.get("rememberMeCookie");
    console.log(rememberMeCookie)
    ruleForm['userPhone'] = userPhoneCookie === undefined ? ruleForm['userPhone'] : userPhoneCookie
    ruleForm['userPassword'] = passwordCookie === undefined ? ruleForm['userPassword'] : Decrypt(passwordCookie)
    rememberMe.value = rememberMeCookie === undefined ? rememberMe.value : Boolean(rememberMeCookie)
}
getCookie()

//记住密码
let rememberPassw = () => {
    //判断是否记住密码
    if (rememberMe.value) {
        Cookies.set("userPhoneCookie", ruleForm['userPhone'], { expires: 30 });
        Cookies.set("passwordCookie", Encrypt(ruleForm['userPassword']), {
            expires: 30,
        });
        Cookies.set("rememberMeCookie", rememberMe.value, {
            expires: 30,
        });
    } else {
        Cookies.remove("userPhoneCookie");
        Cookies.remove("passwordCookie");
        Cookies.remove("rememberMeCookie");
    }
}

//登录
const isHandleLogin = ref(false)  //登录状态

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    
    await formEl.validate((valid, fields) => {
        if (valid) {
            isHandleLogin.value = true
            ruleForm['userPassword'] = Encrypt(ruleForm['userPassword']);
            console.log(ruleForm['userPassword'])
            userManagementApi.post('userLogin/login', ruleForm)
            .then(res => {
                ruleForm['userPassword'] = Decrypt(ruleForm['userPassword']);
                let { code,message,data } = res.data
                isHandleLogin.value = false
                if(code==200) {
                    console.log(res)
                    localStorage.setItem('user_id',data.userId)
                    rememberPassw()
                    router.push({name:'monitoringCenter'})
                }else{
                    ElMessage.error(message)
                }
                
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

//设备登录
const submitFormDevice = () => {
    ruleForm['userPassword'] = ''
    ruleForm['userPhone'] = ''
    userManagementApi.post('userLogin/login', ruleForm)
    .then(res => {
        let { code,data } = res.data
        if(code==200) {
            localStorage.setItem('user_id',data.userId)
            console.log(res)
            router.push({name:'monitoringCenter'})
        }else{
            ElMessage.error(message)
        }
        isHandleLogin.value = false
    })
}

//密码显示隐藏
let isShowPassword = ref(false)
const handleSwitchVisible = () => {
    isShowPassword.value = !isShowPassword.value
}
//忘记密码
let emit = defineEmits(['forgotPass'])
const forgotPass = () => {
    emit('changeComp',{ id: 1 })
}

</script>
<style lang="scss" scoped>
.login {
    h4 {
        font-size: 36px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        color: rgba(36, 38, 51, 1);
        margin: 0 0 50px 0;
        text-align: center;
    }
    :deep(.demo-ruleForm) {
        .el-form-item--default {
            &.password {
                margin-bottom: 0 !important;
            }
            &.forgot-password {
                margin-bottom: 0 !important;
                .el-form-item__content {
                    line-height: 1 !important;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .el-checkbox  {
                        --el-checkbox-checked-icon-color: rgba(48, 65, 86, 1);
                    }
                    .el-checkbox__input {
                        border-radius: 4px;
                    }
                    .el-checkbox__inner {
                        border: 1px solid rgba(48, 65, 86, 1);
                    }
                    .el-checkbox__input.is-checked .el-checkbox__inner {
                        background-color: transparent;
                        border-color: rgba(48, 65, 86, 1);
                    }
                    .el-checkbox__label {
                        color: rgba(48, 65, 86, 1);
                    }
                    p {
                        color: rgba(0, 188, 255, 1);
                        cursor: pointer;
                    }
                }
            }
        }
        

        .save-password {
            margin-bottom: 4px;

            .el-checkbox {
                color: #00BCFF;

                .el-checkbox__inner {
                    background-color: transparent;
                    border-color: #00BCFF;
                }
            }
        }

        .footer-btn {
            .el-form-item__content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .el-button--default {
                    width: 45% !important;
                }
            }
        }

        

        
    }

}
</style>

