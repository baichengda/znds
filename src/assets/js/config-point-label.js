class configPointLabel extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        // this._connectVariablegroup = null;
        // this._connectVariablebutton = null;
        this.configPointLabelData =  [];
        this.updateConfigPointLabel;
    }

    load() {
        this.updateConfigPointLabel = () => {
            // if (this._enabled) {
            //     this.updateTempIcons();
            // }
            this.updateLabels();

        };

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateConfigPointLabel);
        this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updateConfigPointLabel);
        this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, this.updateConfigPointLabel);
        this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, this.updateConfigPointLabel);

        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        // if (this._connectVariablegroup) {
        //     this._connectVariablegroup.removeControl(this._connectVariablebutton);
        //     if (this._connectVariablegroup.getNumberOfControls() === 0) {
        //         this.viewer.toolbar.removeControl(this._connectVariablegroup);
        //     }
        // }
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.updateConfigPointLabel);
        this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.updateConfigPointLabel);
        this.viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT, this.updateConfigPointLabel);
        this.viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT, this.updateConfigPointLabel);
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        // this._connectVariablegroup = this.viewer.toolbar.getControl('customExtensions');
        // if (!this._connectVariablegroup) {
        //     this._connectVariablegroup = new Autodesk.Viewing.UI.ControlGroup('customExtensions');
        //     this.viewer.toolbar.addControl(this._connectVariablegroup);
        // }

        // Add a new button to the toolbar group
        // this._connectVariablebutton = new Autodesk.Viewing.UI.Button('IconExtension');
        // this._connectVariablebutton.onClick = (ev) => {//点击按钮触发现在不需要暂时注释掉
        //     this._enabled = !this._enabled;
        // this.showConfigPointLabel(true);
        // this._connectVariablebutton.setState(this._enabled ? 0 : 1);

        // };
        // this._connectVariablebutton.setToolTip(this.options.button.tooltip);
        // this._connectVariablebutton.container.children[0].classList.add('fas', this.options.button.icon);
        // this._connectVariablegroup.addControl(this._connectVariablebutton);
    }
    showConfigPointLabel(value) {
        const $viewer = $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer');
        this.configPointLabelData = value
            // remove previous...
        $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer label.connectVariable-markup').remove();
        // if (!show) return;

        // do we have anything to show?
        if (this.configPointLabelData === undefined || this.icons === null) return;

        // do we have access to the instance tree?
        // const tree = this.viewer.model.getInstanceTree();
        // const tree = window.JDmodels && window.JDmodels.getInstanceTree();
        // if (tree === undefined) { console.log('Loading tree...'); return; }

        const onClick = (e) => {
            if (this.onClick)
                this.onClick($(e.currentTarget).data('id'), $(e.currentTarget).data('type'));
        };
        const onMouseOver = (e) => {
            if (this.options.onMouseOver)
                this.options.onMouseOver($(e.currentTarget));
        };
        this._frags1 = {};
        for (var i = 0; i < this.configPointLabelData.length; i++) {
            // we need to collect all the fragIds for a given dbId
            let icon = this.configPointLabelData[i];
            let dbid = icon.dbid
            let modelId = icon.modelId || 'JD'
            this._frags1['dbId' + dbid] = []
            const tree = window['models'+icon.modelId]?.getInstanceTree();
                // create the label for the dbId class="room-real-data"
            if (icon) {
                var $connectVariablelabel = $(`
                    <label class="connectVariable-markup markup connectVariable-update" data-id="${dbid}" data-type="${modelId}">
                        <img src="../img/connectSuccess.png" width="34" />
                    </label>
            `);
                $connectVariablelabel.css('display', this.viewer.isNodeVisible(dbid) ? 'block' : 'none');
                $connectVariablelabel.on('click', onClick);
                $connectVariablelabel.on('mouseover', onMouseOver);
            }

            $viewer.append($connectVariablelabel);
            // now collect the fragIds
            const _this = this;
            tree.enumNodeFragments(dbid, function(fragId) {
                _this._frags1['dbId' + dbid].push(fragId);
                _this.updateLabels(); // re-position of each fragId found
            });
        }

    }

    getModifiedWorldBoundingBox(dbId,type) {
        var fragList = window['models'+type]?.getFragmentList();
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

    updateLabels() {
        for (const label of $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer .connectVariable-update')) {
            const $label = $(label);
            const id = $label.data('id');
            const type = $label.data('type');
            // get the center of the dbId (based on its fragIds bounding boxes)
            const position = this.getModifiedWorldBoundingBox(id,type);
            if (!position) return;
            var min = position.min;
            var max = position.max;
            // const position = this.viewer.worldToClient(this.getModifiedWorldBoundingBox(id).center());
            const pos = this.viewer.worldToClient(new THREE.Vector3((max.x + min.x) / 2, (min.y + max.y) / 2, max.z)); //为了使标签在构件上面自己加的
            // position the label center to it
            $label.css('left', Math.floor(pos.x - $label[0].offsetWidth / 2) + 'px');
            $label.css('top', Math.floor(pos.y - $label[0].offsetHeight / 2) + 'px');
            $label.css('display','block');
            // $label.css('display', this.viewer.isNodeVisible(id) ? 'block' : 'none');
            // $label.css('opacity','1');
        }

    }
}

export default Autodesk.Viewing.theExtensionManager.registerExtension('configPointLabel', configPointLabel);