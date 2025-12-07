"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
const inversify_1 = require("inversify");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
const responseHelpers_1 = require("./responseHelpers");
let ResponseBuilder = class ResponseBuilder {
    success(data, message = 'Operation completed successfully', statusCode = HttpStatusCode_1.HttpStatusCode.OK) {
        return (0, responseHelpers_1.successResponse)(data, message, statusCode);
    }
    error(code, message, statusCode = HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, details) {
        return (0, responseHelpers_1.errorResponse)(code, message, statusCode, details);
    }
    created(data, message = 'Resource created successfully') {
        return (0, responseHelpers_1.createdResponse)(data, message);
    }
    noContent(message = 'Operation completed successfully') {
        return (0, responseHelpers_1.noContentResponse)(message);
    }
};
exports.ResponseBuilder = ResponseBuilder;
exports.ResponseBuilder = ResponseBuilder = __decorate([
    (0, inversify_1.injectable)()
], ResponseBuilder);
//# sourceMappingURL=ResponseBuilder.js.map