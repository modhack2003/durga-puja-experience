"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ArrowRight, X } from "lucide-react";
import { chapters } from "./chapters";
import { chapterDesign, sceneArt } from "./journey";
import { GoddessMark } from "./Alpona";

export default function ExperienceDialogs({
  panel,
  chapter,
  onClose,
  onSelect,
}) {
  const dialog = useRef();
  const current = chapters[chapter];
  useEffect(() => {
    const element = dialog.current;
    if (panel) element.showModal();
    else element.close();
  }, [panel]);
  return (
    <dialog
      ref={dialog}
      className={`experience-dialog ${panel === "story" ? "is-story" : "is-atlas"}`}
      aria-labelledby="dialog-title"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...event.currentTarget.querySelectorAll(
            "button:not(:disabled), a[href]",
          ),
        ];
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner" data-lenis-prevent>
        <div className="dialog-heading">
          <span className="eyebrow">DURGA PUJA · THE GODDESS RETURNS</span>
          <button
            className="icon-button close-dialog"
            onClick={onClose}
            aria-label="Close dialog"
            autoFocus
          >
            <X size={22} />
          </button>
        </div>
        {panel === "atlas" && (
          <>
            <div className="atlas-heading">
              <div>
                <span className="bengali" lang="bn">
                  ছয় অধ্যায়, এক অনুভূতি
                </span>
                <h2 id="dialog-title">
                  Six chapters.
                  <br />
                  <em>One homecoming.</em>
                </h2>
              </div>
              <p>
                Follow the story from the first calling
                <br />
                to the promise of another year.
              </p>
            </div>
            <div className="atlas-grid">
              {chapters.map((item, i) => (
                <button
                  key={item.name}
                  className="atlas-card"
                  onClick={() => onSelect(i)}
                  aria-label={`Go to ${item.name}`}
                >
                  <img
                    src={sceneArt[i]}
                    alt=""
                    width="600"
                    height="400"
                    loading="lazy"
                  />
                  {(i === 0 || i === 1 || i === 3 || i === 4) && (
                    <img
                      className="atlas-deity"
                      src={
                        i === 0
                          ? "/art/mahishasura-mardini.webp"
                          : "/art/uma-family.webp"
                      }
                      alt=""
                      width="600"
                      height="400"
                      loading="lazy"
                    />
                  )}
                  <span className="atlas-number">
                    0{i + 1}
                    <span>{chapterDesign[i].mood}</span>
                  </span>
                  <span className="atlas-card-title">
                    <span>
                      <small lang="bn">{item.bengali}</small>
                      {item.name}
                    </span>
                    <ArrowUpRight size={23} />
                  </span>
                </button>
              ))}
            </div>
            <div className="atlas-foot">
              <GoddessMark />
              <p>
                For the artisans who give her form.
                <br />
                For the people who make it home.
              </p>
              <span>KOLKATA, WEST BENGAL · INDIA</span>
            </div>
          </>
        )}
        {panel === "story" && (
          <div className="story-layout">
            <div className="story-photo">
              <img
                src={sceneArt[chapter]}
                width="1536"
                height="1024"
                alt={`An artistic interpretation of ${current.name}`}
              />
              <span>
                0{chapter + 1}
                <small>{chapterDesign[chapter].mood}</small>
              </span>
            </div>
            <article className="story-reading">
              <span className="bengali" lang="bn">
                {current.bengali}
              </span>
              <h2 id="dialog-title">{current.ritual}</h2>
              {current.context.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <ul className="ritual-list">
                {current.rituals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="story-sources">
                <span className="eyebrow">GO A LITTLE DEEPER</span>
                {current.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.title}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </div>
              <p className="interpretation">
                An artistic celebration of living traditions. Customs vary
                between communities. The interactive gestures and synthesized
                sound are creative interpretations.
              </p>
              <button
                className="text-button"
                onClick={() => onSelect((chapter + 1) % chapters.length)}
              >
                {chapter === 5
                  ? "Return to the beginning"
                  : `Continue to ${chapters[chapter + 1].name}`}
                <ArrowRight size={16} />
              </button>
            </article>
          </div>
        )}
      </div>
    </dialog>
  );
}
