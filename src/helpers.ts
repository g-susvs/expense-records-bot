import { IExpenseRecord } from "./config/context.interface";

export function extractDataFromText(text: string): IExpenseRecord {
  const el = text.trim().split('-') ?? [];
  const arr = el.splice(1, el.length) ?? [];

  function productFormated(info: string[]) {
    return info.map((el: string) => {
      const productValues = el.split(',');
      return {
        name: productValues[0],
        price: +productValues[1],
      };
    });
  }
  const products = productFormated(arr[0].split('|'));
  const category = arr[1];

  const pay_method = arr[2];
  const store = arr[3];
  const total = arr[4];

  return {
    products,
    category_name: category,
    createdDatetime: new Date(),
    store,
    payment_method: pay_method,
    total: parseInt(total),
  };
}

export function validateExpenseRecordFields(expenseRecord: IExpenseRecord): boolean {
  if (!expenseRecord) return false;
  let validate = true;
  const expenseRecordValues = Object.values(expenseRecord);
  for (const key in expenseRecordValues) {
    if (!expenseRecordValues[key]) {
      validate = false;
      break;
    }
  }
  return validate;
}
