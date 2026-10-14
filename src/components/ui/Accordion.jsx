import { useState } from "react";
import { ChevronRightIcon } from "../icons.jsx";

/**
 * Expanding panel for the FAQ and the mobile filter groups.
 *
 * Animates with grid-template-rows 0fr -> 1fr rather than max-height: it
 * transitions to the content's real height, so there is no guessed magic
 * number that clips long answers.
 */
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl ring-1 ring-slate-200">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div key={item.question} className="bg-white">
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left font-medium transition-colors hover:bg-slate-50"
              >
                <span className="flex-1">{item.question}</span>
                <ChevronRightIcon
                  className={`size-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                    open ? "rotate-90 text-brand" : ""
                  }`}
                />
              </button>
            </h3>

            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
