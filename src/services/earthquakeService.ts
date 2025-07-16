interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    status: string;
    depth: number;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    tsunami: number;
    sig: number;
    code: string;
    ids: string;
    sources: string;
    types: string;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  date: string;
  depth: number;
  url: string;
  coordinates: [number, number]; // [longitude, latitude]
  tsunami?: boolean;
  felt?: number | null;
  significance?: number;
  status?: string;
  alert?: string | null; // green, yellow, orange, red
  localTime?: string;
}

// ShakeAlert interface for earthquake early warning data
export interface ShakeAlertEvent {
  id: string;
  title: string;
  magnitude: number;
  location: string;
  time: string;
  coordinates: [number, number]; // [longitude, latitude]
  url: string;
  alertLevel: 'green' | 'yellow' | 'orange' | 'red' | null;
  expectedShaking: 'weak' | 'light' | 'moderate' | 'strong' | 'very strong' | 'severe' | 'violent' | 'extreme' | null;
  secondsUntilShaking?: number;
  isPriority?: boolean; // Flag to indicate if this is a priority event (e.g., from India)
}

// Define India's bounding box (more precise)
const INDIA_LAT_MIN = 6.5;  // Southern tip of Andaman & Nicobar Islands
const INDIA_LAT_MAX = 37.0; // Northern Kashmir
const INDIA_LON_MIN = 68.0; // Western Gujarat
const INDIA_LON_MAX = 97.5; // Eastern Arunachal Pradesh

// List of countries that are definitely not India
const NON_INDIAN_COUNTRIES = [
  'japan', 'china', 'pakistan', 'bangladesh', 'nepal', 'bhutan', 'myanmar', 'burma',
  'thailand', 'laos', 'cambodia', 'vietnam', 'malaysia', 'singapore', 'indonesia',
  'philippines', 'taiwan', 'south korea', 'north korea', 'mongolia', 'russia',
  'kazakhstan', 'uzbekistan', 'turkmenistan', 'kyrgyzstan', 'tajikistan', 'afghanistan',
  'iran', 'iraq', 'syria', 'jordan', 'lebanon', 'israel', 'palestine', 'saudi arabia',
  'yemen', 'oman', 'uae', 'qatar', 'bahrain', 'kuwait', 'turkey', 'cyprus', 'greece',
  'bulgaria', 'romania', 'ukraine', 'moldova', 'belarus', 'poland', 'czech republic',
  'slovakia', 'hungary', 'austria', 'switzerland', 'italy', 'france', 'spain', 'portugal',
  'united kingdom', 'ireland', 'iceland', 'norway', 'sweden', 'finland', 'denmark',
  'estonia', 'latvia', 'lithuania', 'germany', 'netherlands', 'belgium', 'luxembourg',
  'liechtenstein', 'monaco', 'andorra', 'san marino', 'vatican city', 'malta', 'albania',
  'north macedonia', 'serbia', 'montenegro', 'bosnia', 'croatia', 'slovenia', 'australia',
  'new zealand', 'papua new guinea', 'fiji', 'solomon islands', 'vanuatu', 'new caledonia',
  'samoa', 'tonga', 'kiribati', 'marshall islands', 'micronesia', 'palau', 'nauru',
  'tuvalu', 'wallis and futuna', 'futuna', 'wallis', 'cook islands', 'niue', 'tokelau',
  'french polynesia', 'pitcairn', 'easter island', 'chile', 'argentina', 'brazil',
  'peru', 'colombia', 'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay',
  'guyana', 'suriname', 'french guiana', 'panama', 'costa rica', 'nicaragua', 'honduras',
  'el salvador', 'guatemala', 'belize', 'mexico', 'united states', 'canada', 'greenland',
  'egypt', 'libya', 'algeria', 'tunisia', 'morocco', 'western sahara', 'mauritania',
  'mali', 'niger', 'chad', 'sudan', 'south sudan', 'eritrea', 'ethiopia', 'djibouti',
  'somalia', 'kenya', 'uganda', 'rwanda', 'burundi', 'tanzania', 'mozambique', 'malawi',
  'zambia', 'zimbabwe', 'botswana', 'namibia', 'south africa', 'lesotho', 'eswatini',
  'madagascar', 'comoros', 'mauritius', 'seychelles', 'maldives', 'sri lanka'
];

