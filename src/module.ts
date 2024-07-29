import { createRequire ,isBuiltin} from 'node:module';
console.log(import.meta)

isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false 