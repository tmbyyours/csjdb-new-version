// 框架消息
const gameConst = {
    GAME_PLAYER_NUM: 4,			//玩家数
    //玩家状态
    US_NULL: 0x00,			//没有状态
    US_FREE: 0x01,			//站立状态
    US_SIT: 0x02,			//坐下状态
    US_READY: 0x03,			//同意状态
    US_LOOKON: 0x04,            //旁观状态
    US_PLAYING: 0x05,			//游戏状态
    US_OFFLINE: 0x06,           //断线状态
    
    //桌子状态
    GAME_STATUS_FREE: 0, 			//空闲状态
    GAME_STATUS_PLAY: 100,			//游戏状态
    GAME_STATUS_WAIT: 200,			//等待状态
    //游戏结束原因
    GER_NORMAL: 0x00,			//常规结束
    GER_DISMISS: 0x01,			//游戏解散
    GER_USER_LEAVE: 0x02,			//用户离开
    GER_NETWORK_ERROR: 0x03,		    //网络错误
    //游戏模式
    START_MODE_ALL_READY: 0x00, 		//所有准备
    START_MODE_FULL_READY: 0x01,   		//满人开始
    START_MODE_HUNDRED: 0x02,           //百人游戏


    //请求失败类型
    KICK_TYPE: 0x01                //踢人
}
export default gameConst
