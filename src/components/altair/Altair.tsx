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
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

const declaration: FunctionDeclaration = {
  name: "log_message",
  description: "Logs a message.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      message: {
        type: SchemaType.STRING,
        description: "The message to log.",
      },
    },
    required: ["message"],
  },
};

function AltairComponent() {
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
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
        { functionDeclarations: [declaration] },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);

      const logMessageFunctionCall = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name,
      );

      if (logMessageFunctionCall) {
        const message = (logMessageFunctionCall.args as { message: string }).message;
        console.log("Message logged to console: ", message);
        
        // send data for the response of your tool call
          setTimeout(
            () =>
              client.sendToolResponse({
                functionResponses: toolCall.functionCalls.map((fc) => ({
                  //sending the message back to the model for it to continue it's chain.
                  response: { output: { message: `Logged message: ${message}` } },
                  id: fc.id,
                })),
              }),
            200,
          );
      }
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  return <div />;
}

export const Altair = memo(AltairComponent);