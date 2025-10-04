// synthesize_corrected.js

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

// Crea un cliente de la API
const client = new textToSpeech.TextToSpeechClient();

/**
 * Función para sintetizar voz con los parámetros deseados.
 * @param {object} customRequest El objeto de solicitud con input, voice y audioConfig.
 */
async function synthesizeSpeechCorrected(customRequest) {
    const request = customRequest;

    // Llama a la API
    const [response] = await client.synthesizeSpeech(request);

    // Guardar el archivo (LINEAR16 es audio sin comprimir)
    const writeFile = util.promisify(fs.writeFile);
    // Nota: LINEAR16 es típicamente un archivo WAV (.wav)
    const outputFile = 'output_audio_corrected.wav'; 

    // El contenido de audio debe ser escrito en binario
    await writeFile(outputFile, response.audioContent, 'binary');

    console.log(`✅ Audio guardado exitosamente en: ${outputFile}`);
}

// --- CONFIGURACIÓN DE LA SOLICITUD (Corregida) ---

// El texto en inglés de tu ejemplo
const input_text = "Movies, oh my gosh, I just just absolutely love them. They're like time machines taking you to different worlds and landscapes, and um, and I just can't get enough of it.";

// La solicitud JSON corregida para el SDK de Google Cloud
const correctedRequest = {
    audioConfig: {
        // LINEAR16 es audio sin comprimir (típicamente formato WAV)
        audioEncoding: "LINEAR16", 
        // Parámetros de ajuste de voz
        pitch: 0,
        speakingRate: 1
    },
    input: {
        text: input_text
    },
    voice: {
        // Usamos en-US porque el texto está en inglés
        languageCode: "en-US", 
        
        // Usamos una voz Neural2 de alta calidad como sustituto confiable
        // Eliminamos "Autonoe" y "modelName"
        name: "en-US-Neural2-J" 
    }
};

// --- EJECUTAR ---
synthesizeSpeechCorrected(correctedRequest).catch(error => {
    console.error('Ocurrió un error al sintetizar:', error.message);
    // El error más común aquí sería un problema de autenticación o un nombre de voz inválido.
});
