export type Season = "SPRING" | "SUMMER" | "FALL" | "WINTER" | "UNDEFINED";
export type Status = "UPCOMING" | "ONGOING" | "FINISHED";

export interface Root {
  license: License;
  repository: string;
  lastUpdate: string;
  data: Array<Data>;
}

export interface Data {
  sources: Array<string>;
  title: string;
  type: string;
  episodes: number;
  status: Status;
  animeSeason: AnimeSeason;
  picture: string;
  thumbnail: string;
  synonyms: Array<string>;
  relations: Array<string>;
  tags: Array<string>;
}

export interface AnimeSeason {
  season: Season;
  year: number;
}

export interface License {
  name: string;
  url: string;
}
