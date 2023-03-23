//会议室标签 （修改参数的话直接替换showRoomIcon，就可以全部替换并用于新的文件，不会冲突）
class showRoomIconIcon extends Autodesk.Viewing.Extension {
        constructor(viewer, options) {
            super(viewer, options);
            this._showRoomIcongroup = null;
            this._showRoomIconbutton = null;
            this._showRoomIconicons = options.icons || [];
            this.updateshowRoomIconIconsCallback;
        }

        load() {
            this.updateshowRoomIconIconsCallback = () => {
                // if (this._enabled) {
                //     this.updateTempIcons();
                // }
                this.updateshowRoomIconIcons();

            };

            this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateshowRoomIconIconsCallback);
            this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updateshowRoomIconIconsCallback);
            this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, this.updateshowRoomIconIconsCallback);
            this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, this.updateshowRoomIconIconsCallback);

            return true;
        }

        unload() {
            // Clean our UI elements if we added any
            if (this._showRoomIcongroup) {
                this._showRoomIcongroup.removeControl(this._showRoomIconbutton);
                if (this._showRoomIcongroup.getNumberOfControls() === 0) {
                    this.viewer.toolbar.removeControl(this._showRoomIcongroup);
                }
            }
            this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateshowRoomIconIconsCallback);
            this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updateshowRoomIconIconsCallback);
            this.viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT, this.updateshowRoomIconIconsCallback);
            this.viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT, this.updateshowRoomIconIconsCallback);
            return true;
        }

        onToolbarCreated() {
            // Create a new toolbar group if it doesn't exist
            this._showRoomIcongroup = this.viewer.toolbar.getControl('customExtensions');
            if (!this._showRoomIcongroup) {
                this._showRoomIcongroup = new Autodesk.Viewing.UI.ControlGroup('customExtensions');
                this.viewer.toolbar.addControl(this._showRoomIcongroup);
            }

            // Add a new button to the toolbar group
            this._showRoomIconbutton = new Autodesk.Viewing.UI.Button('IconExtension');
            // this._showRoomIconbutton.onClick = (ev) => {//点击按钮触发现在不需要暂时注释掉
            //     this._enabled = !this._enabled;
            this.showTshowRoomIconIcons(true);
            this._showRoomIconbutton.setState(this._enabled ? 0 : 1);

            // };
            this._showRoomIconbutton.setToolTip(this.options.button.tooltip);
            this._showRoomIconbutton.container.children[0].classList.add('fas', this.options.button.icon);
            this._showRoomIcongroup.addControl(this._showRoomIconbutton);

        }

        showTshowRoomIconIcons(show) {
                const $viewer = $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer');

                // remove previous...
                $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer label.showRoomIcon-markup').remove();
                if (!show) return;

                // do we have anything to show?
                if (this._showRoomIconicons === undefined || this.icons === null) return;

                // do we have access to the instance tree?
                // const tree = window.JZmodels && window.JZmodels.getInstanceTree();
                // if (tree === undefined) { console.log('Loading tree...'); return; }

                const onClick = (e) => {
                    if (this.options.onClick)
                        this.options.onClick($(e.currentTarget).data('id'), $(e.currentTarget).data('name'),$(e.currentTarget).data('roomid'));
                };
                const dbClick = (e) => {
                    if (this.options.dbClick){
                        
                        this.options.dbClick($(e.currentTarget).data('id'), e.target);
                    }
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
                for (var i = 0; i < this._showRoomIconicons.length; i++) {
                    // we need to collect all the fragIds for a given dbId
                    let icon = this._showRoomIconicons[i];
                    var _dbid = icon?.dbId || icon?.dbid;
                    var room_name = icon?.sname;
                    var rmNumber = icon?.rmNumber || ''
                    var room_id = icon?.dbId;
                    let btnData = icon?.value || []
                    this._frags1['dbId' + _dbid] = []
                        // create the label for the dbId
                    const tree = window['models'+icon.modelId] && window['models'+icon.modelId].getInstanceTree();
                    if (tree === undefined) { console.log('Loading tree...'); return; }
                    if (icon?.sname) {
                        var $label = $(`
                            <label class="showRoomIcon-markup" style="width:1px" data-id="${_dbid}" data-name="${room_name}" data-modeltype="${icon.modelId}"
                            data-roomid="${room_id}">
                                <div class="xitong-icons" style="position: absolute;bottom: 0;left: -30px;width: auto;white-space: nowrap;">
                                    <div style="position: absolute;left:0;bottom: 100px;width: auto;white-space: nowrap;z-index:2">
                                    ${btnData.map(item => `
                                        <div class="room-real-data">${item.variable_name}:${(item?.value*1).toFixed(1)}</div>
                                    `).join('')}
                                    </div>
                                    <div class="room-icon-bg" style="">
                                        ${room_name+' '+rmNumber}
                                    </div>
                                    <div class="room-vertical-bar"></div>
                                </div>
                            </label>
                        `);
                        // $label.css('display', this.viewer.isNodeVisible(_dbid) ? 'block' : 'none');
                        $label.css('display','block');
                        $label.on('click', onClick);
                        $label.on('dblclick', dbClick);
                        $label.on('mouseover', onMouseOver);
                    }else{ //如果隐藏房间，只显示房间上的变量
                        var $label = $(`
                            <label class="showRoomIcon-markup" style="width:1px" data-id="${_dbid}" data-name="${room_name}">
                                <div class="xitong-icons" style="position: absolute;bottom: 0;left: -30px;width: auto;white-space: nowrap;">
                                    ${btnData.map(item => `
                                        <div class="room-real-data">${item.variable_name}:${(item?.value*1).toFixed(1)}</div>
                                    `).join('')}
                                </div>
                            </label>
                        `);
                    }
            $viewer.append($label);
            // now collect the fragIds
            const _this = this;
            tree.enumNodeFragments(_dbid, function(fragId) {
                _this._frags1['dbId' + _dbid].push(fragId);
                _this.updateshowRoomIconIcons(); // re-position of each fragId found
            });

        }

    }

    getModifiedWorldBoundingBox(dbId,modelId) {
        var fragList = window['models'+modelId]?.getFragmentList();
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

    updateshowRoomIconIcons() {
        for (const label of $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer .showRoomIcon-markup')) {
            const $label = $(label);
            const id = $label.data('id');
            const modelId = $label.data('modeltype');
            // get the center of the dbId (based on its fragIds bounding boxes)
            if (!this._frags1.hasOwnProperty(['dbId' + id])) return; //因为dbid变化时旋转相机会报错，所以加上这句了
            const position = this.getModifiedWorldBoundingBox(id,modelId);
            if (!position) return;
            var min = position.min;
            var max = position.max;
            // const position = this.viewer.worldToClient(this.getModifiedWorldBoundingBox(id).center());
            const pos = this.viewer.worldToClient(new THREE.Vector3((max.x + min.x) / 2, (min.y + max.y) / 2, max.z)); //为了使标签在构件上面自己加的
            // position the label center to it
            $label.css('left', Math.floor(pos.x - $label[0].offsetWidth / 2) + 'px');
            $label.css('top', Math.floor(pos.y - $label[0].offsetHeight / 2) + 'px');
            // $label.css('display', this.viewer.isNodeVisible(id) ? 'block' : 'none');
            // $label.css('opacity','1');
        }

    }
}

export default Autodesk.Viewing.theExtensionManager.registerExtension('showRoomIconIcon', showRoomIconIcon);
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