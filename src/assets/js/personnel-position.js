class personnelPosition extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._connectVariablegroup = null;
        this._connectVariablebutton = null;
        this._connectVariableIconJDs =  [];
        this.personnelPositionCallback;
        this.onClick = null
    }

    load() {
        this.personnelPositionCallback = () => {
            // if (this._enabled) {
            //     this.updateTempIcons();
            // }
            this.updateLabel();

        };

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.personnelPositionCallback);
        this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.personnelPositionCallback);
        this.viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, this.personnelPositionCallback);
        this.viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, this.personnelPositionCallback);

        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._connectVariablegroup) {
            this._connectVariablegroup.removeControl(this._connectVariablebutton);
            if (this._connectVariablegroup.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._connectVariablegroup);
            }
        }
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.personnelPositionCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.personnelPositionCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.HIDE_EVENT, this.personnelPositionCallback);
        this.viewer.removeEventListener(Autodesk.Viewing.SHOW_EVENT, this.personnelPositionCallback);
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
        // this.showLabel(true);
        // this._connectVariablebutton.setState(this._enabled ? 0 : 1);

        // };
        // this._connectVariablebutton.setToolTip(this.options.button.tooltip);
        // this._connectVariablebutton.container.children[0].classList.add('fas', this.options.button.icon);
        // this._connectVariablegroup.addControl(this._connectVariablebutton);
    }
    
    showLabel(value) {
        const $viewer = $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer');
            // remove previous...
        $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer label.position-update').remove();
        // if (!show) return;

        // do we have anything to show?
        if (!value.length) return;

        // do we have access to the instance tree?
        // const tree = this.viewer.model.getInstanceTree();
        const tree = window.models0 && window.models0.getInstanceTree();
        if (tree === undefined) { console.log('Loading tree...'); return; }
        var onClick = (e) => {
            console.log(this)
            if (this.onClick)
                this.onClick($(e.currentTarget).data('id'),$(e.currentTarget).data('floor'));
        };
        
        const onMouseOver = (e) => {
            if (this.options.onMouseOver)
                this.options.onMouseOver($(e.currentTarget));
        };
        this._frags1 = {};
        for (var i = 0; i < value.length; i++) {
            // we need to collect all the fragIds for a given dbId
            const icon = value[i];
            let userId = icon.USER_ID
            let userName = icon.USER_NAME
            let floor = icon.MAP_ID
            let position = icon.POSITION
            let color = icon.COLOR
            this._frags1['dbId' + userId] = []
                // create the label for the dbId class="room-real-data"
            if (icon) {
                var $label = $(`
                    <label class="markup position-update" data-floor="${floor}" id="${floor}-${userId}" data-id="${userId}" data-pos='${position}'>
                        <div class="content" style="background-color:${color || 'rgb(218 14 14)'};">
                            <span style="background: #fff;display: inline-block;width: 0.5625rem;height: 0.5625rem;border-radius: 50%"></span>
                        </div>
                        <div style="
                            color: #fff;
                            position: absolute;
                            top: -20px; 
                            left: 50%;
                            width: auto;
                            white-space: nowrap;
                            height: 20px;
                            line-height: 20px;
                            border-radius: 4px;
                            padding: 0 6px;
                            transform: translateX(-50%);
                            background-color:${color || 'rgb(218 14 14)'}"
                        >${userName}<div>
                    </label>
                `);
                // $connectVariablelabel.css('display', this.viewer.isNodeVisible(dbid) ? 'block' : 'none');
                $label.on('click', onClick);
                $label.on('mouseover', onMouseOver);
            }

            $viewer.append($label);
            this.updateLabel()
            
        }

    }

    updateLabel() {
        for (const label of $('#' + this.viewer.clientContainer.id + ' div.adsk-viewing-viewer .position-update')) {
            const $label = $(label);
            const id = $label.data('id');
            const pos1 = ($label.data('pos')).split(',');
            // let pos = pos1.split(',');
            // console.log(pos)
            const pos = this.viewer.worldToClient(new THREE.Vector3(pos1[0], pos1[1], pos1[2])); //为了使标签在构件上面自己加的
            // position the label center to it
            $label.css('left', Math.floor(pos.x - $label[0].offsetWidth / 2) + 'px');
            $label.css('top', Math.floor(pos.y - $label[0].offsetHeight / 2) + 'px');
            $label.css('display', this.viewer.isNodeVisible(id) ? 'block' : 'none');
        }

    }
}

export default Autodesk.Viewing.theExtensionManager.registerExtension('personnelPosition', personnelPosition);