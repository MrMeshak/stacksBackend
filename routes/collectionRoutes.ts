import express, {Request,Response} from 'express'
import * as collectionController from '../controllers/collectionController'

const router = express.Router()


router.get('/collections/', (req: Request, res: Response )=> {
    res.status(200).json({mssg: "get all collections"})
})

//GET a single collection
router.get('/collections/:collectionId', collectionController.getCollection)

//POST a single collection
router.post('/collections/', collectionController.addCollection)

//POST add a single library to a collection
router.post('/collections/:collectionId/libraries', collectionController.addLibraryToCollection)

//DELETE a single collection and the corosponding libraries
router.delete('/collections/:collectionId', collectionController.deleteCollection)

//Patch update a library name in a collection
router.patch('/collections/:collectionId/libraries/:libraryId', collectionController.updateLibraryDetails)

//Patch delete a library in a collection
router.delete('/collections/:collectionId/libraries/:libraryId', collectionController.deleteLibraryInCollection)

export default router

