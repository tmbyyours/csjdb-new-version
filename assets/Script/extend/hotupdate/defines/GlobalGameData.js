/**
 * 定义本地客户端设置
 */

var global = module.exports ;

global.curGame = 'plaza';

global.init = function(){
    // Global
    window.$G = {} ;

    global._initCData();
    global._initSData();
}

global._initSData = function(){
    window.$G.gSData            = {};
    window.$G.curGame              = '';
    $G.gSData.gCData            = null ;
    $G.gSData.gRoom             = null ;
    $G.gSData.gRoomResult       = null ;
    $G.gSData.gWallet           = {}   ;
    $G.gSData.gShare            = {}   ;
    $G.gSData.gNotice           = {}   ;
    $G.gSData.gRankList         = {}   ;
    $G.gSData.gRankSelf         = {}   ;
    $G.gSData.gSids             = []   ;
    $G.gSData.gCids             = []   ;
    $G.gSData.gGroup            = null ;
    $G.gSData.Logout            = null ;
}

global._initCData = function(){
    $G.gCData                       = {};

     // COMMON
    $G.gCData.gIsLogined           = false ;
    $G.gCData.gIsGameDownloading   = {} ;

    $G.gCData.gameChecked          = {} ; // 子游戏如果更新过一次了，就不再更新了，除非重启

    // { action , value }
    $G.gCData.gMagicWindow         = null ;

    // sys
    $G.gCData.gCurrentMusic        = null ;
    $G.gCData.gNoticeAutoShowed    = false ;
    $G.gCData.gIsVoiceRecordOrPlay = false ;

    $G.gCData.gRoomLeaved   = false ;
    $G.gCData.gIsLogined           = false ;

    // { action , value }
    $G.gCData.gMagicWindow         = null ;

    // sys
    $G.gCData.gCurrentMusic        = null ;
    $G.gCData.gLastUpdateInvite    = 0    ; // time

    // Room
    $G.gCData.gAreaType            = 0 ; // 0 普通场 , 1 group nornal , 2 group match
    $G.gCData.gRoomLeaved          = false ;


    // Game
    $G.gCData.gComPlayers          = [];
    $G.gCData.gSids                = [];
    $G.gCData.gCids                = [];

    
}

