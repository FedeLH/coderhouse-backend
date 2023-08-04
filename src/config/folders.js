import fs from "fs";
import path from "path";
import __dirname from "../utils/utils.js"
import { logger } from '../utils/logger.js'


export const uploadsFoldersConfig = {
    relativePath: "public/uploads",
    subFolders: [
        "profiles",
        "products",
        "documents",
        "tmp"
    ]
}

const createFolders = (folderConfig) => {
    const { relativePath, subFolders} = folderConfig
    const folderPath = path.join(__dirname, relativePath)

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        logger.info(`Folder created: ${folderPath}`);
    }

    if (subFolders && subFolders.length > 0) {
        for (let i = 0; i < subFolders.length; i++) {
            const subFolderName = subFolders[i];
            const subFolderPath = path.join(folderPath,subFolderName)

            if (!fs.existsSync(subFolderPath)) {
                fs.mkdirSync(subFolderPath);
                logger.info(`Subfolder created: ${subFolderPath}`);
            }
        }
    }

    return "Folders ok"
}

export default createFolders
