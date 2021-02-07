import React from "react";

const LoginContext = React.createContext<any>({
    logged: false
});

LoginContext.displayName = 'LoginContext';

export { LoginContext };