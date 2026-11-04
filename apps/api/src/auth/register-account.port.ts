import type { RegisterAccountPersistenceInput } from './register.types';

export const REGISTER_ACCOUNT_PORT = Symbol('REGISTER_ACCOUNT_PORT');

export interface RegisterAccountPort {
  createRegisteredAccount(input: RegisterAccountPersistenceInput): Promise<void>;
}
