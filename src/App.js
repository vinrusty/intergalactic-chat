import logo from './logo.svg';
import './App.css';
import Auth from './component/Auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase-config';
import ChatHome from './component/ChatHome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './component/Chat';
import Header from './component/Header';

function App() {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <Router>
          {
            user ?
            <>
              <Header />
              <Routes>
              <Route path="/" element={<ChatHome />} />
              <Route path="/rooms/:id" element={<Chat />} />
              </Routes>
            </>
            :
            <Routes>
            <Route path="/" element={<Auth />} />
            </Routes>
          }
      </Router>
    </div>
  );
}

export default App;
