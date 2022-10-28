import { Router } from 'express';
import { AuthorModel } from '../model/author-schema.js';
import { BookModel } from '../model/book-schema.js'
import { pino } from 'pino'

var router = Router();
const logger = pino();

router.get('/books', async function(req, res) {
    const page = Number(req.query.page);
    const take = Number(req.query.take);
    const totalBooks = await BookModel.count();

    const books = await BookModel.find()
                    .limit(take * 1)
                    .skip((page - 1) * take)
                    .populate('author')
                    .exec()
                    .catch((error) => {
                        logger.error(`Error while getting all book data with Error Message ${error.message}`);
                        return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
                    });
    if(books){
        return res.status(200).json({books, totalPages: Math.ceil(totalBooks / take), currentPage: page });
    }
    return res.status(200).json({books, totalPages: 0, currentPage: page });
});

router.get('/book/:id', async function(req, res) {
    const bookId = req.params.id;
    const book = await BookModel.findById(bookId).populate('author').catch((error) => {
        logger.error(`Error occured while getting Book using author id ${bookId}. Error message: ${error.message}`);
        return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
    });
    if(book){
        return res.status(200).json(book)
    }
    return res.status(404).json({statusCode: 404, errorMessage: `Book not found on id ${bookId}`, error: 'Resource Not Found'});
});

router.post('/book', async function(req, res) {
    const bookPayload = req.body;
    const authorId = req.body.author;

    const isAuthorExists = await AuthorModel.exists({ _id : authorId }).catch((error) => {
        logger.error(`Unable to create new Book since failed to retrive author data for author ID ${authorId}
        with Error Message ${error.message}`);
        return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
    });

    if(isAuthorExists){
        const savedBook = await BookModel.create(bookPayload)
            .catch((error) => {
                logger.error(`Error while creating a new book with payload ${JSON.stringify(bookPayload)}. Error Message ${error.message}`);
                return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
        });
        return res.status(201).json(savedBook);
    }

    return res.status(404).json({ statusCode: 404, errorMessage: `Failed to create a new book since the selected author
                                does not exists`, error: 'Resource Not Found'});

});

router.put('/book/:id', async function(req, res) {
    const bookId = req.params.id;
    const bookPayload = req.body;

    const isBookExists = await BookModel.exists({ _id : bookId })
    .catch((error) => {
        logger.error(`Failed to update selected book on id ${bookId} failed to retrive book data
        Error Message ${error.message}`);
        return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
    });

    if(isBookExists){
        const isAuthorExists = await AuthorModel.exists({ _id : bookPayload.author })
        .catch((error) => {
            logger.error(`Failed to update selected book on id ${bookId} because fetching
            author data for the given author Id cased an error. Error Message ${error.message}`);
            return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
        });    
        if(isAuthorExists){
            const updatedBookDetail = await BookModel.findByIdAndUpdate(bookId, bookPayload, { new: true }).populate('author')
            .catch((error) => {
                logger.error(`Failed to update book details for Book ID ${bookId} with payload ${JSON.stringify(bookPayload)}
                            returned Error Message ${error.message}`);
                            return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error' `});
            });
            return res.status(200).json(updatedBookDetail);
        }
        return res.status(404).json({statusCode: 404, errorMessage: `Author not found on id ${bookPayload.author}`, error: 'Resource Not Found'});
    }
    return res.status(404).json({statusCode: 404, errorMessage: `Book not found on id ${bookId}`, error: 'Resource Not Found'});
    
});

export { router as BookRoutes }
