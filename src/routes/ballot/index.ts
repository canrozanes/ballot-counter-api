import { Router } from "express"

import {
  postBallot,
  getBallot,
  castVote,
  setVotingComplete,
} from "../../controllers/ballot"

const ballotRouter = Router()

ballotRouter.post("/", postBallot)
ballotRouter.get("/:id", getBallot)
ballotRouter.post("/:id/cast-vote", castVote)
ballotRouter.patch("/:id/set-voting-complete", setVotingComplete)

export default ballotRouter
