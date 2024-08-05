cc.Class({
    extends: require('CustomScene'),

    properties: {
        
    },

    start: function () {
       


    },

    

  

    onDestroy: function () {
        this._super();
       

    },

    onLoad: function () {
        this._super();

    },

    onSetting () {
        PBHelper.addNode('DlgSetting');
    }
});
