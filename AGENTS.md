# dev.leiyanhui.com-page 构建与主题仓库

本仓库管理 dev.leiyanhui.com 的 Hugo 构建和部署。

## 职责边界

| 本仓库所有 | joyanhui/note 所有 |
|---|---|
| config/ (Hugo 配置) | content/ (Markdown 文章) |
| layouts/ (Hugo 模板) | |
| assets/ (scss/ts/图标/favicon) | |
| go.mod / go.sum (Go 模块) | |
| .github/workflows/ (CI 部署) | |

注意：构建时 CI 会从 `joyanhui/note` 拉取 `content/`，与本仓库的 config/layouts/assets 合并构建。

## 技术栈

Hugo + [hugo-theme-stack v3](https://github.com/CaiJimmy/hugo-theme-stack) (Go module) + Disqus

## 目录结构

```
├── config/_default/       # Hugo 全部配置
│   ├── config.toml        # 站点基础配置（baseURL, title, 语言等）
│   ├── module.toml        # Hugo 模块导入
│   ├── params.toml        # 主题参数（含 mainSections、社交链接等）
│   ├── menu.toml          # 菜单与社交链接
│   ├── languages.toml     # 多语言
│   ├── markup.toml        # Markdown 渲染（goldmark、TOC、highlight）
│   ├── permalinks.toml    # 永久链接格式
│   └── related.toml       # 相关文章配置
├── layouts/               # Hugo 模板（覆盖主题默认模板）
│   ├── _default/
│   │   ├── baseof.html
│   │   └── _markup/
│   │       └── render-link.html   # .md 内部链接 → Hugo URL 自动转换
│   ├── page/search.html
│   ├── shortcodes/
│   └── partials/ (header/footer/sidebar/head)
├── assets/                # 静态资源
│   ├── scss/custom.scss   # 自定义样式
│   ├── ts/custom.ts       # 自定义脚本（粒子背景/深色模式/抽屉菜单）
│   ├── icons/             # SVG 图标
│   ├── img/avatar.png     # 头像
│   └── favicon.ico        # 站点图标
├── go.mod / go.sum        # Go/Hugo 模块依赖
├── .github/workflows/     # CI：构建并部署到 gh-pages
├── .gitignore
├── AGENTS.md
└── README.md
```

## 构建与发布

### CI 流程

1. `joyanhui/note` 收到 push，通过 `trigger-page-build.yml` 向本仓库发送 `repository_dispatch`
2. 本仓库 CI 启动：
   - checkout `joyanhui/note` → 只取 `dev.leiyanhui.com/content/`
   - checkout 本仓库 → 获取 config/layouts/assets/go.mod
   - 合并 content/ 到本仓库，执行 `hugo --minify --gc`
   - 将 `public/` 强制推送到 `gh-pages` 分支

### 本地操作

- 禁止本地构建和预览，禁止执行 `hugo` 命令
- 禁止直接推送 `public/` 或操作 `gh-pages` 分支

## 内容相关注意事项

虽然 content/ 由 note 仓库管理，但以下操作需要两边配合：

- 新增分类：需在 note 仓库 `content/` 下创建分类目录，**同时修改本仓库** `config/_default/params.toml` 的 `mainSections` 配置
- 新增特殊页面（搜索/归档/友链）：需在本仓库 `layouts/` 中添加对应模板
- 头像/网站图标：在本仓库 `assets/` 中替换

## 内容规范

- 文章 front matter 必须包含 `title`、`date`、`categories`
- 分类目录名使用英文小写
- 图片资源通过 Hugo `resources` 引用

## Link Render Hook — `.md` 内部链接自动转换

`layouts/_default/_markup/render-link.html` 实现类似 Jekyll `jekyll-relative-links` 的功能。

### 原理

构建时，Markdown 中的 `](file.md)` 或 `](file.md#锚点)` 被 Goldmark link render hook 拦截：
1. 分离锚点，去掉 `.md` 后缀
2. 用 `.Page.GetPage` 解析目标 Hugo 页面
3. 输出页面实际 `.RelPermalink` + 锚点

### 示例

| Markdown 写法 | 当前文章 | 构建后 URL |
|---|---|---|
| `](file.md)` | `arch/swapfile.md` | `/arch/file/` |
| `](file.md#安装)` | `arch/swapfile.md` | `/arch/file/#安装` |
| `](../pve/lxc-nas.md)` | `arch/swapfile.md` | `/pve/lxc-nas/` |

### 迁移指南

逐步将现有链接统一为 `.md` 相对路径风格：

- `https://dev.leiyanhui.com/pve/lxc-nas` → `](../pve/lxc-nas.md)`
- `](/codeserver/install-codeserver)` → `](../codeserver/install-codeserver.md)`