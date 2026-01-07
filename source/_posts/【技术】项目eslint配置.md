---
title: 项目eslint配置
date: 2023-01-04 14:30:26
excerpt: 记录项目里面配置eslint
tags:
- 前端
- 工程化
categories:
- 技术
---

<!--more-->
babel-eslint 已经停止更新了，现在更名为 @babel/eslint-parser
安装eslint、jsx文件所需的parser
``` shell
npm install eslint @babel/core @babel/eslint-parser --save-dev
npm install @babel/preset-react --save-dev
```
由于eslint8将formatter中的codeframe去除了，所以在8中，需要额外安装codeframe formatter
```
npm install --save-dev eslint-formatter-codeframe
```

## 参考
1、 [一文彻底读懂ESLint](https://xieyufei.com/2021/04/25/Front-Eslint.html)