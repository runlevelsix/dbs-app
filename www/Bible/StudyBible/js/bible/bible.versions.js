// Load a versions file from
// /app/content/bible/versions.json
// then checks for subfolders

bible.versions = {
	// prebuild version array
	versionData: null,
	
	// versions by key
	versionsByKey: {},
	
	// list of keys
	versionKeys: [],
	
	getVersion: function(key) {
		return this.versionsByKey[key];
	},
	
	loadingVersionIndex: -1,
	
	loadingCallback: null,
	
	// loaded from content/bible/versions.js
	allVersions: [],
	
	loadVersionManifest: function() {
		var t = this;
		
		$.ajax({
			url: 'content/bibles/versions.json',
			dataType: 'json',
			cache: false,
			success: function(data) {
				t.allVersions = data.versions;
				t.loadNextVersion();
			},
			error: function(x) {
				console.log('asdfa', x)
				
			}
		});
	},
	
	loadNextVersion: function() {
		if (this.allVersions.length == 0) {
			this.loadVersionManifest();
			return;
		}
		
		var t = this,
			versionFolder = '';
		
		t.loadingVersionIndex++;
		
		if (t.loadingVersionIndex < t.allVersions.length) {	
		
			versionFolder = this.allVersions[this.loadingVersionIndex];
		
			$.ajax({
				url: 'content/bibles/' + versionFolder + '/version.json',
				dataType: 'json',
				success: function(data) {
					
					// create language
					if (typeof t.versionData[data.language.toLowerCase()] == 'undefined') {
						t.versionData[data.language.toLowerCase()] = {
							languageName: bible.language.codes[data.language.toLowerCase()],
							versions: {}
						};
					}
					// insertdata
					t.versionData[data.language.toLowerCase()].versions[data.code] = data;
					t.versionsByKey[data.code] = data;
					t.versionKeys.push(data.code);
					
					t.loadNextVersion();
				},
				error: function(error) {
					console.log(error)
					t.loadNextVersion();
				}
			});
		} else {
			t.loadingFinished();
		}
		
	},
	
	loadingFinished: function() {
		this.versionKeys.sort();
	
		//this.versionData = bible.versionData;
		this.loadingCallback(bible.versions.versionData);		
	},
	
	getVersions: function(callback) {
	
		this.loadingCallback = callback;
		
		if (this.versionData == null) {
			this.versionData = {};
			this.loadNextVersion();
		} else {
			this.loadingFinished();
		}
	}
};

