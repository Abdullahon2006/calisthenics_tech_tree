#!/usr/bin/env python3
"""
Fal.ai Calisthenics "Yellow Dude" Vector Icon Generator
Uses your FAL_KEY from .env to generate custom SVGs using fal-ai/recraft-v3 or Flux.
"""

import os
import sys
import json
import urllib.request
from pathlib import Path

# Load .env
env_file = Path(__file__).resolve().parent.parent / '.env'
fal_key = None

if env_file.exists():
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('FAL_KEY='):
                fal_key = line.split('=', 1)[1].strip()

if not fal_key:
    fal_key = os.environ.get('FAL_KEY')

if not fal_key:
    print("Error: FAL_KEY not found in .env or environment.")
    sys.exit(1)

OUTPUT_DIR = Path(__file__).resolve().parent.parent / 'public' / 'icons'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MOVEMENT_ICON_PACK = {
    'push': 'deep strict push-up on the floor',
    'pull': 'strict pull-up on a horizontal bar',
    'static': (
        'strict front lever hold: both hands gripping a horizontal bar, arms straight, '
        'entire body held perfectly horizontal and parallel to the floor, face upward; '
        'not a pull-up, hang, muscle-up, or vertical pose'
    ),
    'core': (
        'strict L-sit: upright torso supported between parallel bars, arms locked, '
        'both straight legs held together horizontally forward at exactly 90 degrees; '
        'not a planche, push-up, plank, kneeling pose, or bent knees'
    ),
    'legs': 'controlled pistol squat',
}

CORRECTION_PACK = {key: MOVEMENT_ICON_PACK[key] for key in ('static', 'core')}

def generate_icon(prompt_subject: str, filename: str):
    print(f"Generating icon for: {prompt_subject}...")
    url = "https://fal.run/fal-ai/recraft-v3"

    prompt = (
        "Original editorial fitness icon for a calisthenics progression app. "
        f"Show one full-body adult athlete performing a technically credible {prompt_subject}. "
        "Use a solid saffron-gold body silhouette with a charcoal utility training vest, "
        "subtle steel apparatus where needed, and strong anatomical mass in the torso and limbs. "
        "The figure is faceless, confident, graphic, and mature; use clean filled vector shapes, "
        "not stick limbs or line-art. Center the whole pose in a square canvas with a transparent "
        "background and generous clear space. No text, letters, logos, watermark, cute/chibi styling, "
        "smiling face, gradients, or copied brand characters."
    )

    payload = json.dumps({
        "prompt": prompt,
        "style": "vector_illustration"
    }).encode("utf-8")

    headers = {
        "Authorization": f"Key {fal_key}",
        "Content-Type": "application/json"
    }

    req = urllib.request.Request(url, data=payload, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            if "images" in data and len(data["images"]) > 0:
                img_url = data["images"][0]["url"]
                ext = ".svg" if "svg" in data["images"][0].get("content_type", "") else ".png"
                out_path = OUTPUT_DIR / f"{filename}{ext}"

                # Download and save
                urllib.request.urlretrieve(img_url, out_path)
                print(f"  ✓ Saved to {out_path}")
                return str(out_path)
    except Exception as e:
        print(f"  ✗ Failed: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] in ('--pack', '--fix'):
        pack = CORRECTION_PACK if sys.argv[1] == '--fix' else MOVEMENT_ICON_PACK
        for filename, subject in pack.items():
            generate_icon(subject, filename)
    elif len(sys.argv) > 1:
        subject = " ".join(sys.argv[1:])
        name = subject.lower().replace(" ", "_")
        generate_icon(subject, name)
    else:
        print("Usage: python3 scripts/generate_fal_icons.py --pack")
        print("   or: python3 scripts/generate_fal_icons.py --fix")
        print("   or: python3 scripts/generate_fal_icons.py 'pull up on bar'")
