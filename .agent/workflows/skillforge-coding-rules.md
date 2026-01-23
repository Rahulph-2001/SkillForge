---
description: SkillForge API coding rules and architecture patterns - MUST follow strictly for all new features
---

# SkillForge Coding Rules & Architecture Patterns

> **CRITICAL**: These rules MUST be followed for ALL new features.

## Core Architecture: Clean Architecture (Strict)

```
Domain → Application → Infrastructure → Presentation
```

---

## 1. Project Structure

```
src/
├── domain/
│   ├── entities/{EntityName}.ts
│   ├── repositories/I{EntityName}Repository.ts
│   ├── services/I{ServiceName}.ts
│   └── errors/AppError.ts
├── application/
│   ├── dto/{feature}/{DTOName}.ts       # Zod schemas
│   ├── mappers/{EntityName}Mapper.ts
│   └── useCases/{feature}/{UseCaseName}UseCase.ts
├── infrastructure/
│   ├── database/repositories/{EntityName}Repository.ts
│   ├── services/{ServiceName}Service.ts
│   └── di/types.ts + modules/{feature}.bindings.ts
├── presentation/
│   ├── controllers/{feature}/{Name}Controller.ts
│   └── routes/{feature}/{Name}Routes.ts
└── config/messages.ts + env.ts
```

---

## 2. Entity Pattern

```typescript
export class {EntityName} {
  private readonly _id: string;
  constructor(props: Create{EntityName}Props) {
    this._id = props.id || uuidv4();
    this.validate();
  }
  private validate(): void { /* ... */ }
  public get id(): string { return this._id; }
}
```

---

## 3. DTOs with Zod

```typescript
export const Create{EntityName}Schema = z.object({
  title: z.string().min(3).max(255).trim(),
});
export type Create{EntityName}DTO = z.infer<typeof Create{EntityName}Schema>;
```

---

## 4. Use Case Pattern

```typescript
@injectable()
export class {UseCaseName}UseCase implements I{UseCaseName}UseCase {
  constructor(
    @inject(TYPES.I{EntityName}Repository) private repository: I{EntityName}Repository,
    @inject(TYPES.I{EntityName}Mapper) private mapper: I{EntityName}Mapper
  ) {}
  async execute(params): Promise<ResponseDTO> { /* ... */ }
}
```

---

## 5. Controller Pattern

```typescript
@injectable()
export class {EntityName}Controller {
  constructor(
    @inject(TYPES.I{UseCaseName}UseCase) private useCase: I{UseCaseName}UseCase,
    @inject(TYPES.IResponseBuilder) private responseBuilder: IResponseBuilder
  ) {}
  public create = async (req, res, next) => {
    try {
      const result = await this.useCase.execute(req.body);
      const response = this.responseBuilder.success(result, SUCCESS_MESSAGES.{FEATURE}.CREATED, HttpStatusCode.CREATED);
      res.status(response.statusCode).json(response.body);
    } catch (error) { next(error); }
  };
}
```

---

## 6. Messages (ALWAYS use enums)

```typescript
SUCCESS_MESSAGES.{FEATURE}.CREATED
ERROR_MESSAGES.{FEATURE}.NOT_FOUND
HttpStatusCode.OK / HttpStatusCode.CREATED / HttpStatusCode.NOT_FOUND
```

---

## 7. Checklist for New Features

- [ ] Prisma schema
- [ ] Domain entity
- [ ] Repository interface (domain) + implementation (infrastructure)
- [ ] DTOs with Zod
- [ ] Mapper interface + implementation
- [ ] Use case interface + implementation
- [ ] DI types + bindings
- [ ] Controller
- [ ] Routes
- [ ] Messages (SUCCESS + ERROR)

---

## NEVER DO

- ❌ Skip Zod validation
- ❌ Use public fields in entities
- ❌ Put logic in controllers
- ❌ Bypass ResponseBuilder
- ❌ Use hardcoded strings (use messages.ts)
- ❌ Use numeric status codes (use HttpStatusCode enum)
