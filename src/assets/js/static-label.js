import { getStaticLabel } from '@/common/icon.js'
class staticLabel extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._followWenzigroup = null;
        this._followButtonwenzi = null;
        // this._staticLabel = options.icons || [];
        this.updatestaticLabelCallback;
        this.onClick = null;
        this.staticFrags = {}
        this.mapData = [
            "安全出口", "冲淋洗眼", "药箱", "消防栓"
        ]
    }

    load() {
        this.updatestaticLabelCallback = () => {
            // if (this._enabled) {
            //     this.updateTempIcons();
            // }
            this.updatestaticLabel();
        };
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updatestaticLabelCallback);
        this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updatestaticLabelCallback);
        this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, this.updatestaticLabelCallback);
        this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, this.updatestaticLabelCallback);

        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._followWenzigroup) {
            this._followWenzigroup.removeControl(this._followButtonwenzi);
            if (this._followWenzigroup.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._followWenzigroup);
            }
        }
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updatestaticLabelCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updatestaticLabelCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT, this.updatestaticLabelCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT, this.updatestaticLabelCallback);
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        // this._followWenzigroup = this.viewer.toolbar.getControl('customExtensions');
        // if (!this._followWenzigroup) {
        //     this._followWenzigroup = new Autodesk.Viewing.UI.ControlGroup('customExtensions');
        //     this.viewer.toolbar.addControl(this._followWenzigroup);
        // }

        // // Add a new button to the toolbar group
        // this._followButtonwenzi = new Autodesk.Viewing.UI.Button('IconExtension');
        // // this._followButtonwenzi.onClick = (ev) => {//点击按钮触发现在不需要暂时注释掉
        // //     this._enabled = !this._enabled;
        // this.showStaticLabel(false);
        // this._followButtonwenzi.setState(this._enabled ? 0 : 1);

        // // };
        // this._followButtonwenzi.setToolTip(this.options.button.tooltip);
        // this._followButtonwenzi.container.children[0].classList.add('fas', this.options.button.icon);
        // this._followWenzigroup.addControl(this._followButtonwenzi);

    }

    showStaticLabel(data) {
        this._staticLabel = data;
        const $viewer = $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer');
        // remove previous...
        
        // do we have anything to show?
        if (this._staticLabel === undefined) return;

        // do we have access to the instance tree?
        // const tree = window['models'+dataObj.modelId]?.getInstanceTree();
        // if (tree === undefined) { console.log('Loading tree...'); return; }
        const onClick = (e) => {
            if (this.onClick)
                this.onClick($(e.currentTarget).data('dbid'), $(e.currentTarget).data('modelid'));
        };
        const onMouseOver = (e) => {
            if (this.options.onMouseOver)
                this.options.onMouseOver($(e.currentTarget));
        };
        // this.fragsIdObj = {};
        for (var i = 0; i < this._staticLabel.length; i++) {
            const icon = this._staticLabel[i];
            let { dbId, modelId, devName, labelPattern } = icon || {}
            const tree = window['models' + modelId]?.getInstanceTree();
            // this.fragsIdObj['dbId' + dbId] = [];
            let findD = $(`#static-${dbId}-m-${modelId}`)
            if (!(findD.length)) {
                let $label = $(`
                    <label 
                    class="staticLabel markup connectVariable1-update" 
                    id="static-${dbId}-m-${modelId}"
                    data-dbid="${dbId}" 
                    data-controlname="${this.mapData[labelPattern*1-1] || ''}" 
                    data-modelid="${modelId}" 
                    data-name="${devName}">
                        <img src="${getStaticLabel(labelPattern)}" width="65" />
                    </label>
                `)

                $label.css('display', 'block');
                $label.on('click', onClick);
                $label.on('mouseover', onMouseOver);
                $viewer.append($label);
                if (!(this.staticFrags?.hasOwnProperty('dbId' + dbId))) {
                    // 如果之前未记录fragIds，则进行记录
                    this.staticFrags['dbId' + dbId] = []
                    tree.enumNodeFragments(dbId, fragId => {
                        this.staticFrags['dbId' + dbId].push(fragId)
                        this.updatestaticLabel() // re-position of each fragId found
                    })
                    console.log(this.staticFrags)
                } else {
                    this.updatestaticLabel() // re-position of each fragId found
                }
            }else{
                if (!(this.staticFrags?.hasOwnProperty('dbId' + dbId))) {
                    // 如果之前未记录fragIds，则进行记录
                    this.staticFrags['dbId' + dbId] = []
                    tree.enumNodeFragments(dbId, fragId => {
                        this.staticFrags['dbId' + dbId].push(fragId)
                        this.updatestaticLabel() // re-position of each fragId found
                    })
                } else {
                    this.updatestaticLabel() // re-position of each fragId found
                }
            }
            
            // const _this = this;
            // tree.enumNodeFragments(dbId, function (fragId) {
            //     _this.fragsIdObj['dbId' + dbId].push(fragId);
            //     _this.updatestaticLabel(); // re-position of each fragId found
            // });
        }

    }
    removeAllBindStaticLabel() {
        $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer label.staticLabel').remove();
    }

    getModifiedWorldBoundingBox(dbId, modelId) {
        var fragList = window[`models${modelId}`].getFragmentList();
        // console.log(`${build}+11+${type=="JD"?'JDmodels':'models'}`)
        const nodebBox = new THREE.Box3()
        let dbId1 = dbId
        // for each fragId on the list, get the bounding box
        // if(!this._frags['dbId' + dbId]) return;
        for (const fragId of this.staticFrags['dbId' + dbId1]) {
            const fragbBox = new THREE.Box3();
            fragList.getWorldBounds(fragId, fragbBox);
            nodebBox.union(fragbBox); // create a unifed bounding box
        }
        return nodebBox
    }

    updatestaticLabel() {
        for (const label of $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer .staticLabel')) {
            const $label = $(label);
            const id = $label.data('dbid');
            const modelId = $label.data('modelid'); //模型
            // get the center of the dbId (based on its fragIds bounding boxes)
            // if (!this.fragsIdObj?.hasOwnProperty(['dbId' + id])) return; //因为dbid变化时旋转相机会报错，所以加上这句了
            const position = this.getModifiedWorldBoundingBox(id, modelId);
            if (!position) return;
            var min = position.min;
            var max = position.max;
            // const position = this.viewer.worldToClient(this.getModifiedWorldBoundingBox(id).center());
            const pos = this.viewer.worldToClient(new THREE.Vector3((max.x + min.x) / 2, (min.y + max.y) / 2, max.z)); //为了使标签在构件上面自己加的
            // position the label center to it
            $label.css('left', Math.floor(pos.x - $label[0].offsetWidth / 2) + 'px');
            $label.css('top', Math.floor(pos.y - $label[0].offsetHeight / 2) + 'px');
            $label.css('display', 'block');
            // $label.css('opacity','1');
        }

    }
}
Autodesk.Viewing.theExtensionManager.registerExtension('staticLabel', staticLabel);