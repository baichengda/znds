import utils from '@/common/utils.js'
let mixinRemind = {
    // methods: {
    //     getOrderAndAlarmDataToRemind(param) {
    //         this.$axios.get('service/countAlarmAndOrder').then((res)=> {
    //             if(res.data.success){
    //                 let { alarmTotal } = res.data.data.data;
    //                 let { orderTotal } = res.data.data.data;
    //                 if(!param) {
    //                     if(alarmTotal >= 1){
    //                         this.utils.alarmToRemind(false,alarmTotal,this.getOrderAndAlarmDataToRemind)
    //                     }
    //                     if(orderTotal >= 1){
    //                         this.utils.orderToRemind(false,orderTotal,this.getOrderAndAlarmDataToRemind)
    //                     }
    //                 }else{
    //                     if(alarmTotal >= 1 || orderTotal >= 1){
    //                         this.utils[param](false,alarmTotal,this.getOrderAndAlarmDataToRemind)
    //                     }
    //                 }
    //             }
                
    //         }).catch((error)=> {
    //             console.log(error)
    //         });
    //     }
    // }
}
export { mixinRemind }