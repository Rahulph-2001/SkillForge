"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escrowModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const EscrowRepository_1 = require("../../database/repositories/EscrowRepository");
exports.escrowModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.IEscrowRepository).to(EscrowRepository_1.EscrowRepository).inSingletonScope();
});
//# sourceMappingURL=escrow.bindings.js.map