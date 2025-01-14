import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { Altair } from "./components/main/Main";
import ControlTray from "./components/control-tray/ControlTray";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  return (
    <KindeProvider
      clientId={process.env.REACT_APP_KINDE_CLIENT_ID as string}
      domain={process.env.REACT_APP_KINDE_DOMAIN as string}
      redirectUri={process.env.REACT_APP_KINDE_REDIRECT_URI as string}
      logoutUri={process.env.REACT_APP_KINDE_LOGOUT_URI as string}
    >
      <div className="App">
        <LiveAPIProvider url={uri} apiKey={API_KEY}>
          <div className="streaming-console main-console">
            <main className="main-container">
              <div className="main-app-area">
                <div className="content-container">
                  <Altair />
                </div>
              </div>
              <ControlTray />
            </main>
          </div>
        </LiveAPIProvider>
      </div>
    </KindeProvider>
  );
}

export default App;