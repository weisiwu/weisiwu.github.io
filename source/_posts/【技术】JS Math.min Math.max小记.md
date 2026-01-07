---
title: JS Math.min Math.max 小记
date: 2022-04-28 10:19:15
excerpt: JS API小计
tags:
  - 前端
categories:
  - 技术
---

<!-- @format -->

<!--more-->

[Math.min](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/min) 和 [Math.max](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/max) 是较为常用的内置工具函数，但你知道这个函数返回值有哪几种情况吗？ 下面就返回的几种情况，结合例子分别说明易错场景。

### 返回值种类

#### 【返回】数字

**【参数】全数字（或可转为数字）**

```js
Math.min(1, 2, 3, 4, 5); // 1

Math.max(1, 2, 3, 4, 5); // 5

Math.min(null); // 0

Math.min([]); // 0

Math.min(false); // 0

Math.min(true); // 1
```

#### 【返回】NaN

**【参数】存在非数字（或不可转为数字的）**

```js
Math.min(1, 2, 3, 4, '0s'); // NaN

Math.min(1, 2, 3, 4, {}); // NaN

Math.min(undefined); // NaN

Math.min({}); // NaN
```

#### 【返回】-Infinity/Infinity

**【参数】无参数**

```js
Math.min(); // Infinity

Math.max(); // -Infinity
```

### 规则

可归纳为:

1. 参数全为数字或可转为数字，则返回值为最大(小)值。
1. 参数中有非数字或不可转为数字，则返回 NaN。
1. 无参数，min 返回 Infinity，max 返回-Infinity。

谨记，在无参数时，返回的结果与直观感受背道而驰。