// List of specific places that are definitely not in India
const NON_INDIAN_PLACES = [
  'indian springs', 'indian wells', 'indianapolis', 'southeast indian ridge', 
  'southwest indian ridge', 'central indian ridge', 'indian ocean', 'indian ridge',
  'california', 'southern california', 'northern california', 'central california',
  'ca, usa', 'ca,usa', 'usa', 'united states', 'nevada', 'oregon', 'washington',
  'idaho', 'utah', 'arizona', 'new mexico', 'colorado', 'wyoming', 'montana',
  'north dakota', 'south dakota', 'nebraska', 'kansas', 'oklahoma', 'texas',
  'mexico', 'baja california', 'canada', 'british columbia', 'indonesia',
  'sumatera', 'sumatra', 'simeulue', 'nias', 'mentawai', 'java', 'kalimantan',
  'minahasa', 'sulawesi', 'kalimanta', 'lombok', 'bali', 'flores', 'sumba',
  'timor', 'molucca', 'irian', 'maluku', 'papua', 'alaska', 'aleutian',
  'kodiak', 'kenai', 'anchorage', 'fairbanks', 'juneau', 'bering sea',
  'chukchi sea', 'beaufort sea', 'wallis and futuna', 'wallis', 'futuna',
  'french polynesia', 'tahiti', 'samoa', 'tonga', 'fiji', 'vanuatu',
  'new caledonia', 'solomon islands', 'marshall islands', 'caroline islands',
  'mariana islands', 'palau', 'kiribati', 'nauru', 'tuvalu', 'cook islands',
  'niue', 'tokelau', 'pitcairn', 'american samoa', 'guam', 'northern mariana',
  'wake island', 'johnston atoll', 'midway', 'hawaiian islands', 'hawaii',
  'pacific ocean', 'south pacific', 'north pacific', 'central pacific',
  'western pacific', 'eastern pacific', 'ashford', 'alo', 'funaishikawa'
];

// List of Indian states and union territories
const INDIAN_STATES = [
  'andaman', 'nicobar', 'assam', 'gujarat', 'jammu', 'kashmir', 'maharashtra', 
  'madhya pradesh', 'manipur', 'meghalaya', 'sikkim', 'tripura', 'uttar pradesh', 
  'uttarakhand', 'west bengal', 'arunachal pradesh', 'telangana', 'himachal pradesh', 
  'ladakh', 'andhra pradesh', 'tamil nadu', 'kerala', 'karnataka', 'goa', 'odisha',
  'jharkhand', 'chhattisgarh', 'bihar', 'haryana', 'punjab', 'chandigarh',
  'delhi', 'puducherry', 'lakshadweep', 'daman and diu', 'dadra and nagar haveli'
];

