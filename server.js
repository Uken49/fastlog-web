require('dotenv').config()

const fs = require("fs");
const express = require("express")
const path = require("path")
const axios = require("axios");

const app = express()

const app_url = process.env.APP_URL
const app_port = process.env.APP_PORT
const api_rastreamento_url = process.env.API_RASTREAMENTO_URL

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/html/index.html`))
})

app.get("/rastrear/:idEncomenda", async (req, res) => {
    try {
        const { idEncomenda } = req.params;

        const apiResponse = await axios.get(`${api_rastreamento_url}/v1/encomendas/${idEncomenda}`);
        const dataCriacao = new Date(apiResponse.data.status.dataCriacao);
        const dataCriacaoFormatada = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(dataCriacao);
        const htmlPath = path.join(__dirname, "html", "index.html");
        let htmlContent = fs.readFileSync(htmlPath, "utf8");

        htmlContent = htmlContent
        .replace(
            '<div id="statusProduto"></div>',
            `<div class="produto">
                <span>${apiResponse.data.status.descricao}</span> <br>
                <span>${apiResponse.data.status.pais} - ${apiResponse.data.status.cidade}</span> <br>
                <span>${dataCriacaoFormatada}</span> <br>
            </div>`
        ).replace(
            '<div id="produto"></div>',
            `<div class="produto">
                <div>
                    <span><b>Produto: </b></span>
                    <span>${apiResponse.data.nome}<br>
                </div>
                <div>
                    <span><b>País de Origem: </b></span>
                    <span>${apiResponse.data.origem}</span> <br>
                </div>
                <div>
                    <span><b>Destino: </b></span>
                    <span>${apiResponse.data.destino}</span>
                </div>
            </div>`
        );

        res.send(htmlContent);
    } catch (error) {
        const htmlPath = path.join(__dirname, "html", "index.html");
        let htmlContent = fs.readFileSync(htmlPath, "utf8");
        
        htmlContent = htmlContent
        .replace(
            `<div id="mensagem-erro"></div>`,
            `<div class="produto" id="mensagem-erro">
                Produto com o código informado não encontrado.
            </div>`
        );

        console.error("Erro ao rastrear encomenda:", error.message);
        res.send(htmlContent);
    }
});


app.listen(app_port, () => {
    console.log(`Servidor rodando na url http://${app_url}:${app_port}`)
})