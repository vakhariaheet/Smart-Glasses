import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const fileToGenerativePart = (path: string, mimeType: string) => {
	const data = Buffer.from(fs.readFileSync(path)).toString('base64');
	console.log(`Size of ${path}: ${data.length} bytes (i.e. ${data.length / 1024 / 1024} MB)`);
	return {
		inlineData: {
			data,
			mimeType,
		},
	};
}

async function imageToText(image: string) {
	// For text-and-image input (multimodal), use the gemini-pro-vision model
	const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
	console.log(`Generating...`)
	const prompt = `Describe this image in detail, Keep in mind a few points 
     1.generate like a person is narrating to a blind person
     2.It needs to be extremely detailed
     3.The person shouldn't know you are narrating from an image
     4.Keep it as realistic as possible
	 5.Don't use any words that are not in the image
	 6.It should be in hindi which gtts can convert to speech
	 `;

	const imageParts = [
		fileToGenerativePart(image, 'image/jpeg'),
	];

	const result = await model.generateContent([ prompt, ...imageParts ]);
	const response = await result.response;
	const text = response.text();
	console.log(`Generated: ${text}`)
	return text;
}

export default imageToText;