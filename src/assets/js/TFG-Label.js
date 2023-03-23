//会议室标签 （修改参数的话直接替换TFGLabel，就可以全部替换并用于新的文件，不会冲突）
class TFGLabel extends Autodesk.Viewing.Extension {
        constructor(viewer, options) {
            super(viewer, options);
            this._TFGLabelgroup = null;
            this._TFGLabelbutton = null;
            // this._TFGLabels = options.icons || [];
            this._TFGLabels = null;
            this.updateTFGLabelsCallback;
        }

        load() {
            this.updateTFGLabelsCallback = () => {
                // if (this._enabled) {
                //     this.updateTempIcons();
                // }
                this.updateTFGLabels();

            };

            this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateTFGLabelsCallback);
            this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updateTFGLabelsCallback);
            this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, this.updateTFGLabelsCallback);
            this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, this.updateTFGLabelsCallback);

            return true;
        }

        unload() {
            // Clean our UI elements if we added any
            // if (this._TFGLabelgroup) {
            //     this._TFGLabelgroup.removeControl(this._TFGLabelbutton);
            //     if (this._TFGLabelgroup.getNumberOfControls() === 0) {
            //         this.viewer.toolbar.removeControl(this._TFGLabelgroup);
            //     }
            // }
            this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateTFGLabelsCallback);
            this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updateTFGLabelsCallback);
            this.viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT, this.updateTFGLabelsCallback);
            this.viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT, this.updateTFGLabelsCallback);
            return true;
        }

        onToolbarCreated() {
            // // Create a new toolbar group if it doesn't exist
            // this._TFGLabelgroup = this.viewer.toolbar.getControl('customExtensions');
            // if (!this._TFGLabelgroup) {
            //     this._TFGLabelgroup = new Autodesk.Viewing.UI.ControlGroup('customExtensions');
            //     this.viewer.toolbar.addControl(this._TFGLabelgroup);
            // }

            // // Add a new button to the toolbar group
            // this._TFGLabelbutton = new Autodesk.Viewing.UI.Button('IconExtension');
            // // this._TFGLabelbutton.onClick = (ev) => { //点击按钮触发现在不需要暂时注释掉
            // //     this._enabled = !this._enabled;
            // this.showTFGLabels(true);
            // this._TFGLabelbutton.setState(this._enabled ? 0 : 1);

            // // };
            // this._TFGLabelbutton.setToolTip(this.options.button.tooltip);
            // this._TFGLabelbutton.container.children[0].classList.add('fas', this.options.button.icon);
            // this._TFGLabelgroup.addControl(this._TFGLabelbutton);

        }
        showTFGLabels(value) {
                const $viewer = $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer');
                this._TFGLabels = value
                // remove previous...
                $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer label.TFGLabel-markup').remove();
                // if (!show) return;

                // do we have anything to show?
                if (this._TFGLabels === undefined || this.icons === null) return;

                // do we have access to the instance tree?
                const tree = window.JDmodels && window.JDmodels.getInstanceTree();
                if (tree === undefined) { console.log('Loading tree...'); return; }

                const onClick = (e) => {
                    if (this.options.onClick)
                        this.options.onClick($(e.currentTarget).data('id'), e.target);
                };
                const onMouseOver = (e) => {
                    if (this.options.onMouseOver)
                        this.options.onMouseOver($(e.currentTarget));
                };
                this._frags1 = {};
                //  window.addEventListener("cgqInforOver", (e)=> {
                //
                //      console.log(this.asasas)
                // }, false);
                for (var i = 0; i < this._TFGLabels.length; i++) {
                    // we need to collect all the fragIds for a given dbId
                    const icon = this._TFGLabels[i];
                    var _dbid = Number(icon.dbid)
                    // var btnData = icon.btndata;
                    this._frags1['dbId' + _dbid] = []
                        // create the label for the dbId
                        // <img width="24" class="xitong-icons" src="${imgUrl}">
                    if (icon) {
                        var $label = $(`
                    <label class="TFGLabel-markup" data-id="${_dbid}">
                        
                        <div class="follow-btn">
                            <div>123123</div>
                        </div>
                    </label>
                `);
                $label.css('display', this.viewer.isNodeVisible(_dbid) ? 'block' : 'none');
                $label.on('click', onClick);
                $label.on('mouseover', onMouseOver);
            }
            $viewer.append($label);
            // now collect the fragIds
            const _this = this;
            tree.enumNodeFragments(_dbid, function(fragId) {
                _this._frags1['dbId' + _dbid].push(fragId);
                _this.updateTFGLabels(); // re-position of each fragId found
            });
            
        }

    }

    getModifiedWorldBoundingBox(dbId) {
        var fragList = window.JDmodels.getFragmentList();
        const nodebBox = new THREE.Box3()
        let dbId1 = dbId
            // for each fragId on the list, get the bounding box
            // if(!this._frags['dbId' + dbId]) return;
        for (const fragId of this._frags1['dbId' + dbId1]) {
            const fragbBox = new THREE.Box3();
            fragList.getWorldBounds(fragId, fragbBox);
            nodebBox.union(fragbBox); // create a unifed bounding box
        }

        return nodebBox
    }

    updateTFGLabels() {
        //判断相机距离设置文字图标大小
        for (const label of $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer .TFGLabel-markup')) {
            const $label = $(label);
            const id = $label.data('id');
            // get the center of the dbId (based on its fragIds bounding boxes)
            if (!this._frags1.hasOwnProperty(['dbId' + id])) return; //因为dbid变化时旋转相机会报错，所以加上这句了
            const position = this.getModifiedWorldBoundingBox(id);
            if (!position) return;
            var min = position.min;
            var max = position.max;
            // const position = this.viewer.worldToClient(this.getModifiedWorldBoundingBox(id).center());
            const pos = this.viewer.worldToClient(new THREE.Vector3((max.x + min.x) / 2, (min.y + max.y) / 2, max.z)); //为了使标签在构件上面自己加的
            // position the label center to it
            $label.css('left', Math.floor(pos.x - $label[0].offsetWidth / 2)+ 'px');
            $label.css('top', Math.floor(pos.y - $label[0].offsetHeight / 2) + 'px');
            // $label.css('display', this.viewer.isNodeVisible(id) ? 'block' : 'none');
            // $label.css('opacity','1');
        }

    }
}

export default Autodesk.Viewing.theExtensionManager.registerExtension('TFGLabel', TFGLabel);
// this.viewer.loadExtension('IconMarkupExtension', {
//       button: {
//           icon: 'fa-thermometer-half',
//           tooltip: 'Show Temperature11'
//       },
//       icons: [
//           { dbId: 537+Math.round(Math.random()*10), label: Math.random().toFixed(2), css: 'fas fa-thermometer-full' },
//           { dbId: 111+Math.round(Math.random()*10),  label: Math.random().toFixed(2), css: 'fas fa-thermometer-full' },
//           { dbId: 21+Math.round(Math.random()*10), label: Math.random().toFixed(2), css: 'fas fa-thermometer-empty' },
//           { dbId: 1246+Math.round(Math.random()*10), label: Math.random().toFixed(2),   css: 'fas fa-exclamation-triangle' },
//       ],
//       onClick: (id) => {
//         console.log(123123)
//           this.viewer.select(id);
//           this.viewer.utilities.fitToView();
//           switch (id){
//               case 500:
//                   alert('Sensor offline');
//           }
//       }
//   })