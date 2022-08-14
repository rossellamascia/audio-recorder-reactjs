import './App.css';
import { NoteAudio } from './Models/NoteAudio';
import { useRecAudio } from './hooks/useRecAudio';
import Recorder from './components/Recorder';

function App() {
  const { audioDetails, handleAudioStop, handleReset, setAudioDetails, saveAudioBase64 } = useRecAudio();

  return (
    <div className='App'>
      <Recorder
        showUIAudio={true}
        handleAudioStop={(data: NoteAudio) => handleAudioStop(data)}
        handleReset={handleReset}
        audioURL={audioDetails.url}
        audioBase64DB={saveAudioBase64 as string}
      />
    </div>
  );
}

export default App;
