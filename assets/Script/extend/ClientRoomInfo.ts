import { DataVO } from "../plaza/model/DataVO";


//子游戏房间数据类
export default class ClientRoomInfo {

    /*public static GetInstance() : ClientRoomInfo{
        if (ClientRoomInfo._instance == null){
            ClientRoomInfo._instance = new ClientRoomInfo();
            ClientRoomInfo._instance.data= {};
            ClientRoomInfo._instance.eventList();
        }
        return ClientRoomInfo._instance;
    }
    private static _instance = null;*/
    public data;
    static GetInstance<T extends {}>(this: new () => T): T {
        if(!(<any>this).instance){
            (<any>this).instance = new this();
            (<any>this).instance.eventList();
        }
        return (<any>this).instance;
    }
    eventList():void {

    }
    public getData():any{
        return DataVO.GD;
    }
    public setData(_data:any,child?):any{
        if(child){
            DataVO.GD[child] = Object.assign({},DataVO.GD[child],_data);
        } else {
            DataVO.GD = Object.assign({},DataVO.GD,_data);
        }
    }
}