### 仅在webhostmost测试，可丝滑部署，但教程仅供测试、学习
### Webhostmost可能会对代理限流、甚至关闭+清空node.js部署的app

* Vless+ws+tls 单节点部署+多优选域名 说明：

* 适用DirectAdmin面板node.js环境 
   （Webhostmost）
  
* 随机端口，无需担心端口占用困扰

* 多区域优选域名覆盖

-----------------------------------------------------------

### 使用方法：

* 1：域名托管至Cloudflare，添加一条DNS记录

* 2：index.js+package.json上传至服务器public_html目录
   修改index.js中的2个变量：UUID/DOMAIN

* 3：进入面板：附加功能--Setup Node.js APP
   
     *输入：
          public_html 和 index.js

     *然后：
           CREATE APPLICATION，运行两次
   
* 4：域名/UUID，浏览器访问可见节点链接地址

