export let subGameMSG = {

    //////////////////////////////////////////////////////////////////////////
    // 服务端命令

    SUB_S_GAME_CONFIG: 100,                                 //  游戏配置
    SUB_S_FISH_TRACE: 101,                                  //  鱼路径
    SUB_S_USER_FIRE: 103,                                   //  用户开火
    SUB_S_CATCH_FISH: 104,                                  //  捕获到鱼
    SUB_S_BULLET_ION_TIMEOUT: 105,                         //  离子炮到期了
    SUB_S_LOCK_TIMEOUT: 106,                                //  定屏到期了
    SUB_S_SWITCH_SCENE: 110,                                //  切换鱼阵
    SUB_S_START_FISH_ARRAY: 111,                            //  开始鱼阵
    SUB_S_END_FISH_ARRAY: 112,                              //  结束鱼阵
    SUB_S_REPLY_NOW_INFO: 113,                              //  回复当前界面鱼阵信息
    SUB_S_SPECIFY_ANDROID_HELP_CHAIR: 119,                 //   指定机器人代理人
    SUB_S_SYSTEM_TIP: 120,                                     // 系统提醒
    SUB_S_FIRE_FAILURE: 121,                                 //开火失败
    SUB_S_AUTO_INCREMENT: 123,                               //自动增长的鱼
    SUB_S_REAL_PLAYER_NUM: 126,                                 //真实玩家数量（仅会发给机器人）
    SUB_S_BIGFISH_TIP: 128,                                 //  boss警报
    SUB_S_CHANGE_XINPAO: 170,                                 //  切换炮返回
    SUB_S_SELECT_YUANBAO: 180,                                  //选择元宝
    SUB_S_LIANLIAN_PROGRESS: 190,                              //经验
    SUB_S_RESPONSE_LIANLIAN: 200,                                      //小游戏完成
    //////////////////////////////////////////////////////////////////////////
    //子游戏命令
    SUB_C_USER_FIRE: 2,                                       // 用户开火请求
    SUB_C_CATCH_FISH: 3,                                      //捕获到鱼
    SUB_C_CHANGE_BULLET: 4,                                     //换炮请求
    SUB_C_CLEAR_DRILLBULLET: 5,                                  //强行清除钻头炮
    SUB_C_GET_BONUS: 6,                                        //领取奖励
    SUB_C_GET_PLAERS_SCORE: 7,                                   //同步座位上玩家分数
    SUB_C_CHANGE_XINPAO: 8,                                     //切换炮
    SUB_C_SELECT_YUANBAO: 9,
    SUB_C_FINISH_LIANLIAN: 10

};

export let BonusType = {
    redbg: 0,//红包
    roulette: 1//转盘
}

//鱼的路径类别
export let FishTraceType = {
    Linear: 0,					//直线方式
    Bezier: 1,					//贝塞尔曲线
    CatmullRom: 2,             //多点曲线
    MultiLine: 3,               //多点直线， 直线间的转角用鱼旋转解决
    Count: 4,
};


//鱼类别
export let FishKind = {
    FishKind1: 0,                   //小海星
    FishKind2: 1,                   //小金魚
    FishKind3: 2,                   //小藍魚
    FishKind4: 3,                   //熱帶魚
    FishKind5: 4,                   //小丑魚
    FishKind6: 5,                   //小飛魚
    FishKind7: 6,                   //红鲤鱼
    FishKind8: 7,                   //小海馬
    FishKind9: 8,                   //小水母
    FishKind10: 9,                  //乌龟鱼
    FishKind11: 10,                 //章鱼
    FishKind12: 11,                 //灯笼鱼
    FishKind13: 12,                 //海豚
    FishKind14: 13,                 //黄金甲鱼
    FishKind15: 14,                 //剑鱼
    FishKind16: 15,                  //鲨鱼
    FishKind17: 16,                  //大水母
    FishKind18: 17,                  //蝙鲸
    FishKind19: 18,                  //黃金鯊
    FishKind20: 19,                  //金蟾
    OrganCannon: 20,                //机关炮
    DrillCannon: 21,                //钻头炮
    CenserBead: 22,                 //聚宝盆
    GodAdvent: 23,                  //财神
    GodFafa: 24,                    //红包
    LuckRun: 25,                    //财运转轮
    JuBaoLianLian: 26,              //聚宝连连
    FengBaoFuGui: 27,               //风暴福龟 prefab fish_21
    ShanDianFuGui: 28,              //闪电福龟
    BaoZhuZhaoFu: 29,               //爆竹招福
    Count: 30,                  //鱼类数量，

};

export let BulletKind = {
    BulletKind1: 0,
    BulletKind2: 1,
    BulletKind3: 2,
    BulletKind4: 3,
    BulletKind_ION_1: 4,
    BulletKind_ION_2: 5,
    BulletKind_ION_3: 6,
    BulletKind_ION_4: 7
};

/**
 * 金币类型, 代表文件名，
 * @type {{}}
 */
export let CoinKind = {
    CoinKind1: 1,
    CoinKind2: 2,
};

/**
 * 中奖转盘类型
 */
export let BingoKind = {
    BingoKind1: 0,
    BingoKind2: 1,
    BingoKind3: 2,
    Count: 3,
};

/**
 * 闪电类型
 * @type {{}}
 */
export let LightningKind = {
    LightningKind1: 0,
    LightningKind2: 1,
    LightningKind3: 2,
    Count: 3,
};

/**
 * 粒子效果类型
 */
export let EffectKind = {
    EffectKind1: 0,
    EffectKind2: 1,
    EffectKind3: 2,
    EffectKind4: 3,
    EffectKind5: 4,
    EffectKind6: 5,
    EffectKind7: 6,
    EffectKind8: 7,
    EffectKind9: 8,
    EffectKind10: 9,
    EffectKind11: 10,
};

/**
 * 鱼阵种类
 * @type {{FishArrayKind1: number, FishArrayKind2: number, FishArrayKind3: number, FishArrayKind4: number, FishArrayKind5: number, FishArrayKind6: number, FishArrayKind7: number, FishArrayKind8: number}}
 */
export let FishArrayKind = {
    FishArrayKind1: 0,
    FishArrayKind2: 1,
    FishArrayKind3: 2,
    FishArrayKind4: 3,
    FishArrayKind5: 4,
    FishArrayKind6: 5,
    FishArrayKind7: 6,
    FishArrayKind8: 7,
    FishArrayKind9: 8,
    FishArrayKind10: 9,
    FishArrayKind11: 10,
};


/**
 * 恢复场面鱼的方式
 * @type {{NormalWay: number, FishArrayWay: number}}
 */
export let ReductionFishWay = {

    NormalWay: 0,               //普通方式
    FishArrayWay: 1,            //鱼阵方式
};

/**
 * 开火失败原因
 * @type {{LessMoney: number, TooManyBullets: number}}
 */
export let FireFailureReason = {
    LessMoney: 0,               //钱太少
    TooManyBullets: 1,          //子弹发射过多
    DrillBullet: 2,             //钻头炮期间 不能开火
    BulletKindError: 3,         //子弹类型错误
};

//金币倍数
export let CoinMulConfig = [];

CoinMulConfig[CoinKind.CoinKind1] = 1;