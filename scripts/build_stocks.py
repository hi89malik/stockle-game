import urllib.request
import http.cookiejar
import json
import datetime
import concurrent.futures
import time
import os

COMPANIES = [
    {
        "ticker": "AAPL",
        "name": "Apple Inc.",
        "sector": "Information Technology",
        "industry": "Consumer Electronics",
        "marketCap": "$5.16 Trillion",
        "marketCapNum": 5157.2,
        "color": "#0071e3",
        "desc": "Pioneer in personal consumer electronics, designer of the iPhone, Mac, iPad, and iOS software ecosystem.",
        "peRatio": "39.5x",
        "foundedYear": 1976
    },
    {
        "ticker": "MSFT",
        "name": "Microsoft Corporation",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$3.88 Trillion",
        "marketCapNum": 3883.9,
        "color": "#00a4ef",
        "desc": "Global software leader behind Windows, Azure cloud platform, Office 365, and AI Copilot integration.",
        "peRatio": "27.3x",
        "foundedYear": 1975
    },
    {
        "ticker": "NVDA",
        "name": "NVIDIA Corporation",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$4.01 Trillion",
        "marketCapNum": 4013.0,
        "color": "#76b900",
        "desc": "World leader in GPU computing, accelerated hardware architectures, and enterprise AI accelerators.",
        "peRatio": "21.0x",
        "foundedYear": 1993
    },
    {
        "ticker": "GOOGL",
        "name": "Alphabet Inc.",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "marketCap": "$3.67 Trillion",
        "marketCapNum": 3672.2,
        "color": "#4285f4",
        "desc": "Parent company of Google Search, YouTube, Android operating system, and Google Cloud.",
        "peRatio": "15.6x",
        "foundedYear": 1998
    },
    {
        "ticker": "AMZN",
        "name": "Amazon.com Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Internet Retail",
        "marketCap": "$2.89 Trillion",
        "marketCapNum": 2891.9,
        "color": "#ff9900",
        "desc": "Global e-commerce marketplace giant, logistics titan, and pioneer of Amazon Web Services (AWS) cloud.",
        "peRatio": "21.6x",
        "foundedYear": 1994
    },
    {
        "ticker": "META",
        "name": "Meta Platforms Inc.",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "marketCap": "$1.59 Trillion",
        "marketCapNum": 1594.5,
        "color": "#0668e1",
        "desc": "Social technology titan operating Facebook, Instagram, WhatsApp, Messenger, and Reality Labs VR.",
        "peRatio": "21.3x",
        "foundedYear": 2004
    },
    {
        "ticker": "TSLA",
        "name": "Tesla Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Auto Manufacturers",
        "marketCap": "$1.57 Trillion",
        "marketCapNum": 1571.0,
        "color": "#cc0000",
        "desc": "Electric vehicle manufacturer, battery energy storage systems creator, and autonomous driving technology developer.",
        "peRatio": "436.8x",
        "foundedYear": 2003
    },
    {
        "ticker": "AVGO",
        "name": "Broadcom Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$1.74 Trillion",
        "marketCapNum": 1739.3,
        "color": "#cc092f",
        "desc": "Designs, develops, and supplies custom semiconductor chips, connectivity hardware, and enterprise infrastructure software.",
        "peRatio": "46.5x",
        "foundedYear": 1961
    },
    {
        "ticker": "COST",
        "name": "Costco Wholesale Corp.",
        "sector": "Consumer Staples",
        "industry": "Discount Stores",
        "marketCap": "$484.0 Billion",
        "marketCapNum": 484.0,
        "color": "#e31837",
        "desc": "Membership-only big-box warehouse retail chain famous for wholesale grocery savings and legendary customer loyalty.",
        "peRatio": "52.6x",
        "foundedYear": 1983
    },
    {
        "ticker": "NFLX",
        "name": "Netflix Inc.",
        "sector": "Communication Services",
        "industry": "Entertainment",
        "marketCap": "$257.4 Billion",
        "marketCapNum": 257.4,
        "color": "#e50914",
        "desc": "World-leading subscription video streaming entertainment service and original content production studio.",
        "peRatio": "18.1x",
        "foundedYear": 1997
    },
    {
        "ticker": "AMD",
        "name": "Advanced Micro Devices",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$959.9 Billion",
        "marketCapNum": 959.9,
        "color": "#ed1c24",
        "desc": "Semiconductor innovator manufacturing Ryzen desktop CPUs, EPYC enterprise server processors, and Radeon graphics.",
        "peRatio": "125.1x",
        "foundedYear": 1969
    },
    {
        "ticker": "PEP",
        "name": "PepsiCo Inc.",
        "sector": "Consumer Staples",
        "industry": "Beverages - Non-Alcoholic",
        "marketCap": "$193.9 Billion",
        "marketCapNum": 193.9,
        "color": "#005cb9",
        "desc": "Global beverage and snack food enterprise behind Pepsi, Frito-Lay, Gatorade, Quaker Oats, and Tropicana.",
        "peRatio": "17.9x",
        "foundedYear": 1898
    },
    {
        "ticker": "LIN",
        "name": "Linde plc",
        "sector": "Materials",
        "industry": "Specialty Chemicals",
        "marketCap": "$239.9 Billion",
        "marketCapNum": 239.9,
        "color": "#005596",
        "desc": "Largest industrial gas supplier in the world, serving healthcare, petroleum refining, manufacturing, and aerospace.",
        "peRatio": "34.7x",
        "foundedYear": 1879
    },
    {
        "ticker": "ADBE",
        "name": "Adobe Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$92.8 Billion",
        "marketCapNum": 92.8,
        "color": "#ff0000",
        "desc": "Creative software giant behind Photoshop, Illustrator, Premiere Pro, PDF Acrobat, and enterprise digital marketing clouds.",
        "peRatio": "13.3x",
        "foundedYear": 1982
    },
    {
        "ticker": "CSCO",
        "name": "Cisco Systems Inc.",
        "sector": "Information Technology",
        "industry": "Communication Equipment",
        "marketCap": "$402.2 Billion",
        "marketCapNum": 402.2,
        "color": "#1ba0d7",
        "desc": "Telecommunications hardware and networking pioneer producing enterprise routers, switches, and cybersecurity tools.",
        "peRatio": "27.1x",
        "foundedYear": 1984
    },
    {
        "ticker": "TMUS",
        "name": "T-Mobile US Inc.",
        "sector": "Communication Services",
        "industry": "Telecom Services",
        "marketCap": "$181.2 Billion",
        "marketCapNum": 181.2,
        "color": "#e20074",
        "desc": "Major wireless network carrier serving millions with ultra-fast 5G cellular communication and home broadband.",
        "peRatio": "16.5x",
        "foundedYear": 1994
    },
    {
        "ticker": "QCOM",
        "name": "QUALCOMM Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$189.5 Billion",
        "marketCapNum": 189.5,
        "color": "#3253dc",
        "desc": "Wireless telecommunications and chipmaker behind Snapdragon mobile processors and essential 5G cellular patents.",
        "peRatio": "13.9x",
        "foundedYear": 1985
    },
    {
        "ticker": "TXN",
        "name": "Texas Instruments Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$285.5 Billion",
        "marketCapNum": 285.5,
        "color": "#cc0000",
        "desc": "Major designer of analog and embedded processing chips for automotive, industrial, and consumer electronics.",
        "peRatio": "40.5x",
        "foundedYear": 1930
    },
    {
        "ticker": "AMGN",
        "name": "Amgen Inc.",
        "sector": "Healthcare",
        "industry": "Biotechnology",
        "marketCap": "$252.6 Billion",
        "marketCapNum": 252.6,
        "color": "#004879",
        "desc": "Biotechnology pioneer focused on innovative therapeutics for serious cardiovascular, oncology, and inflammatory illnesses.",
        "peRatio": "27.1x",
        "foundedYear": 1980
    },
    {
        "ticker": "INTU",
        "name": "Intuit Inc.",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$90.9 Billion",
        "marketCapNum": 90.9,
        "color": "#0077c5",
        "desc": "Financial and tax software platform company behind TurboTax, QuickBooks, Credit Karma, and Mailchimp.",
        "peRatio": "20.7x",
        "foundedYear": 1983
    },
    {
        "ticker": "ISRG",
        "name": "Intuitive Surgical Inc.",
        "sector": "Healthcare",
        "industry": "Medical Instruments & Supplies",
        "marketCap": "$152.5 Billion",
        "marketCapNum": 152.5,
        "color": "#005a9c",
        "desc": "Maker of the renowned da Vinci robotic surgical systems enabling minimally invasive complex surgeries worldwide.",
        "peRatio": "53.2x",
        "foundedYear": 1995
    },
    {
        "ticker": "CMCSA",
        "name": "Comcast Corporation",
        "sector": "Communication Services",
        "industry": "Entertainment",
        "marketCap": "$88.1 Billion",
        "marketCapNum": 88.1,
        "color": "#e01a22",
        "desc": "Media and telecommunications powerhouse owning Xfinity broadband, NBCUniversal media, and Universal Studios theme parks.",
        "peRatio": "7.8x",
        "foundedYear": 1963
    },
    {
        "ticker": "HON",
        "name": "Honeywell International",
        "sector": "Industrials",
        "industry": "Conglomerates",
        "marketCap": "$70.9 Billion",
        "marketCapNum": 70.9,
        "color": "#ee3124",
        "desc": "Diversified industrial technology giant serving commercial aerospace, building automation, and industrial safety.",
        "peRatio": "11.1x",
        "foundedYear": 1906
    },
    {
        "ticker": "AMAT",
        "name": "Applied Materials Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductor Equipment",
        "marketCap": "$302.3 Billion",
        "marketCapNum": 302.3,
        "color": "#0085ca",
        "desc": "Global leader in materials engineering solutions used to manufacture virtually every new chip and advanced display in the world.",
        "peRatio": "30.2x",
        "foundedYear": 1967
    },
    {
        "ticker": "BKNG",
        "name": "Booking Holdings Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Travel Services",
        "marketCap": "$119.9 Billion",
        "marketCapNum": 119.9,
        "color": "#003580",
        "desc": "Online travel and accommodation booking conglomerate behind Booking.com, Priceline, Agoda, KAYAK, and OpenTable.",
        "peRatio": "17.5x",
        "foundedYear": 1997
    },
    {
        "ticker": "VRTX",
        "name": "Vertex Pharmaceuticals",
        "sector": "Healthcare",
        "industry": "Biotechnology",
        "marketCap": "$137.6 Billion",
        "marketCapNum": 137.6,
        "color": "#5b2c86",
        "desc": "Biopharmaceutical company renowned for revolutionary cystic fibrosis treatments and gene therapies for sickle cell.",
        "peRatio": "34.9x",
        "foundedYear": 1989
    },
    {
        "ticker": "SBUX",
        "name": "Starbucks Corporation",
        "sector": "Consumer Discretionary",
        "industry": "Restaurants",
        "marketCap": "$122.3 Billion",
        "marketCapNum": 122.3,
        "color": "#00704a",
        "desc": "World's premier roaster and retailer of specialty coffee, operating tens of thousands of cafes globally.",
        "peRatio": "48.5x",
        "foundedYear": 1971
    },
    {
        "ticker": "PANW",
        "name": "Palo Alto Networks",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$264.1 Billion",
        "marketCapNum": 264.1,
        "color": "#fa582d",
        "desc": "Global cybersecurity leader delivering next-generation firewalls, cloud security, and AI-driven automated threat defense.",
        "peRatio": "806.6x",
        "foundedYear": 2005
    },
    {
        "ticker": "MDLZ",
        "name": "Mondelez International",
        "sector": "Consumer Staples",
        "industry": "Confectioners",
        "marketCap": "$84.3 Billion",
        "marketCapNum": 84.3,
        "color": "#4f2d7f",
        "desc": "Global snack manufacturer producing Oreo cookies, Cadbury chocolates, Ritz crackers, and Milka confections.",
        "peRatio": "21.0x",
        "foundedYear": 2012
    },
    {
        "ticker": "REGN",
        "name": "Regeneron Pharmaceuticals",
        "sector": "Healthcare",
        "industry": "Biotechnology",
        "marketCap": "$98.4 Billion",
        "marketCapNum": 98.4,
        "color": "#003865",
        "desc": "Science-driven biotechnology firm that discovers and manufactures medicines for eye diseases, cancer, and immunology.",
        "peRatio": "21.0x",
        "foundedYear": 1988
    },
    {
        "ticker": "ADP",
        "name": "Automatic Data Processing",
        "sector": "Industrials",
        "industry": "Staffing & Employment Services",
        "marketCap": "$121.6 Billion",
        "marketCapNum": 121.6,
        "color": "#d02027",
        "desc": "Cloud-based human capital management and payroll processing provider serving hundreds of thousands of businesses.",
        "peRatio": "27.3x",
        "foundedYear": 1949
    },
    {
        "ticker": "LRCX",
        "name": "Lam Research Corporation",
        "sector": "Information Technology",
        "industry": "Semiconductor Equipment",
        "marketCap": "$292.0 Billion",
        "marketCapNum": 292.0,
        "color": "#004b87",
        "desc": "Crucial supplier of wafer fabrication equipment and plasma etching technology to global semiconductor foundries.",
        "peRatio": "34.8x",
        "foundedYear": 1980
    },
    {
        "ticker": "MU",
        "name": "Micron Technology Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$903.4 Billion",
        "marketCapNum": 903.4,
        "color": "#0039a6",
        "desc": "Leading global producer of memory and storage solutions including DRAM, NAND flash, and High Bandwidth Memory (HBM).",
        "peRatio": "10.7x",
        "foundedYear": 1978
    },
    {
        "ticker": "KLAC",
        "name": "KLA Corporation",
        "sector": "Information Technology",
        "industry": "Semiconductor Equipment",
        "marketCap": "$205.0 Billion",
        "marketCapNum": 205.0,
        "color": "#0072ce",
        "desc": "Industry leader in process control and yield management systems essential for nanometer-scale chip fabrication.",
        "peRatio": "39.4x",
        "foundedYear": 1975
    },
    {
        "ticker": "GILD",
        "name": "Gilead Sciences Inc.",
        "sector": "Healthcare",
        "industry": "Biotechnology",
        "marketCap": "$208.3 Billion",
        "marketCapNum": 208.3,
        "color": "#b31b2c",
        "desc": "Biopharmaceutical company that revolutionized HIV treatments, hepatitis C cures, and oncological therapies.",
        "peRatio": "14.5x",
        "foundedYear": 1987
    },
    {
        "ticker": "SNPS",
        "name": "Synopsys Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$88.7 Billion",
        "marketCapNum": 88.7,
        "color": "#5b2c86",
        "desc": "Global leader in Electronic Design Automation (EDA) software used by chip designers to verify complex microprocessors.",
        "peRatio": "81.7x",
        "foundedYear": 1986
    },
    {
        "ticker": "CDNS",
        "name": "Cadence Design Systems",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$91.5 Billion",
        "marketCapNum": 91.5,
        "color": "#bf1922",
        "desc": "Pivotal EDA software and hardware emulation platform provider for designing integrated circuits and PCBs.",
        "peRatio": "66.3x",
        "foundedYear": 1988
    },
    {
        "ticker": "MELI",
        "name": "MercadoLibre Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Internet Retail",
        "marketCap": "$74.8 Billion",
        "marketCapNum": 74.8,
        "color": "#ffe600",
        "desc": "The 'Amazon of Latin America', operating dominant e-commerce platforms and Mercado Pago digital payment systems.",
        "peRatio": "39.6x",
        "foundedYear": 1999
    },
    {
        "ticker": "CRWD",
        "name": "CrowdStrike Holdings",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$235.4 Billion",
        "marketCapNum": 235.4,
        "color": "#fc0000",
        "desc": "Pioneer of cloud-native endpoint protection with its Falcon platform, defending enterprise networks against cyber attacks.",
        "peRatio": "4597.4x",
        "foundedYear": 2011
    },
    {
        "ticker": "PYPL",
        "name": "PayPal Holdings Inc.",
        "sector": "Financials",
        "industry": "Credit Services",
        "marketCap": "$48.4 Billion",
        "marketCapNum": 48.4,
        "color": "#003087",
        "desc": "Digital payments and money transfer network operating PayPal checkout, Venmo mobile wallet, and Braintree processing.",
        "peRatio": "11.1x",
        "foundedYear": 1998
    },
    {
        "ticker": "NXPI",
        "name": "NXP Semiconductors",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$67.4 Billion",
        "marketCapNum": 67.4,
        "color": "#ff7900",
        "desc": "Dutch-American chipmaker powering automotive radar, secure vehicle networking, and industrial IoT microcontrollers.",
        "peRatio": "21.0x",
        "foundedYear": 2006
    },
    {
        "ticker": "MAR",
        "name": "Marriott International",
        "sector": "Consumer Discretionary",
        "industry": "Lodging",
        "marketCap": "$109.4 Billion",
        "marketCapNum": 109.4,
        "color": "#b4192b",
        "desc": "World's largest hotel company, operating iconic hospitality brands like Ritz-Carlton, Sheraton, Westin, and Courtyard.",
        "peRatio": "42.3x",
        "foundedYear": 1927
    },
    {
        "ticker": "CSX",
        "name": "CSX Corporation",
        "sector": "Industrials",
        "industry": "Railroads",
        "marketCap": "$96.6 Billion",
        "marketCapNum": 96.6,
        "color": "#002a66",
        "desc": "Major freight rail transportation provider connecting eastern United States ports and industrial distribution hubs.",
        "peRatio": "27.3x",
        "foundedYear": 1827
    },
    {
        "ticker": "ORLY",
        "name": "O'Reilly Automotive",
        "sector": "Consumer Discretionary",
        "industry": "Specialty Retail",
        "marketCap": "$73.4 Billion",
        "marketCapNum": 73.4,
        "color": "#007a3d",
        "desc": "Dominant automotive aftermarket parts retailer serving both professional mechanics and DIY vehicle owners.",
        "peRatio": "28.1x",
        "foundedYear": 1957
    },
    {
        "ticker": "CTAS",
        "name": "Cintas Corporation",
        "sector": "Industrials",
        "industry": "Specialty Business Services",
        "marketCap": "$90.3 Billion",
        "marketCapNum": 90.3,
        "color": "#003366",
        "desc": "Supplies corporate identity uniform programs, restroom supplies, first aid cabinets, and facility safety services.",
        "peRatio": "44.9x",
        "foundedYear": 1968
    },
    {
        "ticker": "CHTR",
        "name": "Charter Communications",
        "sector": "Communication Services",
        "industry": "Entertainment",
        "marketCap": "$23.8 Billion",
        "marketCapNum": 23.8,
        "color": "#0073d1",
        "desc": "Broadband connectivity and cable television operator serving millions of subscribers under the Spectrum brand.",
        "peRatio": "12.5x",
        "foundedYear": 1993
    },
    {
        "ticker": "ABNB",
        "name": "Airbnb Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Travel Services",
        "marketCap": "$108.1 Billion",
        "marketCapNum": 108.1,
        "color": "#ff5a5f",
        "desc": "Revolutionary travel marketplace platform connecting travelers with unique homestays, vacations, and local experiences.",
        "peRatio": "34.0x",
        "foundedYear": 2008
    },
    {
        "ticker": "PCAR",
        "name": "PACCAR Inc.",
        "sector": "Industrials",
        "industry": "Heavy Construction Machinery",
        "marketCap": "$56.0 Billion",
        "marketCapNum": 56.0,
        "color": "#002d62",
        "desc": "World-class manufacturer of premium heavy-duty commercial trucks under Kenworth, Peterbilt, and DAF nameplates.",
        "peRatio": "20.3x",
        "foundedYear": 1905
    },
    {
        "ticker": "LULU",
        "name": "Lululemon Athletica",
        "sector": "Consumer Discretionary",
        "industry": "Apparel Retail",
        "marketCap": "$12.1 Billion",
        "marketCapNum": 12.1,
        "color": "#d31334",
        "desc": "High-end athletic apparel and yoga-wear brand that defined the modern athleisure fashion lifestyle.",
        "peRatio": "8.6x",
        "foundedYear": 1998
    },
    {
        "ticker": "MNST",
        "name": "Monster Beverage Corp.",
        "sector": "Consumer Staples",
        "industry": "Beverages - Non-Alcoholic",
        "marketCap": "$89.2 Billion",
        "marketCapNum": 89.2,
        "color": "#81d300",
        "desc": "Dominant energy drink brand known for Monster Energy, Reign, and extreme sports sponsorship culture.",
        "peRatio": "41.4x",
        "foundedYear": 1935
    },
    {
        "ticker": "KDP",
        "name": "Keurig Dr Pepper Inc.",
        "sector": "Consumer Staples",
        "industry": "Beverages - Non-Alcoholic",
        "marketCap": "$48.2 Billion",
        "marketCapNum": 48.2,
        "color": "#7a1315",
        "desc": "Beverage conglomerate combining Dr Pepper, 7UP, Snapple soft drinks with Keurig single-serve coffee brewers.",
        "peRatio": "31.9x",
        "foundedYear": 2018
    },
    {
        "ticker": "DXCM",
        "name": "DexCom Inc.",
        "sector": "Healthcare",
        "industry": "Medical Devices",
        "marketCap": "$30.4 Billion",
        "marketCapNum": 30.4,
        "color": "#007a33",
        "desc": "Pioneer of continuous glucose monitoring (CGM) systems for people living with diabetes.",
        "peRatio": "32.0x",
        "foundedYear": 1999
    },
    {
        "ticker": "FTNT",
        "name": "Fortinet Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$95.2 Billion",
        "marketCapNum": 95.2,
        "color": "#ee3124",
        "desc": "Cybersecurity firm delivering FortiGate hardware firewalls and integrated automated security fabric solutions.",
        "peRatio": "42.3x",
        "foundedYear": 2000
    },
    {
        "ticker": "KHC",
        "name": "The Kraft Heinz Company",
        "sector": "Consumer Staples",
        "industry": "Packaged Foods",
        "marketCap": "$29.0 Billion",
        "marketCapNum": 29.0,
        "color": "#c41230",
        "desc": "Global food company behind Kraft Macaroni & Cheese, Heinz Tomato Ketchup, Philadelphia cream cheese, and Oscar Mayer.",
        "peRatio": "13.8x",
        "foundedYear": 2015
    },
    {
        "ticker": "ADI",
        "name": "Analog Devices Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$198.3 Billion",
        "marketCapNum": 198.3,
        "color": "#003366",
        "desc": "Precision analog, mixed-signal, and DSP chipmaker essential for factory robotics, medical sensors, and EV powertrains.",
        "peRatio": "48.6x",
        "foundedYear": 1965
    },
    {
        "ticker": "ROST",
        "name": "Ross Stores Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Apparel Retail",
        "marketCap": "$76.1 Billion",
        "marketCapNum": 76.1,
        "color": "#003f7a",
        "desc": "Off-price apparel and home fashion retail powerhouse delivering brand-name items at deep bargain discounts.",
        "peRatio": "28.7x",
        "foundedYear": 1982
    },
    {
        "ticker": "CPRT",
        "name": "Copart Inc.",
        "sector": "Industrials",
        "industry": "Specialty Business Services",
        "marketCap": "$29.6 Billion",
        "marketCapNum": 29.6,
        "color": "#002e6d",
        "desc": "Global online salvage and insurance vehicle auction company connecting vehicle sellers with buyers worldwide.",
        "peRatio": "20.6x",
        "foundedYear": 1982
    },
    {
        "ticker": "IDXX",
        "name": "IDEXX Laboratories Inc.",
        "sector": "Healthcare",
        "industry": "Diagnostics & Research",
        "marketCap": "$55.0 Billion",
        "marketCapNum": 55.0,
        "color": "#005596",
        "desc": "Leader in veterinary diagnostics, pet healthcare software, and livestock water testing equipment.",
        "peRatio": "47.0x",
        "foundedYear": 1983
    },
    {
        "ticker": "PAYX",
        "name": "Paychex Inc.",
        "sector": "Industrials",
        "industry": "Staffing & Employment Services",
        "marketCap": "$41.0 Billion",
        "marketCapNum": 41.0,
        "color": "#005696",
        "desc": "Integrated human capital management platform providing payroll, HR, and benefits outsourcing for small-to-mid businesses.",
        "peRatio": "22.9x",
        "foundedYear": 1971
    },
    {
        "ticker": "EXC",
        "name": "Exelon Corporation",
        "sector": "Utilities",
        "industry": "Utilities - Regulated Electric",
        "marketCap": "$47.2 Billion",
        "marketCapNum": 47.2,
        "color": "#003b71",
        "desc": "Nation's largest utility company by customer count, serving electric and natural gas utilities across multiple states.",
        "peRatio": "17.8x",
        "foundedYear": 2000
    },
    {
        "ticker": "FAST",
        "name": "Fastenal Company",
        "sector": "Industrials",
        "industry": "Industrial Distribution",
        "marketCap": "$63.7 Billion",
        "marketCapNum": 63.7,
        "color": "#004b87",
        "desc": "Distributor of industrial fasteners, safety gear, and on-site automated industrial supply vending machines.",
        "peRatio": "45.2x",
        "foundedYear": 1967
    },
    {
        "ticker": "CEG",
        "name": "Constellation Energy",
        "sector": "Utilities",
        "industry": "Utilities - Renewable",
        "marketCap": "$99.3 Billion",
        "marketCapNum": 99.3,
        "color": "#f15a22",
        "desc": "Largest producer of carbon-free nuclear and clean energy in the United States, powering data centers and green grids.",
        "peRatio": "22.7x",
        "foundedYear": 1816
    },
    {
        "ticker": "TEAM",
        "name": "Atlassian Corporation",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$38.6 Billion",
        "marketCapNum": 38.6,
        "color": "#0052cc",
        "desc": "Software collaboration firm creator of Jira project tracking, Confluence knowledge base, and Trello boards.",
        "peRatio": "461.5x",
        "foundedYear": 2002
    },
    {
        "ticker": "VRSK",
        "name": "Verisk Analytics Inc.",
        "sector": "Industrials",
        "industry": "Consulting Services",
        "marketCap": "$26.5 Billion",
        "marketCapNum": 26.5,
        "color": "#004876",
        "desc": "Data analytics and risk assessment provider providing actuarial underwriting data for property and casualty insurers.",
        "peRatio": "31.3x",
        "foundedYear": 1971
    },
    {
        "ticker": "FANG",
        "name": "Diamondback Energy",
        "sector": "Energy",
        "industry": "Oil & Gas E&P",
        "marketCap": "$50.9 Billion",
        "marketCapNum": 50.9,
        "color": "#005596",
        "desc": "Leading independent oil and natural gas exploration company operating in the premier Permian Basin.",
        "peRatio": "24.5x",
        "foundedYear": 2007
    },
    {
        "ticker": "BIIB",
        "name": "Biogen Inc.",
        "sector": "Healthcare",
        "industry": "Biotechnology",
        "marketCap": "$37.0 Billion",
        "marketCapNum": 37.0,
        "color": "#00857c",
        "desc": "Neuroscience biotechnology leader developing breakthrough drugs for Alzheimer's disease, MS, and spinal muscular atrophy.",
        "peRatio": "108.4x",
        "foundedYear": 1978
    },
    {
        "ticker": "DLTR",
        "name": "Dollar Tree Inc.",
        "sector": "Consumer Staples",
        "industry": "Discount Stores",
        "marketCap": "$26.5 Billion",
        "marketCapNum": 26.5,
        "color": "#007a3d",
        "desc": "Leading discount retailer operating extreme-value Dollar Tree and Family Dollar convenience merchandise stores.",
        "peRatio": "17.2x",
        "foundedYear": 1986
    },
    {
        "ticker": "ZS",
        "name": "Zscaler Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$31.5 Billion",
        "marketCapNum": 31.5,
        "color": "#0072ce",
        "desc": "Cloud-native Zero Trust cybersecurity platform protecting remote workforces against enterprise data breaches.",
        "peRatio": "72.5x",
        "foundedYear": 2007
    },
    {
        "ticker": "INTC",
        "name": "Intel Corporation",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$325.3 Billion",
        "marketCapNum": 325.3,
        "color": "#0071c5",
        "desc": "Semiconductor manufacturing pioneer producing x86 Core CPUs and enterprise Xeon server microprocessors.",
        "peRatio": "36.4x",
        "foundedYear": 1968
    },
    {
        "ticker": "DELL",
        "name": "Dell Technologies",
        "sector": "Information Technology",
        "industry": "Computer Hardware",
        "marketCap": "$236.0 Billion",
        "marketCapNum": 236.0,
        "color": "#007db8",
        "desc": "Provider of IT infrastructure, AI server racks, workstations, monitors, and cloud storage systems.",
        "peRatio": "21.6x",
        "foundedYear": 1984
    },
    {
        "ticker": "MCHP",
        "name": "Microchip Technology",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$33.8 Billion",
        "marketCapNum": 33.8,
        "color": "#e31b23",
        "desc": "Leading developer of smart, connected, and secure embedded control microcontrollers and mixed-signal semiconductors.",
        "peRatio": "46.7x",
        "foundedYear": 1989
    },
    {
        "ticker": "EBAY",
        "name": "eBay Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Internet Retail",
        "marketCap": "$52.7 Billion",
        "marketCapNum": 52.7,
        "color": "#e53238",
        "desc": "Legendary peer-to-peer and merchant online auction and e-commerce marketplace connecting global buyers and sellers.",
        "peRatio": "26.2x",
        "foundedYear": 1995
    },
    {
        "ticker": "SIRI",
        "name": "Sirius XM Holdings",
        "sector": "Communication Services",
        "industry": "Entertainment",
        "marketCap": "$10.7 Billion",
        "marketCapNum": 10.7,
        "color": "#002d62",
        "desc": "Satellite radio broadcasting network providing commercial-free music, talk, sports, and podcasts in vehicles across North America.",
        "peRatio": "12.4x",
        "foundedYear": 1990
    },
    {
        "ticker": "ENPH",
        "name": "Enphase Energy Inc.",
        "sector": "Information Technology",
        "industry": "Solar",
        "marketCap": "$3.5 Billion",
        "marketCapNum": 3.5,
        "color": "#f37021",
        "desc": "Clean energy technology firm manufacturing solar microinverters and residential smart home battery backup systems.",
        "peRatio": "40.0x",
        "foundedYear": 2006
    },
    {
        "ticker": "DDOG",
        "name": "Datadog Inc.",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$66.6 Billion",
        "marketCapNum": 66.6,
        "color": "#632ca6",
        "desc": "Cloud observability and security monitoring platform giving DevOps teams unified visibility into modern microservices.",
        "peRatio": "256.2x",
        "foundedYear": 2010
    },
    {
        "ticker": "ZM",
        "name": "Zoom Video Communications",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$28.5 Billion",
        "marketCapNum": 28.5,
        "color": "#2d8cff",
        "desc": "Video communications company whose ubiquitous meeting app transformed modern remote work, education, and webinars.",
        "peRatio": "9.1x",
        "foundedYear": 2011
    },
    {
        "ticker": "DOCU",
        "name": "DocuSign Inc.",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$15.0 Billion",
        "marketCapNum": 15.0,
        "color": "#ff3000",
        "desc": "Electronic signature and automated agreement cloud platform streamlining contracts, legal documents, and digital approvals.",
        "peRatio": "48.9x",
        "foundedYear": 2003
    },
    {
        "ticker": "OKTA",
        "name": "Okta Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$31.9 Billion",
        "marketCapNum": 31.9,
        "color": "#007dc1",
        "desc": "Identity and access management platform offering secure single sign-on (SSO) and multifactor user authentication.",
        "peRatio": "110.0x",
        "foundedYear": 2009
    },
    {
        "ticker": "COIN",
        "name": "Coinbase Global Inc.",
        "sector": "Financials",
        "industry": "Financial Data & Exchanges",
        "marketCap": "$34.6 Billion",
        "marketCapNum": 34.6,
        "color": "#0052ff",
        "desc": "Premier US-regulated cryptocurrency exchange and onchain crypto custody platform for retail and institutional traders.",
        "peRatio": "39.5x",
        "foundedYear": 2012
    },
    {
        "ticker": "RIVN",
        "name": "Rivian Automotive Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Auto Manufacturers",
        "marketCap": "$18.7 Billion",
        "marketCapNum": 18.7,
        "color": "#4285f4",
        "desc": "Electric adventure vehicle manufacturer known for the R1T electric pickup, R1S SUV, and commercial delivery vans.",
        "peRatio": "N/A (Growth)",
        "foundedYear": 2009
    },
    {
        "ticker": "LCID",
        "name": "Lucid Group Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Auto Manufacturers",
        "marketCap": "$1.3 Billion",
        "marketCapNum": 1.3,
        "color": "#9b8579",
        "desc": "Luxury electric automaker producing high-performance, ultra-aerodynamic Lucid Air executive sedans and Gravity SUVs.",
        "peRatio": "N/A (Growth)",
        "foundedYear": 2007
    },
    {
        "ticker": "PLTR",
        "name": "Palantir Technologies",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$413.4 Billion",
        "marketCapNum": 413.4,
        "color": "#111111",
        "desc": "Big data and artificial intelligence software enterprise delivering Foundry and Gotham platforms for defense and commercial intelligence.",
        "peRatio": "120.8x",
        "foundedYear": 2003
    },
    {
        "ticker": "ARM",
        "name": "Arm Holdings plc",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$213.8 Billion",
        "marketCapNum": 213.8,
        "color": "#0091bd",
        "desc": "British semiconductor architecture firm whose low-power RISC instruction set designs power 99% of global smartphones.",
        "peRatio": "229.6x",
        "foundedYear": 1990
    },
    {
        "ticker": "SMCI",
        "name": "Super Micro Computer",
        "sector": "Information Technology",
        "industry": "Computer Hardware",
        "marketCap": "$17.8 Billion",
        "marketCapNum": 17.8,
        "color": "#003b71",
        "desc": "High-performance enterprise server and liquid-cooled data center rack designer optimized for generative AI workloads.",
        "peRatio": "5.7x",
        "foundedYear": 1993
    },
    {
        "ticker": "MDB",
        "name": "MongoDB Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$27.3 Billion",
        "marketCapNum": 27.3,
        "color": "#00ed64",
        "desc": "Developer-loved document database software and cloud database-as-a-service provider behind MongoDB Atlas.",
        "peRatio": "471.9x",
        "foundedYear": 2007
    },
    {
        "ticker": "NET",
        "name": "Cloudflare Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$114.1 Billion",
        "marketCapNum": 114.1,
        "color": "#f38020",
        "desc": "Global web performance, content delivery network (CDN), DDoS mitigation, and serverless edge computing provider.",
        "peRatio": "92.1x",
        "foundedYear": 2009
    },
    {
        "ticker": "DASH",
        "name": "DoorDash Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Internet Retail",
        "marketCap": "$75.2 Billion",
        "marketCapNum": 75.2,
        "color": "#ff3008",
        "desc": "Leading on-demand local delivery logistics platform connecting millions of consumers with restaurants and convenience groceries.",
        "peRatio": "71.6x",
        "foundedYear": 2013
    },
    {
        "ticker": "SHOP",
        "name": "Shopify Inc.",
        "sector": "Information Technology",
        "industry": "Software - Application",
        "marketCap": "$188.8 Billion",
        "marketCapNum": 188.8,
        "color": "#95bf47",
        "desc": "E-commerce platform empowering millions of merchants worldwide to build and operate digital online storefronts.",
        "peRatio": "90.0x",
        "foundedYear": 2006
    },
    {
        "ticker": "SPOT",
        "name": "Spotify Technology S.A.",
        "sector": "Communication Services",
        "industry": "Entertainment",
        "marketCap": "$123.0 Billion",
        "marketCapNum": 123.0,
        "color": "#1db954",
        "desc": "World's most popular audio streaming subscription service, offering millions of licensed music tracks, audiobooks, and podcasts.",
        "peRatio": "36.5x",
        "foundedYear": 2006
    },
    {
        "ticker": "UBER",
        "name": "Uber Technologies Inc.",
        "sector": "Industrials",
        "industry": "Software - Infrastructure",
        "marketCap": "$141.1 Billion",
        "marketCapNum": 141.1,
        "color": "#000000",
        "desc": "Global mobility platform operating ride-hailing transportation, Uber Eats food delivery, and freight logistics networks.",
        "peRatio": "40.7x",
        "foundedYear": 2009
    },
    {
        "ticker": "MRVL",
        "name": "Marvell Technology Inc.",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$148.0 Billion",
        "marketCapNum": 148.0,
        "color": "#003b71",
        "desc": "Semiconductor developer creating high-speed data infrastructure and optical interconnects for AI cloud clusters.",
        "peRatio": "54.1x",
        "foundedYear": 1995
    },
    {
        "ticker": "SNOW",
        "name": "Snowflake Inc.",
        "sector": "Information Technology",
        "industry": "Software - Infrastructure",
        "marketCap": "$105.4 Billion",
        "marketCapNum": 105.4,
        "color": "#29b5e8",
        "desc": "Cloud-based Data Cloud company offering instant, elastic data warehousing, secure sharing, and data lake storage.",
        "peRatio": "N/A (Growth)",
        "foundedYear": 2012
    },
    {
        "ticker": "RBLX",
        "name": "Roblox Corporation",
        "sector": "Communication Services",
        "industry": "Electronic Gaming",
        "marketCap": "$36.8 Billion",
        "marketCapNum": 36.8,
        "color": "#e01a22",
        "desc": "Global immersive metaverse gaming platform where millions of users create, play, and monetize 3D virtual experiences.",
        "peRatio": "N/A (Growth)",
        "foundedYear": 2004
    },
    {
        "ticker": "HOOD",
        "name": "Robinhood Markets Inc.",
        "sector": "Financials",
        "industry": "Capital Markets",
        "marketCap": "$73.3 Billion",
        "marketCapNum": 73.3,
        "color": "#00c805",
        "desc": "Commission-free stock, options, and crypto brokerage mobile app that pioneered zero-fee retail investing.",
        "peRatio": "37.5x",
        "foundedYear": 2013
    },
    {
        "ticker": "TTWO",
        "name": "Take-Two Interactive",
        "sector": "Communication Services",
        "industry": "Electronic Gaming",
        "marketCap": "$42.5 Billion",
        "marketCapNum": 42.5,
        "color": "#f15a22",
        "desc": "Legendary video game publishing titan behind Grand Theft Auto, Red Dead Redemption, NBA 2K, and Civilization.",
        "peRatio": "31.4x",
        "foundedYear": 1993
    },
    {
        "ticker": "ODFL",
        "name": "Old Dominion Freight Line",
        "sector": "Industrials",
        "industry": "Trucking",
        "marketCap": "$35.4 Billion",
        "marketCapNum": 35.4,
        "color": "#002d62",
        "desc": "Leading less-than-truckload (LTL) motor carrier providing nationwide regional and inter-regional shipping services.",
        "peRatio": "30.8x",
        "foundedYear": 1934
    },
    {
        "ticker": "ON",
        "name": "ON Semiconductor",
        "sector": "Information Technology",
        "industry": "Semiconductors",
        "marketCap": "$28.7 Billion",
        "marketCapNum": 28.7,
        "color": "#007a3d",
        "desc": "Pioneer in silicon carbide (SiC) and intelligent power solutions for electric vehicles and renewable energy grids.",
        "peRatio": "43.1x",
        "foundedYear": 1999
    },
    {
        "ticker": "BKR",
        "name": "Baker Hughes Company",
        "sector": "Energy",
        "industry": "Oil & Gas Equipment & Services",
        "marketCap": "$48.5 Billion",
        "marketCapNum": 48.5,
        "color": "#004879",
        "desc": "Energy technology company providing industrial oilfield services, turbomachinery, and carbon capture solutions.",
        "peRatio": "16.8x",
        "foundedYear": 1907
    },
    {
        "ticker": "DIS",
        "name": "The Walt Disney Company",
        "sector": "Communication Services",
        "industry": "Entertainment",
        "marketCap": "$204.1 Billion",
        "marketCapNum": 204.1,
        "color": "#113ccf",
        "desc": "Global family entertainment conglomerate operating Disney+, Pixar, Marvel, Star Wars, ESPN, and worldwide theme park resorts.",
        "peRatio": "24.4x",
        "foundedYear": 1923
    },
    {
        "ticker": "NKE",
        "name": "NIKE Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Footwear & Accessories",
        "marketCap": "$56.1 Billion",
        "marketCapNum": 56.1,
        "color": "#111111",
        "desc": "World's leading designer and marketer of athletic footwear, apparel, and sporting equipment with the iconic Swoosh logo.",
        "peRatio": "18.2x",
        "foundedYear": 1964
    }
]

