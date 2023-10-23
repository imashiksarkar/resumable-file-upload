import fs from "node:fs/promises"

const filePath = "./files/lesson8.mp4"

const getFileSize = async (filePath: string) =>
  fs.stat(filePath).then((stats) => stats.size)

export default getFileSize
