## module-root-sync

Finds the directory that the module resides in.

```typescript
import moduleRoot from 'module-root-sync';

const root = moduleRoot(import.meta.filename);
```

### Options

```typescript
interface RootOptions {
  name?: string;              // Custom marker filename (default: 'package.json')
  includeSynthetic?: boolean; // Include synthetic package.json files (default: false)
}
```

### Synthetic package.json Detection

By default, `moduleRoot` skips "synthetic" package.json files that only exist to specify the module system (e.g., `{ "type": "module" }`). These are commonly found in `dist/esm` or `dist/cjs` directories.

A package.json is considered synthetic if it has no `name` field.

```typescript
// Default: skips synthetic package.json, finds real one
const root = moduleRoot(import.meta.filename);

// Include synthetic package.json files
const root = moduleRoot(import.meta.filename, { includeSynthetic: true });

// Custom marker file (synthetic detection only applies to package.json)
const root = moduleRoot(import.meta.filename, { name: 'tsconfig.json' });
```

### Migration from v1.x

The `keyExists` option has been removed. If you were using `keyExists: 'name'` to skip synthetic packages, this is now the default behavior.

```typescript
// v1.x
const root = moduleRoot(dir, { keyExists: 'name' });

// v2.x (same behavior, now default)
const root = moduleRoot(dir);
```

### Documentation

[API Docs](https://kmalakoff.github.io/module-root-sync/)
