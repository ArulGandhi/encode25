/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cn from "classnames";
import { memo, ReactNode, useEffect, useRef, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { AudioRecorder } from "../../lib/audio-recorder";
import "./control-tray.scss";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export type ControlTrayProps = {
  children?: ReactNode;
};

function ControlTray({
  children,
}: ControlTrayProps) {
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted] = useState(false);

  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const { client, connected, connect, disconnect } = useLiveAPIContext();
  const { isAuthenticated, login, logout } = useKindeAuth();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`,
    );
  }, [inVolume]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder && isAuthenticated) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, audioRecorder, isAuthenticated]);

  return (
    <section className="control-tray">
      <nav className={cn("actions-nav", { disabled: !connected || !isAuthenticated })}>
        {children}
      </nav>

      <div className={cn("connection-container", { connected })}>
        <div className="connection-button-container">
          {isAuthenticated ? (
            <button
              ref={connectButtonRef}
              className={cn("action-button connect-toggle", { connected })}
              onClick={connected ? disconnect : connect}
              disabled={!isAuthenticated}
            >
              <span className="material-symbols-outlined filled">
                {connected ? "mic" : "mic_off"}
              </span>
            </button>
          ) : (
            <button onClick={() => login()} className="action-button login">
              Log in
            </button>
          )}
        </div>
      </div>
       {isAuthenticated && (
        <button onClick={logout} className="action-button logout">
          Log out
        </button>
      )}
    </section>
  );
}

export default memo(ControlTray);