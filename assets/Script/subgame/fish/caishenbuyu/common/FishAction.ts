import { DataVO } from "../../../../plaza/model/DataVO";
import { V } from "../F_CSBY_Config";

const CALCULUS_SECTION = 1 / 100;
export let ym: {[k: string]: any} = {};

ym.getControlPointAt = function (controlPoints, pos) {
    var p = Math.min(controlPoints.length - 1, Math.max(pos, 0));
    let aa= CALCULUS_SECTION;
    return controlPoints[p];
}
 /**
 * @function
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} t
 * @return {Number}
 */
ym.bezierAt = function  (a, b, c, d, t) {
    return (Math.pow(1 - t, 3) * a +
        3 * t * (Math.pow(1 - t, 2)) * b +
        3 * Math.pow(t, 2) * (1 - t) * c +
        Math.pow(t, 3) * d );
}

ym.FishMoveTo = {};
ym.FishMoveTo.calcLength = function (st, end) {
    return cc.v2(st.x,st.y).sub(cc.v2(end.x,end.y)).mag()
};
ym.FishBezierTo = {};
ym.FishBezierTo.calcLength = function (st, c) {

    var update = function (dt) {
        var locConfig = c;
        var xa = 0;
        var xb = locConfig[0].x;
        var xc = locConfig[1].x;
        var xd = locConfig[2].x;

        var ya = 0;
        var yb = locConfig[0].y;
        var yc = locConfig[1].y;
        var yd = locConfig[2].y;

        var x = ym.bezierAt(xa, xb, xc, xd, dt);
        var y = ym.bezierAt(ya, yb, yc, yd, dt);

        return cc.v2(x, y);
    };

    var prePos = cc.v2(0, 0);
    var sum = 0;
    for (let st = 0; st <= 1; st += CALCULUS_SECTION) {
        var now = update(st);
        sum += prePos.sub(now).mag()
        prePos = now;
    }

    return sum;
}

ym.FishCatmullRomTo = {};
ym.FishCatmullRomTo.calcLength = function (st, points) {
    var deltaT = 1 / (points.length - 1);
    var tension = 0.5;
    var update = function (dt) {

        var p, lt;
        var ps = points;

        if (dt === 1) {
            p = ps.length - 1;
            lt = 1;
        } else {
            var locDT = deltaT;
            p = 0 | (dt / locDT);
            lt = (dt - locDT * p) / locDT;
        }
        var newPos = ym.cardinalSplineAt(
            ym.getControlPointAt(ps, p - 1),
            ym.getControlPointAt(ps, p - 0),
            ym.getControlPointAt(ps, p + 1),
            ym.getControlPointAt(ps, p + 2),
            tension, lt);
        return newPos;
    };


    var prePos = cc.v2(st.x,st.y);
    var sum = 0;
    for (let st = 0; st <= 1; st += CALCULUS_SECTION) {
        var now = update(st);
        sum += prePos.sub(now).mag()
        prePos = now;
    }

    return sum;
};

ym.cardinalSplineAt = function(p0, p1, p2, p3, tension, t) {
    var t2 = t * t;
    var t3 = t2 * t;

    /*
     * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
     */
    var s = (1 - tension) / 2;

    var b1 = s * ((-t3 + (2 * t2)) - t);                      // s(-t3 + 2 t2 - t)P1
    var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);          // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
    var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);      // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
    var b4 = s * (t3 - t2);                                   // s(t3 - t2)P4

    var x = (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4);
    var y = (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4);
    return cc.v2(x, y);
};

//-----------------------------------------------------------------------------------------------------------------------
/************************************************************************/
/* 时间， 圆心， 半径， 起始角度， 顺或逆， 旋转角度， 360度， 则为一个圆，                 */
//如果起始角度为0， 则起点在圆心的正上方，
/************************************************************************/
export class FishRotationAt extends cc.ActionInterval{
    _center;           //圆心
    _radius;            //半径
    _deltaAngle;        //旋转角度
    _clockwise;         //顺时针方向
    _startAngle;        //起始角度
    constructor (duration, center, radius, startAngle, clockwise = true, deltaAngle = 360) {
        super();
        this._center = center;
        this._radius = radius;
        this._startAngle = startAngle;
        this._clockwise = clockwise;
        this._deltaAngle = deltaAngle;

    }

