import { server } from "./config/server.js";
import "./config/io.js";
import { PORT, SERVER_URL } from "./config/config.js";
import cluster from 'cluster'
import { logger } from './utils/logger.js'
import { cpus } from 'os'
import createFolders from "./config/folders.js";
import { uploadsFoldersConfig } from "./config/folders.js";

const numProcess = cpus().length

const initServer = () => {
  server.listen(PORT, (error) => {
    if (error) logger.info(error);
    logger.info(`Server up in port: ${PORT}`);
    logger.info(`${SERVER_URL}:${PORT}`);
  });
}

if (cluster.isPrimary) {
  logger.info(createFolders(uploadsFoldersConfig))
  logger.info(`primary process ${process.pid}, generating a process worker`)
  for(let i = 0; i < numProcess; i++){
    cluster.fork()
  }
} else {
  logger.info(`I am worker ${process.pid}`)
  initServer()
}
