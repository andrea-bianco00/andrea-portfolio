"use client";

import { useState } from "react";

export default function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  function enterSite() {
    setIsLeaving(true);
  }

  if (!visible) return null;

  return (
    <div
      className={`intro-screen ${isLeaving ? "intro-screen--leaving" : ""}`}
      onClick={enterSite}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          enterSite();
        }
      }}
      onAnimationEnd={(event) => {
        if (event.animationName === "introFadeOutClick") {
          setVisible(false);
        }
      }}
    >
      <div className="intro-content">
        <div className="intro-cat-asset-scene" aria-hidden="true">
          <img
            className="intro-cat-asset intro-cat-walk"
            src="/cats/cat-walk.svg"
            alt=""
          />
          <img
            className="intro-cat-asset intro-cat-sleep"
            src="/cats/cat-sleep.svg"
            alt=""
          />
        </div>

        <h1 className="intro-title">ANDREA BIANCO</h1>
      </div>
    </div>
  );
}