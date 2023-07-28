package ytl.modules.windvane

import android.taobao.windvane.jsbridge.api.WVCamera
import android.taobao.windvane.jsbridge.api.WVUploadService
import com.alibaba.emas.android.mini.app.MiniAppService
import com.alibaba.module.android.core.servicebus.service.ServiceManager
import com.alibaba.module.android.mini.app.api.IMiniAppService
import com.alibaba.module.android.mini.app.api.MiniAppInfo
import com.alibaba.module.android.mini.app.api.MiniAppInitConfig
import com.alibaba.module.android.mini.app.api.OnOpenMiniAppListener
import com.alibaba.module.android.mini.app.api.OnQueryMiniAppsListener
import expo.modules.kotlin.Promise
import expo.modules.kotlin.jni.JavaScriptObject
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.logging.Logger

class WindVaneModule : Module() {
    private val _serviceKey = IMiniAppService::class.simpleName

    private var isInit: Boolean = false
    private lateinit var miniAppService: IMiniAppService

    private val logger = Logger.getLogger("WindVane")

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('WindVane')` in JavaScript.
        Name("WindVane")

        Property("isInit") {
            isInit
        }

        Function("init") { config: JavaScriptObject ->
            if (isInit) {
                return@Function true
            }

            val accessKey = config["accessKey"]?.toString()
                ?: throw Exception("\"accessKey\" is missing from config")
            val secretKey = config["secretKey"]?.toString()
                ?: throw Exception("\"secretKey\" is missing from config")
            val host =
                config["host"]?.toString() ?: throw Exception("\"host\" is missing from config")
            val appCode = config["appCode"]?.toString()
                ?: throw Exception("\"appCode\" is missing from config")

            val application = appContext.currentActivity?.application
                ?: throw Exception("Main application is not created")

            // container initialization
            val initConfig: MiniAppInitConfig = MiniAppInitConfig.Builder()
                .setUseWindVane(true) // Configure this method for a WindVane miniapp.
                .setUseUniApp(false)  // Configure this method for a uni-app miniapp.
                .setAccessKey(accessKey)  // Obtain the AccessKey from Application Open Platform.
                .setSecretKey(secretKey)  // Obtain the SecretKey from Application Open Platform.
                .setHost(host) // Specify the domain name of Application Open Platform. The value in this sample code is provided for reference only. The domain name of the demo environment is emas-publish-intl.emas-poc.com.
                .setAppCode(appCode)  // Obtain the App Code from Application Open Platform.
                .build()
            miniAppService = MiniAppService()
            miniAppService.initialize(application, initConfig)
            ServiceManager.getInstance()
                .registerService(_serviceKey, miniAppService)

            // The following code provides an example of initialization configurations for the WindVane miniapp container. If you want to integrate the WindVane miniapp container into the app, include the configurations.
            WVCamera.registerUploadService(WVUploadService::class.java)

            isInit = true
        }

        AsyncFunction("openMiniApp") { miniAppId: String, promise: Promise ->
            @Suppress("SENSELESS_COMPARISON")
            if (!isInit || miniAppService == null) {
                throw Exception("WindVaneModule is not initialized.")
            }

            if (miniAppId.isEmpty()) {
                throw Exception("\"miniAppId\" is empty")
            }

            val context = appContext.currentActivity?.applicationContext
                ?: throw Exception("application's context is not found")

            logger.info("miniAppId: $miniAppId")

            miniAppService.getMiniAppList(
                context,
                object : OnQueryMiniAppsListener {
                    override fun onSuccess(
                        miniAppInfos: MutableList<MiniAppInfo>?,
                        anchor: String?
                    ) {
                        logger.info(miniAppInfos?.toString() ?: "- NONE -")
                    }

                    override fun onFailed(errorCode: Int) {
                        logger.info("ErrorCode: $errorCode")
                    }

                }
            )

            // open Miniapp Container
            miniAppService.openMiniApp(
                context,
                miniAppId,
                null,
                object : OnOpenMiniAppListener {
                    override fun onOpenMiniApp() {
                        //start open
                    }

                    override fun onOpenSuccess(appId: String) {
                        val result = mapOf(
                            "success" to true
                        )
                        promise.resolve(result)
                    }

                    override fun onOpenFailed(appId: String, errorCode: Int) {
                        val result = mapOf(
                            "success" to false, "errorCode" to errorCode.toString() + ""
                        )
                        promise.resolve(result)
                    }
                })
        }

        OnDestroy {
            try {
                ServiceManager.getInstance().unRegisterService(_serviceKey)
                isInit = false
            } catch (_: Exception) {
            }
        }
    }
}
