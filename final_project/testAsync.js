const {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
} = require('./router/general.js');

(async () => {
  console.log("=== Tarea 10: getAllBooks (async/await) ===");
  await getAllBooks();

  console.log("\n=== Tarea 11: getBookByISBN (Promise .then/.catch) ===");
  await getBookByISBN(1);

  console.log("\n=== Tarea 12: getBooksByAuthor (async/await) ===");
  await getBooksByAuthor("Chinua Achebe");

  console.log("\n=== Tarea 13: getBooksByTitle (async/await) ===");
  await getBooksByTitle("Fairy tales");
})();
