import mongoose from "mongoose"

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })

    // eslint-disable-next-line no-console
    console.log("MongoDB Connected...")
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message)
    // Exit processs with failure
    process.exit(1)
  }
}

export default connectDB
