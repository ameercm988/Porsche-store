// const async = require('hbs/lib/async');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')('AC4d4fd6cac826d0c73c130f3c8bbb8e90','c0bb4d3ae742e73b7026044d41864d3f');

// client.verify.services('VAb7deb9cc0ed69121035032300b21b18f')
//              .verifications
//              .create({to: '+919048086615', channel: 'sms'})
//              .then(verification => console.log(verification.sid));

const client = require('twilio')('ACa71340ad17b29c5e1607cd23b7d1f613','a8c5a5bc838058b3f05a2da28c5355f8');
const serviceSid='VAd9f13e296499e2af397cb2d8587e9bfe'

             module.exports={
                dosms:(noData)=>{
                    // console.log(noData);
                    let res={}
                    return new Promise(async(resolve,reject)=>{
                        client.verify.services(serviceSid).verifications.create({
                            to :`+91${noData.mobilenumber}`,
                            channel:"sms"
                        }).then(()=>{
                            console.log('twiliopundeyy');
                            // res.valid=true;
                            resolve()
                            // console.log(res);
                        })
                    })
                },
                otpVerify:(otpData,nuData)=>{
                    console.log("otpverify");
                    console.log(otpData);
                    console.log(nuData);
                    // let res={}
                    return new Promise(async(resolve,reject)=>{
                        let err = 'Enter a valid OTP'
                        client.verify.services(serviceSid).verificationChecks.create({
                            to:   `+91${nuData.mobilenumber}`,
                            code:otpData.otp
                        }).then((res)=>{
                            // console.log("verification success");
                            // console.log(resp);
                            if (res.valid) {
                                console.log('valid otp');
                                console.log(res.valid);
                                resolve()
                            }else{
                                console.log('Non-valid otp');
                                console.log(err);
                                reject(err)
                            }
                            
                        }).catch(() => {
                            reject()
                        })
                    })
                }

             }