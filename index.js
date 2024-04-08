import { handleRequest } from "./server";

Bun.serve({
    port: 8080,
    host: "localhost",
    development: false,

    fetch(request) {
        return handleRequest(request); 
    }
});

console.log("http://localhost:8080");
