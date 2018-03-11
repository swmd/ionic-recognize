BUILD_TOOL_VERSION=23.0.3
if [ -f android-x86-release.apk ]
then
  rm android-x86-release.apk
fi

if [ -f android-armv7-release.apk ]
then
  rm android-armv7-release.apk
fi

cordova build --release --minify android
cordova build --release --minify --xwalk64bit android

say "release build, time to sign apk"

if [ ! -f recognize.keystore ]
then
  keytool -genkey -v -keystore recognize.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
fi

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore recognize.keystore ./platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk alias_name
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore recognize.keystore ./platforms/android/build/outputs/apk/android-x86-release-unsigned.apk alias_name
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore recognize.keystore ./platforms/android/build/outputs/apk/android-arm64-release-unsigned.apk alias_name
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore recognize.keystore ./platforms/android/build/outputs/apk/android-x86_64-release-unsigned.apk alias_name

$ANDROID_HOME/build-tools/$BUILD_TOOL_VERSION/zipalign -v 4 ./platforms/android/build/outputs/apk/android-x86-release-unsigned.apk android-x86-release.apk
$ANDROID_HOME/build-tools/$BUILD_TOOL_VERSION/zipalign -v 4 ./platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk android-armv7-release.apk
$ANDROID_HOME/build-tools/$BUILD_TOOL_VERSION/zipalign -v 4 ./platforms/android/build/outputs/apk/android-x86_64-release-unsigned.apk android-x86_64-release.apk
$ANDROID_HOME/build-tools/$BUILD_TOOL_VERSION/zipalign -v 4 ./platforms/android/build/outputs/apk/android-arm64-release-unsigned.apk android-arm64-release.apk
