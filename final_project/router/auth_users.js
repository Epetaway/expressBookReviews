const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //Filter the users array for any user with the same username
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  //Return true if any user with the same username is found, otherwise false
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //Filter the users array for any user with the same username and password
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  //Return true if any valid user is found, otherwise false
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate the user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ 
      message: "User successfully logged in",
      token: accessToken,
      username: username
    });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;
  const username = req.session.authorization.username;
  
  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Add or modify the review for this user
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({ message: `Review for book with ISBN ${isbn} added/modified successfully` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }
  
  // Delete the user's review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({ message: `Review for book with ISBN ${isbn} deleted successfully` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
