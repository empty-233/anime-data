import { execSync } from "child_process";
import fs from "fs";

/**
 * 拉取最新的git
 * @param repositoryUrl 仓库地址
 * @param destinationPath 存储路径
 */
export const cloneRepository = (
    repositoryUrl: string,
    destinationPath: string
): void => {
    try {
        const repoExists = fs.existsSync(destinationPath);
        if (repoExists) {
            execSync(`git -C ${destinationPath} pull --rebase --depth 1`);
        } else {
            execSync(`git clone --depth 1 ${repositoryUrl} ${destinationPath}`);
        }
        console.log("Repository cloned successfully!");
    } catch (error) {
        console.error("Error cloning repository:", error);
    }
};
