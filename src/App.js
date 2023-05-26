import logo from './logo.svg';
import './App.css';
import Auth from './component/Auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase-config';
import ChatHome from './component/ChatHome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './component/Chat';

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <Router>
        <Routes>
          {
            user ?
            <>
              <Route path="/" element={<ChatHome />} />
              <Route path="/rooms/:id" element={<Chat />} />
            </>
            :
            <Route path="/" element={<Auth />} />
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
