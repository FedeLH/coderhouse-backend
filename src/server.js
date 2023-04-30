import { server } from "./config/server.js";
import "./config/io.js";
import { PORT, SERVER_URL } from "./config/config.js";

server.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`Server up in port: ${PORT}`);
  console.log(`${SERVER_URL}:${PORT}`);
});
