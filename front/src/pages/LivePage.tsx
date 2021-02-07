import React, {useContext, useEffect, useReducer, useState} from 'react';
import {StartLivePage} from "./StartLivePage";
import Cookies from 'js-cookie';
import {LiveVotePage} from "./LiveVotePage";
import {SocketContext} from "../state/socketContext";
import {io} from "socket.io-client";
import {isMobile} from "react-device-detect";
import {initial, SocketAction, socketReducer} from "../state/socketReducer";
// @ts-ignore
import {getBasepath} from "hookrouter";
import {LoginContext} from "../state/loginContext";
import debug from 'debug';

const dbg = debug('message');

const LivePage: React.FC = () => {
    const [socket, setSocket] = useState<any>(null);
    const [state, dispatch] = useReducer(socketReducer, initial);
    const { logout } = useContext(LoginContext);

    useEffect(() => {
        const socket = io(`${process.env.REACT_APP_SOCKET}`, {
            query: {
                "token": Cookies.get('token') || '',
                "type": isMobile ? "mobile" : 'desktop',
            }
        });

        socket.on('message', (msg: any) => {
            dispatch(msg);
            dbg(msg);

            if (msg.type === SocketAction.expired) {
                // socket.disconnect();
                // logout();
            }
        });
        socket.on(Cookies.get('token') || 'message', (msg: any) => {
            dispatch(msg);
            dbg(msg);

            if (msg.type === SocketAction.expired) {
                // socket.disconnect();
                // logout();
            }
        });

        if (localStorage.getItem('url')) {
            socket.emit('message', { type: SocketAction.verify, payload: { link: localStorage.getItem('url') }})
        }

        setSocket(socket);
    }, []);

    return (
        <SocketContext.Provider value={{ ...state, socket, dispatch }}>
            {state.live || getBasepath().includes('controller') ? <LiveVotePage /> : <StartLivePage />}
        </SocketContext.Provider>
    );
}

export { LivePage };