"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = exports.PaymentPurpose = exports.PaymentStatus = exports.PaymentProvider = void 0;
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["STRIPE"] = "STRIPE";
    PaymentProvider["PAYPAL"] = "PAYPAL";
    PaymentProvider["RAZORPAY"] = "RAZORPAY";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["SUCCEEDED"] = "SUCCEEDED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELED"] = "CANCELED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["RELEASED"] = "RELEASED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentPurpose;
(function (PaymentPurpose) {
    PaymentPurpose["SUBSCRIPTION"] = "SUBSCRIPTION";
    PaymentPurpose["CREDITS"] = "CREDITS";
    PaymentPurpose["PROJECT_POST"] = "PROJECT_POST";
})(PaymentPurpose || (exports.PaymentPurpose = PaymentPurpose = {}));
var Currency;
(function (Currency) {
    Currency["INR"] = "INR";
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
})(Currency || (exports.Currency = Currency = {}));
//# sourceMappingURL=PaymentEnums.js.map