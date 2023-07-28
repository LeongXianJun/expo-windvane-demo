interface InitConfig {
    accessKey: string;
    secretKey: string;
    host: string;
    appCode: string;
}

type OpenMiniAppResult =
    | {
          success: true;
      }
    | {
          success: false;
          errorCode: string;
      };

export interface WindVaneModule {
    isInit: boolean;
    init: (config: InitConfig) => boolean;
    openMiniApp: (miniAppId: string) => Promise<OpenMiniAppResult>;
}
