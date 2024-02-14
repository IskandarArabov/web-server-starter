const http = require("http");
const fs = require("fs");

const HOST = "localhost";
const PORT = 8000;

// file related functions

const mimeTypes = {
  "html": "text/html",
  "htm": "text/html",
  "txt": "text/plain",
  "css": "text/css",
  "js": "application/javascript",
  "json": "application/json",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "ico": "image/x-icon"
}

const getFileExtension = (filepath) => {
  return filepath.split('.').pop();
}

const getContentType = (extension) => {
  return mimeTypes[extension];
}

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(`Error reading file: ${filePath}`);
    throw new Error(err);
  }
}

const pathExists = async (path) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}

// request related functions

const postRequestHandler = (req, res) => {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });
  
  req.on("end", () => {
    requestBody = JSON.parse(bodyRequest);
    let responseBody = {};

    // TODO handle request

    responseBody = JSON.stringify(responseBody);
    res.end(responseBody);
  });
}

const getRequestHandler = async (req, res) => {
  // handling public files requests
  if (req.url.startsWith("public/") || req.url.startsWith("/public/")) {
    const filePath = `.${req.url}`;
    if (await pathExists(filePath)) {
      try {
        const data = await readFile(filePath);
        const contentType = getContentType(getFileExtension(filePath));
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error 500: Internal Server Error");
      }      
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Error 404: Page Not Found");
    }
    return;
  }
  
  // handling web pages requests
  switch (req.url) {
    case "/":
      try {
        const data = await readFile("./views/index.html");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain"});
        res.end("Error 500: Internal Server Error");
      }
      break;
    default:
      try {
        const data = await readFile("./views/404.html");
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(data);
      } catch (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error 404: Page Not Found");
      }
      break;
  }
}

const server = http.createServer((req, res) => { 
  switch (req.method) {
    case "POST":
      postRequestHandler(req, res);
      break;
    case "GET":
      getRequestHandler(req, res);
      break;
    default:
      res.end();
      break;
  }
});

server.listen(PORT, HOST, () => {
  console.log(`It's alive on http://${HOST}:${PORT}`)
});
