<template>
    <Modal 
        v-model="unbindModal" 
        draggable  
        title=" "
        width="370"
        class="bind-modal"
        :transfer="false"
        sticky>
        <div class="modal-tip1">是否要重置 {{defaultTwoLevelData.sname}} 子系统的主设备？</div>
            <div slot="footer" style="text-align: center" class="footer-btn">
            <Button size="small" @click="cancel1">取消</Button>
            <Button size="small" @click="resetMainDbid">重置</Button>
        </div>
    </Modal>
</template>

<script>
export default {
    props: {
        twoLevelData: {
            type: Object,
            default: {},
        },
        loading: false
    },
    data() {
        return {
            //解绑主设备弹窗
            unbindModal: false,
            defaultTwoLevelData: {}
        }
    },
    watch: {
        twoLevelData: {
            handler(newV) {
                this.defaultTwoLevelData = newV
            },
            deep:true
        },
    },
    mounted() {
        
    },
    methods: {
        //双击弹出解绑窗
        showUnbindModal(childrenArray) {
            if(childrenArray[0]?.name=='system' && childrenArray[0].level==0){ //点击二级
                if(childrenArray[0]?.deviceId) { //双击子系统如果dbid有值，那就弹出解绑弹窗
                    this.unbindModal = true
                    this.defaultTwoLevelData = childrenArray[0];
                }
            }
        },
        //重置绑定的主设备
        resetMainDbid() {
            this.unbindModal = false
            this.$emit("bindMainDefaultMenu",'这个参数用于判断重置调起绑定窗')
        },
        //取消解绑
        cancel1() {
            this.unbindModal = false
        },
    }
}
</script>
<style lang="scss" scoped>

</style>