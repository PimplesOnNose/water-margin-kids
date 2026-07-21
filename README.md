# Water Margin for Kids 🐉

An interactive webapp teaching the classic Chinese folktale "Water Margin" (水浒传) to primary school children, featuring bilingual narration and traditional Chinese painting illustrations.

## 🎯 Overview

This educational webapp presents the story of the 108 heroes of Liangshan in a child-friendly format with:

### 🌐 Live Demo

**[Water Margin for Kids](https://pimplesonnose.github.io/water-margin-kids/)** - Deployed on GitHub Pages

- **Bilingual Content**: English (default) and Chinese with Hanzi and Pinyin
- **Audio Narration**: Professional voice narration in both languages
- **Traditional Illustrations**: Chinese painting style artwork for each scene
- **Interactive Controls**: Language switching, audio playback, and auto-play features

## 🚀 Features

### Educational Content
- Simplified version of the classic Chinese folktale
- 10 illustrated pages with engaging storytelling
- Cultural elements presented in an accessible way
- Moral lessons about bravery, loyalty, and justice

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Touch Support**: Swipe navigation on mobile devices
- **Keyboard Navigation**: Arrow keys for pages, spacebar for audio
- **Accessibility**: Screen reader friendly with ARIA labels

### Audio Features
- **English Narration**: Male voice at normal speed (Edge TTS)
- **Chinese Narration**: Female voice slowed down by 8% for learning
- **Audio Toggle**: Play/pause audio for current page
- **Auto-Play**: Automatically advance pages while audio plays

### Technical Features
- **Modern Web Standards**: HTML5, CSS3, JavaScript (ES6+)
- **No Frameworks**: Pure vanilla implementation for fast loading
- **Progressive Enhancement**: Works without JavaScript
- **Print Support**: Optimized for printing

## 📁 Structure

```
water-margin-kids/
├── index.html          # Main HTML file
├── styles.css          # CSS styles (Chinese painting aesthetic)
├── script.js           # JavaScript functionality
├── generate_images.py  # Image generation script (Cloudflare AI)
├── generate_audio.py   # Audio generation script (Edge TTS)
├── README.md           # This file
├── LICENSE             # MIT License
├── images/             # Generated illustrations
│   ├── page1.jpg
│   ├── page2.jpg
│   └── ...
└── audio/              # Generated audio files
    ├── page1_en.mp3
    ├── page1_cn.mp3
    └── ...
```

## 🎨 Design

### Color Palette
- **Primary**: Earthy brown (#8c4a2f) - Traditional Chinese ink
- **Secondary**: Light brown (#d4a574) - Rice paper
- **Accent**: Traditional red (#c1362a) - Lucky red
- **Background**: Parchment (#f5f0e8) - Classic scroll

### Typography
- **English Headings**: Playfair Display (elegant, classic)
- **English Body**: Inter (clean, readable)
- **Chinese Text**: Noto Serif SC (authentic Chinese typography)

### Layout
- **Grid-based**: Responsive two-column layout
- **Card-based**: Each page as a distinct card
- **Visual Hierarchy**: Clear separation of elements
- **Traditional Motifs**: Decorative borders and patterns

## 🖼️ Images

All images are AI-generated using Cloudflare Workers AI (FLUX-1-schnell model) with traditional Chinese painting prompts:

- **Style**: Classic shanshui (mountain-water) painting
- **Elements**: Misty mountains, traditional architecture, historical clothing
- **Color Palette**: Muted earth tones with red accents
- **Composition**: Balanced, serene scenes suitable for children

## 🔊 Audio

Audio files are generated using Edge TTS (Text-to-Speech):

### English Audio
- **Voice**: en-US-GuyNeural (male)
- **Speed**: Normal pace
- **Style**: Clear, engaging narration for children

### Chinese Audio
- **Voice**: zh-CN-XiaoxiaoNeural (female)
- **Speed**: Slowed by 8% for language learners
- **Style**: Standard Mandarin pronunciation

## 🚀 Getting Started

### Option 1: Direct Opening
Simply open `index.html` in any modern web browser.

### Option 2: Local Server (Recommended)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

### Option 3: Live Server (VS Code)
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## ♿ Accessibility

- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** mode support
- **Reduced motion** respect

## 🔧 Customization

### Colors
Modify CSS variables in `styles.css`:
```css
:root {
    --primary-color: #8c4a2f;    /* Traditional brown */
    --secondary-color: #d4a574;  /* Rice paper */
    --accent-color: #c1362a;     /* Lucky red */
    /* ... other variables */
}
```

### Fonts
Change font imports in HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

### Content
Edit the `NARRATION` dictionary in `generate_audio.py` and the HTML sections in `index.html`.

## 📊 Performance

- **Lazy loading** for images
- **CSS animations** with `will-change`
- **Throttled** scroll events
- **Optimized** selectors
- **Preloaded** audio for first page

## 🔍 SEO

- **Semantic HTML5** structure
- **Meta tags** for social sharing
- **Heading hierarchy** (h1-h6)
- **Alt text** for all images
- **Descriptive** link text

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

### Devices Tested
- Desktop (1920x1080)
- Tablet (iPad)
- Mobile (iPhone, Android)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pi**: [https://pi.dev](https://pi.dev) - AI development platform
- **Deepseek**: [https://deepseek.com](https://deepseek.com) - AI research
- **Cloudflare Workers AI**: For image generation
- **Edge TTS**: For audio narration
- **Google Fonts**: Playfair Display, Inter, Noto Serif SC

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Ensure audio files are generated
3. Verify image files exist in the `images/` directory
4. Test with different browsers and devices

---

*Created with MiMo-v2.5* | *Based on the classic Chinese novel "Water Margin" (水浒传)*