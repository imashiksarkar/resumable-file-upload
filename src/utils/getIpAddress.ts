import os from "node:os"
const networkInterfaces = os.networkInterfaces()

const getIpAddress = (): null | string => {
  let ip: null | string = null
  // Iterate over the network interfaces to find the IP addresses
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const networkInterface = networkInterfaces[interfaceName]
    networkInterface?.forEach((details) => {
      if (!details.internal && details.family === "IPv4") {
        return (ip = details.address)
      }
    })
  })
  return ip
}

export default getIpAddress
