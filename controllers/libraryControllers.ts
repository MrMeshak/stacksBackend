import mongoose, {Error} from "mongoose";
import {Request,Response} from 'express';
import {Library} from "../models/libraryModels";
import {ILibrary, IStack, ICard} from '../models/libraryModels'

//Controlers
//Get all libraries
export const getAllLibraries = (req:Request,res:Response) => {
    Library.find({}).select("_id libraryDetails")
        .then((libraries)=>{
            if(libraries === null){
                res.status(404).json({error: "No libraries found"})
                return
            }
            res.status(200).json(libraries)
        })
        .catch((error:Error) => {
            res.status(400).json({error: error.message})
        })
}

//get a single library
/*
    {
        libraryId: string
    }
*/
export const getLibrary = (req:Request,res:Response) => {
    Library.findById(req.params.libraryId)
        .then((library) => {
            if(library === null){
                res.status(404).json({error: "Library could not be found"})
                return
            }
            res.status(200).json(library)
        })
        .catch((error: Error)=>{
            res.status(400).json({error: error.message})
        })
}

//Post a single library
/*
    {
        library:Ilibrary {
            id: "";
            libraryDetails:ILibraryDetails{
                id: ""
                name: string
            }
            stacks: []
        }
    }
*/
export const addLibrary = (req:Request, res:Response) => {
    const libraryId = new mongoose.Types.ObjectId();
    const libraryDetailsId = new mongoose.Types.ObjectId()
    const library = {...req.body.library, 
        _id: libraryId, 
        libraryDetails: {...req.body.library.libraryDetails, 
            _id:libraryDetailsId }} 

    Library.create(library)
    .then((library) => {
        res.status(200).json(library)
    })
    .catch((error:Error) => {
        res.status(400).json({error: error.message})
    })

}

//Post a single stack
/*
    {
        libraryId: string
        stack:IStack {
            _id: ""
            stackDetails: {
                name: string;
                color: string;
            }
            cards: []
        }
    }

    return object -> library:Ilibrary
*/

export const addStack = (req:Request,res:Response) => {
    const stackId = new mongoose.Types.ObjectId()
    const stackDetailsId = new mongoose.Types.ObjectId()
    const stack = {...req.body.stack, _id: stackId, stackDetails: {...req.body.stack.stackDetails, _id: stackDetailsId}}
    Library.findByIdAndUpdate(
        {_id: req.body.libraryId},
        {$push: {stacks: stack}},
        {new: true})
        .then((library) => {
            if(library === null){
                res.status(404).json({error: "Library could not be found"})
                return 
            }
            res.status(200).json(library)
        })
        .catch((error:Error) => {
            res.status(400).json({error: error.message})
        })
}

//update a single stack details
/*
    {
        libraryId: string
        stackId: string
        stackDetails: IStackDetails {
            _id: ""
            name: string
            color: string
        }
    }

    return object -> library:Ilibrary
*/

export const updateStackDetails = (req:Request,res:Response) => {
    Library.findOneAndUpdate(
        {_id: req.body.libraryId, "stacks._id": req.body.stackId},
        {$set: {"stacks.$.stackDetails.name" : req.body.stackDetails.name,
                "stacks.$.stackDetails.color": req.body.stackDetails.color}},
        {new: true})
        .then((library) => {
            if(library === null){
                res.status(404).json({error: "Library or Stack could not be found"})
                return
            }
            res.status(200).json(library)
        })
        .catch((error:Error)=>{
            res.status(400).json({error: error.message})
        })
}

//delete a single stack
/*
    {
        libraryId: string
        stackId: string
    }

    return object -> library:ILibrary
*/

export const deleteStack  = (req:Request,res:Response) => {
    Library.findByIdAndUpdate(
        {_id: req.params.libraryId},
        {$pull: {stacks: {_id: req.params.stackId}}},
        {new: true})
        .then((library)=>{
            if(library === null){
                res.status(404).json({error: "Library or Stack could not be found"})
                return
            }
            res.status(200).json(library)
        })
        .catch((error:Error)=> {
            res.status(400).json({error: error.message})
        })
}

