export type Locale = 'en' | 'de' | 'hr'

export type HeroSlideTranslation = {
  kicker: string
  title: string
  accent: string
  subtext: string
}

export type TranslationSchema = {
  nav: {
    about: string
    gallery: string
    discover: string
    faq: string
    contact: string
    checkAvailability: string
    exploreVilla: string
    viewSpace: string
  }
  hero: {
    slides: HeroSlideTranslation[]
    meta: {
      coords: string
      scroll: string
      estate: string
    }
  }
  perspective: {
    kicker: string
    title: string
    accent: string
    body: string
    quote: string
  }
  places: {
    kicker: string
    title: string
    accent: string
    body: string
    pool: { label: string; title: string }
    bbq: { label: string; title: string }
    bedrooms: { label: string; title: string }
  }
  week: {
    kicker: string
    title: string
    accent: string
    body: string
    rows: { title: string; body: string }[]
  }
  gallery: {
    kicker: string
    title: string
    accent: string
    body: string
    cta: string
  }
  reviews: {
    kicker: string
    title: string
    accent: string
    body: string
    count: string
    direct: string
  }
  faq: {
    kicker: string
    title: string
    accent: string
    body: string
  }
  booking: {
    kicker: string
    title: string
    accent: string
    body: string
    name: string
    email: string
    phone: string
    checkIn: string
    checkOut: string
    guests: string
    pets: string
    notes: string
    submit: string
    sending: string
    successTitle: string
    successMessage: string
  }
  footer: {
    tagline: string
    contactUs: string
    rights: string
  }
}

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'hr', label: 'Hrvatski', flag: 'HR' },
]

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    nav: {
      about: 'About Villa',
      gallery: 'Gallery',
      discover: 'Discover',
      faq: 'FAQ',
      contact: 'Contact',
      checkAvailability: 'Check availability',
      exploreVilla: 'Explore the villa',
      viewSpace: 'View the space',
    },
    hero: {
      slides: [
        {
          kicker: 'VILLA SAN ANTONIO',
          title: 'Your Private Oasis',
          accent: 'near Šibenik.',
          subtext: 'A fully private villa for eight near Šibenik, with a heated pool, BBQ house and a fenced garden made for slow days.',
        },
        {
          kicker: 'A private villa for families & friends',
          title: 'Space to Be',
          accent: 'Together.',
          subtext: 'Complete privacy, three quiet bedrooms, and expansive indoor and outdoor living areas built for gathering.',
        },
        {
          kicker: 'Surrounded by greenery with open views and pure peace',
          title: 'Quiet Luxury',
          accent: 'in Dalmatia.',
          subtext: 'Nestled in the tranquil Dalmatian hinterland, just minutes away from pristine beaches and Krka National Park.',
        },
        {
          kicker: 'Pool days. Sunset nights. Zero stress',
          title: 'Your Summer',
          accent: 'Headquarters.',
          subtext: 'Heated pool with waterfall, sun loungers, outdoor fireplace, and stargazing under the clear Mediterranean sky.',
        },
      ],
      meta: {
        coords: '43.647° N, 16.055° E · Podine',
        scroll: 'Scroll to explore',
        estate: 'Estate 01 · 8 Guests · Heated pool',
      },
    },
    perspective: {
      kicker: 'Our perspective',
      title: 'The best weeks are never',
      accent: 'found by accident.',
      body: 'One villa, one family at a time. Complete privacy, space for eight, and a heated pool that stays warm long after sunset. Most of our guests come back, and the best dates go first.',
      quote: '“Start the day with coffee by the pool, spend afternoons in the sun, and gather in the evening for BBQ dinners under the stars.”',
    },
    places: {
      kicker: 'The places',
      title: 'Built for the',
      accent: 'long days.',
      body: 'Three settings our guests remember most, each with its own rhythm and its own hour of the day.',
      pool: {
        label: 'Pool & terrace · all day',
        title: 'The heated pool',
      },
      bbq: {
        label: 'BBQ house · after eight',
        title: 'The fire room',
      },
      bedrooms: {
        label: 'Bedrooms · past midnight',
        title: 'Three quiet rooms',
      },
    },
    week: {
      kicker: 'The week',
      title: 'How the week',
      accent: 'unfolds.',
      body: 'No schedule, no shared spaces, nothing to book at 8 a.m. The days structure themselves here.',
      rows: [
        {
          title: 'Morning light & quiet hours',
          body: 'The sun rises behind the pine hills. Coffee by the heated pool before anyone else is awake.',
        },
        {
          title: 'The long afternoon in the water',
          body: 'Waterfall running, sun on the loungers, and no schedule to keep. Kids in the pool, parents in the shade.',
        },
        {
          title: 'Dinner from the stone fireplace',
          body: 'Firewood ready, local fish on the grill, and long dinners in the BBQ house with the doors wide open.',
        },
        {
          title: 'Late nights under Dalmatian skies',
          body: 'Zero city glow. Heated pool water stays warm past midnight while you watch the constellations.',
        },
      ],
    },
    gallery: {
      kicker: 'The current edit',
      title: 'Look',
      accent: 'closer.',
      body: 'Glimpses of daily life at Villa San Antonio, from morning sun to midnight swims.',
      cta: 'Open full album',
    },
    reviews: {
      kicker: 'Guest stories',
      title: 'Words from our',
      accent: 'guests.',
      body: 'Direct feedback from families and groups who spent their summer at Villa San Antonio.',
      count: 'reviews',
      direct: 'Direct reviews',
    },
    faq: {
      kicker: 'Good to know',
      title: 'Frequently asked',
      accent: 'questions.',
      body: 'Everything you need to know about arrival, house rules, payments and amenities.',
    },
    booking: {
      kicker: 'Direct inquiry',
      title: 'Hold your dates for',
      accent: 'this summer.',
      body: 'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.',
      name: 'Full Name',
      email: 'Email address',
      phone: 'Phone / WhatsApp',
      checkIn: 'Check-in date',
      checkOut: 'Check-out date',
      guests: 'Number of guests',
      pets: 'Bringing pets?',
      notes: 'Questions or special requests',
      submit: 'Send booking inquiry',
      sending: 'Sending...',
      successTitle: 'Inquiry received',
      successMessage: 'Thank you! We will check availability for your dates and get back to you within 24 hours.',
    },
    footer: {
      tagline: 'A private holiday villa in the Dalmatian hills near Šibenik.',
      contactUs: 'Contact & Location',
      rights: 'All rights reserved.',
    },
  },
  de: {
    nav: {
      about: 'Über die Villa',
      gallery: 'Galerie',
      discover: 'Entdecken',
      faq: 'FAQ',
      contact: 'Kontakt',
      checkAvailability: 'Verfügbarkeit prüfen',
      exploreVilla: 'Villa erkunden',
      viewSpace: 'Raum ansehen',
    },
    hero: {
      slides: [
        {
          kicker: 'VILLA SAN ANTONIO',
          title: 'Ihre private Oase',
          accent: 'nahe Šibenik.',
          subtext: 'Eine vollständig private Villa für acht Personen nahe Šibenik mit beheiztem Pool, Grillhaus und eingezäuntem Garten für erholsame Tage.',
        },
        {
          kicker: 'Eine private Villa für Familien & Freunde',
          title: 'Raum für gemeinsame',
          accent: 'Momente.',
          subtext: 'Vollständige Privatsphäre, drei ruhige Schlafzimmer und großzügige Innen- und Außenbereiche für unvergessliche Tage.',
        },
        {
          kicker: 'Umgeben von viel Grün mit weitem Blick und absoluter Ruhe',
          title: 'Stiller Luxus',
          accent: 'in Dalmatien.',
          subtext: 'Eingebettet in das ruhige dalmatinische Hinterland, nur wenige Minuten von traumhaften Stränden und dem Nationalpark Krka entfernt.',
        },
        {
          kicker: 'Tage am Pool. Nächte bei Sonnenuntergang. Kein Stress',
          title: 'Ihr Sommer-',
          accent: 'Refugium.',
          subtext: 'Beheizter Pool mit Wasserfall, Sonnenliegen, Außenkamin und Sternenbeobachtung unter klarem Mittelmeerhimmel.',
        },
      ],
      meta: {
        coords: '43.647° N, 16.055° E · Podine',
        scroll: 'Nach unten scrollen',
        estate: 'Anwesen 01 · 8 Gäste · Beheizter Pool',
      },
    },
    perspective: {
      kicker: 'Unsere Perspektive',
      title: 'Die besten Wochen entstehen',
      accent: 'nie durch Zufall.',
      body: 'Eine Villa, eine Familie zur gleichen Zeit. Vollkommene Privatsphäre, Platz für acht und ein beheizter Pool, der auch lange nach Sonnenuntergang warm bleibt. Die meisten Gäste kommen wieder.',
      quote: '„Beginnen Sie den Tag mit Kaffee am Pool, verbringen Sie den Nachmittag in der Sonne und versammeln Sie sich am Abend zum Barbecue unter den Sternen.“',
    },
    places: {
      kicker: 'Die Bereiche',
      title: 'Geschaffen für',
      accent: 'lange Sommertage.',
      body: 'Drei Orte, an die sich unsere Gäste am liebsten erinnern – jeder mit seinem eigenen Rhythmus und seiner eigenen Tageszeit.',
      pool: {
        label: 'Pool & Terrasse · Den ganzen Tag',
        title: 'Der beheizte Pool',
      },
      bbq: {
        label: 'Grillhaus · Nach acht',
        title: 'Das Kaminzimmer',
      },
      bedrooms: {
        label: 'Schlafzimmer · Nach Mitternacht',
        title: 'Drei ruhige Zimmer',
      },
    },
    week: {
      kicker: 'Die Woche',
      title: 'Wie sich die Woche',
      accent: 'entfaltet.',
      body: 'Kein Zeitplan, keine geteilten Räume, kein Wecker um 8 Uhr. Die Tage strukturieren sich hier von ganz allein.',
      rows: [
        {
          title: 'Morgenlicht & Stille Stunden',
          body: 'Die Sonne geht hinter den Pinienhügeln auf. Kaffee am beheizten Pool, bevor jemand anderes wach ist.',
        },
        {
          title: 'Der lange Nachmittag im Wasser',
          body: 'Wasserfall plätschert, Sonne auf den Liegen und kein Terminplan. Kinder im Pool, Eltern im Schatten.',
        },
        {
          title: 'Abendessen vom Steinkamin',
          body: 'Brennholz bereit, fangfrischer Fisch auf dem Grill und lange Abende im Grillhaus bei weit geöffneten Türen.',
        },
        {
          title: 'Späte Nächte unter dalmatinischem Himmel',
          body: 'Kein Stadtlicht. Das beheizte Poolwasser bleibt bis spät nach Mitternacht warm, während Sie die Sternbilder betrachten.',
        },
      ],
    },
    gallery: {
      kicker: 'Aktuelle Einblicke',
      title: 'Genauer',
      accent: 'hinsehen.',
      body: 'Impressionen des Lebens in der Villa San Antonio – von der Morgensonne bis zum Mitternachtsbad.',
      cta: 'Gesamtes Album öffnen',
    },
    reviews: {
      kicker: 'Gästestimmen',
      title: 'Eindrücke unserer',
      accent: 'Gäste.',
      body: 'Echtes Feedback von Familien und Gruppen, die ihren Sommer in der Villa San Antonio verbracht haben.',
      count: 'Bewertungen',
      direct: 'Direkte Gästebewertungen',
    },
    faq: {
      kicker: 'Gut zu wissen',
      title: 'Häufig gestellte',
      accent: 'Fragen.',
      body: 'Alles, was Sie über Anreise, Hausregeln, Zahlungen und Ausstattung wissen müssen.',
    },
    booking: {
      kicker: 'Direktanfrage',
      title: 'Sichern Sie sich Ihren Termin für',
      accent: 'diesen Sommer.',
      body: 'Direkter Kontakt mit dem Eigentümer. Garantiert beste Preise, persönlicher Check-in und keine Buchungsprovision.',
      name: 'Vollständiger Name',
      email: 'E-Mail-Adresse',
      phone: 'Telefon / WhatsApp',
      checkIn: 'Anreisedatum',
      checkOut: 'Abreisedatum',
      guests: 'Anzahl der Gäste',
      pets: 'Bringen Sie Haustiere mit?',
      notes: 'Fragen oder besondere Wünsche',
      submit: 'Buchungsanfrage senden',
      sending: 'Wird gesendet...',
      successTitle: 'Anfrage erhalten',
      successMessage: 'Vielen Dank! Wir prüfen die Verfügbarkeit für Ihre Reisedaten und melden uns innerhalb von 24 Stunden bei Ihnen.',
    },
    footer: {
      tagline: 'Eine private Ferienvilla in den dalmatinischen Hügeln nahe Šibenik.',
      contactUs: 'Kontakt & Standort',
      rights: 'Alle Rechte vorbehalten.',
    },
  },
  hr: {
    nav: {
      about: 'O Vili',
      gallery: 'Galerija',
      discover: 'Istražite',
      faq: 'Česta pitanja',
      contact: 'Kontakt',
      checkAvailability: 'Provjeri dostupnost',
      exploreVilla: 'Istraži vilu',
      viewSpace: 'Pogledaj prostor',
    },
    hero: {
      slides: [
        {
          kicker: 'VILLA SAN ANTONIO',
          title: 'Vaša privatna oaza',
          accent: 'u blizini Šibenika.',
          subtext: 'Potpuno privatna vila za osam osoba u blizini Šibenika, s grijanim bazenom, roštilj kućom i ograđenim vrtom stvorenim za opuštanje.',
        },
        {
          kicker: 'Privatna vila za obitelji i prijatelje',
          title: 'Mjesto za zajedničke',
          accent: 'trenutke.',
          subtext: 'Potpuna privatnost, tri mirne spavaće sobe te prostrani unutarnji i vanjski prostori za zajednička druženja.',
        },
        {
          kicker: 'Okružena zelenilom s otvorenim pogledom i potpunim mirom',
          title: 'Diskretni luksuz',
          accent: 'u Dalmaciji.',
          subtext: 'Smještena u mirnom dalmatinskom zaleđu, na samo nekoliko minuta od prekrasnih plaža i Nacionalnog parka Krka.',
        },
        {
          kicker: 'Dani uz bazen. Večeri uz zalazak sunca. Bez stresa',
          title: 'Vaša ljetna',
          accent: 'baza.',
          subtext: 'Grijani bazen s vodopadom, ležaljke, vanjski kamin i promatranje zvijezda pod čistim mediteranskim nebom.',
        },
      ],
      meta: {
        coords: '43.647° N, 16.055° E · Podine',
        scroll: 'Pomakni prema dolje',
        estate: 'Imanje 01 · 8 Gostiju · Grijani bazen',
      },
    },
    perspective: {
      kicker: 'Naša perspektiva',
      title: 'Najbolji tjedni se nikada',
      accent: 'ne dogode slučajno.',
      body: 'Jedna vila, jedna obitelj u isto vrijeme. Potpuna privatnost, prostor za osam osoba i grijani bazen koji ostaje topao dugo nakon zalaska sunca. Većina naših gostiju se vraća.',
      quote: '„Započnite dan uz kavu pored bazena, provedite popodneva na suncu i okupite se navečer uz roštilj i večeru pod zvjezdanim nebom.“',
    },
    places: {
      kicker: 'Prostori',
      title: 'Stvoreno za',
      accent: 'duge ljetne dane.',
      body: 'Tri ambijenta koja naši gosti najviše pamte, svaki sa svojim ritmom i svojim dobom dana.',
      pool: {
        label: 'Bazen i terasa · Cijeli dan',
        title: 'Grijani bazen',
      },
      bbq: {
        label: 'Roštilj kuća · Nakon osam',
        title: 'Kamin i blagovaonica',
      },
      bedrooms: {
        label: 'Spavaće sobe · Nakon ponoći',
        title: 'Tri mirne sobe',
      },
    },
    week: {
      kicker: 'Tjedan',
      title: 'Kako tjedan',
      accent: 'izgleda.',
      body: 'Bez rasporeda, bez dijeljenih prostora, bez buđenja u 8 ujutro. Ovdje se dani slažu sami od sebe.',
      rows: [
        {
          title: 'Jutarnje svjetlo i mirni sati',
          body: 'Sunce izlazi iza borovih brežuljaka. Kava uz grijani bazen prije nego što se itko drugi probudi.',
        },
        {
          title: 'Duga popodneva u vodi',
          body: 'Vodopad teče, sunce na ležaljkama i bez ikakvog rasporeda. Djeca u bazenu, roditelji u hladu.',
        },
        {
          title: 'Večera s kamenog kamina',
          body: 'Drva su spremna, svježa riba na roštilju i duge večere u roštilj kući s širom otvorenim vratima.',
        },
        {
          title: 'Kasne noći pod dalmatinskim nebom',
          body: 'Bez gradskog svjetla. Voda grijanog bazena ostaje topla i iza ponoći dok promatrate zviježđa.',
        },
      ],
    },
    gallery: {
      kicker: 'Izbor fotografija',
      title: 'Pogledajte',
      accent: 'izbliza.',
      body: 'Trenuci svakodnevnog odmora u Vili San Antonio, od jutarnjeg sunca do noćnog kupanja.',
      cta: 'Otvori cijeli album',
    },
    reviews: {
      kicker: 'Dojmovi gostiju',
      title: 'Riječi naših',
      accent: 'gostiju.',
      body: 'Izravne recenzije obitelji i grupa koje su proveli svoje ljeto u Vili San Antonio.',
      count: 'recenzija',
      direct: 'Izravne recenzije',
    },
    faq: {
      kicker: 'Korisne informacije',
      title: 'Česta',
      accent: 'pitanja.',
      body: 'Sve što trebate znati o dolasku, kućnom redu, plaćanju i sadržajima vile.',
    },
    booking: {
      kicker: 'Izravan upit',
      title: 'Rezervirajte svoje termine za',
      accent: 'ovo ljeto.',
      body: 'Izravan kontakt s vlasnikom. Zajamčeno najbolje cijene, osobna dobrodošlica i bez agencijskih provizija.',
      name: 'Ime i prezime',
      email: 'Email adresa',
      phone: 'Telefon / WhatsApp',
      checkIn: 'Datum dolaska',
      checkOut: 'Datum odlaska',
      guests: 'Broj gostiju',
      pets: 'Dolazite s kućnim ljubimcima?',
      notes: 'Pitanja ili posebne želje',
      submit: 'Pošalji upit za rezervaciju',
      sending: 'Slanje...',
      successTitle: 'Upit uspješno zaprimljen',
      successMessage: 'Hvala vam! Provjerit ćemo raspoloživost za vaše datume i javiti vam se unutar 24 sata.',
    },
    footer: {
      tagline: 'Privatna vila za odmor u dalmatinskom zaleđu blizu Šibenika.',
      contactUs: 'Kontakt i lokacija',
      rights: 'Sva prava pridržana.',
    },
  },
}
