/**
 * Offline AI tutor for Space Edu.
 * Used when VITE_GEMINI_API_KEY is not set.
 * Returns contextual space-science answers based on keyword matching.
 */

// ── Topic knowledge base ──────────────────────────────────────────────────────

const TOPICS = [
  {
    keys: ['salom', 'hello', 'hi', 'hey', 'привет', 'assalom', 'start', 'help', 'who are you', 'what can you do'],
    explain: [
      "Salom! 👋 I'm the Space Edu AI tutor. I can help you understand:\n\n• **Planets & the Solar System** — sizes, distances, atmospheres\n• **Stars & Black Holes** — how they form, live, and die\n• **Rockets & Space Exploration** — how we get to space\n• **Physics** — gravity, light, Newton's laws\n• **Central Asian Astronomy** — al-Biruni, Ulugh Beg and their discoveries\n\nWhat would you like to explore today?",
    ],
    quiz: [
      "Let's warm up! 🚀\n\n**Quick question:** How many planets are in our Solar System?\n\nA) 7\nB) 8\nC) 9\nD) 10\n\n*(The answer has been 8 since Pluto was reclassified in 2006!)*",
    ],
    deep: [
      "Welcome to Space Edu! I specialise in astrophysics, orbital mechanics, and the history of astronomy — including the remarkable tradition of Central Asian scholarship (al-Biruni, Ulugh Beg, al-Fergani).\n\nAsk me anything: from Kepler's second law to how a neutron star collapses. What's your topic?",
    ],
  },
  {
    keys: ['solar system', 'planet', 'planets', 'sun', 'orbit', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
    explain: [
      "Our Solar System has **8 planets** orbiting the Sun:\n\n1. ☿ **Mercury** — smallest, no atmosphere, extreme temperatures\n2. ♀ **Venus** — hottest planet (465 °C), thick CO₂ atmosphere\n3. 🌍 **Earth** — only known planet with life\n4. ♂ **Mars** — the Red Planet, 2 tiny moons\n5. ♃ **Jupiter** — largest planet, Great Red Spot storm\n6. ♄ **Saturn** — famous rings made of ice and rock\n7. ⛢ **Uranus** — rotates on its side!\n8. ♆ **Neptune** — strongest winds in the Solar System\n\nThe inner 4 are rocky; the outer 4 are gas/ice giants. 🌌",
      "Think of the Solar System as a giant clock ⏱️\n\nThe **Sun** sits at the centre — it contains **99.86%** of all the mass. The planets orbit it because gravity curves their paths into ellipses (discovered by Kepler in 1609).\n\n**Fun fact:** If the Sun were the size of a basketball, Earth would be the size of a grape — 26 metres away!",
    ],
    quiz: [
      "**Planet Quiz! 🪐**\n\nWhich planet has the shortest day?\n\nA) Mercury (59 Earth days)\nB) Jupiter (9 hours 56 minutes) ✅\nC) Saturn (10 hours 42 minutes)\nD) Earth (23 hours 56 minutes)\n\nJupiter rotates so fast that its equator bulges outward. That's why it looks slightly squashed!",
      "**True or False? 🤔**\n\n*Venus spins in the same direction as all other planets.*\n\n**FALSE!** Venus rotates **backwards** (retrograde). The Sun rises in the west and sets in the east there. Scientists think a massive collision billions of years ago flipped it over.",
    ],
    deep: [
      "The Solar System formed ~4.6 billion years ago from a **protoplanetary disk** — a rotating cloud of gas and dust around the young Sun.\n\n**Planetary formation stages:**\n1. **Accretion** — dust grains stick together → planetesimals\n2. **Runaway growth** — larger bodies attract smaller ones via gravity\n3. **Oligarchic growth** — a few large proto-planets dominate\n4. **Late Heavy Bombardment** (~3.9 Ga) — asteroid barrage that shaped inner planets\n\n**Resonances:** Jupiter's gravity sculpted the asteroid belt and may have influenced Earth's water delivery via carbonaceous chondrite impacts.",
    ],
  },
  {
    keys: ['mars', 'red planet', 'martian', 'olympus', 'perseverance', 'curiosity'],
    explain: [
      "Mars — the **Red Planet** 🔴\n\nMars gets its colour from iron oxide (rust) on its surface. Key facts:\n\n• **Distance from Sun:** 228 million km (1.52 AU)\n• **Day length:** 24 hours 37 minutes (almost like Earth!)\n• **Year length:** 687 Earth days\n• **Moons:** Phobos and Deimos (captured asteroids)\n• **Tallest volcano:** Olympus Mons — 21 km high (2.5× Everest)\n• **Longest canyon:** Valles Marineris — 4,000 km long\n• **Atmosphere:** 95% CO₂, very thin (pressure 0.6% of Earth's)\n\nNASA's *Perseverance* rover is currently exploring Jezero Crater, searching for signs of ancient microbial life. 🤖",
    ],
    quiz: [
      "**Mars Challenge! 🚀**\n\nOlympus Mons on Mars is the tallest volcano in the Solar System. How tall is it?\n\nA) 8.8 km (same as Everest)\nB) 14 km\nC) **21 km** ✅\nD) 35 km\n\nIt's so wide (600 km across) that if you stood at the base, you couldn't see the summit — it would be over the horizon!",
    ],
    deep: [
      "Mars once had a **magnetic field** that protected a thicker atmosphere — evidence from magnetised crustal rocks shows this ended ~4 billion years ago.\n\nWithout the field, solar wind stripped the atmosphere (Mars has 1/100 Earth's atmospheric pressure). Liquid water can no longer exist stably on the surface (triple point of water is near Martian conditions).\n\n**Terraforming Mars** (theoretical): requires raising atmospheric pressure ×150, adding O₂, warming the planet. Energy requirement: ~10²⁶ J — equivalent to ~10¹⁰ Tsar Bombas.\n\nCurrent missions studying subsurface water ice (InSight seismometry) suggest Mars may still be geologically active.",
    ],
  },
  {
    keys: ['black hole', 'singularity', 'event horizon', 'hawking', 'wormhole'],
    explain: [
      "A **black hole** is a region of space where gravity is so strong that nothing — not even light — can escape. 🕳️\n\n**How do they form?**\nWhen a massive star (>20× the Sun's mass) runs out of fuel, it collapses under its own gravity in a fraction of a second.\n\n**Key parts:**\n• **Event horizon** — the point of no return (not a physical surface)\n• **Singularity** — the centre, where known physics breaks down\n• **Accretion disk** — hot gas spiralling in, glowing brightly\n\n**Sizes:**\n• *Stellar*: 10–100 km across\n• *Supermassive*: billions of km — every large galaxy has one at its centre\n\n*Our galaxy's black hole* (Sagittarius A*) is 4 million solar masses — first photographed in 2022! 📸",
    ],
    quiz: [
      "**Black Hole Quiz! 🕳️**\n\nWhat happens to time near a black hole (according to General Relativity)?\n\nA) Time speeds up\nB) **Time slows down** ✅\nC) Time reverses\nD) Time is unaffected\n\nThis is called **gravitational time dilation**. An observer far away would see a clock near a black hole tick slower and slower — eventually appearing to freeze at the event horizon.",
    ],
    deep: [
      "Black holes are described by the **Schwarzschild solution** (1916) to Einstein's field equations:\n\n**Schwarzschild radius:** r_s = 2GM/c²\n\nFor the Sun: r_s ≈ 3 km. For Earth: r_s ≈ 9 mm.\n\n**Hawking radiation** (1974): quantum effects near the event horizon cause black holes to slowly emit thermal radiation and eventually evaporate. The temperature: T = ℏc³/(8πGMk_B) — inversely proportional to mass, so smaller black holes are *hotter* and evaporate *faster*.\n\n**Information paradox:** What happens to information that falls in? Unresolved — one of the deepest open problems in theoretical physics.",
    ],
  },
  {
    keys: ['star', 'stars', 'sun', 'stellar', 'nebula', 'supernova', 'neutron star', 'white dwarf'],
    explain: [
      "Stars are giant balls of **plasma** held together by gravity and powered by **nuclear fusion** ⭐\n\n**Life cycle of a star:**\n1. **Nebula** → cloud of gas and dust collapses\n2. **Protostar** → heating begins, gravity compresses core\n3. **Main sequence** → hydrogen → helium fusion (the Sun is here, ~5 billion years in)\n4. **Red Giant** → outer layers expand when core H runs out\n5. **End:**\n   - Small stars → **White Dwarf** → slowly cools\n   - Large stars → **Supernova** explosion → **Neutron Star** or **Black Hole**\n\nOur Sun will become a red giant in ~5 billion years, swallowing Mercury and Venus.",
      "The Sun ☀️ — facts:\n\n• **Distance from Earth:** 150 million km (1 AU) — light takes 8 min 20 sec\n• **Diameter:** 1.39 million km (109× Earth)\n• **Surface temperature:** 5,500 °C\n• **Core temperature:** 15 million °C\n• **Age:** 4.6 billion years\n• **Fuel remaining:** ~5 billion years of hydrogen\n• **Energy output:** 3.8 × 10²⁶ watts\n\nEvery second, the Sun converts **4 million tonnes** of mass into pure energy via E = mc².",
    ],
    quiz: [
      "**Stellar Quiz! ⭐**\n\nWhat is the nearest star to Earth (other than the Sun)?\n\nA) Betelgeuse\nB) Sirius\nC) **Proxima Centauri** ✅\nD) Vega\n\nProxima Centauri is 4.24 light-years away. Travelling at the speed of the fastest spacecraft ever built (Parker Solar Probe at ~690,000 km/h), it would take about **6,600 years** to reach it.",
    ],
    deep: [
      "Stellar nucleosynthesis: stars are the universe's **element factories**.\n\n**Fusion chain in main-sequence stars:**\n4 ¹H → ¹He + 2e⁺ + 2νₑ + 26.7 MeV (pp-chain, dominant in Sun)\n\n**Heavier elements** form in massive stars via CNO cycle and s-process (slow neutron capture).\n\n**Elements beyond iron** require a **supernova** — only then is there enough energy to fuse heavy nuclei (r-process, rapid neutron capture). Gold, platinum, uranium — all forged in stellar explosions.\n\nThe famous phrase: *'We are all made of star stuff'* (Sagan) — literally true. Every atom in your body heavier than hydrogen was made in a stellar core or supernova.",
    ],
  },
  {
    keys: ['galaxy', 'galaxies', 'milky way', 'andromeda', 'hubble', 'universe', 'cosmos'],
    explain: [
      "A **galaxy** is a gravitationally bound system of stars, gas, dust, and dark matter 🌌\n\n**Types:**\n• **Spiral** (like the Milky Way) — rotating disk with spiral arms\n• **Elliptical** — older, more stars, less gas\n• **Irregular** — no defined shape, often from collisions\n\n**Our Milky Way:**\n• 100,000 light-years across\n• 200–400 billion stars\n• Supermassive black hole at centre: Sagittarius A* (4M solar masses)\n• Our Solar System is in the **Orion Arm**, ~26,000 light-years from centre\n\n**The Andromeda galaxy** (M31) is our nearest large neighbour — 2.5 million light-years away. In ~4.5 billion years, it will merge with the Milky Way!",
    ],
    quiz: [
      "**Galaxy Quiz! 🌌**\n\nHow many galaxies are estimated to exist in the observable universe?\n\nA) Millions\nB) Billions\nC) **Trillions (2 trillion)** ✅\nD) Quadrillions\n\nA 2016 study using Hubble Space Telescope data estimated ~2 × 10¹² galaxies — 10× more than previously thought, as many smaller galaxies were too faint to see earlier.",
    ],
    deep: [
      "The **large-scale structure** of the universe is a cosmic web:\n- **Filaments** — long chains of galaxy clusters\n- **Walls** — flat sheets of galaxies (e.g., the Great Wall, ~500 Mpc long)\n- **Voids** — near-empty regions up to 300 Mpc across (Boötes Void)\n\n**Galaxy formation:** hierarchical — small structures merged first, large ones last.\n\n**Hubble's Law:** v = H₀ × d (recession speed proportional to distance)\nH₀ ≈ 67–73 km/s/Mpc (tension between methods is an unsolved problem — the 'Hubble tension').\n\nThis implies the universe is ~13.8 billion years old.",
    ],
  },
  {
    keys: ['gravity', 'gravitational', 'newton', 'mass', 'weight', 'fall', 'orbit', 'escape velocity'],
    explain: [
      "**Gravity** is the force of attraction between any two objects that have mass 🍎\n\n**Newton's Law of Universal Gravitation:**\nF = G × (m₁ × m₂) / r²\n\nThe larger the masses, and the closer they are, the stronger the pull.\n\n**Key concept:** On Earth's surface:\n• g = 9.8 m/s² — objects fall 9.8 m/s faster every second\n• A ball and a feather fall at the SAME rate in a vacuum (Galileo proved this!)\n\n**Escape velocity** — how fast you need to go to escape Earth's gravity:\n• Earth: 11.2 km/s (~40,000 km/h)\n• Moon: 2.4 km/s\n• Sun: 617.5 km/s\n• Black hole: > speed of light ♾️",
    ],
    quiz: [
      "**Gravity Quiz! 🌍**\n\nYou weigh 60 kg on Earth. How much would you weigh on the Moon?\n\nA) 60 kg\nB) **10 kg** ✅\nC) 6 kg\nD) 360 kg\n\nThe Moon's gravity is 1/6 of Earth's (g_moon ≈ 1.62 m/s²). So your weight — the force of gravity — becomes 60 ÷ 6 = **10 kg-force**. Your *mass* stays 60 kg everywhere!",
    ],
    deep: [
      "Newton's gravity works brilliantly for most situations, but Einstein's **General Relativity (GR)** gives a deeper picture.\n\n**GR key idea:** Mass curves spacetime. What we call 'gravity' is actually objects following the straightest possible path (geodesic) through curved spacetime.\n\n**Einstein field equations:** G_μν + Λg_μν = (8πG/c⁴) T_μν\n\n**GR effects not in Newton:**\n• Gravitational lensing (light bends around mass)\n• Gravitational time dilation (clocks tick slower in gravity — GPS corrects for this!)\n• Gravitational waves (LIGO detected in 2015 — ripples in spacetime)\n• Perihelion precession of Mercury (resolved by GR, not Newton)",
    ],
  },
  {
    keys: ['light', 'speed of light', 'photon', 'electromagnetic', 'wavelength', 'spectrum', 'laser'],
    explain: [
      "**Light** is electromagnetic radiation — oscillating electric and magnetic fields that travel through space ⚡\n\n**Speed of light in vacuum:** c = 299,792,458 m/s (~300,000 km/s)\n\nThis is the ultimate speed limit in the universe. Nothing with mass can reach it.\n\n**Why?** As you accelerate closer to c, your effective mass increases → you need more energy → infinite energy to actually reach c.\n\n**Light travel times:**\n• Earth ↔ Moon: 1.3 seconds\n• Earth ↔ Sun: 8 minutes 20 seconds\n• Earth ↔ Proxima Centauri: 4.24 years\n• Edge of observable universe: ~46 billion years!\n\n**Light as particles and waves:** Photons have zero mass but carry energy: E = hf (h = Planck's constant).",
    ],
    quiz: [
      "**Light Quiz! ⚡**\n\nIf the Sun suddenly disappeared, how long before we noticed the darkness on Earth?\n\nA) Instantly\nB) **8 minutes 20 seconds** ✅\nC) 1 day\nD) 1 year\n\nLight from the Sun takes exactly 8 min 20 sec to reach Earth (150 million km ÷ 300,000 km/s). We would also continue to feel the Sun's gravity for those same 8 minutes, because gravity also propagates at the speed of light according to General Relativity!",
    ],
    deep: [
      "Maxwell's equations (1865) unified electricity, magnetism, and light — one of physics's greatest achievements.\n\n**Electromagnetic spectrum** (low→high frequency):\nRadio → Microwave → Infrared → Visible → UV → X-ray → Gamma ray\n\n**Cosmic Microwave Background (CMB):** The oldest light in the universe (380,000 years after Big Bang) — microwaves at 2.725 K, nearly perfectly uniform, detected by COBE/WMAP/Planck satellites.\n\n**Special Relativity consequences from c = const:**\n• Time dilation: Δt' = Δt / √(1 − v²/c²)\n• Length contraction: L' = L × √(1 − v²/c²)\n• Mass-energy equivalence: E = mc²",
    ],
  },
  {
    keys: ['rocket', 'spacecraft', 'launch', 'spacex', 'nasa', 'iss', 'space station', 'astronaut', 'cosmonaut', 'elon musk', 'starship'],
    explain: [
      "**How do rockets work?** 🚀\n\nRockets use **Newton's Third Law**: *For every action, there is an equal and opposite reaction.*\n\nBurning fuel expels hot gas downward → rocket is pushed upward.\n\n**Rocket equation (Tsiolkovsky, 1903):**\nΔv = v_e × ln(m₀/m_f)\n\n- v_e = exhaust velocity\n- m₀ = initial mass (with fuel)\n- m_f = final mass (empty)\n\n**Key missions:**\n• **Sputnik 1** (1957) — first satellite (USSR)\n• **Apollo 11** (1969) — first humans on the Moon\n• **ISS** — in orbit since 1998, 400 km up\n• **SpaceX Starship** — largest rocket ever built, fully reusable\n\nAstronaut Soyuz capsules dock at the ISS in just **6 hours** after launch!",
    ],
    quiz: [
      "**Space Exploration Quiz! 🚀**\n\nWho was the first human in space?\n\nA) Neil Armstrong\nB) Buzz Aldrin\nC) **Yuri Gagarin** ✅\nD) Alan Shepard\n\nYuri Gagarin (USSR) made a single orbit of Earth on **April 12, 1961** in Vostok 1 — 108 minutes in space. April 12 is now celebrated as **International Day of Human Space Flight**. Uzbekistan's own Salizhan Sharipov flew to the ISS in 2004–2005!",
    ],
    deep: [
      "**Orbital mechanics fundamentals:**\n\nLow Earth Orbit (LEO): v ≈ 7.8 km/s, period ~90 min\nGeostationary orbit: 35,786 km altitude, v = 3.07 km/s, period = 24 h\n\n**Hohmann transfer orbit** — the most fuel-efficient path between two circular orbits: fire engine at point A (apoapsis of transfer ellipse), then again at point B.\n\n**SpaceX innovations:**\n- First reusable orbital-class booster (Falcon 9, 2015)\n- Starship: 9 Raptor engines per sea-level stage, full-flow staged combustion cycle (Isp ~380 s)\n- Goal: Mars colonisation, reducing cost to orbit from ~$10,000/kg → ~$100/kg\n\n**ISS:** 420 tonnes, 109m wide, 6 crew. Orbit decays ~2 km/month; boosted periodically by docked spacecraft.",
    ],
  },
  {
    keys: ['biruni', 'al-biruni', 'ulugh beg', 'al-khwarizmi', 'uzbekistan', 'central asia', 'samarkand', 'astronomy history', 'medieval astronomy', 'fergani', 'al-fergani'],
    explain: [
      "Central Asia has an incredible astronomical heritage! 🌟\n\n**Al-Biruni (973–1048 AD)** — born in present-day Uzbekistan\n• First scientist to accurately measure Earth's circumference using mountain trigonometry\n• His result: ~6,339 km radius (actual: 6,371 km — just 0.5% off!)\n• Suggested Earth revolves around the Sun — 500 years before Copernicus\n• Wrote *Kitab al-Qanun al-Masudi* — comprehensive astronomy encyclopedia\n\n**Ulugh Beg (1394–1449)** — Sultan and astronomer of Samarkand\n• Built the largest pre-telescopic observatory in the world\n• Catalogued **1,018 stars** with remarkable precision\n• His star positions were accurate to ±40 arcseconds\n• Calculated the length of the year: 365 days, 5 hours, 49 min, 15 sec (off by only 58 seconds!)\n\nSamarkand was the Silicon Valley of medieval science 🏛️",
      "**Al-Khwarizmi (780–850 AD)** — mathematician from Khwarezm (modern Uzbekistan)\n• Invented **algebra** (the word comes from his book *Al-Kitab al-Mukhtasar fi Hisab al-Jabr*)\n• The word **'algorithm'** comes from the Latin transliteration of his name\n• Improved Ptolemy's world map with 2,402 coordinates\n• His works introduced Hindu-Arabic numerals to Europe\n\nWithout al-Khwarizmi, there would be no modern computing, no GPS, no space navigation.",
    ],
    quiz: [
      "**Central Asian Astronomy Quiz! 🏛️**\n\nUlugh Beg built his famous observatory in which city?\n\nA) Bukhara\nB) Tashkent\nC) **Samarkand** ✅\nD) Khiva\n\nThe Ulugh Beg Observatory (built 1420–1429) had a giant sextant — essentially a 40-metre arc carved into a hill. It was so precise that his star catalogue wasn't surpassed in accuracy until the invention of the telescope 200 years later!",
    ],
    deep: [
      "**The Islamic Golden Age astronomical tradition (8th–15th century):**\n\nCentral Asian scholars preserved, translated, and *improved* Greek astronomical knowledge:\n\n1. **Al-Fergani (c.800–870)** — wrote *Elements of Astronomy*, used by Dante for his cosmology\n2. **Al-Biruni** — pioneer of geodesy; introduced the concept of the Earth's radius measurement\n3. **Ibn al-Haytham (965–1040)** — first correct model of optics; the pinhole camera\n4. **Ulugh Beg** — planetary theory corrections to Ptolemy's Almagest\n\n**The Samarkand school's legacy:**\nUlugh Beg's student Ali Qushji carried the observatory's methods to Istanbul, influencing Ottoman science — a direct bridge to European Renaissance astronomy.\n\nHis star catalogue (Zij-i-Sultani, 1437) was translated and published in Oxford in 1665.",
    ],
  },
  {
    keys: ['big bang', 'origin', 'universe began', 'cosmic inflation', 'dark matter', 'dark energy'],
    explain: [
      "The **Big Bang** — the origin of everything 💥\n\n~13.8 billion years ago, the universe began as an incredibly hot, dense point and rapidly expanded.\n\n**Timeline:**\n• **0 sec** — Big Bang singularity\n• **10⁻³² sec** — Cosmic inflation (universe expands faster than light!)\n• **3 minutes** — Protons and neutrons form; hydrogen and helium nuclei\n• **380,000 years** — Atoms form; universe becomes transparent (CMB released)\n• **200 million years** — First stars ignite 🌟\n• **13.8 billion years** — Today\n\n**Evidence for Big Bang:**\n1. Universe is expanding (Hubble, 1929)\n2. Cosmic Microwave Background radiation (CMB)\n3. Abundance of light elements matches predictions\n\n**Dark matter (27%)** and **Dark energy (68%)** make up 95% of the universe — we can't see them, but we know they're there from their effects.",
    ],
    quiz: [
      "**Cosmology Quiz! 🌌**\n\nWhat percentage of the universe is made of ordinary matter (atoms, stars, planets, you)?\n\nA) 100%\nB) 50%\nC) 25%\nD) **~5%** ✅\n\nThe other 95%:\n• **~27% Dark Matter** — invisible, detectable by gravity (holds galaxies together)\n• **~68% Dark Energy** — mysterious force causing the universe's expansion to *accelerate*\n\nWe literally don't know what 95% of the universe is made of — science's greatest mystery! 🔭",
    ],
    deep: [
      "**Standard Cosmological Model (ΛCDM):**\nΛ = cosmological constant (dark energy), CDM = cold dark matter\n\n**Friedmann equations** describe the universe's expansion:\nH² = (8πG/3)ρ − kc²/a²\n\nwhere H = Hubble parameter, ρ = energy density, k = curvature, a = scale factor.\n\n**Inflation:** Explains the CMB uniformity problem and flatness problem. Alan Guth (1980): exponential expansion at t ≈ 10⁻³⁶ s, driven by a scalar field (inflaton). Stretches quantum fluctuations into large-scale structure seeds.\n\n**Open questions:**\n• Nature of dark matter (WIMPs? Axions? Primordial black holes?)\n• Dark energy: cosmological constant or quintessence?\n• Matter-antimatter asymmetry (why is there anything?)\n• Quantum gravity at the Planck scale (10⁻³⁵ m, 10⁻⁴³ s)",
    ],
  },
  {
    keys: ['moon', 'lunar', 'apollo', 'tide', 'eclipse'],
    explain: [
      "The **Moon** — Earth's natural satellite 🌕\n\n**Facts:**\n• Distance: 384,400 km (average)\n• Diameter: 3,474 km (¼ of Earth's)\n• Surface gravity: 1/6 of Earth's\n• No atmosphere, no liquid water on surface\n• Surface temperature: −173°C (night) to +127°C (day)\n• Rotation: tidally locked — always shows the same face to Earth\n\n**The Moon causes tides** — its gravity pulls Earth's oceans into a bulge. As Earth rotates, different parts pass through this bulge → high and low tides (twice daily).\n\n**Lunar eclipses:** Earth's shadow falls on the Moon → red 'Blood Moon' (light filtered through Earth's atmosphere)\n\n**Apollo 11 (July 20, 1969):** Neil Armstrong and Buzz Aldrin — first humans on the Moon. 12 astronauts walked on the Moon total.",
    ],
    quiz: [
      "**Moon Quiz! 🌕**\n\nWhy does the Moon always show the same face to Earth?\n\nA) The Moon doesn't rotate\nB) **The Moon rotates once per orbit (tidal locking)** ✅\nC) Earth's gravity stops the Moon rotating\nD) The Moon is a perfect sphere\n\nTidal locking: Earth's gravity created a slight bulge in the Moon. Over millions of years, the drag slowed the Moon's rotation until it matched its orbital period (~27.3 days). Most large moons in the Solar System are tidally locked to their planets!",
    ],
    deep: [
      "**Giant Impact Hypothesis** — the leading model for Moon formation:\n\n~4.5 billion years ago, a Mars-sized body (Theia) collided with early Earth at ~15 km/s. The impact ejected vaporised material into orbit, which then accreted into the Moon.\n\n**Evidence:**\n• Moon's density matches Earth's mantle (low iron content)\n• Oxygen isotope ratios of Moon rocks identical to Earth's\n• Moon's lack of volatile elements (water, carbon)\n\n**The Moon is slowly drifting away** from Earth: 3.8 cm/year (measured by laser retroreflectors left by Apollo). In ~600 million years, total solar eclipses will no longer be possible as the Moon will appear too small in the sky.\n\n**Lunar farside:** First photographed by Soviet Luna 3 (1959). Has more craters — thicker crust means less volcanic resurfacing than nearside.",
    ],
  },
  {
    keys: ['quantum', 'quantum physics', 'quark', 'particle', 'atom', 'electron', 'proton', 'neutron', 'nuclear'],
    explain: [
      "**Quantum Physics** — the science of the very small ⚛️\n\nAt the scale of atoms and particles, the rules of physics become very strange:\n\n1. **Wave-particle duality** — electrons behave like both waves AND particles (double-slit experiment)\n2. **Uncertainty principle** (Heisenberg) — you cannot know both position AND momentum precisely at the same time: Δx × Δp ≥ ℏ/2\n3. **Quantisation** — energy comes in discrete packets (quanta). An electron can only be at certain energy levels\n4. **Quantum tunnelling** — particles can pass through barriers they classically shouldn't (how the Sun fuses hydrogen!)\n5. **Superposition** — a particle can be in multiple states at once until measured\n\nThis is why transistors (and all computers!) work — they exploit quantum effects.",
    ],
    quiz: [
      "**Quantum Quiz! ⚛️**\n\nWhich famous thought experiment involves a cat that is simultaneously alive and dead?\n\nA) Maxwell's Demon\nB) **Schrödinger's Cat** ✅\nC) Heisenberg's Observer\nD) Einstein's Box\n\nErwin Schrödinger devised this in 1935 to illustrate the 'absurdity' of quantum superposition at the macroscopic scale. A cat in a sealed box with a quantum-triggered poison: until you open the box and observe, the cat is theoretically in superposition of alive AND dead. (Don't worry — no real cats were harmed in quantum mechanics!)",
    ],
    deep: [
      "**Standard Model of Particle Physics:**\n\nFundamental particles:\n- **Quarks** (6 types: u, d, c, s, t, b) → combine to form protons, neutrons\n- **Leptons** (electron, muon, tau + 3 neutrinos)\n- **Bosons** (force carriers): photon (EM), W±/Z (weak), gluon (strong), Higgs\n\n**Proton:** uud quarks bound by gluons (QCD — Quantum Chromodynamics)\n**Neutron:** udd quarks\n\nThe Standard Model does NOT include gravity. Reconciling quantum mechanics with General Relativity is the greatest unsolved problem in physics — the goal of string theory, loop quantum gravity, and others.\n\n**Quantum field theory:** Particles are excitations of underlying fields that permeate all of spacetime.",
    ],
  },
  {
    keys: ['comet', 'asteroid', 'meteor', 'meteorite', 'halley', 'impact', 'dinosaur'],
    explain: [
      "**Comets, Asteroids, and Meteors** ☄️\n\n**Comets:**\n• Icy bodies from the Kuiper Belt or Oort Cloud\n• When near the Sun, ice vaporises → beautiful glowing tail (always points away from Sun!)\n• Famous example: Halley's Comet — visible every 75–76 years (next: 2061)\n\n**Asteroids:**\n• Rocky/metallic bodies, mostly in the **Asteroid Belt** between Mars and Jupiter\n• Largest: Ceres (dwarf planet, ~940 km)\n\n**Meteors:**\n• 'Shooting stars' — tiny particles burning up in Earth's atmosphere\n• **Meteorite** = one that hits the ground\n\n**Mass Extinction:** 66 million years ago, a 10 km asteroid hit Yucatán, Mexico → Chicxulub crater → wiped out dinosaurs. This is the most well-documented asteroid impact event.",
    ],
    quiz: [
      "**Comet Quiz! ☄️**\n\nWhy does a comet's tail always point *away* from the Sun?\n\nA) The comet is slowing down\nB) Gravity from other planets\nC) **Solar wind and radiation pressure push the tail away** ✅\nD) The comet is spinning\n\nThe Sun emits a constant stream of charged particles (solar wind) and radiation that pushes the comet's evaporated gas and dust away. This means a comet's tail can actually point *towards* the comet's direction of travel when it's moving away from the Sun!",
    ],
    deep: [
      "**Solar System small bodies classification:**\n\n**Kuiper Belt** (30–50 AU): icy bodies, source of short-period comets. Pluto is here.\n**Oort Cloud** (2,000–100,000 AU): spherical shell, source of long-period comets (e.g. Hale-Bopp, period 2,520 years)\n\n**Near-Earth Objects (NEOs):** ~30,000 known asteroids with orbits crossing Earth's path. NASA's Planetary Defense Coordination Office tracks them.\n\n**DART mission (2022):** NASA deliberately crashed a spacecraft into asteroid Dimorphos, changing its orbit by 32 minutes — the first test of planetary defense technology. Kinetic impactor concept works!\n\n**Composition of chondrites** (primitive asteroids): reflect Solar System nebula composition — key record of early solar system chemistry.",
    ],
  },
];

// ── Fallback responses ────────────────────────────────────────────────────────

const FALLBACK = {
  explain: [
    "That's a great question! Space science is full of fascinating topics. Could you be more specific? For example:\n\n• **'Explain black holes'**\n• **'How do rockets work?'**\n• **'Tell me about Mars'**\n• **'What is the Big Bang?'**\n• **'Who was Ulugh Beg?'**\n\nI'm here to help you explore the universe! 🚀",
    "I want to make sure I give you the best answer. Are you asking about:\n\n🪐 **Planets** — our Solar System, Mars, Jupiter, Saturn...\n⭐ **Stars** — how they form, live, and die\n🕳️ **Black holes** — singularities and event horizons\n🚀 **Space exploration** — rockets, ISS, SpaceX\n🏛️ **History of astronomy** — Ulugh Beg, al-Biruni\n⚛️ **Physics** — gravity, light, quantum mechanics\n\nJust ask — I'll dive in!",
  ],
  quiz: [
    "Let's do a quick quiz! 🧠\n\n**What is the approximate age of the universe?**\n\nA) 4.6 billion years\nB) **13.8 billion years** ✅\nC) 100 billion years\nD) 1 trillion years\n\nThe universe is 13.8 billion years old, measured from the Big Bang. Our Solar System is much younger — only 4.6 billion years old!",
    "Ready for a challenge? 🌟\n\n**Which planet has the most moons?**\n\nA) Jupiter (95 moons)\nB) **Saturn (146 moons)** ✅\nC) Uranus (28 moons)\nD) Neptune (16 moons)\n\nSaturn overtook Jupiter in 2023 when astronomers confirmed 62 new moons! Many are small irregular moons captured by Saturn's gravity.",
  ],
  deep: [
    "To give you a deep dive, I need to know your specific topic! 🔬\n\nI can go deep on:\n- **Orbital mechanics** and Kepler's laws\n- **Stellar evolution** and nucleosynthesis\n- **General Relativity** and spacetime curvature\n- **Quantum field theory** and the Standard Model\n- **Cosmology** — Big Bang, CMB, inflation\n- **Medieval Islamic astronomy** — al-Biruni, Ulugh Beg\n\nWhat would you like to explore?",
  ],
};

// ── Engine ────────────────────────────────────────────────────────────────────

function detectTopic(message) {
  const lower = message.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const topic of TOPICS) {
    const score = topic.keys.reduce((acc, key) => acc + (lower.includes(key) ? key.length : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a mock AI response.
 * @param {string} message - Latest user message
 * @param {string} context - Current lesson/topic context
 * @param {'explain'|'quiz'|'deep'} mode
 * @returns {Promise<string>}
 */
export async function getMockAIResponse(message, context, mode = 'explain') {
  // Simulate thinking delay (0.8–1.8 seconds)
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1000));

  // Try to match the message first, then fall back to context
  let topic = detectTopic(message);
  if (!topic && context) topic = detectTopic(context);

  if (topic) {
    const pool = topic[mode] || topic.explain;
    return pick(pool);
  }

  const fallbackPool = FALLBACK[mode] || FALLBACK.explain;
  return pick(fallbackPool);
}
