# GeoSpy v2

[English](README.md)

**实时全球情报仪表盘** — 地缘政治、军事、市场、气候、网络、海事与航空数据汇于一张实时地图。

GeoSpy 是 [WorldMonitor](https://github.com/koala73/worldmonitor) 的 [AGPL-3.0](LICENSE) 分支。上游产品、文档与实时 API 主机仍在 [worldmonitor.app](https://www.worldmonitor.app)。本仓库在此代码库之上推进 GeoSpy 产品标识与分支特性。

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 快速开始

```bash
git clone https://github.com/lukasdoering/geospy-v2.git
cd geospy-v2
npm ci
npm run dev
```

打开 [localhost:3000](http://localhost:3000)（可用 `.env.local` 中的 `DEV_PORT` 覆盖端口）。应用无需环境变量即可运行；默认从上游 WorldMonitor 边缘获取实时数据。

变体开发：

```bash
npm run dev:tech
npm run dev:finance
npm run dev:commodity
npm run dev:happy
npm run dev:energy
```

## 功能概览

- **500+ 精选新闻源**，覆盖 15 个类别，并由 AI 合成简报
- **双引擎地图** — 3D 地球（globe.gl）与 WebGL 平面地图（deck.gl），56 类图层
- **跨流关联** — 军事、经济、灾害与升级信号收敛
- **国家不稳定指数（CII）** — 服务端权威 CII v8，覆盖 31 个一级国家
- **国家韧性指数（CRI）** — 更广的 196 国韧性排名宇宙
- **金融雷达** — 交易所、大宗商品、加密货币与市场综合指标
- **本地 AI** — 可选用 Ollama 进行离线推理
- **6 个站点变体**（world / tech / finance / commodity / happy / energy）
- **原生桌面应用**（Tauri 2）：macOS、Windows、Linux
- **25 种语言**，含本地语言源与 RTL 支持

## 归属

WorldMonitor 代码版权归其上游作者所有。GeoSpy 保留 AGPL-3.0 许可，并致谢 [koala73/worldmonitor](https://github.com/koala73/worldmonitor)。系统结构见 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [ARCHITECTURE.md](ARCHITECTURE.md)。

## 文档

- [架构](ARCHITECTURE.md)
- [Agent 入口](AGENTS.md)
- [上游文档](https://www.worldmonitor.app/docs/documentation)
