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
  const allBooks = await Book.findAll();
  console.log(`returned ${allBooks.length} books from db`);
  res.json(allBooks);
}));

router.get('/new',(req, res) => {
  res.send('<h1>new book form display</h1>');
});

router.post('/new',routeHandler( async (req, res) => {
  res.json({id:'lkjlkjadf@3',op:'Create'});
}));

router.get('/:id',routeHandler( async (req, res) =>{
  res.json({id:req.params.id,op:'Get'});
}));
/**
 * update book with id = req.params.id
 */
router.post('/:id',routeHandler( (req, res) =>{
  res.json({id:req.params.id,op:'Update'});
}));

router.post('/:id/delete',routeHandler( async (req,res)=>{
  res.json({id:req.params.id,op:'Delete'});
}));
module.exports = router;
