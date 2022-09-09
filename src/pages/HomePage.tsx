import Recorder from "../components/Recorder"
import { useRecAudio } from "../hooks/useRecAudio";
import { NoteAudio } from "../Models/NoteAudio";

const HomePage = () => {
    const { audioDetails, handleAudioStop, handleReset, saveAudioBase64 } = useRecAudio();

    return (
        <div className="h-screen bg-secondary">
            <div className="flex justify-center">
                <h1>Recorder audio</h1>
            </div>
            <Recorder
                showUIAudio={true}
                handleAudioStop={(data: NoteAudio) => handleAudioStop(data)}
                handleReset={handleReset}
                audioURL={audioDetails.url}
                audioBase64DB={saveAudioBase64 as string}
            />
        </div>
    )
}

export default HomePage;