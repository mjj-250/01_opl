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

## 四、常用排查

| 场景 | 命令 |
| --- | --- |
| 查看远端地址 | `git remote -v` |
| 修改远端地址 | `git remote set-url origin <新地址>` |
| 查看提交历史 | `git log --oneline -10` |
| 撤销未提交改动 | `git restore <文件>` |
| 撤销已 add 未 commit | `git restore --staged <文件>` |
| 查看与远端差异 | `git diff origin/main..HEAD` |
| 推送被拒（远端已更新） | `git pull --rebase` 后重新 `git push` |

## 三、系统代理与 Git 代理

### 2026-11-27 实际问题与结论

**现象**：系统已开启代理，但 `git push` 连续出现 `Failed to connect to github.com:443`。

**原因**：Windows 用户代理为 `127.0.0.1:7897`，Git 没有 `http.proxy` 或代理环境变量，因此仍在直连。系统代理开启不等于 Git 自动走代理。

**验证**：通过 `git -c http.proxy=http://127.0.0.1:7897 ls-remote --heads origin main mjj` 成功读取远程分支。

**处理**：仅为当前仓库设置代理，不修改全局 Git 配置：

```powershell
git config --local http.proxy http://127.0.0.1:7897
git ls-remote --heads origin
```

代理端口变化时更新该值；不再需要时执行 `git config --unset http.proxy`。优先使用系统实际代理地址和端口，不凭经验写死其他机器的端口。

### 日常检查顺序

```powershell
# 查看 Git 是否配置代理
git config --show-origin --get-regexp "^(http|https)\..*proxy$|^http\.proxy$|^https\.proxy$"

# 查看 Windows 用户代理（PowerShell）
Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" |
  Select-Object ProxyEnable, ProxyServer, AutoConfigURL

# 使用临时代理验证，不改配置
git -c http.proxy=http://127.0.0.1:7897 ls-remote --heads origin
```

## 五、将工作分支合并到主分支

合并前先确认工作区干净并获取远程最新状态，不直接覆盖远程 main。若工作分支包含 main 的全部提交，优先使用快进合并：

```powershell
git fetch origin
git switch main
git pull --ff-only origin main
git merge --ff-only mjj
git push origin main
git switch mjj
```

如果远程 main 有新提交或分支已经分叉，先检查差异，再选择正常合并或 rebase；不能使用强制推送覆盖。合并后通过 `git log --oneline --graph --decorate -10`、`git status --branch` 和远程分支哈希核对结果。

## 六、待补充
- [ ] `.gitignore` 模板（Python / Node / IDE 缓存）
- [ ] 分支保护、PR 审查与需要非快进合并时的流程（普通快进合并见第五节）
- [ ] PAT（Personal Access Token）申请与配置步骤
- [ ] 大文件与 Git LFS 使用规则
