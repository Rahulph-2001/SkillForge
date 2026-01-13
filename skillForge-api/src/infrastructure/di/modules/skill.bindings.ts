import { Container } from 'inversify';
import { TYPES } from '../types';
import { CreateSkillUseCase } from '../../../application/useCases/skill/CreateSkillUseCase';
import { ICreateSkillUseCase } from '../../../application/useCases/skill/interfaces/ICreateSkillUseCase';
import { ListUserSkillsUseCase } from '../../../application/useCases/skill/ListUserSkillsUseCase';
import { IListUserSkillsUseCase } from '../../../application/useCases/skill/interfaces/IListUserSkillsUseCase';
import { BrowseSkillsUseCase } from '../../../application/useCases/skill/BrowseSkillsUseCase';
import { IBrowseSkillsUseCase } from '../../../application/useCases/skill/interfaces/IBrowseSkillsUseCase';
import { GetSkillDetailsUseCase } from '../../../application/useCases/skill/GetSkillDetailsUseCase';
import { IGetSkillDetailsUseCase } from '../../../application/useCases/skill/interfaces/IGetSkillDetailsUseCase';
import { UpdateSkillUseCase } from '../../../application/useCases/skill/UpdateSkillUseCase';
import { IUpdateSkillUseCase } from '../../../application/useCases/skill/interfaces/IUpdateSkillUseCase';
import { ToggleSkillBlockUseCase } from '../../../application/useCases/skill/ToggleSkillBlockUseCase';
import { IToggleSkillBlockUseCase } from '../../../application/useCases/skill/interfaces/IToggleSkillBlockUseCase';
import { CreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/CreateSkillTemplateUseCase';
import { ICreateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/ICreateSkillTemplateUseCase';
import { ListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/ListSkillTemplatesUseCase';
import { IListSkillTemplatesUseCase } from '../../../application/useCases/skillTemplate/interfaces/IListSkillTemplatesUseCase';
import { UpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase';
import { IUpdateSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/IUpdateSkillTemplateUseCase';
import { DeleteSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase';
import { IDeleteSkillTemplateUseCase } from '../../../application/useCases/skillTemplate/interfaces/IDeleteSkillTemplateUseCase';
import { ToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase';
import { IToggleSkillTemplateStatusUseCase } from '../../../application/useCases/skillTemplate/interfaces/IToggleSkillTemplateStatusUseCase';
import { CreateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase';
import { ICreateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/interfaces/ICreateTemplateQuestionUseCase';
import { ListTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase';
import { IListTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/interfaces/IListTemplateQuestionsUseCase';
import { UpdateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase';
import { IUpdateTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/interfaces/IUpdateTemplateQuestionUseCase';
import { DeleteTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase';
import { IDeleteTemplateQuestionUseCase } from '../../../application/useCases/templateQuestion/interfaces/IDeleteTemplateQuestionUseCase';
import { BulkDeleteTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/BulkDeleteTemplateQuestionsUseCase';
import { IBulkDeleteTemplateQuestionsUseCase } from '../../../application/useCases/templateQuestion/interfaces/IBulkDeleteTemplateQuestionsUseCase';
import { StartMCQTestUseCase } from '../../../application/useCases/mcq/StartMCQTestUseCase';
import { IStartMCQTestUseCase } from '../../../application/useCases/mcq/interfaces/IStartMCQTestUseCase';
import { SubmitMCQTestUseCase } from '../../../application/useCases/mcq/SubmitMCQTestUseCase';
import { ISubmitMCQTestUseCase } from '../../../application/useCases/mcq/interfaces/ISubmitMCQTestUseCase';
import { MCQImportJobProcessor } from '../../../application/useCases/mcq/MCQImportJobProcessor';
import { StartMCQImportUseCase } from '../../../application/useCases/mcq/StartMCQImportUseCase';
import { IStartMCQImportUseCase } from '../../../application/useCases/mcq/interfaces/IStartMCQImportUseCase';
import { ListMCQImportJobsUseCase } from '../../../application/useCases/mcq/ListMCQImportJobsUseCase';
import { IListMCQImportJobsUseCase } from '../../../application/useCases/mcq/interfaces/IListMCQImportJobsUseCase';
import { DownloadMCQImportErrorsUseCase } from '../../../application/useCases/mcq/DownloadMCQImportErrorsUseCase';
import { IDownloadMCQImportErrorsUseCase } from '../../../application/useCases/mcq/interfaces/IDownloadMCQImportErrorsUseCase';
import { SkillController } from '../../../presentation/controllers/skill/SkillController';
import { BrowseSkillsController } from '../../../presentation/controllers/BrowseSkillsController';
import { SkillDetailsController } from '../../../presentation/controllers/skill/SkillDetailsController';
import { SkillRoutes } from '../../../presentation/routes/skill/skillRoutes';
import { BrowseSkillsRoutes } from '../../../presentation/routes/skill/browseSkillsRoutes';
import { SkillTemplateController } from '../../../presentation/controllers/skillTemplate/SkillTemplateController';
import { SkillTemplateRoutes } from '../../../presentation/routes/skillTemplate/skillTemplateRoutes';
import { PublicSkillTemplateRoutes } from '../../../presentation/routes/skillTemplate/publicSkillTemplateRoutes';
import { TemplateQuestionController } from '../../../presentation/controllers/templateQuestion/TemplateQuestionController';
import { TemplateQuestionRoutes } from '../../../presentation/routes/templateQuestion/templateQuestionRoutes';
import { MCQTestController } from '../../../presentation/controllers/mcq/MCQTestController';
import { MCQTestRoutes } from '../../../presentation/routes/mcq/mcqTestRoutes';
import { MCQImportController } from '../../../presentation/controllers/mcq/MCQImportController';
import { MCQImportRoutes } from '../../../presentation/routes/mcq/MCQImportRoutes';

/**
 * Binds all skill, skill template, template question, and MCQ-related use cases, controllers, and routes
 */
export const bindSkillModule = (container: Container): void => {
  // Skill Use Cases
  container.bind<ICreateSkillUseCase>(TYPES.ICreateSkillUseCase).to(CreateSkillUseCase);
  container.bind<IListUserSkillsUseCase>(TYPES.IListUserSkillsUseCase).to(ListUserSkillsUseCase);
  container.bind<IBrowseSkillsUseCase>(TYPES.IBrowseSkillsUseCase).to(BrowseSkillsUseCase);
  container.bind<IGetSkillDetailsUseCase>(TYPES.IGetSkillDetailsUseCase).to(GetSkillDetailsUseCase);
  container.bind<IUpdateSkillUseCase>(TYPES.IUpdateSkillUseCase).to(UpdateSkillUseCase);
  container.bind<IToggleSkillBlockUseCase>(TYPES.IToggleSkillBlockUseCase).to(ToggleSkillBlockUseCase);
  
  // Skill Template Use Cases
  container.bind<CreateSkillTemplateUseCase>(TYPES.CreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase);
  container.bind<ICreateSkillTemplateUseCase>(TYPES.ICreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase);
  container.bind<ListSkillTemplatesUseCase>(TYPES.ListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase);
  container.bind<IListSkillTemplatesUseCase>(TYPES.IListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase);
  container.bind<UpdateSkillTemplateUseCase>(TYPES.UpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase);
  container.bind<IUpdateSkillTemplateUseCase>(TYPES.IUpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase);
  container.bind<DeleteSkillTemplateUseCase>(TYPES.DeleteSkillTemplateUseCase).to(DeleteSkillTemplateUseCase);
  container.bind<IDeleteSkillTemplateUseCase>(TYPES.IDeleteSkillTemplateUseCase).to(DeleteSkillTemplateUseCase);
  container.bind<ToggleSkillTemplateStatusUseCase>(TYPES.ToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase);
  container.bind<IToggleSkillTemplateStatusUseCase>(TYPES.IToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase);
  
  // Template Question Use Cases
  container.bind<CreateTemplateQuestionUseCase>(TYPES.CreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase);
  container.bind<ICreateTemplateQuestionUseCase>(TYPES.ICreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase);
  container.bind<ListTemplateQuestionsUseCase>(TYPES.ListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase);
  container.bind<IListTemplateQuestionsUseCase>(TYPES.IListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase);
  container.bind<UpdateTemplateQuestionUseCase>(TYPES.UpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase);
  container.bind<IUpdateTemplateQuestionUseCase>(TYPES.IUpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase);
  container.bind<DeleteTemplateQuestionUseCase>(TYPES.DeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase);
  container.bind<IDeleteTemplateQuestionUseCase>(TYPES.IDeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase);
  container.bind<BulkDeleteTemplateQuestionsUseCase>(TYPES.BulkDeleteTemplateQuestionsUseCase).to(BulkDeleteTemplateQuestionsUseCase);
  container.bind<IBulkDeleteTemplateQuestionsUseCase>(TYPES.IBulkDeleteTemplateQuestionsUseCase).to(BulkDeleteTemplateQuestionsUseCase);
  
  // MCQ Use Cases
  container.bind<StartMCQTestUseCase>(TYPES.StartMCQTestUseCase).to(StartMCQTestUseCase);
  container.bind<IStartMCQTestUseCase>(TYPES.IStartMCQTestUseCase).to(StartMCQTestUseCase);
  container.bind<SubmitMCQTestUseCase>(TYPES.SubmitMCQTestUseCase).to(SubmitMCQTestUseCase);
  container.bind<ISubmitMCQTestUseCase>(TYPES.ISubmitMCQTestUseCase).to(SubmitMCQTestUseCase);
  container.bind<MCQImportJobProcessor>(TYPES.MCQImportJobProcessor).to(MCQImportJobProcessor);
  container.bind<StartMCQImportUseCase>(TYPES.StartMCQImportUseCase).to(StartMCQImportUseCase);
  container.bind<IStartMCQImportUseCase>(TYPES.IStartMCQImportUseCase).to(StartMCQImportUseCase);
  container.bind<ListMCQImportJobsUseCase>(TYPES.ListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase);
  container.bind<IListMCQImportJobsUseCase>(TYPES.IListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase);
  container.bind<DownloadMCQImportErrorsUseCase>(TYPES.DownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase);
  container.bind<IDownloadMCQImportErrorsUseCase>(TYPES.IDownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase);
  
  // Controllers & Routes
  container.bind<SkillController>(TYPES.SkillController).to(SkillController);
  container.bind<BrowseSkillsController>(TYPES.BrowseSkillsController).to(BrowseSkillsController);
  container.bind<SkillDetailsController>(TYPES.SkillDetailsController).to(SkillDetailsController);
  container.bind<SkillRoutes>(TYPES.SkillRoutes).to(SkillRoutes);
  container.bind<BrowseSkillsRoutes>(TYPES.BrowseSkillsRoutes).to(BrowseSkillsRoutes);
  container.bind<SkillTemplateController>(TYPES.SkillTemplateController).to(SkillTemplateController);
  container.bind<SkillTemplateRoutes>(TYPES.SkillTemplateRoutes).to(SkillTemplateRoutes);
  container.bind<PublicSkillTemplateRoutes>(TYPES.PublicSkillTemplateRoutes).to(PublicSkillTemplateRoutes);
  container.bind<TemplateQuestionController>(TYPES.TemplateQuestionController).to(TemplateQuestionController);
  container.bind<TemplateQuestionRoutes>(TYPES.TemplateQuestionRoutes).to(TemplateQuestionRoutes);
  container.bind<MCQTestController>(TYPES.MCQTestController).to(MCQTestController);
  container.bind<MCQTestRoutes>(TYPES.MCQTestRoutes).to(MCQTestRoutes);
  container.bind<MCQImportController>(TYPES.MCQImportController).to(MCQImportController);
  container.bind<MCQImportRoutes>(TYPES.MCQImportRoutes).to(MCQImportRoutes);
};

