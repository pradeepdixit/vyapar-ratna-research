import json, re
from pathlib import Path

src = Path('/home/ubuntu/astrominute/research/sections/10.json')
out = Path('/home/ubuntu/astrominute/research/reviews/10.json')
data = json.loads(src.read_text())
byid = {x['id']: x for x in data}

# Canonical Hindi names used in the review while preserving original source IDs.
canon = {
    'आर्डिनरी शेयर्स':'साधारण शेयर', 'आयल-शेयर्स':'तेल शेयर', 'ऑयल कम्पनी':'तेल कंपनियाँ',
    'आयुध':'हथियार', 'क्लॉथ-मिल्स':'कपड़ा मिलें', 'कार-मोटर':'कार-मोटर',
    'खनिज पदार्थ जो भारी उद्योगों में काम आते हैं':'भारी उद्योगों के खनिज',
    'खांड':'चीनी', 'घडियाँ':'घड़ियाँ', 'चांदी':'चाँदी', 'जायदाद':'जायदाद',
    'जमीन':'जायदाद', 'भूमि':'जायदाद', 'मकान':'जायदाद', 'पाट':'जूट', 'सन':'जूट',
    'बारदाना':'जूट', 'मोटर':'कार-मोटर', 'मद्य':'मद्य', 'शराब':'मद्य',
    'शक्कर':'चीनी', 'बौन्ड्स':'बॉन्ड', 'लेशियन सिल्क':'हैसियन सिल्क',
    'सिल्क':'रेशम', 'सूत':'सूत', 'कांच और कांच के पदार्थ':'काँच',
    'गिलट तथा गिलट की बनी वस्तुएँ':'गिलट', 'धातु व खनिज-उद्योग':'धातु-खनिज उद्योग',
    'पेट्रोलियम तथा पेट्रोल-कम्पनियों के शेयर्स':'पेट्रोलियम और पेट्रोल शेयर',
    'तेल कम्पनियों के शेयर्स':'तेल कंपनियों के शेयर', 'शेयर बैंक के':'बैंक शेयर',
    'शेयर':'शेयर', 'विलासिता की सामग्री':'विलासिता सामग्री',
    'सुगन्धित पदार्थ (इत्र, फुलेल, लवेंडर आदि)':'सुगंधित पदार्थ',
    'मिट्टी को वस्तुएँ':'मिट्टी की वस्तुएँ', 'मिष्टान्न':'मिष्टान्न',
    'रांगा':'राँगा', 'रबड़ की बनी वस्तुएँ':'रबड़ की वस्तुएँ',
    'पीले वस्त्र':'पीले वस्त्र', 'सफ़ेद वस्तु':'सफेद वस्तुएँ', 'लाल-वस्तुएँ':'लाल वस्तुएँ',
    'बिजली के यन्त्र':'बिजली के यंत्र', 'बिजली का सामान':'बिजली का सामान',
    'कृषि-सम्बन्धी यन्त्र':'कृषि यंत्र', 'कल-पुर्जे':'मशीनरी',
    'एल्यूम्यूनियम उद्योग':'एल्यूमिनियम उद्योग', 'घी':'घी', 'रुई':'रुई',
    'गेहूँ':'गेहूँ', 'चांदी':'चाँदी', 'सोना':'सोना', 'चीनी':'चीनी',
    'काली मिर्च':'काली मिर्च', 'तेल':'तेल', 'मछली':'मछली', 'होटल':'होटल'
}

planet_tokens = [
    ('बृहस्पति','गुरु'), ('वृहस्पति','गुरु'), ('गुरु','गुरु'), ('सूर्य','सूर्य'),
    ('चन्द्र','चंद्रमा'), ('चंद्र','चंद्रमा'), ('मंगल','मंगल'), ('बुध','बुध'),
    ('शुक्र','शुक्र'), ('शनि','शनि'), ('राहुकेतु','राहु'), ('राहु','राहु'),
    ('केतु','केतु'), ('हर्शल','यूरेनस'), ('हर्याल','यूरेनस'), ('हर्याल','यूरेनस'),
    ('नेपच्यून','नेपच्यून'), ('प्लूटो','प्लूटो')
]
planet_order = ['सूर्य','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु','यूरेनस','नेपच्यून','प्लूटो']

def planets_for(text):
    found = set()
    for tok, p in planet_tokens:
        if tok in text:
            found.add(p)
    return [p for p in planet_order if p in found]

def cname(raw):
    raw = raw.strip()
    return canon.get(raw, raw)

def is_missing(text):
    return ('...' in text) or ('[अस्पष्ट]' in text) or ('अस्पष्ट' in text)

