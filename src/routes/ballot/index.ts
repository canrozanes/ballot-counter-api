import { Router, Request, Response } from "express"
import Ballot from "../../models/ballot"
import PluralityVote from "../../models/plurality-vote"
import getWinner from "../../utils/get-winner"

const ballotRouter = Router()

ballotRouter.post("/", async (req: Request, res: Response) => {
  const { title, options } = req.body
  if (!title || !options) {
    res.status(400).json({ message: "bad request: invalid ballot" })
    return
  }
  const newBallot = new Ballot({
    title,
    options,
  })
  try {
    const dbResponse = await newBallot.save()
    res.status(201).json({ ballot: dbResponse, message: "new ballot created" })
    return
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ message: "something went wrong" })
  }
})

ballotRouter.post("/:id/cast-vote", async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const ballot = await Ballot.findById(id)

    if (!ballot) {
      res.status(400).json({ message: "bad request: invalid vote" })
      return
    }

    if (ballot.type === "plurality") {
      const { choice } = req.body
      const newVote = new PluralityVote({
        choice,
        ballot,
      })
      const voteResponse = await newVote.save()
      res.status(201).json({
        ballot: {
          voteResponse,
        },
        message: "vote successfully cast",
      })
      return
    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ message: "something went wrong" })
  }
})

ballotRouter.patch(
  "/:id/set-voting-complete",
  async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const ballot = await Ballot.findById(id)
      if (!ballot) {
        res.status(404).json({ message: "no such ballot exists" })
        return
      }
      if (ballot.isComplete) {
        res.status(403).json({ message: "ballot is already complete" })
        return
      }
      if (ballot.type === "plurality") {
        await Ballot.findByIdAndUpdate(id, { isComplete: true })
        const votes = await PluralityVote.find({ ballot: id })
        if (votes.length === 0) {
          res.status(403).json({
            message: "no vote was cast on this ballot, vote is now cancelled",
          })
          return
        }
        const sanitizedVotes = votes.map((vote) => vote.choice)
        const result = getWinner(sanitizedVotes)
        res.status(200).json({
          winner: result.winner,
          count: result.count,
          message: "voting is complete",
        })
        return
      }
    } catch (e) {
      console.log(e.message)
      res.status(500).json({ message: "something went wrong" })
    }
  }
)

// ballot.get("/:id", async (req: Request, res: Response) => {})

export default ballotRouter
