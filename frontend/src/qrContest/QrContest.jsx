import { Children, createContext, useState } from "react";

export const QrContext = createContext();

export const QrContextProvider = ({children})=>{
    const [qrCode , setQrCode] = useState(null);

    return (
        <QrContext.Provider value={{qrCode , setQrCode}}>
            {children}
        </QrContext.Provider>
    )
}