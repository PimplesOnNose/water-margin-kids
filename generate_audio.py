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
        "cn": "很久以前，在中国有一个地方叫梁山泊。那是一个山水相依、烟波浩渺的地方。在这里，一百零八位好汉聚集。他们来自中国各地。有些是强壮的战士。有些是聪明的学者。他们都想帮助老百姓。"
    },
    2: {
        "en": "One day, a brave man named Wu Song was walking through the mountains. He was tall and strong. Suddenly, a huge tiger jumped out! Wu Song was scared, but he didn't run. He fought the tiger with his bare hands and won! Everyone called him a hero.",
        "cn": "有一天，一个名叫武松的勇敢男子正穿过景阳冈。他高大强壮。突然，一只大老虎跳了出来！武松虽然害怕，但他没有逃跑。他赤手空拳与老虎搏斗并获胜！每个人都称他为英雄。"
    },
    3: {
        "en": "Lu Zhishen was a monk with a big heart and even bigger muscles. He didn't like bullies. One day, he saw a group of men bothering villagers. To show his strength, he grabbed a huge willow tree and pulled it right out of the ground! The bullies ran away scared.",
        "cn": "鲁智深是一个心地善良、力大无穷的和尚。他最看不惯欺负人的坏蛋。有一天，他看到一群恶霸在欺负村民。为了展示自己的力气，他抓住一棵大柳树，一下子把它从地里拔了出来！那些恶霸吓得赶紧逃跑了。"
    },
    4: {
        "en": "Lin Chong was a great fighter who worked for the emperor. But some bad people wanted to hurt him. They sent him far away on a dangerous journey. Along the way, he had to fight many enemies. But his courage never stopped. He finally joined the heroes at Liangshan.",
        "cn": "林冲是一位武艺高强的将领，为朝廷效力。但是一些坏人想要陷害他。他们把他发配到很远的地方，路途非常危险。一路上，他不得不与许多敌人战斗。但他的勇气从未停止。他最终加入了梁山的好汉们。"
    },
    5: {
        "en": "Li Kui was known for his two big axes. He was very loyal to his friends. He would do anything to protect them. Some people thought he was fierce, but he had a kind heart. He always helped the weak and fought the strong.",
        "cn": "李逵以他的两把大板斧而闻名。他对朋友非常忠心。他愿意做任何事情来保护朋友。有些人觉得他很凶猛，但他有一颗善良的心。他总是帮助弱小，对抗强敌。"
    },
    6: {
        "en": "All 108 heroes gathered at Liangshan for a big feast. They ate delicious food and drank tea. They made a promise to always help each other and fight for justice. They became like one big family.",
        "cn": "一百零八位好汉齐聚梁山，举行盛大的宴会。他们品尝美味佳肴，畅饮美酒。他们立下誓言，要互相帮助，伸张正义。他们就像一个大家庭一样团结。"
    },
    7: {
        "en": "The heroes had to fight a big battle at a place called Tinghai. It was very dangerous. They used clever plans and worked together. They won the battle and saved many people. This showed how strong they were when they worked as a team.",
        "cn": "英雄们在一个叫汀海的地方打了一场大仗。战斗非常危险。他们运用巧妙的计策，团结一致。他们赢得了战斗，救了许多人。这说明了团结起来是多么强大。"
    },
    8: {
        "en": "The heroes lived by a special code. They promised to be brave, honest, and kind. They helped the poor and stood up against injustice. Even though they were different, they all believed in doing the right thing.",
        "cn": "好汉们遵循着一套特殊的准则。他们承诺要勇敢、诚实、善良。他们帮助穷人，反抗不公正的事情。虽然每个人都不一样，但他们都相信要做正确的事。"
    },
    9: {
        "en": "Even today, people still tell stories about the 108 heroes of Liangshan. Their bravery and friendship inspire us all. They show us that when we work together, we can overcome any challenge.",
        "cn": "直到今天，人们仍然在传颂梁山一百零八位好汉的故事。他们的勇敢和友谊激励着我们每一个人。他们告诉我们，只要团结一致，就能克服任何困难。"
    },
    10: {
        "en": "Thank you for reading about the Water Margin heroes! Remember, you can be a hero too by being brave, kind, and helping others.",
        "cn": "感谢你阅读水浒英雄的故事！记住，只要你勇敢、善良、乐于助人，你也可以成为英雄！"
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