const express = require('express');
const router = express.Router();
const models = require('../models');
const { Book } = models;
const SQUELIZE_ERROR = 'SequelizeValidationError';
/**
 * 
 * @param {func} callback 
 * @returns an async function that handled our callback request.
 */
const routeHandler = callback =>{
  return async (req, res, next) => {
    try {
      await callback(req,res,next);
    } catch (error) {
      res.status(500)
      res.send(error);
    }
  }
}
/* GET books listing. */
router.get('/',routeHandler( async (req, res) => {
  console.log('fetching books...');
  const books = await Book.findAll();
  console.log(`returned ${books.length} books from db`);
  res.render('index', {books});
}));
/**
 * this route will render the form for creating a new book
 */
router.get('/new',(req, res) => {
  res.render('new-book', { book:{} });
});
/**
 * This method will handle the request to create a new book
 * and handles any errors for missing fields 
 */
router.post('/new',routeHandler( async (req, res) => {
  console.log('creating new book...',req.body);
  try {
    await Book.create(req.body);
    res.redirect(`/books`);    
  } catch (err) {
    const { name, errors } = err;
    if(name === SQUELIZE_ERROR){
      const book = await Book.build(req.body);
      res.render('new-book',{ book, errors });
    } else {
      throw err;
    }
  }
}));
/**
 * This method will handle retrieving books by ids and rendering a 
 * form for updating a book
 */
router.get('/:id',routeHandler( async (req, res) =>{
  const { id } = req.params;
  console.log(`retrieving book with id: ${id}`)
  const book = await Book.findByPk(id);
  //todo: maybe change this to internal server error?
  if (!book){
    res.redirect(`/page-not-found/${id}`);
  }
  res.render('update-book',{ book });
}));
/**
 * This method is responsible for updating a book and 
 * returning any errors squelize sent back about missing fields 
 * update book with id = req.params.id
 */
router.post('/:id',routeHandler( async (req, res) =>{
  const { id } = req.params;
  const oldbook = await Book.findByPk(id);
  try {
    await oldbook.update(req.body);
    res.redirect(`/books`);
  } catch (err) {
    const { name, errors } = err;
    if (name === SQUELIZE_ERROR){
      const book = await Book.build(req.body);
      book.id = id; // after building id is null, so reset to original id.
      res.render('update-book',{ book, errors });
    } else {
      throw err;
    }    
  }
  
}));
/**
 * delete a specific book by id.
 */
router.post('/:id/delete',routeHandler( async (req,res)=>{
  const { id } = req.params;
  console.log(`deleting record with id ${id}...`)
  const oldbook = await Book.findByPk(id);
  await oldbook.destroy();
  res.redirect(`/books`);
}));
module.exports = router;
