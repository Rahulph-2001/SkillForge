"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventDTOSchema = void 0;
const zod_1 = require("zod");
exports.WebhookEventDTOSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.string(),
    data: zod_1.z.object({
        object: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
    }),
});
//# sourceMappingURL=WebhookEventDTO.js.map