import { Request, Response } from "express"
import Ballot from "../../models/ballot"
import PluralityVote from "../../models/plurality-vote"
import getWinner from "../../utils/get-winner"

export const setVotingComplete = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export default setVotingComplete
