require('dotenv').config()
// console.log(process.env);

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const serviceSid = process.env.SERVICE_SID

module.exports = {
    dosms: (noData) => {
        // console.log("@@@@@@@@@@@@@@@@dosms");
        let res = {}
        return new Promise(async (resolve, reject) => {
            client.verify.services(serviceSid).verifications.create({
                to: `+91${noData.mobilenumber}`,
                channel: "sms"
            }).then(() => {
                resolve()
                // console.log("@@@@@@@@@@@@@@@@dosms resolve");
            }).catch((err) => {
                reject(err)
                // console.log("@@@@@@@@@@@@@@@@dosms reject   "+err);
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