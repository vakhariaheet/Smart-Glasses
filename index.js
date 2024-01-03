const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const player = require('play-sound')(opts = {});
const { execSync } = require('child_process');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
function fileToGenerativePart(path, mimeType) {
    const data = Buffer.from(fs.readFileSync(path)).toString('base64');
    console.log(`Size of ${path}: ${data.length} bytes (i.e. ${data.length / 1024 / 1024} MB)`);
	return {
		inlineData: {
			data,
			mimeType,
		},
	};
}
const addBackSlash = (text) => {
    return text.replace(/'/g, "'\\''");
}
const sayText = async (text) => { 
    console.log(`Converting to speech...`);
    execSync(`echo '${addBackSlash(text)}' | ~/piper/piper --model ~/piper/en_US-amy-medium.onnx --output_file welcome.wav `)
    console.log(`Playing...`);
    player.play('welcome.wav', function(err){
        if (err) throw err
    })
}
async function init() {
	// For text-and-image input (multimodal), use the gemini-pro-vision model
	const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    console.log(`Generating...`)
    const prompt = `Describe this image in detail, Keep in mind a few points 
     1.generate like a person is narrating to a blind person
     2.It needs to be extremely detailed
     3.The person shouldn't know you are narrating from an image
     4.Generate as long as possible`;

	const imageParts = [
		fileToGenerativePart('test.jpeg', 'image/jpeg'),
	];

	const result = await model.generateContent([prompt, ...imageParts]);
	const response = await result.response;
    const text = response.text();
    console.log(`Generated: ${text}`)
	sayText(text);
}

init();




