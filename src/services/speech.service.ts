import * as speechSdk from "microsoft-cognitiveservices-speech-sdk";
import config from '../api/build/config';
import { SpeechResult } from "../models/speech-result.model";


export class SpeechService 
{
    private static instance: SpeechService;
    private speechConfig: speechSdk.SpeechConfig;

    private constructor() {}

    public static getInstance(): SpeechService 
    {
        if (!SpeechService.instance) 
        {
            SpeechService.instance = new SpeechService();
            SpeechService.instance.speechConfig = speechSdk.SpeechConfig.fromSubscription(config.MsSpeechKey, config.MsSpeechLocation);
            SpeechService.instance.speechConfig.speechRecognitionLanguage = "nl-NL";
            SpeechService.instance.speechConfig.outputFormat = 1;
        }
        return SpeechService.instance;
    }

    public async speechToText(file: any) : Promise<SpeechResult>
    {
        let pushStream: speechSdk.PushAudioInputStream = speechSdk.AudioInputStream.createPushStream();
        pushStream.write(file.buffer.slice(0));
        pushStream.close();

        let audioConfig: speechSdk.AudioConfig = speechSdk.AudioConfig.fromStreamInput(pushStream);
        let recognizer: speechSdk.SpeechRecognizer = new speechSdk.SpeechRecognizer(this.speechConfig, audioConfig);
        
        return await new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync(result => {
                switch (result.reason) 
                {
                    case speechSdk.ResultReason.RecognizedSpeech:
                        
                        let speechResult = new SpeechResult();
                        speechResult.text = result.text;
                        speechResult.confidence = JSON.parse(result.json).NBest;

                        resolve(speechResult);

                    case speechSdk.ResultReason.NoMatch:
                        reject("Speech could not be recognized.");

                    case speechSdk.ResultReason.Canceled:
                        const cancellation = speechSdk.CancellationDetails.fromResult(result);
                
                        if (cancellation.reason === speechSdk.CancellationReason.Error) 
                        {
                            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                            console.log("CANCELED: Did you update the subscription info?");
                        }
                        console.log(`CANCELED: Reason=${cancellation.reason}`)
                        reject("Internal Server Error");
                }
            });
        });
    }



}