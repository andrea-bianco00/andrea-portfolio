"use client";

import katex from "katex";
import { useMemo } from "react";

type Props = {
  tex: string;
  display?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function MathFormula({ tex, display = false, className = "", ariaLabel }: Props) {
  const html = useMemo(() => katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: "warn",
    trust: false,
    output: "htmlAndMathml",
  }), [tex, display]);

  return <span
    className={`portfolio-katex ${display ? "portfolio-katex-display" : ""} ${className}`}
    role="math"
    aria-label={ariaLabel ?? tex}
    dangerouslySetInnerHTML={{ __html: html }}
  />;
}
