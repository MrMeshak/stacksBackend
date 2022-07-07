import mongoose, {Error, mongo} from "mongoose";
import {Request, Response} from 'express';
import { Collection, ICollection } from "../models/collectionModels";
import { Library, ILibrary } from "../models/libraryModels";


//GET
/*
    params collection Id
    {
        collectionId: string;
    }
*/
export const getCollection = (req: Request, res: Response) => {
    Collection.findById(req.params.collectionId).populate({path:"libraries", select: ["libraryDetails"]})
        .then((collection) => {
            if(collection === null){
                res.status(404).json({error: "Collection could not be found"})
                return
            }
            res.status(200).json(collection)
        })
        .catch((error: Error)=> {
            res.status(400).json({error: error.message})
        })
}

//POST a single collection
/*
    {
        collection:ICollection {
            _id: "";
            libraries: []
        }
    }
*/
export const addCollection = (req: Request, res:Response) => {
    const collection:ICollection = {
        _id: new mongoose.Types.ObjectId(),
        libraries: [] 
    }
    Collection.create(collection)
    .then((collection) => {
        res.status(200).json(collection)
    })
}


//Post a single library to the collection and add it to the library database
/*
    {
        CollectionId:String
        library:Ilibrary{
            id: "",
            libraryDetails: IlibraryDetails{
                id:"",
                name: string
            }
            stacks: []
        }

    }
*/

export const addLibraryToCollection = (req:Request, res:Response) => {
    const libraryId = new mongoose.Types.ObjectId();
    const libraryDetailsId = new mongoose.Types.ObjectId();
    const library = {...req.body.library, 
        _id: libraryId, 
        libraryDetails: {...req.body.library.libraryDetails, 
            _id:libraryDetailsId }} 
    if(!Collection.exists({_id: req.body.collectionId})){
        res.status(404).json({error: "Collection could not be found"})
        return
    }
    Library.create(library)
        .then((library) => {
             Collection.findOneAndUpdate(
                {_id: req.body.collectionId},
                {$push: {libraries: library._id}},
                {new: true})
                .populate({path:"libraries", select: ["libraryDetails"]})
                .then((collection)=>{
                    res.status(200).json(collection)
                })
        })
        .catch((error:Error) => {
            res.status(400).json({error: error.message})
        })
}

//Delete collection and corresponding libraries
/*
    {
        collectionId: string;
    }
*/
export const deleteCollection = (req:Request, res:Response) => {
    Collection.findById(req.params.collectionId)
        .then((collection) => {
            if(collection === null){
                res.status(404).json({error: "Collection could not be found"})
                return
            }
            Library.deleteMany({_id: collection.libraries})
            .then(() => {
                Collection.findByIdAndDelete(req.params.collectionId)
                .then((collection)=>{
                    res.status(200).json(collection)
                })
            })
        })
        .catch((error:Error) => {
            res.status(400).json({error: error.message})
        })
}

//update Library Details
/*
    {
        collectionId: string;
        libraryId: string;
        libraryDetails: {
            _id: "",
            name: string
        }
    }
*/
export const updateLibraryDetails = (req:Request,res:Response) => {
    Library.findOneAndUpdate(
        {_id: req.body.libraryId},
        {"libraryDetails.name": req.body.libraryDetails.name})
        .then((library) => {
            if(library === null){
                res.status(404).json({error: "library could not be found"})
                return
            }
            Collection.findById(req.body.collectionId).populate({path:"libraries", select: ["libraryDetails"]})
            .then((collection) => {
                if(collection === null){
                    res.status(404).json({error: "Collection could not be found"})
                    return
                }
                res.status(200).json(collection)
            })
        })
        .catch((error: Error)=> {
            res.status(400).json({error: error.message})
        })
}

//Delete Library within Collection
/*
    {
        collectionId: string;
        libraryId: string;
    }
*/

export const deleteLibraryInCollection = (req:Request, res:Response) => {
    Library.findByIdAndDelete(req.params.libraryId)
        .then(() => {
            Collection.findOneAndUpdate(
                {_id: req.params.collectionId},
                {$pull: {libraries: req.params.libraryId}}).populate({path:"libraries", select: ["libraryDetails"]})
                .then((collection) => {
                    if(collection === null){
                        res.status(404).json({error: "Collection could not be found"})
                        return
                    }
                    res.status(200).json(collection)
                })
        })
        .catch((error: Error)=> {
            res.status(400).json({error: error.message})
        })
}