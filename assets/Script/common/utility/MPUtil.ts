import SystemToast from "../../extend/ui/SystemToast";
import Util from "../../extend/Util";


//大厅工具类
export default class MPUtil{
    /**
    * 判断gameID是否合法
    * @param gameID
    */
    public static gameIDIsLegal = function (gameID) {
        if (!gameID.match(/^[0-9]{6,8}$/)) {
            SystemToast.GetInstance().buildToast("gameID不合法");
            return false;
        }
        return true;
    };
    /**
     * 判断账号是否合法
     * @param account
     */
    public static accountIsLegal = function (account) {
        if (!account) {
            SystemToast.GetInstance().buildToast("账号不能为空");
            return false;
        }
        if (account.length < 6) {
            SystemToast.GetInstance().buildToast("账号不可低于6位数");
            return false;
        }
        if (account.length > 20) {
            SystemToast.GetInstance().buildToast("账号不可大于20位");
            return false;
        }
        if (!account.match(/^[0-9a-zA-Z_]{6,20}$/)) {
            SystemToast.GetInstance().buildToast("账号只能使用数字、字母、下划线, 6-20位");
            return false;
        }
        return true;
    };
    /**
     * 验证邮箱是否合法
     * @param email
     * @returns {boolean}
     */
    public static emailIsLegal = function (email) {
        if (!email.match(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/)) {
            SystemToast.GetInstance().buildToast("请赶写规范的邮箱");
            return false;
        }
        return true;
    };
    /**
     * 验证码是否合法
     * @param code
     */
    public static codeIsLegal = function (code) {
        if (code.length < 4) {
            SystemToast.GetInstance().buildToast("验证码不合法");
            return false;
        }
        return true;
    };
    /**
     * 判断昵称是否合法
     * @param nickname
     * @returns {boolean}
     */
    public static nicknameIsLegal = function (nickname) {
        if (!nickname) {
            SystemToast.GetInstance().buildToast("昵称不能为空");
            return false;
        }
        if (nickname.match(/\s/)) {
            SystemToast.GetInstance().buildToast("昵称不能包含非可见字符");
            return false;
        }
        //含有不合法的字符
        if (nickname.match(/\"|\'|\;|\:|\,|\{|\}|\[|\]|\)|\(/gi)) {
            SystemToast.GetInstance().buildToast("昵称含有不合法的字符");
            return false;
        }
        //昵称不能为纯数字
        if (nickname.match(/^[0-9]*$/gi)) {
            SystemToast.GetInstance().buildToast("昵称不能为纯数字");
            return false;
        }
        if (Util.getByteLen(nickname) > 16) {
            SystemToast.GetInstance().buildToast("昵称过长");
            return false;
        }
        return true;
    };
    /**
     * 判断密码是否合法
     * @param pwd
     * @returns {boolean}
     */
    public static passwordIsLegal = function (pwd) {
        if (!pwd.match(/^\S{6,20}$/) || (pwd.length != ttutil.getByteLen(pwd))) {
            SystemToast.GetInstance().buildToast("密码长度必须在6到20, 且不包含非法字符");
            return false;
        }
    
        return true;
    };
}