def reason_for(text, missing=False):
    if missing:
        return 'स्रोत-पाठ में एलिप्सिस या OCR-अस्पष्ट अंश है, इसलिए ग्रह-संबंध/शर्त का पूरा अर्थ faithfully पुनर्निर्मित नहीं किया जा सकता।'
    if 'देखिये' in text or 'अन्तर्गत' in text:
        return 'यह प्रविष्टि दूसरी वस्तु की ओर cross-reference करती है; स्वतंत्र ग्रह-शर्त, दिशा, प्रभाव-बल और समय-सीमा नहीं दी गई।'
    if any(w in text for w in ['मौसम','त्यौहार','त्योहार','शादी','मेले','उत्सव','ग्रीष्म']):
        return 'पाठ में मौसम/उत्सव/विवाह जैसे कारण हैं, पर उनका DSL-योग्य औपचारिक trigger या अवधि नहीं दी गई।'
    return 'ग्रह-युति/दृष्टि के कोण, परिभाषा, दिशा, प्रभाव-बल और समय-सीमा निर्दिष्ट नहीं हैं; इसलिए इसे exact DSL में faithfully encode नहीं किया जा सकता।'

def summary_for(name, text, grouped=False):
    if 'देखिये' in text or 'अन्तर्गत' in text:
        return f'पाठ {name} के लिए संबंधित प्रविष्टि देखने को कहता है; स्वतंत्र पूर्वानुमान-शर्त नहीं देता।'
    if 'मौसम' in text or 'त्यौहार' in text or 'त्योहार' in text or 'शादी' in text or 'मेले' in text or 'उत्सव' in text:
        return f'पाठ के अनुसार {name} के भाव मौसम, उत्सव, विवाह या मेले जैसे प्रसंगों से बदलते हैं; ग्रह-आधारित औपचारिक trigger नहीं दिया गया।'
    if grouped:
        return f'पाठ में {name} के लिए लगातार ब्लॉकों में ग्रह-सम्बन्धों की सूची है; सूची का एक भाग अपूर्ण/एलिप्टिकल है।'
    return f'पाठ में {name} के भाव/व्यापार से जुड़े ग्रह-सम्बन्धों की सूची दी गई है; यह दिशा या परिमाण वाला स्वतंत्र संकेत नहीं है।'

# Collect all commodity blocks: a leading "name - ..." block and its following continuation blocks.
entries = []
current = None
for x in data:
    bid, text = x['id'], x['text']
    if bid < 'B02254':
        continue
    if text.startswith('[Page') or text in ['व्यापार रत्न','ग्रहों और वस्तुओं का सम्बन्ध','ग्रहों की दूरी और व्यापारिक फलादेश']:
        continue
    if ' - ' in text:
        raw = text.split(' - ', 1)[0].strip()
        current = {'raw': raw, 'blocks': [x]}
        entries.append(current)
    elif text.startswith('...') and current is not None:
        current['blocks'].append(x)

# General chapter-level rules that precede the commodity table.
rules = []
def add_rule(title, summary, source_ids, planets, commodities, signal='सामान्य', status='reference', reason=None, timeframe='अनिर्दिष्ट'):
    n = len(rules) + 1
    rules.append({
        'id': f'R10-{n:03d}', 'title': title, 'summary': summary,
        'source_ids': source_ids, 'planets': planets, 'commodities': commodities,
        'timeframe': timeframe, 'signal': signal, 'status': status,
        'reason': reason or 'पाठ में औपचारिक computable trigger नहीं दिया गया।', 'conditions': []
    })

add_rule('ग्रह-सम्बन्ध से वस्तु-मूल्य परिवर्तन',
         'दो ग्रहों की दृष्टि या युति से उनके आधिपत्य/स्थित राशियों से जुड़ी वस्तुओं के मूल्य में विशेष हेर-फेर बताया गया है; तेजी या मंदी का विशिष्ट फल आगे के नियमों पर छोड़ा गया है.',
         ['B02247'], [], ['सामान्य बाजार'], 'मिश्रित', 'reference',
         'दृष्टि/युति की exact परिभाषा, राशि, दिशा, प्रभाव-सीमा और समय-सीमा नहीं दी गई।')
add_rule('ग्रह-संयोग का संयुक्त फल',
         'संयुक्त ग्रह-संबंध में ग्रह अपना मूल स्वभाव छोड़कर नया संयुक्त फल दे सकते हैं; पाठ इसे मधु-घृत के उदाहरण और श्लोक से समझाता है.',
         ['B02248','B02251','B02252','B02253'], [], ['सामान्य बाजार'], 'मिश्रित', 'reference',
         'संयोग का औपचारिक अर्थ, ग्रह-बल, दिशा और बाजार-प्रभाव का computable नियम नहीं दिया गया।')

