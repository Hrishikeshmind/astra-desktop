## on-one

Subscribe to one or more events and accept the first emitted.

### one event
```js
import oo from 'on-one';

oo(stream, 'data', (chunk) => {
  // first chunk only
})
```

### multiple events
```js
import oo from 'on-one';

oo(stream, ['error', 'finish'], (err) => {
  // first event to fire wins
})
```

### event name

The event name that triggered the callback is passed as the last argument:

```js
import oo from 'on-one';

oo(stream, ['error', 'finish'], (err, eventName) => {
  if (eventName === 'error') {
    console.error('Stream failed:', err);
  } else {
    console.log('Stream finished successfully');
  }
})
```
