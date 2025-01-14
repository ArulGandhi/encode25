import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { Altair } from "./components/main/Main";
import ControlTray from "./components/control-tray/ControlTray";
import { useRef, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

  const stopRing = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
  }

function App() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/assets/ring.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.loop = false;
        
      }
    }
  }, [])


  return (
    <div className="App"  >
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="streaming-console main-console">
          <main className="main-container">
            <div className="main-app-area">
              <div className="content-container">
                
                <Altair />
              </div>
            </div>
            <ControlTray audioRef={audioRef} >
            </ControlTray>
          </main>
        </div>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
export { stopRing }