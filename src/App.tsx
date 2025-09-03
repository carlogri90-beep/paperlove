import React, { useMemo, useState, useEffect } from 'react'

function toKey(y: number, m: number) { const mm = String(m).padStart(2, '0'); return y + '-' + mm; }
function toLabel(y: number, m: number) { const ms = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']; return ms[m-1] + '-' + String(y).slice(2); }
function monthRange(start: {y:number;m:number}, end: {y:number;m:number}){
  const out: {key:string; label:string; y:number; m:number}[] = [];
  let y = start.y, m = start.m;
  while (y < end.y || (y === end.y && m <= end.m)) { out.push({ key: toKey(y,m), label: toLabel(y,m), y, m }); m++; if (m===13){ m=1; y++; } }
  return out;
}
function compareKeyISO(a:string,b:string){ return a.localeCompare(b); }
function eur(n:number){ return new Intl.NumberFormat('it-IT', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0}).format(n); }
function max0(n:number){ return n>0?n:0; }

interface Row {
  key:string; label:string;
  revenue:number; incassi:number;
  costiVar:number; usoMag:number; acquistiNec:number; extraMin:number;
  pagSubito:number; pagDiffScaduti:number; diffNuovi:number;
  fixed:number; initDebt:number; costiForn:number; uscite:number; saldo:number; cum:number;
  magFinale:number;
}

