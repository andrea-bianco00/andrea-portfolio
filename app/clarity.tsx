"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function MicrosoftClarity() {
  useEffect(() => {
    Clarity.init("xg81r16nva");
  }, []);

  return null;
}