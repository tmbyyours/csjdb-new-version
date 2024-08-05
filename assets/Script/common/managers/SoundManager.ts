import { resLoader } from "../res/ResLoader";
import { EventManager } from "./EventManager";
import Util from "../../extend/Util";

const {ccclass, property} = cc._decorator;
 
@ccclass
export default class SoundManager {
    sound_path:string = 'Sound/';
    plazaSounds:{[key:number]:cc.AudioClip} = {};
    subgameSounds:{[key:number]:cc.AudioClip} = {};
    enabled:boolean = true;
    music:number = 0;
    type:string = '';
    protected static instance:SoundManager;
    private  plazajson:Array<object>;
    private  subgamejson:Array<object>;
    public static getInstance():SoundManager
    {
        if(!this.instance)
        {
            this.instance = new SoundManager();
        }
        return this.instance;
    }
    //加载音乐配置
    public loadSoundConifg(url:string):void{
        resLoader.loadRes(url, cc.JsonAsset, (error: Error, res) => {
            if(url.indexOf("plaza")>-1){
                this.plazajson = res.json
            } else {
                this.subgamejson = res.json
            }
            EventManager.getInstance().raiseEvent("loadMusicConfigOver")
        });
    }
    addSound(key:string,type:string,clip:cc.AudioClip)
    {
        this[type+"Sounds"][key] = clip;
    }
    closeSound(type:string)
    {
        this[type+"Sounds"] = {};
    }
 
    playID(ID:number,type:string)
    {
        if(!this.enabled) return; 
        if(!this[type+"json"]) return;
        let music=this[type+"json"].find((item) => {
            return item["id"] === ID;
        })
        let arr = Object.keys(this[type+"Sounds"])
        if(arr.length === 0 || arr.indexOf(music["enumName"]) <= -1){
            resLoader.loadRes(`subgame/fish/caishenbuyu/sounds/${music["enumName"]}`, cc.AudioClip, function (err, clip) {  
                SoundManager.getInstance().addSound(clip.name,'subgame',clip)
                if(music["loop"]){
                    cc.audioEngine.playMusic(SoundManager.getInstance()[type+"Sounds"][music["enumName"]], true);
                } else {
                    cc.audioEngine.play(SoundManager.getInstance()[type+"Sounds"][music["enumName"]], false,music["volume"]);
                }
                })  
        }
        else{            
            if(music["loop"]){
                cc.audioEngine.playMusic(this[type+"Sounds"][music["enumName"]], true);
            } else {
                cc.audioEngine.play(this[type+"Sounds"][music["enumName"]], false,music["volume"]);
            }
        }        
    }
    playFx(fxName:string,type:string)
    {
        if(!this.enabled) return;
        cc.audioEngine.playEffect(this[type+"Sounds"][fxName], false);
    }
 
    playMusic(musicName:number,type:string):number
    {
        this.music = musicName;
        this.type = type;
        if(!this.enabled) return;
        cc.log("playMusicplayMusic")
       
        //cc.log(this)
        //cc.log(musicName)
        //cc.log(this[type+"json"])
        //cc.log(this[type+"Sounds"])

        let music=this[type+"json"].find((item) => {
            return item["id"] === musicName;
        })
        // cc.log(music)
        // cc.log(music["enumName"])

        let arr = Object.keys(this[type+"Sounds"])
        if(arr.length === 0 || arr.indexOf(music["enumName"]) <= -1){         
            resLoader.loadRes(`subgame/fish/caishenbuyu/sounds/${music["enumName"]}`, cc.AudioClip, function (err, clip) {  
                SoundManager.getInstance().addSound(clip.name,'subgame',clip)
                cc.audioEngine.playMusic(SoundManager.getInstance()[type+"Sounds"][music["enumName"]], true);
            })    
            
        }
        else
        {   
            cc.audioEngine.playMusic(this[type+"Sounds"][music["enumName"]], true);
        }
        // return cc.audioEngine.playMusic( this[type+"Sounds"][music["enumName"]], true);
    }
 
    stopMusic()
    {
        cc.audioEngine.stopMusic();
    }
    
    setEnabled(enabled:boolean)
    {
        this.enabled = enabled;
        if(this.enabled)
        {
            this.playMusic(this.music,this.type);
        }
        else
        {
            cc.audioEngine.stopAll();
        }
    }
 
    getEnable()
    {
        return this.enabled;
    }
}