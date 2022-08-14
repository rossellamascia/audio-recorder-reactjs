import { useState } from "react";
import { EmptyRecAudio, NoteAudio } from '../Models/NoteAudio';
import { blobToBase64 } from "../utils/blobToBase64";

export function useRecAudio() {
    const [audioDetails, setAudioDetails] = useState<NoteAudio>(EmptyRecAudio())
    const [saveAudioBase64, setSaveAudioBase64] = useState<string | ArrayBuffer | null>();

    const saveAudio = async (data: NoteAudio) => {
        const base64Data = await blobToBase64(data.url);
        console.log(base64Data);

        setSaveAudioBase64(base64Data)
    };


    const handleAudioStop = (data: NoteAudio) => {
        setAudioDetails(data);
        saveAudio(data);
    }


    const handleReset = () => {
        setAudioDetails(EmptyRecAudio());
    }


    return { audioDetails, handleAudioStop, saveAudioBase64, handleReset, setAudioDetails }

}