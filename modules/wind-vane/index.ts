import { WindVaneModule as WVModule } from './src/WindVane.types';
// Import the native module. On web, it will be resolved to WindVane.web.ts
// and on native platforms to WindVane.ts
import { WindVaneModule } from './src/WindVaneModule';

export const WindVane = class {
    static get isInit(): boolean {
        return WindVaneModule.isInit;
    }

    static init = (config) => WindVaneModule.init(config);

    static openMiniApp = (appId) => WindVaneModule.openMiniApp(appId);
} as WVModule;
