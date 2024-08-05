// 框架消息
const gameCMD = {
    // 登入命令
    MDM_GR_LOGON: 1, // 登入主命令
    // 请求
    SUB_GR_LOGON_ACCOUNTS: 1, // 帐号登入
    // 返回
    SUB_GR_LOGON_SUCCESS: 100, // 登录成功
    SUB_GR_LOGON_FAILURE: 101, // 登录失败
    // 用户命令
    MDM_GR_USER: 2, // 用户主命令
    // 请求
    SUB_GR_USER_SIT_DOWN: 1, // 坐下命令
    SUB_GR_USER_STANDUP: 2, // 起立命令
    // 返回
    SUB_GR_USER_STATUS: 100, // 用户状态
    SUB_GR_USER_ENTER: 101, // 用户进入
    SUB_GR_USER_SCORE: 102, // 用户金币
    // 游戏命令
    MDM_GF_GAME: 3, // 游戏主命令
  
    // 用户命令
    SUB_GF_GAME_OPTION: 1, // 游戏配置
    SUB_GF_USER_READY: 2, // 用户准备
    
    // 框架命令
    MDM_GF_FRAME: 4, // 框架主命令
    SUB_GF_GAME_STATUS: 100, // 游戏状态
    SUB_GF_GAME_SCENE: 101, // 游戏场景
    SUB_GF_ROOM_INFO: 103, // 房间信息

    SUB_GF_FORCE_CLOSE: 105, // 强制关闭窗口
    SUB_GF_REQUEST_FAILURE: 106, // 请求失败

    SUB_GF_TOAST_MSG: 108, // tip消息
    SUB_GF_FISH_NOTICE: 111, // 捕鱼消息， 用于 同房间不同桌子之间的类似公告的通知， 放在框架这占个坑， 防止后面框架用于111
    SUB_GF_RECONNECT: 150, // 断线重连
    SUB_GF_NOTICE_TIMEOUT: 160,      //长时间未操作提示
    SUB_GF_KICK_TIMEOUT: 161,        //长时间未操作踢出
}
export default gameCMD
