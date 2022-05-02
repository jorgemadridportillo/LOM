import './App.css';
import {Terminal} from './components/Terminal';
import {useState, useEffect} from 'react' 
import {Controller} from './Controller'

function App() {

  const [lines, setLines] = useState(Controller.getLines());

  useEffect(() => {
   const handleEsc = (event) => {
    if (event.keyCode === 13 && Controller.isReady) {
      Controller.nextLine();
      setLines(Controller.getLines());
    }
   };

   setTimeout(() => {
     Controller.promptUser();
     setLines(Controller.getLines());
     Controller.setReady();
   }, 2000);

   window.addEventListener('keydown', handleEsc);
   return () => {
     window.removeEventListener('keydown', handleEsc);
   };
  }, []);

  return (
    <div className="App">
      <Terminal lines={lines}/>
    </div>
  );
}

export default App;
