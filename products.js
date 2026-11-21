// Kategoriyalar va mahsulotlar ma'lumotlari — shu yerda tahrirlang
const CATEGORIES = [
  { id: 'elektronika', name: 'Elektronika', icon: '📱' },
  { id: 'kiyim', name: 'Kiyim', icon: '👕' },
  { id: 'uy', name: "Uy-ro'zg'or", icon: '🏠' },
  { id: 'oziq', name: 'Oziq-ovqat', icon: '🍎' },
  { id: 'goz', name: "Go'zallik", icon: '💄' },
  { id: 'sport', name: 'Sport', icon: '⚽' },
  { id: 'bolalar', name: 'Bolalar', icon: '🧸' },
  { id: 'kitob', name: 'Kitoblar', icon: '📚' }
];

const PRODUCTS = [
  { id: 1, name: 'Simsiz quloqchin', cat: 'elektronika', icon: '🎧', price: 249000, old: 310000, rating: 4.7, stock: 24, desc: "Shovqinni kamaytiradigan simsiz quloqchin. Bir zaryadda 30 soatgacha ishlaydi, Bluetooth 5.3 va tez zaryadlash qo'llab-quvvatlanadi.", specs: ['Bluetooth 5.3', '30 soat batareya', 'USB-C zaryad', '1 yil kafolat'] },
  { id: 2, name: 'Smart soat', cat: 'elektronika', icon: '⌚', price: 389000, old: 459000, rating: 4.6, stock: 15, desc: "Yurak urishi, uyqu va qadamlarni kuzatadigan smart soat. Suvga chidamli, AMOLED ekran.", specs: ['AMOLED ekran', 'IP68 suvga chidamli', '7 kun batareya', 'Android / iOS'] },
  { id: 3, name: 'Veb-kamera Full HD', cat: 'elektronika', icon: '📷', price: 269000, old: null, rating: 4.4, stock: 30, desc: "Onlayn darslar va yig'ilishlar uchun Full HD veb-kamera, o'rnatilgan mikrofon bilan.", specs: ['1080p / 30fps', 'Avto-fokus', 'Mikrofon ichida', 'USB ulanish'] },
  { id: 4, name: 'Sport krossovka', cat: 'kiyim', icon: '👟', price: 329000, old: null, rating: 4.8, stock: 40, desc: "Yengil va qulay krossovka. Yugurish va kundalik kiyish uchun mos, sirpanmaydigan tagcharm.", specs: ['Nafas oluvchi mato', 'Yengil (280 g)', "36–45 o'lchamlar", 'Sirpanmaydigan taglik'] },
  { id: 5, name: 'Shahar ryukzagi', cat: 'kiyim', icon: '🎒', price: 175000, old: 195000, rating: 4.5, stock: 33, desc: "Noutbuk uchun alohida bo'limli, suv o'tkazmaydigan ryukzak. 25 litr hajm.", specs: ['25 litr', 'Noutbuk 15.6" gacha', 'Suv o\'tkazmaydi', 'USB port'] },
  { id: 6, name: 'Paxtali futbolka', cat: 'kiyim', icon: '👕', price: 99000, old: null, rating: 4.3, stock: 60, desc: "100% paxtadan tikilgan, yumshoq va qulay futbolka. Bir necha rangda mavjud.", specs: ['100% paxta', 'S–XXL', 'Mashinada yuviladi', 'Bir necha rang'] },
  { id: 7, name: 'Termos krujka', cat: 'uy', icon: '☕', price: 89000, old: null, rating: 4.6, stock: 50, desc: "Issiq ichimlikni 8 soat, sovuqni 12 soat saqlaydi. Zanglamaydigan po'latdan.", specs: ['450 ml', 'Zanglamaydigan po\'lat', '8 soat issiq', 'Sizmaydigan qopqoq'] },
  { id: 8, name: 'LED stol lampasi', cat: 'uy', icon: '💡', price: 119000, old: 159000, rating: 4.5, stock: 22, desc: "Yorqinligi sozlanadigan, ko'zni charchatmaydigan LED lampa. Sensorli boshqaruv.", specs: ['3 yorug\'lik rejimi', 'Sensorli tugma', 'USB quvvat', 'Egiluvchan tayanch'] },
  { id: 9, name: 'Shisha choynak', cat: 'uy', icon: '🫖', price: 135000, old: null, rating: 4.2, stock: 18, desc: "Issiqqa chidamli shishadan, choy damlash uchun filtri bor choynak. Hajmi 1 litr.", specs: ['1 litr', 'Issiqqa chidamli shisha', 'Chiqariladigan filtr', 'Idish yuvish mashinasi'] },
  { id: 10, name: 'Yangi olma (1 kg)', cat: 'oziq', icon: '🍎', price: 24000, old: null, rating: 4.8, stock: 120, desc: "Farg'ona vodiysidan yangi uzilgan, shirin va mazali olma. Narx 1 kg uchun.", specs: ['Mahalliy', '1 kg', 'Yangi hosil', 'Saqlash: 0–4°C'] },
  { id: 11, name: 'Tabiiy asal', cat: 'oziq', icon: '🍯', price: 85000, old: null, rating: 4.9, stock: 45, desc: "Tog' o'tlari asali, qo'shimchalarsiz. Shisha idishda, 500 gramm.", specs: ['500 g', '100% tabiiy', "Tog' asali", 'Shisha idish'] },
  { id: 12, name: 'Qahva donalari', cat: 'oziq', icon: '🫘', price: 95000, old: 110000, rating: 4.7, stock: 38, desc: "O'rtacha qovurilgan arabika donalari. Boy hid va yumshoq ta'm.", specs: ['500 g', '100% arabika', "O'rtacha qovurish", 'Dona holda'] },
  { id: 13, name: 'Yuz parvarish to\'plami', cat: 'goz', icon: '🧴', price: 145000, old: 153000, rating: 4.4, stock: 27, desc: "Tozalash, namlash va himoya uchun 3 mahsulotdan iborat to'plam.", specs: ['3 ta mahsulot', 'Hamma teri turi', 'Gipoallergen', 'Dermatolog tekshirgan'] },
  { id: 14, name: "Lab bo'yog'i", cat: 'goz', icon: '💄', price: 69000, old: null, rating: 4.5, stock: 70, desc: "Uzoq turadigan, namlovchi lab bo'yog'i. 12 ta rang ichidan tanlang.", specs: ['12 ta rang', 'Uzoq turadi', 'Namlovchi', 'Vitamin E'] },
  { id: 15, name: 'Ayollar atiri', cat: 'goz', icon: '🌸', price: 320000, old: null, rating: 4.8, stock: 12, desc: "Gul va vanil notalari uyg'unlashgan nafis atir. Hajmi 50 ml.", specs: ['50 ml', 'Gul-vanil hid', 'Uzoq turadi', "Sovg'a qutisi"] },
  { id: 16, name: "Futbol to'pi", cat: 'sport', icon: '⚽', price: 129000, old: null, rating: 4.6, stock: 35, desc: "5-o'lchamli professional futbol to'pi. Chidamli material, maydon va zal uchun.", specs: ["5-o'lcham", 'PU material', 'Chidamli tikuv', 'Nasos bilan'] },
  { id: 17, name: 'Yoga gilami', cat: 'sport', icon: '🧘', price: 149000, old: 180000, rating: 4.7, stock: 26, desc: "Sirpanmaydigan, qalinligi 6 mm bo'lgan yoga va mashq gilami. Ko'tarish tasmasi bilan.", specs: ['6 mm qalinlik', 'Sirpanmaydigan', '183 × 61 sm', 'Tasma bilan'] },
  { id: 18, name: 'Gantel to\'plami', cat: 'sport', icon: '🏋️', price: 210000, old: null, rating: 4.5, stock: 14, desc: "Og'irligi sozlanadigan gantellar to'plami, uy mashqlari uchun qulay.", specs: ['2 × 5 kg', "Og'irligi sozlanadi", 'Rezina qoplama', 'Sirpanmaydigan tutqich'] },
  { id: 19, name: 'Yumshoq ayiqcha', cat: 'bolalar', icon: '🧸', price: 79000, old: null, rating: 4.9, stock: 55, desc: "Bolalar uchun yumshoq va xavfsiz o'yinchoq. Yuviladigan material.", specs: ['40 sm', 'Yuviladi', 'Gipoallergen', '0+ yosh'] },
  { id: 20, name: 'Konstruktor (250 detal)', cat: 'bolalar', icon: '🧩', price: 189000, old: 229000, rating: 4.7, stock: 20, desc: "Tafakkurni rivojlantiruvchi konstruktor. 250 ta detal, yo'riqnoma bilan.", specs: ['250 detal', '6+ yosh', 'Yo\'riqnoma bor', 'Zararsiz plastik'] },
  { id: 21, name: 'Bolalar velosipedi', cat: 'bolalar', icon: '🚲', price: 890000, old: null, rating: 4.6, stock: 8, desc: "4–7 yoshli bolalar uchun yordamchi g'ildirakli velosiped. Yengil rama.", specs: ['16" g\'ildirak', '4–7 yosh', "Yordamchi g'ildirak", 'Yengil rama'] },
  { id: 22, name: 'Badiiy roman', cat: 'kitob', icon: '📖', price: 55000, old: null, rating: 4.8, stock: 80, desc: "Mashhur zamonaviy roman, qattiq muqovada. 380 sahifa.", specs: ['380 sahifa', 'Qattiq muqova', "O'zbek tilida", 'Yangi nashr'] },
  { id: 23, name: 'Daftar to\'plami (5 dona)', cat: 'kitob', icon: '📓', price: 35000, old: null, rating: 4.3, stock: 150, desc: "Maktab va ofis uchun 5 ta katakli daftar, 48 varaq.", specs: ['5 dona', '48 varaq', 'Katakli', 'Sifatli qog\'oz'] },
  { id: 24, name: 'Rangli qalamlar (24 rang)', cat: 'kitob', icon: '✏️', price: 45000, old: null, rating: 4.6, stock: 90, desc: "Chizish va ijod uchun 24 xil rangli yumshoq qalamlar to'plami.", specs: ['24 rang', 'Yumshoq o\'zak', 'Yog\'och korpus', 'Metall quti'] }
];
