import json, re
from pathlib import Path

src = Path('/home/ubuntu/astrominute/research/sections/06.json')
out = Path('/home/ubuntu/astrominute/research/reviews/06.json')
blocks = json.loads(src.read_text())

# Non-rule editorial blocks.
def editorial(t):
    return t.startswith('[Page') or t == 'व्यापार रत्न' or 'पदार्थों के परीक्षित' in t

# Keep all predictive/useful paragraph blocks and join page-split continuations.
items = []
pending_text = None
pending_ids = []
for b in blocks:
    t = b.get('text','').strip()
    if b.get('type') != 'p' or editorial(t) or b.get('id') == 'B01525':
        continue
    if pending_text is not None:
        if t.startswith('...'):
            pending_text = pending_text.rstrip('.') + ' ' + t.lstrip('.')
            pending_ids.append(b['id'])
            if not pending_text.rstrip().endswith('...'):
                items.append({'ids':pending_ids[:], 'text':pending_text})
                pending_text = None; pending_ids=[]
            continue
        # A non-editorial paragraph after an unfinished block is its continuation only
        # when the previous block explicitly ended in an ellipsis.
        items.append({'ids':pending_ids[:], 'text':pending_text})
        pending_text = None; pending_ids=[]
    if t.endswith('...'):
        pending_text = t
        pending_ids = [b['id']]
    else:
        items.append({'ids':[b['id']], 'text':t})
if pending_text is not None:
    items.append({'ids':pending_ids[:], 'text':pending_text})

planets = ['सूर्य','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु','यूरेनस','नेपच्यून','प्लूटो']
planet_alias = {'चन्द्र':'चंद्रमा','रवि':'सूर्य','हर्शल':'यूरेनस'}
planet_pat = r'(?:सूर्य|चन्द्र|चंद्रमा|रवि|मंगल|बुध|गुरु|शुक्र|शनि|राहु|केतु|हर्शल|यूरेनस|नेपच्यून|प्लूटो)'

signs = {'मेष':0,'वृषभ':1,'मिथुन':2,'कर्क':3,'सिंह':4,'कन्या':5,'तुला':6,'वृश्चिक':7,'धनु':8,'मकर':9,'कुम्भ':10,'कुंभ':10,'मीन':11}
naks = ['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिर','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्वाफाल्गुनी','उत्तराफाल्गुनी','हस्त','चित्रा','स्वाति','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्वाषाढ़ा','उत्तराषाढ़ा','श्रवण','धनिष्ठा','शतभिषा','पूर्वाभाद्रपद','उत्तराभाद्रपद','रेवती']
# common orthographic variants
nak_index = {}
for i,n in enumerate(naks):
    nak_index[n]=i
    nak_index[n.replace('फाल्गुनी','ाफाल्गुनी')]=i
nak_index.update({'मृगशिरा':4,'मृग-शिर':4,'पूर्वा फाल्गुनी':10,'पूर्वा-भाद्रपद':24,'उत्तरा-भाद्रपद':25})

commodity_alias = [
 ('आर्डिनरी','साधारण शेयर'),('आयरन-शेयर्स','आयरन-शेयर्स'),('आयरन शेयर्स','आयरन-शेयर्स'),
 ('सोने','सोना'),('सोना','सोना'),('चांदी','चाँदी'),('चाँदी','चाँदी'),('रुई','रुई'),('कपास','कपास'),('जूट','जूट'),('पाट','पाट'),('बारदाना','बारदाना'),('हैसियन','हैसियन'),('सूत','सूत'),('सन','सन'),('रेशम','रेशम'),('बोरे','बोरे'),('सूत्र','सूत्र'),
 ('गुड़','गुड़'),('खांड','खांड'),('ग्वार','ग्वार'),('घृत','घृत'),('तेल','तेल'),('तिलहन','तिलहन'),('तिल','तिल'),('सरसों','सरसों'),('अलसी','अलसी'),('अरण्डी','अरण्डी'),('मूंगफली','मूंगफली'),
 ('गेहूँ','गेहूँ'),('गेहूं','गेहूँ'),('जौ','जौ'),('चना','चना'),('मटर','मटर'),('अरहर','अरहर'),('उरद','उरद'),('मूंग','मूंग'),('मक्का','मक्का'),('बाजरा','बाजरा'),('धान्य','धान्य'),('गल्ला','गल्ला'),('रसादि पदार्थ','रसादि पदार्थ'),('धातु','धातु'),('तृण','तृण'),('व्यापारिक वस्तु','व्यापारिक वस्तुएँ'),('वस्तु-मात्र','सामान्य बाजार'),('बाज़ार','सामान्य बाजार'),('बाजार','सामान्य बाजार'),('वर्षा','वर्षा'),('अनावृष्टि','अनावृष्टि'),('अति-वृष्टि','अतिवृष्टि'),('उपद्रव','सामाजिक उपद्रव')]

