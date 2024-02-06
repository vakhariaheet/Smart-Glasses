import { createServer } from "http";
import { StreamCamera, Codec, StillCamera } from 'pi-camera-connect';


const PORT = 4040;





const server = createServer(
    async (req, res) => {
        if (req.url === '/video') {
            const buffer = await new StillCamera({
                width: 1920,
                height: 1080,
                rotation: 180,

            }).takeImage();
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': buffer.length,
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
