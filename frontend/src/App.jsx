import React from 'react';


import QRCodeScanner from './QRCodeScanner';
import SendMessage from './SendMessage';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>WhatsApp Web Integration</h1>
                <QRCodeScanner clientId={9262827242}/>
                <SendMessage clientId={9262827242}/>
            </header>
        </div>
    );
}


export default App