def canonical_planets(t):
    # Weekday compounds such as मंगलवार/गुरुवार are not planet mentions.
    t = re.sub(r'रविवार|सोमवार|मंगलवार|बुधवार|गुरुवार|शुक्रवार|शनिवार|चन्द्रवार', ' ', t)
    found=[]
    for raw,canon in planet_alias.items():
        if raw in t and canon not in found: found.append(canon)
    for p in planets:
        if p in t and p not in found: found.append(p)
    return [p for p in planets if p in found]

def commodities(t):
    found=[]
    for raw,canon in commodity_alias:
        if raw in t and canon not in found: found.append(canon)
    # Keep market applicability explicit when no named commodity appears.
    if not found:
        found=['सामान्य बाजार']
    return found

def signal(t):
    has_up = 'तेजी' in t
    has_down = 'मंदी' in t
    has_mix = any(x in t for x in ['घटा-बढ़ी','दुतरफ़ा','दुतरफा','घट-बढ़','पहले तेजी बाद में मंदी','बाद में मंदी','बाद में तेजी'])
    if has_up and has_down or has_mix: return 'मिश्रित'
    if has_up: return 'तेजी'
    if has_down: return 'मंदी'
    if 'वृष्टि' in t or 'वर्षा' in t or 'दुभिक्ष' in t or 'अनावृष्टि' in t: return 'वर्षा'
    return 'अन्य'

def timeframe(t):
    if any(x in t for x in ['६ मास','६ महीने','एक वर्ष','लगभग एक वर्ष','वार्षिक','सम्वत्सर','वर्ष मंदी','उस वर्ष']): return 'वार्षिक'
    if any(x in t for x in ['५-६ मास','२-३ मास','मास तक','मास में','उस मास','किसी मास','मासिक']): return 'मासिक'
    if any(x in t for x in ['१५ दिन','पंद्रह दिन','पाक्षिक']): return 'पाक्षिक'
    if 'साप्ताहिक' in t: return 'साप्ताहिक'
    if any(x in t for x in ['दिन तक','४ दिन','दैनिक']): return 'दैनिक'
    if any(x in t for x in ['जिस क्षण','प्रवेश करते ही','उदय होगा तब से','होते ही']): return 'क्षणिक'
    return 'अनिर्दिष्ट'

# Conditions are deliberately conservative: only the exact allowed DSL is emitted.
forbidden = ['वेध','दृष्टि','इत्थशाल','कूट-योग','योग','युति','प्रतियुति','संक्रांति','ग्रहण','तिथि','वार','नक्षत्र','अमावास्या','पूर्णिमा','पक्ष','मास','वर्ष','मुहूर्ती','मुहूर्त','उदय','अस्त','दिशा','प्रवेश','परिभ्रमण','गति','शीघ्र','मंदगति','मंदगामी','अंश','क्षय','वृद्धि','रंग','वर्ण','शुभ','पाप','क्रूर','सौम्य','बलवान','किसी','अथवा','या','यदि','जब','तथा','और','साथ','आगे','पीछे','पहले','बाद','पूर्व','पश्चिम','उत्तर','दक्षिण','पूर्ण','एकत्र','एक साथ','समीप','लम्बी अवधि','दुतरफ़ा','घटा-बढ़ी','चांस','दुभिक्ष','अशांति','उपद्रव','संभावना','सम्भावना']

def make_conditions(t):
    # Reject any unsupported or disjunctive/temporal wording.
    if any(x in t for x in forbidden): return None
    cond=[]
    # Direct retrograde, only when planet identity is explicit.
    for m in re.finditer(f'({planet_pat})\\s+वक्री', t):
        raw=m.group(1); p=planet_alias.get(raw,raw)
        cond.append({'type':'retrograde','planet':p,'value':True})
    # Direct sign placements.
    for m in re.finditer(f'({planet_pat})\\s+(?:मेष|वृषभ|मिथुन|कर्क|सिंह|कन्या|तुला|वृश्चिक|धनु|मकर|कुम्भ|कुंभ|मीन)\\s+राशि(?:गत)?', t):
        p=planet_alias.get(m.group(1),m.group(1)); s=m.group(0)
        sm=re.search(r'(मेष|वृषभ|मिथुन|कर्क|सिंह|कन्या|तुला|वृश्चिक|धनु|मकर|कुम्भ|कुंभ|मीन)',s)
        if sm: cond.append({'type':'sign','planet':p,'values':[signs[sm.group(1)]]})
    # Same-sign explicit conjunctions such as सूर्य-मंगल एक राशि में.
    if 'एक राशि में' in t:
        ps=[]
        for raw in re.findall(planet_pat,t):
            p=planet_alias.get(raw,raw)
            if p not in ps: ps.append(p)
        if len(ps)==2:
            cond.append({'type':'same_sign','planet':ps[0],'other':ps[1]})
    # A standalone retrograde statement is computable even without a sign.
    if cond and all(c['type'] in {'retrograde','sign','same_sign'} for c in cond):
        return cond
    return None

