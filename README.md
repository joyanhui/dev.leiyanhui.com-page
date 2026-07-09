# dev.leiyanhui.com-page

[dev.leiyanhui.com](https://dev.leiyanhui.com) 的构建和发布仓库。

## 协作关系

```
joyanhui/note (私有)                          joyanhui/dev.leiyanhui.com-page
┌─────────────────────────┐                  ┌─────────────────────────────────┐
│ dev.leiyanhui.com/      │  push 触发       │ main 分支:                      │
│   ├── content/          │ ──────────────→  │   config/_default/  Hugo 配置   │
│                         │  repository_dispatch  │   layouts/          主题模板        │
│ 另有 workflow：         │  (TOKEN_GH)      │   assets/          资源文件     │
│   .github/workflows/    │                  │   .github/workflows/ CI 配置    │
│    trigger-page-build.yml│                 │                                  │
│                         │                  │ CI 执行：                       │
│ 注：本仓库不管理        │                  │   1. clone joyanhui/note        │
│   config/ assets/       │                  │   2. 合并 content/ 到本仓库     │
│   layouts/ go.mod       │                  │   3. hugo --minify --gc         │
│   这些由 page 仓库统一管理│                  │   4. push public/ → gh-pages   │
└─────────────────────────┘                  └─────────────────────────────────┘
                                                      ↑ GitHub Pages 从此分支 serve
```

## 密钥

| Secret | 作用 |
|---|---|
| `TOKEN_GH` | 两个仓库共用：note 用来触发本仓库 dispatch，本仓库用来 clone 私有库 `joyanhui/note`（需 `repo` 权限） |

## 分支说明

- **main** — Hugo 配置 + 主题模板 + 资源 + CI workflow（构建源）
- **gh-pages** — 构建后的静态 HTML（由 CI 自动推送）