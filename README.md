## Error Reproduction Steps
1. clone the repo
2. run `npm install`
3. run `npx expo prebuild -p ios`
4. run `npm run ios`

Now, we will hit the first error regarding the architecture arm64
To resolve this, go to PODFILE in your ios folder

1. open project xcode by selecting the .xcworkspace file
2. select `expowindvanedemo`
3. go to Build Settings
4. Under Architectures, find architectures and expand it. You should see Debug and Release settings
5. Now, press the plus icon next to the value
6. Change both `Any SDK` to `iOS Simulator`
7. Change both value to `x86_64`
8. add these code segment before POST_INSTALL
```pod
    # START: newly added solution for arm64 issue
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Force CocoaPods targets to always build for x86_64
        config.build_settings['ARCHS[sdk=iphonesimulator*]'] = 'x86_64'
      end
    end
    # END: newly added solution for arm64 issue
```
9. run `pod install` now
10. then, run `npm run ios` again

Now, we will hit another error, saying undefined symbol