"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
const BookingController_1 = require("../controllers/BookingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
let BookingRoutes = class BookingRoutes {
    constructor(bookingController) {
        this.bookingController = bookingController;
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(authMiddleware_1.authMiddleware);
        this.router.post('/', this.bookingController.createBooking);
        this.router.get('/my-bookings', this.bookingController.getMyBookings);
        this.router.get('/upcoming', this.bookingController.getUpcomingSessions);
        this.router.get('/:id', this.bookingController.getBookingById);
        this.router.patch('/:id/cancel', this.bookingController.cancelBooking);
    }
};
exports.BookingRoutes = BookingRoutes;
exports.BookingRoutes = BookingRoutes = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.BookingController)),
    __metadata("design:paramtypes", [BookingController_1.BookingController])
], BookingRoutes);
//# sourceMappingURL=bookingRoutes.js.map