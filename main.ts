import fs from "fs";
import { join as pathJoin, parse } from "path";
import { Root, Data } from "./data.d.js";
import { cloneRepository } from "./utils/git.js";
import { readFilesInFolder, splitUrl, formatDate } from "./utils/utils.js";
// @ts-ignore
import { Item as bangumiDataList } from "./original-data/bangumi-data/data.js";
import {
  Root as animeOfflineDatabaseList,
  Data as animeOfflineDatabaseData,
} from "./type/anime-offline-database.js";

export const gitClone = (
  repositoryUrl: string,
  destinationPath: string
): void => {
  cloneRepository(repositoryUrl, destinationPath);
};

//拉取仓库
const bangumi_data_path: string = "./original-data/bangumi-data";
const anime_offline_database_path: string =
  "./original-data/anime-offline-database";

gitClone("https://github.com/bangumi-data/bangumi-data.git", bangumi_data_path);
gitClone(
  "https://github.com/manami-project/anime-offline-database.git",
  anime_offline_database_path
);

//读取所有文件
const bangumi_data_paths = readFilesInFolder(
  `${bangumi_data_path}/data/items`
).reverse();

const readFile = (path: string) => JSON.parse(fs.readFileSync(path, "utf-8"));

const anime_offline_database: animeOfflineDatabaseList = readFile(
  `${anime_offline_database_path}/anime-offline-database.json`
);

/**
 * 判断是否一致
 * @param objects 元数据
 * @param value 匹配值
 * @returns 匹配结果
 */
const findIfExists = (
  objects: Array<animeOfflineDatabaseData>,
  value: string,
  matchField: keyof animeOfflineDatabaseData
) => {
  return objects.filter((obj) => {
    const fieldValue = obj[matchField];
    if (Array.isArray(fieldValue)) {
      // If fieldValue is an array, use the some() method to check if the array contains the value.
      return fieldValue.some((element) => element == value);
    } else {
      // If fieldValue is not an array, check if it is equal to the value.
      return fieldValue == value;
    }
  });
};

/**
 * 获取文件名
 * @param filePath 路径
 * @returns 文件名
 */
const getFileNameFromPath = (filePath: string): string => {
  const parsedPath = parse(filePath);
  return parsedPath.name;
};

//写入文件
const writeJsonFile = (folderPath: string, filePath: string, data: any) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    fs.writeFileSync(
      pathJoin(folderPath, filePath),
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error(err);
  }
};

//匹配
const date = new Date();
let animeData: Root = {
  repository: "https://github.com/empty-233/anime-data",
  lastUpdate: formatDate(date),
  data: [],
};
bangumi_data_paths.map((path) => {
  const bangumi_data: Array<bangumiDataList> = readFile(path);
  let datas: Array<Data> = [];
  bangumi_data.map((bangumiData) => {
    const aods = findIfExists(
      anime_offline_database.data,
      bangumiData.title,
      "synonyms"
    );
    if (aods.length !== 0) {
      const typeMatching = findIfExists(
        aods,
        bangumiData.type.toUpperCase(),
        "type"
      );
      // 如果type匹配成功就使用type匹配结果
      const aod =
        typeMatching.length !== 0
          ? typeMatching[typeMatching.length - 1]
          : aods[aods.length - 1];
      if (aod.relations)
        aod.relations.map((url) => {
          const result = splitUrl(url);
          bangumiData.sites.push({
            site: result.domain,
            id: result.path,
          });
        });
      const data = {
        ...bangumiData,
        animeSeason: {
          ...aod.animeSeason,
          month: getFileNameFromPath(path),
        },
        status: aod.status,
        episodes: aod.episodes,
        picture: aod.picture,
        thumbnail: aod.thumbnail,
        synonyms: aod.synonyms,
      };
      datas.push(data);
      animeData.data.push(data);
    }
  });
  //拆分月份，和bangumi一致
  const pathSplit = path.split("/");
  writeJsonFile(
    `./data/years/${pathSplit.at(-2)}`,
    `${pathSplit.pop()?.split(".")[0]}.json`,
    datas
  );
});

//拆分季节
interface ClassifiedAnime {
  [key: string]: {
    [key: string]: Data[];
  };
}
const categorizeAnimatedYearsAndSeasons = (data: Data[]) => {
  const classified: ClassifiedAnime = {};

  data.forEach((anime) => {
    const { season, year } = anime.animeSeason;
    if (!classified[year]) {
      classified[year] = {};
    }
    if (!classified[year][season]) {
      classified[year][season] = [];
    }
    classified[year][season].push(anime);
  });

  return classified;
};
const classifiedAnime = categorizeAnimatedYearsAndSeasons(animeData.data);
for (const year in classifiedAnime) {
  if (Object.prototype.hasOwnProperty.call(classifiedAnime, year)) {
    const datas = classifiedAnime[year];
    if (year != null && year != "null")
      for (const season in datas) {
        if (Object.prototype.hasOwnProperty.call(datas, season)) {
          const data = datas[season];
          if (season != null && season != "null")
            writeJsonFile(`./data/season/${year}`, `${season}.json`, data);
        }
      }
  }
}

//写入全部
writeJsonFile("./data", "data.json", animeData);
