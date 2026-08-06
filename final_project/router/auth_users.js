const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in. Se requiere username y password."});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({message: "Usuario ha iniciado sesión correctamente", accessToken});
  } else {
    return res.status(208).json({message: "Login inválido. Verifica usuario y contraseña"});
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization ? req.session.authorization.username : undefined;

  if (!username) {
    return res.status(403).json({message: "Usuario no autenticado"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Libro no encontrado para el ISBN proporcionado"});
  }

  if (!review) {
    return res.status(400).json({message: "El parámetro 'review' es obligatorio (query param)"});
  }

  const isNewReview = !books[isbn].reviews[username];
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: isNewReview
      ? `Reseña agregada para el libro con ISBN ${isbn}`
      : `Reseña modificada para el libro con ISBN ${isbn}`,
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization.username : undefined;

  if (!username) {
    return res.status(403).json({message: "Usuario no autenticado"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Libro no encontrado para el ISBN proporcionado"});
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: `La reseña del usuario ${username} para el libro con ISBN ${isbn} ha sido eliminada`,
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({message: "No se encontró ninguna reseña de este usuario para eliminar"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
