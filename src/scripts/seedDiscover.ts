import 'dotenv/config'
import { getPayload } from 'payload'
import type { DiscoverPost, Page } from '../payload-types'
import config from '../payload.config'

function toLexical(text: string): DiscoverPost['desc'] {
  const paragraphs = text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((para) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: para,
            version: 1,
          },
        ],
      })),
    },
  } as DiscoverPost['desc']
}

async function seedDiscover() {
  console.log('🌱 Starting Discover posts and Drives & Distances seed...')
  const payload = await getPayload({ config })

  // Find existing media
  const mediaResult = await payload.find({
    collection: 'media',
    limit: 200,
  })
  const mediaDocs = mediaResult.docs

  const findMedias = (patterns: string[]) =>
    patterns
      .map((p) => mediaDocs.find((m) => m.filename?.includes(p))?.id)
      .filter((id): id is number => typeof id === 'number')
      .map((id) => ({ image: id }))

  type DiscoverSeedData = {
    title: string
    category: 'nature' | 'adventure' | 'gastro' | 'culture' | 'beaches'
    tag: string
    badge?: string
    externalLink?: string
    mapsUrl?: string
    desc: string
    mediaPatterns: string[]
  }

  const discoverExperiences: DiscoverSeedData[] = [
    {
      title: 'Krka National Park & Waterfalls',
      category: 'nature',
      tag: '18 min drive · 18 km',
      badge: 'Must Visit',
      externalLink: 'https://www.npkrka.hr/en_US/',
      mapsUrl: 'https://maps.google.com/?q=Skradinski+Buk+Krka+National+Park',
      desc: 'Seven magnificent travertine waterfalls, Skradinski Buk, crystal clear lakes, and boat rides through the canyon. One of Croatia’s greatest natural wonders.\n\nStroll scenic wooden walkways suspended over emerald pools, take an unforgettable boat excursion to the Franciscan island monastery of Visovac, or discover pristine swimming spots along the lower canyon cascades.\n\nIdeal for full-day family trips with easy parking and scenic boat connections departing from nearby Skradin.',
      mediaPatterns: ['-001', '-027', '-088'],
    },
    {
      title: 'Čikola Canyon Zipline & Hiking',
      category: 'adventure',
      tag: '22 min drive · 25 km',
      badge: 'Adrenaline',
      mapsUrl: 'https://maps.google.com/?q=Zipline+Cikola+Canyon',
      desc: 'Fly across the 1.4 km zipline over the breathtaking Čikola River canyon, climb the via ferrata, or hike the dramatic limestone cliffs.\n\nTowering limestone walls rise up to 130 meters above the canyon floor, creating one of Dalmatia’s most striking geological landscapes.\n\nPerfect for thrill-seekers and nature lovers seeking active outdoor adventures.',
      mediaPatterns: ['-011', '-012', '-013'],
    },
    {
      title: 'Babić Wine Tastings & Primošten Vineyards',
      category: 'gastro',
      tag: '15 min drive · 16 km',
      badge: 'Local Taste',
      mapsUrl: 'https://maps.google.com/?q=Bucavac+Vineyards+Primosten',
      desc: 'Sample the world-renowned Dalmatian Babić red wine among the stone-walled Bucavac vineyards, recognized on the UNESCO tentative list.\n\nHand-carved geometric stone enclosures protect the autochthonous Babić grapes against harsh sea winds.\n\nVisit authentic family-owned konobas to pair full-bodied red wines with local sheep cheese, aged prosciutto, and wood-fired peka.',
      mediaPatterns: ['-078', '-079', '-080'],
    },
    {
      title: 'St. Nicholas Island Fortress',
      category: 'culture',
      tag: '15 min drive · 14 km',
      badge: 'UNESCO Heritage',
      externalLink: 'https://www.kanal-svetog-ante.com/en',
      mapsUrl: 'https://maps.google.com/?q=St+Nicholas+Fortress+Sibenik',
      desc: 'A unique 16th-century Venetian sea fortress built on an islet at the entrance to St. Anthony’s Channel, inscribed as a UNESCO World Heritage Site.\n\nWalk along the pine-fringed coastal sea promenade with panoramic archipelago views.\n\nAdmire the fortress’s triangular stone architecture and centuries of maritime guardian history at sunset.',
      mediaPatterns: ['-071', '-005', '-006'],
    },
    {
      title: 'Kornati Archipelago Private Boat Charter',
      category: 'adventure',
      tag: 'Marina 12 min · Day Trip',
      badge: 'Island Escape',
      externalLink: 'https://www.kornati.hr/en/',
      mapsUrl: 'https://maps.google.com/?q=Kornati+National+Park',
      desc: 'Cruise through a nautical maze of 89 uninhabited islands and islets, swim in secluded turquoise bays, and dine at secluded fisherman konobas.\n\nPrivate speedboat tours depart just minutes from the villa. Dive into crystal lagoons, explore untouched sea caves, and enjoy fresh sea bass caught daily.',
      mediaPatterns: ['-026', '-027', '-087'],
    },
    {
      title: 'Šibenik Medieval Old Town & St. James',
      category: 'culture',
      tag: '12 min drive · 12 km',
      badge: 'UNESCO Cathedral',
      externalLink: 'https://www.sibenik-tourism.hr/en/',
      mapsUrl: 'https://maps.google.com/?q=Cathedral+of+St+James+Sibenik',
      desc: 'Stroll cobblestone alleys, climb to St. Michael’s and Barone Fortresses with sunset views, and visit the monumental St. James Cathedral.\n\nBuilt entirely of stone without mortar, the UNESCO cathedral is a masterpiece of Renaissance architecture.\n\nDiscover Michelin-starred fine dining and cozy wine bars in medieval stone courtyards.',
      mediaPatterns: ['-030', '-031', '-032'],
    },
    {
      title: 'Primošten Sandy & Pebble Beaches',
      category: 'beaches',
      tag: '20 min drive · 22 km',
      badge: 'Crystal Waters',
      mapsUrl: 'https://maps.google.com/?q=Plaza+Raduca+Primosten',
      desc: 'Pristine pine-fringed beaches at Raduča Peninsula, scenic coastal promenades, and beachside restaurants with fresh grilled fish.\n\nCrystal transparent water makes it a top destination for swimming and snorkeling.\n\nRent sea kayaks, enjoy shade under fragrant pines, and watch the sun dip into the open Adriatic.',
      mediaPatterns: ['-001', '-002', '-003'],
    },
    {
      title: 'Šibenik Bridge Bungee Jumping',
      category: 'adventure',
      tag: '16 min drive · 15 km',
      badge: 'Adrenaline',
      mapsUrl: 'https://maps.google.com/?q=Sibenski+Most',
      desc: 'Experience the thrill of a 40-meter jump above the sea directly from the iconic Šibenik Bridge with spectacular views of the Krka river canyon.\n\nLeap towards the turquoise water where the river meets the Adriatic.\n\nProfessional certified jump masters provide full safety gear and video recordings of your jump.',
      mediaPatterns: ['-014', '-015', '-016'],
    },
  ]

  const discoverDestinations = [
    {
      name: 'Šibenik Old Town & St. James Cathedral',
      category: 'Historic Center · UNESCO',
      distance: '12 km',
      driveTime: '12 min',
      desc: 'Four medieval fortresses, Michelin-star dining & sea promenade.',
      mapsUrl: 'https://maps.google.com/?q=Cathedral+of+St+James+Sibenik',
    },
    {
      name: 'Krka National Park (Skradinski Buk & Skradin)',
      category: 'National Park',
      distance: '18 km',
      driveTime: '18 min',
      desc: 'Cascading waterfalls, riverboat departures & nature trails.',
      mapsUrl: 'https://maps.google.com/?q=Skradinski+Buk+Krka+National+Park',
    },
    {
      name: 'St. Nicholas Island Fortress (UNESCO)',
      category: 'UNESCO Maritime Landmark',
      distance: '14 km',
      driveTime: '15 min',
      desc: 'Venetian coastal defense fort at the St. Anthony Channel entrance.',
      mapsUrl: 'https://maps.google.com/?q=St+Nicholas+Fortress+Sibenik',
    },
    {
      name: 'Primošten Old Town & Raduča Beach',
      category: 'Coastal Town & Beaches',
      distance: '22 km',
      driveTime: '20 min',
      desc: 'Peninsula beaches, stone alleys & iconic Bucavac vineyards.',
      mapsUrl: 'https://maps.google.com/?q=Primosten+Old+Town',
    },
    {
      name: 'Čikola River Canyon & Zipline',
      category: 'Outdoor & Adventure',
      distance: '25 km',
      driveTime: '22 min',
      desc: '1.4 km aerial zipline, via ferrata climbing & scenic viewpoints.',
      mapsUrl: 'https://maps.google.com/?q=Zipline+Cikola+Canyon',
    },
    {
      name: 'Kornati National Park (Boat Departure)',
      category: 'Island Excursions',
      distance: '12 km',
      driveTime: '15 min',
      desc: 'Departure points for private skippered tours to the archipelago.',
      mapsUrl: 'https://maps.google.com/?q=Sibenik+Port',
    },
    {
      name: 'Split International Airport (SPU)',
      category: 'Airport Transfer',
      distance: '48 km',
      driveTime: '40 min',
      desc: 'Easy highway & coastal route directly to the villa gates.',
      mapsUrl: 'https://maps.google.com/?q=Split+Airport+SPU',
    },
    {
      name: 'Zadar International Airport (ZAD)',
      category: 'Airport Transfer',
      distance: '75 km',
      driveTime: '50 min',
      desc: 'Smooth A1 highway connection directly to Šibenik exit.',
      mapsUrl: 'https://maps.google.com/?q=Zadar+Airport+ZAD',
    },
  ]

  const experiencesData = discoverExperiences.map((item) => {
    const images = findMedias(item.mediaPatterns)
    return {
      title: item.title,
      category: item.category,
      tag: item.tag,
      badge: item.badge || null,
      externalLink: item.externalLink || null,
      mapsUrl: item.mapsUrl || null,
      desc: toLexical(item.desc),
      images: images.length > 0 ? images : null,
    }
  })

  const categorySeeds = [
    { slug: 'nature', name: 'Nature & Parks' },
    { slug: 'adventure', name: 'Adventures & Sea' },
    { slug: 'gastro', name: 'Wine & Gastro' },
    { slug: 'culture', name: 'Culture & UNESCO' },
    { slug: 'beaches', name: 'Beaches' },
  ]
  const categoryIDs = new Map<string, number>()

  console.log(`Seeding ${categorySeeds.length} Discover categories...`)
  for (const categorySeed of categorySeeds) {
    const existing = await payload.find({
      collection: 'discover-categories',
      where: {
        slug: {
          equals: categorySeed.slug,
        },
      },
      limit: 1,
      depth: 0,
    })
    const category =
      existing.docs[0] ||
      (await payload.create({
        collection: 'discover-categories',
        data: categorySeed,
      }))

    categoryIDs.set(categorySeed.slug, category.id)
  }

  const discoverPosts = experiencesData

  console.log(`Seeding ${discoverPosts.length} Discover posts...`)
  for (const item of discoverPosts) {
    const categoryID = categoryIDs.get(item.category)
    if (!categoryID) {
      throw new Error(`Missing seeded Discover category: ${item.category}`)
    }

    const existing = await payload.find({
      collection: 'discover-posts',
      where: {
        title: {
          equals: item.title,
        },
      },
      limit: 1,
      depth: 0,
    })

    const data = {
      title: item.title,
      categoryRef: categoryID,
      tag: item.tag || null,
      badge: item.badge || null,
      externalLink: item.externalLink || null,
      mapsUrl: item.mapsUrl || null,
      desc: item.desc,
      images:
        item.images?.map((entry) => ({
          image: entry.image,
        })) || null,
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'discover-posts',
        id: existing.docs[0].id,
        data: {
          categoryRef: categoryID,
        },
      })
    } else {
      await payload.create({
        collection: 'discover-posts',
        data,
      })
    }
  }

  const drivePosts = discoverDestinations

  console.log(`Seeding ${drivePosts.length} Drives & Distances posts...`)
  for (const item of drivePosts) {
    const existing = await payload.find({
      collection: 'drives-distances',
      where: {
        name: {
          equals: item.name,
        },
      },
      limit: 1,
      depth: 0,
    })

    const data = {
      name: item.name,
      category: item.category || null,
      distance: item.distance,
      driveTime: item.driveTime,
      desc: item.desc || null,
      mapsUrl: item.mapsUrl || null,
    }

    if (!existing.docs[0]) {
      await payload.create({
        collection: 'drives-distances',
        data,
      })
    }
  }

  const regionalDrivesText = {
    blockType: 'regionalDrivesText' as const,
    kicker: 'Regional Map & Travel Times',
    title: 'Everything within effortless driving distance.',
    text: 'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.',
  }

  const discoverPageResult = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'discover',
      },
    },
    limit: 1,
    depth: 0,
  })
  const discoverPage = discoverPageResult.docs[0]

  if (discoverPage) {
    const layout = [...(discoverPage.layout || [])]
    const alreadySeeded = layout.some((block) => block.blockType === 'regionalDrivesText')

    if (!alreadySeeded) {
      const bookingBandIndex = layout.findIndex((block) => block.blockType === 'bookingBand')
      layout.splice(bookingBandIndex >= 0 ? bookingBandIndex : layout.length, 0, regionalDrivesText)

      await payload.update({
        collection: 'pages',
        id: discoverPage.id,
        data: {
          layout,
        },
      })
      console.log('Seeded Regional Drives & Distances text block into Pages / discover.')
    }
  } else {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Discover Dalmatia & Local Area',
        slug: 'discover',
        layout: [regionalDrivesText],
      } as Omit<Page, 'createdAt' | 'id' | 'updatedAt'>,
    })
    console.log('Created Pages / discover with the Regional Drives & Distances text block.')
  }

  console.log('✅ Discover content seeded successfully with native Payload drag & drop!')
  process.exit(0)
}

seedDiscover().catch((err) => {
  console.error('❌ Error seeding Discover content:', err)
  process.exit(1)
})
