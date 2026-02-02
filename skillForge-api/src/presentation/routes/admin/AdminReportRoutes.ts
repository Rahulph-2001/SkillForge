import { Router } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/di/types";
import { AdminReportController } from "../../controllers/admin/AdminReportController";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";

@injectable()
export class AdminReportRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.AdminReportController) private adminReportController: AdminReportController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.use(adminMiddleware);

        this.router.get("/", (req, res, next) => this.adminReportController.listReports(req, res, next));
        this.router.patch("/:reportId/resolution", (req, res, next) => this.adminReportController.manageReport(req, res, next));
    }
}
