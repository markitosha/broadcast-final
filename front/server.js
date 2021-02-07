const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors')
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/login/', (req, res) => {
    res.status(200);
    res.send({
        token: '123',
        partner: '/bcs/center'
    })
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
    socket.on('message', msg => console.log(msg));

    // setTimeout(() => {
    //     socket.emit('message', { type: 'connection', payload: { devices: ['desktop'] } });
    // }, 5000);
    setTimeout(() => {
        socket.emit('message', { type: 'poll_results', payload: {
                id: 'test1',
                question: 'Что вы выберете?',
                first_answer: 'Первый ответ',
                second_answer: 'Второй ответ подлиннее, что поделать',
                first_answer_percent: 100,
                second_answer_percent: 0,
            }});
        socket.emit('message', { type: 'broadcast_start', payload: { link: 'https://player.vimeo.com/video/507338214?color=54ae46&title=0' } });
        socket.emit('message', { type: 'poll_start', payload: {
            id: 'test1',
            question: 'Каким будет танец Мари и Щелкунчика?',
            first_answer: 'Тревожный контемп',
            second_answer: 'Изящный балет',
            timer_seconds: 30,
            selected: 1
        }});

        let percent1 = 50;
        let percent2 = 50;

        const interval = setInterval(() => {
            socket.emit('message', { type: 'poll_results', payload: {
                id: 'test1',
                question: 'Что вы выберете?',
                first_answer: 'Первый ответ',
                second_answer: 'Второй ответ подлиннее, что поделать',
                first_answer_percent: 100,
                second_answer_percent: 0,
            }});

            percent1 -= 1;
            percent2 += 1;
        }, 2000);

        setTimeout(() => {
            socket.emit('message', { type: 'poll_end', payload: {
                id: 'test1',
                winner: 2
            }});

            clearInterval(interval);

            setTimeout(() => {
                socket.emit('message', { type: 'poll_start', payload: {
                        id: 'test2',
                        question: 'Кто должен победить в сражении?',
                        first_answer: 'Мышиный Король',
                        second_answer: 'Щелкунчик',
                        timer_seconds: 30,
                    }});

                let percent1 = 50;
                let percent2 = 50;

                setTimeout(() => {
                    socket.emit('message', { type: 'poll_answered', payload: {
                            id: 'test2',
                            selected: 1
                        }});
                }, 6000);
                const interval = setInterval(() => {
                    socket.emit('message', { type: 'poll_results', payload: {
                            id: 'test2',
                            question: 'Что вы выберете?',
                            first_answer: 'Первый ответ',
                            second_answer: 'Второй ответ подлиннее, что поделать',
                            first_answer_percent: percent1,
                            second_answer_percent: percent2,
                        }});

                    percent1 += 1;
                    percent2 -= 1;
                }, 2000);

                setTimeout(() => {
                    socket.emit('message', { type: 'poll_end', payload: {
                            id: 'test2',
                            winner: 1
                        }});

                    clearInterval(interval);

                    setTimeout(() => {
                        socket.emit('message', { type: 'poll_start', payload: {
                                id: 'test3',
                                question: 'Каким будет танец снежинок?',
                                first_answer: 'Легкий и красивый балет',
                                second_answer: 'Мрачный вьюжный танец',
                                timer_seconds: 30,
                            }});

                        let percent1 = 50;
                        let percent2 = 50;

                        const interval = setInterval(() => {
                            socket.emit('message', { type: 'poll_results', payload: {
                                    id: 'test3',
                                    question: 'Каким будет танец снежинок?',
                                    first_answer: 'Легкий и красивый балет',
                                    second_answer: 'Мрачный вьюжный танец',
                                    first_answer_percent: percent1,
                                    second_answer_percent: percent2,
                                }});

                            percent1 += 1;
                            percent2 -= 1;
                        }, 2000);

                        setTimeout(() => {
                            socket.emit('message', { type: 'poll_end', payload: {
                                    id: 'test3',
                                    winner: 1
                                }});

                            clearInterval(interval);

                            setTimeout(() => {
                                socket.emit('message', { type: 'poll_start', payload: {
                                        id: 'test4',
                                        question: 'Куда мы отправимся на танец дивертисмент?',
                                        first_answer: 'На уличный батл Конфетенбурга',
                                        second_answer: 'Во дворец с классическим дивертисментом',
                                        timer_seconds: 30,
                                    }});

                                let percent1 = 50;
                                let percent2 = 50;

                                const interval = setInterval(() => {
                                    socket.emit('message', { type: 'poll_results', payload: {
                                            id: 'test4',
                                            question: 'Куда мы отправимся на танец дивертисмент?',
                                            first_answer: 'На уличный батл Конфетенбурга',
                                            second_answer: 'Во дворец с классическим дивертисментом',
                                            first_answer_percent: percent1,
                                            second_answer_percent: percent2,
                                        }});

                                    percent1 += 1;
                                    percent2 -= 1;
                                }, 2000);

                                setTimeout(() => {
                                    socket.emit('message', { type: 'poll_end', payload: {
                                            id: 'test4',
                                            winner: 1
                                        }});

                                    clearInterval(interval);

                                    setTimeout(() => {
                                        socket.emit('message', { type: 'poll_start', payload: {
                                                id: 'test5',
                                                question: 'Чем закончится наша постановка?',
                                                first_answer: 'танцем Мари и Щелкунчика',
                                                second_answer: 'большим танцем с участием всех героев',
                                                timer_seconds: 30,
                                            }});

                                        let percent1 = 50;
                                        let percent2 = 50;

                                        const interval = setInterval(() => {
                                            socket.emit('message', { type: 'poll_results', payload: {
                                                    id: 'test5',
                                                    question: 'Что вы выберете?',
                                                    first_answer: 'Первый ответ',
                                                    second_answer: 'Второй ответ подлиннее, что поделать',
                                                    first_answer_percent: percent1,
                                                    second_answer_percent: percent2,
                                                }});

                                            percent1 += 1;
                                            percent2 -= 1;
                                        }, 2000);

                                        setTimeout(() => {
                                            socket.emit('message', { type: 'poll_end', payload: {
                                                    id: 'test5',
                                                    winner: 1
                                                }});

                                            clearInterval(interval);

                                            // setTimeout(() => {
                                            //     socket.emit('message', { type: 'broadcast_end' });
                                            // }, 6000);
                                        }, 30000);
                                    }, 6000);
                                    // setTimeout(() => {
                                    //     socket.emit('message', { type: 'broadcast_end' });
                                    // }, 6000);
                                }, 30000);
                            }, 6000);
                            // setTimeout(() => {
                            //     socket.emit('message', { type: 'broadcast_end' });
                            // }, 6000);
                        }, 30000);
                    }, 6000);

                    // setTimeout(() => {
                    //     socket.emit('message', { type: 'broadcast_end' });
                    // }, 6000);
                }, 30000);
            }, 6000);
        }, 30000);
    }, 6000);
});

http.listen(5001, () => {
    console.log('listening on *:5001');
});
