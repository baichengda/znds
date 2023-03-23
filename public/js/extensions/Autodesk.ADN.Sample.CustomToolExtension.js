class CustomToolExtension extends Autodesk.Viewing.Extension {
  constructor( viewer, options ) {
    super( viewer, options );
    this._tool = undefined;
  }
 

  load() {
    // 产生自定 Tool 实体
    this._tool = new CustomTool( this.viewer );
    // 注册自定 Tool 到 viewer.toolController 里
    this.viewer.toolController.registerTool( this._tool );
    // 透过 viewer.toolController 启动自定 Tool
    this.viewer.toolController.activateTool( 'CustomTool' );
    this._tool.handleMouseMove();
    // this._tool.handleSingleClick();

    return true;
   
  }

  // unload() {
  //   // 如果自定 Tool 有被启动的话，停止这个自定 Tool
  //   if( this._tool.isActive() ) {
  //     console.log('启动');
  //     this.viewer.toolController.deactivateTool( 'CustomTool' );
  //   }
  //   // 取消注册自定 Tool 
  //   this.viewer.toolController.deregisterTool( this._tool );
    
  //   return true;
  // }
 
}
Autodesk.Viewing.theExtensionManager.registerExtension( 'Autodesk.ADN.Sample.CustomToolExtension', CustomToolExtension );