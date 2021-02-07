// @ts-ignore
import {setQueryParams} from "hookrouter";

enum InstructionAction {
    open = 'OPEN_INSTRUCTION',
    close = 'CLOSE_INSTRUCTION'
}

const instructionReducer = (state: any, action: any) => {
    switch (action.type) {
        case InstructionAction.open:
            setQueryParams({ manual: true });
            return { opened: true };
        case InstructionAction.close:
            setQueryParams({ manual: undefined });
            return { opened: false };
        default:
            throw new Error();
    }
}

export { instructionReducer, InstructionAction };
