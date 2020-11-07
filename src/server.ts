import express from "express"
import cors from "cors"
import ballotRouter from "./routes/ballot"

const PORT = process.env.PORT || 5000

const app = express()

// Init MiddleWare
app.use(express.json())
app.use(cors())

app.get("/", (_, res) => res.send("API Running"))

app.use("/ballot", ballotRouter)

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

export default app
