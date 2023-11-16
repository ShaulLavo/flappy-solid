import { createStore } from 'solid-js/store';
import { getBrowserName } from './services/utils';

const isFirefox = getBrowserName() === 'Firefox';

const initialState = {
    localUrl: import.meta.url,
    shouldUseWorker: !isFirefox,
    shouldSyncWorkers: !isFirefox,
    speed: 1,
    scaleX: 1,
    scaleY: 1,
    get scaledSpeed() {
        return this.scaleX * this.speed;
    }

};

const [store, setStore] = createStore(initialState);

export { store, setStore };
