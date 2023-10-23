import express, { Request, Response } from "express"
import cors from "cors"
import fs from "node:fs/promises"
import getIpAddress from "./utils/getIpAddress"

const PORT = process.env.PORT || 5001

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.raw({ type: "*/*", limit: "50mb" }))

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json("Hello")
})

app.post("/upload", (req: Request, res: Response) => {
  try {
    // const contentType = req.headers["content-type"]
    const fileName = req.headers["x-file-name"]
    const filePath = `uploads/${fileName}`
    const fileBlob = req.body

    fs.appendFile(filePath, Buffer.from(fileBlob)).catch((error) => {
      console.log(error)
    })

    res.status(201).json({ message: "File Uploaded Successfully." })
  } catch (error) {
    console.error("Error saving image to file:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.listen(PORT, () => {
  console.clear()
  const ipAddress = getIpAddress()
  console.log(`➜  Local  :   http://localhost:${PORT}/`)
  if (ipAddress) console.log(`➜  Host   :   http://${getIpAddress()}:${PORT}/`)
})
