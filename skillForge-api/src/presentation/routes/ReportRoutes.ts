import { Router } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/di/types";
import { ReportController } from "../controllers/ReportController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ENDPOINTS } from "../../config/routes";

@injectable()
export class ReportRoutes {
    public router: Router;

    constructor(
        @inject(TYPES.ReportController) private reportController: ReportController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(authMiddleware);
        this.router.post(ENDPOINTS.REPORT.ROOT, (req, res, next) => this.reportController.createReport(req, res, next));
    }
}

