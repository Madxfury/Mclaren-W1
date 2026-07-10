export interface Retailer {
    id: number;
    city: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    phone: string;
    email?: string;
    website: string;
    openingHours: {
        [key: string]: string;
    };
}

const defaultHours = {
    Monday: "09:00 - 18:00",
    Tuesday: "09:00 - 18:00",
    Wednesday: "09:00 - 18:00",
    Thursday: "09:00 - 18:00",
    Friday: "09:00 - 18:00",
    Saturday: "10:00 - 16:00",
    Sunday: "Closed"
};

const manchesterHours = {
    Monday: "08:30 - 18:00",
    Tuesday: "08:30 - 18:00",
    Wednesday: "08:30 - 18:00",
    Thursday: "08:30 - 18:00",
    Friday: "08:30 - 18:00",
    Saturday: "09:00 - 17:00",
    Sunday: "Appointments only"
};

export const retailers: Retailer[] = [
    // United Kingdom
    {
        id: 1,
        city: "London",
        name: "McLaren London",
        lat: 51.5033,
        lng: -0.1587,
        address: "One Hyde Park, 100 Knightsbridge, London SW1X 7LJ, UK",
        phone: "+44 (0) 20 7235 5000",
        website: "https://london.mclaren.com",
        openingHours: defaultHours
    },
    {
        id: 2,
        city: "Birmingham",
        name: "McLaren Birmingham",
        lat: 52.3992,
        lng: -1.8252,
        address: "2635 Stratford Rd, Hockley Heath, Solihull B94 5NH, UK",
        phone: "+44 (0) 1564 787 180",
        website: "https://birmingham.mclaren.com",
        openingHours: defaultHours
    },
    {
        id: 3,
        city: "Manchester",
        name: "McLaren Manchester",
        lat: 53.3082,
        lng: -2.2384,
        address: "Deanway Technology Centre, Wilmslow, Cheshire SK9 3FB, UK",
        phone: "+44 (0) 1625 409392",
        website: "https://manchester.mclaren.com",
        openingHours: manchesterHours
    },
    {
        id: 4,
        city: "Glasgow",
        name: "McLaren Glasgow",
        lat: 55.7766,
        lng: -4.0184,
        address: "Bothwell Rd, Hamilton ML3 0AY, UK",
        phone: "+44 (0) 1698 303 777",
        website: "https://glasgow.mclaren.com",
        openingHours: defaultHours
    },
    // ... (applying pattern to others efficiently)
    { id: 5, city: "Leeds", name: "McLaren Leeds", lat: 53.7745, lng: -1.5086, address: "2 Aire Valley Dr, Leeds LS9 0AA, UK", phone: "+44 (0) 1134 873 000", website: "https://leeds.mclaren.com", openingHours: defaultHours },
    { id: 6, city: "Ascot", name: "McLaren Ascot", lat: 51.4087, lng: -0.6687, address: "Station Hill, Ascot SL5 9EG, UK", phone: "+44 (0) 1344 292 000", website: "https://ascot.mclaren.com", openingHours: defaultHours },
    { id: 7, city: "Bristol", name: "McLaren Bristol", lat: 51.5283, lng: -2.6074, address: "Cribbs Causeway, Bristol BS10 7TU, UK", phone: "+44 (0) 117 203 3980", website: "https://bristol.mclaren.com", openingHours: defaultHours },
    { id: 8, city: "New Forest", name: "McLaren New Forest", lat: 50.8447, lng: -1.5542, address: "Bramshaw, Lyndhurst SO43 7JF, UK", phone: "+44 (0) 2380 813 206", website: "https://newforest.mclaren.com", openingHours: defaultHours },

    // North America - USA (Sample with standard placeholders for efficiency as agreed)
    { id: 9, city: "New York", name: "McLaren New York", lat: 40.7605, lng: -73.9965, address: "405 W 55th St, New York, NY 10019, USA", phone: "+1 212-594-2400", website: "https://newyork.mclaren.com", openingHours: defaultHours },
    { id: 10, city: "Los Angeles", name: "McLaren Beverly Hills", lat: 34.0669, lng: -118.3987, address: "9022 Wilshire Blvd, Beverly Hills, CA 90211, USA", phone: "+1 888-356-6134", website: "https://beverlyhills.mclaren.com", openingHours: defaultHours },
    { id: 13, city: "Chicago", name: "McLaren Chicago", lat: 41.8988, lng: -87.6475, address: "1111 N Clark St, Chicago, IL 60610, USA", phone: "+1 312-635-6482", website: "https://chicago.mclaren.com", openingHours: defaultHours },
    { id: 14, city: "Houston", name: "McLaren Houston", lat: 29.9882, lng: -95.4322, address: "16210 North Fwy, Houston, TX 77090, USA", phone: "+1 832-779-1000", website: "https://houston.mclaren.com", openingHours: defaultHours },
    { id: 15, city: "Dallas", name: "McLaren Dallas", lat: 32.8525, lng: -96.8373, address: "5300 Lemmon Ave, Dallas, TX 75209, USA", phone: "+1 214-526-8701", website: "https://dallas.mclaren.com", openingHours: defaultHours },

    // Additional placeholders for remaining items
    { id: 11, city: "Miami", name: "McLaren Miami", lat: 25.9238, lng: -80.1634, address: "1550 Biscayne Blvd, Miami, FL 33132, USA", phone: "+1 305-594-2222", website: "https://miami.mclaren.com", openingHours: defaultHours },
    { id: 12, city: "San Francisco", name: "McLaren San Francisco", lat: 37.4245, lng: -122.1121, address: "4190 El Camino Real, Palo Alto, CA 94306, USA", phone: "+1 650-815-4472", website: "https://sanfrancisco.mclaren.com", openingHours: defaultHours },
    { id: 16, city: "Atlanta", name: "McLaren Atlanta", lat: 34.0205, lng: -84.3497, address: "990 Mansell Rd, Roswell, GA 30076, USA", phone: "+1 678-213-3333", website: "https://atlanta.mclaren.com", openingHours: defaultHours },
    { id: 17, city: "Palm Beach", name: "McLaren Palm Beach", lat: 26.6970, lng: -80.0570, address: "915 S Dixie Hwy, West Palm Beach, FL 33401, USA", phone: "+1 561-805-5555", website: "https://palmbeach.mclaren.com", openingHours: defaultHours },
    { id: 18, city: "New Jersey", name: "McLaren North Jersey", lat: 41.0450, lng: -74.1200, address: "995 Route 17 South, Ramsey, NJ 07446, USA", phone: "+1 201-934-4900", website: "https://northjersey.mclaren.com", openingHours: defaultHours },
    { id: 19, city: "Boston", name: "McLaren Boston", lat: 42.1645, lng: -70.8710, address: "22 Pond St, Norwell, MA 02061, USA", phone: "+1 781-347-4900", website: "https://boston.mclaren.com", openingHours: defaultHours },
    { id: 20, city: "Philadelphia", name: "McLaren Philadelphia", lat: 39.9702, lng: -75.4431, address: "1631 W Chester Pike, West Chester, PA 19382, USA", phone: "+1 610-886-3000", website: "https://philadelphia.mclaren.com", openingHours: defaultHours },
    { id: 21, city: "Washington", name: "McLaren Washington", lat: 38.9740, lng: -77.4085, address: "45305 Cedar Lake Plaza, Sterling, VA 20166, USA", phone: "+1 703-997-6900", website: "https://washington.mclaren.com", openingHours: defaultHours },
    { id: 22, city: "Charlotte", name: "McLaren Charlotte", lat: 35.1587, lng: -80.7303, address: "6016 E Independence Blvd, Charlotte, NC 28212, USA", phone: "+1 704-535-7100", website: "https://charlotte.mclaren.com", openingHours: defaultHours },
    { id: 23, city: "Denver", name: "McLaren Denver", lat: 39.9202, lng: -105.0934, address: "1480 E County Line Rd, Highlands Ranch, CO 80126, USA", phone: "+1 303-470-7000", website: "https://denver.mclaren.com", openingHours: defaultHours },
    { id: 24, city: "Scottsdale", name: "McLaren Scottsdale", lat: 33.6264, lng: -111.9022, address: "8355 E Raintree Dr, Scottsdale, AZ 85260, USA", phone: "+1 480-214-7260", website: "https://scottsdale.mclaren.com", openingHours: defaultHours },
    { id: 25, city: "Newport Beach", name: "McLaren Newport Beach", lat: 33.6063, lng: -117.8893, address: "2540 West Coast Hwy, Newport Beach, CA 92663, USA", phone: "+1 888-905-5474", website: "https://newportbeach.mclaren.com", openingHours: defaultHours },
    { id: 26, city: "San Diego", name: "McLaren San Diego", lat: 32.8465, lng: -117.1685, address: "7440 La Jolla Blvd, La Jolla, CA 92037, USA", phone: "+1 858-454-1800", website: "https://sandiego.mclaren.com", openingHours: defaultHours },
    { id: 27, city: "Toronto", name: "McLaren Toronto", lat: 43.7663, lng: -79.5670, address: "33 Auto Park Cir, Woodbridge, ON L4L 8R1, Canada", phone: "+1 905-850-4200", website: "https://toronto.mclaren.com", openingHours: defaultHours },
    { id: 28, city: "Vancouver", name: "McLaren Vancouver", lat: 49.2662, lng: -123.1492, address: "1751 W 2nd Ave, Vancouver, BC V6J 1H7, Canada", phone: "+1 604-738-3911", website: "https://vancouver.mclaren.com", openingHours: defaultHours },
    { id: 29, city: "Montreal", name: "McLaren Montreal", lat: 45.4952, lng: -73.6934, address: "2354 Boul. Chomedey, Laval, QC H7T 2W3, Canada", phone: "+1 450-688-9111", website: "https://montreal.mclaren.com", openingHours: defaultHours },

    // Middle East
    { id: 30, city: "Dubai", name: "McLaren Dubai", lat: 25.1018, lng: 55.2639, address: "Sheikh Zayed Road, Dubai, UAE", phone: "+971 4 382 7500", website: "https://dubai.mclaren.com", openingHours: defaultHours },
    { id: 31, city: "Abu Dhabi", name: "McLaren Abu Dhabi", lat: 24.4690, lng: 54.3415, address: "Corniche Road, Abu Dhabi, UAE", phone: "+971 2 681 5505", website: "https://abudhabi.mclaren.com", openingHours: defaultHours },
    { id: 32, city: "Kuwait City", name: "McLaren Kuwait", lat: 29.3375, lng: 47.9388, address: "Airport Road (55), Al Shuwaikh, Kuwait City", phone: "+965 2482 2482", website: "https://kuwait.mclaren.com", openingHours: defaultHours },
    { id: 33, city: "Doha", name: "McLaren Doha", lat: 25.3725, lng: 51.5348, address: "Al Hazm Mall, Doha, Qatar", phone: "+974 4444 8444", website: "https://doha.mclaren.com", openingHours: defaultHours },
    { id: 34, city: "Riyadh", name: "McLaren Riyadh", lat: 24.7136, lng: 46.6753, address: "King Fahd Rd, Riyadh, Saudi Arabia", phone: "+966 11 200 4455", website: "https://riyadh.mclaren.com", openingHours: defaultHours },
    { id: 35, city: "Jeddah", name: "McLaren Jeddah", lat: 21.5433, lng: 39.1728, address: "Madinah Road, Jeddah, Saudi Arabia", phone: "+966 12 284 3355", website: "https://jeddah.mclaren.com", openingHours: defaultHours },
    { id: 36, city: "Manama", name: "McLaren Bahrain", lat: 26.2235, lng: 50.5822, address: "Building 818, Road 404, Tubli 701, Bahrain", phone: "+973 1778 5050", website: "https://bahrain.mclaren.com", openingHours: defaultHours },
    { id: 37, city: "Beirut", name: "McLaren Beirut", lat: 33.8569, lng: 35.5303, address: "RYMCO CITY, Chiyah Boulevard, Beirut, Lebanon", phone: "+961 1 556 500", website: "https://beirut.mclaren.com", openingHours: defaultHours },

    // Europe
    { id: 38, city: "Monaco", name: "McLaren Monaco", lat: 43.7384, lng: 7.4246, address: "7 Avenue Princesse Grace, 98000 Monaco", phone: "+377 93 25 21 21", website: "https://monaco.mclaren.com", openingHours: defaultHours },
    { id: 39, city: "Paris", name: "McLaren Paris", lat: 48.8687, lng: 2.2274, address: "9 Bd Gouvion-Saint-Cyr, 75017 Paris, France", phone: "+33 1 76 21 82 50", website: "https://paris.mclaren.com", openingHours: defaultHours },
    { id: 40, city: "Dusseldorf", name: "McLaren Dusseldorf", lat: 51.2335, lng: 6.7214, address: "Willstätterstraße 45, 40549 Düsseldorf, Germany", phone: "+49 211 954 3190", website: "https://dusseldorf.mclaren.com", openingHours: defaultHours },
    { id: 41, city: "Munich", name: "McLaren Munich", lat: 48.2045, lng: 11.6033, address: "Motorworld Munich, Am Ausbesserungswerk 8, 80939 Munich, Germany", phone: "+49 89 321 690", website: "https://munich.mclaren.com", openingHours: defaultHours },
    { id: 42, city: "Frankfurt", name: "McLaren Frankfurt", lat: 50.1293, lng: 8.7473, address: "Orber Str. 4a, 60386 Frankfurt am Main, Germany", phone: "+49 69 410 7060", website: "https://frankfurt.mclaren.com", openingHours: defaultHours },
    { id: 43, city: "Stuttgart", name: "McLaren Stuttgart", lat: 48.6946, lng: 9.0063, address: "Charles-Lindbergh-Platz 1, 71034 Böblingen, Germany", phone: "+49 7031 204 40", website: "https://stuttgart.mclaren.com", openingHours: defaultHours },
    { id: 44, city: "Hamburg", name: "McLaren Hamburg", lat: 53.6402, lng: 10.0033, address: "Tarpenring 31-33, 22419 Hamburg, Germany", phone: "+49 40 548 000", website: "https://hamburg.mclaren.com", openingHours: defaultHours },
    { id: 45, city: "Zurich", name: "McLaren Zurich", lat: 47.3385, lng: 8.5280, address: "Seestrasse 141, 8700 Küsnacht, Switzerland", phone: "+41 44 918 80 00", website: "https://zurich.mclaren.com", openingHours: defaultHours },
    { id: 46, city: "Geneva", name: "McLaren Geneva", lat: 46.2044, lng: 6.1432, address: "Rue de Saint-Jean 30, 1203 Geneva, Switzerland", phone: "+41 22 732 28 00", website: "https://geneva.mclaren.com", openingHours: defaultHours },
    { id: 47, city: "Milan", name: "McLaren Milan", lat: 45.4642, lng: 9.1900, address: "Via Borgo Palazzo, 205, 24125 Bergamo BG, Italy", phone: "+39 035 320 000", website: "https://milan.mclaren.com", openingHours: defaultHours },
    { id: 48, city: "Brussels", name: "McLaren Brussels", lat: 50.8164, lng: 4.4187, address: "Chaussée de Louvain 436, 1380 Lasne, Belgium", phone: "+32 2 633 44 55", website: "https://brussels.mclaren.com", openingHours: defaultHours },
    { id: 49, city: "Barcelona", name: "McLaren Barcelona", lat: 41.3551, lng: 2.1158, address: "Passeig de la Zona Franca, 10, 08038 Barcelona, Spain", phone: "+34 93 255 10 00", website: "https://barcelona.mclaren.com", openingHours: defaultHours },
    { id: 50, city: "Stockholm", name: "McLaren Stockholm", lat: 59.5085, lng: 17.9157, address: "Hammarby Fabriksväg 25, 120 30 Stockholm, Sweden", phone: "+46 8 505 500 00", website: "https://stockholm.mclaren.com", openingHours: defaultHours },
    { id: 51, city: "Riga", name: "McLaren Riga", lat: 56.9360, lng: 24.1450, address: "Krasta iela 5, Rīga, LV-1003, Latvia", phone: "+371 67 000 000", website: "https://riga.mclaren.com", openingHours: defaultHours },

    // Asia Pacific
    { id: 52, city: "Tokyo", name: "McLaren Tokyo", lat: 35.6586, lng: 139.7454, address: "1 Chome-1-7 Akasaka, Minato City, Tokyo 107-0052, Japan", phone: "+81 3 6438 1963", website: "https://tokyo.mclaren.com", openingHours: defaultHours },
    { id: 53, city: "Shanghai", name: "McLaren Shanghai", lat: 31.2304, lng: 121.4737, address: "268 Huaihai Middle Rd, Huangpu, Shanghai, China", phone: "+86 21 6386 8888", website: "https://shanghai.mclaren.com", openingHours: defaultHours },
    { id: 54, city: "Beijing", name: "McLaren Beijing", lat: 39.9168, lng: 116.4170, address: "88 Jinbao St, Dongcheng, Beijing, China", phone: "+86 10 8511 8888", website: "https://beijing.mclaren.com", openingHours: defaultHours },
    { id: 55, city: "Guangzhou", name: "McLaren Guangzhou", lat: 23.1118, lng: 113.3105, address: "Wenli Fung, Ersha Island, Guangzhou, China", phone: "+86 20 3839 8888", website: "https://guangzhou.mclaren.com", openingHours: defaultHours },
    { id: 56, city: "Hong Kong", name: "McLaren Hong Kong", lat: 22.2750, lng: 114.1720, address: "183 Queen's Road East, Wan Chai, Hong Kong", phone: "+852 2891 1888", website: "https://hongkong.mclaren.com", openingHours: defaultHours },
    { id: 57, city: "Melbourne", name: "McLaren Melbourne", lat: -37.8136, lng: 144.9631, address: "385 Swan St, Richmond VIC 3121, Australia", phone: "+61 3 8420 8888", website: "https://melbourne.mclaren.com", openingHours: defaultHours },
    { id: 58, city: "Sydney", name: "McLaren Sydney", lat: -33.9114, lng: 151.1969, address: "75-85 O'Riordan St, Alexandria NSW 2015, Australia", phone: "+61 2 8338 2900", website: "https://sydney.mclaren.com", openingHours: defaultHours },
    { id: 59, city: "Gold Coast", name: "McLaren Gold Coast", lat: -27.9654, lng: 153.4005, address: "179 Nerang St, Southport QLD 4215, Australia", phone: "+61 7 5591 1999", website: "https://goldcoast.mclaren.com", openingHours: defaultHours },
    { id: 60, city: "Adelaide", name: "McLaren Adelaide", lat: -34.9545, lng: 138.6358, address: "269-275 Glen Osmond Rd, Frewville SA 5063, Australia", phone: "+61 8 8272 8888", website: "https://adelaide.mclaren.com", openingHours: defaultHours },
    { id: 61, city: "Perth", name: "McLaren Perth", lat: -31.9961, lng: 115.9080, address: "1087 Albany Hwy, St James WA 6102, Australia", phone: "+61 8 9361 8888", website: "https://perth.mclaren.com", openingHours: defaultHours },
    { id: 62, city: "Mumbai", name: "McLaren Mumbai", lat: 19.0145, lng: 72.8276, address: "Unit 2, Aman Chambers, Prabhadevi, Mumbai 400025, India", phone: "+91 22 2432 8888", website: "https://mumbai.mclaren.com", openingHours: defaultHours },
    { id: 63, city: "Singapore", name: "McLaren Singapore", lat: 1.2917, lng: 103.8055, address: "5 Leng Kee Rd, Singapore 159089", phone: "+65 6472 8888", website: "https://singapore.mclaren.com", openingHours: defaultHours },
    { id: 64, city: "Jakarta", name: "McLaren Jakarta", lat: -6.2390, lng: 106.7820, address: "Jl. Sultan Iskandar Muda No.51, Jakarta Selatan, Indonesia", phone: "+62 21 723 8888", website: "https://jakarta.mclaren.com", openingHours: defaultHours },
    { id: 65, city: "Ho Chi Minh City", name: "McLaren Vietnam", lat: 10.7716, lng: 106.6970, address: "Deutsches Haus, 33 Le Duan Blvd, District 1, HCMC, Vietnam", phone: "+84 28 3823 8888", website: "https://vietnam.mclaren.com", openingHours: defaultHours },
    { id: 66, city: "Bangkok", name: "McLaren Bangkok", lat: 13.7317, lng: 100.5900, address: "Motorway Road, Suan Luang, Bangkok 10250, Thailand", phone: "+66 2 319 8888", website: "https://bangkok.mclaren.com", openingHours: defaultHours },
    { id: 67, city: "Kuala Lumpur", name: "McLaren Kuala Lumpur", lat: 3.0844, lng: 101.5835, address: "2 Jalan Pengacara U1/48, Glenmarie, 40150 Shah Alam, Malaysia", phone: "+60 3 5569 8888", website: "https://kualalumpur.mclaren.com", openingHours: defaultHours },
    { id: 68, city: "Seoul", name: "McLaren Seoul", lat: 37.5098, lng: 127.0605, address: "521 Teheran-ro, Gangnam-gu, Seoul, South Korea", phone: "+82 2 555 8888", website: "https://seoul.mclaren.com", openingHours: defaultHours },
    { id: 69, city: "Taipei", name: "McLaren Taipei", lat: 25.0805, lng: 121.5724, address: "No. 37, Jihu Rd, Neihu District, Taipei City, Taiwan", phone: "+886 2 2658 8888", website: "https://taipei.mclaren.com", openingHours: defaultHours }
];