    update (dt) {
        if (this.getTarget()) {
            var radian = (this._startAngle + this._deltaAngle * dt) / 180 * Math.PI;

            var newPos = cc.v2();

            if (this._clockwise) {
                newPos.x = this._radius * Math.sin(radian) + this._center.x;
                newPos.y = this._radius * Math.cos(radian) + this._center.y;
            }
            else {
                radian += Math.PI / 2;
                newPos.x = this._radius * Math.cos(radian) + this._center.x;
                newPos.y = this._radius * Math.sin(radian) + this._center.y;
            }


            this.getTarget().setPosition(newPos);
        }

    }
}

export let BezierImpl = function (p0, p1, p2) {
    var ax = p0.x - 2 * p1.x + p2.x;
    var ay = p0.y - 2 * p1.y + p2.y;
    var bx = 2 * (p1.x - p0.x);
    var by = 2 * (p1.y - p0.y);


    var A = 4 * (ax * ax + ay * ay);
    var B = 4 * (ax * bx + ay * by);
    var C = bx * bx + by * by;

    var t0 = Math.sqrt(C);
    var t1 = 8 * Math.pow(A, 1.5);

    var m0 = (B * B - 4 * A * C) / t1;
    var m1 = 2 * Math.sqrt(A);
    var m2 = m1 / t1;
    var ttt = (B + m1 * t0);
    var m3 = m0 * Math.log(ttt <= 0 ? 0.0000001 : ttt) - B * m2 * t0;

    var f0 = A + B;
    var f1 = A + f0;
    var temp1 = C + f0;
    var f2 = Math.sqrt(temp1 < 0 ? 0 : temp1);
    temp1 = f1 + m1 * f2;
    var f3 = Math.log(temp1 <= 0 ? 0.0000001 : temp1);

    this.mLength = m3 - m0 * f3 + m2 * f1 * f2;
    this.A = A;
    this.B = B;
    this.C = C;
    this.m0 = m0;
    this.m1 = m1;
    this.m2 = m2;
    this.m3 = m3;
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
};

BezierImpl.prototype.getLength = function () {
    return this.mLength;
};
BezierImpl.prototype.getPoint = function (t) {
    var ll = this.m3 - t * this.mLength;

    for (var i = 0; i < 7; ++i) {

        var f0 = this.A * t;
        var f1 = this.B + f0;
        var f2 = f1 + f0;
        var temp1 = this.C + t * f1;
        var f3 = Math.sqrt(temp1 < 0 ? 0 : temp1);
        temp1 = f2 + this.m1 * f3;
        var f4 = Math.log(temp1 <= 0 ? 0.0000001 : temp1);
        var f = (ll - this.m0 * f4) / f3 + this.m2 * f2;
        t -= f;
        if (Math.abs(f) < 0.01) {
            break;
        }
    }
    var c = t * t;
    var b = t + t;
    var a = 1 - b + c;
    b -= c + c;
    return {x: (a * this.p0.x + b * this.p1.x + c * this.p2.x), y: (a * this.p0.y + b * this.p1.y + c * this.p2.y)};

};

export let Bezier = function (pointCount, pArray) {

    if (pointCount < 3) {
        throw 1;
    }

    var mIndex = 0;
    var p0 = pArray[mIndex++];

    var mLength = 0;

    var mMap = [];

    for (var i = 3; i < pointCount; ++i) {

        var p1 = {x: (pArray[mIndex].x + pArray[mIndex + 1].x) / 2, y: (pArray[mIndex].y + pArray[mIndex + 1].y) / 2};

        var bezierImpl = new BezierImpl(p0, pArray[mIndex], p1);

        mMap.push({first: mLength, second: bezierImpl});
        mLength += bezierImpl.getLength();

        p0 = p1;
        mIndex++;
    }

    var bezierImpl = new BezierImpl(p0, pArray[mIndex], pArray[mIndex + 1]);
    mMap.push({first: mLength, second: bezierImpl});
    mLength += bezierImpl.getLength();
    mMap.sort(this.sortCmd);
    this.mMap = mMap;
    this.mLength = mLength;
};
Bezier.prototype.sortCmd = function (a, b) {

    return a.first - b.first;

};
Bezier.prototype.getLength = function () {

    return this.mLength;

};

