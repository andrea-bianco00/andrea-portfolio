"use client";
import { useState, type ReactNode } from "react";
import { useLanguage } from "../../components/LocaleProvider";

const overviews: Record<string, {question:string;context:string;approach:string;findings:string;limits:string}> = {
  "named-entity-recognition": {
    question:"How can we identify named entities in text?",
    context:"This project compares sequence modelling with a bidirectional LSTM and a fine-tuned transformer, DistilBERT, on a named entity recognition task.",
    approach:"The models are evaluated using a documented experimental protocol, with performance metrics and validation-loss curves. The project includes code and automated tests.",
    findings:"DistilBERT outperformed the BiLSTM baseline on the recorded metrics in this experiment.",
    limits:"This comparison does not isolate every architectural difference. Results come from the documented experimental setup rather than a comprehensive multi-run benchmark."
  },
  "statistical-learning-optimization": {
    question:"How do model assumptions and optimization choices affect predictive learning?",
    context:"A collection of reproducible experiments connecting predictive risk, regression, classification, and optimization.",
    approach:"The work compares gradient-based and zeroth-order approaches, examining model fit, optimization, and evaluation in different settings.",
    findings:"The experiments illustrate why a metric makes sense only in relation to the data-generating assumptions, the model, and the evaluation protocol.",
    limits:"The experiments are instructional comparisons, not evidence that one optimization method is universally best."
  },
  "matrix-completion-movielens": {
    question:"How can we estimate ratings that users have not provided?",
    context:"A matrix completion study on MovieLens, comparing approaches for recovering missing user-item ratings.",
    approach:"The experiment evaluates SVP, SVT, a variant of ADMiRA, and two baselines under a documented model-selection and evaluation process.",
    findings:"In the reported experiment, the regularized baseline obtained the best results among the compared methods.",
    limits:"The conclusion applies to this dataset and evaluation setting; it is not a general ranking of matrix completion algorithms."
  },
  "high-dimensional-time-series": {
    question:"What can we learn from many correlated time series when forecasting air quality?",
    context:"This project moves from a high-dimensional network of 516 Taiwanese sensor series to a separate PM2.5 forecasting benchmark in Beijing.",
    approach:"It defines forecasting targets and chronological evaluation, builds baseline models, and examines whether environmental variables improve prediction.",
    findings:"The experiments investigate the contribution of environmental information against simpler models, with comparisons and reported limitations.",
    limits:"Taiwan and Beijing are different datasets and tasks. Historical performance does not guarantee generalization to a new independent period."
  }
};

export default function CaseStudyLanguage({slug,children}:{slug:string;children:ReactNode}) {
  const {language}=useLanguage();
  const [showItalian,setShowItalian]=useState(false);
  if(language==="it") return <>{children}</>;
  const info=overviews[slug];
  if(!info) return <>{children}</>;
  return <section className="cozy-english-case" aria-label="English project overview">
    <p className="cozy-kicker">Project overview · English</p>
    <h2>{info.question}</h2>
    <div className="cozy-case-english-grid">
      <div><h3>Context</h3><p>{info.context}</p></div>
      <div><h3>Approach</h3><p>{info.approach}</p></div>
      <div><h3>What the results show</h3><p>{info.findings}</p></div>
      <div><h3>Limitations</h3><p>{info.limits}</p></div>
    </div>
    <div className="cozy-note">
      <p>The full technical case study, with figures and detailed discussion, is currently available in Italian. You can open it below without changing the website language.</p>
      <button type="button" className="cozy-language-detail-toggle" onClick={()=>setShowItalian(value=>!value)} aria-expanded={showItalian}>{showItalian?"Hide Italian technical report":"Read full technical report in Italian"} ↗</button>
    </div>
    {showItalian && <div lang="it" className="cozy-original-case">{children}</div>}
  </section>;
}
