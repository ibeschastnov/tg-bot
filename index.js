const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6823753732:AAF2B_b1yWqTtEkbQEd3Qi6wUfWirNBeUXE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её угдать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра отгадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/7a0/e2e/7a0e2ef1-ff94-4317-a188-4bead80d1756/1.webp')
            return bot.sendMessage(chatId, 'Здарова, заебааал')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'Вас зовут ' + msg.from.first_name)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
       return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, 'Молодец, ты отгадал цифру ' + chats[chatId], againOptions)
        } else {
            return await bot.sendMessage(chatId, 'К сожалению, ты не отгадал, бот загадал  цифру ' + chats[chatId], againOptions)
        }
    })
}

start()