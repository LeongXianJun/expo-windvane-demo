import { WindVaneModule as WVModule } from './WindVane.types';

export const WindVaneModule = class {
    static isInit: boolean = false;

    static init = () => {
        throw new Error('Web app does not support WindVane miniapp currently');
    };

    static openMiniApp = () => Promise.reject(new Error('Web app does not support WindVane miniapp currently'));
} as WVModule;
