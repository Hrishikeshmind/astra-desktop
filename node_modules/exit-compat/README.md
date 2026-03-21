## exit-compat

A replacement for `process.exit()` that ensures stdio streams are fully drained before exiting.

This is needed for Node 0.8-0.10 compatibility where `process.exit()` could truncate stdout/stderr output because streams hadn't finished flushing. Modern Node.js versions handle this automatically.

### Installation

```bash
npm install exit-compat
```

### Usage

```javascript
var exit = require('exit-compat');

console.log('This will be fully written before exit');
exit(0);
```

### API

#### exit(exitCode)

- `exitCode` (number): The exit code to pass to `process.exit()`

The function waits for `process.stdout` and `process.stderr` to drain before calling `process.exit()`.

### Why?

On Node 0.8-0.10, calling `process.exit()` immediately could truncate stdout/stderr output. This was fixed in Node 0.11.8+, but this package provides a consistent solution across all Node versions.

### Credits

Based on the [exit](https://github.com/cowboy/node-exit) package by "Cowboy" Ben Alman.
