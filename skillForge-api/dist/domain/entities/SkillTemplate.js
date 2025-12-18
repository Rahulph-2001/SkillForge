"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillTemplate = void 0;
class SkillTemplate {
    constructor(props) {
        this.props = {
            ...props,
            // Don't generate ID here - let Prisma/database generate UUID
            createdAt: props.createdAt || new Date(),
            updatedAt: props.updatedAt || new Date(),
            isActive: props.isActive ?? true,
            passRange: props.passRange || 70,
            status: props.status || 'Active',
        };
        this.validate();
    }
    validate() {
        if (!this.props.title || this.props.title.trim().length === 0) {
            throw new Error('Skill template title is required');
        }
        if (!this.props.category || this.props.category.trim().length === 0) {
            throw new Error('Category is required');
        }
        // Description is optional - can be added by users when creating skills from template
        // if (!this.props.description || this.props.description.trim().length === 0) {
        //   throw new Error('Description is required');
        // }
        if (this.props.creditsMin < 0) {
            throw new Error('Minimum credits must be non-negative');
        }
        if (this.props.creditsMax < this.props.creditsMin) {
            throw new Error('Maximum credits must be greater than or equal to minimum credits');
        }
        if (this.props.mcqCount < 0) {
            throw new Error('MCQ count must be non-negative');
        }
        if (this.props.passRange < 0 || this.props.passRange > 100) {
            throw new Error('Pass range must be between 0 and 100');
        }
        if (!Array.isArray(this.props.levels) || this.props.levels.length === 0) {
            throw new Error('At least one level must be specified');
        }
    }
    get id() {
        return this.props.id;
    }
    get title() {
        return this.props.title;
    }
    get category() {
        return this.props.category;
    }
    get description() {
        return this.props.description;
    }
    get creditsMin() {
        return this.props.creditsMin;
    }
    get creditsMax() {
        return this.props.creditsMax;
    }
    get mcqCount() {
        return this.props.mcqCount;
    }
    get passRange() {
        return this.props.passRange;
    }
    get levels() {
        return [...this.props.levels];
    }
    get tags() {
        return [...this.props.tags];
    }
    get status() {
        return this.props.status;
    }
    get isActive() {
        return this.props.isActive;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            category: this.category,
            description: this.description,
            creditsMin: this.creditsMin,
            creditsMax: this.creditsMax,
            mcqCount: this.mcqCount,
            passRange: this.passRange,
            levels: this.levels,
            tags: this.tags,
            status: this.status,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.SkillTemplate = SkillTemplate;
//# sourceMappingURL=SkillTemplate.js.map