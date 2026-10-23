export default function MatrixCompletionCaseStudy() {
  return <>
    <section className="case-section">
      <p className="eyebrow">IL PROBLEMA</p>
      <h2>Possiamo prevedere un film che non hai ancora valutato?</h2>
      <p>Nei sistemi di raccomandazione, la matrice utenti × film contiene pochissimi rating osservati. Il progetto universitario, sviluppato con Matteo Mancini e successivamente riorganizzato come benchmark documentato, confronta metodi di ricostruzione low-rank con baseline molto più semplici.</p>
      <p>La domanda non era soltanto «quale algoritmo è più sofisticato?», ma «quale generalizza meglio su rating non utilizzati per addestrarlo?».</p>
    </section>
    <section className="case-section">
      <p className="eyebrow">IL DISEGNO SPERIMENTALE</p>
      <h2>Stessi dati, stesso criterio di valutazione.</h2>
      <p>MovieLens Latest Small: 100.836 rating, 610 utenti e 9.724 film valutati. Suddivisione fissata prima del confronto: 70.585 rating di training, 15.125 di validation e 15.126 di test.</p>
      <p>Abbiamo valutato 11 configurazioni tra SVP, SVT, una variante didattica ispirata ad ADMiRA, media globale e baseline regolarizzata con effetti utente–film. La scelta del modello è avvenuta sulla validation; il test finale è stato usato una sola volta, soltanto per il modello selezionato.</p>
    </section>
    <section className="case-section">
      <p className="eyebrow">RISULTATO PRINCIPALE</p>
      <h2>La baseline ha battuto i modelli più complessi.</h2>
      <div className="case-metrics">
        <div><strong>0,8607</strong><span>RMSE validation · baseline regolarizzata</span></div>
        <div><strong>0,8781</strong><span>RMSE test · modello selezionato</span></div>
        <div><strong>15.126</strong><span>Rating nel test finale</span></div>
      </div>
      <p>Tra i tre approcci di matrix completion, SVP ha ottenuto il miglior RMSE di validation nella griglia studiata (circa 1,3895 con rango 5). La baseline regolarizzata utente–film è risultata però nettamente migliore (0,8607). È una conclusione relativa a questo dataset, queste implementazioni e questo protocollo, non una classifica universale degli algoritmi.</p>
    </section>
    <section className="case-section">
      <p className="eyebrow">COSA HO IMPARATO</p>
      <h2>Un esperimento credibile vale più di un risultato appariscente.</h2>
      <p>Il progetto mette in evidenza il valore delle baseline, la separazione fra selezione e valutazione finale, il controllo dei casi con film mai osservati nel training e la necessità di dichiarare i limiti computazionali e metodologici.</p>
      <p>Il repository contiene codice, configurazioni, risultati registrati e controlli automatici offline. Alcuni test d’integrazione richiedono l’archivio originale MovieLens e vengono esplicitamente saltati quando non è disponibile. Il badge verde non equivale a una nuova esecuzione completa degli esperimenti né certifica un isolamento del processo a livello di sistema operativo.</p>
    </section>
  </>;
}
