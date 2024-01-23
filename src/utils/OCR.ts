import Tesseract from 'node-tesseract-ocr';

const config = {
    lang: 'eng',
    oem: 1,
    psm: 3,
};

const imageToText = async (path: string) => {
    const text = await Tesseract.recognize(path, config);
    return text;
}
export default imageToText;