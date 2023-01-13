---
title: facebook hermes 编译
date: 2023-01-11 10:00:00
---


### 基本环境
```shell
# 按需安装
brew install cmake git ninja
# 准备workspace
mkdir github_hermes_workspace
cd github_hermes_workspace/
# 环境变量，很重要，编译hermes.so时，hermes/android/build.gradle工程会读取使用
export HERMES_WS_DIR="$(pwd)"
# clone，作为workspace子目录
git clone https://github.com/facebook/hermes.git github_hermes
```

### 编译hermesc
```shell
# 构建build目录
## 由于 hermes/android/build.gradle 里写死了路径（build|build_release），不改源码的前提下就用前述两个：
## RELEASE: cmake -S github_hermes -B build_release -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake -S github_hermes -B build -G Ninja
# build hermesc
## --build 指定的是上述命令的输出路径
cmake --build ./build --target hermesc
# hermesc位置：位于 --build 指定的目录下
find . | grep -E "hermesc$"
```

### 编译hermes.so
指定NDK版本，这个很重要，保证和要使用hermes的工程的版本一致（目前已发现的问题是try-catch失效），方式：
- android.ndkVersion （需要更改hermes/android/hermes/build.gradle）
- android.ndkPath （需要更改hermes/android/hermes/build.gradle）
- ndk.dir @ local.properties

一些说明：
- Intl 表示国际化版本
- 不管是debug还是release的libhermes.so，CMAKE_BUILD_TYPE都是为Release
    - JS developers aren't VM developers. Give them a faster build.
- release的参数：
    - HERMES_ENABLE_DEBUGGER=false // 即debug的so带inspector
    - CMAKE_BUILD_TYPE=MinSizeRel
- 混淆规则：
    ```
    -keep class com.facebook.hermes.unicode.** { *; }
    -keep class com.facebook.jni.** { *; }
    ```
```shell
cd hermes/android/
chmod +x gradlew
# build目录在 ${HERMES_WS_DIR}/build_android/
./gradlew build
# so位置：
cd $HERMES_WS_DIR
find . | grep -E "libhermes\.so$"
```


### js转hbc
```shell
hermes -emit-binary -out test.hbc test.js
```

### 运行RN demo
> 参考：https://reactnative.dev/docs/environment-setup
```
npx react-native init AwesomeProject
npx react-native run-android
```


### 更多
- https://hermesengine.dev/docs/cross-compilation
- [使用Chrome调试运行在hermes的JS代码](https://reactnative.dev/docs/hermes#debugging-js-on-hermes-using-google-chromes-devtools)