Bezier.prototype.getPoint = function (t) {

    t *= this.mLength;

    var it = this.mMap[Math.max(0, this.upperBound(t) - 1)];

    t = (t - it.first) / it.second.getLength();
    return it.second.getPoint(t);
};

Bezier.prototype.upperBound = function (findKey) {

    var index;
    for (index = 0; index < this.mMap.length; ++index) {
        if (this.mMap[index].first > findKey) {
            break;
        }
    }
    return index;
};

Bezier.prototype.calcCenterArea = function () {
    var first = 0;
    var second = 0;
    var w = V.w;
    var h = V.h;
    var points = [];
    for(var i = 0; i < 1; i += 0.001){
        var middlePos = this.getPoint(i);
        if(middlePos.x > 0.15 * w && middlePos.x < 0.85 * w && middlePos.y > 0.15 * h && middlePos.y < 0.85 * h)
        {
            points.push(i);
        }
    }

    if(points.length > 1){
        first = points.shift();
        second = points.pop();
    }

    points = [];
    for(var i = first - 0.001; i < first; i += 0.0001){
        var middlePos = this.getPoint(i);
        if(middlePos.x > 0.15 * w && middlePos.x < 0.85 * w && middlePos.y > 0.15 * h && middlePos.y < 0.85 * h)
        {
            points.push(i);
        }
    }

    if(points.length > 0)
    {
        first = points.shift();
    }


    points = [];
    for(var i = second; i < second + 0.001; i += 0.0001){
        var middlePos = this.getPoint(i);
        if(middlePos.x > 0.15 * w && middlePos.x < 0.85 * w && middlePos.y > 0.15 * h && middlePos.y < 0.85 * h)
        {
            points.push(i);
        }
    }
    if(points.length > 0){
        second = points.pop();
    }

    return [first, second];
};

export class FishBezierBy extends cc.ActionInterval{
    _startPosition;
    _endPosition;
    _controlPoint1;
    _controlPoint2;
    _bezier;
    first;
    second;
    _preDt;
    curSpeed;
    constructor(speed, startPosition, endPosition, controlPoint1, controlPoint2, fishKind) {
        super();
        this._startPosition = startPosition;
        this._endPosition = endPosition;
        this._controlPoint1 = controlPoint1;
        this._controlPoint2 = controlPoint2;
        this._bezier = new Bezier(4, [startPosition, controlPoint1, controlPoint2, endPosition]);
        var centerArea = this._bezier.calcCenterArea();
        this.first = centerArea[0];
        this.second = centerArea[1];

        if(DataVO.GD.fishConfig.fishKindConfigArray[fishKind].minMultiple <= 10){
            this.first = 0;
            this.second = 1;
        }
        this.first = 0;
        this.second = 1;
        // this._super(this.getLength() / speed);
        this.setDuration(this.getLength() / speed);
    }
    getLength () {
        return this._bezier.getLength();
    }

    update (dt) {
	    var first = this.first;
	    var second = this.second - first;
	    var third = 1 - this.second;
	    var calT = dt;
	    if(!this._preDt){
	        this._preDt = dt;
        }
        if (this.getTarget()) {
            var duration =0;
            var elapse = duration * dt; //动作已经过了的时间

            //第一段
            if(elapse <= 0.1 * duration){
                var firstDuration = 0.1 * duration;
                calT = Math.pow(elapse / firstDuration, 0.4) * first;
                if(first == 0){
                    calT = dt;
                }
            }
            //第二段
            else if(elapse <= 0.9 * duration){
                var secondDuration = 0.8 * duration;
                calT = first + (elapse - 0.1 * duration) / secondDuration * second;
            }
            //第三段
            else
            {
                var thirdDuration = 0.1 * duration;
                calT = first + second + Math.pow((elapse - 0.9 * duration) / thirdDuration, 1 / 0.4) * third;
                if(third == 0){
                    calT = dt;
                }
            }

            if(calT - this._preDt < this.curSpeed){
                var preDt = calT;
                calT = this._preDt + this.curSpeed;
                this._preDt = preDt;
            }
            else{
                this.curSpeed = calT - this._preDt;
                this._preDt = calT;
            }
            this.getTarget().setPosition(this._bezier.getPoint(calT));
        }
    }
}