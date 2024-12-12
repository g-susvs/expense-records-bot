import { randomUUID } from 'node:crypto';
import { Telegraf, Context } from 'telegraf';
import { dbConnect } from './db/db-connect';
import { environment } from './environment';
import ExpenseRecord from './db/expense-record.schema';

dbConnect(process.env.MONGODB_URI as string);

const bot = new Telegraf(environment.bot_token);
bot.start((ctx: Context) => ctx.reply('Welcome'));

bot.command('new', async (ctx: Context) => {
  const newDoc = {
    id: randomUUID(),
    products: [
      {
        name: 'Producto 1',
        price: 15,
      },
      {
        name: 'Producto 2',
        price: 15,
      },
    ],
    category_name: 'Biberes',
    createdDatetime: new Date().getTime(),
    payment_method: 'efectivo',
    store: 'tambo',
    total: 30,
  };

  const new_expense_record = new ExpenseRecord(newDoc);
  await new_expense_record.save();
  ctx.reply('Gasto registrado');
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
