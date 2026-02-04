"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const di_1 = require("../../infrastructure/di/di");
const types_1 = require("../../infrastructure/di/types");
const routes_1 = require("../../config/routes");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.authMiddleware);
// Lazy load controller to avoid circular dependency
const getController = () => di_1.container.get(types_1.TYPES.SessionManagementController);
router.get(routes_1.ENDPOINTS.SESSION_MANAGEMENT.PROVIDER, (req, res, next) => getController().getProviderSessions(req, res, next));
router.post(routes_1.ENDPOINTS.SESSION_MANAGEMENT.ACCEPT, (req, res, next) => getController().acceptBooking(req, res, next));
router.post(routes_1.ENDPOINTS.SESSION_MANAGEMENT.DECLINE, (req, res, next) => getController().declineBooking(req, res, next));
router.post(routes_1.ENDPOINTS.SESSION_MANAGEMENT.CANCEL, (req, res, next) => getController().cancelBooking(req, res, next));
// Standardize to :bookingId
router.post(routes_1.ENDPOINTS.SESSION_MANAGEMENT.RESCHEDULE, (req, res, next) => getController().rescheduleBooking(req, res, next));
router.post(routes_1.ENDPOINTS.SESSION_MANAGEMENT.RESCHEDULE_ACCEPT, (req, res, next) => getController().acceptReschedule(req, res, next));
router.post(routes_1.ENDPOINTS.SESSION_MANAGEMENT.RESCHEDULE_DECLINE, (req, res, next) => getController().declineReschedule(req, res, next));
exports.default = router;
//# sourceMappingURL=sessionManagementRoutes.js.map