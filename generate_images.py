#!/usr/bin/env python3
"""Generate images for Water Margin kids webapp using Cloudflare Workers AI."""
import os
import sys
import json
import base64
import requests
import time
from pathlib import Path

# Load environment variables
env_path = Path.home() / ".pi" / "agent" / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"')
else:
    print("Error: ~/.pi/agent/.env not found", file=sys.stderr)
    sys.exit(1)

ACCOUNT_ID = os.environ.get("CLOUDFLARE_ID")
API_KEY = os.environ.get("CLOUDFLARE_API_KEY")
API_URL = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run"

# Default model (cheapest)
DEFAULT_MODEL = "@cf/black-forest-labs/flux-1-schnell"

# Image prompts for each page (Chinese painting style)
PAGE_PROMPTS = {
    1: "Traditional Chinese ink painting of Liangshan Marsh, misty mountains, water, serene landscape, classic shanshui style, children's book illustration",
    2: "Traditional Chinese ink painting of a brave warrior fighting a tiger in the mountains, dramatic scene, classic style, children's book illustration",
    3: "Traditional Chinese ink painting of a strong monk pulling up a willow tree, display of strength, classic style, children's book illustration",
    4: "Traditional Chinese ink painting of a warrior on a journey through mountains, exile scene, classic style, children's book illustration",
    5: "Traditional Chinese ink painting of a warrior holding two axes, loyal and brave, classic style, children's book illustration",
    6: "Traditional Chinese ink painting of heroes gathering for a feast, celebration, classic style, children's book illustration",
    7: "Traditional Chinese ink painting of a battle scene at a seaside fortress, heroes fighting together, classic style, children's book illustration",
    8: "Traditional Chinese ink painting of heroes making a promise, code of honor, classic style, children's book illustration",
    9: "Traditional Chinese ink painting of heroes standing on a mountain, legend lives on, classic style, children's book illustration",
    10: "Traditional Chinese ink painting of a peaceful landscape with text 'The End', classic style, children's book illustration"
}

def generate_image(prompt, output_path, width=1024, height=768):
    """Generate a single image using Cloudflare Workers AI."""
    print(f"Generating image: {output_path.name}")
    
    payload = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "guidance": 7.5,
        "num_steps": 4,
        "negative_prompt": "blurry, low quality, modern elements, text, watermark"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/{DEFAULT_MODEL}",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        
        if "result" in data and "image" in data["result"]:
            img_bytes = base64.b64decode(data["result"]["image"])
            with open(output_path, "wb") as f:
                f.write(img_bytes)
            print(f"✅ Saved {output_path.name} ({len(img_bytes)} bytes)")
            return True
        else:
            print(f"❌ Unexpected response for {output_path.name}", file=sys.stderr)
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error generating {output_path.name}: {e}", file=sys.stderr)
        return False

def main():
    """Generate all images for the webapp."""
    images_dir = Path("images")
    images_dir.mkdir(exist_ok=True)
    
    success_count = 0
    total_count = len(PAGE_PROMPTS)
    
    for page_num, prompt in PAGE_PROMPTS.items():
        output_path = images_dir / f"page{page_num}.jpg"
        
        # Skip if image already exists
        if output_path.exists():
            print(f"Skipping page {page_num} (image exists)")
            success_count += 1
            continue
        
        if generate_image(prompt, output_path):
            success_count += 1
        
        # Small delay to avoid rate limiting
        time.sleep(1)
    
    print(f"\nGeneration complete: {success_count}/{total_count} images created")
    return success_count == total_count

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)