const nmap = require('node-nmap');
const fs = require("fs");
nmap.nmapLocation = 'nmap'; //default



async function quickScan() {
    let quickscan = new nmap.QuickScan(`${"192.168.0.0"}/24`, '-sS -O');
        quickscan.on('complete', function(data) {
            console.log(data);
            console.log("total scan time" + quickscan.scanTime);
            
            console.log("=====> Writing results to JSON files");
            // localStorage.setItem('networkData', JSON.stringify(data));

            const jsonData = JSON.stringify(data, null, 2);
            console.log("number of devices", data.length);
            
            fs.writeFile('app/static/network.json', jsonData, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('File written successfully: network.json');
                }
            });
            getIPAddress();
            getMacAddress();
            getVendor();
        });

        quickscan.on('error', function(error) {
            console.log(error);
        });

        console.log("Starting Nmap scan...");
        quickscan.startScan();
    
};

async function getIPAddress() { 
    // const data = localStorage.getItem('networkData');
    // if (data) {
    fs.readFile('app/static/network.json', 'utf8', (err, data) => {
        if (err) {
            console.error("File was not read properly:", err);
            return;
        }
    
        try {
            const devices = JSON.parse(data); // Directly parse JSON
            const ipAddr = devices.map(device => device.ip);
            console.log(ipAddr);
            console.log("Number of IP addresses: " + ipAddr.length);
            // localStorage.setItem('ipAddr', JSON.stringify(ipAddr));

            const ipJson = JSON.stringify(ipAddr);
            fs.writeFile('app/static/ipAddr.json', ipJson, (err) => {
                if (err) {
                    console.log("File was not written properly:", err);
                    return;
                } else {
                    console.log("IP was written successfully!");
                    // Resolve the Promise when writing is complete
                }
            });
        } catch (e) {
            console.error('JSON parsing error:', e.message);
        }
    });
};

async function getMacAddress() {
    // const data = localStorage.getItem('networkData');
    // if (data) {
    fs.readFile('app/static/network.json', 'utf8', (err, data) => {
        if (err) {
            console.error("File was not read properly:", err);
            return;
        }
        

        try {
            const devices = JSON.parse(data); // Directly parse JSON
            const macAddresses = devices.map(device => device.mac);
            console.log(macAddresses);
            console.log("Number of MAC addresses: " + macAddresses.length);
            // localStorage.setItem('macAddr', JSON.stringify(macAddresses));

            const macAddr = JSON.stringify(macAddresses);
            fs.writeFile('app/static/macAddr.json', macAddr, (err) => {
                if (err) {
                    console.log("File was not written properly:", err);
                    return;
                } else {
                    console.log("File was written successfully!");
                }
            });
        } catch (e) {
            console.error('JSON parsing error:', e.message);
        }
    });
};

async function getVendor() {
    // const data = localStorage.getItem('networkData');
    // if (data) {
    fs.readFile('app/static/network.json', 'utf8', (err, data) => {
        if (err) {
            console.error("File was not read properly:", err);
            return;
        }
    
    try {
        const devices = JSON.parse(data); // Directly parse JSON
        const vendor = devices.map(device => device.vendor);
        console.log(vendor);
        console.log("Number of vendors: " + vendor.length);
        // localStorage.setItem('vendor', JSON.stringify(vendor));

        const vendors = JSON.stringify(vendor);
        fs.writeFile('app/static/vendor.json', vendors, (err) => {
            if (err) {
                console.log("File was not written properly:", err);
                return;
            } else {
                console.log("File was written successfully!");
            }
        });
    } catch (e) {
        console.error('JSON parsing error:', e.message);
    }
    });
};




async function runScan() {
    try {
        const result = await quickScan();
        console.log("Scan finished successfully.");
        return result;
    } catch (err) {
        console.error('Error during the scan:', err);
        throw err;
    }
}

if (require.main === module) {
    runScan().then(() => {
        console.log("Scan finished.");
    }).catch(err => {
        console.error("Scan failed:", err);
    });
}

module.exports = { runScan };

