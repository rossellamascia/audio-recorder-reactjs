import React, { Component } from "react";
import { Chunks } from "../Models/Chunks";
import { NoteAudio } from "../Models/NoteAudio";
import styles from './styles.module.css';

const audioType = "audio/*";

type showUIAudio = true;

interface PropsRecorder {
  showUIAudio: showUIAudio;
  audioURL: string;
  handleAudioStop: (data: NoteAudio) => void;
  handleReset: (data: RecorderState) => void;
  audioBase64DB?: string;
}
interface RecorderState {
  recording: boolean;
  seconds: number;
  time: any;
  medianotFound: boolean;
  audios: string[];
  audioBlob: any;
  pauseRecord: boolean;
  accessDenied: boolean;
  audioBase64DB: string;
}

class Recorder extends Component<PropsRecorder, RecorderState> {
  private timer: NodeJS.Timeout;
  private mediaRecorder: MediaRecorder;
  private chunks: Chunks[];
  audioBase64DB: string;


  constructor(props: PropsRecorder, mediaRecorder: MediaRecorder, audioBase64DB: string, timer: NodeJS.Timeout, chunks: Chunks[]) {
    super(props);
    this.mediaRecorder = mediaRecorder;
    this.audioBase64DB = audioBase64DB;
    this.chunks = chunks
    this.timer = timer;
    this.state = {
      time: {},
      seconds: 0,
      recording: false,
      medianotFound: false,
      audios: [],
      audioBlob: null,
      pauseRecord: false,
      accessDenied: false,
      audioBase64DB: this.props.audioBase64DB ?? '',
    };
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  handleAudioPause(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    clearInterval(this.timer);
    this.mediaRecorder.pause();
    this.setState({ pauseRecord: true });
  }
  handleAudioStart(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    this.startTimer();
    this.mediaRecorder.resume();
    this.setState({ pauseRecord: false });
  }

  startTimer() {
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds + 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });
  }

  secondsToTime(secs: number) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  async componentDidMount() {
    try {
      if (navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.chunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.chunks.push(e.data);
          }
        };
      } else {
        this.setState({ medianotFound: true });
        console.log("Media Decives will work only with SSL.....");
      }

    } catch (e) {
      console.error(e);
      this.setState({ accessDenied: true });

    }
  }

  startRecording(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    // wipe old data chunks

    if (this.mediaRecorder === undefined) {
      console.error("Accesso non consentito al microfono")
    } else {
      this.chunks = [];
      // start recorder with 10ms buffer
      this.mediaRecorder.start(10);
      this.startTimer();
      // say that we're recording
      this.setState({ recording: true });
    }
  }


  stopRecording(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    clearInterval(this.timer);

    this.setState({ time: {} });
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false, pauseRecord: false });
    // save the video to memory
    this.saveAudio();
  }

  handleReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

    if (this.state.recording) {
      // @ts-ignore
      this.stopRecording(e);
    }
    this.setState({
      time: {},
      seconds: 0,
      recording: false,
      medianotFound: false,
      audios: [],
      audioBlob: null,
      audioBase64DB: ""
    },
      () => {
        this.props.handleReset(this.state);
      });

  }

  saveAudio() {
    console.log(this.chunks)
    // convert saved chunks to blob
    const blob = new Blob(this.chunks as BlobPart[], { type: audioType });

    // generate audio url from blob
    const audioURL = window.URL.createObjectURL(blob);
    console.log(audioURL)
    // append audioURL to list of saved videos for rendering
    const audios = [audioURL];
    this.setState({ audios, audioBlob: blob });

    this.props.handleAudioStop({
      url: audioURL,
      blob: blob,
      chunks: this.chunks,
      duration: this.state.time
    });
  }


  render() {
    const { recording, audios, time, medianotFound, pauseRecord, audioBase64DB } = this.state;
    const { showUIAudio, audioURL } = this.props;

    return (
      <>
        <div className={styles.recorder_library_box}>
          <div className={styles.recorder_box}>
            <div className={styles.recorder_box_inner}>

              {!medianotFound ? (
                <div className={styles.record_section}>
                  <div className={styles.btn_wrapper}>
                    <button onClick={(e) => this.handleReset(e)}>
                      Cancella
                    </button>
                  </div>
                  <div className={styles.duration_section}>
                    <div className={styles.audio_section}>

                      {audioURL !== null && showUIAudio && audioBase64DB === "" && audioBase64DB !== null && (
                        <audio controls>
                          <source src={audios[0]} type="audio/ogg" />
                          <source src={audios[0]} type="audio/mpeg" />
                          <source src={audios[0]} type="audio/mp3" />
                        </audio>
                      )}
                      {audioBase64DB !== "" && audioBase64DB !== undefined && audioBase64DB !== null && (
                        <audio controls>
                          <source src={audioBase64DB} type="audio/ogg" />
                          <source src={audioBase64DB} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>

                    <div className={styles.duration}>
                      <span className={styles.mins}>
                        {time.m !== undefined
                          ? `${time.m <= 9 ? "0" + time.m : time.m}`
                          : "00"}
                      </span>
                      <span className={styles.divider}>:</span>
                      <span className={styles.secs}>
                        {time.s !== undefined
                          ? `${time.s <= 9 ? "0" + time.s : time.s}`
                          : "00"}
                      </span>
                    </div>
                    {!recording ? (
                      <div>
                        <p className={styles.help}>Press the microphone to record</p>
                      </div>
                    ) : null}
                  </div>
                  {!recording ? (
                    <button onClick={e => this.startRecording(e)}>
                      start
                    </button>

                  ) : (
                    <div className={styles.record_controller}>
                      <a
                        onClick={e => this.stopRecording(e)}
                        href=" #"
                        className={`${styles.icons} ${styles.stop}`}
                      >
                        <span className={styles.stop_icon}></span>
                      </a>
                      <a
                        onClick={
                          !pauseRecord
                            ? e => this.handleAudioPause(e)
                            : e => this.handleAudioStart(e)
                        }
                        href=" #"
                        className={`${styles.icons} ${styles.pause}`}
                      >
                        {pauseRecord ?
                          <span className={styles.play_icons}></span> :
                          <span className={styles.pause_icons}></span>}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: "#fff", marginTop: 30, fontSize: 25 }}>
                  Seems the site is Non-SSL
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Recorder;