def reason(status,t):
    if status=='computable': return 'स्रोत की सभी व्यक्त शर्तें अनुमत DSL में सीधे राशि/वक्री/समान-राशि के रूप में व्यक्त की जा सकती हैं।'
    if status=='missing': return 'स्रोत-पाठ में ग्रह/शर्त का अंश अस्पष्ट या अधूरा है; faithful computation संभव नहीं।'
    return 'मूल शर्त में वेध/दृष्टि, नक्षत्र-वार, तिथि/मास, उदय-अस्त, संक्रांति, गति, अंश, lag या अन्य गैर-DSL अवधारणा है; इसलिए इसे reference रखा गया है।'

def clean(t):
    t=re.sub(r'^[-–— ]*','',t)
    t=re.sub(r'\s+',' ',t).strip()
    return t

rules=[]
for i,it in enumerate(items,1):
    t=clean(it['text'])
    sig=signal(t); comm=commodities(t); pls=canonical_planets(t); tf=timeframe(t)
    missing = '[अस्पष्ट' in t or '...' in t
    cond=[] if missing else (make_conditions(t) or [])
    status='missing' if missing else ('computable' if cond else 'reference')
    if sig=='तेजी': title=f"{', '.join(comm[:3])} में तेजी"
    elif sig=='मंदी': title=f"{', '.join(comm[:3])} में मंदी"
    elif sig=='मिश्रित': title=f"{', '.join(comm[:3])} में मिश्रित चाल"
    elif sig=='वर्षा': title=f"{', '.join(comm[:3])} और मौसम संकेत"
    else: title=f"{', '.join(comm[:3])} संबंधी बाजार संकेत"
    summary=f"पाठ में बताई गई ग्रहगत या कालगत स्थिति को {', '.join(comm[:4])} में {sig} के संकेत से जोड़ा गया है।"
    rules.append({'id':f'R06-{i:03d}','title':title,'summary':summary,'source_ids':it['ids'],'planets':pls,'commodities':comm,'timeframe':tf,'signal':sig,'status':status,'reason':reason(status,t),'conditions':cond})

all_rule_ids=set(x['id'] for x in blocks if x.get('type')=='p' and not editorial(x.get('text','')) and x.get('id')!='B01525')
covered=set(y for r in rules for y in r['source_ids'])
gaps=[]
for b in blocks:
    if b.get('id') in all_rule_ids and b.get('id') not in covered:
        gaps.append(f"{b['id']}: स्रोत ब्लॉक rule में शामिल नहीं हुआ")
for r in rules:
    if any(x in r['source_ids'] for x in ['B01847']): gaps.append('B01847: ग्रह-संयोजन में राहु/केतु पाठ अस्पष्ट है; computation नहीं किया गया।')
# Explicitly document concepts present in the section but not representable by requested DSL.
gaps += [
 'वेध, नवांश-वेध, इत्थशाल/कूट-योग, पूर्ण दृष्टि और非-पाश्चात्य दृष्टि-सम्बन्ध के लिए exact DSL उपलब्ध नहीं है।',
 'संक्रांति-विशिष्ट तिथि/वार, चन्द्र-दर्शन, अमावास्या/पूर्णिमा, मास-पक्ष, करण, मुहूर्ती, ग्रहण, उदय-अस्त-दिशा और ग्रह-गति/अंश को reference रखा गया है।',
 'कुछ स्रोत नियमों में पूर्व/पश्चात् lag, विद्यमान बाजार-दिशा, वर्षा/रंग/बल और अज्ञात ग्रह-बल हैं; इनकी faithful computable शर्त नहीं बनाई गई।'
]
# dedupe gaps
gaps=list(dict.fromkeys(gaps))
result={'id':'06','title':'पदार्थों के परीक्षित योग','summary':f'अनुभाग 06 में सोना, चाँदी, रुई, गुड़, तिलहन, धान्य, जूट-पाट, शेयर और सामान्य बाजार/वर्षा संकेतों के {len(rules)} पृथक स्रोत-आधारित नियम संकलित हैं। गैर-DSL ज्योतिषीय शर्तों को reference या missing रखा गया है।','commodities':sorted(set(c for r in rules for c in r['commodities'])), 'gaps':gaps, 'rules':rules}
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'rules':len(rules),'covered':len(covered),'expected':len(all_rule_ids),'out':str(out)},ensure_ascii=False))
