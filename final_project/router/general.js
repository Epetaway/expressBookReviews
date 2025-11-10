const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user. Username and password required."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Send JSON response with formatted books data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Retrieve ISBN from request parameters
  const isbn = req.params.isbn;
  //Send JSON response with book details for provided ISBN
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Retrieve author name from request parameters
  const author = req.params.author;
  //Get all keys for books object
  const keys = Object.keys(books);
  //Filter books by matching author
  const matchingBooks = {};
  keys.forEach(key => {
    if(books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  });
  //Send JSON response with books by the requested author
  res.send(JSON.stringify(matchingBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Retrieve title from request parameters
  const title = req.params.title;
  //Get all keys for books object
  const keys = Object.keys(books);
  //Filter books by matching title
  const matchingBooks = {};
  keys.forEach(key => {
    if(books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  });
  //Send JSON response with books matching the requested title
  res.send(JSON.stringify(matchingBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Retrieve ISBN from request parameters
  const isbn = req.params.isbn;
  //Check if book exists, then send JSON response with reviews for the book with provided ISBN
  if(books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get all books using async callback function
public_users.get('/async', async function (req, res) {
  try {
    // Simulate async operation to get all books
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000); // 1 second delay to simulate async operation
      });
    };
    
    const bookList = await getAllBooks();
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/async/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Function that returns a Promise for getting book by ISBN
  const getBookByISBN = (bookId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[bookId]) {
          resolve(books[bookId]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 500); // 0.5 second delay to simulate async operation
    });
  };

  // Using Promise callbacks (.then() and .catch())
  getBookByISBN(isbn)
    .then(book => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      res.status(404).json({message: error.message});
    });
});

module.exports.general = public_users;

module.exports.general = public_users;
