<template>
    <div class="retrieve-passw">
        <h4>
            <el-icon @click.native="goBack">
                <Back />
            </el-icon>
            找回密码
        </h4>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="top" :rules="rules" class="demo-ruleForm"
            :size="formSize" status-icon>
            <el-form-item prop="phoneNum">
                <el-input v-model="ruleForm.phoneNum" placeholder="请输入手机号">
                    <template #prefix>
                        <img src="@/assets/images/login/user-name.png" class="ipt-icon" alt="">
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="footer-btn">
                <el-button type="primary" @click="nextStep(ruleFormRef)">下一步</el-button>
            </el-form-item>
            <el-form-item class="existing-account">
                <span @click="goBack">登录已有账号</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { http } from '@/common/request.js'

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    phoneNum: '',
})
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('手机号不能为空'))
  } else {
    if (!/^\d{11}$/.test(value)) {
      callback(new Error('请输入正确手机号'))
    }else {
        callback()
    }
  }
}
const rules = reactive<FormRules>({
    phoneNum: [
    {
      required: true,
      validator: validatePhone,
      trigger: 'change',
    },
  ],
})

const nextStep = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!', ruleForm)
            showResetPasswModal()
            http.post('userLogin/login', {
                userPhone: '18710018731',
                userPassword: '123456Aa'
            })
                .then(res => {
                    setTimeout(() => {
                        console.log(res)
                    }, 2000);
                })
                .catch(error => console.log(error))
        } else {
            console.log('error submit!', fields)
        }
    })
}

//返回
const emit = defineEmits(['goBack','showResetPasswModal'])
const goBack = () => {
    emit('changeComp',{ id: 0 })
}
//显示重置密码
const showResetPasswModal = () => {
    emit('changeComp',{ id: 2 })
}

</script>
<style lang="scss" scoped>
.retrieve-passw {
    h4 {
        font-size: 36px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        color: rgba(36, 38, 51, 1);
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
    }

    :deep(.demo-ruleForm) {
        .el-form-item--default {
            &.existing-account {
                margin-bottom: 0 !important;
                .el-form-item__content {
                    width: 100%;
                    text-align: right;
                    color: rgba(0, 188, 255, 1);
                    font-size: 16px;
                    cursor: pointer;
                    display: inline-block;
                }
            }
        }


    }

}
</style>

