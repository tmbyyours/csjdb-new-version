/*
 * 客户端用户文件类
 */

import Util from "./Util";

export default class ClientUserItem{

    userID;
    gameID;
    tableID;
    chairID;
    faceID;
    nickname;
    sex;
    score;
    userStatus;
    memberOrder;
    otherInfo; 
    region;
    //其它信息 
    constructor(userInfo) {
        cc.log("--------------------------------")
        cc.log(userInfo)
        this.userID = userInfo.userID;
        this.gameID = userInfo.gameID;
        this.tableID = userInfo.tableID;
        this.chairID = userInfo.chairID;
        this.faceID = userInfo.faceID;
        this.nickname = userInfo.nickname;
        this.sex = userInfo.sex;
        this.score = userInfo.score;
        this.userStatus = userInfo.userStatus;
        this.memberOrder = userInfo.memberOrder;
        this.otherInfo = userInfo.otherInfo;            //其它信息
        this.region = userInfo.region;
    }

    /*
     * 属性信息
     */

    //用户性别
    getGender () {
        return this.sex;
    }
    //用户ID
    getUserID () {
        return this.userID;
    }
    //游戏ID
    getGameID () {
        return this.gameID;
    }

    //头像ID
    getFaceID () {
        return this.faceID;
    }
    //用户昵称
    getNickname () {
        return this.nickname;
    }


    //用户桌子
    getTableID () {
        return this.tableID;
    }
    //用户椅子
    getChairID () {
        return this.chairID;
    }
    //用户状态
    getUserStatus () {
        return this.userStatus;
    }
    //积分信息
    getUserScore () {
        return this.score;
    }

    getMemberOrder () {
        return this.memberOrder;
    }
    //其它信息
    getOtherInfo () {
        return this.otherInfo;
    }
    getRegion () {
        return this.region;
    }

}