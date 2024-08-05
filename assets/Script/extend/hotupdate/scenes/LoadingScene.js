cc.Class({
    extends: cc.Component,

    properties: {
        ndLoading   : cc.Node ,
        ndUpdate    : cc.Node ,

        lbPer       : cc.Label ,

        lbUuid      : cc.Label,
    },
    
    onDestroy : function(){
      
    },
    
    onLoad: function () {
      
        window.DataHelper = require('DataHelper').initHelper();
        // param
        this._loaded     = 0    ;
        this._loadMax    = 2    ;
        
        //预加载公共弹出框
        PBHelper.initHelper( ()=>{ this._onLoadDone(); });
       

        this.checkHotUpdate();

    },



    checkHotUpdate : function(){
        cc.log( '@checkhot' );
        let com = this.getComponent('ComHotUpdate');
        com.check();
    },

   

    _onLoadDone : function( id ){
        
        this._loaded ++ ;
        cc.log(this._loaded);
        if( this._loaded >= this._loadMax ){
            this.onLoadAll();
            return 
        }
    },

 
    loadGame : function(){
        this._onLoadDone();
    },


    onLoadAll : function(){
        GameHelper.loadChooseScene();
    },
    

  

    
});



