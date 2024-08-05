//更新弹窗

cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    onLoad () {
        this.ndStateDown = cc.find( 'ndStateDown' , this.node );
        this.ndDownload  = cc.find( 'ndDownload'  , this.node );  // downloading
        this.pbBar       = cc.find( 'ndBar' , this.ndDownload ).getComponent( cc.ProgressBar );
    },

    initState : function( state ){

    },

    showCouldDownload ( show ) {
        this.ndStateDown.active = show ;
    },

    // num : 0 - 1 
    showDownloading( show , num ) {
        this.ndDownload.active = show ;
        if( show ) {
            this.pbBar.progress = num ;
        }
    },
});
