/* getAcessToken  middleware*/
function getAccessToken(req: Request, res: Response, next: any) {
    mpesa.getAccessToken().then((response) => {
        req.access_token = response.access_token;
        next();
    }).catch((error) => {
        console.log(error);
    });
}

/* register url middleware */



app.get('/getAccessToken', getAccessToken, async (req: Request, res: Response) => {
    try {
        const response = await mpesa.getAccessToken();
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});

/* register url */
app.get('/registerUrl',getAccessToken, async (req: Request, res: Response) => {
    try {
        
        const response = await mpesa.registerUrls({
            ShortCode: "600977",
        ResponseType: "Completed",
        ConfirmationURL: "https://20ef-102-68-79-143.ap.ngrok.io/confirmation",
        ValidationURL: "https://20ef-102-68-79-143.ap.ngrok.io/validation",
        })
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});

/* stk push */
app.get('/stkPush',getAccessToken, async (req: Request, res: Response) => {
    try {
        const response = await mpesa.sendSTKPush({
            amount: 1,
        sender: "254769982944",
        reference: "test",
        callbackUrl: "https://20ef-102-68-79-143.ap.ngrok.io/callback",
        description: "test",
        })
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});

/* acc bal */
app.get('/accBal', async (req: Request, res: Response) => {
    try {
        const response = await mpesa.getAccountBalance({
            PartyA: 600000,
            Remarks: "test",
            Initiator: "",
            SecurityCredential: " https://20ef-102-68-79-143.ap.ngrok.io/callback",
            QueueTimeOutURL: "https://20ef-102-68-79-143.ap.ngrok.io/callback",
            ResultURL: ""
        })
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});