def format_market_cap(cap_num):
    if not cap_num:
        return "$---", 0
    in_billions = cap_num / 1e9
    if in_billions >= 1000:
        in_trillions = in_billions / 1000
        return f"${in_trillions:.2f} Trillion", round(in_billions, 1)
    elif in_billions >= 1:
        return f"${in_billions:.1f} Billion", round(in_billions, 1)
    else:
        in_millions = cap_num / 1e6
        return f"${in_millions:.1f} Million", round(in_billions, 1)

def get_yahoo_session():
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    opener.addheaders = [
        ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
        ('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
    ]
    try:
        opener.open('https://fc.yahoo.com', timeout=5)
    except Exception:
        pass
    
    crumb_res = opener.open('https://query2.finance.yahoo.com/v1/test/getcrumb', timeout=5)
    crumb = crumb_res.read().decode('utf-8').strip()
    return opener, crumb

def fetch_live_quotes(tickers):
    print("Attempting to fetch live quotes for market caps and PE ratios...")
    try:
        opener, crumb = get_yahoo_session()
        print(f"Acquired Yahoo Finance session crumb: {crumb}")
        
        batch_size = 40
        quotes = {}
        for i in range(0, len(tickers), batch_size):
            chunk = tickers[i:i + batch_size]
            syms = ",".join(chunk)
            url = f"https://query2.finance.yahoo.com/v7/finance/quote?symbols={syms}&crumb={crumb}"
            try:
                req = urllib.request.Request(url)
                with opener.open(req, timeout=8) as res:
                    data = json.loads(res.read().decode('utf-8'))
                    for q in data.get('quoteResponse', {}).get('result', []):
                        quotes[q.get('symbol')] = q
                time.sleep(0.3)
            except Exception as batch_err:
                print(f"Warning: Batch error for {chunk[:3]}...: {batch_err}")
        print(f"Live quotes fetched for {len(quotes)} of {len(tickers)} symbols.")
        return quotes
    except Exception as e:
        print(f"Warning: Could not acquire Yahoo session/quotes ({e}). Using baseline data.")
        return {}

def fetch_ticker_data(item):
    ticker = item["ticker"]
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=5y&interval=1wk"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    
    try:
        with urllib.request.urlopen(req, timeout=8) as res:
            raw = json.loads(res.read())
            result = raw["chart"]["result"][0]
            timestamps = result.get("timestamp", [])
            closes = result["indicators"]["quote"][0].get("close", [])
            
            clean_pts = []
            for ts, c in zip(timestamps, closes):
                if c is not None and not (isinstance(c, float) and (c != c)): # skip nan
                    dt = datetime.datetime.fromtimestamp(ts, datetime.timezone.utc)
                    clean_pts.append({
                        "date": dt.strftime("%Y-%m-%d"),
                        "close": round(c, 2)
                    })
            
            if not clean_pts:
                print(f"[!] Warning: no clean points for {ticker}")
                return None
            
            start_yr = clean_pts[0]["date"][:4]
            end_yr = clean_pts[-1]["date"][:4]
            start_full = clean_pts[0]["date"]
            end_full = clean_pts[-1]["date"]
            
            closes_only = [p["close"] for p in clean_pts]
            min_price = min(closes_only)
            max_price = max(closes_only)
            start_price = closes_only[0]
            end_price = closes_only[-1]
            return_pct = round(((end_price - start_price) / start_price) * 100, 1)
            
            return {
                "ticker": item["ticker"],
                "name": item["name"],
                "sector": item["sector"],
                "industry": item["industry"],
                "marketCap": item["marketCap"],
                "marketCapNum": item["marketCapNum"],
                "color": item["color"],
                "desc": item["desc"],
                "peRatio": item.get("peRatio", "N/A"),
                "foundedYear": item.get("foundedYear", 2000),
                # Clues
                "dateRangeYears": f"{start_yr} - {end_yr}",
                "dateRangeFull": f"{start_full} to {end_full}",
                "startYear": int(start_yr),
                "endYear": int(end_yr),
                "pointCount": len(clean_pts),
                "minPrice": min_price,
                "maxPrice": max_price,
                "startPrice": start_price,
                "latestPrice": end_price,
                "returnPct": f"{'+' if return_pct >= 0 else ''}{return_pct}%",
                "points": clean_pts
            }
    except Exception as e:
        print(f"[!] Error fetching {ticker}: {e}")
        return None

def main():
    print(f"Starting fetch for {len(COMPANIES)} companies...")
    t0 = time.time()
    
    # 1. Update market caps and PE ratios from live quotes
    tickers = [c["ticker"] for c in COMPANIES]
    live_quotes = fetch_live_quotes(tickers)
    for c in COMPANIES:
        sym = c["ticker"]
        q = live_quotes.get(sym)
        if q and q.get("marketCap"):
            cap_str, cap_num = format_market_cap(q["marketCap"])
            c["marketCap"] = cap_str
            c["marketCapNum"] = cap_num
            if q.get("trailingPE") and q["trailingPE"] > 0:
                c["peRatio"] = f"{round(q['trailingPE'], 1)}x"

    os.makedirs("src/data", exist_ok=True)
    
    # 2. Fetch chart data
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_ticker_data, comp): comp["ticker"] for comp in COMPANIES}
        for future in concurrent.futures.as_completed(futures):
            ticker = futures[future]
            try:
                res = future.result()
                if res and res["pointCount"] >= 100:
                    results.append(res)
                    print(f"  [OK] {ticker}: {res['pointCount']} points ({res['dateRangeYears']})")
                else:
                    print(f"  [x] Skipped/Failed {ticker}")
            except Exception as e:
                print(f"  [x] Exception {ticker}: {e}")
                
    # Sort results by the original ranking order
    ticker_order = {c["ticker"]: i for i, c in enumerate(COMPANIES)}
    results.sort(key=lambda x: ticker_order.get(x["ticker"], 999))
    
    output_path = "src/data/stocks.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, separators=(",", ":"))
        
    meta_path = "src/data/stocksMeta.json"
    meta_list = [{
        "ticker": s["ticker"],
        "name": s["name"],
        "sector": s["sector"],
        "industry": s["industry"],
        "marketCap": s["marketCap"],
        "marketCapNum": s["marketCapNum"],
        "peRatio": s.get("peRatio", "N/A"),
        "foundedYear": s.get("foundedYear", 2000)
    } for s in results]
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_list, f, indent=2)

    # Sync to public directory for static asset delivery
    os.makedirs("public", exist_ok=True)
    with open("public/stocks.json", "w", encoding="utf-8") as f:
        json.dump(results, f, separators=(",", ":"))
    with open("public/stocksMeta.json", "w", encoding="utf-8") as f:
        json.dump(meta_list, f, indent=2)
        
    size_kb = os.path.getsize(output_path) / 1024
    print(f"\nDone! Successfully fetched and compiled {len(results)} stocks in {time.time()-t0:.2f}s.")
    print(f"Saved to {output_path} ({size_kb:.1f} KB) and {meta_path}")

if __name__ == "__main__":
    main()
