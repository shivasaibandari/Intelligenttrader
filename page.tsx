"use client";
import { useEffect, useState } from "react";
import { Activity, BellRing, ChartNoAxesCombined, ShieldAlert, Waves } from "lucide-react";
import type { OptionQuote, Underlying } from "@/types/market";
import { MockMarketDataProvider } from "@/lib/providers/mock-provider";

const provider = new MockMarketDataProvider();
const expiry = "DEMO-EXPIRY";
export default function Home() {
  const [underlying, setUnderlying] = useState<Underlying>("NIFTY");
  const [tab, setTab] = useState("chain");
  const [chain, setChain] = useState<OptionQuote[]>([]);
  useEffect(() => { let active = true; provider.getOptionChain(underlying, expiry).then(items => { if (active) setChain(items); }); return () => { active = false; }; }, [underlying]);
  const centre = underlying === "NIFTY" ? 25100 : underlying === "BANKNIFTY" ? 56800 : 82100;
  const calls = chain.filter(x => x.optionType === "CE");
  const puts = chain.filter(x => x.optionType === "PE");
  return <main className="shell">
    <header className="topbar"><div><div className="brand">Options Intelligence</div><div className="sub">Indian index derivatives · decision support workstation</div></div><span className="pill">DEMO MODE · NOT LIVE DATA</span></header>
    <div className="toolbar"><select aria-label="Select underlying" value={underlying} onChange={e => setUnderlying(e.target.value as Underlying)}><option value="NIFTY">NIFTY 50</option><option value="BANKNIFTY">BANK NIFTY</option><option value="SENSEX">SENSEX</option></select>{[["chain","Option chain"],["signals","Signal engine"],["alerts","Alerts"],["risk","Risk & Greeks"]].map(([id,label]) => <button key={id} className={tab===id?"active":""} onClick={() => setTab(id)}>{label}</button>)}</div>
    <section className="grid">
      {[
        {name:"NIFTY 50", value:"25,100.00", change:"+0.42%", cls:"positive"},
        {name:"BANK NIFTY", value:"56,800.00", change:"−0.18%", cls:"negative"},
        {name:"SENSEX", value:"82,100.00", change:"+0.21%", cls:"positive"},
        {name:"Feed health", value:"DEMO", change:"Live feed disconnected", cls:"neutral"}
      ].map(x => <div className="panel span-3" key={x.name}><div className="label">{x.name}</div><div className="value">{x.value}</div><div className={x.cls}>{x.change}</div></div>)}
      <div className="panel span-8"><div className="panel-title"><ChartNoAxesCombined size={17} style={{display:"inline",verticalAlign:"middle",marginRight:8}}/> {tab === "chain" ? `${underlying} option chain` : tab === "signals" ? "Signal engine" : tab === "alerts" ? "Alert centre" : "Risk & Greeks"}</div>
        {tab === "chain" && <><div className="small" style={{marginBottom:12}}>Illustrative strike ladder only. Live expiry metadata and prices are not connected.</div><div className="table-wrap"><table><thead><tr><th>Call OI</th><th>CE LTP</th><th>Strike</th><th>PE LTP</th><th>Put OI</th><th>IV (CE/PE)</th></tr></thead><tbody>{calls.map((c,i) => { const p=puts[i]; return <tr key={c.instrumentKey}><td>{c.oi?.toLocaleString("en-IN")}</td><td>{c.ltp?.toFixed(2)}</td><td style={{fontWeight:700,color:c.strike===centre?"#f2ce7a":undefined}}>{c.strike.toLocaleString("en-IN")}</td><td>{p?.ltp?.toFixed(2)}</td><td>{p?.oi?.toLocaleString("en-IN")}</td><td>{c.iv?.toFixed(1)} / {p?.iv?.toFixed(1)}</td></tr>})}</tbody></table></div></>}
        {tab === "signals" && <><div className="row"><span>Directional score</span><strong className="neutral">Not evaluated</strong></div><div className="row"><span>Market regime</span><strong>Awaiting live candles</strong></div><div className="row"><span>Derivatives confirmation</span><strong>Unavailable in demo mode</strong></div><p className="small">Signals will remain blocked until provider data is connected, timestamps are validated and the required independent components are available.</p></>}
        {tab === "alerts" && <><div className="row"><span><BellRing size={15} style={{display:"inline",marginRight:8}}/>Breakout confirmation</span><span className="neutral">Not armed</span></div><div className="row"><span><Activity size={15} style={{display:"inline",marginRight:8}}/>OI positioning shift</span><span className="neutral">Not armed</span></div><div className="row"><span><Waves size={15} style={{display:"inline",marginRight:8}}/>IV shock</span><span className="neutral">Not armed</span></div><p className="small">Alert delivery is not implemented in this starter. Configure thresholds only after data-source validation.</p></>}
        {tab === "risk" && <><div className="row"><span>Delta / Gamma</span><strong>Illustrative only</strong></div><div className="row"><span>Theta / Vega</span><strong>Illustrative only</strong></div><div className="row"><span>Spread and liquidity checks</span><strong>Unavailable</strong></div><p className="small">Greeks and contract risk must be validated against the selected provider before use.</p></>}
      </div>
      <div className="panel span-4"><div className="panel-title"><ShieldAlert size={17} style={{display:"inline",verticalAlign:"middle",marginRight:8}}/>System status</div><div className="row"><span>Provider</span><strong>Mock adapter</strong></div><div className="row"><span>Quote freshness</span><strong className="negative">Stale / demo</strong></div><div className="row"><span>Historical chain snapshots</span><strong>Not verified</strong></div><div className="row"><span>Trade execution</span><strong>Disabled</strong></div><p className="small">No broker credentials are used. This dashboard does not provide real-time signals or trading recommendations.</p></div>
      <div className="panel span-12"><div className="panel-title">Build status</div><div className="grid"><div className="span-4"><div className="label">Implemented in starter</div><p>Provider interface, mock option-chain fixture, typed market data, basic signal-score helper and positioning heuristic.</p></div><div className="span-4"><div className="label">Next integration work</div><p>OAuth/backend session, provider adapter, live feed normalisation, PostgreSQL persistence and data-health checks.</p></div><div className="span-4"><div className="label">Not yet implemented</div><p>Historical chain capture, backtest engine, push notifications, production Greeks validation and paper-trade accounting.</p></div></div></div>
    </section>
    <footer className="foot">For development and UI evaluation only. Demo values are synthetic and must not be used to make trading decisions. Options involve substantial risk.</footer>
  </main>;
}
