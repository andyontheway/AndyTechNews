import json
import re
import urllib.request
import urllib.parse
import time
from concurrent.futures import ThreadPoolExecutor

# Verified fallback images with topic labels
FALLBACK_LIBRARY = {
    "gpu": [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80"
    ],
    "cpu": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80"
    ],
    "ssd": [
        "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
    ],
    "pc": [
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ],
    "ai": [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
    ],
    "smartphones": [
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80"
    ],
    "ev": [
        "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558441719-74e64593259e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80"
    ],
    "cars": [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    "motorbikes": [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
    ]
}

def get_fallback_image(article):
    text = (article.get("title", "") + " " + article.get("subcategory", "") + " " + " ".join(article.get("tags", []))).lower()
    
    if any(k in text for k in ["gpu", "rtx", "geforce", "radeon", "graphics", "vram", "card"]):
        pool = FALLBACK_LIBRARY["gpu"]
    elif any(k in text for k in ["ssd", "nvme", "pcie", "phison", "predator", "storage", "ổ cứng"]):
        pool = FALLBACK_LIBRARY["ssd"]
    elif any(k in text for k in ["cpu", "intel", "ryzen", "core", "processor", "chip", "vi xử lý", "lake"]):
        pool = FALLBACK_LIBRARY["cpu"]
    elif any(k in text for k in ["ai", "npu", "neural", "llm", "gemini", "trí tuệ nhân tạo"]):
        pool = FALLBACK_LIBRARY["ai"]
    elif article.get("subcategory") == "smartphones" or any(k in text for k in ["phone", "smartphone", "iphone", "galaxy"]):
        pool = FALLBACK_LIBRARY["smartphones"]
    elif article.get("subcategory") == "ev" or any(k in text for k in ["ev", "electric", "xe điện", "pin", "trạm sạc"]):
        pool = FALLBACK_LIBRARY["ev"]
    elif article.get("subcategory") == "motorbikes" or any(k in text for k in ["mô tô", "xe máy", "motor"]):
        pool = FALLBACK_LIBRARY["motorbikes"]
    elif article.get("category") == "auto" or any(k in text for k in ["ferrari", "porsche", "supercar", "car", "siêu xe"]):
        pool = FALLBACK_LIBRARY["cars"]
    else:
        pool = FALLBACK_LIBRARY["pc"]

    # Deterministic index
    h = sum(ord(c) * (i + 1) for i, c in enumerate(article.get("title", "techgear"))) % len(pool)
    return pool[h]

def is_vietnamese(text):
    if not text:
        return True
    vietnamese_chars = set("àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ")
    return any(c in vietnamese_chars for c in text.lower())

translation_cache = {}

def translate_en_to_vi(text):
    if not text or not text.strip():
        return text
    if is_vietnamese(text):
        return text
    
    clean = text.strip()
    if clean in translation_cache:
        return translation_cache[clean]
    
    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" + urllib.parse.quote(clean)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                result = "".join([part[0] for part in data[0] if part[0]])
                translation_cache[clean] = result
                return result
        except Exception as e:
            time.sleep(0.5)
    
    return text

def translate_html_content(html, article_title, article_excerpt, source_name):
    if not html:
        return f'<p class="lead text-lg font-medium text-slate-700 dark:text-slate-300 mb-6">{article_excerpt}</p><p>Thông tin chi tiết được tổng hợp và phân phối từ chuyên mục công nghệ & xe cộ của {source_name}.</p>'
    
    # If already mostly Vietnamese, return
    if is_vietnamese(html):
        return html
    
    def repl(m):
        open_t = m.group(1)
        body = m.group(2)
        close_t = m.group(3)
        if not body.strip() or "<" in body:
            return m.group(0)
        vi = translate_en_to_vi(body)
        return f"{open_t}{vi}{close_t}"
    
    return re.sub(r'(<(?:p|h1|h2|h3|h4|li|blockquote|strong)[^>]*>)([\s\S]*?)(<\/(?:p|h1|h2|h3|h4|li|blockquote|strong)>)', repl, html)

TAG_MAP = {
    "supercar": "Siêu xe",
    "supercars": "Siêu xe",
    "car": "Xe cộ",
    "cars": "Ô tô",
    "electric": "Xe điện",
    "ev": "Xe điện (EV)",
    "reviews": "Đánh giá",
    "hardware": "Phần cứng",
    "pc": "Máy tính PC",
    "graphics": "Đồ họa",
    "gpu": "Card màn hình (GPU)",
    "cpu": "Bộ vi xử lý (CPU)",
    "processor": "Vi xử lý",
    "motherboard": "Bo mạch chủ",
    "ssd": "Ổ cứng SSD",
    "storage": "Bộ nhớ lưu trữ",
    "ai": "Trí tuệ nhân tạo (AI)",
    "motorbikes": "Xe máy & PKL"
}

def process_article(art):
    # 1. Fallback Image Repair
    cover = art.get("coverImage", "")
    is_blocked = not cover or not cover.strip() or "techpowerup.com/img" in cover
    if is_blocked:
        art["coverImage"] = get_fallback_image(art)

    # 2. Translation
    is_en = "Top Gear" in art.get("source", "") or "TechPowerUp" in art.get("source", "") or not is_vietnamese(art.get("title", ""))
    if is_en:
        # Translate title
        art["title"] = translate_en_to_vi(art.get("title", ""))
        
        # Translate excerpt
        art["excerpt"] = translate_en_to_vi(art.get("excerpt", ""))
        
        # Translate content
        art["content"] = translate_html_content(art.get("content", ""), art["title"], art["excerpt"], art.get("source", "TechGear"))
        
        # Translate tags
        new_tags = []
        for t in art.get("tags", []):
            low = t.lower().strip()
            if low in TAG_MAP:
                new_tags.append(TAG_MAP[low])
            elif not is_vietnamese(t) and len(t) < 30:
                new_tags.append(translate_en_to_vi(t))
            else:
                new_tags.append(t)
        art["tags"] = new_tags
        
        # Translate specs
        specs = art.get("specs")
        if specs and isinstance(specs, dict):
            new_specs = {}
            for k, v in specs.items():
                new_k = translate_en_to_vi(k) if not is_vietnamese(k) else k
                new_v = translate_en_to_vi(v) if not is_vietnamese(v) else v
                new_specs[new_k] = new_v
            art["specs"] = new_specs

    return art

def main():
    print("Reading data/articles.json...")
    with open("data/articles.json", "r", encoding="utf-8") as f:
        articles = json.load(f)

    print(f"Total articles: {len(articles)}")
    start = time.time()
    
    # Process with ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=12) as executor:
        processed = list(executor.map(process_article, articles))
    
    print(f"Processed and translated {len(processed)} articles in {time.time() - start:.2f}s")
    
    # Save back to data/articles.json and public/data/articles.json
    with open("data/articles.json", "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)
    
    with open("public/data/articles.json", "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    print("Successfully updated data/articles.json and public/data/articles.json!")

if __name__ == "__main__":
    main()
