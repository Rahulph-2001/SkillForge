export class TemplateQuestion {
  private constructor(
    private readonly _id: string,
    private readonly _templateId: string,
    private readonly _level: string,
    private readonly _question: string,
    private readonly _options: string[],
    private readonly _correctAnswer: number,
    private readonly _explanation: string | null,
    private readonly _isActive: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._question || this._question.trim().length < 10) {
      throw new Error('Question must be at least 10 characters long');
    }

    if (!this._options || this._options.length !== 4) {
      throw new Error('Must provide exactly 4 options');
    }

    if (this._correctAnswer < 0 || this._correctAnswer > 3) {
      throw new Error('Correct answer must be between 0 and 3');
    }

    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validLevels.includes(this._level)) {
      throw new Error('Invalid level. Must be Beginner, Intermediate, or Advanced');
    }
  }

  static create(
    id: string,
    templateId: string,
    level: string,
    question: string,
    options: string[],
    correctAnswer: number,
    explanation: string | null,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ): TemplateQuestion {
    return new TemplateQuestion(
      id,
      templateId,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      isActive,
      createdAt,
      updatedAt
    );
  }

  get id(): string {
    return this._id;
  }

  get templateId(): string {
    return this._templateId;
  }

  get level(): string {
    return this._level;
  }

  get question(): string {
    return this._question;
  }

  get options(): string[] {
    return this._options;
  }

  get correctAnswer(): number {
    return this._correctAnswer;
  }

  get explanation(): string | null {
    return this._explanation;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      templateId: this._templateId,
      level: this._level,
      question: this._question,
      options: this._options,
      correctAnswer: this._correctAnswer,
      explanation: this._explanation,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
