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
  res.render('new-book');
});

router.post('/new',routeHandler( async (req, res) => {
  console.log('creating new book...',req.body);
  await Book.create(req.body);
  res.redirect(`/books`);
}));

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
 * update book with id = req.params.id
 */
router.post('/:id',routeHandler( async (req, res) =>{
  const { id } = req.params;
  const oldbook = await Book.findByPk(id);
  await oldbook.update(req.body);
  res.redirect(`/books`);
}));

router.post('/:id/delete',routeHandler( async (req,res)=>{
  const { id } = req.params;
  console.log(`deleting record with id ${id}...`)
  const oldbook = await Book.findByPk(id);
  await oldbook.destroy();
  res.redirect(`/books`);
}));
module.exports = router;
