"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = exports.ReportStatus = exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["USER_REPORT"] = "USER_REPORT";
    ReportType["PROJECT_DISPUTE"] = "PROJECT_DISPUTE";
    ReportType["COMMUNITY_CONTENT"] = "COMMUNITY_CONTENT";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "PENDING";
    ReportStatus["REVIEWING"] = "REVIEWING";
    ReportStatus["RESOLVED"] = "RESOLVED";
    ReportStatus["DISMISSED"] = "DISMISSED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
class Report {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new Report(props);
    }
    get id() {
        return this.props.id;
    }
    get reporterId() {
        return this.props.reporterId;
    }
    toJSON() {
        return { ...this.props };
    }
}
exports.Report = Report;
//# sourceMappingURL=Report.js.map