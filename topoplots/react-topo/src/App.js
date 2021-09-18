import logo from './logo.svg';
import './App.css';
import { Montage } from './components/montage';

function App() {
  return (
    <div className="App">
      <Montage gridSize={20}/>
    </div>
  );
}

export default App;
