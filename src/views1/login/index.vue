<template>
    <div class="xajd-login">
        <img src="@/assets/images/login/logo.png" class="logo" alt="">
        <div class="xjd-text">
            <img src="@/assets/images/login/xjd-text.png" alt="">
        </div>
        <div class="login-module">
            <keep-alive exclude="resetPassword">
                <component :is="currentComp.tabComp" @changeComp="changeComp"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, markRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import Login from './login.vue'
import findPassword from './find-password.vue'
import enterVerificationCode from './enter-verification-code.vue'
import resetPassword from './reset-password.vue'

type tabType = {
  name: string,
  tabComp: any
}
const loginComp = reactive<tabType[]>([
  {
    name: '登录',
    tabComp: markRaw(Login)
  },
  {
    name: '找回密码',
    tabComp: markRaw(findPassword)
  },
  {
    name: '输入验证码',
    tabComp: markRaw(enterVerificationCode)
  },
  {
    name: '重置密码',
    tabComp: markRaw(resetPassword)
  },
])

type Comp = Pick<tabType, 'tabComp'>
let currentComp = reactive<Comp>({
    tabComp: loginComp[0].tabComp
})

const changeComp = (param) => {
    let { id } = param
    currentComp.tabComp = loginComp[id].tabComp
}
</script>
<style lang="scss" scoped>
.xajd-login {
    width: 100%;
    height: 100%;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('@/assets/images/login/login-bg.jpg');
    
    .logo {
        width: 210px;
        height: 90px;
        position: absolute;
        top: 60px;
        left: 60px;
    }
    .xjd-text {
        width: 1180px;
        height: 160px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -80px;
        background: rgba(0,3,8,0.2200);
        img {
            width: 1090px;
            height: 100%;
        }
        
    }
    .login-module {
        width: 470px;
        height: auto;
        background: rgba(255,255,255,.8);
        box-shadow: 0px 4px 20px 6px rgba(2,35,111,0.3);
        border-radius: 12px 12px 12px 12px;
        border-radius: 2px 2px 2px 2px;
        padding: 50px 40px 60px;
        box-sizing: border-box;
        position: absolute;
        right: 170px;
        top: calc(50% - 255px);
        :deep(.demo-ruleForm) {
            .el-form-item--default {
                margin-bottom: 30px;
                .el-form-item__content {
                    line-height: 40px;
                }
            }
            .footer-btn {
                margin-bottom: 0;
                margin-top: 45px;

                .el-button {
                    width: 100%;
                    height: 50px;
                    font-size: 24px;
                    --el-button-bg-color: #06ABE6;
                }
            }
            .el-input__wrapper {
                background: transparent;
                color: rgba(48, 65, 86, 1);
                border: 1px solid #C1CEE5;
                box-shadow: none;
                height: 50px;
                .ipt-icon {
                    width: 24px;
                    cursor: pointer;
                }
                input::-webkit-input-placeholder {
                    -webkit-text-fill-color: rgba(48, 65, 86, 0.7);
                }
                .el-input__inner {
                    color: rgba(48, 65, 86, 1);
                    font-size: 18px;
                }

                .el-select .el-input .el-select__caret.el-icon {
                    color: #00BCFF;
                }
            }

            .el-input__wrapper.is-focus {
                box-shadow: 0px 0px 10px 1px rgba(0,188,255,0.3);
                border: 1px solid rgba(0,188,255,0.7000);
            }
        }
        
    }
}

</style>

