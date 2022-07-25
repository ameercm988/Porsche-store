

const client = require('twilio')('ACa71340ad17b29c5e1607cd23b7d1f613', 'a8c5a5bc838058b3f05a2da28c5355f8');
const serviceSid = 'VAd9f13e296499e2af397cb2d8587e9bfe'

module.exports = {
    dosms: (noData) => {
        let res = {}
        return new Promise(async (resolve, reject) => {
            client.verify.services(serviceSid).verifications.create({
                to: `+91${noData.mobilenumber}`,
                channel: "sms"
            }).then(() => {
                resolve()
            })
        })
    },

    otpVerify: (otpData, nuData) => {
        return new Promise(async (resolve, reject) => {
            let err = 'Enter a valid OTP'
            client.verify.services(serviceSid).verificationChecks.create({
                to: `+91${nuData.mobilenumber}`,
                code: otpData.otp
            }).then((res) => {
                if (res.valid) {
                    resolve()
                } else {
                    reject(err)
                }
            }).catch(() => {
                reject()
            })
        })
    }
}