import React from "react";

const SocketContext = React.createContext<any>({
    socket: null
});

SocketContext.displayName = 'SocketContext';

export { SocketContext };