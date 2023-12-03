# anime-data

将[bangumi-data](https://github.com/bangumi-data/bangumi-data)和[anime-offline-database](https://github.com/manami-project/anime-offline-database)仓库合并，并为其添加了typescript类型定义

## 项目结构

切换到release分支

``` text
.
├── bangumi-data            # bangumi-data data.d.ts
│   └── data.d.ts  
├── season                  # 季节
│   └── [年]                # 以年份分割的目录
|       └──[季节].json      # 以季节分割
├── years                   # 年(按照bangumi-data仓库结构)
│   └── [年]                # 以年份分割的目录
|       └──[月].json        # 以月份分割的目录，番组以开播年月放在对应的文件中
├── data.d.ts               # data.d.ts(typescript声明文件)
└── data.json               # 全部数据
```

## 使用方法

### git

``` bash
git clone --depth 1 https://github.com/empty-233/anime-data.git -b release
```

### 直接下载

切换到release分支

## 更新频率

每周一3点通过GitHub action构建
