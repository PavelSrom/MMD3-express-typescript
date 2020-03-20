import { Req, Res, Next } from "../types"
import jwt from "jsonwebtoken"

export interface DecodedToken {
  id: string
}

export default (req: Req, res: Res, next: Next) => {
  const token = req.header("x-auth-token")
  if (!token) return res.status(400).send({ message: "Missing token" })

  try {
    const decoded = jwt.verify(token, "pavelski") as DecodedToken
    req.userID = decoded.id

    next()
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
}
