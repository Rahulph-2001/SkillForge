export class Password {
  private readonly _value: string;

  constructor(value: string, isHashed: boolean = false) {
    if (!isHashed) {
      if (!this.isValid(value)) {
        throw new Error('Password must be at least 8 characters long');
      }
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private isValid(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }
    return password.length >= 8;
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}