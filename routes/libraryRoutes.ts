import express from 'express'

import * as libraryControlers from '../controllers/libraryControllers'

const router = express.Router()

//GET all libraries
router.get('/',libraryControlers.getAllLibraries)

//GET single library
router.get('/libraries/:libraryId',libraryControlers.getLibrary)

//Post a single library
router.post('/libraries', libraryControlers.addLibrary)

//Post a single Stack
router.post('/libraries/:libraryId/stacks', libraryControlers.addStack)

//Post a single Card
router.post('/libraries/:libraryId/stacks/:stackId/cards', libraryControlers.addCard)

//Delete library
router.delete('/libraries/:libraryId', (req,res) => {
    res.status(200).json({mssg: 'delete a library'})
})

//Delete stack
router.delete('/libraries/:libraryId/stacks/:stackId', libraryControlers.deleteStack)

//Delete card
router.delete('/libraries/:libraryId/stacks/:stackId/cards/:cardId', libraryControlers.deleteCard)

//Patch libraryDetails
router.patch('/libaries/:libraryId',(req,res)=> {
    res.status(200).json({mssg: 'patch libraryDetails'})
})

//Patch stackDetails
router.patch('/libraries/:libraryId/stacks/:stackId', libraryControlers.updateStackDetails)

//Patch cardDetails
router.patch('/libraries/:libraryId/stacks/:stackId/cards/:cardId', libraryControlers.updateCardDetails)

//Patch cardCompleted
router.patch('/libraries/:libraryId/stacks/:stackId/cards/:cardId/completed', libraryControlers.updateCardCompleted)

export default router