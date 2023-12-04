import express, { Request, Response } from "express"
import cors from "cors"
import { Err } from "http-staror"
import dotenv from "dotenv"
import fs from "node:fs/promises"
import getIpAddress from "./utils/getIpAddress"

dotenv.config()
const PORT = process.env.PORT || 5001

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.raw({ type: "*/*", limit: process.env.FILE_CHUNK_LIMIT }))

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json("Ok")
})

interface IUploadRequest extends Request {
  headers: {
    "content-type"?: string
    "x-file-name"?: string
  }
  body: Blob
}

app.post("/upload", async (req: IUploadRequest, res: Response) => {
  try {
    // const contentType = req.headers["content-type"]
    const fileName = req.headers["x-file-name"]

    if (!fileName) {
      throw Err.setStatus("BadRequest").setMessage(
        "'x-file-name' header is required."
      )
    }

    const filePath = `uploads/${fileName}`

    // convert file blob to buffer
    const fileBuffer = Buffer.from(await req.body.arrayBuffer())

    await fs.appendFile(filePath, fileBuffer)

    res.status(201).json({ message: "File Uploaded Successfully." })
  } catch (error) {
    const err = error as Err
    res.status(err.statusCode || 500).json(error)
  }
})

app.listen(PORT, () => {
  console.clear()
  const ipAddress = getIpAddress()
  console.log(`➜  Local  :   http://localhost:${PORT}/`)
  if (ipAddress) console.log(`➜  Host   :   http://${getIpAddress()}:${PORT}/`)
})
