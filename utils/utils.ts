import fs from "fs";
import { join as pathJoin } from "path";

/**
 * 读取指定文件夹下的所有文件
 * @param folderPath 文件夹路径
 * @returns 文件列表
 */
export const readFilesInFolder = (folderPath: string): string[] => {
  const files: string[] = [];

  const entries = fs.readdirSync(folderPath);

  for (const entry of entries) {
    const entryPath = `${folderPath}/${entry}`;

    const isFile = fs.statSync(entryPath).isFile();

    if (isFile) {
      files.push(entryPath);
    } else {
      const nestedFiles = readFilesInFolder(entryPath);
      files.push(...nestedFiles);
    }
  }

  return files;
};

/**
 * 拼接路径
 * @param path 相对路径
 * @returns 绝对路径
 */
export const joinPath = (path: string) => pathJoin(__dirname, path);

/**
 * 获取路径中的值
 * @param url url
 * @returns 域名，路径
 */
export const splitUrl = (url: string): { domain: string; path: string } => {
  const urlObj = new URL(url);

  const domain = urlObj.hostname.split(".")[0];

  const path = urlObj.pathname.split("/").pop() || "";

  return { domain, path };
};

/**
 * 获取时间
 * @param date Date对象
 * @returns YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
