const nmap = require('node-nmap');
const fs = require('fs');
const path = require('path');

nmap.nmapLocation = 'nmap'; // Path to nmap if not in your PATH

async function nmapScan() {
    try {
        // Create a new Nmap scan instance with target and options
        const scanTarget = '192.168.0.0/24'; // Change to your desired target
        const scanOptions = '-sS -O'; // SYN scan and OS detection
        const nmapscan = new nmap.NmapScan(scanTarget, scanOptions);

        // Use a promise-based approach for handling scan completion
        await new Promise((resolve, reject) => {
            nmapscan.on('complete', data => {
                console.log("Scan complete");

                // Process scan results
                const results = data.map(host => {
                    const safeHost = {
                        ip: host.ip || "N/A",
                        hostname: host.hostname || "N/A",
                        mac: host.mac || "N/A",
                        osNmap: host.osNmap || "N/A",
                        osMatches: host.osMatches || [],
                        openPorts: host.openPorts || []
                    };
                    
                    // Log open ports if any
                    if (safeHost.openPorts.length > 0) {
                        safeHost.openPorts.forEach(port => {
                            console.log(`Open Port: ${port.port} (${port.service})`);
                        });
                    } else {
                        console.log("No open ports found.");
                    }
                    
                    return safeHost;
                });

                if (results.length === 0) {
                    console.log("No hosts found. Check network range, permissions, and firewall settings.");
                }

                console.log(`Total scan time: ${nmapscan.scanTime}`);
                console.log(`Number of devices: ${results.length}`);
                
                // Write results to JSON file
                const jsonData = JSON.stringify(results, null, 2);
                console.log("jsonData: ", jsonData);
                const filePath = path.join(__dirname, 'hostports.json');

                fs.writeFile(filePath, jsonData, err => {
                    if (err) {
                        console.error('Error writing to file:', err);
                    } else {
                        console.log(`File written successfully: ${filePath}`);
                    }
                });

                resolve();
            });

            nmapscan.on('error', error => {
                reject(error);
            });

            console.log("Starting Nmap scan...");
            nmapscan.startScan();
        });

    } catch (error) {
        console.error('Error running device scan:', error);
    }
}

// Call the scan function
nmapScan();

module.exports = {
    nmapScan
};
