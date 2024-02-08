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
	 4.Don't use any words that are not in the image
	 5.Don't over describe the image
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

export const detectCurrency = async (image: string) => {
	const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
	console.log(`Generating...`)
	const prompt = `
	Identify the currency in the image
	1. Respond with the currency name and denomination.
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


export const generateText = async (prompt: string) => {
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
	console.log(`Generating...`)
	const result = await model.generateContent([ `
	1. Generate a text based on the prompt
	2. If there is Something like ask visio or hey visio remove it
	3. prompt: ${prompt}
	` ]);
	const response = await result.response;
	const text = response.text();
	console.log(`Generated: ${text}`)
	return text;
}

export default imageToText;