## call-once-fn

Calls a callback only once.

```
import once from 'call-once-fn';
import assert from 'assert';

const results = [];

const callback1 = once(() => results.push(arguments));
assert.ok(!results.length);
callback1('error', 'value1', 'value2');
assert.equal(results.length, 1);

callback1('error', 'value1', 'value2');
assert.equal(results.length, 1);
```
