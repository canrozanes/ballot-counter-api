import { config as configDotEnv } from "dotenv"
import express from "express"
import cors from "cors"
import MongoDBConnect from "./config/db"
import * as testDB from "./config/test-db"
import ballotRouter from "./routes/ballot"

// Load all the env variables
const envLoadResults = configDotEnv()
if (envLoadResults.error) {
  throw envLoadResults.error
}

// Connect Database
if (process.env.NODE_ENV === "production") {
  MongoDBConnect()
}

const PORT = process.env.PORT || 5000

const app = express()

// Init MiddleWare
app.use(express.json())
app.use(cors())

app.get("/", (_, res) => res.send("API Running"))

app.use("/ballot", ballotRouter)

// eslint-disable-next-line no-console
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server started on port :${PORT}`))
}

export default app
