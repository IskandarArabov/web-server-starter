const path = require("path");
const fs = require("fs");

const publicFolders = {
    "css": "stylesheets",
    "js": "javascript",
    "jpg": "image",
    "jpeg": "image",
    "png": "image",
    "ico": "image" // add some if u need to
};

const responses = {
    "/": "views/index.html"
};

function handleRequest(request) {
    const url = new URL(request.url);
    
    if (responses.hasOwnProperty(url.pathname)) {
        return new Response(Bun.file(responses[url.pathname]));
    }
    else {
        const fileExt = path.extname(url.pathname).slice(1);
        if (publicFolders.hasOwnProperty(fileExt)) {
            const filePath = path.join(__dirname, "public", publicFolders[fileExt], url.pathname); 
            if (fs.existsSync(filePath)) {
                return new Response(Bun.file(filePath));
            }
            return new Response(
                "Error: file not found",
                {status: 404}
            );
        } 
        return new Response(
            Bun.file("views/404.html"),
            {status: 404}
        );              
    }
}

module.exports = {
    handleRequest
}
