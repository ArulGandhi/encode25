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
import { useEffect, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function AltairComponent() {
  const { client, setConfig } = useLiveAPIContext();
  const { isAuthenticated, isLoading } = useKindeAuth();

    useEffect(() => {
    if (isAuthenticated) {
      setConfig({
        model: "models/gemini-2.0-flash-exp",
        generationConfig: {
          responseModalities: "audio",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
          },
        },
        systemInstruction: {
          parts: [
            {
              text: 'You are my salesman, cold calling to advertise my product, which is a TV. You are to be very enthusiastic and persuasive. Make notes of what user says and log them using the "log_message" function. Decide the gender of user based on voice and accordingly call them maam or sir.',
            },
          ],
        },
        tools: [
          { googleSearch: {} },
        ],
      });
    }
  }, [setConfig, isAuthenticated]);


  useEffect(() => {
    if (isAuthenticated) {
          //remove the tool call code
    }
  }, [client, isAuthenticated]);


  if (isLoading) {
    return <div>Loading...</div>;
  }
  
    return (
    <div>
      {!isAuthenticated && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          textAlign: 'center',
          zIndex: 1000
        }}>
          Please log in to access this content.
        </div>
      )}
      <div></div>
    </div>
  );
}

export const Altair = memo(AltairComponent);