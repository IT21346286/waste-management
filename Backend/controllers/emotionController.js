import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import { promises as fs } from 'fs'; // Import the 'promises' object

let emotionModel = null;
const modelPath = path.join(__dirname, '../models/resnet50_tt_fermod_68.h5');
const emotionLabels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']; // Replace with your model's labels

const loadModel = async () => {
    try {
        emotionModel = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Emotion detection model loaded successfully.');
    } catch (error) {
        console.error('Error loading emotion detection model:', error);
    }
};

loadModel();

export const detectEmotion = async (req, res) => {
    if (!emotionModel) {
        return res.status(503).json({ error: 'Emotion detection model not loaded yet.' });
    }

    try {
        const base64Image = req.body.image;
        if (!base64Image) {
            return res.status(400).json({ error: 'No image data received.' });
        }

        const base64Data = base64Image.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Use canvas to load the image and get pixel data
        const { createCanvas, loadImage } = require('canvas');
        const img = await loadImage(buffer);
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;

        // Preprocess the image data (adjust based on your model's training)
        const numChannels = 3; // Assuming RGB
        const tensor = tf.tensor4d(pixels, [img.height, img.width, numChannels]);
        const resizedTensor = tf.image.resizeBilinear(tensor, [48, 48]); // Example: resize to 48x48
        const normalizedTensor = resizedTensor.toFloat().div(tf.scalar(255)); // Example: normalize

        // Expand dimensions to match model input (batch size 1)
        const batchedTensor = normalizedTensor.expandDims(0);

        // Perform inference
        const predictions = emotionModel.predict(batchedTensor);
        const emotionIndex = tf.argMax(predictions, 1).dataSync()[0];
        const detectedEmotion = emotionLabels[emotionIndex];

        res.json({ emotion: detectedEmotion });

    } catch (error) {
        console.error('Error detecting emotion:', error);
        res.status(500).json({ error: 'Failed to detect emotion.' });
    }
};