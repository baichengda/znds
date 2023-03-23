import Vue from 'vue'
import Vuex from 'vuex'
import  axios  from  '@/common/interceptors'
import utils from '@/common/utils.js'
import configZuTai2dModule from './modules/configZuTai2dModule.js'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loginhead: "", //登录头像
        loginname: "", //登录名字
        websitelogo: "", //网站logo
        permissionList: [], //权限列表
        flag: true,
        modelId: null,
    },
    mutations: {
        setname(state, data) {
            state.loginhead = data.head;
            state.loginname = data.name;
        },
        setlogo(state, data) {
            let { companylogo } = data
            state.websitelogo = companylogo

        },
        updatePermissionList: (state, payload) => {

            state.permissionList = payload
        },
        changeFlag(state, payload) {
            state.flag = payload;
        },
        SET_MODEL_ID(state, modelId) {
            state.modelId = modelId
        },
    },
    actions: {
        setlogoFun(context, data) {
            context.commit("setlogo", data)
        },
        setnameFun(context, data) {
            context.commit("setname", data)
        },
        
    },
    modules: {
        configZuTai2dModule,
    }
})