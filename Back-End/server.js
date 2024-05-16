import http from "http";

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("Servidor do projeto Casa do Microondas");
}); 

server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
})