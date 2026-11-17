# Prepara los medios del sitio a partir de los archivos originales.
#   - Copia los videos ya comprimidos de los módulos y la intro (vertical y horizontal).
#   - Comprime los videos institucionales a 720p para la web y saca su portada.
#   - Transcribe en local los videos sin subtítulos (HyperFrames + Parakeet, gratis) y genera sus .vtt.
#   - Escribe js/transcripciones.js con el texto de cada video.
#
# Uso: python herramientas/preparar_medios.py --videos <carpeta Videos> --descargas <carpeta con los originales>
#      [--solo-transcripciones]
import argparse, json, os, re, shutil, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VID = os.path.join(RAIZ, "media", "video")
IMG = os.path.join(RAIZ, "media", "img")
SUB = os.path.join(RAIZ, "media", "subtitulos")
TMP = os.path.join(RAIZ, "tmp")

ap = argparse.ArgumentParser()
ap.add_argument("--videos", required=True)
ap.add_argument("--descargas", required=True)
ap.add_argument("--solo-transcripciones", action="store_true")
ap.add_argument("--reusar-palabras", action="store_true", help="usa tmp/<video>-palabras.json en vez de volver a transcribir")
a = ap.parse_args()
a.videos, a.descargas = os.path.abspath(a.videos), os.path.abspath(a.descargas)

def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)

def portada(mp4, jpg, t=0.6):
    ff("-ss", str(t), "-i", mp4, "-frames:v", "1", "-vf", "scale='min(1280,iw)':-2", "-q:v", "4", jpg)

# Videos propios (ya tienen subtítulos dentro): se copian tal cual desde los paquetes SCORM
MODULOS = {
    "modulo-1-etica-social": ["m1-v1", "m1-v2"],
    "modulo-2-etica-ambiental": ["m2-v1", "m2-v2", "m2-v3"],
    "modulo-3-etica-profesional": ["m3-v1", "m3-v2"],
}
# Guion de cada video propio (texto de la narración)
GUIONES = {
    "intro": "intro-etica",
    "m1-v1": "modulo-1-video-1", "m1-v2": "modulo-1-video-2",
    "m2-v1": "modulo-2-video-1", "m2-v2": "modulo-2-video-2", "m2-v3": "modulo-2-video-3",
    "m3-v1": "modulo-3-video-1", "m3-v2": "modulo-3-video-2",
}
# Videos institucionales: se comprimen a 720p y se transcriben
EXTERNOS = {
    "institucional": ("descargas", "Video institucional Modulo 2.mp4"),
    "fiscalia": ("videos", "fiscalia-editado/fiscalia-editado.mp4"),
    "tolerancia": ("descargas", "LA TOLERANCIA ES LA BASE DE LA CONVIVENCIA.mp4"),
    "testimonio": ("descargas", "Testimonio Gabriela Romero.mp4"),
}

# Motor de transcripción por video (Parakeet por defecto). El institucional empieza con música y Parakeet
# lo confunde con inglés, así que se usa Whisper forzado a español.
# (Se usa faster-whisper con herramientas/whisper_es.py; requiere WHISPER_PYTHON con faster-whisper instalado.)
MOTOR = {"institucional": "whisper"}
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from correcciones import corregir  # noqa: E402

