#!/usr/bin/env python3
"""Generate audio files for Water Margin kids webapp using Edge TTS."""
import asyncio
import edge_tts
import os
from pathlib import Path

# Voice configurations
ENGLISH_VOICE = "en-US-GuyNeural"  # Male voice
CHINESE_VOICE = "zh-CN-XiaoxiaoNeural"  # Female voice
CHINESE_RATE = "-8%"  # Slow down by 8%

# Narration text for each page
NARRATION = {
    1: {
        "en": "Long ago in China, there was a place called Liangshan Marsh. It was a wild, watery place where mountains met the sky. Here, 108 heroes gathered. They came from all over China. Some were strong warriors. Some were clever scholars. All of them wanted to help the people.",
        "cn": "很久以前，在中国有一个地方叫梁山泊。那是一个 wild, watery 的地方，山与天相接。在这里，108 位英雄聚集。他们来自中国各地。有些是强壮的战士。有些是聪明的学者。他们都想帮助人民。"
    },
    2: {
        "en": "One day, a brave man named Wu Song was walking through the mountains. He was tall and strong. Suddenly, a huge tiger jumped out! Wu Song was scared, but he didn't run. He fought the tiger with his bare hands and won! Everyone called him a hero.",
        "cn": "有一天，一个名叫武松的勇敢男子正穿过 mountains。他高大强壮。突然，一只 huge 老虎跳了出来！武松很害怕，但他没有跑。他用 bare hands 与老虎搏斗并获胜！每个人都称他为英雄。"
    },
    3: {
        "en": "Lu Zhishen was a monk with a big heart and even bigger muscles. He didn't like bullies. One day, he saw a group of men bothering villagers. To show his strength, he grabbed a huge willow tree and pulled it right out of the ground! The bullies ran away scared.",
        "cn": "鲁智深是一个有着 big heart 和 even bigger muscles 的 monk。他不喜欢 bullies。有一天，他看到一群 men 骚扰 villagers。为了 show his strength，他 grabbed a huge willow tree 并 pulled it right out of the ground！bullies 吓跑了。"
    },
    4: {
        "en": "Lin Chong was a great fighter who worked for the emperor. But some bad people wanted to hurt him. They sent him far away on a dangerous journey. Along the way, he had to fight many enemies. But his courage never stopped. He finally joined the heroes at Liangshan.",
        "cn": "林冲是一个 great fighter，为 emperor 工作。但 some bad people 想要 hurt him。他们 sent him far away on a dangerous journey。沿途，他 had to fight many enemies。但他的 courage never stopped。他 finally joined the heroes at Liangshan。"
    },
    5: {
        "en": "Li Kui was known for his two big axes. He was very loyal to his friends. He would do anything to protect them. Some people thought he was fierce, but he had a kind heart. He always helped the weak and fought the strong.",
        "cn": "李逵以 his two big axes 而闻名。他 very loyal to his friends。他 would do anything to protect them。有些人 thought he was fierce，但他 had a kind heart。他 always helped the weak and fought the strong。"
    },
    6: {
        "en": "All 108 heroes gathered at Liangshan for a big feast. They ate delicious food and drank tea. They made a promise to always help each other and fight for justice. They became like one big family.",
        "cn": "所有 108 位英雄 gathered at Liangshan for a big feast。他们 ate delicious food and drank tea。他们 made a promise to always help each other and fight for justice。他们 became like one big family。"
    },
    7: {
        "en": "The heroes had to fight a big battle at a place called Tinghai. It was very dangerous. They used clever plans and worked together. They won the battle and saved many people. This showed how strong they were when they worked as a team.",
        "cn": "英雄们 had to fight a big battle at a place called Tinghai。非常 dangerous。他们 used clever plans and worked together。他们 won the battle and saved many people。这 showed how strong they were when they worked as a team。"
    },
    8: {
        "en": "The heroes lived by a special code. They promised to be brave, honest, and kind. They helped the poor and stood up against injustice. Even though they were different, they all believed in doing the right thing.",
        "cn": "英雄们 lived by a special code。他们 promised to be brave, honest, and kind。他们 helped the poor and stood up against injustice。即使 they were different，they all believed in doing the right thing。"
    },
    9: {
        "en": "Even today, people still tell stories about the 108 heroes of Liangshan. Their bravery and friendship inspire us all. They show us that when we work together, we can overcome any challenge.",
        "cn": "即使 today，people still tell stories about the 108 heroes of Liangshan。他们的 bravery and friendship inspire us all。他们 show us that when we work together, we can overcome any challenge。"
    },
    10: {
        "en": "Thank you for reading about the Water Margin heroes! Remember, you can be a hero too by being brave, kind, and helping others.",
        "cn": "感谢 you for reading about the Water Margin heroes! 记住，you can be a hero too by being brave, kind, and helping others。"
    }
}

async def generate_audio_file(text, voice, rate, output_path):
    """Generate a single audio file using Edge TTS."""
    print(f"Generating audio: {output_path.name}")
    
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(str(output_path))
        print(f"✅ Saved {output_path.name}")
        return True
    except Exception as e:
        print(f"❌ Error generating {output_path.name}: {e}")
        return False

async def generate_all_audio():
    """Generate all audio files for the webapp."""
    audio_dir = Path("audio")
    audio_dir.mkdir(exist_ok=True)
    
    success_count = 0
    total_count = len(NARRATION) * 2  # English and Chinese for each page
    
    for page_num, texts in NARRATION.items():
        # Generate English audio
        en_path = audio_dir / f"page{page_num}_en.mp3"
        if not en_path.exists():
            if await generate_audio_file(texts["en"], ENGLISH_VOICE, "+0%", en_path):
                success_count += 1
        else:
            print(f"Skipping page {page_num} English (audio exists)")
            success_count += 1
        
        # Generate Chinese audio
        cn_path = audio_dir / f"page{page_num}_cn.mp3"
        if not cn_path.exists():
            if await generate_audio_file(texts["cn"], CHINESE_VOICE, CHINESE_RATE, cn_path):
                success_count += 1
        else:
            print(f"Skipping page {page_num} Chinese (audio exists)")
            success_count += 1
    
    print(f"\nAudio generation complete: {success_count}/{total_count} files created")
    return success_count == total_count

def main():
    """Main function to generate audio files."""
    return asyncio.run(generate_all_audio())

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)