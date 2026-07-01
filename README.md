# dev.leiyanhui.com-page

[dev.leiyanhui.com](https://dev.leiyanhui.com) 的构建和发布仓库。

## 协作关系

```
joyanhui/note (私有)                          joyanhui/dev.leiyanhui.com-page
┌─────────────────────────┐                  ┌─────────────────────────────────┐
│ dev.leiyanhui.com/      │  push 触发       │ main 分支:                      │
│   ├── config/           │ ──────────────→  │   .github/workflows/page_build.yml
│   ├── assets/           │  repository_dispatch  │                              │
│   ├── content/          │  (TOKEN_G)       │ CI 执行：                       │
│   ├── go.mod            │                  │   1. clone joyanhui/note        │
│   └── go.sum            │                  │   2. cd dev.leiyanhui.com       │
│                         │                  │   3. hugo --minify --gc         │
│ 另有 workflow：         │                  │   4. push public/ → gh-pages   │
│   .github/workflows/    │                  │                                  │
│    trigger-page-build.yml│                 │ gh-pages 分支: 静态 HTML        │
└─────────────────────────┘                  └─────────────────────────────────┘
                                                     ↑ GitHub Pages 从此分支 serve
```

## 密钥

| Secret | 作用 |
|---|---|
| `TOKEN_GH` | CI clone 私有库 `joyanhui/note` 时使用（需 `repo` 权限） |
| `TOKEN_G` | 配置在 `joyanhui/note` 仓库，用于触发本仓库的 CI |

## 分支说明

- **main** — Hugo 配置 + CI workflow（构建源）
- **gh-pages** — 构建后的静态 HTML（由 page_build CI 自动推送）
