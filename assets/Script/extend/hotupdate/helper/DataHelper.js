var Crypt = require('CryptUtil').pidCryptUtil;
        
 
/**
 * initHelper
 */
function initHelper(){
    
    // debug - 必查
    // cc.sys.localStorage.removeItem("GameLocalData");

    _initGlobalData();
    _loadLocalData();  

    return module.exports ;
};


/**
 * saveAllData
 */
function saveAllData( ) {
    cc.log("saveAllData");
    
    var gameLocalData = JSON.stringify( gLocalData );
    // gameLocalData     = Crypt.encrypt( gameLocalData , "key" );
    gameLocalData     = Crypt.encodeBase64( gameLocalData , true );
    cc.sys.localStorage.setItem("GameLocalData", gameLocalData);
};


//init 全局变量
function _initGlobalData(){

    
    window._                    = require('underscore');

    require('GlobalGameData').init();

    window.GameHelper        = require('GameHelper').initHelper();
    
    window.UpdateHelper      = require('UpdateHelper');

    window.PBHelper          = require('PBHelper');

    window.CCLoaderHelper    = require('CCLoaderHelper');



};

//从本地读取数据
function _loadLocalData() {
    
    cc.log("@@@@@@loadLocalData") ;

    let _isNull = function( newParam ){
        return ( newParam == undefined || newParam == null );
    }

    let defaultData = {   
        dataVersion : 2 ,
        userInfo : 
        { 
            platform    : ''            ,  // line/wx/fb...
            account     : ''            ,
            areaCode    : '86'          ,
            phone       : ''            ,
            password    : ''            ,
            tableBg     : 0             ,
            type        : ''            ,
            bankID      : 0             ,
            agent       : ''            ,
            module      : 0             ,
            channelId   : ''            ,
            rechargeList: null          ,
            rechargeWXt : null          ,
            hotFaildNum : 0             ,
            hotFailRes  : ''             ,
        },
        sysInfo :
        {   
            shouldMusic          : true ,
            shouldEffect         : true ,
            shouldShock          : true , 
            agreeAgreement       : true ,
            rememberPassWord     : true
        },
        roomChoices : {
            nn : [ 0 , 0 ] ,
            dz : [ 0 , 0 ] ,
            bjl: [ 0 , 0 ] ,
            zjh: [ 0 , 0 ]
        }
    };     

    var data  = cc.sys.localStorage.getItem("GameLocalData"); 
    if( data != null ){
        // data = XXTea.xxtea_decrypt( data , "key" );
        data = Crypt.decodeBase64( data , true );
        data = JSON.parse(data); 
    }else{
        data = defaultData ;
    }
    
    _checkVersion( data , defaultData );

    cc.log( data );
    
    window.gLocalData = data;  
};

function _checkVersion( last , current ){
    let lastVersion = last.dataVersion ;
    let currVersion = current.dataVersion ;
    if( currVersion > lastVersion ){
        last.dataVersion = currVersion ;
        // if( currVersion == 2 ){
        //     last.roomChoices = { nn : [ 0 , 0 ] };
        // }
    }
};


module.exports = {
    initHelper      : initHelper  ,
    saveAllData     : saveAllData ,
};