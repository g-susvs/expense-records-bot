import { Telegraf, Context, session } from 'telegraf';
import { dbConnect } from './db/db-connect';
import { environment } from './environment';
import { MyContext } from './config/context.interface';
import { extractDataFromText, validateExpenseRecordFields } from './helpers';
import expenseRecordSchema from './db/expense-record.schema';

dbConnect(process.env.MONGODB_URI as string);

const bot = new Telegraf<MyContext>(environment.bot_token);

bot.use(session()); 

bot.start((ctx) => {
  ctx.reply('Welcome');
});

bot.command('user', async (ctx) => {
  console.log(ctx.from);
  ctx.reply(ctx.state.userData ?? 'info user');
})

bot.command('new', async (ctx) => {
  ctx.session = {
    registrationStep: 'INIT',
    expenseRecord: {
      products: [],
      category_name: '',
      createdDatetime: new Date(),
      store: '',
      payment_method: '',
      total: 0,
    },
  }
  ctx.reply(
    'Registremos un nuevos gastos. guiate del siguiente ejemplo'
  );
  ctx.replyWithMarkdownV2(`
\\- Producto1,10 \\| Producto2,20 \\| Producto3,30
\\- cocina
\\- efectivo
\\- supermercado
\\- 60
`);
});

bot.command('example', (ctx: Context) => {
  ctx.replyWithMarkdownV2(`
\\- Producto1,10 \\| Producto2,20 \\| Producto3,30
\\- cocina
\\- efectivo
\\- supermercado
\\- 60
`);
})

bot.command('save', async (ctx) => {
  if(
    ctx.session?.registrationStep === 'PENDING' &&
    validateExpenseRecordFields(ctx.session?.expenseRecord)
  ){
    if(ctx.session?.expenseRecord){
      const expenseRecord = new expenseRecordSchema(ctx.session?.expenseRecord);
      await expenseRecord.save();
    }
  }else{
    ctx.session = {
      registrationStep: undefined,
      expenseRecord: {
        products: [],
        category_name: '',
        createdDatetime: new Date(),
        store: '',
        payment_method: '',
        total: 0,
      },
    }
  }
  ctx.reply('Datos registrados correctamente');
  return ctx.reply('se guardarán los datos');
})
  
bot.on('text', async (ctx) => {
  if(ctx.session?.registrationStep === 'INIT'){
    ctx.session.registrationStep = 'PENDING';
   const expenseRecord = extractDataFromText(ctx.message.text);
    ctx.session.expenseRecord = expenseRecord;

    ctx.reply('Datos registrados correctamente');
    return ctx.reply('Esta es tu información: \n' + JSON.stringify(expenseRecord));
    
  }else if(
    ctx.session?.registrationStep === 'PENDING' &&
    !validateExpenseRecordFields(ctx.session?.expenseRecord)
  ){
    return ctx.reply('Tiendes datos pendientes para completar el registro');
  } 
  else{
    return ctx.reply('Inicia un nuevo registro');
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
