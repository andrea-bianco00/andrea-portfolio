export type Project = {
  slug: string;
  title: string;
  category: string;
  year: number;
  summary: string;
  tags: string[];
  featured: boolean;
  github?: string;
};

export const projects: Project[] = [
  {
    slug: "matrix-completion-movielens",
    title: "Matrix Completion: cosa funziona davvero sui rating?",
    category: "Machine Learning & Recommender Systems",
    year: 2026,
    summary: "Tre metodi low-rank, due baseline e un confronto su MovieLens: il modello più semplice ha vinto. Scelte sperimentali, RMSE e limiti verificabili.",
    tags: ["Python", "NumPy", "Matrix Completion", "Model Evaluation"],
    featured: true,
    github: "https://github.com/andrea-bianco00/matrix-completion-movielens",
  },
  {
    slug: "statistical-learning-optimization",
    title: "Statistical Learning & Zeroth-Order Optimization",
    category: "Machine Learning & Optimization",
    year: 2025,
    summary: "Dalla teoria del rischio predittivo alla classificazione: sette esperimenti riproducibili per confrontare regressione, gradient descent e ottimizzazione senza gradienti.",
    tags: ["Python", "Machine Learning", "Statistical Learning", "Optimization"],
    featured: true,
    github: "https://github.com/andrea-bianco00/machine-learning-methods",
  },
  {
    slug: "named-entity-recognition",
    title: "Named Entity Recognition: BiLSTM vs DistilBERT",
    category: "NLP & Deep Learning",
    year: 2026,
    summary: "Confronto sperimentale tra una BiLSTM e DistilBERT per riconoscere entità nominate nel testo, con risultati, test automatici e limiti metodologici documentati.",
    tags: ["NLP", "Python", "PyTorch", "Transformers"],
    featured: true,
    github: "https://github.com/andrea-bianco00/natural-language-processing",
  },
];

export const projectCategories = ["Tutti", ...Array.from(new Set(projects.map((project) => project.category)))];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
