
    /**
 * 子游戏状态
 * @type {{UnInstall: number, Downloading: number, CheckUpdate: number, Loading: number, Ready: number, Playing: number}}
 */
    export let mpSubGameStatus = {
        UnCheck: 0,                 //未检查状态
        UnInstall: 1,               //未安装
        Downloading: 2,             //正在下载
        CheckUpdate: 3,             //正在检查更新
        Loading: 4,                  //正在加载
        Ready: 5,                   //已准备状态
        Playing: 6,                  //正在玩状态
        DownloadFail: 7,            //下载失败
        CheckNewVing: 8             //检测新版本状态
    }
    /**
     * 大厅事件
     * @type {{}}
     */
    export let mpEvent = {
        SubGameStatusUpdate: "SGSU",                             //子游戏状态变化通知
        SubGameUpdateFinishAndClicked: "SGUFAC",               //当子游戏处于准备状态， 并且被点击到
        EnterGameModules: "EnterGM",                              //进入游戏模块事件
        ExitGameModules: "ExitGM",                               //退出游戏模块事件

        EnterGameRoom: "EnterGR",                               //点击进入房间
        ExitGameRoom: "ExitGR",                                 //点击退出房间

        UpdateUserInfo: "UUI",                                   //更新用户信息
    }

    //退出标记
    export enum exitEnum {
        beKicked = 1,
        forceExit,
        disconnect,
        noexit
    }

    // 保险柜密码验证方式
    export let mpPasswordType = {
        Plaintext: 0,       // 纯文本密码
        Graphical: 1,       // 图形密码
    }
    //充值类型
    export let mpCZType = {
        ZFB: 1,         //支付宝
        WX: 2,          //微信
        IAP: 3,         //苹果内购
        ZFBZZ: 4,       //支付宝转账
        WXZZ: 5,        //微信转账
        WXH5:6,         //微信h5
        DAILI:7,         //代理充值
    }
    /**
     * 玩家状态常量
     * @type {{}}
     */
    export let MPUserStatusConst = {
        US_NULL: 0x00,                      //没有状态 基本就是断开了
        US_FREE: 0x01,                      //站立状态 大厅闲逛中
        US_SIT: 0x02,                       //坐下状态
        US_READY: 0x03,                     //同意状态
        US_LOOKON: 0x04,                    //旁观状态
        US_PLAYING: 0x05,                   //游戏状态
        US_OFFLINE: 0x06,                   //断线状态

        //以下状态，同步协调服用
        SIT_READY: 0x00,                    //坐下准备接受游戏服务器信息
        SIT_SUCCESS: 0x01                   //游戏服务器返回信息 表示成功
    }
    export let socketEvent = {
        SOCKET_CONNECT:"connect",
        SOCKET_DISCONNECT: "disconnect",
        SOCKET_ERROR:"error",
        SOCKET_TIMEOUT:"connect_timeout",
        SOCKET_MESSAGE:"message"
    }
    /**
     * 网络事件 必须在这声明
     * @type {{VerifyUser: string}}
     */
    export let mpNetEvent = {
        VerifyUser: "VerifyUser",                   //用户登录
        GameKind: 'GameKind', //大厅读取游戏分类
        GameList: "GameList",                       //游戏列表
        GameRoomList: "GameRoomList",              //房间列表
        KickOut: "KickOut",                         //你的号被别人顶下来， 会收到这个信息
        EnterRoom: "UserRoomIn",                    //用户进入房间
        UserRoomOut: "UserRoomOut",                  //用户离开房间
        EnterGame: "UserSitdown",                  //用户坐下,
        Logout: "Logout",                            //登出
        SignRead: "SignRead",                        //读取签到
        SignWrite: "SignWrite",                        //签到
        PayStatus: "PayStatus",                       //充值消息
        Speaker: "Speaker",                   //广播消息
        UserInfoUpdate: "UserInfoUpdate",           //用户信息更新
        GetMailList: "GetMailList",                 //得到邮箱列表
        ReadSystemMail: "ReadSystemMail",           //读取邮件
        WriteSystemMail: "WriteSystemMail",           //操作邮件
        GetRandomName: "GetRandomName",              //获取随机昵称
        PhoneReg: "PhoneReg",                           //手机注册账号
        GetScoreRank: "GetScoreRank",                 //得到分数排行 
        ModifySetup: "ModifySetup",                 //修改个人信息
        BindAccount: "BindAccount",                  //游客或QQ登录/微信登录 绑定账户 或 绑定微信 qq登录 或解绑
        VerifyTwoPassword: "VerifyTwoPassword",      //验证二级密码
        VerifyQuestion: "VerifyQuestion",               //验证密保
        BankBusiness: "BankBusiness",                   //保险柜业务
        TransferMoney: "TransferMoney",                 //打赏
        ReadVipConfig: "ReadVipConfig",                 //读取VIP配置
        QueryBusiness: "QueryBusiness",                 //查询保险柜明细
        ForgotPassword: "ForgotPassword",                //登录密码找回
        ForgotTwoPassword: "ForgotTwoPassword",                //保险柜密码找回
        GetMailListTip: "GetMailListTip",               //查询未读消息
        ReadPayConfig: "ReadPayConfig",                 //读取充值配置
        RequestPay: "RequestPay",                          //请求支付
        RequestTakeCash: "RequestTakeCash",             //请求领取现金红包
        GameRoomUsers: "GameRoomUsers",                 //请求房间的玩家列表
        UserOnlineList: "UserOnlineList",               ////通知客户端玩家列表更新玩家进入
        UsersGameStatus: "UsersGameStatus",             //用户的游戏状态改变
        RoomUserInfoUpdate: "RoomUserInfoUpdate",       //游戏房间里的用户信息更新
        SystemConfig: "SystemConfig",                   //系统配置
        SystemNotice: "SystemNotice",                    //系统公告
        EnterPlazaMain: "EnterPlazaMain",                //进入大厅MAIN界面
        CodeAddr: "CodeAddr",                              //注册码的验证地址
        GetGoodsConfig: "GetGoodsConfig",               //获取道具配置
        BuyGoods: "BuyGoods",                           //购买道具
        UpdateGoods: "UpdateGoods",                     //更新道具
        GetGoods: "GetGoods",                           //获取道具(背包)
        OpenDailyAttendance: "OpenDailyAttendance",     //开启每日签到页面
        DailyAttendance: "DailyAttendance",             //日常签到
        Jqueryrotate: "Jqueryrotate",                   //转盘抽奖
        HistoricRecord: "HistoricRecord",               //查询历史成绩

        ReadActivity: "ReadActivity",                    //读取活动
        ReadShareConfig: "ReadShareConfig",             //读取分享奖励表
        WXLoginCode: "WXLoginCode",                     //微信code
        WXWebLoginAddr: "WXWebLoginAddr",               //获取微信登录的地址
        GetLastSharePrizeDrawList: "GetLastSharePrizeDrawList",       //获取往期的分享获奖名单

        //////////////////////////////////////////////////////////////////////////////////////////////
        DuoBaoGetPrizeInfo: "DuoBaoGetPrizeInfo",       //夺宝-获取宝物信息
        DuoBaoDoDuoBao: "DuoBaoDoDuoBao",           //夺宝-夺宝操作
        DuoBaoOutDuoBao: "DuoBaoOutDuoBao",              //夺宝-退出夺宝
        DuoBaoEnterDuoBao: "DuoBaoEnterDuoBao",            //夺宝-进入夺宝
        DuoBaoUpdateInfo: "DuoBaoUpdateInfo",            //夺宝-更新宝物信息

        DuoBaoGetPrizeLog: "DuoBaoGetPrizeLog",            //夺宝-更新宝物信息
        DuoBaoGetPrizeBetStat: "DuoBaoGetPrizeBetStat",            //夺宝-更新宝物信息
        //////////////////////////////////////////////////////////////////////////////////////////////
        GenerateMobileCode: "GenerateMobileCode",           //生成手机验证码
        ///////////////////////////////////////////////////////////////////////////////////////////////
        SetRecommendGameID: "SetRecommendGameID",           //填写推荐人
        //////////////////////////////////////////////////////////////////////////////////////////////
        SetMobileVerifyLevel: "SetMobileVerifyLevel",           //设定手机验证级别， 0表示不验证， 1表示在陌生设备上登录需要验证， 2表示每次都验证
        //////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////
        ActivityRandomHongBao: "ActivityRandomHongBao",             //后台随机赠送红包活动 抢红包内容交互
        TakeActivityRechargeRebate: "TakeActivityRechargeRebate",   //领取充值天天送奖励
        TakeActivityRedPackRainLog: "TakeActivityRedPackRainLog",   //获取红包雨记录
        ScanQRLogin: "ScanQRLogin",   //扫码登录
        UseMobQuery: "UseMobQuery",     // Mob查询信息
        UseGoods: "UseGoods",           // 使用道具
        GoodsPayStatus: "GoodsPayStatus",         //充值购买道具

        //////////////////////////////////////////////////////////////////////////////////////////////
        GameRoomTables: "GameRoomTables",                          //监听请求房间所有桌子列表
        TableStatus: "TableStatus",                                //获取桌子状态
        RoomInvitation: "RoomInvitation",                            //房间邀请
        TableUuid: "TableUuid",                                      //桌子的uuid
        PayCash: "PayCash",                                  //兑换现金
        Exchange: "Exchange",                                //兑换
        ExchangeRecord: "ExchangeRecord",                    //兑换记录
        //////////////////////////////////////////////////////////////////////////////////////////////
        StoreGoods: "StoreGoods",  //摊位物品
        StoreAdd: "StoreAdd", //上架物品
        StoreDec: "StoreDec", //下架物品
        StoreGet: "StoreGet", //获取商店
        StoreBuy: "StoreBuy", //摊位购买
        StoreBatchBuy: "StoreBatchBuy", //摊位批量购买

        UserLeaveTable:"UserLeaveTable", //玩家起立，返回桌子场景

        GameServerStartTime: "GameServerStartTime", //获取服务器启动时间
        Reconnect: "Reconnect",            //断线游戏重连
        ReconnectLogin: "ReconnectLogin",  //用户断线登录

        PrettysignsGet: "PrettysignsGet", //获取靓号列表
        PrettysignBuy: "PrettysignBuy", //购买靓号
        UseExperienceCard: "UseExperienceCard", //使用体验卡
        CheckExperienceCard: "CheckExperienceCard", //查询体验卡

        //---------------------------------------sa--------------------------------------------
        SysBroadcast: "SysBroadcast",    //system broadcast
        UseBroadcast: "UseBroadcast",    //使用喇叭
        RequestSysBroadcast:"RequestSysBroadcast", //登录成功后，再请求广播
        ShareResult: "ShareResult",                        //微信 分享结果
        //
        UserPos: "UserPos",             //查询旁观用户位置
        ReadAgentPayConfig: "ReadAgentPayConfig",//读取代理配置
        ReadCustomConfig: "ReadCustomConfig",//读取客服配置
        AskPlayAchievement:"AskPlayAchievement",
        GetAchievement:"GetAchievement",

    }
