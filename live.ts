import { createServer } from "http";
import { StreamCamera, Codec } from 'pi-camera-connect';


const PORT = 4040;





const server = createServer(
    async (req, res) => {
        if (req.url === '/video') {
            const camera = new StreamCamera({
                codec: Codec.H264

            })
            const readStream = camera.createStream();
            res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Connection': 'keep-alive',
                'Transfer-Encoding': 'chunked'
            });
            readStream.pipe(res);
            await camera.startCapture();
            console.log('Camera started');
            res.on('error', async (e) => {
                console.log('Error', e);
                await camera.stopCapture();
                console.log('Camera stopped');
            });
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
