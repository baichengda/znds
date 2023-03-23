//视频监控 （修改参数的话直接替换camera，就可以全部替换并用于新的文件，不会冲突）
class cameraIcon extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._cameragroup = null;
        this._camerabutton = null;
        this._cameraicons = options.icons || [];
        this.updatecameraIconsCallback;
        this.modelId = 1;
    }

    load() {
        this.updatecameraIconsCallback = () => {
            // if (this._enabled) {
            //     this.updateTempIcons();
            // }
            this.updatecameraIcons();

        };

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updatecameraIconsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updatecameraIconsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, this.updatecameraIconsCallback);
        this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, this.updatecameraIconsCallback);

        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._cameragroup) {
            this._cameragroup.removeControl(this._camerabutton);
            if (this._cameragroup.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._cameragroup);
            }
        }
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updatecameraIconsCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updatecameraIconsCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT, this.updatecameraIconsCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT, this.updatecameraIconsCallback);
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._cameragroup = this.viewer.toolbar.getControl('customExtensions');
        if (!this._cameragroup) {
            this._cameragroup = new Autodesk.Viewing.UI.ControlGroup('customExtensions');
            this.viewer.toolbar.addControl(this._cameragroup);
        }

        // Add a new button to the toolbar group
        this._camerabutton = new Autodesk.Viewing.UI.Button('IconExtension');
        // this._camerabutton.onClick = (ev) => {//点击按钮触发现在不需要暂时注释掉
        //     this._enabled = !this._enabled;
        this.showTcameraIcons(true);
        this._camerabutton.setState(this._enabled ? 0 : 1);

        // };
        this._camerabutton.setToolTip(this.options.button.tooltip);
        this._camerabutton.container.children[0].classList.add('fas', this.options.button.icon);
        this._cameragroup.addControl(this._camerabutton);
    }
    showTcameraIcons(show) {

        for(let y=0;y<this._cameraicons.length;y++){
            this.modelId = this._cameraicons[0].modelId
        }


        const $viewer = $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer');

        // remove previous...
        $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer label.followButton-markup-camera').remove();
        if (!show) return;

        // do we have anything to show?
        if (this._cameraicons === undefined || this.icons === null) return;

        // do we have access to the instance tree?
        const tree = window['models'+ this.modelId]?.getInstanceTree();
        if (tree === undefined) { console.log('Loading tree...'); return; }

        const onClick = (e) => {
            if (this.options.onClick)
                this.options.onClick($(e.currentTarget).data('id'),$(e.currentTarget).data('modelid'));
        };
        const onMouseOver = (e) => {
            if (this.options.onMouseOver)
                this.options.onMouseOver($(e.currentTarget));
        };
        this._frags1 = {};
        for (var i = 0; i < this._cameraicons.length; i++) {
            // we need to collect all the fragIds for a given dbId
            const icon = this._cameraicons[i];
            this._frags1['dbId' + Number(icon.objectId)] = []
            // create the label for the dbId
            if (icon.state == 'Good') {
                var $label = $(`
                    <label class="followButton-markup-camera markup camera-update camera-normal" data-id="${Number(icon.objectId)}" data-name="${icon.devName}" data-modelId="${icon.modelId}">
                        <div >
                            <img src="./img/banqiushexiangtou_zhengchang.png" width="40" />
                        </div>
                    </label>
                `);
                $label.css('display', this.viewer.isNodeVisible(Number(icon.objectId)) ? 'block' : 'none');
                $label.on('click', onClick);
                $label.on('mouseover', onMouseOver);
            }else{
                var $label = $(`
                <label class="followButton-markup-camera markup camera-update camera-normal" data-id="${Number(icon.objectId)}" data-name="${icon.devName}">
                    <div >
                        <img src="./img/banqiushexiangtou_guzhang.png" width="40" />
                    </div>
                </label>
                `);
                $label.css('display', this.viewer.isNodeVisible(Number(icon.objectId)) ? 'block' : 'none');
                $label.on('click', onClick);
                $label.on('mouseover', onMouseOver);
            }
           


            $viewer.append($label);
            // now collect the fragIds
            const _this = this;
            tree.enumNodeFragments(Number(icon.objectId), function(fragId) {
                _this._frags1['dbId' + Number(icon.objectId)].push(fragId);
                _this.updatecameraIcons(); // re-position of each fragId found
            });
        }

    }

    getModifiedWorldBoundingBox(dbId) {
        var fragList = window['models'+ this.modelId]?.getFragmentList();
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

    updatecameraIcons() {
        //判断相机距离设置文字图标大小
        var currentView = this.viewer.autocam.getCurrentView();
        var eye = this.viewer.navigation.getEyeVector();
        var distance = eye.length();
        for (const label of $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer .camera-update')) {
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
            $label.css('left', Math.floor(pos.x - $label[0].offsetWidth / 2) + 'px');
            $label.css('top', Math.floor(pos.y - $label[0].offsetHeight / 2) + 'px');
            $label.css('display','block');
            $label.css('z-index','1');
            // $label.css('opacity','1');
        }
        if(!Vue.prototype.isShowCameraIcon){
            $('.followButton-markup-camera').css('display','none')
        }else{
            $('.followButton-markup-camera').css('display','block')
        }
    }
}

export default Autodesk.Viewing.theExtensionManager.registerExtension('cameraIcon', cameraIcon);