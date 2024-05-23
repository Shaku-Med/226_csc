const CryptoJS = require('crypto-js')
const { dec, enc } = require('encmed') // my own encryption npm package
    // 
let Objects = {
    encDec(data, key, isdec) {
        try {
            if (isdec) {
                let d = CryptoJS.AES.decrypt(`${data}`, key).toString(CryptoJS.enc.Utf8)
                if (d && d !== '') {
                    let dd = CryptoJS.AES.decrypt(d, key).toString(CryptoJS.enc.Utf8)
                    if (dd) {
                        return dd
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            } else {
                let d = CryptoJS.AES.encrypt(CryptoJS.AES.encrypt(`${data}`, key).toString(), key).toString()
                return d
            }
        } catch (e) {
            return null
        }
    },
    Keys(isauth) {
        try {
            if (!isauth) {
                return {
                    a: `AqbZOe6NhMGsfkg7auUIG8SONaVi707pCwhVx06P`,
                    u: `B45xP0rXAOTNxG1f1RrANtp9SC8SkIrhHKBMQRlx`,
                    r: `PrQkXGuXCzeTnsWE9ClNTVEXZveQT1dznnmjlWy1`,
                    isAuth: false
                }
            } else {
                return {
                    a: `BAPUhrG6P2Xmuy2zMKCa3TOyD0mE6q`,
                    l: `njsD2OpLEXlYdhXDs35sQDq8fGuVaC3IwWjlS0IWZ2D7VaMXA660ptq4YXnG`,
                    r: `U4Rn516U4Rn516RwZsxC5JEtRqiRwi`,
                    p: `66M9Oq0B8y4MtLbuZDxEOEPlYs1qM9Oq0B8y4Mki`,
                    isAuth: true

                }
            }
        } catch {
            return null
        }
    }
}

module.exports = {
    Objects
}
