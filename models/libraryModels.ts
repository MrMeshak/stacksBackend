import mongoose, {ObjectId, Schema}from "mongoose";

export interface ICardDetails{
    _id:mongoose.Types.ObjectId;
    title: string;
    description: string;
    completed: boolean
    color: string;
}

export interface ICard {
    _id:mongoose.Types.ObjectId;
    cardDetails: ICardDetails;
}

export interface IStackDetails{
    _id:mongoose.Types.ObjectId;
    name:string;
    color:string;
}

export interface IStack {
    _id:mongoose.Types.ObjectId;
    stackDetails: IStackDetails;
    cards: mongoose.Types.DocumentArray<ICard>;
}

export interface ILibraryDetails{
    _id: mongoose.Types.ObjectId;
    name: string;
}

export interface ILibrary{
    _id: mongoose.Types.ObjectId;
    libraryDetails: ILibraryDetails;
    stacks: mongoose.Types.DocumentArray<IStack>;
}

export const cardDetailsSchema = new Schema<ICardDetails>({
    _id: {type: Schema.Types.ObjectId, required:true},
    title:  {type: String, required: true},
    description: {type: String, required: true},
    completed: {type:Boolean, required: true},
    color: {type: String,  required: true}
})

export const cardSchema = new Schema<ICard>({
    _id: {type: Schema.Types.ObjectId, required: true},
    cardDetails: {type: cardDetailsSchema, required: true}
}, {timestamps: true})

export const stackDetailsSchema = new Schema<IStackDetails>({
    _id: {type: Schema.Types.ObjectId, required:true},
    name: {type: String, required:true},
    color: {type: String, required: true}
})

export const stackSchema = new Schema<IStack>({
    _id: {type: Schema.Types.ObjectId, required:true},
    stackDetails: {type:stackDetailsSchema, required: true},
    cards: {type: [cardSchema], required: true}
}, {timestamps: true})


export const libraryDetailsSchema = new Schema<ILibraryDetails>({
    _id: {type: Schema.Types.ObjectId, required:true},
    name: {type: String, required:true}
})

export const librarySchema = new Schema<ILibrary>({
    _id: {type: Schema.Types.ObjectId, required: true},
    libraryDetails: {type: libraryDetailsSchema, required: true},
    stacks: {type: [stackSchema], required: true}
},{timestamps: true})

export const Library = mongoose.model<ILibrary>("library",librarySchema)