const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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

module.exports.general = public_users;
