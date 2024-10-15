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
	const prompt = `Describe this scene as if narrating to someone who can't see it. Be detailed but natural, avoiding any mention of an image. Use only elements present in the scene. Keep your description concise, under 100 words, while capturing the essence of what's visible.`;

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
	4. Generate text should be short and precise under 100 words unless previously specified.
	5. Don't say like here is the generated text
	` ]);
	const response = await result.response;
	const text = response.text();
	console.log(`Generated: ${text}`)
	return text;
}

export default imageToText;