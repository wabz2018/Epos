
const axios = require('axios')
class MpesaRequests {
    sendtoMpesa(receiverPhone, postUrl, safaricomPassword, receiverBusiness, senderPassword, callBackUrl, paymentamount) {
        safaricomUrl = "",
        authenticationURL=""
        let BusinessShortCode = ""
        var milliseconds = new Date().getTime();
        let consumerKey = ""
        let consumerSecret = ""
        let token = this.generateMpesaCredentials(consumerKey, consumerSecret,authenticationURL)
        let data = {
            "BusinessShortCode": BusinessShortCode,
            "Password": senderPassword,
            "Amount": paymentamount,
            "PhoneNumber": receiverPhone,
            "Timestamp": milliseconds,
            "PartyA": receiverPhone,
            "PartyB": BusinessShortCode,
            "CallBackURL": callBackUrl,
            "AccountReference": "Invoice1",
            "TransactionDesc": "Pay",

        }
        let headers = new HttpHeaders({
            "Authorization": "Bearer" + token,
            "content-type": "application/json"
        })
        try {
            await axios.post(safaricomUrl, data, { 'headers': { 'Authorization': headers } }).then(function (response) {
                console.log(response)
                //Read your response Objects here e.g let success=response.success

            }).catch(function (error) {
                console.log(error)
            })
        }
        catch (error) {
            console.log(error)
        }
    }
    generateMpesaCredentials(consumerKey, consumerSecret, authenticationURL) {
        let token = ""
        let credentials = (consumerKey + ":" + consumerSecret).toString('base64')
        var byte = Uint8Array.from(credentials)
        let headers = new HttpHeaders({
            "Authorization": "Basic" + byte.toString,
            "content-type": "application/json"
        })
        try {
            await axios.get(authenticationURL, { 'headers': { 'Authorization': headers } }).then(
                function (response) {
                    token = response.access_token
                }).catch(function (error) {
                    console.log(error)
                })
        }
        catch (error) {
            console.log(error)
        }
        return token
    }
}