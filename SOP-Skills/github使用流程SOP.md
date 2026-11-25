# GitHub 使用流程 SOP

> 记录目录：`D:\mjj-work\08-develop\01-opl`
> 远端仓库：https://github.com/mjj-250/01_opl.git

## 一、首次推送（已完成）

### 环境
- 系统：Windows，Shell：PowerShell 7
- Git：2.56.0.windows.2
- 本地身份：`user.name = 幻云`、`user.email = 1022603016@qq.com`（全局配置已存在，无需重复设置）

### 实际执行记录
执行时间：2026-11-25，执行结果：成功

| 步骤 | 命令 | 结果 |
| --- | --- | --- |
| 1 | `git init` | 初始化空仓库 `D:/mjj-work/08-develop/01-opl/.git` |
| 2 | `git add -A` | 暂存 21 个文件 |
| 3 | `git commit -m "first commit"` | 生成根提交 `422e438`，21 files changed, 788 insertions |
| 4 | `git branch -M main` | 主分支重命名为 `main` |
| 5 | `git remote add origin https://github.com/mjj-250/01_opl.git` | 绑定远端 |
| 6 | `git push -u origin main` | 成功，`main -> main`，已建立本地/远端跟踪 |

远端校验：`git ls-remote origin` 返回
```
422e438a33e883b1e03f1ef8daf5e6a46c8e5fff  refs/heads/main
```

### 与参考命令的差异
- 参考命令中的 `echo "# 01_opl" >> README.md` **未执行**：目录内已存在 `readme.md`，Windows 文件系统不区分大小写，追加会污染原文件正文。README 建议直接编辑内容，而不是用 echo 追加。
- 未生成 `.gitignore`：本次目录内没有 `node_modules`、`.venv`、`__pycache__` 等需忽略目录，可直接推送。后续新增代码工程时应补 `.gitignore`。

### 本次遇到的问题
- `git add` 阶段出现大量 `LF will be replaced by CRLF` 警告：仅换行符自动转换提示，不影响提交。如需统一，可加 `.gitattributes` 设置 `* text=auto eol=lf`。
- 推送认证由 Git Credential Manager 自动完成，未弹出账号输入框；换机器时需先登录一次或配置 PAT。

## 二、日常迭代流程

```powershell
cd D:\mjj-work\08-develop\01-opl
git pull --rebase        # 先同步远端，避免冲突
git status               # 确认改动文件
git add -A
git commit -m "类型: 说明"   # 例：docs: 补充 SOP 记录
git push
```

提交信息建议前缀：`feat:` 新功能、`fix:` 修复、`docs:` 文档、`chore:` 杂项、`refactor:` 重构。

## 三、常用排查

| 场景 | 命令 |
| --- | --- |
| 查看远端地址 | `git remote -v` |
| 修改远端地址 | `git remote set-url origin <新地址>` |
| 查看提交历史 | `git log --oneline -10` |
| 撤销未提交改动 | `git restore <文件>` |
| 撤销已 add 未 commit | `git restore --staged <文件>` |
| 查看与远端差异 | `git diff origin/main..HEAD` |
| 推送被拒（远端已更新） | `git pull --rebase` 后重新 `git push` |

## 四、待补充
- [ ] `.gitignore` 模板（Python / Node / IDE 缓存）
- [ ] 分支策略（main 保护 + feature 分支 + PR 流程）
- [ ] PAT（Personal Access Token）申请与配置步骤
- [ ] 大文件与 Git LFS 使用规则
