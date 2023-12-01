import fs from "fs";
import { join as pathJoin } from "path";
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

//判断是否一致
const findIfExists = (
  objects: Array<animeOfflineDatabaseData>,
  value: string
) => {
  return objects.filter((obj) =>
    obj.synonyms.some((element) => element == value)
  );
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
  bangumi_data.map((bangumiData) => {
    const aod = findIfExists(anime_offline_database.data, bangumiData.title);
    if (aod.length !== 0) {
      aod[0].relations.map((url) => {
        const result = splitUrl(url);
        bangumiData.sites.push({
          site: result.domain,
          id: result.path,
        });
      });
      const data = {
        ...bangumiData,
        animeSeason: aod[0].animeSeason,
        status: aod[0].status,
        episodes: aod[0].episodes,
        picture: aod[0].picture,
        thumbnail: aod[0].thumbnail,
        synonyms: aod[0].synonyms,
      };
      //拆分月份，和bangumi一致
      const pathSplit = path.split("/");
      writeJsonFile(
        `./data/years/${pathSplit.at(-2)}`,
        `${pathSplit.pop()?.split(".")[0]}.json`,
        data
      );
      animeData.data.push(data);
    }
  });
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
