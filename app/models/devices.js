const db = require('../services/db'); // Adjust the path as needed

class Device {
    constructor(IPaddr, macAddr, vendor = null) {
        this.ip = IPaddr || null;
        this.mac = macAddr || null;
        this.vendor = vendor || 'N/A';
        
    }
    async addDevice(host, openPorts, os, osVersion) {
        try {
            const sql = `
                INSERT INTO Devices (host, IPaddr, macAddr, openPorts, os, osVersion, vendor)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                host,
                this.ip,
                this.mac,
                openPorts,
                os,
                osVersion,
                this.vendor
            ];
            const result = await db.query(sql, params);
            console.log("Device added successfully:", result);
            return result.insertId;
        } catch (err) {
            console.error("Error adding device:", err);
            throw err;
        }
    }
}

module.exports = {Device};
