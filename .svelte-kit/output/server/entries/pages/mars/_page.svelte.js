import { z as ensure_array_like, x as attr, y as stringify, F as attr_class, w as head } from "../../../chunks/index.js";
import { f as formatSol, a as formatEarthDate, L as Lightbox } from "../../../chunks/Lightbox.js";
import { e as escape_html } from "../../../chunks/context.js";
function PhotoGrid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { photos } = $$props;
    let loadedCount = 0;
    function isMERImage(src) {
      return src.includes("/api/mer-image");
    }
    function shouldLoad(index, src) {
      if (!isMERImage(src)) return true;
      return index < loadedCount + 3;
    }
    if (
      // Reset loaded count only when doing a fresh search (length decreases or goes to different set)
      // If photos array shrunk or is a completely new set, reset
      photos.length === 0
    ) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-20 text-gray-400"><svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <p class="text-lg">Select a rover and click Search</p> <p class="text-sm">Use the filters above to explore Mars rover imagery</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"><!--[-->`);
      const each_array = ensure_array_like(photos);
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let photo = each_array[index];
        $$renderer2.push(`<button type="button" class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900">`);
        if (shouldLoad(index, photo.img_src)) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<img${attr("src", photo.img_src)}${attr("alt", `Mars surface from ${stringify(photo.camera.full_name)}`)} class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onerror="this.__e=event" onload="this.__e=event"/>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="w-full h-full flex items-center justify-center"><div class="w-8 h-8 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin"></div></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div class="absolute bottom-0 left-0 right-0 p-3"><p class="text-white text-sm font-medium truncate">${escape_html(photo.camera.full_name)}</p> <p class="text-gray-300 text-xs">${escape_html(formatSol(photo.sol))} · ${escape_html(formatEarthDate(photo.earth_date))}</p></div></div></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const ROVER_CAMERAS = {
  perseverance: [
    { abbrev: "EDL_RUCAM", full_name: "Rover Up-Look Camera" },
    { abbrev: "EDL_RDCAM", full_name: "Rover Down-Look Camera" },
    { abbrev: "EDL_DDCAM", full_name: "Descent Stage Down-Look Camera" },
    { abbrev: "EDL_PUCAM1", full_name: "Parachute Up-Look Camera A" },
    { abbrev: "EDL_PUCAM2", full_name: "Parachute Up-Look Camera B" },
    { abbrev: "NAVCAM_LEFT", full_name: "Navigation Camera - Left" },
    { abbrev: "NAVCAM_RIGHT", full_name: "Navigation Camera - Right" },
    { abbrev: "MCZ_LEFT", full_name: "Mast Camera Zoom - Left" },
    { abbrev: "MCZ_RIGHT", full_name: "Mast Camera Zoom - Right" },
    { abbrev: "FRONT_HAZCAM_LEFT_A", full_name: "Front Hazard Avoidance Camera - Left" },
    { abbrev: "FRONT_HAZCAM_RIGHT_A", full_name: "Front Hazard Avoidance Camera - Right" },
    { abbrev: "REAR_HAZCAM_LEFT", full_name: "Rear Hazard Avoidance Camera - Left" },
    { abbrev: "REAR_HAZCAM_RIGHT", full_name: "Rear Hazard Avoidance Camera - Right" },
    { abbrev: "SKYCAM", full_name: "MEDA Skycam" },
    { abbrev: "SHERLOC_WATSON", full_name: "SHERLOC WATSON Camera" }
  ],
  curiosity: [
    { abbrev: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { abbrev: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { abbrev: "MAST", full_name: "Mast Camera" },
    { abbrev: "CHEMCAM", full_name: "Chemistry and Camera Complex" },
    { abbrev: "MAHLI", full_name: "Mars Hand Lens Imager" },
    { abbrev: "MARDI", full_name: "Mars Descent Imager" },
    { abbrev: "NAVCAM", full_name: "Navigation Camera" }
  ],
  opportunity: [
    { abbrev: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { abbrev: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { abbrev: "NAVCAM", full_name: "Navigation Camera" },
    { abbrev: "PANCAM", full_name: "Panoramic Camera" },
    { abbrev: "MINITES", full_name: "Miniature Thermal Emission Spectrometer" }
  ],
  spirit: [
    { abbrev: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { abbrev: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { abbrev: "NAVCAM", full_name: "Navigation Camera" },
    { abbrev: "PANCAM", full_name: "Panoramic Camera" },
    { abbrev: "MINITES", full_name: "Miniature Thermal Emission Spectrometer" }
  ]
};
const ROVERS = [
  { name: "perseverance", displayName: "Perseverance", active: true, available: true, dateRange: "Feb 2021 - Present" },
  { name: "curiosity", displayName: "Curiosity", active: true, available: true, dateRange: "Aug 2012 - Present" },
  { name: "opportunity", displayName: "Opportunity", active: false, available: true, dateRange: "Jan 2004 - Jun 2018" },
  { name: "spirit", displayName: "Spirit", active: false, available: true, dateRange: "Jan 2004 - Mar 2010" }
];
function RoverSelector($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { selected } = $$props;
    $$renderer2.push(`<div class="flex flex-wrap gap-3"><!--[-->`);
    const each_array = ensure_array_like(ROVERS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let rover = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr_class(`px-4 py-2 rounded-lg text-left transition-all duration-200 ${stringify(selected === rover.name ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white")} ${stringify(!rover.available ? "opacity-50 cursor-not-allowed" : "")}`)}${attr("disabled", !rover.available, true)}><div class="flex items-center gap-2"><span class="font-medium">${escape_html(rover.displayName)}</span> `);
      if (!rover.available) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-xs opacity-70">(unavailable)</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div${attr_class(`text-xs ${stringify(selected === rover.name ? "text-orange-200" : "text-gray-500")}`)}>${escape_html(rover.dateRange)}</div></button>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function FilterPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      rover,
      dateStart,
      dateEnd,
      camera,
      search,
      maxSol,
      onCameraChange
    } = $$props;
    const cameras = ROVER_CAMERAS[rover] || [];
    const SEARCH_EXAMPLES = {
      perseverance: ["rock", "wheel", "horizon", "drill", "sample"],
      curiosity: ["rock", "wheel", "sand", "crater", "mountain"],
      opportunity: [],
      spirit: []
    };
    const searchExamples = SEARCH_EXAMPLES[rover] || [];
    let solMode = "single";
    const hasActiveFilters = dateStart !== "" || dateEnd !== "" || camera !== "" || search !== "";
    $$renderer2.push(`<div class="bg-gray-900/50 rounded-xl p-4 space-y-4"><div class="space-y-2"><div class="flex items-center gap-4"><span class="text-gray-400 text-sm font-medium">Sol (Mars Day)</span> <div class="flex items-center gap-2"><label class="flex items-center gap-1 cursor-pointer"><input type="radio" name="sol-mode"${attr("checked", solMode === "single", true)} class="text-orange-500 focus:ring-orange-500"/> <span class="text-gray-300 text-sm">Single</span></label> <label class="flex items-center gap-1 cursor-pointer"><input type="radio" name="sol-mode"${attr("checked", solMode === "range", true)} class="text-orange-500 focus:ring-orange-500"/> <span class="text-gray-300 text-sm">Range</span></label></div> `);
    if (maxSol > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="text-gray-500 text-xs">max: ${escape_html(maxSol.toLocaleString())}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<input type="number" min="0"${attr("max", maxSol)}${attr("value", "")} placeholder="Leave empty for latest" class="w-full max-w-xs px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"/>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="space-y-2"><span class="text-gray-400 text-sm font-medium">Earth Date Range</span> <div class="flex flex-wrap items-center gap-2"><input type="date"${attr("value", dateStart)} class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"/> <span class="text-gray-500">to</span> <input type="date"${attr("value", dateEnd)} class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"/></div></div> <div class="flex flex-wrap gap-4"><div class="space-y-2"><label for="camera-select" class="text-gray-400 text-sm font-medium">Camera</label> `);
    $$renderer2.select(
      {
        id: "camera-select",
        value: camera,
        onchange: (e) => onCameraChange(e.target.value),
        class: "px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`All Cameras`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(cameras);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cam = each_array[$$index];
          $$renderer3.option({ value: cam.abbrev }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cam.full_name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="flex-1 min-w-[200px] space-y-2"><label for="search-input" class="text-gray-400 text-sm font-medium">Text Search</label> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<input id="search-input" type="text"${attr("value", search)} placeholder="Search captions, metadata..." class="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"/> <div class="flex flex-wrap gap-1.5"><span class="text-gray-500 text-xs">Try:</span> <!--[-->`);
      const each_array_1 = ensure_array_like(searchExamples);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let example = each_array_1[$$index_1];
        $$renderer2.push(`<button type="button" class="text-xs text-orange-400 hover:text-orange-300 hover:underline transition-colors">${escape_html(example)}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (hasActiveFilters) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button" class="text-gray-400 hover:text-white text-sm underline transition-colors">Clear all filters</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let selectedRover = "perseverance";
    let dateStart = "";
    let dateEnd = "";
    let camera = "";
    let search = "";
    let maxSol = data.maxSol || 0;
    let photos = data.initialPhotos || [];
    let selectedPhoto = null;
    let loadingPhotos = false;
    function closeLightbox() {
      selectedPhoto = null;
    }
    head("1cpwlwq", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mars Rovers - Space Explorer</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Browse photos from NASA's Mars rovers: Perseverance, Curiosity, Opportunity, and Spirit. Filter by sol, date, and camera."/>`);
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"><header class="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40"><div class="max-w-7xl mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity"><div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center"><span class="text-white text-lg">🔴</span></div> <div><h1 class="text-xl font-bold text-white">Mars Rovers</h1> <p class="text-gray-400 text-sm">NASA rover imagery</p></div></a></div> <nav class="flex items-center gap-4"><a href="/" class="text-gray-400 hover:text-white transition-colors text-sm">Home</a> <a href="/telescopes" class="text-gray-400 hover:text-white transition-colors text-sm">Telescopes</a></nav></div></div></header> <main class="max-w-7xl mx-auto px-4 py-8 space-y-10"><section class="space-y-6"><h2 class="text-2xl font-bold text-white">Browse Mars Photos</h2> <div><p class="text-gray-400 text-sm mb-2">Select Rover</p> `);
    RoverSelector($$renderer2, { selected: selectedRover });
    $$renderer2.push(`<!----></div> `);
    FilterPanel($$renderer2, {
      rover: selectedRover,
      dateStart,
      dateEnd,
      camera,
      search,
      maxSol,
      onCameraChange: (c) => camera = c
    });
    $$renderer2.push(`<!----> <button type="button" class="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", loadingPhotos, true)}>${escape_html("Search Photos")}</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="space-y-6"><p class="text-gray-400">`);
    if (photos.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`Showing ${escape_html(photos.length)} photos from ${escape_html(selectedRover.charAt(0).toUpperCase() + selectedRover.slice(1))}`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Recent photos from Perseverance rover`);
    }
    $$renderer2.push(`<!--]--></p> `);
    PhotoGrid($$renderer2, { photos });
    $$renderer2.push(`<!----> `);
    if (photos.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex justify-center pt-6"><button type="button" class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"${attr("disabled", loadingPhotos, true)}>${escape_html("Load More")}</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></section> <section class="border-t border-gray-800 pt-10 space-y-8"><h2 class="text-2xl font-bold text-white text-center">About NASA's Mars Rovers</h2> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"><article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">P</div> <h3 class="text-white font-semibold">Perseverance</h3></div> <p class="text-gray-400 text-sm leading-relaxed">NASA's most advanced rover, landed in Jezero Crater on February 18, 2021.
						Searching for signs of ancient microbial life and collecting samples for future return to Earth.</p> <ul class="text-gray-500 text-xs space-y-1"><li>Mass: 1,025 kg (2,260 lb)</li> <li>Dimensions: 3m × 2.7m × 2.2m</li> <li>Power: Multi-Mission RTG</li> <li>Cameras: 23 cameras</li> <li>Top Speed: 152 m/hour</li></ul></article> <article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">C</div> <h3 class="text-white font-semibold">Curiosity</h3></div> <p class="text-gray-400 text-sm leading-relaxed">A car-sized rover exploring Gale Crater since August 2012.
						Confirmed Mars once had conditions favorable for microbial life.</p> <ul class="text-gray-500 text-xs space-y-1"><li>Mass: 899 kg (1,982 lb)</li> <li>Dimensions: 2.9m × 2.7m × 2.2m</li> <li>Power: Multi-Mission RTG</li> <li>Cameras: 17 cameras</li> <li>Top Speed: 90 m/hour</li></ul></article> <article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">O</div> <h3 class="text-white font-semibold">Opportunity</h3></div> <p class="text-gray-400 text-sm leading-relaxed">Operated for nearly 15 years, far exceeding its 90-day mission.
						Traveled over 45 km on Mars and found evidence of ancient water.</p> <ul class="text-gray-500 text-xs space-y-1"><li>Mass: 185 kg (408 lb)</li> <li>Dimensions: 1.6m × 2.3m × 1.5m</li> <li>Power: Solar panels</li> <li>Cameras: 9 cameras</li> <li>Distance: 45.16 km total</li></ul></article> <article class="bg-gray-800/50 rounded-xl p-5 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">S</div> <h3 class="text-white font-semibold">Spirit</h3></div> <p class="text-gray-400 text-sm leading-relaxed">Opportunity's twin, explored Gusev Crater for over 6 years.
						Discovered evidence of past volcanic activity and ancient hot springs.</p> <ul class="text-gray-500 text-xs space-y-1"><li>Mass: 185 kg (408 lb)</li> <li>Dimensions: 1.6m × 2.3m × 1.5m</li> <li>Power: Solar panels</li> <li>Cameras: 9 cameras</li> <li>Distance: 7.73 km total</li></ul></article></div> <div class="grid md:grid-cols-2 gap-6"><div class="bg-gray-800/30 rounded-xl p-6 space-y-4"><h3 class="text-white font-semibold text-lg">Camera Systems</h3> <div class="space-y-3 text-sm"><div><p class="text-orange-400 font-medium">Navigation Cameras (NavCam)</p> <p class="text-gray-400">Black-and-white stereo cameras for autonomous navigation and hazard avoidance.</p></div> <div><p class="text-orange-400 font-medium">Hazard Avoidance Cameras (HazCam)</p> <p class="text-gray-400">Fisheye cameras providing 120° views to detect obstacles.</p></div> <div><p class="text-orange-400 font-medium">Mast Camera (MastCam)</p> <p class="text-gray-400">Color cameras with zoom for geology, atmospheric, and mission support imaging.</p></div> <div><p class="text-orange-400 font-medium">MAHLI (Mars Hand Lens Imager)</p> <p class="text-gray-400">Microscopic imager for close-up photos of rocks and soil.</p></div></div></div> <div class="bg-gray-800/30 rounded-xl p-6 space-y-4"><h3 class="text-white font-semibold text-lg">Mission Timeline</h3> <div class="space-y-3 text-sm"><div class="flex gap-4"><span class="text-gray-500 w-20">2004</span> <p class="text-gray-400">Spirit and Opportunity land on Mars (January)</p></div> <div class="flex gap-4"><span class="text-gray-500 w-20">2010</span> <p class="text-gray-400">Spirit mission ends after getting stuck in sand</p></div> <div class="flex gap-4"><span class="text-gray-500 w-20">2012</span> <p class="text-gray-400">Curiosity lands in Gale Crater (August)</p></div> <div class="flex gap-4"><span class="text-gray-500 w-20">2019</span> <p class="text-gray-400">Opportunity mission ends after dust storm</p></div> <div class="flex gap-4"><span class="text-gray-500 w-20">2021</span> <p class="text-gray-400">Perseverance lands in Jezero Crater (February)</p></div></div></div></div> <div class="bg-gray-800/30 rounded-xl p-6"><h3 class="text-white font-semibold mb-3">Understanding Mars Imagery</h3> <p class="text-gray-400 text-sm leading-relaxed">Mars rover images are transmitted from Mars to Earth via NASA's Deep Space Network.
					Raw images are unprocessed and show what the cameras actually captured.
					Sol refers to a Martian day (24 hours, 39 minutes) - the primary way mission scientists track time on Mars.
					Each rover carries multiple cameras optimized for different purposes, from navigation to scientific analysis.
					All imagery is publicly available through NASA's Planetary Data System.</p></div></section></main> <footer class="border-t border-gray-800 mt-10"><div class="max-w-7xl mx-auto px-4 py-8"><p class="text-gray-500 text-sm text-center">Data provided by <a href="https://mars.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300">NASA Mars Exploration</a>.
				Images courtesy of NASA/JPL-Caltech.</p></div></footer></div> `);
    Lightbox($$renderer2, { photo: selectedPhoto, onClose: closeLightbox });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
