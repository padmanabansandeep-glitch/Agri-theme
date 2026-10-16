import os
import subprocess
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"
DIST = FRONTEND / "dist"
ASSETS = DIST / "assets"

ASSETS.mkdir(parents=True, exist_ok=True)

CODE_EXE = r"C:\Users\ELCOT\AppData\Local\Programs\Microsoft VS Code\Code.exe"
ESBUILD_EXE = FRONTEND / "node_modules" / "@esbuild" / "win32-x64" / "esbuild.exe"
TAILWIND_CLI = FRONTEND / "node_modules" / "tailwindcss" / "lib" / "cli.js"

env = dict(os.environ, ELECTRON_RUN_AS_NODE="1")

print("1. Compiling Tailwind CSS...")
css_out = ASSETS / "index.css"
css_log = FRONTEND / "build_tailwind.log"
with open(css_log, "w", encoding="utf-8") as lf:
    css_res = subprocess.run(
        [CODE_EXE, str(TAILWIND_CLI), "-i", "src/index.css", "-o", str(css_out), "--minify"],
        cwd=str(FRONTEND),
        env=env,
        stdout=lf,
        stderr=lf
    )
print("Tailwind exit code:", css_res.returncode)

print("2. Bundling JS/TSX with esbuild...")
js_out = ASSETS / "index.js"
js_log = FRONTEND / "build_esbuild.log"
with open(js_log, "w", encoding="utf-8") as lf:
    js_res = subprocess.run(
        [
            str(ESBUILD_EXE),
            "src/main.tsx",
            "--bundle",
            f"--outfile={js_out}",
            "--loader:.tsx=tsx",
            "--loader:.ts=ts",
            "--loader:.css=empty",
            "--minify",
            "--target=es2020",
            "--jsx=automatic"
        ],
        cwd=str(FRONTEND),
        stdout=lf,
        stderr=lf
    )
print("esbuild exit code:", js_res.returncode)

print("3. Updating dist/index.html...")
index_html = DIST / "index.html"
src_html = FRONTEND / "index.html"

html_content = src_html.read_text(encoding="utf-8")
html_content = html_content.replace('<script type="module" src="/src/main.tsx"></script>', '')
# Insert the css and js bundle script tags
head_insert = """
    <link rel="stylesheet" href="/assets/index.css">
    <script type="module" src="/assets/index.js"></script>
  </head>"""
html_content = html_content.replace("</head>", head_insert)
index_html.write_text(html_content, encoding="utf-8")

print("4. Copying public assets if any...")
public_dir = FRONTEND / "public"
if public_dir.exists():
    for item in public_dir.iterdir():
        dest = DIST / item.name
        if item.is_file() and not dest.exists():
            shutil.copy2(item, dest)

print("Done! Build verified.")
