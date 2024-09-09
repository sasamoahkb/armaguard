const db = require('../services/db');
const bcrypt = require("bcryptjs");

class User {
    constructor(email, username = null) {
        this.username = username;
        this.email = email || null; // Ensure email is not null
    }

    async getIdFromEmail() {
        
        try {
            const sql = "SELECT id FROM Users WHERE email = ?";
            console.log("Executing query:", sql, "with email:", this.email);

            const result = await db.query(sql, [this.email]);
            console.log("getIdFromEmail RESULTS ==> ", result);
            if (result.length > 0) {
                return result[0].id; // Return the id directly
            } else {
                return false; // Return false if no user is found
            }
        } catch (err) {
            console.error("Database query failed", err);
            throw err; // Rethrow the error after logging it
        }
    }
    
    async setUserPassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password in setUserPassword:", hashedPassword);
        const sql = "UPDATE Users SET password_hash = ? WHERE id = ?";
        await db.query(sql, [hashedPassword, this.id]);
        return true;
    }

    async addUser(password) {
        try {
            // Ensure that 'password' is a string
            if (typeof password !== 'string') {
                throw new Error("Password must be a string.");
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Hashed password in addUser:", hashedPassword);
    
            const sql = "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)";
            console.log("Executing query:", sql, "with email:", this.email, "with username:", this.username);
    
            const result = await db.query(sql, [this.username, this.email, hashedPassword]);
            console.log("Result from addUser", result.insertId);
    
            // Return the inserted id if needed
            return result.insertId;
        } catch (err) {
            console.error("Error adding user", err);
            throw err; // Rethrow the error after logging it
        }
    }
    
    
    async authenticate(param) {
        // if (!this.email) {
        //     throw new Error("No email provided for authentication.");
        // }
    
        // console.log("Authenticating user with email:", this.email);
        // console.log("Password provided for authentication:", param); // Debugging output
    
        try {
            const sql = "SELECT password_hash FROM Users WHERE email = ?";
            console.log("Executing query:", sql, "with email: ", this.email);
            const result = await db.query(sql, [this.email]);
            console.log(result)
            console.log("Type of param (plain text password):", typeof param);
            const { password_hash } = result[0]
            if (result.length === 0) {
                console.log("No user found with the provided email:", this.email);
                return false; // No user found
            }
    
           
            // Ensure both the param and password_hash are strings
            console.log("Type of password_hash (hashed password):", typeof password_hash);
            if (!password_hash) {
                throw new Error("Password hash is missing for the user.");
            }
    
            // Compare the provided password with the stored hash
            const match = await bcrypt.compare(param, password_hash);
    
            console.log("Password match result:", match); // Debugging output
            return match;
        } catch (err) {
            console.error("Authentication failed:", err.message);
            throw err; // Rethrow the error after logging it
        }
    }
};

module.exports = {
    User
};
