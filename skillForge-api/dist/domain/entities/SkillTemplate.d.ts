export interface SkillTemplateProps {
    id?: string;
    title: string;
    category: string;
    description: string;
    creditsMin: number;
    creditsMax: number;
    mcqCount: number;
    passRange: number;
    levels: string[];
    tags: string[];
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
}
export declare class SkillTemplate {
    private readonly props;
    constructor(props: SkillTemplateProps);
    private validate;
    get id(): string;
    get title(): string;
    get category(): string;
    get description(): string;
    get creditsMin(): number;
    get creditsMax(): number;
    get mcqCount(): number;
    get passRange(): number;
    get levels(): string[];
    get tags(): string[];
    get status(): string;
    get isActive(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    toJSON(): {
        id: string;
        title: string;
        category: string;
        description: string;
        creditsMin: number;
        creditsMax: number;
        mcqCount: number;
        passRange: number;
        levels: string[];
        tags: string[];
        status: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=SkillTemplate.d.ts.map