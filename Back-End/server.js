import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import jwt from "jsonwebtoken";

const segredo = "remota";

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

app.get("/servicos", verificarToken, (req, res) => {
    res.status(200).send("Rota para servicos")
});

app.get("/marcas", (req, res) => {
    let html = `<html>
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

function verificarToken(req, res, next) {
    const token = req.headers["x-access-token"];
    jwt.verify(token, segredo, (erro, decodificado) => {
        if(erro)
            return res.status(401).end();
        req.id = decodificado.id;
        next();
    });
}

app.post("/login", (req, res) =>{
    let usu = req.body.usuario;
    let sen = req.body.senha;

    if(usu == "marcos" && sen == "123"){
        const id = 1;

        const token = jwt.sign({id}, segredo, {expiresIn: 300})
        
        console.log("Usuario " + usu + " logou no sistema");
        return res.status(500).json({autenticado: true, token: token});
    };
    res.status(501).send("Usuário inválido ou inexistente");
});

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