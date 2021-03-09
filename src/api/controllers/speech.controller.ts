import 
{
    Controller,
    Route,
    Tags,
    Post,
    Request
} from "tsoa";
import * as express from "express";
import * as multer from "multer";
import { SpeechService } from "../../services/speech.service";

@Tags("Speech To Text")
@Route("speech-to-text")
export class SpeechController extends Controller 
{

    @Post()
    public async speechToText(@Request() request: express.Request): Promise<any> 
    {
        try
        {
            await this.handleFile(request, "voiceCommand");
        }
        catch(error: any)
        {
            throw new Error(error);
        }

        return SpeechService.getInstance().speechToText((request as any).file);
    }


    private handleFile(request: express.Request, fileName: string): Promise<any> 
    {
        const multerSingle = multer().single(fileName);
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, async (error: Error) => {
                if (error) 
                {
                    reject(error);
                }
                resolve("File will be in request.file, it is a buffer");
            });
        });
    }

    
    
}