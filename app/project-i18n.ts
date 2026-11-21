export const englishProjects: Record<string, {title:string;summary:string;category:string}> = {
"high-dimensional-time-series": {
 title: "High-Dimensional Time Series & Air Quality Forecasting",
 category: "Time Series & Machine Learning",
 summary: "From 516 sensors in Taiwan to a PM2.5 forecasting benchmark for Beijing: exploring high dimensionality, building credible baselines, and assessing the contribution of environmental variables without hiding the limitations of the results."
},
"matrix-completion-movielens": {
 title: "Matrix Completion on MovieLens",
 category: "Machine Learning & Recommender Systems",
 summary: "Comparing SVP, SVT, a variant of ADMiRA, and two baselines for estimating missing ratings. In our experiment, a regularized baseline performed best."
},
"statistical-learning-optimization": {
 title: "Statistical Learning & Zeroth-Order Optimization",
 category: "Machine Learning & Optimization",
 summary: "From predictive risk theory to classification: seven reproducible experiments comparing regression, gradient descent, and gradient-free optimization."
},
"named-entity-recognition": {
 title: "Named Entity Recognition: BiLSTM vs DistilBERT",
 category: "NLP & Deep Learning",
 summary: "An experimental comparison of BiLSTM and DistilBERT for named entity recognition, with documented results, automated tests, and methodological limitations."
}
};
