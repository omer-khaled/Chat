import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { Provider } from 'react-redux'
import { store } from './context/context';
import './css/main.css';

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <Routes>
              <Route exact path='/Chat/' element={<Signup />}/>
              <Route path='/Chat/login' element={<Login />}/>
              <Route path='/Chat/home' element={<Home />}/>
            </Routes>
          </div>
    </Provider>
  );
}

export default App;
