import { Request } from "express"

interface CustomRequest extends Request {
  user: string
}

export default CustomRequest