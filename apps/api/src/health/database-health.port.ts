export interface DatabaseHealthPort {
  assertReachable(): Promise<void>;
}

export const DATABASE_HEALTH_PORT = Symbol('DATABASE_HEALTH_PORT');
