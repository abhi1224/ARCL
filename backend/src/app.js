import dotenv from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors())


export default app