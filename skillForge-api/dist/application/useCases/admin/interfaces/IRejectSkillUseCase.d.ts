export interface RejectSkillDTO {
    skillId: string;
    adminId: string;
    reason: string;
}
export interface IRejectSkillUseCase {
    execute(data: RejectSkillDTO): Promise<void>;
}
//# sourceMappingURL=IRejectSkillUseCase.d.ts.map