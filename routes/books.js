const express = require('express');
const router = express.Router();
const models = require('../models');
const { Book } = models;

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

router.get('/new',(req, res) => {
  res.send('<h1>new book form display</h1>');
});

router.post('/new',routeHandler( async (req, res) => {
  console.log('creating new book...',req.body);
  const newBook = await Book.create(req.body);
  res.json(newBook);
}));

router.get('/:id',routeHandler( async (req, res) =>{
  const id = req.params.id;
  console.log(`retrieving book with id: ${id}`)
  const oldbook = await Book.findByPk(req.params.id);
  //todo: maybe change this to internal server error?
  if (!book){
    res.redirect(`/page-not-found/${id}`);
  }
  res.json(book);
}));
/**
 * update book with id = req.params.id
 */
router.post('/:id',routeHandler( async (req, res) =>{
  const id = req.params.id;
  const oldbook = await Book.findByPk(id);
  const newbook = await oldbook.update(req.body);
  res.json(newbook);
  // res.redirect(`/books/${id}`);
}));

router.post('/:id/delete',routeHandler( async (req,res)=>{
  const id = req.params.id;
  console.log(`deleting record with id ${id}...`)
  const oldbook = await Book.findByPk(id);
  const deleted = await oldbook.destroy();
  res.json(deleted); 
}));
module.exports = router;
