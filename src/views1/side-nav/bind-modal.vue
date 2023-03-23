<template>
    <!-- 绑定主设备弹窗 -->
    <Modal 
        v-model="bindModal" 
        draggable 
        :mask="false" 
        :title="defaultTwoLevelData.sname"
        width="370"
        class="bind-modal"
        :transfer="false"
        sticky>
        <div class="modal-tip">请从三维场景中选择该一个主设备作为该子系统的默认菜单!</div>
        <Form ref="formValidate" :model="defaultFormValidate" :rules="ruleValidate">
            <FormItem label="设备ID:" prop="dbId">
                <Input v-model="defaultFormValidate.dbId" style="width:245px" type="number" placeholder=""></Input>
            </FormItem>
        </Form>
            <div slot="footer" style="text-align: center" class="footer-btn">
            <Button size="small" @click="cancel">取消</Button>
            <Button size="small" :loading="loading" @click="submitdbId">绑定</Button>
        </div>
    </Modal>
</template>

<script>
export default {
    props: {
        formValidate: {
            type: Object,
        },
        twoLevelData: {
            type: Object,
            default: ()=>{
                return {}
            },
        },
        loading: false
    },
    data() {
        return {
            //绑定主设备弹窗
            bindModal: false,
            ruleValidate: {
                dbId: [
                    { required: true, trigger: 'blur,change',
                        validator: (rule, value, callback) => {
                            if (value =='') {
                                return callback(new Error("绑定的dbid不能为空"));
                            }else if(value < 0){
                                return callback(new Error("必须为整正数"));
                            }else{
                                return callback();
                            }
                        }
                    },
                    { type: 'string', message: '只能输入数字', trigger: 'blur' }
                ],
            },
            defaultFormValidate: {
                dbId: " ",
            },
            defaultTwoLevelData: {
                sname: " ",
                id: "",
            },
        }
    },
    watch: {
        formValidate:{
            handler(newV) {
                this.defaultFormValidate = newV
                
            },
            deep:true
        },
        twoLevelData: {
            handler(newV) {
                this.defaultTwoLevelData = newV
            },
            deep:true
        },
        
        // this.$set(this.formValidate,'dbId',e.detail+'')
    },
    mounted() {
        this.defaultFormValidate = this.formValidate
        this.defaultTwoLevelData = this.twoLevelData
    },
    methods: {
        showModal(childrenArray,param) {
            if(childrenArray[0]?.name=='system' && childrenArray[0].level==0 && childrenArray[0]?.st1name!='视频监控'){ //点击二级
                if(!childrenArray[0]?.deviceId || (typeof param) === 'string') { //点击子系统如果deviceId(dbid)没有值，那就弹出绑定弹窗(重置的时候不需要验证有没有dbid)
                    this.bindModal = true
                    this.defaultTwoLevelData = childrenArray[0];
                }else{
                    this.bindModal = false
                }
                
            }
        },
        //绑定按钮触发
        submitdbId() {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let dbid = this.defaultFormValidate.dbId
                    this.goChangeBindStatus(dbid)
                } else {
                    this.loading = false
                }
            })
        },

        //取消绑定
        cancel() {
            this.$refs['formValidate'].resetFields();
            this.bindModal = false
        },
        //绑定/解绑请求
        goChangeBindStatus(dbid) {
            let formData = new FormData();
            formData.append('id',this.defaultTwoLevelData.id+'')
            formData.append('deviceId',dbid)
            this.$axios
                .post(
                    "Moedltree/bindMainId",
                    formData
                )
                .then((res) => {
                    if(dbid) { //dbid有值表示绑定，没有值表示解绑
                        this.$Message.success('设置成功!');
                        this.bindModal = false
                        this.$refs['formValidate'].resetFields(); //清空输入框所选的值
                    }else{
                        this.bindModal = true; //绑定窗弹出
                        this.unbindModal = false; //解绑框隐藏
                    }
                    this.$emit('getFloorData'); //成功后重新请求导航数据

                })
                .catch((error) => {
                    console.log(error);
                });
        },
    }
}
</script>
<style lang="scss" scoped>

</style>