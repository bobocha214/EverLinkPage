# 安装与更新

EverLink 目前以 Android APK 形式分发，支持 **GitHub** 与 **Gitee** 双渠道发布，并可在应用内直接检查更新、下载安装。应用基于 Flutter 开发，如需 iOS / 桌面 / Web 等平台版本，可参考文末「其他平台（自行编译）」自行构建。

## 设备要求

- Android 系统（建议 Android 8.0 及以上）
- 允许「安装未知应用」权限（首次安装来自浏览器 / 文件管理器的 APK 时需要）
- 联网（用于检查更新、设备通信）

## 从发布页下载

前往你的发布仓库，选择适合设备 CPU 架构的 APK 下载：

### Gitee（国内推荐）

| 架构 | 适用设备 | 下载链接 |
|------|----------|----------|
| arm64-v8a | 现代 64 位安卓手机 / 平板（推荐） | [app-arm64-v8a-release.apk](https://gitee.com/zhiyu_214/ever-link/releases/download/1.0.0/app-arm64-v8a-release.apk) |
| armeabi-v7a | 老旧 32 位安卓设备 | [app-armeabi-v7a-release.apk](https://gitee.com/zhiyu_214/ever-link/releases/download/1.0.0/app-armeabi-v7a-release.apk) |
| x86_64 | x86 模拟器 / Intel 平板 | [app-x86_64-release.apk](https://gitee.com/zhiyu_214/ever-link/releases/download/1.0.0/app-x86_64-release.apk) |

### GitHub

| 架构 | 适用设备 | 下载链接 |
|------|----------|----------|
| arm64-v8a | 现代 64 位安卓手机 / 平板（推荐） | [app-arm64-v8a-release.apk](https://github.com/bobocha214/everlink/releases/download/1.0.0/app-arm64-v8a-release.apk) |
| armeabi-v7a | 老旧 32 位安卓设备 | [app-armeabi-v7a-release.apk](https://github.com/bobocha214/everlink/releases/download/1.0.0/app-armeabi-v7a-release.apk) |
| x86_64 | x86 模拟器 / Intel 平板 | [app-x86_64-release.apk](https://github.com/bobocha214/everlink/releases/download/1.0.0/app-x86_64-release.apk) |

> 不确定设备架构？大多数 2019 年后的安卓手机均为 **arm64-v8a**，可直接下载推荐包。

发布页地址：
- GitHub Releases：`https://github.com/bobocha214/everlink/releases`
- Gitee Releases：`https://gitee.com/zhiyu_214/ever-link/releases`

下载完成后，用文件管理器打开 APK，按系统提示完成安装即可。

## 应用内检查更新

1. 打开 EverLink，进入 **我的 → 设置**。
2. 在「检查更新」区域选择更新来源：**GitHub** 或 **Gitee**。
3. 填写仓库坐标（`owner/repo`，例如 `zhiyu_214/ever-link` 或 `bobocha214/everlink`）。
4. 点击 **检查更新**。
   - 若发现新版本，会弹出更新对话框，点击 **下载更新** 即可在后台下载；
   - 下载完成后系统会自动弹出安装界面，按提示完成安装。
5. 若已是最新版本，会提示「已是最新版本」。

::: warning 关于来源限速
Gitee 未登录的公开 API 有较严格的速率限制，若检查更新偶发失败（超时或 403），可稍后重试，或改用 GitHub 来源。
:::

::: info Android 安装未知应用
Android 8 及以上在首次安装来自本应用的 APK 时，会引导你在系统设置中允许 EverLink「安装未知应用」。这是正常的安全流程，允许后即可完成更新。
:::

## 其他平台（自行编译）

EverLink 基于 **Flutter** 开发，源码理论上可编译到 Android / iOS / Windows / macOS / Linux / Web 多个平台；应用包名为 `com.everlink.app`，当前版本 `1.0.0`。

> 目前官方分发渠道**仅提供 Android APK**（见上方「从发布页下载」）。iOS、桌面端与 Web 尚未发布官方安装包，如需使用，请克隆源码在本机自行构建。

### 通用前置

1. 安装 [Flutter SDK](https://docs.flutter.dev/get-started/install) 并配置环境变量；
2. 执行 `flutter doctor`，确保目标平台的工具链就绪（iOS 需 macOS + Xcode，桌面端需对应系统编译工具）；
3. 拉取依赖：`flutter pub get`。

### iOS

```bash
# 需在 macOS 上执行，且已安装 Xcode
flutter build ios --release
```

- 首次构建前，在 Xcode 中打开 `ios/Runner.xcworkspace`，将 **Bundle Identifier** 设为 `com.everlink.app` 并配置签名团队（Team）。
- 应用图标已通过 `flutter_launcher_icons`（`ios: true`）自动生成到 `ios/Runner/Assets.xcassets/AppIcon.appiconset`，无需手动替换。
- 产物为 IPA，需通过 TestFlight 或企业分发安装到设备。

### Windows / macOS / Linux

```bash
flutter build windows   # Windows 可执行文件
flutter build macos     # macOS 应用（需在 Mac 上执行）
flutter build linux     # Linux 可执行文件
```

### Web

```bash
flutter build web
# 产物在 build/web，可直接托管到任意静态服务器
```

::: info 平台可用性说明
部分功能依赖平台能力（如局域网快传、剪贴板监听、ICMP Ping 等），在非移动端可能存在能力差异或受限；移动端（Android / iOS）功能最完整。
:::

## 开发者：打包 APK

如需自行构建安装包（以 EverLink 1.0.0 为例）：

```bash
# 1) 修改版本号：编辑 pubspec.yaml 的 version（如 1.0.0+1）
# 2) 安装依赖
flutter pub get

# 3) 打包 release APK（单包）
flutter build apk --release
#    产物：build/app/outputs/flutter-apk/app-release.apk

# 推荐：按 ABI 拆分，体积更小、国内下载更快
flutter build apk --release --split-per-abi
#    产物：app-armeabi-v7a-release.apk / app-arm64-v8a-release.apk / app-x86_64-release.apk
```

发布时，到 GitHub / Gitee 创建 Release，Tag 填 `1.0.0`，将生成的 APK 作为资源上传。应用内的检查更新会自动对比该 Release 的版本号与 APK 下载地址。
