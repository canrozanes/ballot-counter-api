import { Router, Request, Response } from "express"
import Ballot from "../../models/ballot"

const ballot = Router()

ballot.post("/", async (req: Request, res: Response) => {
  const { title, options } = req.body
  if (!title || !options) {
    res.status(400).json({ message: "bad request: invalid ballot" })
  }
  const newBallot = new Ballot({
    title,
    options,
  })
  try {
    const dbResponse = await newBallot.save()
    res.status(201).json({ ballot: dbResponse, message: "new ballot created" })
  } catch (e) {
    console.log(e.message)
  }
})

ballot.patch("/set-voting-complete/:id", (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const ballotEntry = Ballot.findById(id)
    if (!ballotEntry) {
      res.status(404).json({ message: "no such ballot exists" })
    }
    res.status(200).json({ message: "ballot is now complete" })
    // TODO return ballot results
  } catch (e) {
    console.log(e.message)
  }
})

// ballot.get("/:id", async (req: Request, res: Response) => {})

export default ballot
