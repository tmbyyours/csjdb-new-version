import ClientUserItem from "./ClientUserItem";
import ClientKernel from "./ClientKernel";
import { EventManager } from "../common/managers/EventManager";
import { mpNetEvent } from "./MPDefine";
import UserInfo from "../plaza/model/UserInfo";

export default class GameUserManager {
    public static GetInstance() : GameUserManager{
        if (GameUserManager._instance == null){
            GameUserManager._instance = new GameUserManager();
            GameUserManager._instance.tableUserItem = []
        }
        return GameUserManager._instance;
    }

    private static _instance = null;
    tableUserItem;

    //删除用户
    deleteUserItem (clientUserItem) {
        if (clientUserItem == null || clientUserItem.getChairID() >= this.tableUserItem.length) {
            return false;
        }


        var chairID = clientUserItem.getChairID();
        if (this.tableUserItem[chairID] != clientUserItem) {
            return false;
        }
        ClientKernel.GetInstance().onUserItemDelete(clientUserItem);
        this.tableUserItem[chairID] = null;
        return true;
    }
    //创建玩家
    createNewUserItem (userInfo) {
        var userItem = new ClientUserItem(userInfo);
        this.tableUserItem[userInfo.chairID] = userItem;
        //if(userItem.userID != UserInfo.GetInstance().getData().userID){
            ClientKernel.GetInstance().onUserItemActive(userItem);
        //}
        return userItem;
    }
    /*
     *信息更新
     */
    updateUserItem (userInfo) {
        let useritem = this.getUserByUserID(userInfo.userID)
        if(useritem){
            useritem.tableID = userInfo.tableID;
            useritem.chairID = userInfo.chairID;
            useritem.userStatus = userInfo.userStatus;
            useritem.score = userInfo.score;
            this.tableUserItem[userInfo.chairID] = useritem
            return this.tableUserItem[userInfo.chairID];
        } else {
            return null
        }


    }

    //更新分数
    updateUserItemScore (clientUserItem, userScore) {
        clientUserItem.score = userScore;
    }
    //更新状态
    updateUserItemStatus (clientUserItem, statusInfo) {
        clientUserItem.tableID = statusInfo.tableID;
        clientUserItem.chairID = statusInfo.chairID;
        clientUserItem.userStatus = statusInfo.userStatus;
    }

    /*
     *查找操作
     */

    //通过游戏ID查找用户
    getUserByUserID (userID) {
        //桌子用户
        for (var i = 0; i < this.tableUserItem.length; ++i) {
            var userItem = this.tableUserItem[i];
            if ((userItem != null) && (userItem.getUserID() == userID)) {
                return userItem;
            }
        }

        return null;
    }
    //桌子玩家
    getTableUserItem (chairID) {
        return this.tableUserItem[chairID];
    }
    //通过昵称查找玩家
    getUserByGameID  (gameID) {
        //玩家用户
        for (var i = 0; i < this.tableUserItem.length; ++i) {
            var userItem = this.tableUserItem[i];
            if ((userItem != null) && (userItem.getGameID() == gameID)) {
                return userItem;
            }
        }

        return null;
    }
}