// add a single card
/*
    {
        libraryId: string
        stackId: string
        card:ICard {
            _id: ""
            cardDetails:ICardDetails{
                _id: ""
                title: string;
                description: string;
                completed: boolean;
                color: string; 
            }
        }
    }

    return object -> library:ILibrary
*/
export const addCard  = (req:Request,res:Response) => {
    const cardId = new mongoose.Types.ObjectId()
    const cardDetailsId = new mongoose.Types.ObjectId()
    const card = {...req.body.card,
        _id: cardId, cardDetails: {...req.body.card.cardDetails, _id: cardDetailsId}}

    Library.findOneAndUpdate(
        {_id: req.body.libraryId, "stacks._id": req.body.stackId},
        {$push: {"stacks.$.cards": card}},
        {new: true})
        .then((library)=>{
            if(library === null){
                res.status(404).json({error: "Library or Stack could not be found"})
                return
            }
            res.status(200).json(library)
        })
        .catch((error:Error)=> {
            res.status(400).json({error: error.message})
        })
}

//delete a single card
/*
    {
        libraryId: string
        stackId: string
        cardId: string
    }

    return object -> library:Ilibrary
*/

export const deleteCard  = (req:Request,res:Response) => {
    Library.findOneAndUpdate(
        {_id: req.params.libraryId},
        {$pull: {"stacks.$[stack].cards": {_id: req.params.cardId}}},
        {arrayFilters: [{'stack._id': req.params.stackId}],new: true})
        .then((library)=>{
            if(library === null){
                res.status(404).json({error: "Library or Stack could not be found"})
                return
            }
            res.status(200).json(library)
        })
        .catch((error:Error)=> {
            res.status(400).json({error: error.message})
        })
}



//update as single card Details
/*
    {
        libraryId: string
        stackId: string
        cardId: string
        cardDetails: {
            id: ""
            title: string
            description: string
            completed: boolean
            color: string
        }
    }

    return object -> library:Ilibrary
*/

export const updateCardDetails = (req:Request,res:Response) => {
    Library.findOneAndUpdate(
        {_id: req.body.libraryId},
        {$set: {
            "stacks.$[stack].cards.$[card].cardDetails.title": req.body.cardDetails.title,
            "stacks.$[stack].cards.$[card].cardDetails.description": req.body.cardDetails.description,
            "stacks.$[stack].cards.$[card].cardDetails.completed": req.body.cardDetails.completed,
            "stacks.$[stack].cards.$[card].cardDetails.color": req.body.cardDetails.color,
        } },
        {arrayFilters: [{"stack._id": req.body.stackId},{"card._id": req.body.cardId}], new: true}
    )
    .then((library)=>{
        if(library === null){
            res.status(404).json({error: "Library or Stack could not be found"})
            return
        }
        res.status(200).json(library)
    })
    .catch((error:Error)=> {
        res.status(400).json({error: error.message})
    })
}

//update Completed 
/*
    {
        libraryId: string
        stackId: string
        cardId: string
        completed: boolean
    }

    return object -> library:Ilibrary
*/
export const updateCardCompleted = (req: Request, res: Response) => {
    Library.findOneAndUpdate(
        {_id: req.body.libraryId},
        {$set: {
            "stacks.$[stack].cards.$[card].cardDetails.completed": req.body.completed,
        } },
        {arrayFilters: [{"stack._id": req.body.stackId},{"card._id": req.body.cardId}], new: true}
    )
    .then((library)=>{
        if(library === null){
            res.status(404).json({error: "Library or Stack could not be found"})
            return
        }
        res.status(200).json(library)
    })
    .catch((error:Error)=> {
        res.status(400).json({error: error.message})
    })
}
