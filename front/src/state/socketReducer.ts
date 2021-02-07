enum SocketAction {
    start = 'broadcast_start',
    devices = 'connection',
    vote = 'poll_start',
    end = 'broadcast_end',
    vote_send = 'vote',
    result = 'poll_results',
    vote_end = 'poll_end',
    devices_update = 'disconnection',
    answered = 'poll_answered',
    timer_ended = 'timer_ended',
    expired = 'token_expired',
    verify = 'verify_broadcast',
}

const initial = {
    live: !!localStorage.getItem('url'),
    wait: true,
    selected: -1,
    url: localStorage.getItem('url'),
};

const len = (value: number) => {
    if (value >= 90) {
        return 3;
    }

    return value.toString().length;
}

const socketReducer = (state: any, action: any) => {
    switch (action.type) {
        case SocketAction.expired:
            return initial;
        case SocketAction.timer_ended:
            return { ...state, wait: true, vote: false };
        case SocketAction.end:
            localStorage.removeItem('url');
            return { ...state, live: false, wait: true };
        case SocketAction.start:
            localStorage.setItem('url', action.payload.link);
            return {
                ...state,
                live: true,
                url: action.payload.link,
                selected: state.selected || -1
            };
        case SocketAction.devices:
        case SocketAction.devices_update:
            const hasMobile = action.payload.devices.find((value: string) => value === 'mobile');
            const hasDesktop = action.payload.devices.find((value: string) => value === 'desktop');

            return { ...state, hasMobile, hasDesktop };
        case SocketAction.vote:
            if (state.id === action.payload.id) {
                return {
                    ...state,
                    selected: action.payload.selected || state.selected || -1,
                };
            }

            return {
                ...state,
                vote: true,
                wait: false,
                id: action.payload.id,
                timer: action.payload.timer_seconds,
                question: action.payload.question,
                firstAnswer: action.payload.first_answer,
                secondAnswer: action.payload.second_answer,
                firstPercent: 0,
                secondPercent: 0,
                firstPercentLen: 1,
                secondPercentLen: 1,
                winner: -1,
                selected: action.payload.selected || -1,
            };
        case SocketAction.result:
            if (action.payload.id !== state.id) {
                return state;
            }

            return {
                ...state,
                firstPercent: action.payload.first_answer_percent,
                secondPercent: action.payload.second_answer_percent,
                firstPercentLen: len(action.payload.first_answer_percent),
                secondPercentLen: len(action.payload.second_answer_percent)
            };
        case SocketAction.answered:
            if (action.payload.id !== state.id) {
                return state;
            }

            return {
                ...state,
                selected: action.payload.selected
            };
        case SocketAction.vote_end:
            if (action.payload.id !== state.id) {
                return state;
            }

            const firstPercent = action.payload.first_answer_percent || state.firstPercent;
            const secondPercent = action.payload.second_answer_percent || state.secondPercent;

            return {
                ...state,
                firstPercent,
                secondPercent,
                firstPercentLen: len(firstPercent),
                secondPercentLen: len(secondPercent),
                timer: 'голосование окончено',
                activeVote: false,
                winner: action.payload.winner,
            };
        default:
            return state;
    }
}

export { socketReducer, initial, SocketAction };