import { AlertTriangle, CheckCircle2, CircleDashed } from 'lucide-react';
import { masterRuleSummary } from '../lib/masterRules';
import type { AstroSnapshot } from '../lib/astro';

export default function MasterRulesPanel({snapshot}:{snapshot:AstroSnapshot|null}) {
 const {rules,active}=masterRuleSummary(snapshot);
 const icon=(status:string)=>status==='active'?<CheckCircle2 size={18}/>:status==='watch'?<CircleDashed size={18}/>:<AlertTriangle size={18}/>;
 return <section className="panel master-rules-panel"><div className="section-title"><div><div className="eyebrow">MASTER CHECKLIST → STRUCTURED RULES</div><h2>वर्तमान समय पर लागू नियम</h2></div><span className="tag">{active.length} active · {rules.length} checks</span></div><p className="note">पasted checklist के 7 core checks को deterministic current-time rules में बदला गया है। ये research signals हैं, guaranteed price prediction या निवेश सलाह नहीं।</p>{snapshot?<div className="master-rule-grid">{rules.map(rule=><article className={`master-rule-card ${rule.status} ${rule.signal}`} key={rule.id}><div className="master-rule-head"><span className="master-rule-icon">{icon(rule.status)}</span><div><h3>{rule.title}</h3><span className="master-status">{rule.status==='active'?'अभी active':rule.status==='watch'?'watch / context':'inactive'}</span></div></div><p><strong>शर्त:</strong> {rule.condition}</p><p><strong>Evidence:</strong> {rule.evidence}</p><p className="master-interpretation"><strong>फल-संकेत:</strong> {rule.interpretation}</p><small>{rule.source}</small></article>)}</div>:<div className="empty compact"><h3>पहले तारीख, समय और स्थान लागू करें</h3><p>फिर यही checklist current planetary snapshot पर evaluate होगी।</p></div>}</section>;
}
