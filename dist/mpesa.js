"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mpesa = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const axios_1 = __importDefault(require("axios"));
class Mpesa {
    constructor(configs) {
        this.token = "";
        configs.environment !== "production"
            ? (this.BASE_URL = "https://sandbox.safaricom.co.ke")
            : (this.BASE_URL = "https://api.safaricom.co.ke");
        this.config = configs;
        axios_1.default.defaults.baseURL = this.BASE_URL;
    }
    /**
     * Retrieves an access token with a set expiry date
     * @returns
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield axios_1.default.get(`/oauth/v1/generate?grant_type=client_credentials`, {
                headers: {
                    Authorization: "Basic " +
                        Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString("base64"),
                },
            });
            const { access_token } = req.data;
            console.log(access_token, "access_token");
            console.log(req.data, "req.data");
            this.token = access_token;
            return access_token;
        });
    }
    /**
     * C2B Operations
     */
    // 1. Register confirmation and validation urls
    registerUrls(registerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield axios_1.default.post(`/mpesa/c2b/v2/registerurl`, registerParams, {
                headers: { Authorization: "Bearer " + this.token },
            });
            return req.data;
        });
    }
    B2C(b2cTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield axios_1.default.post(`/mpesa/b2c/v1/paymentrequest`, b2cTransaction, {
                headers: { Authorization: "Bearer " + this.token },
            });
            return req.data;
        });
    }
    getAccountBalance(balanceQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            balanceQuery.CommandID = "AccountBalance"; // explicitly set this to accountbalance
            // identifier types 1 – MSISDN, 2 – Till Number, 4 – Organization short code
            balanceQuery.IdentifierType = "4";
            try {
                const req = yield axios_1.default.post(`/mpesa/accountbalance/v1/query`, balanceQuery, {
                    headers: { Authorization: "Bearer " + this.token },
                });
                if (req.status == 200) {
                    return req.data;
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    sendSTKPush(stkQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            // YYYYMMDDHHmmss
            const { amount, sender, callbackUrl, reference, description } = stkQuery;
            const now = Date.now();
            const timestamp = (0, dayjs_1.default)(now).format("YYYYMMDDHHmmss");
            const passkey = this.config.passKey;
            const password = Buffer.from(`${this.config.shortCode}${passkey}${timestamp}`).toString("base64");
            try {
                const request = yield axios_1.default.post("/mpesa/stkpush/v1/processrequest", {
                    BusinessShortCode: this.config.shortCode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: "CustomerPayBillOnline",
                    Amount: amount,
                    PartyA: sender,
                    PartyB: this.config.shortCode,
                    PhoneNumber: sender,
                    CallBackURL: callbackUrl,
                    AccountReference: reference,
                    TransactionDesc: description,
                }, {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                if (request.status == 200) {
                    return request.data;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Mpesa = Mpesa;
