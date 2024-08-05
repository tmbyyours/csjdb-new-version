import { FishKind } from "./SubGameMSG";

//设计分辨率
export let V = {
    w: 1280,
    h: 720,
};

export let PING_INTERVAL = 3;       //ping间隔时间为3秒
//滚轮滑动比例
//export let GScrollRatio = 120;

//是否启动加分数动画， 易斗蓝鲸不启用
export let GAddScoreAni = true;

//游戏自定义事件
export let GGameEvent = {
    ON_CLICK_SETTING_BUTTON: "onClickSettingButton",
    ON_CLICK_HELP_BUTTON: "onClickHelpButton",
    ON_CLICK_AUTO_FIRE_BUTTON: "onClickAutoFireButton",
    ON_CLICK_CANCEL_AUTO_FIRE_BUTTON: "onClickCancelAutoFireButton",
    ON_CLICK_CLOSE_GAME_BUTTON: "onClickCloseGameButton",
    ON_CLICK_SETTLEMENT_BUTTON: "onClickSettlementButton",
    ON_AUTO_FIRE_CHANGE: "onAutoFireChange",
    ///////////////////////////////////////////////////////////////////////////
    ON_CLICK_ADD_MUL: "onClickAddMul",                               //点击加炮
    ON_CLICK_SUB_MUL: "onClickSubMul",                               //点击减炮
    /////////////////////////////////////////////////////////////////////////////
    ON_MOBILE_LOCK_FISH: "onMobileLockFish",               //当手机端点击锁鱼按钮
    ON_MOBILE_LOCK_FISH_FINISH: "onMobileLockFishFinish",         //当手机端锁鱼完成
    ON_CLICK_LOCK_FISH: "onLockFish",                               //锁鱼
    ON_CLICK_UNLOCK_FISH: "onUnlockFish",                           //解锁
    ON_CLICK_RANDOM_LOCK_FISH: "onRandomLockFish",            //锁定其他鱼
    ON_IS_LOCK_FISH_CHANGE: "onIsLockFishChange",                   //当是否是锁鱼状态发生改变
    /////////////////////////////////////////////////////////////////////////////////
    ON_ENTER_RAGE_MODE: "onEnterRageMode",                      //点击狂暴模式
    ON_EXIT_RAGE_MODE: "onExitRageMode",                    //点击取消狂暴模式
    ON_ENTER_SPEED_MODE: "onEnterSpeedMode",                //点击极速模式
    ON_EXIT_SPEED_MODE: "onExitSpeedMode",                  //点击取消极速模式
    /////////////////////////////////////////////////////////////////////////////////
};

// 玩家数量
export let GPlayerNum = 4;

export let GCannonPosArray;

//做成函数， 方便另一个地方调用 。。。
export let fixGcannonPosArray = function () {
    GCannonPosArray = [
        {pos: cc.v2(V.w * 0.3, V.h - 48), rotation: 180},        //0
        {pos: cc.v2(V.w * 0.7, V.h - 48), rotation: 180},    //1
        {pos: cc.v2(V.w * 0.7, 48), rotation: 0},  //2
        {pos: cc.v2(V.w * 0.3, 48), rotation: 0},          //3
    ];
};
fixGcannonPosArray();

export let GFontDef = {
    fontName: "黑体",
    fontSize: 22,
    fillStyle: cc.color(66, 209, 244, 255)
};

export let GCoinConfig = {
    maxCoinLevelMul: 100,   //最大金币级别的打中鱼倍数
    stdCoinNum: 5,          //标准金币数量， 如果不足， 则会拆大的金币换成小的金币补上
    delayTime: 0.8,          //逗留时间
    flySpeed: 1000,         //飞行速度
};


