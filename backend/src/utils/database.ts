/** globalThis is a built-in global object introduced in modern JavaScript/TypeScript (ES2020).
* It gives you a universal way to access the global scope, regardless of environment:
* In browsers → it’s the same as window.
* In Node.js → it’s the same as global.
* In web workers → it’s the same as self.
* So instead of writing code like typeof window !== "undefined" ? window : global, you just use globalThis.

*/

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;