//弹窗

cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    onLoad () {

    },

    initCb : function( cb ){
        this._cb = cb ;
    },

    onButtonClicked : function( event , name ){
        switch( name ){
            case 'yes' :
                if( this._cb ) this._cb();
                this.node.removeFromParent();
                break;
             case 'cancel' :
                this.node.removeFromParent();
                break;   
        }
    },
});
