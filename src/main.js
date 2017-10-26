import identity from 'lodash/identity';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import uniqueId from 'lodash/uniqueId';

function isPromise(val) {
    return val && typeof val.then === 'function';
}

export default function (type, payloadCreator = identity, metaCreator) {
    if (!(isFunction(payloadCreator) || isNull(payloadCreator))) {
        console.warn('Expected payloadCreator to be a function, undefined or null');
    }

    const finalPayloadCreator = isNull(payloadCreator) ? identity : payloadCreator;
    const actionCreator = function (context) {
        const args = Array.prototype.slice.call(arguments, 1);
        const hasError = args[0] instanceof Error;
        const action = {
            type
        };

        const payload = hasError ? args[0] : finalPayloadCreator(...args);
        if (!isUndefined(payload)) {
            action.payload = payload;
        }

        if (hasError || payload instanceof Error) {
            action.error = true;
        }

        if (isFunction(metaCreator)) {
            action.meta = metaCreator(...args);
        }

        // promise 处理
        if (isPromise(payload)) {
            const id = uniqueId();
            action.payload = undefined;
            action.meta = {
                ...action.meta,
                sequence: {
                    type: 'start',
                    id
                }
            }
            payload.then(
                result => context.commit({
                    ...action,
                    payload: result,
                    meta: {
                        ...action.meta,
                        sequence: {
                            type: 'next',
                            id
                        }
                    }
                }),
                error => context.commit({
                    ...action,
                    payload: error,
                    error: true,
                    meta: {
                        ...action.meta,
                        sequence: {
                            type: 'next',
                            id
                        }
                    }
                })
            );
        }

        context.commit(action);
    }

    actionCreator.toString = () => type.toString();

    return actionCreator;
}
