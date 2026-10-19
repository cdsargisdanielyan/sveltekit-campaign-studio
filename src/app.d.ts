// Framework ambient declaration only; all implementation is JavaScript.
declare global {
  namespace App {
    interface Locals {
      user: ReturnType<typeof import('./lib/server/auth.js').readSession>;
    }
  }
}
export {};
