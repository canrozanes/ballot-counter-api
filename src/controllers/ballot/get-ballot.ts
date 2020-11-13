import { Request, Response } from "express"
import Ballot from "../../models/ballot"

export const getBallot = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  try {
    const ballot = await Ballot.findById(id)
    if (!ballot) {
      res.status(404).json({ message: "ballot not found" })
      return
    }
    res.status(200).json({
      ballot,
      message: "success",
    })
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ message: "something went wrong" })
  }
}

export default getBallot
