import fs from "fs";
import { join as pathJoin } from "path";
import * as path from "path";
import * as https from "https";
import * as http from "http";

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

/**
 * 下载JSON文件
 * @param url JSON文件的URL
 * @param filePath 本地保存路径
 * @returns Promise
 */
export const downloadJson = (url: string, filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const makeRequest = (requestUrl: string) => {
      protocol.get(requestUrl, (response) => {
        // 处理重定向
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            console.log(`Redirecting to: ${redirectUrl}`);
            makeRequest(redirectUrl);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            
            // 确保目录存在
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            
            // 保存文件
            fs.writeFileSync(filePath, data);
            
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    };

    makeRequest(url);
  });
};
