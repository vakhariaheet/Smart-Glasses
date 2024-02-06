import { createServer } from "http";
import { StreamCamera, Codec, StillCamera } from 'pi-camera-connect';
import { Lame } from 'node-lame';
import { Recorder } from 'node-record-lpcm16';


const PORT = 4040;




const server = createServer(
    async (req, res) => {
        if (req.url === '/video') {
            const camera = new StreamCamera({
                codec: Codec.MJPEG,
                width: 1920,
                height: 1080,
            });
            await camera.startCapture();
            res.writeHead(200, {
                'Content-Type': 'multipart/x-mixed-replace; boundary=frame'
            });
            camera.on('frame', (image) => {
                res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${image.length}\r\n\r\n`);
                res.write(image);
            });
            // Audio stream setup
            const recorder = new Recorder({
                sampleRate: 44100,
                channels: 2,
                bitDepth: 16,
                recordProgram: 'rec',
                silence: 0,
                thresholdStart: 0,
                thresholdEnd: 0
            });
            const lame = new Lame({
                output: 'buffer',
                bitrate: 192,
                mode: 's'
            });

            recorder.start().pipe(lame).pipe(res);
            req.on('error', (err) => {
                console.error(err);
            })
        }
        else {
            res.writeHead(404);
            res.write('Not found');


        }
    }
);

server.listen(PORT, () => {
    console.log('Listening on port', PORT);

});