// List of major Indian cities
const INDIAN_CITIES = [
  'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'ahmedabad', 'chennai', 
  'kolkata', 'surat', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 
  'thane', 'bhopal', 'visakhapatnam', 'pimpri-chinchwad', 'patna', 'vadodara', 
  'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 
  'kalyan-dombivli', 'vasai-virar', 'varanasi', 'srinagar', 'aurangabad', 
  'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'prayagraj', 'ranchi', 
  'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 
  'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli-dharwad',
  'mysore', 'mysuru', 'tiruchirappalli', 'bareilly', 'aligarh', 'tiruppur', 'gurgaon',
  'gurugram', 'moradabad', 'jalandhar', 'bhubaneswar', 'salem', 'warangal', 'mira-bhayandar',
  'jalgaon', 'guntur', 'thiruvananthapuram', 'bhiwandi', 'saharanpur', 'gorakhpur',
  'bikaner', 'amravati', 'noida', 'jamshedpur', 'bhilai', 'cuttack', 'firozabad',
  'kochi', 'cochin', 'nellore', 'bhavnagar', 'dehradun', 'durgapur', 'asansol',
  'rourkela', 'nanded', 'kolhapur', 'ajmer', 'akola', 'gulbarga', 'jamnagar',
  'ujjain', 'loni', 'siliguri', 'jhansi', 'ulhasnagar', 'jammu', 'sangli-miraj & kupwad',
  'mangalore', 'erode', 'belgaum', 'ambattur', 'tirunelveli', 'malegaon', 'gaya',
  'jalgaon', 'udaipur', 'maheshtala', 'davanagere', 'kozhikode', 'calicut', 'kurnool',
  'rajpur sonarpur', 'rajahmundry', 'bokaro', 'south dumdum', 'bellary', 'patiala',
  'gopalpur', 'agartala', 'bhagalpur', 'muzaffarnagar', 'bhatpara', 'panihati',
  'latur', 'dhule', 'rohtak', 'srinagar', 'korba', 'bhilwara', 'berhampur', 'muzaffarpur',
  'ahmednagar', 'mathura', 'kollam', 'avadi', 'kadapa', 'kamarhati', 'sambalpur',
  'bilaspur', 'shahjahanpur', 'satara', 'bijapur', 'rampur', 'shivamogga', 'shimoga',
  'chandrapur', 'junagadh', 'thrissur', 'trichur', 'alwar', 'bardhaman', 'kulti',
  'kakinada', 'nizamabad', 'parbhani', 'tumkur', 'khammam', 'uzhavarkarai', 'bihar sharif',
  'panipat', 'darbhanga', 'bally', 'aizawl', 'dewas', 'ichalkaranji', 'karnal',
  'bathinda', 'jalna', 'eluru', 'barasat', 'kirari suleman nagar', 'purnia', 'satna',
  'mau', 'sonipat', 'farrukhabad', 'durg', 'imphal', 'ratlam', 'hapur', 'arrah',
  'anantapur', 'karimnagar', 'etawah', 'ambarnath', 'north dumdum', 'bharatpur',
  'begusarai', 'new delhi', 'gandhidham', 'baranagar', 'tiruvottiyur', 'pondicherry',
  'puducherry', 'sikar', 'thoothukudi', 'rewa', 'mirzapur', 'raichur', 'pali', 'ramagundam',
  'silchar', 'haridwar', 'vijayanagaram', 'tenali', 'nagercoil', 'sri ganganagar',
  'karawal nagar', 'mango', 'thanjavur', 'bulandshahr', 'uluberia', 'katni',
  'sambhal', 'singrauli', 'nadiad', 'secunderabad', 'naihati', 'yamunanagar',
  'bidhannagar', 'pallavaram', 'bidar', 'munger', 'panchkula', 'burhanpur',
  'raurkela industrial township', 'kharagpur', 'dindigul', 'gandhinagar', 'hospet',
  'nangloi jat', 'malda', 'ongole', 'deoghar', 'chapra', 'haldia', 'khandwa',
  'nandyal', 'morena', 'amroha', 'anand', 'bhind', 'bhalswa jahangir pur',
  'madhyamgram', 'bhiwani', 'berhampore', 'ambala', 'morbi', 'fatehpur', 'raebareli',
  'khora', 'chittoor', 'bhusawal', 'orai', 'bahraich', 'phusro', 'vellore',
  'mehsana', 'raiganj', 'sirsa', 'danapur', 'serampore', 'sultan pur majra',
  'guna', 'jaunpur', 'panvel', 'shivpuri', 'surendranagar dudhrej', 'unnao',
  'chinsurah', 'alappuzha', 'kottayam', 'machilipatnam', 'shimla', 'adoni',
  'udupi', 'katihar', 'proddatur', 'mahbubnagar', 'saharsa', 'dibrugarh',
  'jorhat', 'hazaribagh', 'hindupur', 'nagaon', 'sasaram', 'hajipur', 'bhimavaram',
  'bettiah', 'ramgarh', 'tinsukia', 'guntakal', 'srikakulam', 'motihari', 'dharmavaram',
  'medininagar', 'gudivada', 'phagwara', 'pudukkottai', 'hosur', 'navsari', 'kaithal',
  'markapur', 'dahod', 'moga', 'karaikudi', 'siwan', 'jind', 'gangtok', 'kohima',
  'port blair', 'itanagar', 'silvassa', 'daman', 'diu', 'kavaratti', 'shillong',
  'hardwar', 'puri', 'konark', 'amarnath', 'badrinath', 'kedarnath', 'dwarka',
  'pushkar', 'vaishno devi', 'bodh gaya', 'kanyakumari', 'rameshwaram', 'tirupati',
  'shirdi', 'mathura', 'vrindavan', 'haridwar', 'rishikesh', 'gaya', 'allahabad',
  'varanasi', 'ayodhya', 'madurai', 'thanjavur', 'mahabalipuram', 'hampi', 'khajuraho',
  'ajanta', 'ellora', 'mahabaleswar', 'lonavala', 'matheran', 'darjeeling', 'manali',
  'shimla', 'mussoorie', 'nainital', 'ooty', 'kodaikanal', 'munnar', 'thekkady',
  'kumarakom', 'kovalam', 'mahabalipuram', 'pondicherry', 'goa', 'jaisalmer',
  'jodhpur', 'udaipur', 'mount abu', 'ranthambore', 'agra', 'fatehpur sikri',
  'jaipur', 'pushkar', 'ajmer', 'bikaner', 'jaisalmer', 'jodhpur', 'udaipur',
  'mount abu', 'ranthambore', 'agra', 'fatehpur sikri', 'jaipur', 'pushkar',
  'ajmer', 'bikaner', 'kochi', 'alleppey', 'kumarakom', 'kovalam', 'thekkady',
  'munnar', 'wayanad', 'bekal', 'kozhikode', 'guruvayur', 'palakkad', 'thrissur',
  'kollam', 'varkala', 'thiruvananthapuram', 'kanyakumari', 'madurai', 'kodaikanal',
  'ooty', 'coonoor', 'yelagiri', 'yercaud', 'hogenakkal', 'chennai', 'mahabalipuram',
  'pondicherry', 'tirupati', 'srikalahasti', 'horsely hills', 'araku valley',
  'vizag', 'vijayawada', 'hyderabad', 'warangal', 'nagarjuna sagar', 'srisailam',
  'bidar', 'gulbarga', 'bijapur', 'badami', 'hampi', 'hospet', 'bangalore',
  'mysore', 'coorg', 'chikmagalur', 'belur', 'halebid', 'shravanabelagola',
  'gokarna', 'murudeshwar', 'karwar', 'mangalore', 'udupi', 'manipal', 'goa',
  'mahabaleshwar', 'lonavala', 'khandala', 'matheran', 'mumbai', 'elephanta',
  'alibaug', 'kashid', 'murud janjira', 'dapoli', 'ganapatipule', 'tarkarli',
  'amboli', 'malvan', 'sawantwadi', 'sindhudurg', 'kolhapur', 'sangli', 'solapur',
  'pandharpur', 'tuljapur', 'osmanabad', 'nanded', 'aurangabad', 'ajanta', 'ellora',
  'shirdi', 'nashik', 'trimbakeshwar', 'igatpuri', 'bhandardara', 'ahmednagar',
  'pune', 'lavasa', 'kamshet', 'lonavala', 'khandala', 'panchgani', 'mahabaleshwar',
  'pratapgad', 'raigad', 'daman', 'silvassa', 'saputara', 'valsad', 'surat',
  'bharuch', 'vadodara', 'champaner', 'pavagadh', 'ahmedabad', 'gandhinagar',
  'adalaj', 'modhera', 'patan', 'siddhpur', 'rani ki vav', 'lothal', 'bhuj',
  'mandvi', 'dholavira', 'rann of kutch', 'dwarka', 'somnath', 'diu', 'gir',
  'junagadh', 'palitana', 'bhavnagar', 'velavadar', 'blackbuck national park',
  'rajkot', 'jamnagar', 'mount abu', 'udaipur', 'chittorgarh', 'kumbhalgarh',
  'ranakpur', 'nathdwara', 'haldighati', 'eklingji', 'dungarpur', 'banswara',
  'jodhpur', 'osian', 'jaisalmer', 'sam sand dunes', 'bikaner', 'deshnoke',
  'karni mata temple', 'shekhawati', 'mandawa', 'nawalgarh', 'jhunjhunu',
  'ajmer', 'pushkar', 'jaipur', 'amer', 'nahargarh', 'jaigarh', 'sanganer',
  'abhaneri', 'bhangarh', 'sariska', 'alwar', 'bharatpur', 'deeg', 'agra',
  'fatehpur sikri', 'mathura', 'vrindavan', 'gokul', 'nandgaon', 'barsana',
  'govardhan', 'delhi', 'qutub minar', 'red fort', 'india gate', 'humayun tomb',
  'akshardham', 'lotus temple', 'jama masjid', 'chandni chowk', 'connaught place',
  'hauz khas', 'jantar mantar', 'rashtrapati bhavan', 'rajghat', 'lodi garden',
  'purana qila', 'safdarjung tomb', 'tughlaqabad fort', 'garden of five senses',
  'dilli haat', 'pragati maidan', 'national museum', 'national gallery of modern art',
  'national science centre', 'national zoological park', 'nehru planetarium',
  'indira gandhi memorial museum', 'gandhi smriti', 'raj ghat', 'shanti vana',
  'vijay ghat', 'shakti sthal', 'vir bhumi', 'ab ghat', 'shanti van', 'vijay ghat',
  'kisan ghat', 'gurgaon', 'gurugram', 'faridabad', 'noida', 'greater noida',
  'ghaziabad', 'meerut', 'haridwar', 'rishikesh', 'mussoorie', 'dehradun',
  'chakrata', 'dhanaulti', 'kanatal', 'chamba', 'tehri', 'new tehri', 'devprayag',
  'rudraprayag', 'karnaprayag', 'nandprayag', 'vishnuprayag', 'joshimath',
  'auli', 'badrinath', 'hemkund sahib', 'valley of flowers', 'govindghat',
  'ghangaria', 'gaurikund', 'kedarnath', 'guptkashi', 'ukhimath', 'chopta',
  'tungnath', 'rudranath', 'madhyamaheshwar', 'kalpeshwar', 'deoria tal',
  'roopkund', 'nainital', 'bhimtal', 'sattal', 'naukuchiatal', 'khurpatal',
  'mukteshwar', 'kausani', 'ranikhet', 'almora', 'jageshwar', 'binsar',
  'patal bhuvaneshwar', 'champawat', 'pithoragarh', 'munsiyari', 'dharchula',
  'jauljibi', 'berinag', 'chaukori', 'gangolihat', 'bageshwar', 'baijnath',
  'kausani', 'gwaldam', 'karnaprayag', 'rudraprayag', 'srinagar', 'pauri',
  'khirsu', 'lansdowne', 'kotdwar', 'corbett national park', 'ramnagar',
  'kaladhungi', 'nainital', 'haldwani', 'bhowali', 'bhimtal', 'sattal',
  'naukuchiatal', 'khurpatal', 'mukteshwar', 'ramgarh', 'dhanachuli',
  'pangot', 'kilbury', 'kausani', 'baijnath', 'bageshwar', 'kapkot',
  'someshwar', 'kausani', 'gwaldam', 'karnaprayag', 'rudraprayag',
  'gauchar', 'chamoli', 'gopeshwar', 'joshimath', 'auli', 'badrinath',
  'mana', 'hemkund sahib', 'valley of flowers', 'govindghat', 'ghangaria',
  'gaurikund', 'kedarnath', 'guptkashi', 'ukhimath', 'chopta', 'tungnath',
  'rudranath', 'madhyamaheshwar', 'kalpeshwar', 'deoria tal', 'roopkund',
  'kumaon', 'garhwal', 'tehri garhwal', 'pauri garhwal', 'chamoli',
  'rudraprayag', 'uttarkashi', 'dehradun', 'haridwar', 'nainital',
  'udham singh nagar', 'champawat', 'bageshwar', 'almora', 'pithoragarh'
];

