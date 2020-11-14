import { Router } from "express"

import {
  createBallot,
  getBallot,
  castVote,
  setVotingComplete,
  updateBallot,
} from "../../controllers/ballot"

const ballotRouter = Router()

ballotRouter.post("/", createBallot)
ballotRouter.get("/:id", getBallot)
ballotRouter.post("/:id/cast-vote", castVote)
ballotRouter.patch("/:id/set-voting-complete", setVotingComplete)
ballotRouter.patch("/:id/update-ballot", updateBallot)

export default ballotRouter
