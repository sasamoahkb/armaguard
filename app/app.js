const express = require("express");
const session = require('express-session');
const app = express();

const { exec } = require('child_process');
const fs = require("fs");

const {User} = require("./models/users")
const {Device} = require('./models/devices'); // Adjust the path as needed

// Set view engine to pug
app.set('view engine', 'pug');
// Set directory of views
app.set('views', './app/views');

app.use(express.static("./app/static"));

app.use(session({
    secret: 'secretqwertysflyoifasdkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Trigger scan after login
// Check thhat the scan script exists
if (fs.existsSync('app/static/quickscan.js')) {
    console.log('quickscan.js exists, proceeding with the scan...');
} else {
    console.error('quickscan.js not found, skipping scan.');
}
exec('node app/static/quickscan.js', (error, stdout, stderr) => {
    if (error) {
        console.error('Error executing scan:', error);
        return res.status(500).json({ message: 'Error executing scan', error: error.message });
    }

    if (stderr) {
        console.error('stderr:', stderr);
        return res.status(500).json({ message: 'Error executing scan', error: stderr });
    }

    console.log('stdout:', stdout);
});


// if (fs.existsSync('app/static/importNetData.js')) {
//     console.log('importNetData.js exists, proceeding with the scan...');
// } else {
//     console.error('importNetData.js not found, skipping scan.');
// }
// exec('node app/static/importNetData.js', (error, stdout, stderr) => {
//     if (error) {
//         console.error('Error executing scan:', error);
//         return res.status(500).json({ message: 'Error executing scan', error: error.message });
//     }

//     if (stderr) {
//         console.error('stderr:', stderr);
//         return res.status(500).json({ message: 'Error executing scan', error: stderr });
//     }

//     console.log('stdout:', stdout);
// });



app.use(express.urlencoded({ extended: true }));

console.log("Server is starting...");



app.get('/', function (req, res) {
    res.render("index");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.get('/devices', function (req, res) {
    res.render("devices");
});

app.get('/moreinfo', (req, res) => {
    const { ip, mac, vendor } = req.query;
    // Use the query parameters to render the appropriate page
    res.render('moreinfo', { ip, mac, vendor });
});

app.post('/logout', function (req, res) {
    // Destroy the user session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal server error');
        }

        // Redirect to the home page or login page after logout
        res.redirect('/');
    });
});


app.get("/network", function(req, res) {
    res.render("network");
});

app.get("/dashboard", function(req, res) {
    res.render("dashboard");
});

app.get("/learn", function(req, res) {
    res.render("learn");
});



app.post("/signup", async function(req, res) {
    console.log("===> signupPost", req.body);
    let parameters = req.body;
    const user = new User(parameters.email, parameters.username);

    try {
        const UserId = await user.getIdFromEmail();
        console.log("userId in the signupPost", UserId);

        if (UserId) {
            // User already exists
            console.log("This user already exists");
            res.send("User already exists. Please log in.");
        } else {
            // Add the new user
            await user.addUser(parameters.password);
            console.log("User added successfully");
            res.redirect("/login");
        }
        const newuserId = await user.getIdFromEmail();
        console.log("newuserId in the signupPost", newuserId);
    } catch (err) {
        console.error("Error while logging in:", err.message);
        res.status(500).send("Internal server error");
    };
});

app.post("/login", async function(req, res) {
    console.log("==> loginPost", req.body);
    const { email, password } = req.body; // Destructure email and password from req.body

    // Check if email and password are provided and not empty
    if (!email || email.trim() === '') {
        return res.status(400).send("Valid email is required");
    }
    if (!password || password.trim() === '') {
        return res.status(400).send("Password is required");
    }
    
    console.log("Extracted email:", email);
    console.log("Extracted password:", password);

    // Create a new User instance
    const user = new User(email, null); // Pass email to User constructor
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashedpassword:", hashedPassword)
    try {
        // Attempt to get user ID by email
        const userId = await user.getIdFromEmail();
        console.log("userId in loginPOST", userId);
        if (userId.length === 0) {
            // Email does not exist handling
            console.log("Email does not exist:", email);  
        } 
        // Set the user ID in the user instance
        user.id = userId;
            
        // Attempt to authenticate the user
        console.log("Attempt to authenticate the user")
        const match = await user.authenticate(password);
        
        console.log("Password match result:", match); // Debugging output

        if (match) {
            console.log("Login match successful...");
            console.log("Creating session ID...");

            // Set session properties
            req.session.uid = userId;
            req.session.loggedIn = true;
            console.log("Session ID created successfully!", req.session.id);
            

            // Redirect to dashboard upon successful login
            res.redirect("/dashboard");
        
        
        } else {
            // Incorrect password handling
            console.log("Incorrect password for user:", email);
            res.status(401).send("Incorrect password");
        }
    } catch (err) {
        console.error("Error while logging in:", err.message);
        // if (err.message.includes("No email provided")) {
        //     res.status(400).send("Email is required");
        // } else if (err.message.includes("password is not defined")) {
        //     res.status(404).send("password is not defined");
        // } else {
        //     res.status(500).send("Internal server error");
        // }
        throw err;
    }
    
});

app.post('/add-device', async (req, res) => {
    const { host, IPaddr, macAddr, openPorts, os, osVersion, vendor, userID } = req.body;

    if (!IPaddr || !macAddr || !userID) {
        return res.status(400).send('Required fields missing');
    }

    try {
        const device = new Device(null, host, IPaddr, macAddr, openPorts, os, osVersion, vendor, userID);
        const newDeviceId = await device.addDevice();
        res.status(201).send(`Device added with ID: ${newDeviceId}`);
    } catch (err) {
        console.error("Error adding device:", err);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3000,function() {
    console.log(`Server running at http://localhost:3000/`);
});
