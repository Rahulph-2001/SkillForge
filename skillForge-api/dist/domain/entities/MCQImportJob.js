"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCQImportJob = exports.ImportStatus = void 0;
const uuid_1 = require("uuid");
var ImportStatus;
(function (ImportStatus) {
    ImportStatus["PENDING"] = "PENDING";
    ImportStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ImportStatus["COMPLETED"] = "COMPLETED";
    ImportStatus["COMPLETED_WITH_ERRORS"] = "COMPLETED_WITH_ERRORS";
    ImportStatus["FAILED"] = "FAILED";
})(ImportStatus || (exports.ImportStatus = ImportStatus = {}));
class MCQImportJob {
    constructor(props) {
        this.props = {
            id: props.id || (0, uuid_1.v4)(),
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
            startedAt: props.startedAt || null,
            completedAt: props.completedAt || null,
            ...props,
            status: props.status || ImportStatus.PENDING,
            totalRows: props.totalRows || 0,
            processedRows: props.processedRows || 0,
            successfulRows: props.successfulRows || 0,
            failedRows: props.failedRows || 0,
            errorFilePath: props.errorFilePath || null,
        };
        this.validate();
    }
    validate() {
        if (!this.props.templateId)
            throw new Error('Template ID is required for import job');
        if (!this.props.adminId)
            throw new Error('Admin ID is required for import job');
        if (!this.props.filePath)
            throw new Error('File path is required for import job');
        if (!this.props.fileName)
            throw new Error('File name is required for import job');
    }
    // Getters
    get id() { return this.props.id; }
    get templateId() { return this.props.templateId; }
    get adminId() { return this.props.adminId; }
    get fileName() { return this.props.fileName; }
    get filePath() { return this.props.filePath; }
    get status() { return this.props.status; }
    get totalRows() { return this.props.totalRows; }
    get processedRows() { return this.props.processedRows; }
    get successfulRows() { return this.props.successfulRows; }
    get failedRows() { return this.props.failedRows; }
    get errorFilePath() { return this.props.errorFilePath; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    get startedAt() { return this.props.startedAt || null; }
    get completedAt() { return this.props.completedAt || null; }
    // State Transitions
    startProcessing(totalRows) {
        this.props.status = ImportStatus.IN_PROGRESS;
        this.props.startedAt = new Date();
        this.props.totalRows = totalRows;
        this.props.updatedAt = new Date();
    }
    updateProgress(processed, successful, failed) {
        this.props.processedRows = processed;
        this.props.successfulRows = successful;
        this.props.failedRows = failed;
        this.props.updatedAt = new Date();
    }
    markCompleted(errorFilePath = null) {
        const hasErrors = this.props.failedRows > 0;
        this.props.status = hasErrors ? ImportStatus.COMPLETED_WITH_ERRORS : ImportStatus.COMPLETED;
        this.props.errorFilePath = errorFilePath;
        this.props.completedAt = new Date();
        this.props.updatedAt = new Date();
    }
    markFailed() {
        this.props.status = ImportStatus.FAILED;
        this.props.completedAt = new Date();
        this.props.updatedAt = new Date();
    }
    toJSON() {
        return { ...this.props };
    }
}
exports.MCQImportJob = MCQImportJob;
//# sourceMappingURL=MCQImportJob.js.map