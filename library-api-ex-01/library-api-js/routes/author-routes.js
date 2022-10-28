import { Router } from 'express';
import { AuthorModel } from '../model/author-schema.js';
import { pino } from 'pino'

var router = Router();
const logger = pino();

router.get('/authors', async function(req, res) {
    const page = Number(req.query.page);
    const take = Number(req.query.take);
    const totalAuthors = await AuthorModel.count();

    if(page && take) {
        const authors = await AuthorModel.find()
        .limit(take * 1)
        .skip((page - 1) * take)
        .exec()
        .catch((error) => {
          logger.error(`Error while getting all authors data with Error Message ${error.message}`);
          return res.status(500).json({ statusCode : 500, errorMessage: `${error.message}, error: 'Internal Server Error'`});
        });

        if(authors){
            return res.status(200).json({authors, totalPages: Math.ceil(totalAuthors / take), currentPage: page });
        }
        return res.status(200).json({authors, totalPages: 0, currentPage: page });
    }else {
        const authors = await AuthorModel.find().exec();
        if(authors){
            return res.status(200).json({authors, totalAuthors: totalAuthors });
        }
        return res.status(200).json({authors, totalAuthors: totalAuthors });
    }
  
});

router.get('/author/:id', async function(req, res) {
    const authorId = req.params.id;
    const author = await AuthorModel.findById(authorId).catch((error) => {
        logger.error(`Error occured while getting author using author id ${authorId}. Error message: ${error.message}`);
        return res.status(500).json({ statusCode: 500, errorMessage: `${error.message}`, error: 'Internal Server Error' });
    });
    if(author){
        return res.status(200).json(author)
    }
    return res.status(404).json({statusCode: 404, errorMessage: `Author not found on id ${authorId}`, error: 'Resource Not Found'});
});

router.post('/author', async function(req, res) {
    const authorPayload = req.body;
    const savedAuthor = await AuthorModel.create(authorPayload)
    .catch((error) => {
        logger.error(`Error while creating a new author with payload ${JSON.stringify(authorPayload)}. Error Message ${error.message}`);
        return res.status(500).json({ statusCode: 500, errorMessage: `${error.message}`, error: 'Internal Server Error' });
    });
    return res.status(201).json(savedAuthor);
});

router.put('/author/:id', async function(req, res) {
    const authorId = req.params.id;
    const authorPayload = req.body;

    const isAuthorExists = await AuthorModel.exists({ _id: authorId })
    .catch((error) => {
        logger.error(`Failed to update because error while getting author data for author ID ${authorId}
        with Error Message ${error.message}`);
        return res.status(500).json({ statusCode: 500, errorMessage: `${error.message}`, error: 'Internal Server Error' });
    });
    if(isAuthorExists){
        const updatedUser = await AuthorModel.findByIdAndUpdate(authorId, authorPayload, { new: true })
        .catch((error) => {
            logger.error(`Failed to update Authorailed to update Author with  with Author Id ${authorId} and 
                        Payload ${JSON.stringify(authorPayload)} with Error : ${error.message}`);
            return res.status(500).json({ statusCode: 500, errorMessage: `${error.message}`, error: 'Internal Server Error' });
        })
        return res.status(200).json(updatedUser);
    }
    return res.status(404).json({ statusCode: 404, errorMessage: `Author is not found on given ID of  ${authorId}`, error: 'Resource Not Found'});
});

export { router as AuthorRoutes }
