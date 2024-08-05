export default class LaguageInfo {
    public static GetInstance() : LaguageInfo{
        if (LaguageInfo._instance == null){
            LaguageInfo._instance = new LaguageInfo();
            LaguageInfo._instance.data= {};
        }
        return LaguageInfo._instance;
    }
    public data;
    private static _instance = null;
    public getData():any{
        return this.data
    }
    public setData(_data:any):any{
        this.data = Object.assign(this.data,_data);
    }
}