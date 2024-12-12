import { Schema, model } from 'mongoose';

export const expenseRecordSchema = new Schema({
    id: String,
    products: [
       {
        name:{
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
       }
    ],
    category_name: {
        type: String,
        required: true,
    },
    createdDatetime: {
        type: Date,
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    }
})

export default model('expense_record', expenseRecordSchema); 
