import { resLoader } from "../common/res/ResLoader";
import LaguageInfo from "../plaza/model/LaguageInfo";
import Util from "./Util";

export default class LanguagePack {
    static instance;
    static getInstance() {
        if (!LanguagePack.instance) {
            LanguagePack.instance = new LanguagePack()
        }
        return LanguagePack.instance
    }
    private  json:JSON;
    //加载语言包
    public loadLanguage():void{
        resLoader.loadRes("plaza/config/lang_chs", cc.JsonAsset, (error: Error, res) => {
            cc.log(res.json)
            LaguageInfo.GetInstance().setData(res.json)
        });
    }
    public getLang(id:string,args:[]=null):String
    {
        if(this.json[id]!=undefined)
        {
            var result:string = this.json[id];
            if(args != null)
            {
                for(var i:number=0;i<args.length;i++)
                {
                    result=result.replace("%%"+i,args[i]);
                }
            }
            return result;
        }else
        {
            return "";
        }
    }
}