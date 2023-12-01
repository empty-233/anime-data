// @ts-ignore
import { Item } from "./original-data/bangumi-data/data.js";

declare type Season = "SPRING" | "SUMMER" | "FALL" | "WINTER" | "UNDEFINED";
declare type Status = "UPCOMING" | "ONGOING" | "FINISHED";

declare interface Root {
  repository: string;
  lastUpdate: string;
  data: Data[];
}

declare interface Data extends Item {
  /**
   * 季节和年
   */
  animeSeason: AnimeSeason;
  /**
   * 状态
   */
  status: Status;
  /**
   * 剧集
   */
  episodes: number;
  /**
   * 图片
   */
  picture: string;
  /**
   * 缩略图
   */
  thumbnail: string;
  /**
   * 标题(同义词)
   */
  synonyms: Array<string>;
}

declare interface AnimeSeason {
  /**
   * 季节
   */
  season: Season;
  /**
   * 年份
   */
  year: number;
}
