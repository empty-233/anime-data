# anime-data

[English](./README.en.md) | 简体中文

将 [bangumi-data](https://github.com/bangumi-data/bangumi-data) 和 [anime-offline-database](https://github.com/manami-project/anime-offline-database) 仓库合并，并为其添加了 TypeScript 类型定义。

## 项目结构

数据文件位于 `release` 分支。

```text
.
├── data.d.ts               # 完整数据集的 TypeScript 声明文件
├── data.json               # 单个文件中的所有动画数据
├── bangumi-data            # 包含类型定义的 bangumi-data
│   └── data.d.ts
├── season                  # 按季节组织的动画数据
│   └── [年]                # 每年的目录
│       └── [季节].json   # 特定季节的数据 (例如, spring.json)
└── years                   # 按发行年份组织的动画数据 (遵循 bangumi-data 结构)
    └── [年]                # 每年的目录
        └── [月].json        # 在该月开始播放的动画
```

## 使用方法

### Git

建议克隆 `release` 分支，该分支包含最新的数据。

```bash
git clone --depth 1 -b release https://github.com/empty-233/anime-data.git
```

### 直接下载

您也可以直接从 GitHub 上的 `release` 分支下载数据。

## 更新频率

数据每周一凌晨3点通过 GitHub Actions 自动更新。
