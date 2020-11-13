import { Request, Response } from "express"
import Ballot from "../../models/ballot"
import PluralityVote from "../../models/plurality-vote"

export const castVote = async (req: Request, res: Response): Promise<void> => {
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
}

export default castVote