# Standalone explanatory notes that do not use the usual "commodity - list" form.
add_rule('घी का मौसमी तेजी संकेत',
         'पाठ कहता है कि घी का भाव प्रायः मौसम, त्योहार और शादी आदि से तेज होता है तथा ग्रीष्म ऋतु का उल्लेख करता है।',
         ['B02293'], [], ['घी'], 'तेजी', 'reference',
         'मौसम/त्योहार/शादी और ग्रीष्म ऋतु का उल्लेख है, पर कोई औपचारिक तारीख, अवधि या DSL-योग्य मौसम trigger नहीं दिया गया।')
add_rule('तेल शेयरों पर तेल-ग्रहों का प्रभाव',
         'तेल की प्रविष्टि में प्रभावकारक बताए गए ग्रहों को तेल कंपनियों के शेयरों पर भी लागू बताया गया है।',
         ['B02325'], [], ['तेल कंपनियों के शेयर'], 'सामान्य', 'reference',
         'यह दूसरी प्रविष्टि पर निर्भर cross-reference है; ग्रहों की स्वतंत्र सूची, दिशा और समय-सीमा इस ब्लॉक में नहीं है।')
add_rule('पेट्रोल और मिट्टी के तेल की समानता',
         'पाठ के अनुसार पेट्रोल और मिट्टी के तेल में ग्रह-दृष्टिकोण से बहुत कम अंतर है।',
         ['B02338'], [], ['पेट्रोल', 'मिट्टी का तेल'], 'सामान्य', 'reference',
         'समानता का गुणात्मक कथन है; ग्रह, दृष्टि, दिशा, प्रभाव-बल और समय-सीमा नहीं दी गई।')

for ent in entries:
    raw = ent['raw']
    name = cname(raw)
    blocks = ent['blocks']
    text = ' '.join(b['text'] for b in blocks)
    ids = [b['id'] for b in blocks]
    missing = is_missing(text)
    # Explicitly incomplete continuation blocks remain missing even when later text continues.
    if any('...' in b['text'] for b in blocks):
        missing = True
    status = 'missing' if missing else 'reference'
    signal = 'सामान्य'
    if any(w in text for w in ['घी का भाव','भाव प्रायः मौसम','दूध-दही','मिठाई का भाव']):
        signal = 'तेजी' if ('तेज' in text and 'घटते-बढ़ते' not in text) else 'मिश्रित'
    add_rule(f'{name} के ग्रह-सम्बन्ध', summary_for(name, text, len(blocks)>1), ids,
             planets_for(text), [name], signal, status, reason_for(text, missing))

commodities = []
for r in rules:
    for c in r['commodities']:
        if c not in commodities:
            commodities.append(c)

gaps = [
    'अधिकांश प्रविष्टियों में केवल ग्रह-युति/दृष्टि के नाम हैं; exact कोण, दृष्टि-प्रकार, राशि/नक्षत्र, दिशा, प्रभाव-बल और समय-सीमा नहीं दी गई।',
    'तेजी/मंदी का अर्थ chapter-level संकेत में बताया गया है, पर वस्तु-वार सूची में प्रत्येक ग्रह-संबंध का polarity या परिमाण नहीं दिया गया।',
    'एल्यूमिनियम, कार-मोटर, गेहूँ, चावल, जौ, टोन, तांबा, मशीनरी और रुई जैसी सूचियाँ एलिप्सिस/अगले ब्लॉक पर निर्भर हैं; OCR-अस्पष्ट प्रविष्टियाँ भी हैं।',
    'मौसम, विवाह, मेले और उत्सव वाले संकेतों में औपचारिक तारीख, अवधि या मौसम-ट्रिगर नहीं है; इन्हें computable नहीं बनाया गया।',
    'कई वस्तुएँ केवल दूसरी प्रविष्टि की ओर cross-reference हैं; referenced rule को यहां स्वतंत्र रूप से दोहराया नहीं गया।',
    'इस सेक्शन में कोई स्पष्ट राशि, नक्षत्र, तिथि, वार, वक्री, longitude या western numerical angle शर्त नहीं दी गई।'
]
review = {
    'id': '10',
    'title': 'पाश्चात्य दूसरा प्रकरण',
    'summary': 'इस प्रकरण में वस्तुओं और ग्रहों के कथित संबंधों की लंबी सूची है। अधिकांश नियम केवल ग्रह-युति/दृष्टि के reference संकेत हैं; दिशा, कोण, राशि और समय-सीमा के अभाव में उन्हें computable नहीं किया गया। मौसम/उत्सव आधारित भाव-परिवर्तन और cross-reference प्रविष्टियाँ भी दर्ज की गई हैं, जबकि एलिप्सिस या OCR-अस्पष्ट अंश missing रखे गए हैं।',
    'commodities': commodities,
    'gaps': gaps,
    'rules': rules
}
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(review, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'path': str(out), 'rules': len(rules), 'commodities': len(commodities)}, ensure_ascii=False))
