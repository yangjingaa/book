# my-vue

> A Vue.js project

## Build Setup

``` bash******
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#启动

全局安装supervisor 实时监听 

npm install -g supervisor

启动方式

supervisor bin/www

#可视化数据库

adminMongo 安装 进入文件夹

npm start 启动项目

http://127.0.0.1:1234/app/axi 启动路径

#mongoose数据库网站资料

https://blog.csdn.net/zhalcie2011/article/details/71750915

http://element-cn.eleme.io/#/zh-CN 饿了么 vue 组件库

#导出数据库
mongoimport -h 127.0.0.1 --port 27017 -d teacher --file d:\data\teachers

--file 导入文件

#导入数据库
mongorestore -h 127.0.0.1:27017 -d sport --drop d:\data\sport

-h端口号 -d 数据库名字 --drop 数据库存在路径










