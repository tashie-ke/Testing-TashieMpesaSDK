import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Mpesa } from '@tashie/mpesa-sdk';
import * as bodyParser from "body-parser"
import { STKQuery } from '@tashie/mpesa-sdk/dist/interfaces';

const config= {
    consumerKey:process.env.CONSUMER_KEY || '',
    consumerSecret:process.env.CONSUMER_SECRET || '',
    environment:  process.env.ENVIRONMENT || 'sandbox',
    shortCode:  process.env.SHORT_CODE || '',
    passKey: process.env.PASS_KEY || '',
} 
dotenv.config();

const mpesa = new Mpesa(config);

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

mpesa.getAccessToken()
  .then((token: any) => {
    // Access token obtained successfully
    console.log(`............... TOKEN ...............`, token);
  })
  .catch((error: any) => {
    // Error occurred while obtaining the access token
    console.log(`............... ${error.message} ...............`);
  });



mpesa.sendSTKPush({
    amount: 1,
    sender: "254769982944",
    reference: "test",
    callbackUrl: "https://1f3d-102-68-79-143.ap.ngrok.io/callback",
    description: "test",
}).then((response: STKQuery) => {
      console.log(`............... RESPONSE ...............`, response);
}).catch((error: any) => {
    console.log(`............... ${error} ...............`);
});


app.listen(port, () => {
  console.log(` 🔥 🔥 Server is running at http://localhost:${port}`);
});