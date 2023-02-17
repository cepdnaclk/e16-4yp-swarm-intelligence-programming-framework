import './App.css';
import Layoutview from './Layoutview';
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Layoutview />
      </div>
    </Router>
  );
}

export default App;
