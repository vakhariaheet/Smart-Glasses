import { createServer } from "http";
import { StreamCamera } from 'pi-camera-connect';


const PORT = 4040;

const server = createServer(
    (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Hello, world!');
    }
);

server.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
