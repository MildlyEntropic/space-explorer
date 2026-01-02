import { w as head, x as attr, z as ensure_array_like, y as stringify } from "../../chunks/index.js";
import { f as formatSol, L as Lightbox } from "../../chunks/Lightbox.js";
import { e as escape_html } from "../../chunks/context.js";
function AdPlaceholder($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { location = "footer" } = $$props;
    const AD_CLIENT = "ca-pub-1831808995712219";
    const AD_SLOT = "XXXXXXXXXX";
    head("15ymaau", $$renderer2, ($$renderer3) => {
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    if (location === "footer") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="adsense-container flex items-center justify-center py-4 svelte-15ymaau">`);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<ins class="adsbygoogle" style="display:block"${attr("data-ad-client", AD_CLIENT)}${attr("data-ad-slot", AD_SLOT)} data-ad-format="horizontal" data-full-width-responsive="true"></ins>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="adsense-container hidden lg:block svelte-15ymaau">`);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<ins class="adsbygoogle" style="display:block"${attr("data-ad-client", AD_CLIENT)}${attr("data-ad-slot", AD_SLOT)} data-ad-format="auto" data-full-width-responsive="true"></ins>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let latestPhotos = data.latestPhotos || [];
    let apod = data.apod || null;
    let jwstImages = data.jwstImages || [];
    let hubbleImages = data.hubbleImages || [];
    let selectedPhoto = null;
    let selectedSpaceImage = null;
    let contentLoaded = latestPhotos.length > 0 || jwstImages.length > 0 || hubbleImages.length > 0;
    function closeLightbox() {
      selectedPhoto = null;
      selectedSpaceImage = null;
    }
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"><header class="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40"><div class="max-w-7xl mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg></div> <div><h1 class="text-xl font-bold text-white">Space Explorer</h1> <p class="text-gray-400 text-sm">NASA Rovers, JWST, Hubble &amp; APOD</p></div></div> <nav class="flex items-center gap-4"><a href="/mars" class="text-gray-400 hover:text-white transition-colors text-sm">Mars Rovers</a> <a href="/telescopes" class="text-gray-400 hover:text-white transition-colors text-sm">Telescopes</a></nav></div></div></header> <main class="max-w-7xl mx-auto px-4 py-8 space-y-12">`);
    if (apod) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <h2 class="text-2xl font-bold text-white">Astronomy Picture of the Day</h2></div></div> <button type="button" class="relative w-full overflow-hidden rounded-xl bg-gray-800 cursor-pointer group text-left"><div class="aspect-video md:aspect-[21/9] relative"><img${attr("src", apod.img_src)}${attr("alt", apod.title)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/> <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div> <div class="absolute bottom-0 left-0 right-0 p-6"><p class="text-yellow-400 text-sm font-medium mb-1">${escape_html(apod.date)}</p> <h3 class="text-white text-xl md:text-2xl font-bold mb-2">${escape_html(apod.title)}</h3> <p class="text-gray-300 text-sm line-clamp-2 max-w-3xl">${escape_html(apod.description)}</p> `);
      if (apod.credits) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-500 text-xs mt-2">Credit: ${escape_html(apod.credits)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></button></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (latestPhotos.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center"><span class="text-white text-lg">🔴</span></div> <h2 class="text-2xl font-bold text-white">Latest from Mars</h2></div> <a href="/mars" class="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1">Browse all <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a></div> <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"><!--[-->`);
      const each_array = ensure_array_like(latestPhotos.slice(0, 6));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let photo = each_array[$$index];
        $$renderer2.push(`<button type="button" class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer"><img${attr("src", photo.img_src)}${attr("alt", `Mars surface from ${stringify(photo.camera.full_name)}`)} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"/> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div class="absolute bottom-0 left-0 right-0 p-2"><p class="text-white text-xs font-medium truncate">${escape_html(photo.camera.full_name)}</p> <p class="text-gray-300 text-xs">${escape_html(formatSol(photo.sol))}</p></div></div></button>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (jwstImages.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center"><span class="text-white text-xs font-bold">JW</span></div> <h2 class="text-2xl font-bold text-white">James Webb Space Telescope</h2></div> <a href="/telescopes" class="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">Browse all <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
      const each_array_1 = ensure_array_like(jwstImages.slice(0, 4));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let image = each_array_1[$$index_1];
        $$renderer2.push(`<button type="button" class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer"><img${attr("src", image.thumbnail_src || image.img_src)}${attr("alt", image.title)} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"/> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div class="absolute bottom-0 left-0 right-0 p-3"><p class="text-white text-sm font-medium truncate">${escape_html(image.title)}</p></div></div></button>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (hubbleImages.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<section class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"><span class="text-white text-xs font-bold">H</span></div> <h2 class="text-2xl font-bold text-white">Hubble Space Telescope</h2></div> <a href="/telescopes" class="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">Browse all <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4"><!--[-->`);
      const each_array_2 = ensure_array_like(hubbleImages.slice(0, 4));
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let image = each_array_2[$$index_2];
        $$renderer2.push(`<button type="button" class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer"><img${attr("src", image.thumbnail_src || image.img_src)}${attr("alt", image.title)} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy"/> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div class="absolute bottom-0 left-0 right-0 p-3"><p class="text-white text-sm font-medium truncate">${escape_html(image.title)}</p></div></div></button>`);
      }
      $$renderer2.push(`<!--]--></div></section>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <section class="grid md:grid-cols-2 gap-6"><a href="/mars" class="group bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-800/50 rounded-xl p-6 hover:border-orange-600/50 transition-colors"><div class="flex items-center gap-4"><div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center"><span class="text-3xl">🔴</span></div> <div><h3 class="text-white font-semibold text-lg group-hover:text-orange-400 transition-colors">Mars Rovers</h3> <p class="text-gray-400 text-sm">Browse Perseverance, Curiosity, Opportunity &amp; Spirit imagery</p></div></div></a> <a href="/telescopes" class="group bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-800/50 rounded-xl p-6 hover:border-purple-600/50 transition-colors"><div class="flex items-center gap-4"><div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg></div> <div><h3 class="text-white font-semibold text-lg group-hover:text-purple-400 transition-colors">Space Telescopes</h3> <p class="text-gray-400 text-sm">Explore James Webb &amp; Hubble Space Telescope imagery</p></div></div></a></section></main> <section class="border-t border-gray-800 bg-gray-900/30"><div class="max-w-7xl mx-auto px-4 py-12"><h2 class="text-2xl font-bold text-white mb-8 text-center">About NASA's Space Missions</h2> <div class="grid md:grid-cols-3 gap-6"><article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div> <h3 class="text-white font-semibold">APOD</h3></div> <p class="text-gray-400 text-sm leading-relaxed">The Astronomy Picture of the Day features a different image of our universe each day,
						accompanied by a brief explanation written by a professional astronomer.
						Running since 1995, APOD is one of NASA's most popular websites.</p></article> <article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white">🔴</div> <h3 class="text-white font-semibold">Mars Rovers</h3></div> <p class="text-gray-400 text-sm leading-relaxed">NASA has sent four rovers to Mars: Spirit, Opportunity, Curiosity, and Perseverance.
						These robotic explorers have captured millions of images, revealing Mars' ancient water history
						and searching for signs of past microbial life.</p></article> <article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg></div> <h3 class="text-white font-semibold">Space Telescopes</h3></div> <p class="text-gray-400 text-sm leading-relaxed">The Hubble and James Webb Space Telescopes are humanity's eyes on the universe.
						Together they observe from ultraviolet to infrared, revealing galaxies billions of light-years away
						and studying the atmospheres of distant exoplanets.</p></article></div></div></section> <footer class="border-t border-gray-800"><div class="max-w-7xl mx-auto px-4 py-8 space-y-6">`);
    if (contentLoaded) {
      $$renderer2.push("<!--[-->");
      AdPlaceholder($$renderer2, { location: "footer" });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex justify-center"><a href="https://ko-fi.com/avactus" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5E5B] hover:bg-[#ff4442] text-white font-medium rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"></path></svg> Support on Ko-fi</a></div> <p class="text-gray-500 text-sm text-center">Data provided by <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300">NASA</a>.
				Images courtesy of NASA/JPL-Caltech/ESA/STScI.</p></div></footer></div> `);
    Lightbox($$renderer2, {
      photo: selectedPhoto,
      spaceImage: selectedSpaceImage,
      onClose: closeLightbox
    });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
