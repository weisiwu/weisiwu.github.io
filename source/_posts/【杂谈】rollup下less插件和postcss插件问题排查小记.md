---
title: 【记录】rollup下less插件和postcss插件问题排查小记.md
date: 2023-12-14 13:11:41
excerpt: 排查一则无头绪问题过程记录
photos: '../images/fs-1.jpg'
tags:
- 记录
categories:
- 杂谈
---

# 问题描述
```browser_plugin_template``` 项目， 在 ```rollup v2.79.1``` ，配置使用 ```rollup-plugin-less``` 和 ```rollup-pulgin-postcss``` 按照如下配置
``` js
const less = require("rollup-plugin-less");
const postcss = require("rollup-plugin-postcss");
const tailwindcss = require("tailwindcss");

less({ insert: false }),
postcss({ plugins: [tailwindcss] })
```
提示 config.less 文件 编译不识别  ``` error: [LessError: Unrecognised input] ```

# 排查步骤
1. 错误定位: ``` var isFinished = parserInput.i >= input.length ```中的`isFinished` 为fasle 导致报错
2. 为什么 `parserInput.i` 是0
3. 找到 `parserInput.i` 给值的地方
4. 定位到错误是发生在这段逻辑中 `browser_plugin_template/node_modules/_less@4.2.0@less/lib/less/parser/parser.js`
5. 在这个文件中，出错的逻辑在
```js
try {
    parserInput.start(str, context.chunkInput, function fail(msg, index) {
        throw new less_error_1.default({
            index: index,
            type: 'Parse',
            message: msg,
            filename: fileInfo.filename
        }, imports);
    });
    tree_1.default.Node.prototype.parse = this;
    root = new tree_1.default.Ruleset(null, this.parsers.primary());
    tree_1.default.Node.prototype.rootNode = root;
    root.root = true;
    root.firstRoot = true;
    root.functionRegistry = function_registry_1.default.inherit();
}
catch (e) {
    return callback(new less_error_1.default(e, imports, fileInfo.filename));
}
var endInfo = parserInput.end();
```
在 `end`的地方就报错了，问题在于 `root = new tree_1.default.Ruleset(null, this.parsers.primary());` 这句的调用，这个逻辑从名字上看是以树状结构去搜索解析css的样式。
换言之，为了定位报错的原因，已经找到less-plugin里的逻辑，但仍然无法定位具体原因，还要继续深入，这么一来，问题已经无法继续追查下去
1. 换个思路 `parserInput.i` 值不对，那么就监听所有可以给 `parserInput.i` 赋值的地方，看报错前最后一次调用是谁发起的
2. 然后发现 `parserInput.i` 被赋值的地方很多，而且很难以收口debugger，这意味着，通过less插件代码，定位错误原因的努力失败
3. 然后想到去搜索git主页的issue 看是否有类似的问题
4. 发现有类似的问题，并且很久没有结果了
5.  果断用新插件（postcss，支持use loader，加载解析不同类型的样式文件）