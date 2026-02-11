"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSkillModule = void 0;
const types_1 = require("../types");
const CreateSkillUseCase_1 = require("../../../application/useCases/skill/CreateSkillUseCase");
const ListUserSkillsUseCase_1 = require("../../../application/useCases/skill/ListUserSkillsUseCase");
const BrowseSkillsUseCase_1 = require("../../../application/useCases/skill/BrowseSkillsUseCase");
const GetSkillDetailsUseCase_1 = require("../../../application/useCases/skill/GetSkillDetailsUseCase");
const UpdateSkillUseCase_1 = require("../../../application/useCases/skill/UpdateSkillUseCase");
const ToggleSkillBlockUseCase_1 = require("../../../application/useCases/skill/ToggleSkillBlockUseCase");
const CreateSkillTemplateUseCase_1 = require("../../../application/useCases/skillTemplate/CreateSkillTemplateUseCase");
const ListSkillTemplatesUseCase_1 = require("../../../application/useCases/skillTemplate/ListSkillTemplatesUseCase");
const GetSkillTemplateByIdUseCase_1 = require("../../../application/useCases/skillTemplate/GetSkillTemplateByIdUseCase");
const UpdateSkillTemplateUseCase_1 = require("../../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase");
const ToggleSkillTemplateStatusUseCase_1 = require("../../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase");
const CreateTemplateQuestionUseCase_1 = require("../../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase");
const ListTemplateQuestionsUseCase_1 = require("../../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase");
const UpdateTemplateQuestionUseCase_1 = require("../../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase");
const DeleteTemplateQuestionUseCase_1 = require("../../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase");
const BulkDeleteTemplateQuestionsUseCase_1 = require("../../../application/useCases/templateQuestion/BulkDeleteTemplateQuestionsUseCase");
const StartMCQTestUseCase_1 = require("../../../application/useCases/mcq/StartMCQTestUseCase");
const SubmitMCQTestUseCase_1 = require("../../../application/useCases/mcq/SubmitMCQTestUseCase");
const MCQImportJobProcessor_1 = require("../../../application/useCases/mcq/MCQImportJobProcessor");
const StartMCQImportUseCase_1 = require("../../../application/useCases/mcq/StartMCQImportUseCase");
const ListMCQImportJobsUseCase_1 = require("../../../application/useCases/mcq/ListMCQImportJobsUseCase");
const DownloadMCQImportErrorsUseCase_1 = require("../../../application/useCases/mcq/DownloadMCQImportErrorsUseCase");
const SkillController_1 = require("../../../presentation/controllers/skill/SkillController");
const BrowseSkillsController_1 = require("../../../presentation/controllers/BrowseSkillsController");
const SkillDetailsController_1 = require("../../../presentation/controllers/skill/SkillDetailsController");
const skillRoutes_1 = require("../../../presentation/routes/skill/skillRoutes");
const browseSkillsRoutes_1 = require("../../../presentation/routes/skill/browseSkillsRoutes");
const SkillTemplateController_1 = require("../../../presentation/controllers/skillTemplate/SkillTemplateController");
const skillTemplateRoutes_1 = require("../../../presentation/routes/skillTemplate/skillTemplateRoutes");
const publicSkillTemplateRoutes_1 = require("../../../presentation/routes/skillTemplate/publicSkillTemplateRoutes");
const TemplateQuestionController_1 = require("../../../presentation/controllers/templateQuestion/TemplateQuestionController");
const templateQuestionRoutes_1 = require("../../../presentation/routes/templateQuestion/templateQuestionRoutes");
const MCQTestController_1 = require("../../../presentation/controllers/mcq/MCQTestController");
const mcqTestRoutes_1 = require("../../../presentation/routes/mcq/mcqTestRoutes");
const MCQImportController_1 = require("../../../presentation/controllers/mcq/MCQImportController");
const MCQImportRoutes_1 = require("../../../presentation/routes/mcq/MCQImportRoutes");
/**
 * Binds all skill, skill template, template question, and MCQ-related use cases, controllers, and routes
 */
