import { Schema, Document, model } from "mongoose"

interface IBallot extends Document {
  title: string
  options: string[]
}

const BallotSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
})

export default model<IBallot>("Ballot", BallotSchema)
