import { createServer } from "http";
import { StreamCamera, Codec } from 'pi-camera-connect';
import { Lame } from 'node-lame';
import recorder from 'node-record-lpcm16';
import { PassThrough } from 'stream';

const PORT = 4040;

const server = createServer(async (req, res) => {
    if (req.url === '/video') {
        // Video stream setup
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
        const recording = recorder.record({
            sampleRate: 16000,
            threshold: 0.5,
            silence: '1.0',
            audioType: 'wav',
        });

        const passThroughStream = new PassThrough();
        const lame = new Lame({
            output: 'buffer',
            bitrate: 192,
            mode: 's'
        });

        const stream = recording.stream()
            .pipe(passThroughStream)
            .pipe(lame);

        stream.on('data', (data: any) => {
            if (!res.writableEnded) {
                res.write(data);
            }
        });

        stream.on('end', () => {
            res.end();
        });

        stream.on('error', (err: any) => {
            console.error('Audio stream error:', err);
            res.writeHead(500);
            res.end();
        });

        req.on('error', (err: any) => {
            console.error('Request error:', err);
        });

        res.on('close', () => {
            recording.stop();
        });
    } else {
        res.writeHead(404);
        res.write('Not found');
        res.end();
    }
});

server.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
