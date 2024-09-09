document.addEventListener('DOMContentLoaded', function () {
    // Fetch all three JSON files in parallel
    Promise.all([
        fetch('ipAddr.json').then(response => response.json()),
        fetch('macAddr.json').then(response => response.json()),
        fetch('vendor.json').then(response => response.json())
    ])
    .then(([ipData, macData, vendorData]) => {
        // Create a combined array of objects
        const combinedData = ipData.map((ip, index) => {
            return {
                ip: ip || "N/A", // Handle possible null values
                mac: macData[index] || "N/A",
                vendor: vendorData[index] || "N/A"
            };
        });

        // Get the container element where the results will be displayed
        const scanResultsContainer = document.getElementById('scanResultsContainer');

        // Iterate over the combined data and create elements for each result
        combinedData.forEach(device => {
            // Create a container div for each result
            const resultGroup = document.createElement('div');
            resultGroup.className = 'result-group';
        
            // Create a pre element to hold the formatted text
            const preElement = document.createElement('pre');
            preElement.textContent = `IP: ${device.ip}\nMAC: ${device.mac}\nVendor: ${device.vendor}`;
            
            // Create a link element for more info
            const moreInfoLink = document.createElement('a');
            moreInfoLink.href = `/moreinfo?ip=${encodeURIComponent(device.ip)}&mac=${encodeURIComponent(device.mac)}&vendor=${encodeURIComponent(device.vendor)}`;
            moreInfoLink.textContent = 'More Info';
            moreInfoLink.className = 'more-info-link'; // Optional: Add a class for styling

            // Append the pre element and the link to the result group container
            resultGroup.appendChild(preElement);
            resultGroup.appendChild(moreInfoLink);

            // Append the result group to the main container
            scanResultsContainer.appendChild(resultGroup);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

function showLoginAlert() {
    const userConfirmed = confirm("You must be logged in to access this page. Would you like to log in or sign up?");
    
    if (userConfirmed) {
        // Redirect to login or signup page
        window.location.href = "/login"; // Change to "/signup" if needed
    } else {
        
        window.location.href = "/signup";
    }
};

// document.getElementById('scanButton').addEventListener('click', function () {
//     fetch('/run-scan', { method: 'POST' })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data.message);
//             alert('Scan completed successfully!');
//             // Handle the data or output from the scan here if needed
//         })
//         .catch(error => console.error('Error:', error));
// });