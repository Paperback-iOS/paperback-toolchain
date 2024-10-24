import * as os from "node:os";

/**
 * Finds the first non-internal IPv4 address of the current machine.
 * @returns {string} The IPv4 address or '0.0.0.0' if no public address is found.
 */
function getLocalIPv4Address(): string {
  let ip: string = "0.0.0.0";
  const interfaces = os.networkInterfaces();

  Object.keys(interfaces).forEach((_interface) => {
    const devs = interfaces[_interface] ?? [];

    devs.forEach((dev) => {
      if (dev.family === "IPv4" && !dev.internal) {
        ip = dev.address;
      }
    });
  });

  return ip;
}

export { getLocalIPv4Address };