/**
 * Determines if an earthquake is in India based on location name and coordinates.
 * This is an extremely strict check to ensure only Indian locations are marked as priority.
 */
const isInIndia = (feature: EarthquakeFeature): boolean => {
  // Get the location name and coordinates
  const locationLower = feature.properties.place.toLowerCase();
  const [longitude, latitude] = feature.geometry.coordinates;

  // 1. FIRST PASS: Check for explicit non-Indian indicators
  // List of countries/regions that should NEVER be marked as India
  const NON_INDIAN_REGIONS = [
    // Asian countries
    'japan', 'china', 'nepal', 'bhutan', 'bangladesh', 'pakistan', 'sri lanka', 'maldives',
    'myanmar', 'thailand', 'vietnam', 'cambodia', 'laos', 'malaysia', 'singapore', 'indonesia',
    'philippines', 'taiwan', 'south korea', 'north korea', 'mongolia', 'russia',
    
    // Other regions that might cause confusion
    'indian ocean', 'bay of bengal', 'arabian sea', 'andaman sea', 'nicobar',
    
    // Additional exclusions based on past issues
    'japanese', 'tokyo', 'osaka', 'kyoto', 'honshu', 'hokkaido', 'okinawa'
  ];

  // Check for any non-Indian region in the location string
  for (const region of NON_INDIAN_REGIONS) {
    if (locationLower.includes(region)) {
      console.log(`EXCLUDED: Contains non-Indian region '${region}': ${feature.properties.place}`);
      return false;
    }
  }

  // 2. Check for relative distance patterns (e.g., "100 km NE of City, Country")
  const distancePatterns = [
    /^\d+\s*km\s+[a-z]+\s+of\s+(.+)$/i,  // "100 km NE of City, Country"
    /near\s+the\s+(north|south|east|west|northeast|northwest|southeast|southwest)\s+coast\s+of\s+(.+)/i,  // "Near the east coast of Japan"
    /\d+\s*km\s*(n|s|e|w|ne|nw|se|sw|north|south|east|west|northeast|northwest|southeast|southwest)\s+of\s+(.+)/i  // "100 km NE of City"
  ];

  for (const pattern of distancePatterns) {
    const match = locationLower.match(pattern);
    if (match) {
      const actualLocation = (match[2] || match[1] || '').trim().toLowerCase();
      if (actualLocation) {
        // Check if the actual location is in our non-Indian regions list
        for (const region of NON_INDIAN_REGIONS) {
          if (actualLocation.includes(region)) {
            console.log(`EXCLUDED: Distance-based location contains non-Indian region '${region}': ${feature.properties.place}`);
            return false;
          }
        }
      }
    }
  }

  // 3. Check coordinates against India's bounding box
  const isInIndianBounds =
    latitude >= INDIA_LAT_MIN &&
    latitude <= INDIA_LAT_MAX &&
    longitude >= INDIA_LON_MIN &&
    longitude <= INDIA_LON_MAX;

  if (!isInIndianBounds) {
    console.log(`EXCLUDED: Coordinates outside Indian bounds: ${feature.properties.place} [${longitude}, ${latitude}]`);
    return false;
  }

  // 4. POSITIVE INDICATORS - Only mark as India if we have strong evidence
  
  // Check for 'India' in the location
  if (locationLower.includes('india') || locationLower.includes('indian')) {
    console.log(`INCLUDED: Contains 'India' reference: ${feature.properties.place}`);
    return true;
  }

  // Check for Indian states
  for (const state of INDIAN_STATES) {
    // Use word boundaries to avoid partial matches
    const stateRegex = new RegExp(`\\b${state}\\b`, 'i');
    if (stateRegex.test(locationLower)) {
      console.log(`INCLUDED: Contains Indian state '${state}': ${feature.properties.place}`);
      return true;
    }
  }

  // Check for Indian cities
  for (const city of INDIAN_CITIES) {
    // Use word boundaries to avoid partial matches
    const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
    if (cityRegex.test(locationLower)) {
      console.log(`INCLUDED: Contains Indian city '${city}': ${feature.properties.place}`);
      return true;
    }
  }

  // 5. FINAL SAFETY CHECK
  // If we get here, the coordinates are in India but we don't have strong evidence
  // from the location name. Be conservative and exclude to avoid false positives.
  console.log(`EXCLUDED: Location in Indian bounds but no strong Indian indicators: ${feature.properties.place}`);
  console.log(`EXCLUDED: Coordinates in bounds but no explicit Indian references: ${feature.properties.place}`);
  return false;
};

