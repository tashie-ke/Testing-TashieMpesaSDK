"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mpesa_sdk_1 = require("@tashie/mpesa-sdk");
const bodyParser = __importStar(require("body-parser"));
const config = {
    consumerKey: process.env.CONSUMER_KEY || '',
    consumerSecret: process.env.CONSUMER_SECRET || '',
    environment: process.env.ENVIRONMENT || 'sandbox',
    shortCode: process.env.SHORT_CODE || '',
    passKey: process.env.PASS_KEY || '',
};
dotenv_1.default.config();
const mpesa = new mpesa_sdk_1.Mpesa(config);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
mpesa.getAccessToken()
    .then((token) => {
    // Access token obtained successfully
    console.log(`............... TOKEN ...............`, token);
})
    .catch((error) => {
    // Error occurred while obtaining the access token
    console.log(`............... ${error.message} ...............`);
});
mpesa.sendSTKPush({
    amount: 1,
    sender: "254769982944",
    reference: "test",
    callbackUrl: "https://1f3d-102-68-79-143.ap.ngrok.io/callback",
    description: "test",
}).then((response) => {
    console.log(`............... RESPONSE ...............`, response);
}).catch((error) => {
    console.log(`............... ${error} ...............`);
});
app.listen(port, () => {
    console.log(` 🔥 🔥 Server is running at http://localhost:${port}`);
});
