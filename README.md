# ODM Agent 优先级调研工具

内部单页 Web 调研工具，用于收集 ODM 专家智能体优先级评分、Top3 排序和新增 Agent 建议。

## 本地运行

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3015`。

## 数据存储

生产环境使用 Meoo Cloud DB。Meoo DB 兼容 Supabase/PostgreSQL，前端通过 `src/supabase/client.ts` 访问当前 Meoo 应用的 `/sb-api`。

首次配置：

```bash
meoo login
meoo projects create "ODM Agent 优先级调研"
meoo cloud enable
meoo cloud pull-env
meoo db migrate --name create_odm_survey --sql "<migrations/001_create_odm_survey.sql 的完整 SQL 内容>"
```

`meoo cloud pull-env` 会同步 Meoo Cloud DB 的匿名 key。`meoo db migrate` 需要把迁移 SQL 作为 `--sql` 参数传入；如果由自动化环境执行，可读取 `migrations/001_create_odm_survey.sql` 后整体传给该参数。没有初始化 Meoo DB 时，页面会提示提交失败，不再写入本地文件。

## Meoo 部署

按用户要求不走 Vercel，避免国内用户访问受限。使用 Meoo CLI 发布 Vite 静态产物：

```bash
meoo login
pnpm build
pnpm deploy:meoo -- --force
```

本项目已把 `@aliyun-meoo/cli` 加入 devDependencies，执行 `pnpm install` 后可直接使用 `pnpm deploy:meoo`，不强依赖全局安装。自动化环境可设置 `MEOO_API_KEY`，或执行 `meoo login --ak <your-api-key>` 完成授权。不要把 API key 写入公开评论或提交到仓库。

Meoo CLI 文档：https://docs.meoo.com/meoo-cli

## 验证

```bash
pnpm test
pnpm lint
pnpm build
```