// Helper function to convert USGS feature to our Earthquake format
const featureToEarthquake = (feature: EarthquakeFeature): Earthquake => {
  const [longitude, latitude, depth] = feature.geometry.coordinates;
  
  // Convert UNIX timestamp to Date object
  const date = new Date(feature.properties.time);
  
  // Format date as string
  const dateString = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  
  // Format local time in IST
  const localTime = date.toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  
  return {
    id: feature.id,
    magnitude: feature.properties.mag,
    location: feature.properties.place,
    date: dateString,
    depth: Math.round(depth * 10) / 10, // Round to 1 decimal place
    url: feature.properties.url,
    coordinates: [longitude, latitude],
    tsunami: feature.properties.tsunami === 1,
    felt: feature.properties.felt,
    significance: feature.properties.sig,
    status: feature.properties.status,
    alert: feature.properties.alert,
    localTime
  };
};

// Fetch recent earthquakes (past day)
export const fetchRecentEarthquakes = async (): Promise<Earthquake[]> => {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch earthquake data');
    }
    
    const data: USGSResponse = await response.json();
    
    // Map the USGS data to our format
    return data.features.map(featureToEarthquake);
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw error;
  }
};

// Fetch earthquakes by timeframe (week or month)
export const fetchEarthquakesByTimeframe = async (timeframe: 'week' | 'month'): Promise<Earthquake[]> => {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_${timeframe}.geojson`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${timeframe} earthquake data`);
    }
    
    const data: USGSResponse = await response.json();
    
    // Map the USGS data to our format
    return data.features.map(featureToEarthquake);
  } catch (error) {
    console.error(`Error fetching ${timeframe} earthquake data:`, error);
    throw error;
  }
};

