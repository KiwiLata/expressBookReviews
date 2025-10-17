const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


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

// Get book details based on ISBN

public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
    let bookData = await axios.get(`https://an12-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
    let book = bookData.data;
    res.send(JSON.stringify(book, null , 3));
   });

/*
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  res.send(JSON.stringify(book, null , 3));
 });
 */
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let book;

  for(let isbn in books) {
    if(books[isbn].author === author) {
        book = books[isbn];
    }
  }
  res.send(JSON.stringify(book, null , 3));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let book;
  
    for(let isbn in books) {
      if(books[isbn].title === title) {
          book = books[isbn];
      }
    }
    res.send(JSON.stringify(book, null , 3));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  res.send(JSON.stringify(book.reviews, null , 3));
});

module.exports.general = public_users;
