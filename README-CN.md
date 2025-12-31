# Discord 高级管理机器人 🛡️

一个功能强大、特性丰富的 Discord 管理机器人，基于 Discord.js v14 构建，旨在帮助服务器管理员维护秩序，创建安全的社区环境。

## ✨ 功能特性

### 🔨 管理命令
- **踢出 (Kick)** - 将成员从服务器中移除
- **封禁 (Ban)** - 永久封禁成员
- **禁言 (Timeout)** - 临时禁言成员
- **警告 (Warn)** - 向用户发出正式警告
- **清理 (Clear)** - 批量删除消息（1-100条）

### 🤖 自动化功能
- **自动审核** - 自动检测并删除包含违禁词的消息
- **自动身份组** - 自动为新成员分配身份组
- **欢迎消息** - 发送可自定义的欢迎消息及成员计数
- **审计日志** - 在专用日志频道追踪所有管理操作

### 📊 实用命令
- **用户信息** - 显示服务器成员的详细信息

## 📋 前置要求

- Node.js v16.9.0 或更高版本
- Discord 机器人令牌（[Discord 开发者门户](https://discord.com/developers/applications)）
- 基本的 Discord 权限知识

## 🚀 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/discord-moderation-bot.git
   cd discord-moderation-bot
   ```

2. **安装依赖**
   ```bash
   npm install discord.js dotenv
   ```

3. **配置环境变量**
   
   在根目录创建 `.env` 文件：
   ```env
   DISCORD_TOKEN=你的机器人令牌
   CLIENT_ID=你的应用程序ID
   ```

4. **配置机器人设置**
   
   在 `index.js` 中编辑这些变量：
   ```javascript
   const LOG_CHANNEL_NAME = 'mod-logs';     // 审计日志频道
   const AUTO_ROLE_NAME = 'Member';         // 新成员自动获得的身份组
   const WELCOME_CHANNEL = 'general';       // 欢迎消息频道
   ```

5. **运行机器人**
   ```bash
   node index.js
   ```

## 🔧 设置指南

### 机器人权限

您的机器人需要以下权限：
- 踢出成员
- 封禁成员
- 管理身份组
- 管理消息
- 管理成员（用于禁言）
- 发送消息
- 嵌入链接
- 阅读消息历史

### 必需频道

在您的 Discord 服务器中创建这些频道：
- `#mod-logs` - 用于管理操作日志
- `#general` - 用于欢迎消息（或使用您现有的综合频道）

### 必需身份组

创建一个名为 `Member` 的身份组，将自动分配给新成员。

## 📝 命令使用

所有命令都是斜杠命令。在 Discord 中输入 `/` 查看可用命令。

### `/kick` - 踢出
将成员从服务器中踢出。
```
/kick user:@用户名 reason:刷屏
```

### `/ban` - 封禁
将成员从服务器中封禁。
```
/ban user:@用户名 reason:违反规则
```

### `/timeout` - 禁言
临时禁言成员。
```
/timeout user:@用户名 minutes:30
```

### `/warn` - 警告
向用户发出正式警告。
```
/warn user:@用户名 reason:使用不当语言
```

### `/userinfo` - 用户信息
显示用户的详细信息。
```
/userinfo user:@用户名
```

### `/clear` - 清理
批量删除消息（1-100条）。
```
/clear amount:50
```

## 🎨 自定义设置

### 自动审核关键词

在 `index.js` 中编辑违禁词列表：
```javascript
const blacklistedWords = ['scam', 'badword', 'free nitro', 'steam gift'];
```

### 机器人状态

自定义机器人的活动状态：
```javascript
client.user.setActivity('守护服务器 🛡️', { type: ActivityType.Watching });
```

### 嵌入消息颜色

在代码中修改嵌入消息颜色：
- `0x00FF00` - 绿色（欢迎）
- `0xFF0000` - 红色（封禁、自动审核）
- `0xFFA500` - 橙色（踢出）
- `0xFFFF00` - 黄色（禁言）
- `0xFFCC00` - 琥珀色（警告）
- `0x0099FF` - 蓝色（信息）

## 📦 数据存储

目前，机器人使用内存存储警告记录。对于生产环境，建议实现：
- MongoDB
- SQLite
- JSON 文件存储
- PostgreSQL/MySQL

## 🛠️ 故障排除

### 机器人不响应命令
- 确保机器人拥有正确的权限
- 验证斜杠命令已注册（启动时检查控制台）
- 确保机器人在线且拥有正确的意图

### 自动身份组不工作
- 检查机器人的身份组是否高于要分配的身份组
- 验证代码中的身份组名称完全匹配

### 欢迎消息未发送
- 确认欢迎频道存在且名称正确
- 确保机器人有权限在该频道发送消息

## ⚠️ 重要提示

- 机器人需要 `MESSAGE_CONTENT` 意图来读取消息文本以进行自动审核
- 警告记录存储在内存中，机器人重启后会丢失
- 生产环境使用时，请实现合适的数据库解决方案
- 始终先在开发服务器中测试命令

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

## 🔗 相关链接

- [Discord.js 文档](https://discord.js.org/)
- [Discord 开发者门户](https://discord.com/developers/docs)
- [Discord.js 指南](https://discordjs.guide/)

## 💬 支持

如果您遇到任何问题或有疑问，请在 GitHub 上提交 issue。

---

用 ❤️ 为 Discord 社区打造
