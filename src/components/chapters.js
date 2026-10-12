const belur = { title: 'Belur Math · Rituals and the Divine Mother', url: 'https://belurmath.org/durga-puja-at-belur-math/' }
const homecoming = { title: 'আনন্দবাজার · ঘরের মেয়ে উমা', url: 'https://www.anandabazar.com/video/durga-puja-2023-anuttama-banerjee-latest-fashion-for-durga-puja-dgtl/cid/1468729' }
export const chapters = [
  {
    name: 'Mahalaya', bengali: 'মহালয়া', ritual: 'The invocation', title: ['DAWN CALLS.', 'MA AWAKENS.'],
    description: 'Before sunrise, Bengal listens and watches. Mahishasura Mardini tells of Ma’s victory over Mahishasura—her strength a shelter, her coming a promise of hope.',
    place: 'BENGAL', time: 'MAHALAYA DAWN', color: '#e8aa61', audio: '/audio/01-agomoni.mp3', frequency: 146.83,
    context: [
      'Mahalaya holds remembrance and anticipation together: families offer tarpan for their ancestors, and turn toward the coming of the Divine Mother.',
      'For generations, the early-morning Mahishasuramardini broadcast, with Birendra Krishna Bhadra’s recitation, has helped give this dawn its familiar voice. Bengali television presentations also bring the story to life through performance.',
      'Here, an original moving tableau evokes that beloved morning: Ma Durga, serene in her protective power, her lion beside her, overcoming Mahishasura. It is an artistic tribute to the story, rather than a recording of a particular programme.',
    ],
    rituals: ['Tarpan and remembrance', 'Mahishasura Mardini', 'The anticipation of Agomoni'],
    sources: [
      { title: 'Akashvani · Mahalaya and Mahishasuramardini', url: 'https://newsonair.gov.in/mahalaya-being-observed-across-west-bengal-with-religious-fervour/' },
      { title: 'আনন্দবাজার · মহালয়ার টেলিভিশন অনুষ্ঠান', url: 'https://www.anandabazar.com/amp/entertainment/actress-payel-de-wil-be-seen-as-mohishashur-mordini-in-sun-bangla-mahalaya-dgtl/cid/1622024' },
    ],
  },
  {
    name: 'Shashti', bengali: 'মহাষষ্ঠী', ritual: 'Uma comes home', title: ['OUR DAUGHTER', 'IS HOME.'],
    description: 'We welcome the Divine Mother as our own Uma, returning to her parents’ home with Lakshmi, Saraswati, Ganesha, and Kartik. The pandal becomes a home prepared with love.',
    place: 'NORTH KOLKATA', time: 'BODHAN AT DUSK', color: '#f1ba78', audio: '/audio/02-pandal.mp3', frequency: 196,
    context: [
      'The mother of the world is also Bengal’s cherished daughter. This closeness is at the heart of Agomoni: the joy of welcoming Uma back to her parents’ home, with her four children beside her.',
      'Shashti brings Bodhan, the ceremonial awakening, along with invitation and preparation for worship. Evening lamps illuminate the family pratima as the days of puja approach.',
      'Lakshmi’s lotus, Saraswati’s veena, Ganesha’s elephant face, and Kartik’s peacock make the family recognizable. In this homecoming, divine grandeur and the affection of an ordinary household meet.',
    ],
    rituals: ['Bodhan · awakening', 'Amantran · invitation', 'Adhivas · preparation'], sources: [homecoming, belur],
  },
  {
    name: 'Saptami', bengali: 'মহাসপ্তমী', ritual: 'The living earth', title: ['THE RIVER', 'WELCOMES LIFE.'],
    description: 'At first light, the Nabapatrika is bathed and carried home. Nine plants, wrapped in a red-bordered white sari, bring Bengal’s living earth into the puja.',
    place: 'THE GHATS', time: 'NABAPATRIKA SNAN', color: '#dac388', audio: '/audio/03-saptami.mp3', frequency: 174.61,
    context: [
      'Nabapatrika means nine plants: banana, colocasia, turmeric, jayanti, bilva, pomegranate, ashoka, arum, and paddy are gathered into a sacred bundle.',
      'On Saptami morning, the bundle is bathed, dressed in a red-bordered white sari, and placed beside Ganesha. Affectionately called Kola Bou, it is a form of sacred plant worship—not simply the story of Ganesha’s wife.',
      'The main days of puja begin. Our scene follows the passage from riverbank to altar: green leaves, water, cloth, and a careful welcome for life itself.',
    ],
    rituals: ['Nabapatrika snan', 'Kola Bou’s red-bordered sari', 'The beginning of the main puja'],
    sources: [
      { title: 'বিডিনিউজ২৪ · সপ্তমীর নবপত্রিকা', url: 'https://bangla.bdnews24.com/bangladesh/d2aadbdc78c2' },
      { title: 'ABP আনন্দ · নবপত্রিকা ও কলাবউ', url: 'https://bengali.abplive.com/district/durga-puja-2023-saptami-today-starts-with-nabapatrika-snan-kola-bou-snan-what-are-the-rituals-1018064' },
    ],
  },
  {
    name: 'Ashtami', bengali: 'মহাষ্টমী', ritual: 'Anjali and devotion', title: ['FLOWERS HELD.', 'HEARTS OPEN.'],
    description: 'With flowers in our hands, we offer pushpanjali. Ma’s gentle gaze gathers us together; at the sacred juncture of Sandhi Puja, prayer deepens into light.',
    place: 'BAGBAZAR', time: 'PUSHPANJALI', color: '#edb951', audio: '/audio/04-anjali.mp3', frequency: 220,
    context: [
      'Pushpanjali is an offering of flowers and prayer. The moment can be deeply personal, even while a whole neighbourhood stands together before Ma.',
      'Sandhi Puja marks the juncture of Ashtami and Navami: the final 24 minutes of one lunar day and the first 24 minutes of the next.',
      'The family tableau remains whole. The lighting grows quieter, lamps gather near the altar, and the journey gives us room to look, remember, and offer our own prayer.',
    ],
    rituals: ['Pushpanjali', 'The shared offering of flowers', 'Sandhi Puja'], sources: [belur],
  },
  {
    name: 'Navami', bengali: 'মহানবমী', ritual: 'The last full day', title: ['ONE MORE DAY', 'WITH MA.'],
    description: 'Dhak fills the pandal. Aarati, incense, and shared bhog keep us close. In the joy of Navami, we already feel how precious these days at home have become.',
    place: 'COLLEGE SQUARE', time: 'NAVAMI AARATI', color: '#ee744a', audio: '/audio/05-dhak.mp3', frequency: 110,
    context: [
      'Navami is the last full day of worship before the farewell of Dashami. Homa is part of the ritual observance; aarati and the sounds of dhak fill the puja space.',
      'The festival is also lived through meeting neighbours, sharing food, and returning once more to the pandal. The remaining hours feel especially dear.',
      'Here, the circle of drums and the warm lamps surround Ma and her children. The celebration stays joyful, with the tenderness of knowing that the visit is drawing to a close.',
    ],
    rituals: ['Navami worship and homa', 'Aarati and dhak', 'Shared bhog and community'],
    sources: [
      { title: 'Belur Math · Navami observance', url: 'https://media.belurmath.org/tag/navami/' },
      { title: 'Incredible India · Bengal’s festival', url: 'https://www.incredibleindia.gov.in/en/festivals-and-events/west-bengal/durga-puja' },
    ],
  },
  {
    name: 'Dashami', bengali: 'বিজয়া দশমী', ritual: 'Until next year', title: ['COME HOME', 'AGAIN, MA.'],
    description: 'We bid our daughter farewell with affection, not distance. The clay returns to the river, and the promise stays with us: আসছে বছর আবার হবে—next year, we will welcome her again.',
    place: 'THE GHATS', time: 'BIJOYA AND FAREWELL', color: '#e6a574', audio: '/audio/06-bijoya.mp3', frequency: 164.81,
    context: [
      'The farewell is intimate: Uma’s visit to her parents’ home is ending. In many traditions, Devi baran and sindur khela accompany the leave-taking; customs vary between households and communities.',
      'The pratima is taken for immersion. The clay returns to the water, while Bijoya carries greetings, embraces, sweets, and renewed bonds into the days that follow.',
      'The homecoming continues in memory. “আসছে বছর আবার হবে”—we will gather again next year—is a promise of return, made with love.',
    ],
    rituals: ['Devi baran · farewell', 'Visarjan · immersion', 'Bijoya greetings'],
    sources: [
      { title: 'আনন্দবাজার · ঘরের মেয়েকে বিদায়', url: 'https://www.anandabazar.com/video/sovabajar-rajbari-prepares-for-idol-immersion-on-dashami-of-durga-puja-2023-dgtl/cid/1469382' },
      { title: 'UNESCO · Clay, craft and homecoming', url: 'https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703' },
    ],
  },
]
export const CHAPTER_COUNT = chapters.length
