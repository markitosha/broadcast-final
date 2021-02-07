// @ts-ignore
const { performance, PerformanceObserver } = require('perf_hooks');
const io = require('./node_modules/socket.io-client').io;
const readline = require('readline');
// const config = require('./config.ts').default;
const config: any = {};

type ConnectionData = {
    ws?: any;
    connected: boolean;
    active: boolean;
    record: boolean;
    error: boolean;
    recIds: string[];
};

const docs = `
Утилита для нагрузочного тестирования.

--help      Вывод документации

-h          Хост для подключения (default test).
            По умолчанию добавится 'ws://' в начале.
            Для подключения по wss используйте полное имя подключения (wss://host)
-c   {data} Количество подключений сокетов (default 10)
-p   {data} id голосования
`;

const getArgValue = (flag: any, defaultValue: any) => {
    if (config[flag]) {
        return config[flag];
    }

    const index = args.findIndex(value => value === `-${flag}`);
    return index === -1 ? defaultValue : args[index + 1];
};

// парсинг аргументов
const args = process.argv;

const DEBUG = false;

// help
const helpIndex = args.findIndex(value => value === '--help');

if (helpIndex !== -1) {
    console.log(docs);
    process.exit(0);
}

// host
const orig = getArgValue('h', 'wss://broadcast.rakhmatull.in:8443');
const HOST = orig.startsWith('ws') ? orig : 'ws://' + orig;

// count
const COUNT = Number.parseInt(getArgValue('c', 10));

// poll
const POLL = Number.parseInt(getArgValue('p', 32));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const webSockets: ConnectionData[] = [];

const timers = {
    max: 0,
    min: 0,
    all: 0,
    count: 0,
    average: 0,
};

const obs = new PerformanceObserver((list, observer) => {
    DEBUG && console.log(list.getEntries());

    for (let i = 0; i < list.getEntries().length; ++i) {
        const item = list.getEntries()[i];

        if (item.duration > timers.max) {
            timers.max = item.duration;
        }

        if (item.duration < timers.min || timers.min === 0) {
            timers.min = item.duration;
        }

        timers.all += item.duration;
        timers.count += 1;

        timers.average = timers.all / timers.count;
    }
});
obs.observe({ entryTypes: ['measure'], buffered: true });

const openSocket = () => {
    const index = webSockets.push({
        connected: false,
        active: false,
        record: false,
        error: false,
        recIds: [],
    });

    setTimeout(() => {
        performance.mark(`start connect ${index}`);
        DEBUG && console.log(`\nstart connect ${index}`);

        const token = Math.random() > 0.5 ?
            "0bb29a68bbc2d617877b1b2e2041d7f550d2491f" :
            "f5993a0aa562f736387b732a8b54914602252f97";
        const ws = io(HOST, {
            query: {
                "token": token,
                "type": Math.random() > 0.5 ? "mobile" : 'desktop',
            },
            rejectUnauthorized: false
        });

        if (!webSockets[index]) {
            webSockets[index] = {
                connected: false,
                active: false,
                record: false,
                error: false,
                recIds: [],
            };
        }

        webSockets[index].ws = ws;

        ws.on('connect', () => {
            DEBUG && console.log('\nopen');
            webSockets[index].active = true;
            webSockets[index].connected = true;
            webSockets[index].error = false;

            setTimeout(() => {
                if (webSockets[index].active) {
                    webSockets[index].ws.disconnect();
                }
            }, (Math.random() * 100 + 10) * 1000);
        });
        ws.on('disconnect', () => {
            DEBUG && console.log('\nclose');
            webSockets[index].active = false;
        });
        ws.on('close', () => {
            DEBUG && console.log('\nclose');
            webSockets[index].active = false;
        });
        ws.on('connect_error', (err: any) => {
            if (err.description === 503) {
                // console.log('\n503');
                webSockets[index].error = true;
                webSockets[index].active = false;
                return;
            }

            // console.log('\nerror', err);
            webSockets[index].active = false;
            webSockets[index].error = true;
        });
        ws.on('message', (msg: any) => {
            DEBUG && console.log('\nmessage', msg);
            if (msg.type === 'connection') {
                performance.measure(`devices ${index}`, `start connect ${index}`);

                setTimeout(() => {
                    if (ws.connected) {
                        ws.emit('message', {type: 'vote', payload: { answer: 1, id: POLL }});
                        performance.mark(`send message ${index}`)
                        DEBUG && console.log('send');
                    }
                }, (Math.random() * 100 + 10) * 100);
            }

            if (msg.type === 'poll_answered') {
                performance.measure(`answered ${index}`, `send message ${index}`);
                DEBUG && console.log('receive');
            }
        });
        ws.on(token, (msg: any) => {
            DEBUG && console.log('\nmessage token', msg);
            if (msg.type === 'connection') {
                performance.measure(`devices ${index}`, `start connect ${index}`);

                setTimeout(() => {
                    if (ws.connected) {
                        ws.emit('message', {type: 'vote', payload: { answer: 1, id: POLL }});
                        performance.mark(`send message ${index}`)
                        DEBUG && console.log('send');
                    }
                }, (Math.random() * 100 + 10) * 100);
            }

            if (msg.type === 'poll_answered') {
                performance.measure(`answered ${index}`, `send message ${index}`);
                DEBUG && console.log('receive');
            }
        });
    }, index * 100);
};

const initConnections = () => {
    for (let i = 0; i < COUNT; ++i) {
        openSocket();
    }
};

const monitoring = () => {
    const count = webSockets.length;
    const connected = webSockets.filter(value => value.connected).length;
    const active = webSockets.filter(value => value.active).length;
    const record = webSockets.filter(value => value.record).length;
    const error = webSockets.filter(value => value.error).length;

    // rl.write(null, { ctrl: true, name: 'u' });
    rl.write(
        `[${new Date().toLocaleString()}] соединений: ${active}; ошибок: ${error}; всего: ${count}; max: ${timers.max}; min: ${timers.min}; average: ${timers.average}\n`,
    );

    if (connected !== 0 && active === 0) {
        rl.write(`\nВсе подключения завершены`);
        process.exit(0);
    }
};

(async () => {
    console.log(`Инициализируем ${COUNT} подключений`);
    setInterval(monitoring, 1000);

    initConnections();
})();
