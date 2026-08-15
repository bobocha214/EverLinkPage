---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EverLink"
  text: "工业协议调试"
  tagline: 一站式 Modbus TCP / MQTT / WebSocket / HTTP / OPC UA 调试与局域网工具箱，工业现场的移动协议调试工作站。
  image:
    src: /ic_launcher.svg
    alt: EverLink 应用图标
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 下载安装
      link: https://github.com/bobocha214/everlink/releases/latest/download/app-arm64-v8a-release.apk

features:
  - title: 多协议调试
    details: 一套 App 搞定 Modbus TCP、MQTT、OPC UA、WebSocket、HTTP，支持数据类型解析、TLS/SSL、安全策略协商、报文查看与日志导出。
    icon: 🔌
  - title: 服务模拟
    details: 在手机上运行 TCP 服务端、OPC UA 服务端（含节点编辑器）、MQTT Broker、MQTT 发布模拟，无需电脑即可联调客户端程序。
    icon: 🖥️
  - title: 设备集中管理
    details: 卡片化首页实时展示设备状态，自动识别在线 / 连接中 / 离线 / 异常，支持搜索、按协议与状态筛选、重命名与删除。
    icon: 📟
  - title: 局域网快传
    details: 同一 WiFi 下通过网页或扫码互传文件、文字与图片，支持公开频道与加密房间。
    icon: 🚀
  - title: 网络诊断与工具箱
    details: ICMP Ping、TCP 客户端、端口扫描（含工控常用端口）、局域网扫描、IP 子网计算、进制互转、CRC16-Modbus 校验。
    icon: 🔧
---