export default function App(){
  const months = useMemo(()=> monthRange({y:2025,m:9},{y:2026,m:12}), []);

  const [initialCash, setInitialCash] = useState<number>(5000);
  const [margin, setMargin] = useState<number>(35);
  const costVarPct = 100 - margin;
  const [initialInventory, setInitialInventory] = useState<number>(70000);
  const [monthlyInventoryUse, setMonthlyInventoryUse] = useState<number>(7000);
  const [minPurchase, setMinPurchase] = useState<number>(5000);
  const [minPurchaseMonthsText, setMinPurchaseMonthsText] = useState<string>('Set-25, Ott-25');
  const [termsCutoff, setTermsCutoff] = useState<string>('2025-12');
  const [upfrontBefore, setUpfrontBefore] = useState<number>(60);
  const [deferredBefore, setDeferredBefore] = useState<number>(40);
  const [upfrontAfter, setUpfrontAfter] = useState<number>(10);
  const [deferredAfter, setDeferredAfter] = useState<number>(90);
  const [collectionLag, setCollectionLag] = useState<number>(1);

  const defaultRevenue: Record<string,number> = useMemo(()=>{
    const r: Record<string,number> = {}; months.forEach(({key})=> r[key]=120000);
    r[toKey(2025,9)] = 20000; r[toKey(2025,10)] = 20000; return r;
  }, [months]);
  const [revenue, setRevenue] = useState<Record<string,number>>(defaultRevenue);

  const defaultFixed: Record<string,number> = useMemo(()=>{
    const c: Record<string,number> = {}; months.forEach(({key})=> c[key]=25000);
    c[toKey(2025,9)] = 12000; c[toKey(2025,10)] = 12000; c[toKey(2025,11)] = 17000; c[toKey(2025,12)] = 17000; return c;
  }, [months]);
  const [fixedCosts, setFixedCosts] = useState<Record<string,number>>(defaultFixed);

  const defaultInitDebt: Record<string,number> = useMemo(()=>{
    const d: Record<string,number> = {}; months.forEach(({key})=> d[key]=0);
    d[toKey(2025,9)] = 13000; d[toKey(2025,10)] = 13000; d[toKey(2025,11)] = 13000; d[toKey(2025,12)] = 13000; d[toKey(2026,1)] = 13000; return d;
  }, [months]);
  const [initDebt, setInitDebt] = useState<Record<string,number>>(defaultInitDebt);

  const [extraReceipts, setExtraReceipts] = useState<Record<string,number>>({ [toKey(2025,9)]: 5000 });

  const results = useMemo<Row[]>(()=>{
    const receivables: Record<string,number> = {}; months.forEach(({key})=> receivables[key]=0);
    months.forEach(({key}, idx)=>{ const t = idx + collectionLag; if (t < months.length){ receivables[months[t].key] += (revenue[key]||0); } });

    const deferredDue: Record<string,number> = {}; months.forEach(({key})=> deferredDue[key]=0);

    const labelToKey = (label:string)=>{ const map:Record<string,number>={Gen:1,Feb:2,Mar:3,Apr:4,Mag:5,Giu:6,Lug:7,Ago:8,Set:9,Ott:10,Nov:11,Dic:12}; const parts=label.trim().split('-'); if(parts.length!=2) return label; const m=map[parts[0] as keyof typeof map]; const y=2000+Number(parts[1]); return m? toKey(y,m):label; };
    const minMonths = new Set(minPurchaseMonthsText.split(',').map(s=>s.trim()).filter(Boolean).map(labelToKey));

    let inventory = initialInventory; let cum = initialCash;
    const rows: Row[] = [];

    months.forEach(({key,label}, idx)=>{
      const fat = revenue[key] || 0;
      const inc = (receivables[key]||0) + (extraReceipts[key]||0);

      const costiVar = fat * (costVarPct/100);
      const usoMag = Math.min(monthlyInventoryUse, Math.max(inventory,0));
      inventory -= usoMag;

      const acquistiNec = max0(costiVar - usoMag);
      const minReq = minMonths.has(key) ? minPurchase : 0;
      const extraMin = max0(minReq - acquistiNec);
      if (extraMin > 0) inventory += extraMin;

      const acquistiTot = acquistiNec + extraMin;

      const regime1 = compareKeyISO(key, termsCutoff) <= 0;
      const pctUp = (regime1? upfrontBefore: upfrontAfter)/100;
      const pctDf = (regime1? deferredBefore: deferredAfter)/100;

      const pagSubito = acquistiTot * pctUp;
      const diffNuovi = acquistiTot * pctDf;
      const t = idx + 3; if (t < months.length){ deferredDue[months[t].key] += diffNuovi; }
      const pagDiffScaduti = deferredDue[key] || 0;

      const fixed = fixedCosts[key] || 0;
      const initD = initDebt[key] || 0;
      const costiForn = pagSubito + pagDiffScaduti;
      const uscite = fixed + initD + costiForn;
      const saldo = inc - uscite;
      cum += saldo;

      rows.push({ key,label, revenue:fat, incassi:inc, costiVar, usoMag, acquistiNec, extraMin, pagSubito, pagDiffScaduti, diffNuovi, fixed, initDebt:initD, costiForn, uscite, saldo, cum, magFinale:inventory });
    });

    return rows;
  }, [months, revenue, fixedCosts, initDebt, extraReceipts, collectionLag, monthlyInventoryUse, initialInventory, initialCash, costVarPct, minPurchase, minPurchaseMonthsText, upfrontBefore, deferredBefore, upfrontAfter, deferredAfter, termsCutoff]);

  const totals2026 = useMemo(()=>{
    const rows = results.filter(r=> r.label.endsWith('-26'));
    const sum = (k: keyof Row) => rows.reduce((a,b)=> a + (b[k] as number), 0);
    return { incassi:sum('incassi'), fissi:sum('fixed'), debitoInit:sum('initDebt'), costiForn:sum('costiForn'), uscite:sum('uscite'), saldo:sum('saldo') };
  }, [results]);

  const csvHref = useMemo(()=>{
    const head = ['Mese','Esito','Incassi','Costi fissi','Debito iniziale','Costi fornitori','Uscite','Saldo netto','Cumulato'].join(',');
    const body = results.map(r => [r.label,(r.saldo>=0?'OK':'NEG'),Math.round(r.incassi),Math.round(r.fixed),Math.round(r.initDebt),Math.round(r.costiForn),Math.round(r.uscite),Math.round(r.saldo),Math.round(r.cum)].join(',')).join('\n');
    const csv = head + '\n' + body;
    return 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  }, [results]);

  useEffect(()=>{
    console.assert(months.length === 16, 'Attesi 16 mesi');
    console.assert(csvHref.includes('%0A'), 'CSV dovrebbe contenere newline codificato');
  }, [months, csvHref]);

  const setRevenueMonth = (key:string, val:number)=> setRevenue(p=> ({...p, [key]: val}));
  const setFixedMonth = (key:string, val:number)=> setFixedCosts(p=> ({...p, [key]: val}));
  const setDebtMonth = (key:string, val:number)=> setInitDebt(p=> ({...p, [key]: val}));

  const resetDefaults = ()=>{
    setInitialCash(5000); setMargin(35); setInitialInventory(70000); setMonthlyInventoryUse(7000);
    setMinPurchase(5000); setMinPurchaseMonthsText('Set-25, Ott-25');
    setTermsCutoff('2025-12'); setUpfrontBefore(60); setDeferredBefore(40); setUpfrontAfter(10); setDeferredAfter(90); setCollectionLag(1);
    const r: Record<string,number> = {}; months.forEach(({key})=> r[key]=120000); r[toKey(2025,9)]=20000; r[toKey(2025,10)]=20000; setRevenue(r);
    const c: Record<string,number> = {}; months.forEach(({key})=> c[key]=25000); c[toKey(2025,9)]=12000; c[toKey(2025,10)]=12000; c[toKey(2025,11)]=17000; c[toKey(2025,12)]=17000; setFixedCosts(c);
    const d: Record<string,number> = {}; months.forEach(({key})=> d[key]=0); d[toKey(2025,9)]=13000; d[toKey(2025,10)]=13000; d[toKey(2025,11)]=13000; d[toKey(2025,12)]=13000; d[toKey(2026,1)]=13000; setInitDebt(d);
    setExtraReceipts({ [toKey(2025,9)]: 5000 });
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Webapp Prospetto di Cassa (Set 2025 - Dic 2026)</h1>
        <div className="flex gap-2">
          <a href={csvHref} download="prospetto_cassa.csv" className="px-3 py-2 rounded-xl border shadow hover:shadow-md">CSV</a>
          <button onClick={resetDefaults} className="px-3 py-2 rounded-xl border shadow hover:shadow-md">Reset</button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="rounded-2xl shadow bg-white p-4">
          <h3 className="font-semibold mb-2">Totale 2026</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
            <Stat label="Incassi" value={totals2026.incassi} />
            <Stat label="Costi fissi" value={totals2026.fissi} />
            <Stat label="Debito iniziale" value={totals2026.debitoInit} />
            <Stat label="Costi fornitori" value={totals2026.costiForn} />
            <Stat label="Uscite" value={totals2026.uscite} />
            <Stat label="Saldo" value={totals2026.saldo} positive={totals2026.saldo>=0} />
          </div>
        </div>

        <div className="rounded-2xl shadow bg-white overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Prospetto di cassa (vista concisa)</h2>
            <div className="text-sm text-gray-600">Cumulato iniziale: <b>{eur(initialCash)}</b></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Mese</th>
                  <th className="px-3 py-2">Esito</th>
                  <th className="px-3 py-2">Incassi</th>
                  <th className="px-3 py-2">Costi fissi</th>
                  <th className="px-3 py-2">Debito iniziale</th>
                  <th className="px-3 py-2">Costi fornitori</th>
                  <th className="px-3 py-2">Uscite</th>
                  <th className="px-3 py-2">Saldo</th>
                  <th className="px-3 py-2">Cumulato</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m, i) => {
                  const r = results[i];
                  const neg = r.saldo < 0; const cumNeg = r.cum < 0;
                  return (
                    <tr key={r.key} className="border-t">
                      <td className="px-3 py-2 font-medium">{r.label}</td>
                      <td className="px-3 py-2">{r.saldo>=0 ? <span className="text-green-600">🟢</span> : <span className="text-red-600">🔴</span>}</td>
                      <td className="px-3 py-2">{eur(r.incassi)}</td>
                      <td className="px-3 py-2">{eur(r.fixed)}</td>
                      <td className="px-3 py-2">{eur(r.initDebt)}</td>
                      <td className="px-3 py-2">{eur(r.costiForn)}</td>
                      <td className="px-3 py-2">{eur(r.uscite)}</td>
                      <td className={"px-3 py-2 " + (neg?"bg-red-50 text-red-700":"bg-green-50 text-green-700")}>{eur(r.saldo)}</td>
                      <td className={"px-3 py-2 " + (cumNeg?"bg-amber-50 text-amber-700":"bg-cyan-50 text-cyan-700")}>{eur(r.cum)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl shadow bg-white space-y-3">
          <h2 className="font-semibold text-lg">Parametri economici</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">Cassa iniziale
              <input type="number" value={initialCash} onChange={e=>setInitialCash(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <label className="flex flex-col text-sm">Margine (%)
              <input type="number" value={margin} onChange={e=>setMargin(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <div className="col-span-2 text-xs text-gray-600">Costi variabili: <b>{(100 - margin).toFixed(0)}%</b> del fatturato</div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <label className="flex flex-col text-sm">Magazzino iniziale
              <input type="number" value={initialInventory} onChange={e=>setInitialInventory(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <label className="flex flex-col text-sm">Consumo magazzino (€/mese)
              <input type="number" value={monthlyInventoryUse} onChange={e=>setMonthlyInventoryUse(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <label className="flex flex-col text-sm">Lag incassi (mesi)
              <input type="number" value={collectionLag} onChange={e=>setCollectionLag(Math.max(0, Number(e.target.value)||0))} className="mt-1 border rounded px-3 py-2" />
            </label>
          </div>
        </div>

        <div className="p-4 rounded-2xl shadow bg-white space-y-3">
          <h2 className="font-semibold text-lg">Fornitori & acquisti</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col text-sm">Acquisto minimo (€/mese)
              <input type="number" value={minPurchase} onChange={e=>setMinPurchase(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <label className="flex flex-col text-sm">Mesi con minimo (es. "Set-25, Ott-25")
              <input type="text" value={minPurchaseMonthsText} onChange={e=>setMinPurchaseMonthsText(e.target.value)} className="mt-1 border rounded px-3 py-2" />
            </label>
          </div>
          <div className="grid grid-cols-4 gap-3 pt-2 text-sm">
            <div className="col-span-4 font-medium">Condizioni pagamento fornitori</div>
            <label className="flex flex-col">Cutoff regime 1 (ISO)
              <input type="text" value={termsCutoff} onChange={e=>setTermsCutoff(e.target.value)} className="mt-1 border rounded px-3 py-2" />
              <span className="text-xs text-gray-500">Fino a questa data inclusa: regime 1</span>
            </label>
            <label className="flex flex-col">Regime 1 subito (%)
              <input type="number" value={upfrontBefore} onChange={e=>setUpfrontBefore(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <label className="flex flex-col">Regime 1 differito (%)
              <input type="number" value={deferredBefore} onChange={e=>setDeferredBefore(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <div></div>
            <label className="flex flex-col">Regime 2 subito (%)
              <input type="number" value={upfrontAfter} onChange={e=>setUpfrontAfter(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
            <label className="flex flex-col">Regime 2 differito (%)
              <input type="number" value={deferredAfter} onChange={e=>setDeferredAfter(Number(e.target.value)||0)} className="mt-1 border rounded px-3 py-2" />
            </label>
          </div>
        </div>
      </section>

      <section className="p-4 rounded-2xl shadow bg-white space-y-3">
        <h2 className="font-semibold text-lg">Editor mensile (Fatturato · Costi fissi · Debito iniziale)</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 text-sm">
          {months.map(({key,label})=> (
            <div key={key} className="p-3 rounded-xl border">
              <div className="font-medium mb-2">{label}</div>
              <label className="flex flex-col">Fatturato
                <input type="number" value={revenue[key]||0} onChange={e=>setRevenueMonth(key, Number(e.target.value)||0)} className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col mt-2">Costi fissi
                <input type="number" value={fixedCosts[key]||0} onChange={e=>setFixedMonth(key, Number(e.target.value)||0)} className="mt-1 border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col mt-2">Debito iniziale
                <input type="number" value={initDebt[key]||0} onChange={e=>setDebtMonth(key, Number(e.target.value)||0)} className="mt-1 border rounded px-2 py-1" />
              </label>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">Regole: Costi variabili = Fatturato x {(100 - margin).toFixed(0)}%. Consumo magazzino fisso mensile fino a esaurimento. Acquisto minimo nei mesi indicati (l'extra va a magazzino). Fornitori: regime 1 fino a {termsCutoff} (subito {upfrontBefore}% / differito {deferredBefore}%), poi regime 2 (subito {upfrontAfter}% / differito {deferredAfter}%). Differiti a 90gg. Incassi = fatturato con lag di {collectionLag} mese/i + extra.</p>
    </div>
  );
}

function Stat({label, value, positive}:{label:string; value:number; positive?:boolean}){
  return (
    <div className={'p-3 rounded-xl border ' + (positive===undefined?'': (positive?'bg-green-50 text-green-700':'bg-red-50 text-red-700'))}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-semibold">{eur(value)}</div>
    </div>
  )
}
