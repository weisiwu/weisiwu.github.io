<!-- @format -->

博客基于 [Hexo](https://hexo.io/) 构建

## 使用说明

记录下，免得自己忘记了怎么弄

1. 文档放在 ./Blog/source/\_posts 下
2. Blog 保存的是文档草稿，public 目录下是网站使用的网页文档，两个目录都是 git respository，需要分别提

## 文件夹说明

**public**

生成的文档存放目录

**scaffolds**

创建文档时，指定的基类所存放的文件夹

```shell
hexo new photo 'My Gallery'
```

这里 `photo` 指的是 `phone.md` 文件，位置在 `scaffolds`

**scripts**

**style_demo**

**source**

原始文稿

**themes**

样式主题

## 项目命令

`npm run hexo:clean`

> 清空项目缓存

`npm run debug`

> 本地 debug 博客，改动调试时，有奇效

`npm run sync`

> 同步两个仓库代码

`npm run clean`

>

`npm run publish`

> 本地生成网站文件，但不发布

`npm run deploy`

> 将草稿发布到网站上

`npm run tpl`

> 生成新的空白草稿

`npm run d`

>
