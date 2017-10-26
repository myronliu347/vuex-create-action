# vuex-create-action

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux.

## Installation

```bash
npm install vuex-create-action --save
```

or

```
yarn add vuex-create-action
```

## Usage

```javascript
import createAction from 'vuex-create-action';

const actions = {
    testAction: createAction('TEST_ACTION', () => { return 'test'}, () => {
        return {}
    });
}
```