// Fetch historical Indian earthquakes (past 10 years + significant older ones)
export const fetchHistoricalIndianEarthquakes = async (): Promise<Earthquake[]> => {
  try {
    // Get earthquakes from the past 10 years in the Indian region
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 10);
    
    const startTimeStr = startDate.toISOString();
    const endTimeStr = endDate.toISOString();
    
    // Bounding box for India and surrounding regions
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTimeStr}&endtime=${endTimeStr}&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=97&minmagnitude=2.5`;
    
    console.log("Fetching recent Indian earthquakes with URL:", url);
    const response = await fetch(url);
    const data: USGSResponse = await response.json();
    
    // Filter for earthquakes in India
    const recentIndianEarthquakes = data.features.filter(isInIndia);
    
    console.log(`Found ${recentIndianEarthquakes.length} recent Indian earthquakes`);
    
    // Also get significant historical earthquakes (older than 10 years)
    const oldStartDate = new Date();
    oldStartDate.setFullYear(startDate.getFullYear() - 20); // 30 years total from today
    
    const oldStartTimeStr = oldStartDate.toISOString();
    
    // Fetch only significant earthquakes (magnitude 4.5+) for the older period
    const significantUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oldStartTimeStr}&endtime=${startTimeStr}&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=97&minmagnitude=4.5`;
    
    console.log("Fetching older significant Indian earthquakes with URL:", significantUrl);
    const significantResponse = await fetch(significantUrl);
    const significantData: USGSResponse = await significantResponse.json();
    
    // Filter significant earthquakes for India
    const olderSignificantEarthquakes = significantData.features.filter(isInIndia);
    
    console.log(`Found ${olderSignificantEarthquakes.length} older significant Indian earthquakes`);
    
    // Combine both datasets
    const combinedEarthquakes = [...recentIndianEarthquakes, ...olderSignificantEarthquakes];
    
    // Sort by time (newest first)
    combinedEarthquakes.sort((a, b) => b.properties.time - a.properties.time);
    
    // Map to our format
    return combinedEarthquakes.map(featureToEarthquake);
  } catch (error) {
    console.error("Error fetching historical Indian earthquake data:", error);
    throw error;
  }
};

