import mongoose, {Schema} from "mongoose";

export interface ICollection {
    _id: mongoose.Types.ObjectId;
    libraries: mongoose.Types.ObjectId[];
}

export const collectionSchema = new Schema({
    _id: {type: mongoose.Types.ObjectId},
    libraries: [{type: mongoose.Types.ObjectId, ref: "library"}]
})

export const Collection = mongoose.model<ICollection>('collection',collectionSchema)