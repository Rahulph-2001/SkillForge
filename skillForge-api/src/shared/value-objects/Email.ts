export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email address');
    }
    this._value = value.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}