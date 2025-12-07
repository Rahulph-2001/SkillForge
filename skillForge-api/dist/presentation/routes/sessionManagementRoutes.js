"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const container_1 = require("../../infrastructure/di/container");
const types_1 = require("../../infrastructure/di/types");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.authMiddleware);
// Lazy load controller to avoid circular dependency
const getController = () => container_1.container.get(types_1.TYPES.SessionManagementController);
router.get('/provider', (req, res) => getController().getProviderSessions(req, res));
router.post('/:bookingId/accept', (req, res) => getController().acceptBooking(req, res));
router.post('/:bookingId/decline', (req, res) => getController().declineBooking(req, res));
router.post('/:bookingId/cancel', (req, res) => getController().cancelBooking(req, res));
router.post('/:bookingId/reschedule', (req, res) => getController().rescheduleBooking(req, res));
router.post('/:bookingId/reschedule/accept', (req, res) => getController().acceptReschedule(req, res));
router.post('/:bookingId/reschedule/decline', (req, res) => getController().declineReschedule(req, res));
exports.default = router;
//# sourceMappingURL=sessionManagementRoutes.js.map