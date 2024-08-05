import { FishTraceType } from "../SubGameMSG";
import { V } from "../F_CSBY_Config";
import Util from "../../../../extend/Util";

const fiveDivThree=5 / 3;
const oneDivThree=1 / 3;
export default{
    distanceSQ (p1, p2) {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    },
       /**
     * 创建鱼路径
     */
    buildFishTrace:function (fishTraceType,st) {
        //return this.fishKind;
        var trace = [];
        var stAndEnd = this.calcStAndEnd(st);
        switch (fishTraceType) {
            case FishTraceType.Linear:
                trace = stAndEnd;
                break;
            case FishTraceType.Bezier:

                trace.push(stAndEnd[0]);

                var p1 = {x: this.seededRandom(), y: this.seededRandom()};
                var p2 = {x: this.seededRandom(), y: this.seededRandom()};

                cc.log(stAndEnd);
                var d1 = this.distanceSQ(stAndEnd[0], p1) + this.distanceSQ(p1, p2) + this.distanceSQ(p2, stAndEnd[1]);
                var d2 = this.distanceSQ(stAndEnd[0], p2) + this.distanceSQ(p1, p2) + this.distanceSQ(p1, stAndEnd[1]);
                if (d1 > d2) {
                    trace.push(p2);
                    trace.push(p1);
                }
                else {
                    trace.push(p1);
                    trace.push(p2);
                }

                trace.push(stAndEnd[1]);

                break;
            case FishTraceType.CatmullRom:
                trace.push(stAndEnd[0]);
                var pNum = 3;
                for (var i = 0; i < pNum; ++i) {
                    trace.push({x: Math.random(), y: Math.random()});
                }
                trace.push(stAndEnd[1]);
                break;
            case FishTraceType.MultiLine:

                trace.push(stAndEnd[0]);
                var pNum = Math.floor(Math.random() * 2) + 2;
                for (var i = 0; i < pNum; ++i) {
                    trace.push({x: Math.random(), y: Math.random()});
                }
                trace.push(stAndEnd[1]);

                break;
        }
        return trace;
    },
     /**
     * 返回鱼起点跟终点
     */
    calcStAndEnd:function (st) {

        var dir;
       if(st.x<=V.w*-this.oneDivThree){
           dir=0;
       }else if(st.y<=V.h*-this.oneDivThree){
           dir=1;
       }else if(st.x>=V.w+V.w*this.oneDivThree){
           dir=2;
       }else if(st.y>=V.h+V.h*this.oneDivThree){
           dir=3;
       }

        st = {x: st.x/V.w, y: st.x/V.h};

        var randomRange = 0.4;
        var st, ed;
        switch (dir) {
            case 0:                 //起点左边
                if (st.y < 0.5) {
                    ed = {x: this.oneDivThree + 1, y: st.y + 0.5 + Math.random() * randomRange - randomRange / 2};
                }
                else {
                    ed = {x: this.oneDivThree + 1, y: st.y - 0.5 + Math.random() * randomRange - randomRange / 2};
                }
                break;
            case 1:                //起点在上边
                if (st.x < 0.5) {
                    ed = {x: st.x + 0.5 + Math.random() * randomRange - randomRange / 2, y: -this.oneDivThree};
                }
                else {
                    ed = {x: st.x - 0.5 + Math.random() * randomRange - randomRange / 2, y: -this.oneDivThree};
                }
                break;
            case 2:                 //起点在右边
                if (st.y < 0.5) {
                    ed = {x: -this.oneDivThree, y: st.y + 0.5 + Math.random() * randomRange - randomRange / 2};
                }
                else {
                    ed = {x: -this.oneDivThree, y: st.y - 0.5 + Math.random() * randomRange - randomRange / 2};
                }
                break;
            case 3:             //起点在下边
                if (st.x < 0.5) {
                    ed = {x: st.x + 0.5 + Math.random() * randomRange - randomRange / 2, y: 1 + this.oneDivThree};
                }
                else {
                    ed = {x: st.x - 0.5 + Math.random() * randomRange - randomRange / 2, y: 1 + this.oneDivThree};
                }
                break;
        }

        return [st, ed];
    },
    //种子随机数生成器
    seededRandom(max, min) {
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280.0;
        return min + rnd * (max - min);
    },
}
