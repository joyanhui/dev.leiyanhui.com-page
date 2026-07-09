# dev.leiyanhui.com 开发指南

## 技术栈

Hugo + [hugo-theme-stack v3](https://github.com/CaiJimmy/hugo-theme-stack) + Disqus 评论。md文件同时需要兼容obsidian

## 目录结构

```
dev.leiyanhui.com/
├── config/_default/       # Hugo 配置
│   ├── config.toml        # 站点基础配置（baseURL, title, 语言等）
│   ├── module.toml        # Hugo 模块导入（theme stack v3）
│   ├── params.toml        # 主题参数
│   ├── menu.toml          # 菜单配置
│   ├── languages.toml     # 多语言
│   ├── markup.toml        # Markdown 渲染配置
│   ├── permalinks.toml    # 永久链接格式
│   └── related.toml       # 相关文章
├── layouts/               # Hugo 模板（覆盖主题）
├── assets/                # 静态资源（scss, ts, icons, favicon）
├── public/                # 构建产物（gitignore）
├── resources/             # Hugo 缓存（gitignore）
├── go.mod / go.sum        # Go 模块
├── .github/workflows/     # CI 构建与部署
├── .gitignore
└── README.md
```

注意：content/ 由 joyanhui/note 仓库管理，构建时 CI 会自动合并。

## 内容规范

- 文章使用 Markdown，front matter 必须包含 `title`、`date`、`categories`
- 分类目录名使用英文（如 `linux/`、`docker/`、`golang/`），文章内 categories 字段保持一致
- 图片资源放入 `assets/` 目录，通过 Hugo `resources` 引用
- 每篇文章一个独立 `.md` 文件，放在对应分类目录下

## 构建与发布

- 禁止本地构建和预览。
- **禁止在本地执行 `hugo deploy` 或直接推送 `public/`**
- 发布流程：`joyanhui/note` 内容变更 → 触发本仓库 CI → Hugo 构建 → 推送到 `gh-pages` 分支

## 通用规则

- 分类名称使用英文小写，保持语义清晰
- 新增分类时，在 `content/` 下创建同名目录，可能还需要修改config/目录的下的配置不然不会识别到首页
- 修改主题相关配置在 `config/_default/` 下，不要修改 `themes/` 下的源码