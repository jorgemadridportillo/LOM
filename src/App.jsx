import './App.css';
import {Terminal} from './components/Terminal';
import {useEffect} from 'react'; 
import {EventEmitter} from './EventEmitter.js';

function App() {

  useEffect(() => {
   const handleEsc = (event) => {
    if (event.keyCode === 13) {
      EventEmitter.dispatch('enterKey', {});
    } else if(event.keyCode === 39) {
      EventEmitter.dispatch('rightKey', {});
    } else if(event.keyCode === 37) {
      EventEmitter.dispatch('leftKey', {});
    }
   };

   window.addEventListener('keydown', handleEsc);
   return () => {
     window.removeEventListener('keydown', handleEsc);
   };
  }, []);

  return (
    <div className="App">
      <Terminal/>
    </div>
  );
}

export default App;
