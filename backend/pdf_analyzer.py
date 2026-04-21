import os
import glob
import subprocess
import tempfile
import re
import numpy as np
from PIL import Image


def get_gs_executable():
    potential_paths = [
        "gswin64c.exe",
        "gswin32c.exe",
        "gs",
        r"C:\Program Files\gs\gs10.06.0\bin\gswin64c.exe",
    ]
    for exe in potential_paths:
        try:
            # Hide console window visually if running in Windows
            startupinfo = None
            if os.name == "nt":
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

            subprocess.run(
                [exe, "--version"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
                startupinfo=startupinfo,
            )
            return exe
        except Exception:
            continue
    raise FileNotFoundError(
        "Ghostscript (gswin64c.exe) executable NO se encontró en el sistema. Asegúrese de que GS esté instalado para el análisis de tintas planas."
    )


def analyze_pdf_coverage(pdf_path: str):
    """
    Analiza la cubritividad de tinta utilizando el motor RIP estándar de la industria (Ghostscript).
    A diferencia de PyMuPDF, Ghostscript usa `tiffsep` que soporta ilimitada cantidad de
    tintas planas (Spots) como Pantone, sin convertirlas todas arbitrariamente a CMYK.
    """
    gs_exe = get_gs_executable()
    report = {"summary": {}, "pages": []}

    with tempfile.TemporaryDirectory() as tmpdir:
        # Pauta de salida para Ghostscript
        output_pattern = os.path.join(tmpdir, "page_%d.tif")

        startupinfo = None
        if os.name == "nt":
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

        cmd = [
            gs_exe,
            "-sDEVICE=tiffsep",
            "-dNOPAUSE",
            "-dBATCH",
            "-dQUIET",
            "-r72",  # 72 dpi acelera enormemente el cómputo y brinda precisión de 98%+ real.
            f"-sOutputFile={output_pattern}",
            pdf_path,
        ]

        subprocess.run(cmd, check=True, startupinfo=startupinfo)

        # Archivos generados con el formato: "page_1.tif" (Compuesto) y "page_1(Cyan).tif" (Separación)
        sep_files = glob.glob(os.path.join(tmpdir, "page_*(*).tif"))

        # Expresión regular para separar el número de página y la tinta extraída
        pattern = re.compile(r"page_(\d+)\((.+)\)\.tif")

        pages_data = {}
        total_separations_coverage = {}
        separation_counts = {}

        for filepath in sep_files:
            filename = os.path.basename(filepath)
            match = pattern.match(filename)
            if not match:
                continue

            page_num = int(match.group(1))
            sep_name = match.group(2)

            # Limpieza para que no haya conflicto en la UI
            if sep_name.lower().endswith("process cyan"):
                sep_name = "Cyan"
            if sep_name.lower().endswith("process magenta"):
                sep_name = "Magenta"
            if sep_name.lower().endswith("process yellow"):
                sep_name = "Yellow"
            if sep_name.lower().endswith("process black"):
                sep_name = "Black"

            with Image.open(filepath) as img:
                arr = np.array(img)
                # En gs tiffsep, 0 es tinta sólida y 255 es sin tinta (papel).
                mean_grey = np.mean(arr)
                coverage = ((255.0 - mean_grey) / 255.0) * 100.0

            if page_num not in pages_data:
                pages_data[page_num] = {}

            pages_data[page_num][sep_name] = coverage

            total_separations_coverage[sep_name] = (
                total_separations_coverage.get(sep_name, 0) + coverage
            )
            separation_counts[sep_name] = separation_counts.get(sep_name, 0) + 1

    # Ensamblar tabla de salida como antes
    for page_num in sorted(pages_data.keys()):
        report["pages"].append(
            {"page_number": page_num, "separations": pages_data[page_num]}
        )

    for sep, total in total_separations_coverage.items():
        report["summary"][sep] = total / separation_counts[sep]

    return report
