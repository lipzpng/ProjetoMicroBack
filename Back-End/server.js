import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const porta = 3000;
const conexao = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "CsMicroBD",
    user: "root",
})

conexao.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(porta, () => {
    console.log("Servidor escutando na porta 3000")
});

app.get("/", (req, res) => {
    res.status(200).send("CsMicro Server");
});

app.get("/servicos", (req, res) => {
    res.status(200).send("Rota para servicos")
});

app.get("/marcas", (req, res) => {
    html = `<html>
            <head>
                <title>Projeto CsMicro</title>
            </head>
            <body>
                <h1>Casa do microondas</h1>
                <p>Este é o novo site da casa do microondas</p>
            </body>
        </html>`
    res.status(200).send(html);
})

app.post("/servicos", (req, res) => {
    let titulo = req.body.titulo;
    let desc = req.body.desc;
    let img = req.body.img;
    let ordm_apresenta = req.body.ordm_apresenta;
    let url = req.body.url;
    let ativo = true;

    conexao.query(
        `CALL SP_Ins_Servico(?, ?, ?, ?, ?, ?, @message)`, [titulo, desc, img, ordm_apresenta, url, ativo], (erro, linhas) => {
            if(erro) {
                console.log(erro);
                res.send("Problema ao inserir serviço - tente de novo");
            } else { 
                console.log(linhas);
                res.send("Serviço inserido");
            }
        }
    );
});

app.post("/marcas", (req, res) => {
    let desc = req.body.desc;
    let logo = req.body.img;
    let url = req.body.url;

    conexao.query(
        `CALL SP_Ins_Marca(?, ?, ?,@message)`, [desc, logo, url], (erro, linhas) => {
            if(erro) {
                console.log(erro);
                res.send("Problema ao inserir marca - tente de novo");
            } else { 
                console.log(linhas);
                res.send("Marca inserida");
            }
        }
    );
});