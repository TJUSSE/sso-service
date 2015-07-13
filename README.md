sso-service
===========

封装了同济大学单点登录验证接口和学工网个人信息接口，提供 REST 方式的 Web API 以便应用程序调用。

### 启动服务

```bash
npm start
```

### 接口

- `GET /session/properties?sessionid=iPlanetDirectoryProCookie`

  获取一个会话的属性，如果失败或者会话不存在，则返回一个包含 `msg` 的 JSON。