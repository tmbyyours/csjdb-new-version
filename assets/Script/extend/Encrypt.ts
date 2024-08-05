import Util from "./Util"

const uuidKey = '6d6254a8-1b74-4c24-80d2-f6e6c687c7f9'

export default {// 定义一些方法
    MD5 (data):string {
        if (typeof data !== 'string') {
            data = JSON.stringify(data)
        }
        return CryptoJS.MD5(data).toString()
    },

    xor (data, key) {
        let result = ''

        let length = key.length

        let array = [63, 31, 15, 7, 3, 1]

        for (let i = 0; i < array.length; i++) {
            if (length > array[i]) {
                length = array[i]
                break
            }
        }

        for (let j = 0; j < data.length; j++) {
            let charCode = data.charCodeAt(j) ^ key.charCodeAt(j & length)
            if (charCode !== 0) { result += String.fromCharCode(charCode) } else { result += data[j] }
        }

        return result
    },
    xorEncode (data, key) {
        return this.xor(JSON.stringify(data), key)
    },
    xorDecode (data, key) {
        return JSON.parse(this.xor(data, key))
    },
    xorWord (data, key) {
        let result = ''

        let length = key.length

        let array = [63, 31, 15, 7, 3, 1]

        for (let i = 0; i < array.length; i++) {
            if (length > array[i]) {
                length = array[i]
                break
            }
        }

        for (let i = 0; i < data.length; i++) {
            let charCode = data.charCodeAt(i) ^ key.charCodeAt(i & length)

            if ((charCode >= 48 && charCode <= 48 + 9) || (charCode >= 65 && charCode <= 65 + 25) || (charCode >= 97 && charCode <= 97 + 25)) {
                result += String.fromCharCode(charCode)
                continue
            }

            let words:string = '_-'
            for (let index = 0;index<words.length;index++) {
                if (words.charCodeAt(index) === charCode) {
                    words = null
                    result += String.fromCharCode(charCode)
                    break
                }
            }

            if (words == null) { continue }

            result += data[i]
        }

        return result
    },
    xorWordEncode (data, key) {
        return this.xorWord(JSON.stringify(data), key)
    },
    xorWordDecode (data, key) {
        return JSON.parse(this.xorWord(data, key))
    },
    packetEvent (eventName, key) {
        if (typeof key !== 'string') {
            key = uuidKey
        }
        return this.xor(eventName, key)
    },

    packetEvent2 (eventName) {
        return this.MD5(eventName)
    },
    packetData (data, socket) {
        data = data || {}
        cc.log("msgID:" +  socket.msgID)
        socket.msgID = socket.msgID == null ? 1 : socket.msgID + 1
        cc.log(socket.msgID)
        let key = uuidKey
        cc.log(data)
        let message:object ={}
        message["data"] = data
        message["msgID"] = socket.msgID
        message["_sign"]= this.MD5(message)
        return this.xorEncode(message, key)
    },
    decryptData (message, socket) {
        if (!message || typeof message !== 'string') {
            console.error('数据包类型错误', message)
            return null
        }

        let key = uuidKey

        try {
            message = JSON.parse(message)
            message = this.xorDecode(message, key)

            if (message.msgID <= socket.msgID) {
                console.error('数据包msgID错误', message)
                return null
            }

            socket.msgID = message.msgID

            let _sign = message._sign
            delete message._sign

            if (_sign !== this.MD5(message)) {
                console.error('数据包签名错误', _sign, message)
                return null
            }

            return message.data
        } catch (err) {
            console.error('数据包错误', err)
        }
        return null
    },
    packetData2 (data) {
        data = data || {}
        let key = uuidKey

        let message = {
        }
        // @ts-ignore
        message.data = data
        // @ts-ignore
        message._sign = this.MD5(message)
        return this.xorEncode(message, key)
    },
    decryptData2 (message) {
        if (!message || typeof message !== 'string') {
            console.error('数据包类型错误', message)
            return null
        }

        try {
            let key = uuidKey

            message = this.xorDecode(message, key)

            let _sign = message._sign
            delete message._sign

            if (_sign !== this.MD5(message)) {
                console.error('数据包签名错误', _sign, message)
                return null
            }

            return message.data
        } catch (err) {
            console.error('数据包错误zzz', err)
        }

        return null
    }
}
