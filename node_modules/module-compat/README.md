# module-compat

Module type detection and loading for CJS and ESM compatibility.

## Installation

```bash
npm install module-compat
```

## API

### Type Detection

```typescript
import { moduleType, extToModuleType } from 'module-compat';

// Detect from file path (checks extension + package.json)
moduleType('/path/to/file.js'); // 'module' | 'commonjs'

// Detect from extension only (no filesystem access)
extToModuleType('.mjs'); // 'module'
extToModuleType('.cjs'); // 'commonjs'
extToModuleType('.js');  // undefined (need package.json check)
```

### Capability Detection

```typescript
import { supportsESM, supportsSyncRequireESM } from 'module-compat';

supportsESM();           // true if Node 12+
supportsSyncRequireESM(); // true if Node 23+
```

### Module Loading

```typescript
import { loadModule, loadModuleSync } from 'module-compat';

// Callback-based (works on all Node versions)
loadModule('/path/to/module.mjs', (err, mod) => {
  if (err) throw err;
  console.log(mod);
});

// With options
loadModule('/path/to/module.mjs', { interop: 'raw' }, (err, mod) => {
  // mod is the full namespace: { default, namedExport1, ... }
});

// Sync (CJS always works, ESM requires Node 23+)
const mod = loadModuleSync('/path/to/module.cjs');
```

### Interop Modes

Control how ESM default exports are handled:

| Mode | Behavior |
|------|----------|
| `'default'` | Extract `.default` if present (default) |
| `'raw'` | Return module namespace as-is |
| `'typescript'` | Check `__esModule` flag, then extract default |

```typescript
// ESM module: export default fn; export function helper() {}

// interop: 'default' (default)
loadModule('module.mjs', (err, mod) => {
  // mod = fn (the default export)
});

// interop: 'raw'
loadModule('module.mjs', { interop: 'raw' }, (err, mod) => {
  // mod = { default: fn, helper: [Function] }
});
```

## Node Version Support

| Node Version | CJS | ESM (async) | ESM (sync) |
|-------------|-----|-------------|------------|
| < 12 | Yes | No | No |
| 12-22 | Yes | Yes | No |
| 23+ | Yes | Yes | Yes |
