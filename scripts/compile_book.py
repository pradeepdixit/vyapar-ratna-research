import json, pathlib, re, collections
ROOT=pathlib.Path(__file__).resolve().parents[1]
blocks=json.load(open(ROOT/'research/blocks.json'))
manifest=json.load(open(ROOT/'research/sections.json'))
lookup={b['id']:b for b in blocks}
rules=[];sections=[];errors=[]
audit_path=ROOT/'research/validation.json'
audit=json.load(open(audit_path)) if audit_path.exists() else {}
downgrade_ids=set(audit.get('downgrade_ids',[]))
valid_types={'sign','nakshatra','retrograde','same_sign','angle','weekday','tithi','relative_sign','longitude_range','pada'}
canonical_planets={'सूर्य','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु','यूरेनस','नेपच्यून','प्लूटो'}
alias={'चन्द्र':'चंद्रमा','चंद्र':'चंद्रमा','चन्द्रमा':'चंद्रमा','बृहस्पति':'गुरु','वृहस्पति':'गुरु','स्वर्ण':'सोना','सुवर्ण':'सोना','चांदी':'चाँदी','कपास':'रुई','रूई':'रुई','गेहूं':'गेहूँ'}
def canon(x):return alias.get(x.strip(),x.strip())
for item in manifest:
 for b in blocks[item['start']:item['end']]:b['section']=item['id']
 path=ROOT/f"research/reviews/{item['id']}.json"
 if not path.exists():sections.append({'id':item['id'],'title':item['name'],'summary':'इस भाग की समीक्षा अभी लंबित है।','gaps':['समीक्षा लंबित'],'rule_count':0,'block_count':item['end']-item['start']});continue
 d=json.load(open(path))
 count=0
 for idx,r in enumerate(d.get('rules',[]),1):
  r['id']=f"R{item['id']}-{idx:03d}"
  r['section']=item['id'];r['source_ids']=list(dict.fromkeys(r.get('source_ids',[])))
  if not r['source_ids'] or any(i not in lookup for i in r['source_ids']):errors.append(r['id']+' invalid source IDs');continue
  if any(not item['start']<=int(i[1:])<item['end'] for i in r['source_ids']):errors.append(r['id']+' source outside assigned section');continue
  for k in ['title','summary','reason','timeframe','signal']:r.setdefault(k,'अनिर्दिष्ट' if k=='timeframe' else '')
  r['planets']=list(dict.fromkeys(canon(str(x)) for x in r.get('planets',[])))
  r['commodities']=list(dict.fromkeys(canon(str(x)) for x in r.get('commodities',[])))
  r['conditions']=r.get('conditions',[]) or []
  for c in r['conditions']:
   for k in ['planet','other']:
    if k in c:c[k]=canon(c[k])
  if r.get('status') not in ['computable','reference','missing']:r['status']='reference'
  def valid(c):
   t=c.get('type')
   if t not in valid_types:return False
   if t not in ['weekday','tithi'] and c.get('planet') not in canonical_planets:return False
   if t in ['same_sign','angle','relative_sign'] and c.get('other') not in canonical_planets:return False
   if t=='retrograde':return isinstance(c.get('value'),bool)
   if t=='angle':return isinstance(c.get('value'),(int,float)) and isinstance(c.get('orb'),(int,float)) and 0<=c['value']<=180 and 0<=c['orb']<=10
   if t=='longitude_range':return isinstance(c.get('min'),(int,float)) and isinstance(c.get('max'),(int,float)) and 0<=c['min']<c['max']<=360
   if t=='same_sign':return True
   bounds={'sign':(0,11),'nakshatra':(0,26),'weekday':(0,6),'tithi':(1,30),'relative_sign':(1,12),'pada':(1,4)}
   lo,hi=bounds[t];return bool(c.get('values')) and all(isinstance(v,int) and lo<=v<=hi for v in c['values'])
  if r['status']=='computable' and (not r['conditions'] or not all(valid(c) for c in r['conditions'])):
   r['status']='reference';r['reason']+=' — गणना schema अधूरा; स्वचालित परिणाम से बाहर।';errors.append(r['id']+' downgraded condition schema')
  if r['id'] in downgrade_ids:
   r['status']='reference'
   r['conditions']=[]
   r['reason']+=' — स्रोत audit: उदय/अस्त, अतिरिक्त राशि या दूसरी आवश्यक शर्त पूरी तरह encode नहीं है; automatic matching से बाहर।'
  rules.append(r);count+=1
 sections.append({'id':item['id'],'title':d.get('title',item['name']),'summary':d.get('summary',''),'gaps':d.get('gaps',[]),'rule_count':count,'block_count':item['end']-item['start']})
review_path=ROOT/'research/review-summary.json'
review=json.load(open(review_path)) if review_path.exists() else {'title':'व्यापार रत्न — supplied पुस्तक की समीक्षा','overview':'सभी पदार्थों और ग्रहों का स्रोत-संबद्ध अध्ययन। प्रकरण-वार समीक्षा चल रही है।','limitations':['मूल scan के बजाय supplied Word compilation।','केवल स्पष्ट और encoded शर्तों की automatic जाँच।','मूल पुस्तक के financial दावों की पुष्टि नहीं की गई है।']}
stats={'totalBlocks':len(blocks),'tables':sum(b['type']=='tbl' for b in blocks),'rules':len(rules),'computable':sum(r['status']=='computable' for r in rules),'missing':sum(r['status']=='missing' for r in rules),'reviewedSections':sum((ROOT/f"research/reviews/{i['id']}.json").exists() for i in manifest),'totalSections':len(manifest),'sourceCharacters':sum(len(b['text']) for b in blocks)}
commodities=sorted(set(x for r in rules for x in r['commodities']))
planetorder=['सूर्य','चंद्रमा','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु','यूरेनस','नेपच्यून','प्लूटो']
review['overview']=re.sub(r'1[,，]?778',f"{stats['rules']:,}",review.get('overview',''))
review['overview']+=f" अंतिम compiled संग्रह: {stats['rules']:,} नियम/संदर्भ, {stats['computable']} automatic शर्त-जाँच, {stats['missing']} missing प्रविष्टियाँ।"
data={'rules':rules,'blocks':blocks,'sections':sections,'commodities':commodities,'planets':planetorder,'review':review,'stats':stats}
json.dump(data,open(ROOT/'public/book-data.json','w'),ensure_ascii=False,separators=(',',':'))
json.dump({'stats':stats,'errors':errors},open(ROOT/'research/compile-status.json','w'),ensure_ascii=False,indent=2)
print(json.dumps(stats,ensure_ascii=False));print('Compiler notices:',len(errors));print('Commodities:',len(commodities))
