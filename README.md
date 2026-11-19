# 碗糖时序（wantang-app）

“碗糖时序”移动端应用的产品设计与开发仓库。

## 当前阶段

项目已进入第一版 MVP 的首页开发阶段。

当前工作重点：

1. 用 Expo + React Native + TypeScript 实现安卓 App。
2. 先用模拟数据跑通首页和用户服务流程。
3. 第二阶段再开发购物业务和真实服务器接口。
4. 后续补齐登录、加载、失败、空数据和权限说明页面。

## 查看首页

```bash
npm install
npm start
```

在安卓手机安装 Expo Go，确保手机和电脑处于同一网络，然后扫描终端显示的二维码。

## 设计稿

- Figma：[碗糖时序](https://www.figma.com/design/GIljNBjVv1ZSfuLuHmNu3o/)
- 当前已检查页面：`1:202 首页`

## 仓库约定

- 默认分支：`main`
- 每项工作先建立 Issue，再在独立分支中完成。
- 通过 Pull Request 审核后合并到 `main`。
- 不向仓库提交密码、API 密钥、支付密钥、证书或用户隐私数据。
- 技术方案未确定前，不创建框架代码。

## 目录说明

- `docs/`：产品决策、开发前检查清单和说明文档
- `src/app/`：App 页面
- `src/data/`：第一阶段模拟数据
- `src/theme/`：颜色等统一样式
- `assets/figma/`：从 Figma 下载并存入项目的图片资源
- `.github/`：Issue 与 Pull Request 模板
- `.gitignore`：禁止上传的本地文件和敏感文件规则

## 项目负责人

GitHub：[@xiedianchen29-eng](https://github.com/xiedianchen29-eng)
