import { Schema, Document, model } from "mongoose"

interface IBallotSchemaDocument extends Document {
  title: string
  options: string[]
}

export interface IBallot {
  title: string
  options: string[]
}

const BallotSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ranked", "plurality"],
    default: "plurality",
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  options: [
    {
      type: String,
    },
  ],
})

export default model<IBallotSchemaDocument>("Ballot", BallotSchema)