const bindSkillModule = (container) => {
    // Skill Use Cases
    container.bind(types_1.TYPES.ICreateSkillUseCase).to(CreateSkillUseCase_1.CreateSkillUseCase);
    container.bind(types_1.TYPES.IListUserSkillsUseCase).to(ListUserSkillsUseCase_1.ListUserSkillsUseCase);
    container.bind(types_1.TYPES.IBrowseSkillsUseCase).to(BrowseSkillsUseCase_1.BrowseSkillsUseCase);
    container.bind(types_1.TYPES.IGetSkillDetailsUseCase).to(GetSkillDetailsUseCase_1.GetSkillDetailsUseCase);
    container.bind(types_1.TYPES.IUpdateSkillUseCase).to(UpdateSkillUseCase_1.UpdateSkillUseCase);
    container.bind(types_1.TYPES.IToggleSkillBlockUseCase).to(ToggleSkillBlockUseCase_1.ToggleSkillBlockUseCase);
    // Skill Template Use Cases
    container.bind(types_1.TYPES.CreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase_1.CreateSkillTemplateUseCase);
    container.bind(types_1.TYPES.ICreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase_1.CreateSkillTemplateUseCase);
    container.bind(types_1.TYPES.ListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase_1.ListSkillTemplatesUseCase);
    container.bind(types_1.TYPES.IListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase_1.ListSkillTemplatesUseCase);
    container.bind(types_1.TYPES.GetSkillTemplateByIdUseCase).to(GetSkillTemplateByIdUseCase_1.GetSkillTemplateByIdUseCase);
    container.bind(types_1.TYPES.IGetSkillTemplateByIdUseCase).to(GetSkillTemplateByIdUseCase_1.GetSkillTemplateByIdUseCase);
    container.bind(types_1.TYPES.UpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase_1.UpdateSkillTemplateUseCase);
    container.bind(types_1.TYPES.IUpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase_1.UpdateSkillTemplateUseCase);
    container.bind(types_1.TYPES.ToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase_1.ToggleSkillTemplateStatusUseCase);
    container.bind(types_1.TYPES.IToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase_1.ToggleSkillTemplateStatusUseCase);
    // Template Question Use Cases
    container.bind(types_1.TYPES.CreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase_1.CreateTemplateQuestionUseCase);
    container.bind(types_1.TYPES.ICreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase_1.CreateTemplateQuestionUseCase);
    container.bind(types_1.TYPES.ListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase_1.ListTemplateQuestionsUseCase);
    container.bind(types_1.TYPES.IListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase_1.ListTemplateQuestionsUseCase);
    container.bind(types_1.TYPES.UpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase_1.UpdateTemplateQuestionUseCase);
    container.bind(types_1.TYPES.IUpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase_1.UpdateTemplateQuestionUseCase);
    container.bind(types_1.TYPES.DeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase_1.DeleteTemplateQuestionUseCase);
    container.bind(types_1.TYPES.IDeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase_1.DeleteTemplateQuestionUseCase);
    container.bind(types_1.TYPES.BulkDeleteTemplateQuestionsUseCase).to(BulkDeleteTemplateQuestionsUseCase_1.BulkDeleteTemplateQuestionsUseCase);
    container.bind(types_1.TYPES.IBulkDeleteTemplateQuestionsUseCase).to(BulkDeleteTemplateQuestionsUseCase_1.BulkDeleteTemplateQuestionsUseCase);
    // MCQ Use Cases
    container.bind(types_1.TYPES.StartMCQTestUseCase).to(StartMCQTestUseCase_1.StartMCQTestUseCase);
    container.bind(types_1.TYPES.IStartMCQTestUseCase).to(StartMCQTestUseCase_1.StartMCQTestUseCase);
    container.bind(types_1.TYPES.SubmitMCQTestUseCase).to(SubmitMCQTestUseCase_1.SubmitMCQTestUseCase);
    container.bind(types_1.TYPES.ISubmitMCQTestUseCase).to(SubmitMCQTestUseCase_1.SubmitMCQTestUseCase);
    container.bind(types_1.TYPES.MCQImportJobProcessor).to(MCQImportJobProcessor_1.MCQImportJobProcessor);
    container.bind(types_1.TYPES.StartMCQImportUseCase).to(StartMCQImportUseCase_1.StartMCQImportUseCase);
    container.bind(types_1.TYPES.IStartMCQImportUseCase).to(StartMCQImportUseCase_1.StartMCQImportUseCase);
    container.bind(types_1.TYPES.ListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase_1.ListMCQImportJobsUseCase);
    container.bind(types_1.TYPES.IListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase_1.ListMCQImportJobsUseCase);
    container.bind(types_1.TYPES.DownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase_1.DownloadMCQImportErrorsUseCase);
    container.bind(types_1.TYPES.IDownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase_1.DownloadMCQImportErrorsUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.SkillController).to(SkillController_1.SkillController);
    container.bind(types_1.TYPES.BrowseSkillsController).to(BrowseSkillsController_1.BrowseSkillsController);
    container.bind(types_1.TYPES.SkillDetailsController).to(SkillDetailsController_1.SkillDetailsController);
    container.bind(types_1.TYPES.SkillRoutes).to(skillRoutes_1.SkillRoutes);
    container.bind(types_1.TYPES.BrowseSkillsRoutes).to(browseSkillsRoutes_1.BrowseSkillsRoutes);
    container.bind(types_1.TYPES.SkillTemplateController).to(SkillTemplateController_1.SkillTemplateController);
    container.bind(types_1.TYPES.SkillTemplateRoutes).to(skillTemplateRoutes_1.SkillTemplateRoutes);
    container.bind(types_1.TYPES.PublicSkillTemplateRoutes).to(publicSkillTemplateRoutes_1.PublicSkillTemplateRoutes);
    container.bind(types_1.TYPES.TemplateQuestionController).to(TemplateQuestionController_1.TemplateQuestionController);
    container.bind(types_1.TYPES.TemplateQuestionRoutes).to(templateQuestionRoutes_1.TemplateQuestionRoutes);
    container.bind(types_1.TYPES.MCQTestController).to(MCQTestController_1.MCQTestController);
    container.bind(types_1.TYPES.MCQTestRoutes).to(mcqTestRoutes_1.MCQTestRoutes);
    container.bind(types_1.TYPES.MCQImportController).to(MCQImportController_1.MCQImportController);
    container.bind(types_1.TYPES.MCQImportRoutes).to(MCQImportRoutes_1.MCQImportRoutes);
};
exports.bindSkillModule = bindSkillModule;
//# sourceMappingURL=skill.bindings.js.map