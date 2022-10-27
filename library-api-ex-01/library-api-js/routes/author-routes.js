import { Router } from 'express';
import { AuthorModel } from '../model/author-schema.js';
var router = Router();

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
          console.log(`Error while getting all authors data with Error Message ${error.message}`);
          return res.status(500).json({ status : 500, error: `${error.message }`});
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
        console.log(`Error occured while getting author using author id ${authorId}. Error message: ${error.message}`);
        return res.status(500).json({ status: 500, error: `${error.message}` });
    });
    if(author){
        return res.status(200).json(author)
    }
    return res.status(404).json({status: 404, error: `Author not found on id ${authorId}`});
});

router.post('/author', async function(req, res) {
    const authorPayload = req.body;
    const savedAuthor = await AuthorModel.create(authorPayload)
    .catch((error) => {
        console.log(`Error while creating a new author with payload ${JSON.stringify(authorPayload)}. Error Message ${error.message}`);
        return res.status(500).json({ status: 500, error: `${error.message}` });
    });
    return res.status(201).json(savedAuthor);
});

router.put('/author/:id', async function(req, res) {
    const authorId = req.params.id;
    const authorPayload = req.body;

    const isAuthorExists = await AuthorModel.exists({ _id: authorId })
    .catch((error) => {
        console.log(`Failed to update because error while getting author data for author ID ${authorId}
        with Error Message ${error.message}`);
        return res.status(500).json({ status: 500, error: `${error.message}` });
    });
    if(isAuthorExists){
        const updatedUser = await AuthorModel.findByIdAndUpdate(authorId, authorPayload, { new: true })
        .catch((error) => {
            console.log(`Failed to update Authorailed to update Author with  with Author Id ${authorId} and 
                        Payload ${JSON.stringify(authorPayload)} with Error : ${error.message}`);
            return res.status(500).json({ status: 500, error: `${error.message}` });
        })
        return res.status(200).json(updatedUser);
    }
    return res.status(404).json({ status: 404, error: `Author is not found on given ID of  ${authorId}`});
});

export { router as AuthorRoutes }
