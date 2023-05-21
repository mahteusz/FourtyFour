import mongoose, { ConnectOptions } from 'mongoose'
import { MONGODB_URI } from '../util/secrets'

const connectToDB = async () => {
  const connectOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions

  await mongoose.connect(MONGODB_URI!, connectOptions)

  const connection = mongoose.connection
  if (connection.readyState >= 1) {
    console.log("Connected to DB!")
    return
  } else {
    console.error("Error on DB connection")
    process.exit(1)
  }
}

export default connectToDB