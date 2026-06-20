const services = [
  {
    title: 'Consulenza direzionale',
    text: 'Analisi dei processi, definizione degli obiettivi e piani operativi per rendere l\'organizzazione più efficiente e misurabile.',
  },
  {
    title: 'Servizi amministrativi',
    text: 'Supporto nella gestione documentale, coordinamento delle attività d\'ufficio e ottimizzazione dei flussi amministrativi.',
  },
  {
    title: 'Sviluppo commerciale',
    text: 'Affianchiamo aziende e professionisti nella costruzione di relazioni, opportunità e strategie di crescita sostenibili.',
  },
  {
    title: 'Soluzioni digitali',
    text: 'Accompagniamo la trasformazione digitale con strumenti semplici, integrazioni operative e metodo orientato ai risultati.',
  },
]

const stats = [
  { value: '4', label: 'aree di intervento' },
  { value: '100%', label: 'approccio su misura' },
  { value: '1', label: 'referente dedicato' },
]

const steps = [
  'Ascoltiamo le esigenze e fotografiamo il punto di partenza.',
  'Costruiamo una proposta chiara con priorità, tempi e responsabilità.',
  'Implementiamo le attività concordate con aggiornamenti periodici.',
  'Misuriamo i risultati e individuiamo nuove opportunità di miglioramento.',
]

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.32),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.28),_transparent_30%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col px-6 py-8 lg:px-8">
          <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
            <a href="#top" className="text-sm font-semibold tracking-[0.28em] text-cyan-200">
              DBSG SRL
            </a>
            <div className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
              <a className="transition hover:text-cyan-200" href="#servizi">Servizi</a>
              <a className="transition hover:text-cyan-200" href="#metodo">Metodo</a>
              <a className="transition hover:text-cyan-200" href="#contatti">Contatti</a>
            </div>
            <a
              className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-white"
              href="mailto:info@differentbusinessservicegroup.it"
            >
              Scrivici
            </a>
          </nav>

          <div id="top" className="grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
                Consulenza, servizi e soluzioni per imprese moderne
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Different Business Service Group SRL
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Aiutiamo aziende, imprenditori e professionisti a semplificare la gestione quotidiana, migliorare i processi e trasformare le idee in piani concreti.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  className="rounded-full bg-white px-7 py-4 text-center font-bold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-cyan-200"
                  href="#contatti"
                >
                  Richiedi una consulenza
                </a>
                <a
                  className="rounded-full border border-white/20 px-7 py-4 text-center font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-100"
                  href="#servizi"
                >
                  Scopri i servizi
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-[1.5rem] bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Business partner</p>
                <h2 className="mt-4 text-2xl font-bold">Un unico interlocutore per far crescere il tuo business.</h2>
                <p className="mt-4 leading-7 text-slate-300">
                  Dalla pianificazione alla gestione operativa: mettiamo metodo, organizzazione e competenze al servizio dei tuoi obiettivi.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                      <p className="text-3xl font-black text-cyan-200">{stat.value}</p>
                      <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servizi" className="bg-white px-6 py-20 text-slate-950 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.24em] text-cyan-700">Cosa facciamo</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Servizi pensati per creare ordine, velocità e valore.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Ogni progetto parte da un confronto diretto e si traduce in azioni pratiche, strumenti chiari e responsabilità definite.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-cyan-100 text-center text-2xl leading-[3rem]">✓</div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-cyan-200">Il nostro metodo</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Dal problema alla soluzione, con un percorso trasparente.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Lavoriamo con pragmatismo: poche promesse generiche, molte attività tracciabili e un dialogo costante con il cliente.
            </p>
          </div>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-5 rounded-3xl border border-white/10 bg-white/8 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 font-black text-slate-950">{index + 1}</span>
                <p className="pt-2 text-lg text-slate-200">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contatti" className="bg-slate-100 px-6 py-20 text-slate-950 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-[2rem] bg-white p-8 shadow-2xl md:grid-cols-[1fr_0.9fr] lg:p-12">
          <div>
            <p className="font-semibold uppercase tracking-[0.24em] text-cyan-700">Contatti</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Parliamo del tuo prossimo obiettivo.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Raccontaci di cosa hai bisogno: ti ricontatteremo per capire il contesto, valutare le priorità e proporre il percorso più adatto.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Different Business Service Group SRL</p>
            <div className="mt-6 space-y-4 text-slate-200">
              <p><span className="font-semibold text-white">Email:</span> info@differentbusinessservicegroup.it</p>
              <p><span className="font-semibold text-white">Telefono:</span> +39 000 000 0000</p>
              <p><span className="font-semibold text-white">Sede:</span> Italia</p>
            </div>
            <a
              className="mt-8 inline-flex w-full justify-center rounded-full bg-cyan-300 px-6 py-4 font-bold text-slate-950 transition hover:bg-white"
              href="mailto:info@differentbusinessservicegroup.it?subject=Richiesta%20informazioni%20DBSG%20SRL"
            >
              Invia una richiesta
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
