class CustomTool {
    constructor(viewer) {
        this._viewer = viewer;
        this._active = false;
        this._names = ['CustomTool'];
        var self = this;
        return true;
    }
    get viewer() {
        return this._viewer;
    }

    isActive() {
        return this._active;
    }

    getNames() {
        return this._names;
    }
    getName() {
        return this._names[0];
    }

    register() {}

    deregister() {}

    activate(name) {
        this._active = true;
    }

    update(highResTimestamp) {
        return false;
    }
    handleSingleClick(event, button) {
        return false;
    }

    handleMouseMove(event, button) {
        
    }
}