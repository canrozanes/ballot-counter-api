import { Router, Request, Response } from "express"
import Ballot from "../models/ballot"

const ballot = Router()

ballot.get("/", (req: Request, res: Response) => {
  return res.json("OK")
})
ballot.post("/", async (req: Request, res: Response) => {
  const { title, options } = req.body
  if (!title || !options) {
    res.status(400).json({ message: "bad request: missing title or options" })
  }
  const newBallot = new Ballot({
    title,
    options,
  })
  try {
    const dbResponse = await newBallot.save()
    res.status(200).json(dbResponse)
  } catch (e) {
    console.log(e.message)
  }
})

export default ballot
