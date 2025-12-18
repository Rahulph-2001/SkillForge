export declare class TemplateQuestion {
    private readonly _id;
    private readonly _templateId;
    private readonly _level;
    private readonly _question;
    private readonly _options;
    private readonly _correctAnswer;
    private readonly _explanation;
    private readonly _isActive;
    private readonly _createdAt;
    private readonly _updatedAt;
    private constructor();
    private validate;
    static create(id: string, templateId: string, level: string, question: string, options: string[], correctAnswer: number, explanation: string | null, isActive: boolean, createdAt: Date, updatedAt: Date): TemplateQuestion;
    get id(): string;
    get templateId(): string;
    get level(): string;
    get question(): string;
    get options(): string[];
    get correctAnswer(): number;
    get explanation(): string | null;
    get isActive(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    toJSON(): {
        id: string;
        templateId: string;
        level: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=TemplateQuestion.d.ts.map