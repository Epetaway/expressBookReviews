const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios'); // Added for Tasks 10–13 (Promises / Async-Await)
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Optional: if isValid is implemented elsewhere, you could call it here
  // if (typeof isValid === 'function' && !isValid(username)) {
  //   return res.status(400).json({ message: "Invalid username" });
  // }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Send JSON response with formatted books data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const result = Object.keys(books)
    .map(k => ({ isbn: k, ...books[k] }))
    .filter(b => (b.author || '').toLowerCase() === (author || '').toLowerCase());

  if (result.length === 0) {
    return res.status(404).json({ message: "No books found for the given author" });
  }
  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const result = Object.keys(books)
    .map(k => ({ isbn: k, ...books[k] }))
    .filter(b => (b.title || '').toLowerCase() === (title || '').toLowerCase());

  if (result.length === 0) {
    return res.status(404).json({ message: "No books found for the given title" });
  }
  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  // reviews is an object keyed by username, as per project convention
  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;

// =============================
// Tasks 10–13: Axios + Async/Await / Promises examples
// These routes demonstrate using Axios to fetch existing endpoints of this API.
// Screenshot these sections for peer review submissions task10.png - task13.png
// =============================

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
  try {
    // Build base URL dynamically (assumes same host)
    const base = req.protocol + '://' + req.get('host');
    const response = await axios.get(base + '/');
    return res.status(200).json({ source: 'async-await', data: response.data });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
});

// Task 11: Get book by ISBN using Promises (then/catch)
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const base = req.protocol + '://' + req.get('host');
  axios.get(`${base}/isbn/${isbn}`)
    .then(response => res.status(200).json({ source: 'promise', data: response.data }))
    .catch(err => {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(500).json({ message: 'Failed to fetch book', error: err.message });
    });
});

// Task 12: Get books by author using Promises
public_users.get('/promise/author/:author', (req, res) => {
  const { author } = req.params;
  const base = req.protocol + '://' + req.get('host');
  axios.get(`${base}/author/${encodeURIComponent(author)}`)
    .then(response => res.status(200).json({ source: 'promise', data: response.data }))
    .catch(err => {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({ message: 'No books found for the given author' });
      }
      return res.status(500).json({ message: 'Failed to fetch books by author', error: err.message });
    });
});

// Task 13: Get books by title using async/await
public_users.get('/async/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const base = req.protocol + '://' + req.get('host');
    const response = await axios.get(`${base}/title/${encodeURIComponent(title)}`);
    return res.status(200).json({ source: 'async-await', data: response.data });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'No books found for the given title' });
    }
    return res.status(500).json({ message: 'Failed to fetch books by title', error: err.message });
  }
});