bible.language = {
	codes:  {
	ara: 'Afar',
	abk: 'Abkhazian',
	ace: 'Achinese',
	ach: 'Acoli',
	ada: 'Adangme',
	ady: 'Adyghe; Adygei',
	afa: 'Afro-Asiatic languages',
	afh: 'Afrihili',
	afr: 'Afrikaans',
	ain: 'Ainu',
	aka: 'Akan',
	akk: 'Akkadian',
	alb: 'Shqiptar', // Albanian
	ale: 'Aleut',
	alg: 'Algonquian languages',
	alt: 'Southern Altai',
	amh: 'Amharic',
	anp: 'Angika',
	apa: 'Apache languages',
	ara: 'العربية', // Arabic
	arg: 'Aragonese',
	arm: 'Armenian',
	arn: 'Mapudungun',
	arp: 'Arapaho',
	arw: 'Arawak',
	asm: 'Assamese',
	ast: 'Asturian',
	ath: 'Athapascan languages',
	aus: 'Australian languages',
	ava: 'Avaric',
	ave: 'Avestan',
	awa: 'Awadhi',
	aym: 'Aymara',
	aze: 'Azerbaijani',
	bad: 'Banda languages',
	bai: 'Bamileke languages',
	bak: 'Bashkir',
	bal: 'Baluchi',
	bam: 'Bambara',
	ban: 'Balinese',
	baq: 'Basque',
	bas: 'Basa',
	bat: 'Baltic languages',
	bej: 'Beja; Bedawiyet',
	bel: 'Belarusian',
	bem: 'Bemba',
	ben: 'বাংলা', // Bengali
	ber: 'Berber languages',
	bho: 'Bhojpuri',
	bih: 'Bihari languages',
	bik: 'Bikol',
	bin: 'Bini; Edo',
	bis: 'Bislama',
	bla: 'Siksika',
	bnt: 'Bantu languages',
	tib: 'Tibetan',
	bos: 'Bosnian',
	bra: 'Braj',
	bre: 'Breton',
	btk: 'Batak languages',
	bua: 'Buriat',
	bug: 'Buginese',
	bul: 'Bulgarian',
	bur: 'Burmese',
	byn: 'Blin',
	cad: 'Caddo',
	cai: 'Central American Indian languages',
	car: 'Galibi Carib',
	cat: 'Catalan; Valencian',
	cau: 'Caucasian languages',
	ceb: 'Cebuano',
	cel: 'Celtic languages',
	cze: 'Czech',
	cha: 'Chamorro',
	chb: 'Chibcha',
	che: 'Chechen',
	chg: 'Chagatai',
	chi: 'Chinese',
	chk: 'Chuukese',
	chm: 'Mari',
	chn: 'Chinook jargon',
	cho: 'Choctaw',
	chp: 'Chipewyan; Dene Suline',
	chr: 'Cherokee',
	chu: 'Old Slavonic',
	chv: 'Chuvash',
	chy: 'Cheyenne',
	cmc: 'Chamic languages',
	cop: 'Coptic',
	cor: 'Cornish',
	cos: 'Corsican',
	cre: 'Cree',
	crh: 'Crimean Tatar',
	crp: 'Creoles and pidgins',
	csb: 'Kashubian',
	cus: 'Cushitic languages',
	wel: 'Welsh',
	cze: 'Czech',
	dak: 'Dakota',
	dan: 'Danish',
	dar: 'Dargwa',
	day: 'Land Dayak languages',
	del: 'Delaware',
	den: 'Slave',
	ger: 'German',
	dgr: 'Dogrib',
	din: 'Dinka',
	div: 'Divehi',
	doi: 'Dogri',
	dra: 'Dravidian languages',
	dsb: 'Lower Sorbian',
	dua: 'Duala',
	dum: 'Dutch',
	dut: 'Dutch; Flemish',
	dyu: 'Dyula',
	dzo: 'Dzongkha',
	efi: 'Efik',
	eka: 'Ekajuk',
	gre: 'ελληνικά', // Greek
	elx: 'Elamite',
	eng: 'English',
	engn: 'English Commentaries',
	epo: 'Esperanto',
	est: 'Estonian',
	baq: 'Basque',
	ewe: 'Ewe',
	ewo: 'Ewondo',
	fan: 'Fang',
	fao: 'Faroese',
	per: 'Persian',
	fat: 'Fanti',
	fij: 'Fijian',
	fil: 'Filipino; Pilipino',
	fin: 'Finnish',
	fiu: 'Finno-Ugrian languages',
	fon: 'Fon',
	fre: 'French',
	frr: 'Northern Frisian',
	frs: 'Eastern Frisian',
	fry: 'Western Frisian',
	ful: 'Fulah',
	fur: 'Friulian',
	gaa: 'Ga',
	gay: 'Gayo',
	gba: 'Gbaya',
	gem: 'Germanic languages',
	geo: 'Georgian',
	gez: 'Geez',
	gil: 'Gilbertese',
	gla: 'Gaelic',
	gle: 'Irish',
	glg: 'Galician',
	glv: 'Manx',
	gon: 'Gondi',
	gor: 'Gorontalo',
	got: 'Gothic',
	grb: 'Grebo',
	gre: 'ελληνικά', //Greek
	grn: 'Guarani',
	gsw: 'Swiss German',
	guj: 'ગુજરાતી', //Gujarati
	gwi: 'Gwich\'in',
	hai: 'Haida',
	hat: 'Haitian',
	hau: 'Hausa',
	haw: 'Hawaiian',
	heb: 'עברית', // Hebrew
	her: 'Herero',
	hil: 'Hiligaynon',
	him: 'Himachali languages; Western Pahari languages',
	hin: 'हिंदी', //Hindi
	hit: 'Hittite',
	hmn: 'Hmong; Mong',
	hmo: 'Hiri Motu',
	hrv: 'Croatian',
	hsb: 'Upper Sorbian',
	hun: 'Hungarian',
	hup: 'Hupa',
	arm: 'Armenian',
	iba: 'Iban',
	ibo: 'Igbo',
	ice: 'Icelandic',
	ido: 'Ido',
	iii: 'Sichuan Yi',
	ijo: 'Ijo languages',
	iku: 'Inuktitut',
	ile: 'Interlingue; Occidental',
	ilo: 'Iloko',
	inc: 'Indic languages',
	ind: 'bahasa Indonesia', //Indonesian
	ine: 'Indo-European languages',
	inh: 'Ingush',
	ipk: 'Inupiaq',
	ira: 'Iranian languages',
	iro: 'Iroquoian languages',
	ice: 'Icelandic',
	ita: 'Italian',
	jav: 'Javanese',
	jbo: 'Lojban',
	jpn: 'Japanese',
	jpr: 'Judeo-Persian',
	jrb: 'Judeo-Arabic',
	kaa: 'Kara-Kalpak',
	kab: 'Kabyle',
	kac: 'Kachin; Jingpho',
	kal: 'Kalaallisut; Greenlandic',
	kam: 'Kamba',
	kan: 'ಕನ್ನಡ', //Kannada
	kar: 'Karen languages',
	kas: 'Kashmiri',
	geo: 'Georgian',
	kau: 'Kanuri',
	kaw: 'Kawi',
	kaz: 'Kazakh',
	kbd: 'Kabardian',
	kha: 'Khasi',
	khi: 'Khoisan languages',
	khm: 'Central Khmer',
	kho: 'Khotanese; Sakan',
	kik: 'Kikuyu; Gikuyu',
	kin: 'Kinyarwanda',
	kir: 'Kirghiz; Kyrgyz',
	kmb: 'Kimbundu',
	kok: 'Konkani',
	kom: 'Komi',
	kon: 'Kongo',
	kor: '한국인', //Korean
	kos: 'Kosraean',
	kpe: 'Kpelle',
	krc: 'Karachay-Balkar',
	krl: 'Karelian',
	kro: 'Kru languages',
	kru: 'Kurukh',
	kua: 'Kuanyama',
	kum: 'Kumyk',
	kur: 'Kurdish',
	kut: 'Kutenai',
	lad: 'Ladino',
	lah: 'Lahnda',
	lam: 'Lamba',
	lao: 'Lao',
	lat: 'Latin',
	lav: 'Latvian',
	lez: 'Lezghian',
	lim: 'Limburgan',
	lin: 'Lingala',
	lit: 'Lithuanian',
	lol: 'Mongo',
	loz: 'Lozi',
	ltz: 'Luxembourgish; Letzeburgesch',
	lua: 'Luba-Lulua',
	lub: 'Luba-Katanga',
	lug: 'Ganda',
	lui: 'Luiseno',
	lun: 'Lunda',
	luo: 'Luo (Kenya and Tanzania)',
	lus: 'Lushai',
	mac: 'Macedonian',
	mad: 'Madurese',
	mag: 'Magahi',
	mah: 'Marshallese',
	mai: 'Maithili',
	mak: 'Makasar',
	mal: 'മലയാളം', //Malayalam
	man: 'Mandingo',
	mao: 'Maori',
	map: 'Austronesian languages',
	mar: 'मराठी', //Marathi
	mas: 'Masai',
	may: 'Malay',
	mdf: 'Moksha',
	mdr: 'Mandar',
	men: 'Mende',
	mic: 'Mi\'kmaq; Micmac',
	min: 'Minangkabau',
	mac: 'Macedonian',
	mkh: 'Mon-Khmer languages',
	mlg: 'Malagasy',
	mlt: 'Maltese',
	mnc: 'Manchu',
	mni: 'Manipuri',
	mno: 'Manobo languages',
	moh: 'Mohawk',
	mon: 'Mongolian',
	mos: 'Mossi',
	mao: 'Maori',
	may: 'Malay',
	mul: 'Multiple languages',
	mun: 'Munda languages',
	mus: 'Creek',
	mwl: 'Mirandese',
	mwr: 'Marwari',
	mys: 'Malaysia', //Malaysian
	bur: 'Burmese',
	myn: 'Mayan languages',
	myv: 'Erzya',
	nah: 'Nahuatl languages',
	nai: 'North American Indian languages',
	nap: 'Neapolitan',
	nau: 'Nauru',
	nav: 'Navajo; Navaho',
	nbl: 'Ndebele South',
	nde: 'Ndebele North',
	ndo: 'Ndonga',
	nep: 'नेपाली', //Nepali
	nia: 'Nias',
	nic: 'Niger-Kordofanian languages',
	niu: 'Niuean',
	dut: 'Dutch',
	nno: 'Norwegian Nynorsk',
	nob: 'Bokmål, Norwegian',
	nog: 'Nogai',
	nor: 'Norwegian',
	nqo: 'N\'Ko',
	nso: 'Pedi; Sepedi; Northern Sotho',
	nub: 'Nubian languages',
	nwc: 'Classical Newari; Old Newari; Classical Nepal Bhasa',
	nya: 'Chichewa; Chewa; Nyanja',
	nym: 'Nyamwezi',
	nyn: 'Nyankole',
	nyo: 'Nyoro',
	nzi: 'Nzima',
	oji: 'Ojibwa',
	ori: 'ଓଡ଼ିଆ', //Oriya
	orm: 'Oromo',
	osa: 'Osage',
	oss: 'Ossetian; Ossetic',
	oto: 'Otomian languages',
	paa: 'Papuan languages',
	pag: 'Pangasinan',
	pal: 'Pahlavi',
	pam: 'Pampanga; Kapampangan',
	pan: 'ਪੰਜਾਬੀ', //Punjabi
	pap: 'Papiamento',
	pau: 'Palauan',
	per: 'فارسی', //Persian
	pes: 'فارسی', //Persian
	phi: 'Philippine languages',
	phn: 'Phoenician',
	pli: 'Pali',
	pol: 'Polish',
	pon: 'Pohnpeian',
	por: 'Portuguese',
	pra: 'Prakrit languages',
	pus: 'Pashto',
	que: 'Quechua',
	raj: 'Rajasthani',
	rap: 'Rapanui',
	rar: 'Rarotongan; Cook Islands Maori',
	roa: 'Romance languages',
	roh: 'Romansh',
	rom: 'Romany',
	rum: 'Romanian',
	run: 'Rundi',
	rus: 'русский', //Russian
	sad: 'Sandawe',
	sag: 'Sango',
	sah: 'Yakut',
	sal: 'Salishan languages',
	sam: 'Samaritan Aramaic',
	san: 'Sanskrit',
	sas: 'Sasak',
	sat: 'Santali',
	scn: 'Sicilian',
	sco: 'Scots',
	sel: 'Selkup',
	sgn: 'Sign Languages',
	shn: 'Shan',
	sid: 'Sidamo',
	sin: 'Sinhala; Sinhalese',
	sio: 'Siouan languages',
	sit: 'Sino-Tibetan languages',
	sla: 'Slavic languages',
	slo: 'Slovak',
	sma: 'Southern Sami',
	sme: 'Northern Sami',
	smi: 'Sami languages',
	smj: 'Lule Sami',
	smn: 'Inari Sami',
	smo: 'Samoan',
	sms: 'Skolt Sami',
	sna: 'Shona',
	snd: 'Sindhi',
	snk: 'Soninke',
	sog: 'Sogdian',
	som: 'Soomaaliyeed', //Somali
	son: 'Songhai languages',
	sot: 'Sotho, Southern',
	spa: 'Español', //Spanish
	alb: 'Albanian',
	srd: 'Sardinian',
	srn: 'Sranan Tongo',
	srp: 'Serbian',
	srr: 'Serer',
	ssa: 'Nilo-Saharan languages',
	ssw: 'Swati',
	suk: 'Sukuma',
	sun: 'Sundanese',
	sus: 'Susu',
	sux: 'Sumerian',
	swa: 'Swahili',
	swe: 'Swedish',
	syc: 'Classical Syriac',
	syr: 'Syriac',
	tah: 'Tahitian',
	tai: 'Tai languages',
	tam: 'தமிழ்', //Tamil
	tat: 'Tatar',
	tel: 'తెలుగు', //Telugu
	tem: 'Timne',
	ter: 'Tereno',
	tet: 'Tetum',
	tgk: 'Tajik',
	tgl: 'Tagalog',
	tha: 'Thai',
	tib: 'Tibetan',
	tig: 'Tigre',
	tir: 'Tigrinya',
	tiv: 'Tiv',
	tkl: 'Tokelau',
	tlh: 'Klingon',
	tli: 'Tlingit',
	tmh: 'Tamashek',
	tog: 'Tonga',
	ton: 'Tonga',
	tpi: 'Tok Pisin',
	tsi: 'Tsimshian',
	tsn: 'Tswana',
	tso: 'Tsonga',
	tuk: 'Turkmen',
	tum: 'Tumbuka',
	tup: 'Tupi languages',
	tur: 'Türkçe', //Turkish
	tut: 'Altaic languages',
	tvl: 'Tuvalu',
	twi: 'Twi',
	tyv: 'Tuvinian',
	udm: 'Udmurt',
	uga: 'Ugaritic',
	uig: 'Uighur; Uyghur',
	ukr: 'Ukrainian',
	umb: 'Umbundu',
	und: 'Undetermined',
	urd: 'اردو', //Urdu
	uzb: 'Uzbek',
	vai: 'Vai',
	ven: 'Venda',
	vie: 'Tiếng Việt', //Vietnamese
	vol: 'Volapük',
	vot: 'Votic',
	wak: 'Wakashan languages',
	wal: 'Wolaitta; Wolaytta',
	war: 'Waray',
	was: 'Washo',
	wel: 'Welsh',
	wen: 'Sorbian languages',
	wln: 'Walloon',
	wol: 'Wolof',
	xal: 'Kalmyk; Oirat',
	xho: 'Xhosa',
	yao: 'Yao',
	yap: 'Yapese',
	yid: 'Yiddish',
	yor: 'Yoruba',
	ypk: 'Yupik languages',
	zap: 'Zapotec',
	zbl: 'Blissymbols; Blissymbolics; Bliss',
	zen: 'Zenaga',
	zgh: 'Standard Moroccan Tamazight',
	zha: 'Zhuang',
	chi: 'Chinese Simplified',
	zho: 'Chinese Traditional',
	znd: 'Zande languages',
	zul: 'Zulu',
	zun: 'Zuni'
	}
};