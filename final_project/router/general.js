const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Se requiere username y password para registrarse"});
  }

  if (isValid(username)) {
    return res.status(404).json({message: "El nombre de usuario ya existe"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "Usuario registrado exitosamente. Ahora puedes iniciar sesión."});
});

public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({message: "No se encontró ningún libro con ese ISBN"});
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  const booksByAuthor = bookKeys
    .filter((key) => books[key].author === author)
    .reduce((acc, key) => {
      acc[key] = books[key];
      return acc;
    }, {});

  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({message: "No se encontraron libros para ese autor"});
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);

  const booksByTitle = bookKeys
    .filter((key) => books[key].title === title)
    .reduce((acc, key) => {
      acc[key] = books[key];
      return acc;
    }, {});

  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({message: "No se encontraron libros con ese título"});
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "No se encontró ningún libro con ese ISBN"});
  }

  if (Object.keys(book.reviews).length > 0) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(200).json({message: "No reviews found for this book."});
  }
});

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("Tarea 10 - Todos los libros:", response.data);
    return response.data;
  } catch (error) {
    console.error("Tarea 10 - Error al obtener los libros:", error.message);
    throw error;
  }
}

function getBookByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(`Tarea 11 - Libro con ISBN ${isbn}:`, response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(`Tarea 11 - Error al obtener el libro con ISBN ${isbn}:`, error.message);
      throw error;
    });
}

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`Tarea 12 - Libros del autor ${author}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Tarea 12 - Error al obtener libros del autor ${author}:`, error.message);
    throw error;
  }
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(`Tarea 13 - Libros con título ${title}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Tarea 13 - Error al obtener libros con título ${title}:`, error.message);
    throw error;
  }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