os.makedirs(TMP, exist_ok=True)
if not a.solo_transcripciones:
    for mod, ids in MODULOS.items():
        for i in ids:
            for o in ("vertical", "horizontal"):
                shutil.copy(os.path.join(a.videos, mod, "paquete", "video", f"{i}-{o}.mp4"), VID)
                shutil.copy(os.path.join(a.videos, mod, "paquete", "img", f"{i}-{o}.jpg"), IMG)
    for o, carpeta in (("vertical", "intro-etica"), ("horizontal", "intro-etica-horizontal")):
        dst = os.path.join(VID, f"intro-{o}.mp4")
        # El render puede estar renombrado: se toma el único .mp4 de la carpeta
        mp4s = [x for x in os.listdir(os.path.join(a.videos, carpeta)) if x.lower().endswith(".mp4")]
        if len(mp4s) != 1:
            sys.exit(f"Se esperaba un solo .mp4 en {carpeta}: {mp4s}")
        ff("-i", os.path.join(a.videos, carpeta, mp4s[0]), "-c:v", "libx264", "-preset", "slow", "-crf", "26",
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", dst)
        portada(dst, os.path.join(IMG, f"intro-{o}.jpg"))
    for nombre, (base, rel) in EXTERNOS.items():
        src = os.path.join(a.videos if base == "videos" else a.descargas, rel)
        dst = os.path.join(VID, f"{nombre}.mp4")
        print("comprimiendo", nombre, flush=True)
        ff("-i", src, "-vf", "scale=-2:720,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "27",
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-ac", "2", "-movflags", "+faststart", dst)
        portada(dst, os.path.join(IMG, f"{nombre}.jpg"), 2.0)

def vtt_tiempo(s):
    h, s = divmod(s, 3600); m, s = divmod(s, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"

def grupos(palabras, maxc=42):
    g, out = [], []
    for k, w in enumerate(palabras):
        g.append(w)
        sig = palabras[k + 1] if k + 1 < len(palabras) else None
        largo = len(" ".join(x["text"] for x in g))
        if not sig or re.search(r"[.?!]$", w["text"]) or (sig["start"] - w["end"] > 0.6) or largo + 1 + len(sig["text"]) > maxc:
            out.append(g); g = []
    return out

transcripciones = {}
for clave, carpeta in GUIONES.items():
    with open(os.path.join(a.videos, carpeta, "assets", "audio", "narracion.txt"), encoding="utf-8") as f:
        transcripciones[clave] = [p.strip() for p in f.read().split("\n\n") if p.strip()]

for nombre in EXTERNOS:
    mp4 = os.path.join(VID, f"{nombre}.mp4")
    wav = os.path.join(TMP, f"{nombre}.wav")
    guardadas = os.path.join(TMP, f"{nombre}-palabras.json")
    if a.reusar_palabras and os.path.exists(guardadas):
        shutil.copy(guardadas, os.path.join(TMP, "transcript.json"))
    else:
        ff("-i", mp4, "-ar", "16000", "-ac", "1", wav)
        print("transcribiendo", nombre, flush=True)
    if a.reusar_palabras and os.path.exists(guardadas):
        pass
    elif MOTOR.get(nombre) == "whisper":
        subprocess.run([os.environ.get("WHISPER_PYTHON", "python"), os.path.join(RAIZ, "herramientas", "whisper_es.py"), wav,
                        os.path.join(TMP, "transcript.json"), "medium"], check=True)
    else:
        subprocess.run(["npx.cmd" if os.name == "nt" else "npx", "hyperframes", "transcribe", wav, "-e", "parakeet", "-l", "es", "--json"],
                       cwd=TMP, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    d = json.load(open(os.path.join(TMP, "transcript.json"), encoding="utf-8"))
    w = d if isinstance(d, list) else d["words"]
    json.dump(w, open(os.path.join(TMP, f"{nombre}-palabras.json"), "w", encoding="utf-8"), ensure_ascii=False)
    lineas = ["WEBVTT", ""]
    for k, g in enumerate(grupos(w), 1):
        lineas += [str(k), f"{vtt_tiempo(g[0]['start'])} --> {vtt_tiempo(g[-1]['end'])}", corregir(nombre, " ".join(x["text"] for x in g)), ""]
    open(os.path.join(SUB, f"{nombre}.vtt"), "w", encoding="utf-8").write("\n".join(lineas))
    # Párrafos: se corta en pausas largas o cada ~70 palabras al final de una frase
    parr, cur = [], []
    for k, x in enumerate(w):
        cur.append(x["text"])
        sig = w[k + 1] if k + 1 < len(w) else None
        fin_frase = re.search(r"[.?!]$", x["text"])
        if not sig or (fin_frase and (len(cur) > 70 or sig["start"] - x["end"] > 1.2)):
            parr.append(" ".join(cur)); cur = []
    transcripciones[nombre] = [corregir(nombre, x) for x in parr]

with open(os.path.join(RAIZ, "js", "transcripciones.js"), "w", encoding="utf-8") as f:
    f.write("// Texto de cada video (generado por herramientas/preparar_medios.py).\n")
    f.write("// Los de videos institucionales salen de una transcripción automática: revisar nombres propios.\n")
    f.write("window.TRANSCRIPCIONES = " + json.dumps(transcripciones, ensure_ascii=False, indent=1) + ";\n")
print("listo")
