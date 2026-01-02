import { x as attr, y as stringify } from "./index.js";
import { e as escape_html } from "./context.js";
function formatEarthDate(date) {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function formatSol(sol) {
  return `Sol ${sol.toLocaleString()}`;
}
function Lightbox($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { photo = null, spaceImage = null, onClose } = $$props;
    let isPhoto = photo !== null;
    let isSpaceImage = spaceImage !== null;
    let hasContent = isPhoto || isSpaceImage;
    if (hasContent) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Image lightbox" tabindex="-1"><button type="button" class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10" aria-label="Close lightbox"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button> <div class="max-w-7xl max-h-full flex flex-col lg:flex-row gap-6 overflow-auto"><div class="flex-1 flex items-center justify-center">`);
      if (isPhoto && photo) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", photo.img_src)}${attr("alt", `Mars surface from ${stringify(photo.camera.full_name)}`)} class="max-w-full max-h-[80vh] object-contain rounded-lg"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (isSpaceImage && spaceImage) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", spaceImage.img_src)}${attr("alt", spaceImage.title)} class="max-w-full max-h-[80vh] object-contain rounded-lg"/>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="lg:w-80 bg-gray-900/80 rounded-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto">`);
      if (isPhoto && photo) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2 class="text-xl font-semibold text-white">${escape_html(photo.camera.full_name)}</h2> <div class="space-y-3"><div><p class="text-gray-400 text-sm">Rover</p> <p class="text-white">${escape_html(photo.rover.name)}</p></div> <div><p class="text-gray-400 text-sm">Sol (Mars Day)</p> <p class="text-white">${escape_html(formatSol(photo.sol))}</p></div> <div><p class="text-gray-400 text-sm">Earth Date</p> <p class="text-white">${escape_html(formatEarthDate(photo.earth_date))}</p></div> <div><p class="text-gray-400 text-sm">Camera</p> <p class="text-white">${escape_html(photo.camera.name)}</p></div></div> <div class="pt-4 border-t border-gray-700"><a${attr("href", photo.img_src)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"><span>Open full resolution</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (isSpaceImage && spaceImage) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<h2 class="text-xl font-semibold text-white">${escape_html(spaceImage.title)}</h2> <div class="space-y-3">`);
          if (spaceImage.sourceDetails) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div><p class="text-gray-400 text-sm">Source</p> <p class="text-white">${escape_html(spaceImage.sourceDetails)}</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (spaceImage.date) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div><p class="text-gray-400 text-sm">Date</p> <p class="text-white">${escape_html(spaceImage.date)}</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (spaceImage.credits) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div><p class="text-gray-400 text-sm">Credits</p> <p class="text-white">${escape_html(spaceImage.credits)}</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (spaceImage.description) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div><p class="text-gray-400 text-sm">Description</p> <p class="text-white text-sm leading-relaxed">${escape_html(spaceImage.description)}</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="pt-4 border-t border-gray-700"><a${attr("href", spaceImage.img_src)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"><span>Open full resolution</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  Lightbox as L,
  formatEarthDate as a,
  formatSol as f
};
