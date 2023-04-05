export default modelConnection = {
    addConnectedIcon: (list,type)=> {
        // console.log(window.connectVariableIconJD)
        this.$nextTick(() => {
            if(type=='JD') {
                // window.connectVariableIconJD._connectVariableiconJDs = list.JD
                window.connectVariableIconJD.showTconnectVariableIconJDs(true,list)
                window.connectVariableIconJD.onClick=(dbid,name)=>{
                    this.$EventBus.$emit('openConfigVarModel',{dbid,modelId})
                }
                // this.$EventBus.$emit('variableIconJD',list)
            }
            if(type=='JZ') {
                // window.connectVariableIconJZ._connectVariableiconJZs = list.JZ
                window.connectVariableIconJZ.showTconnectVariableIconJZs(true,list)
                window.connectVariableIconJZ.onClick=(dbid,modelId)=>{
                    this.$EventBus.$emit('openConfigVarModel',{dbid,modelId})
                }
                //  this.$EventBus.$emit('variableIconJZ',list)
            }
        });
    },

    //q请求已经绑定变量的dbid
    getLabelDbid: (dbids,param)=> {
        this.$axios.post('PointEquiment/bindLabel',
        {"dbidList":dbids},
        {headers: {'Content-Type': 'application/json'}}
        ).then((res)=> {
            if(res.data.message == 'true'){
                this.currentBindDbid =  res.data.data.list
                if(this.clickIsRoom=='') {
                    this.addConnectedIcon(this.currentBindDbid,'JD')
                }else{
                    if(param=='F02') { //因为报警器、气体探测器不属于房间和系统下，但是属于JD,点击导航手动判断返回数据中有没有包含这两个dbid
                        // 2584,2587
                        let arr = this.currentBindDbid.filter(opt=>{
                            return opt==2584 || opt==2587
                        })
                        this.addConnectedIcon(arr,'JD')
                    }
                    this.currentBindDbid.splice( this.currentBindDbid.indexOf(2584),1);
                    this.currentBindDbid.splice( this.currentBindDbid.indexOf(2587),1);
                    this.addConnectedIcon(this.currentBindDbid,'JZ')
                }
            }
          }).catch((error)=> {
            console.log(error);
          });
    },
}