const fs = require('fs').promises;
const path = require('path');
const {Device} = require('../models/devices'); // Adjust the path as needed

// Read and parse the JSON file
async function importNetworkData() {
    try {
        // Define the path to the JSON file
        const filePath = path.join(__dirname, 'network.json');

        // Read the file
        const data = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const networkData = JSON.parse(data);

        // Ensure networkData is an array of objects
        if (!Array.isArray(networkData)) {
            throw new Error('Invalid data format in network.json');
        }

        // Map each item to a promise that inserts it into the database
        const insertPromises = networkData.map(async (item) => {
            // Prepare fields with default values if missing
            const host = item.hostname || 'N/A';
            const openPorts = item.openPorts || 'N/A';
            const os = item.osNmap || 'N/A';
            const osVersion = item.os || 'N/A'; // Adjust based on your actual data

            // Create a new Device instance
            const device = new Device(this.ip, this.mac, this.vendor || 'N/A');

            // Insert the device into the database
            try {
                const newDeviceId = await device.addDevice(host, openPorts, os, osVersion);
                console.log(`Device added with ID: ${newDeviceId}`);
            } catch (err) {
                console.error('Error adding device:', err);
            }
        });

        // Wait for all insertions to complete
        await Promise.all(insertPromises);

        console.log('Data import complete');
    } catch (err) {
        console.error('Error reading or processing network.json:', err);
    }
}

importNetworkData();
