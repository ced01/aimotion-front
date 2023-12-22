import { useState, useRef, useCallback } from 'react';
import { interpret } from 'robot3';

export default function UseListenerMachine( machine ){

    // Utilisation du service placé dans la propriété current de l'objet retourner par useRef  

    const { current : service } = useRef(interpret(machine, () => {
        setState(service.machine.current);
        setContext(service.context);
        //console.log(service.context);
    }));

    console.log(service.machine.current);

    const [state, setState] = useState(service.machine.current);
    const [context, setContext] = useState(service.context);

    const send = useCallback( function (type, params = {}) {
        //console.log({type:type, ...params});
        service.send({type:type, ...params})
    }, [service]);

    return { 
        state : state,
        context : context, 
        send: send, 
    };
}