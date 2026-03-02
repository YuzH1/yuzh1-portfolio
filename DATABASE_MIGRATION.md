# 📦 数据库迁移指南 - Vercel Postgres → Neon

## 问题
Vercel Postgres 数据库连接失败 (`db.prisma.io:5432`)，需要迁移到 Neon。

---

## 步骤 1：创建 Neon 数据库

1. 访问 **https://neon.tech**
2. 点击 **"Sign in with GitHub"**（用 GitHub 登录）
3. 点击 **"New Project"**
4. 输入项目名称：`yuzh1-portfolio`
5. 点击 **"Create"**

---

## 步骤 2：获取连接字符串

1. 在 Neon 仪表板，点击你的项目
2. 点击左侧 **"Connection Details"**
3. 找到 **"Connection string"**，格式类似：
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
4. 点击 **"Copy"** 复制连接字符串

---

## 步骤 3：在 Vercel 更新环境变量

1. 访问：https://vercel.com/yuzh1/yuzh1-portfolio/settings/environment-variables
2. 找到 `DATABASE_URL`，点击 **"Edit"**
3. 粘贴 Neon 连接字符串
4. 保存
5. 找到 `DIRECT_DATABASE_URL`，点击 **"Edit"**
6. 粘贴**相同**的 Neon 连接字符串
7. 保存

> ⚠️ **重要**：两个变量都使用同一个 Neon 连接字符串

---

## 步骤 4：本地推送数据库结构

```powershell
cd D:\projects\yuzh1-portfolio

# 1. 创建/更新 .env 文件
notepad .env

# 填入以下内容（替换为你的 Neon 连接字符串）：
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
DIRECT_DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"

# 2. 推送数据库结构到 Neon
npx prisma db push

# 3. 提交并推送
git add -A
git commit -m "migrate to Neon database"
git push origin main
```

---

## 步骤 5：验证

1. 访问 Vercel Deployments：https://vercel.com/yuzh1/yuzh1-portfolio/deployments
2. 等待最新部署完成（约 2-3 分钟）
3. 访问你的网站测试：
   - 留言板：https://yuzh1-portfolio.vercel.app/guestbook
   - 登录功能
   - 通知功能

---

## 🔧 常见问题

### Q: Neon 免费额度够用吗？
A: 完全够用！Neon 免费套餐：
- 0.5 GB 存储
- 每月 200 万计算时长
- 对于个人作品集绰绰有余

### Q: 数据会丢失吗？
A: Vercel Postgres 的数据需要手动导出。如果是新数据库，直接迁移即可。

### Q: 可以用其他数据库吗？
A: 可以！Supabase、Railway、PlanetScale 都支持，但 Neon 最接近 Vercel Postgres。

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. Neon 创建截图
2. Vercel 环境变量截图（隐藏密码部分）
3. 部署日志错误信息

---

**完成上述步骤后，数据库问题就会解决！** 🎉
