"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingInterval = exports.SubscriptionStatus = exports.FeatureType = void 0;
var FeatureType;
(function (FeatureType) {
    FeatureType["BOOLEAN"] = "BOOLEAN";
    FeatureType["NUMERIC_LIMIT"] = "NUMERIC_LIMIT";
    FeatureType["TEXT"] = "TEXT";
})(FeatureType || (exports.FeatureType = FeatureType = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["TRIALING"] = "TRIALING";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["UNPAID"] = "UNPAID";
    SubscriptionStatus["INCOMPLETE"] = "INCOMPLETE";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var BillingInterval;
(function (BillingInterval) {
    BillingInterval["MONTHLY"] = "MONTHLY";
    BillingInterval["QUARTERLY"] = "QUARTERLY";
    BillingInterval["YEARLY"] = "YEARLY";
    BillingInterval["LIFETIME"] = "LIFETIME";
})(BillingInterval || (exports.BillingInterval = BillingInterval = {}));
//# sourceMappingURL=SubscriptionEnums.js.map