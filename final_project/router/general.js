const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    } else {
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop

let getBooks = () => {
    let retrievedBooks = new Promise((resolve, reject) => {
        resolve(books);
    })
    return retrievedBooks;
}

public_users.get('/',function (req, res) {
  getBooks().then(
    (book) => res.send(JSON.stringify(book, null, 3)),
    (error) => res.send("Coudln't retrieve books.")
  );
});

// Get the book list available in the shop using axios

public_users.get('/axios-books', async (req, res) => {
    try {
        const response = await axios.get('https://an12-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        const booksAxios= response.data;

        res.send(JSON.stringify(booksAxios, null, 3));
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books using Axios" });
    }
});

// Get book details based on ISBN

let getBooksByISBN = (isbn) => {
    let retrievedBooks = new Promise((resolve, reject) => {
        resolve(books[isbn]);
    });
    return retrievedBooks;
}

public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  getBooksByISBN(isbn).then(
    (book) => res.send(JSON.stringify(book, null , 3)),
    (error) => res.send("Coudln't retrieve books.")
  );
 });

  
// Get book details based on author

let getBooksByAuthor = (author) => {
    let book;
    let book_isbn;

    for(let isbn in books) {
        if(books[isbn].author === author) {
            book_isbn = isbn;
        }
    }
    
    let retrievedBooks = new Promise((resolve, reject) => {
        resolve(books[book_isbn]);
    });
    return retrievedBooks;
}

public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  getBooksByAuthor(author).then(
    (book) => res.send(JSON.stringify(book, null , 3)),
    (error) => res.send("Coudln't retrieve books.")
  );
});

// Get all books based on title

let getBooksByTitle = (title) => {
    let book_isbn;

    for(let isbn in books) {
        if(books[isbn].title === title) {
            book_isbn = isbn;
        }
    }
    
    let retrievedBooks = new Promise((resolve, reject) => {
        resolve(books[book_isbn]);
    });
    return retrievedBooks;
}

public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    getBooksByTitle(title).then(
        (book) => res.send(JSON.stringify(book, null , 3)),
        (error) => res.send("Coudln't retrieve books.")
      );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  res.send(JSON.stringify(book.reviews, null , 3));
});

module.exports.general = public_users;