export let musicRes = {
    BGM_1: 1001,
    BGM_2: 1002,
    BGM_3: 1003
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//鱼帧数
export let GFishDieAniDT = 1;//鱼死亡动画播放一秒
//鱼正常动画帧数， 跟死亡动画帧数
export let GFishKindAnimationFN = [];
GFishKindAnimationFN[FishKind.FishKind1] = {armName:"fish_1",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind2] = {armName:"fish_2",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind3] = {armName:"fish_3",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind4] = {armName:"fish_4",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind5] = {armName:"fish_5",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind6] = {armName:"fish_6",speed:1,scale:1.5}; 
GFishKindAnimationFN[FishKind.FishKind7] = {armName:"fish_7",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind8] = {armName:"fish_8",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind9] = {armName:"fish_9",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind10] = {armName:"fish_10",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind11] = {armName:"fish_11",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind12] = {armName:"fish_12",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind13] = {armName:"fish_13",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind14] = {armName:"fish_14",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind15] = {armName:"fish_15",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind16] = {armName:"fish_16",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind17] = {armName:"fish_17",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind18] = {armName:"fish_18",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind19] = {armName:"fish_19",speed:1,scale:1.5};
GFishKindAnimationFN[FishKind.FishKind20] = {armName:"fish_20",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.OrganCannon] = {armName:"OrganCannon",speed:1,scale:1.35};
GFishKindAnimationFN[FishKind.DrillCannon] = {armName:"DrillCannon",speed:1,scale:1.35};
GFishKindAnimationFN[FishKind.CenserBead] = {armName:"CenserBead",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.GodAdvent] = {armName:"GodAdvent",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.GodFafa] = {armName:"GodFafa",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.LuckRun] = {armName:"LuckRun",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.JuBaoLianLian] = {armName:"LuckRun",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.FengBaoFuGui] = {armName:"LuckRun",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.ShanDianFuGui] = {armName:"LuckRun",speed:1,scale:1.4};
GFishKindAnimationFN[FishKind.BaoZhuZhaoFu] = {armName:"LuckRun",speed:1,scale:1.4};

export let GPlayerColor = [
    cc.color(114, 198, 243, 255),
    cc.color(36, 89, 173, 255),

    cc.color(110, 232, 133, 255),
    cc.color(156, 92, 187, 255),

    cc.color(199, 122, 35, 255),
    cc.color(255, 80, 80, 255),

    cc.color(173, 36, 129, 255),
    cc.color(158, 119, 57, 255),
];

export let GPlayerScoreBackColor = [

    cc.color(0x40, 0x20, 0xff, 0xa0),
    cc.color(0xff, 0x80, 0x00, 0xa0),

    cc.color(0x80, 0xff, 0x00, 0xa0),
    cc.color(0xff, 0x00, 0xff, 0xa0),

    cc.color(0xff, 0xff, 0x00, 0xa0),
    cc.color(0xff, 0x00, 0x00, 0xa0),

    cc.color(0x02, 0x24, 0x59, 0xad),
    cc.color(0xad, 0x24, 0x81, 0xa0),
];

//锁鱼背景及魔能炮卡片的转动角度， 每秒 0.75圈
export let GRotateAngle = Math.PI * 1.5;
//锁鱼及魔能炮， 背景的转动半径
export let GRotateRadius = 10;


////捕鱼声音配置，当打中对应FishKind的鱼时， 播放配置中的一种声音（以鱼ID为随机种子， 产生随机数， 确定播放哪一种）
export let GFishDieSound = [];

//30秒 客户端没动作就要关掉
export let GNotActionCloseGameTime = 30;

//流逝60秒后就提示
export let GNotActionCloseGameHintTime = 60;

////锁鱼配置
//export let GLockFishConfig = {
//    bubbleInterval: null,               //泡泡间隔大小
//};

export let FireSoundInterval = 120;            //120ms

//最大金币柱上限
export let GMaxJettonNum = 4;

//最大全服公告消息条数
export let GMaxNoticeNum = 2;
//公告消逝时间
export let GNoticeDieOut = 5;

//金币柱消逝时间
export let GJettonDieOut = 3;

//转盘持续时间
export let GPrizeDuration = 3;

//是否支持锁鱼
export let GSupperLockFish = true;

//是否显示分数背景框
export let GScoreBGColor = true;

//锁鱼泡泡是否颜色不一样
export let GLockPaoPaoColor = true;

//发射角度偏移量, 用于狂暴模式,第一个一定要是0
export let GFireRotation = [0, -30, 30];

//是否开影子
export let GOpenShadow = true;

//影子系数
export let GShadowFac = 0.2;

//间隔几帧检测一次
export let GCDFrameInterval = 5;

if(typeof (G_PLATFORM_TV) == "undefined")
     var G_PLATFORM_TV = false;
if(typeof (G_OPEN_CONNECT_SERVER) == "undefined")
    var G_OPEN_CONNECT_SERVER = true;

//获取鱼的资源路径前缀
export let getFishPreName = function (fishKind) {
    return "#res/likuipiyu/fish/fish" + (fishKind + 1);
}

export let GameResPreName = "res/likuipiyu/";

export let getFishNode = function (fishKind) {
    let fish
    switch (fishKind) {
    }

    return fish;
};