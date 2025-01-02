import { Context } from "telegraf";

export type TRegistrationStep = 'INIT' | 'PENDING' | 'FINISHED';

export interface IExpenseRecord {
    products: Array<{
        name: string;
        price: number;
    }>;
    category_name: string;
    createdDatetime: Date;
    store: string;
    payment_method: string;
    total: number;
};

export interface MyContext extends Context {
    session: {
        registrationStep?: TRegistrationStep;
        expenseRecord: IExpenseRecord;
    };
}
