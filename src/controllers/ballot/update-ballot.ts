import { Request, Response } from "express"
import Ballot from "../../models/ballot"

export const updateBallot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  const { adminToken } = req.query
  const { title, options } = req.body

  const updates = Object.keys(req.body)
  const allowedUpdates = ["title", "options"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    res
      .status(400)
      .send({ message: "bad request: this operation is not valid" })
    return
  }

  try {
    const ballot = await Ballot.findById(id)
    if (!ballot) {
      res.status(404).json({ message: "no such ballot exists" })
      return
    }
    if (adminToken !== ballot.adminToken) {
      res.status(404).json({ message: "no such ballot exists" })
      return
    }
    if (ballot.type === "plurality") {
      const updatedBallot = await Ballot.findByIdAndUpdate(
        id,
        {
          title,
          options,
        },
        { new: true }
      )
      res.status(200).json({
        title: updatedBallot.title,
        options: updatedBallot.options,
        message: "update successful",
      })
      return
    }
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ message: "something went wrong" })
  }
}

export default updateBallot
