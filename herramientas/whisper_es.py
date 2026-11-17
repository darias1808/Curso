# Transcribe un audio en español con faster-whisper (local, gratis) y escribe transcript.json
# con el mismo formato de HyperFrames: [{"text", "start", "end"}, ...].
# Uso: python whisper_es.py <audio.wav> <salida.json> [modelo]
import json, sys
from faster_whisper import WhisperModel

audio, salida = sys.argv[1], sys.argv[2]
modelo = sys.argv[3] if len(sys.argv) > 3 else "medium"
import wave
import numpy as np

# Se lee el WAV (16 kHz, mono, 16 bits) con numpy para no depender de la versión de PyAV
with wave.open(audio, "rb") as w:
    if w.getframerate() != 16000 or w.getnchannels() != 1 or w.getsampwidth() != 2:
        sys.exit("El audio debe ser WAV de 16 kHz, mono y 16 bits")
    datos = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
m = WhisperModel(modelo, device="cpu", compute_type="int8")
segmentos, _ = m.transcribe(datos, language="es", word_timestamps=True, vad_filter=True)
palabras = []
for s in segmentos:
    for w in s.words or []:
        t = w.word.strip()
        if t:
            palabras.append({"text": t, "start": round(w.start, 3), "end": round(w.end, 3)})
json.dump(palabras, open(salida, "w", encoding="utf-8"), ensure_ascii=False)
print(len(palabras), "palabras")