// Interface for National Center for Seismology (NCS) API response
interface NCSEarthquakeResponse {
  features: {
    properties: {
      place: string;
      mag: number;
      time: string;
      depth: number;
      latitude: number;
      longitude: number;
    };
    id: string;
  }[];
}

/**
 * Fetches earthquake data from National Center for Seismology (NCS) API
 * This API provides real-time earthquake data for India
 * All events from this source are considered priority as they are India-specific
 */
export const fetchNCSEarthquakeData = async (): Promise<ShakeAlertEvent[]> => {
  try {
    // NCS API endpoint for recent earthquakes in India
    // Note: This is a simulated endpoint as the actual NCS API might have a different structure
    const response = await fetch(
      'https://api.ncs.gov.in/earthquakes/v1/recent',
      {
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    );
    
    if (!response.ok) {
      console.warn('NCS API not available, will use USGS data only');
      return [];
    }
    
    const data: NCSEarthquakeResponse = await response.json();
    
    // Process NCS earthquake data - all these are considered Indian events
    const processedEvents = data.features.map(feature => {
      const magnitude = feature.properties.mag || 0;
      const location = feature.properties.place || 'India Region';
      const time = new Date(feature.properties.time);
      
      // Ensure we have valid coordinates
      const longitude = Number(feature.properties.longitude);
      const latitude = Number(feature.properties.latitude);
      const coordinates: [number, number] = [longitude, latitude];
      
      // Create a minimal event for the seconds calculation
      const minimalEvent: ShakeAlertEvent = {
        id: '',
        title: '',
        magnitude: 0,
        location: '',
        time: time.toISOString(),
        coordinates,
        url: '',
        alertLevel: 'green',
        expectedShaking: 'weak',
        isPriority: false
      };
      
      // Create ShakeAlert event from NCS data
      return {
        id: `ncs-${feature.id}`,
        title: `M${magnitude.toFixed(1)} - ${location}`,
        magnitude,
        location,
        time: time.toISOString(),
        coordinates,
        url: `https://seismo.gov.in/earthquake/${feature.id}`,
        alertLevel: getAlertLevel(magnitude),
        expectedShaking: getExpectedShaking(magnitude),
        secondsUntilShaking: calculateSecondsUntilShaking(minimalEvent),
        isPriority: true // All NCS events are India priority
      };
    });
    
    // Filter out any events that somehow don't have valid coordinates
    return processedEvents.filter(event => 
      event.coordinates[0] !== 0 && 
      event.coordinates[1] !== 0 &&
      !isNaN(event.coordinates[0]) && 
      !isNaN(event.coordinates[1])
    );
    
  } catch (error) {
    // Log the error but don't fail the entire request
    if (error instanceof Error) {
      console.warn('Error fetching NCS earthquake data (non-fatal):', {
        message: error.message,
        name: error.name,
        errorObj: error
      });
    } else {
      console.error('Error fetching NCS earthquake data (non-Error object):', error);
    }
    return []; // Return empty array on error, will fall back to USGS data
  }
};

/**
 * Fetches ShakeAlert data for earthquake early warnings
 * Only marks Indian locations as priority
 */
export const fetchShakeAlertData = async (): Promise<ShakeAlertEvent[]> => {
  try {
    // 1. First fetch Indian earthquake data from NCS
    const ncsEvents = await fetchNCSEarthquakeData();
    
    // 2. Then fetch global data from USGS
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    if (!response.ok) {
      throw new Error('Failed to fetch USGS earthquake data');
    }
    
    const data = await response.json();
    
    // 3. Process USGS data
    const usgsEvents: ShakeAlertEvent[] = [];
    
    for (const feature of data.features) {
      // Skip any features that don't have required data
      if (!feature.id || !feature.properties || !feature.geometry) continue;
      
      // Create basic event
      const event: ShakeAlertEvent = {
        id: `usgs-${feature.id}`,
        title: feature.properties.title || 'Earthquake',
        magnitude: feature.properties.mag || 0,
        location: feature.properties.place || 'Unknown location',
        time: new Date(feature.properties.time).toISOString(),
        coordinates: [
          feature.geometry.coordinates[0], 
          feature.geometry.coordinates[1]
        ],
        url: feature.properties.url || 'https://earthquake.usgs.gov',
        alertLevel: getAlertLevel(feature.properties.mag),
        expectedShaking: getExpectedShaking(feature.properties.mag),
        secondsUntilShaking: 0, // Will be set based on location
        isPriority: false // Default to false, will be set for Indian events
      };
      
      // Check if this is an Indian earthquake
      const isIndian = isInIndia(feature);
      event.isPriority = isIndian;
      
      // For Indian events, ensure they have a minimum alert level of yellow
      if (isIndian && event.alertLevel === 'green') {
        event.alertLevel = 'yellow';
      }
      
      // Calculate seconds until shaking (simplified)
      event.secondsUntilShaking = calculateSecondsUntilShaking(event);
      
      usgsEvents.push(event);
    }
    
    // 4. Combine NCS and USGS events, with NCS first
    const allEvents = [...ncsEvents, ...usgsEvents];
    
    // 5. Remove duplicates based on location and time
    const uniqueEvents = removeDuplicates(allEvents);
    
    // 6. Sort by priority (Indian first) and then by time (newest first)
    return uniqueEvents.sort((a, b) => {
      // Indian events first
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      
      // Then sort by time (newest first)
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
    
  } catch (error) {
    console.error('Error in fetchShakeAlertData:', error);
    // Return empty array on error to prevent breaking the UI
    return [];
  }
};

// Helper function to determine alert level based on magnitude
const getAlertLevel = (magnitude: number): ShakeAlertEvent['alertLevel'] => {
  if (magnitude >= 5.0) return 'red';
  if (magnitude >= 4.0) return 'orange';
  if (magnitude >= 3.0) return 'yellow';
  return 'green';
};

// Helper function to determine expected shaking
const getExpectedShaking = (magnitude: number): ShakeAlertEvent['expectedShaking'] => {
  if (magnitude >= 7.0) return 'violent';
  if (magnitude >= 6.0) return 'very strong';
  if (magnitude >= 5.0) return 'strong';
  if (magnitude >= 4.0) return 'moderate';
  if (magnitude >= 3.0) return 'light';
  return 'weak';
};

// Helper function to calculate seconds until shaking (simplified)
const calculateSecondsUntilShaking = (event: ShakeAlertEvent): number => {
  // In a real implementation, this would use the user's location
  // and the earthquake's location to calculate actual time
  return Math.floor(Math.random() * 30) + 5; // 5-35 seconds
};

// Helper function to remove duplicate events
const removeDuplicates = (events: ShakeAlertEvent[]): ShakeAlertEvent[] => {
  const seen = new Set<string>();
  const unique: ShakeAlertEvent[] = [];
  
  for (const event of events) {
    // Create a unique key based on location, time, and magnitude
    const time = new Date(event.time);
    const timeKey = Math.floor(time.getTime() / (1000 * 60 * 15)); // 15-minute windows
    const locationKey = event.coordinates
      .map(coord => coord.toFixed(2))
      .join(',');
    const key = `${locationKey}-${timeKey}-${event.magnitude.toFixed(1)}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(event);
    }
  }
  
  return unique;
};

// Placeholder functions for additional earthquake data fetching methods
export const fetchEarthquakesByRegion = async (region: string): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByMagnitude = async (minMag: number, maxMag: number): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByDepth = async (minDepth: number, maxDepth: number): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByDate = async (startDate: Date, endDate: Date): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByCoordinates = async (lat: number, lng: number): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByRadius = async (lat: number, lng: number, radius: number): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByBoundingBox = async (minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByPolygon = async (points: [number, number][]): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByCountry = async (country: string): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByState = async (state: string): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByCity = async (city: string): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};

export const fetchEarthquakesByZipCode = async (zipCode: string): Promise<Earthquake[]> => {
  // Implementation would go here
  return [];
};