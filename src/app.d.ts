// Request-local authenticated identity, shared by server hooks and generated route types.
declare global {
  namespace App {
    interface Locals {
      user: ReturnType<typeof import('./lib/server/auth.ts').readSession>;
    }
  }
}
export {};
