# Correcciones de nombres propios y errores de las transcripciones automáticas.
# Se aplican al texto final (transcripción y subtítulos) de cada video.
# Para aplicarlas sin volver a transcribir: python herramientas/correcciones.py
import json, os, re

CORRECCIONES = {
    "fiscalia": [
        (r"Mi nombre es [^,]+, fiscal del Colegio", "Mi nombre es Krisley Ellis Moya, fiscal del Colegio"),
        (r"yo soy [^,]+ Morales, fiscal suplente", "yo soy Erik Cubillo Morales, fiscal suplente"),
        (r"\bis creado\b", "fue creado"),
        (r"\bmedial ley\b", "mediante la ley"),
    ],
    "institucional": [
        (r"Ley 45 ?-05", "Ley 4505"),
        (r"Ley 95 ?-29", "Ley 9529"),
        (r"nuestras sedes centrales San Pedro", "nuestra sede central en San Pedro"),
        (r"Tur+[úu]car[ae]s de la (Abuela|Fuela|Juela|Apuela)", "Turrúcares de Alajuela"),
        (r"Ciudad Neili", "Ciudad Neily"),
        (r"Guapiles", "Guápiles"),
        (r"¿(Esto con el objetivo[^?]*)\?", r"\1."),
        (r"\bMEC\b", "MEIC"),
        (r"Copenae", "Coopenae"),
    ],
}


def corregir(nombre, texto):
    for pat, rep in CORRECCIONES.get(nombre, []):
        texto = re.sub(pat, rep, texto)
    return texto


if __name__ == "__main__":
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ruta = os.path.join(raiz, "js", "transcripciones.js")
    js = open(ruta, encoding="utf-8").read()
    marca = "window.TRANSCRIPCIONES = "
    i = js.index(marca) + len(marca)
    T = json.loads(js[i:].rstrip().rstrip(";"))
    for n in CORRECCIONES:
        if n in T:
            T[n] = [corregir(n, x) for x in T[n]]
        vtt = os.path.join(raiz, "media", "subtitulos", f"{n}.vtt")
        if os.path.exists(vtt):
            with open(vtt, encoding="utf-8") as f:
                texto = f.read()  # se lee antes de abrir para escribir (abrir con "w" vacía el archivo)
            with open(vtt, "w", encoding="utf-8") as f:
                f.write(corregir(n, texto))
    open(ruta, "w", encoding="utf-8").write(js[:i] + json.dumps(T, ensure_ascii=False, indent=1) + ";\n")
    print("correcciones aplicadas")
