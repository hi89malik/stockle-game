import urllib.request
import json
import datetime
import concurrent.futures
import time
import os

COMPANIES = [
    {"ticker": "AAPL", "name": "Apple Inc.", "sector": "Information Technology", "industry": "Consumer Electronics", "marketCap": "$3.45 Trillion", "marketCapNum": 3450, "color": "#0071e3", "desc": "Pioneer in personal consumer electronics, designer of the iPhone, Mac, iPad, and iOS software ecosystem."},
    {"ticker": "MSFT", "name": "Microsoft Corporation", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$3.15 Trillion", "marketCapNum": 3150, "color": "#00a4ef", "desc": "Global software leader behind Windows, Azure cloud platform, Office 365, and AI Copilot integration."},
    {"ticker": "NVDA", "name": "NVIDIA Corporation", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$3.35 Trillion", "marketCapNum": 3350, "color": "#76b900", "desc": "World leader in GPU computing, accelerated hardware architectures, and enterprise AI accelerators."},
    {"ticker": "GOOGL", "name": "Alphabet Inc.", "sector": "Communication Services", "industry": "Internet Content & Information", "marketCap": "$2.15 Trillion", "marketCapNum": 2150, "color": "#4285f4", "desc": "Parent company of Google Search, YouTube, Android operating system, and Google Cloud."},
    {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Discretionary", "industry": "Internet Retail", "marketCap": "$2.05 Trillion", "marketCapNum": 2050, "color": "#ff9900", "desc": "Global e-commerce marketplace giant, logistics titan, and pioneer of Amazon Web Services (AWS) cloud."},
    {"ticker": "META", "name": "Meta Platforms Inc.", "sector": "Communication Services", "industry": "Internet Content & Information", "marketCap": "$1.45 Trillion", "marketCapNum": 1450, "color": "#0668e1", "desc": "Social technology titan operating Facebook, Instagram, WhatsApp, Messenger, and Reality Labs VR."},
    {"ticker": "TSLA", "name": "Tesla Inc.", "sector": "Consumer Discretionary", "industry": "Auto Manufacturers", "marketCap": "$800 Billion", "marketCapNum": 800, "color": "#cc0000", "desc": "Electric vehicle manufacturer, battery energy storage systems creator, and autonomous driving technology developer."},
    {"ticker": "AVGO", "name": "Broadcom Inc.", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$780 Billion", "marketCapNum": 780, "color": "#cc092f", "desc": "Designs, develops, and supplies custom semiconductor chips, connectivity hardware, and enterprise infrastructure software."},
    {"ticker": "COST", "name": "Costco Wholesale Corp.", "sector": "Consumer Staples", "industry": "Discount Stores", "marketCap": "$390 Billion", "marketCapNum": 390, "color": "#e31837", "desc": "Membership-only big-box warehouse retail chain famous for wholesale grocery savings and legendary customer loyalty."},
    {"ticker": "NFLX", "name": "Netflix Inc.", "sector": "Communication Services", "industry": "Entertainment", "marketCap": "$300 Billion", "marketCapNum": 300, "color": "#e50914", "desc": "World-leading subscription video streaming entertainment service and original content production studio."},
    {"ticker": "AMD", "name": "Advanced Micro Devices", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$240 Billion", "marketCapNum": 240, "color": "#ed1c24", "desc": "Semiconductor innovator manufacturing Ryzen desktop CPUs, EPYC enterprise server processors, and Radeon graphics."},
    {"ticker": "PEP", "name": "PepsiCo Inc.", "sector": "Consumer Staples", "industry": "Beverages — Non-Alcoholic", "marketCap": "$230 Billion", "marketCapNum": 230, "color": "#005cb9", "desc": "Global beverage and snack food enterprise behind Pepsi, Frito-Lay, Gatorade, Quaker Oats, and Tropicana."},
    {"ticker": "LIN", "name": "Linde plc", "sector": "Materials", "industry": "Specialty Chemicals", "marketCap": "$210 Billion", "marketCapNum": 210, "color": "#005596", "desc": "Largest industrial gas supplier in the world, serving healthcare, petroleum refining, manufacturing, and aerospace."},
    {"ticker": "ADBE", "name": "Adobe Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$220 Billion", "marketCapNum": 220, "color": "#ff0000", "desc": "Creative software giant behind Photoshop, Illustrator, Premiere Pro, PDF Acrobat, and enterprise digital marketing clouds."},
    {"ticker": "CSCO", "name": "Cisco Systems Inc.", "sector": "Information Technology", "industry": "Communication Equipment", "marketCap": "$215 Billion", "marketCapNum": 215, "color": "#1ba0d7", "desc": "Telecommunications hardware and networking pioneer producing enterprise routers, switches, and cybersecurity tools."},
    {"ticker": "TMUS", "name": "T-Mobile US Inc.", "sector": "Communication Services", "industry": "Telecom Services", "marketCap": "$210 Billion", "marketCapNum": 210, "color": "#e20074", "desc": "Major wireless network carrier serving millions with ultra-fast 5G cellular communication and home broadband."},
    {"ticker": "QCOM", "name": "QUALCOMM Inc.", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$190 Billion", "marketCapNum": 190, "color": "#3253dc", "desc": "Wireless telecommunications and chipmaker behind Snapdragon mobile processors and essential 5G cellular patents."},
    {"ticker": "TXN", "name": "Texas Instruments Inc.", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$185 Billion", "marketCapNum": 185, "color": "#cc0000", "desc": "Major designer of analog and embedded processing chips for automotive, industrial, and consumer electronics."},
    {"ticker": "AMGN", "name": "Amgen Inc.", "sector": "Healthcare", "industry": "Biotechnology", "marketCap": "$170 Billion", "marketCapNum": 170, "color": "#004879", "desc": "Biotechnology pioneer focused on innovative therapeutics for serious cardiovascular, oncology, and inflammatory illnesses."},
    {"ticker": "INTU", "name": "Intuit Inc.", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$180 Billion", "marketCapNum": 180, "color": "#0077c5", "desc": "Financial and tax software platform company behind TurboTax, QuickBooks, Credit Karma, and Mailchimp."},
    {"ticker": "ISRG", "name": "Intuitive Surgical Inc.", "sector": "Healthcare", "industry": "Medical Instruments & Supplies", "marketCap": "$175 Billion", "marketCapNum": 175, "color": "#005a9c", "desc": "Maker of the renowned da Vinci robotic surgical systems enabling minimally invasive complex surgeries worldwide."},
    {"ticker": "CMCSA", "name": "Comcast Corporation", "sector": "Communication Services", "industry": "Entertainment", "marketCap": "$160 Billion", "marketCapNum": 160, "color": "#e01a22", "desc": "Media and telecommunications powerhouse owning Xfinity broadband, NBCUniversal media, and Universal Studios theme parks."},
    {"ticker": "HON", "name": "Honeywell International", "sector": "Industrials", "industry": "Conglomerates", "marketCap": "$140 Billion", "marketCapNum": 140, "color": "#ee3124", "desc": "Diversified industrial technology giant serving commercial aerospace, building automation, and industrial safety."},
    {"ticker": "AMAT", "name": "Applied Materials Inc.", "sector": "Information Technology", "industry": "Semiconductor Equipment", "marketCap": "$170 Billion", "marketCapNum": 170, "color": "#0085ca", "desc": "Global leader in materials engineering solutions used to manufacture virtually every new chip and advanced display in the world."},
    {"ticker": "BKNG", "name": "Booking Holdings Inc.", "sector": "Consumer Discretionary", "industry": "Travel Services", "marketCap": "$145 Billion", "marketCapNum": 145, "color": "#003580", "desc": "Online travel and accommodation booking conglomerate behind Booking.com, Priceline, Agoda, KAYAK, and OpenTable."},
    {"ticker": "VRTX", "name": "Vertex Pharmaceuticals", "sector": "Healthcare", "industry": "Biotechnology", "marketCap": "$125 Billion", "marketCapNum": 125, "color": "#5b2c86", "desc": "Biopharmaceutical company renowned for revolutionary cystic fibrosis treatments and gene therapies for sickle cell."},
    {"ticker": "SBUX", "name": "Starbucks Corporation", "sector": "Consumer Discretionary", "industry": "Restaurants", "marketCap": "$110 Billion", "marketCapNum": 110, "color": "#00704a", "desc": "World's premier roaster and retailer of specialty coffee, operating tens of thousands of cafes globally."},
    {"ticker": "PANW", "name": "Palo Alto Networks", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$115 Billion", "marketCapNum": 115, "color": "#fa582d", "desc": "Global cybersecurity leader delivering next-generation firewalls, cloud security, and AI-driven automated threat defense."},
    {"ticker": "MDLZ", "name": "Mondelez International", "sector": "Consumer Staples", "industry": "Confectioners", "marketCap": "$95 Billion", "marketCapNum": 95, "color": "#4f2d7f", "desc": "Global snack manufacturer producing Oreo cookies, Cadbury chocolates, Ritz crackers, and Milka confections."},
    {"ticker": "REGN", "name": "Regeneron Pharmaceuticals", "sector": "Healthcare", "industry": "Biotechnology", "marketCap": "$110 Billion", "marketCapNum": 110, "color": "#003865", "desc": "Science-driven biotechnology firm that discovers and manufactures medicines for eye diseases, cancer, and immunology."},
    {"ticker": "ADP", "name": "Automatic Data Processing", "sector": "Industrials", "industry": "Staffing & Employment Services", "marketCap": "$115 Billion", "marketCapNum": 115, "color": "#d02027", "desc": "Cloud-based human capital management and payroll processing provider serving hundreds of thousands of businesses."},
    {"ticker": "LRCX", "name": "Lam Research Corporation", "sector": "Information Technology", "industry": "Semiconductor Equipment", "marketCap": "$105 Billion", "marketCapNum": 105, "color": "#004b87", "desc": "Crucial supplier of wafer fabrication equipment and plasma etching technology to global semiconductor foundries."},
    {"ticker": "MU", "name": "Micron Technology Inc.", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$120 Billion", "marketCapNum": 120, "color": "#0039a6", "desc": "Leading global producer of memory and storage solutions including DRAM, NAND flash, and High Bandwidth Memory (HBM)."},
    {"ticker": "KLAC", "name": "KLA Corporation", "sector": "Information Technology", "industry": "Semiconductor Equipment", "marketCap": "$95 Billion", "marketCapNum": 95, "color": "#0072ce", "desc": "Industry leader in process control and yield management systems essential for nanometer-scale chip fabrication."},
    {"ticker": "GILD", "name": "Gilead Sciences Inc.", "sector": "Healthcare", "industry": "Biotechnology", "marketCap": "$105 Billion", "marketCapNum": 105, "color": "#b31b2c", "desc": "Biopharmaceutical company that revolutionized HIV treatments, hepatitis C cures, and oncological therapies."},
    {"ticker": "SNPS", "name": "Synopsys Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$85 Billion", "marketCapNum": 85, "color": "#5b2c86", "desc": "Global leader in Electronic Design Automation (EDA) software used by chip designers to verify complex microprocessors."},
    {"ticker": "CDNS", "name": "Cadence Design Systems", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$80 Billion", "marketCapNum": 80, "color": "#bf1922", "desc": "Pivotal EDA software and hardware emulation platform provider for designing integrated circuits and PCBs."},
    {"ticker": "MELI", "name": "MercadoLibre Inc.", "sector": "Consumer Discretionary", "industry": "Internet Retail", "marketCap": "$95 Billion", "marketCapNum": 95, "color": "#ffe600", "desc": "The 'Amazon of Latin America', operating dominant e-commerce platforms and Mercado Pago digital payment systems."},
    {"ticker": "CRWD", "name": "CrowdStrike Holdings", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$75 Billion", "marketCapNum": 75, "color": "#fc0000", "desc": "Pioneer of cloud-native endpoint protection with its Falcon platform, defending enterprise networks against cyber attacks."},
    {"ticker": "PYPL", "name": "PayPal Holdings Inc.", "sector": "Financials", "industry": "Credit Services", "marketCap": "$80 Billion", "marketCapNum": 80, "color": "#003087", "desc": "Digital payments and money transfer network operating PayPal checkout, Venmo mobile wallet, and Braintree processing."},
    {"ticker": "NXPI", "name": "NXP Semiconductors", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$60 Billion", "marketCapNum": 60, "color": "#ff7900", "desc": "Dutch-American chipmaker powering automotive radar, secure vehicle networking, and industrial IoT microcontrollers."},
    {"ticker": "MAR", "name": "Marriott International", "sector": "Consumer Discretionary", "industry": "Lodging", "marketCap": "$75 Billion", "marketCapNum": 75, "color": "#b4192b", "desc": "World's largest hotel company, operating iconic hospitality brands like Ritz-Carlton, Sheraton, Westin, and Courtyard."},
    {"ticker": "CSX", "name": "CSX Corporation", "sector": "Industrials", "industry": "Railroads", "marketCap": "$70 Billion", "marketCapNum": 70, "color": "#002a66", "desc": "Major freight rail transportation provider connecting eastern United States ports and industrial distribution hubs."},
    {"ticker": "ORLY", "name": "O'Reilly Automotive", "sector": "Consumer Discretionary", "industry": "Specialty Retail", "marketCap": "$70 Billion", "marketCapNum": 70, "color": "#007a3d", "desc": "Dominant automotive aftermarket parts retailer serving both professional mechanics and DIY vehicle owners."},
    {"ticker": "CTAS", "name": "Cintas Corporation", "sector": "Industrials", "industry": "Specialty Business Services", "marketCap": "$75 Billion", "marketCapNum": 75, "color": "#003366", "desc": "Supplies corporate identity uniform programs, restroom supplies, first aid cabinets, and facility safety services."},
    {"ticker": "CHTR", "name": "Charter Communications", "sector": "Communication Services", "industry": "Entertainment", "marketCap": "$50 Billion", "marketCapNum": 50, "color": "#0073d1", "desc": "Broadband connectivity and cable television operator serving millions of subscribers under the Spectrum brand."},
    {"ticker": "ABNB", "name": "Airbnb Inc.", "sector": "Consumer Discretionary", "industry": "Travel Services", "marketCap": "$85 Billion", "marketCapNum": 85, "color": "#ff5a5f", "desc": "Revolutionary travel marketplace platform connecting travelers with unique homestays, vacations, and local experiences."},
    {"ticker": "PCAR", "name": "PACCAR Inc.", "sector": "Industrials", "industry": "Heavy Construction Machinery", "marketCap": "$55 Billion", "marketCapNum": 55, "color": "#002d62", "desc": "World-class manufacturer of premium heavy-duty commercial trucks under Kenworth, Peterbilt, and DAF nameplates."},
    {"ticker": "LULU", "name": "Lululemon Athletica", "sector": "Consumer Discretionary", "industry": "Apparel Retail", "marketCap": "$40 Billion", "marketCapNum": 40, "color": "#d31334", "desc": "High-end athletic apparel and yoga-wear brand that defined the modern athleisure fashion lifestyle."},
    {"ticker": "MNST", "name": "Monster Beverage Corp.", "sector": "Consumer Staples", "industry": "Beverages — Non-Alcoholic", "marketCap": "$50 Billion", "marketCapNum": 50, "color": "#81d300", "desc": "Dominant energy drink brand known for Monster Energy, Reign, and extreme sports sponsorship culture."},
    {"ticker": "KDP", "name": "Keurig Dr Pepper Inc.", "sector": "Consumer Staples", "industry": "Beverages — Non-Alcoholic", "marketCap": "$45 Billion", "marketCapNum": 45, "color": "#7a1315", "desc": "Beverage conglomerate combining Dr Pepper, 7UP, Snapple soft drinks with Keurig single-serve coffee brewers."},
    {"ticker": "DXCM", "name": "DexCom Inc.", "sector": "Healthcare", "industry": "Medical Devices", "marketCap": "$35 Billion", "marketCapNum": 35, "color": "#007a33", "desc": "Pioneer of continuous glucose monitoring (CGM) systems for people living with diabetes."},
    {"ticker": "FTNT", "name": "Fortinet Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$60 Billion", "marketCapNum": 60, "color": "#ee3124", "desc": "Cybersecurity firm delivering FortiGate hardware firewalls and integrated automated security fabric solutions."},
    {"ticker": "KHC", "name": "The Kraft Heinz Company", "sector": "Consumer Staples", "industry": "Packaged Foods", "marketCap": "$40 Billion", "marketCapNum": 40, "color": "#c41230", "desc": "Global food company behind Kraft Macaroni & Cheese, Heinz Tomato Ketchup, Philadelphia cream cheese, and Oscar Mayer."},
    {"ticker": "ADI", "name": "Analog Devices Inc.", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$110 Billion", "marketCapNum": 110, "color": "#003366", "desc": "Precision analog, mixed-signal, and DSP chipmaker essential for factory robotics, medical sensors, and EV powertrains."},
    {"ticker": "ROST", "name": "Ross Stores Inc.", "sector": "Consumer Discretionary", "industry": "Apparel Retail", "marketCap": "$50 Billion", "marketCapNum": 50, "color": "#003f7a", "desc": "Off-price apparel and home fashion retail powerhouse delivering brand-name items at deep bargain discounts."},
    {"ticker": "CPRT", "name": "Copart Inc.", "sector": "Industrials", "industry": "Specialty Business Services", "marketCap": "$50 Billion", "marketCapNum": 50, "color": "#002e6d", "desc": "Global online salvage and insurance vehicle auction company connecting vehicle sellers with buyers worldwide."},
    {"ticker": "IDXX", "name": "IDEXX Laboratories Inc.", "sector": "Healthcare", "industry": "Diagnostics & Research", "marketCap": "$40 Billion", "marketCapNum": 40, "color": "#005596", "desc": "Leader in veterinary diagnostics, pet healthcare software, and livestock water testing equipment."},
    {"ticker": "PAYX", "name": "Paychex Inc.", "sector": "Industrials", "industry": "Staffing & Employment Services", "marketCap": "$48 Billion", "marketCapNum": 48, "color": "#005696", "desc": "Integrated human capital management platform providing payroll, HR, and benefits outsourcing for small-to-mid businesses."},
    {"ticker": "EXC", "name": "Exelon Corporation", "sector": "Utilities", "industry": "Utilities — Regulated Electric", "marketCap": "$38 Billion", "marketCapNum": 38, "color": "#003b71", "desc": "Nation's largest utility company by customer count, serving electric and natural gas utilities across multiple states."},
    {"ticker": "FAST", "name": "Fastenal Company", "sector": "Industrials", "industry": "Industrial Distribution", "marketCap": "$40 Billion", "marketCapNum": 40, "color": "#004b87", "desc": "Distributor of industrial fasteners, safety gear, and on-site automated industrial supply vending machines."},
    {"ticker": "CEG", "name": "Constellation Energy", "sector": "Utilities", "industry": "Utilities — Renewable", "marketCap": "$80 Billion", "marketCapNum": 80, "color": "#f15a22", "desc": "Largest producer of carbon-free nuclear and clean energy in the United States, powering data centers and green grids."},
    {"ticker": "TEAM", "name": "Atlassian Corporation", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$50 Billion", "marketCapNum": 50, "color": "#0052cc", "desc": "Software collaboration firm creator of Jira project tracking, Confluence knowledge base, and Trello boards."},
    {"ticker": "VRSK", "name": "Verisk Analytics Inc.", "sector": "Industrials", "industry": "Consulting Services", "marketCap": "$38 Billion", "marketCapNum": 38, "color": "#004876", "desc": "Data analytics and risk assessment provider providing actuarial underwriting data for property and casualty insurers."},
    {"ticker": "FANG", "name": "Diamondback Energy", "sector": "Energy", "industry": "Oil & Gas E&P", "marketCap": "$36 Billion", "marketCapNum": 36, "color": "#005596", "desc": "Leading independent oil and natural gas exploration company operating in the premier Permian Basin."},
    {"ticker": "BIIB", "name": "Biogen Inc.", "sector": "Healthcare", "industry": "Biotechnology", "marketCap": "$30 Billion", "marketCapNum": 30, "color": "#00857c", "desc": "Neuroscience biotechnology leader developing breakthrough drugs for Alzheimer's disease, MS, and spinal muscular atrophy."},
    {"ticker": "DLTR", "name": "Dollar Tree Inc.", "sector": "Consumer Staples", "industry": "Discount Stores", "marketCap": "$20 Billion", "marketCapNum": 20, "color": "#007a3d", "desc": "Leading discount retailer operating extreme-value Dollar Tree and Family Dollar convenience merchandise stores."},
    {"ticker": "ZS", "name": "Zscaler Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$30 Billion", "marketCapNum": 30, "color": "#0072ce", "desc": "Cloud-native Zero Trust cybersecurity platform protecting remote workforces against enterprise data breaches."},
    {"ticker": "INTC", "name": "Intel Corporation", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$90 Billion", "marketCapNum": 90, "color": "#0071c5", "desc": "Semiconductor manufacturing pioneer producing x86 Core CPUs and enterprise Xeon server microprocessors."},
    {"ticker": "DELL", "name": "Dell Technologies", "sector": "Information Technology", "industry": "Computer Hardware", "marketCap": "$85 Billion", "marketCapNum": 85, "color": "#007db8", "desc": "Provider of IT infrastructure, AI server racks, workstations, monitors, and cloud storage systems."},
    {"ticker": "MCHP", "name": "Microchip Technology", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$42 Billion", "marketCapNum": 42, "color": "#e31b23", "desc": "Leading developer of smart, connected, and secure embedded control microcontrollers and mixed-signal semiconductors."},
    {"ticker": "EBAY", "name": "eBay Inc.", "sector": "Consumer Discretionary", "industry": "Internet Retail", "marketCap": "$30 Billion", "marketCapNum": 30, "color": "#e53238", "desc": "Legendary peer-to-peer and merchant online auction and e-commerce marketplace connecting global buyers and sellers."},
    {"ticker": "SIRI", "name": "Sirius XM Holdings", "sector": "Communication Services", "industry": "Entertainment", "marketCap": "$10 Billion", "marketCapNum": 10, "color": "#002d62", "desc": "Satellite radio broadcasting network providing commercial-free music, talk, sports, and podcasts in vehicles across North America."},
    {"ticker": "ENPH", "name": "Enphase Energy Inc.", "sector": "Information Technology", "industry": "Solar", "marketCap": "$15 Billion", "marketCapNum": 15, "color": "#f37021", "desc": "Clean energy technology firm manufacturing solar microinverters and residential smart home battery backup systems."},
    {"ticker": "DDOG", "name": "Datadog Inc.", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$40 Billion", "marketCapNum": 40, "color": "#632ca6", "desc": "Cloud observability and security monitoring platform giving DevOps teams unified visibility into modern microservices."},
    {"ticker": "ZM", "name": "Zoom Video Communications", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$22 Billion", "marketCapNum": 22, "color": "#2d8cff", "desc": "Video communications company whose ubiquitous meeting app transformed modern remote work, education, and webinars."},
    {"ticker": "DOCU", "name": "DocuSign Inc.", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$14 Billion", "marketCapNum": 14, "color": "#ff3000", "desc": "Electronic signature and automated agreement cloud platform streamlining contracts, legal documents, and digital approvals."},
    {"ticker": "OKTA", "name": "Okta Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$15 Billion", "marketCapNum": 15, "color": "#007dc1", "desc": "Identity and access management platform offering secure single sign-on (SSO) and multifactor user authentication."},
    {"ticker": "COIN", "name": "Coinbase Global Inc.", "sector": "Financials", "industry": "Financial Data & Exchanges", "marketCap": "$55 Billion", "marketCapNum": 55, "color": "#0052ff", "desc": "Premier US-regulated cryptocurrency exchange and onchain crypto custody platform for retail and institutional traders."},
    {"ticker": "RIVN", "name": "Rivian Automotive Inc.", "sector": "Consumer Discretionary", "industry": "Auto Manufacturers", "marketCap": "$12 Billion", "marketCapNum": 12, "color": "#4285f4", "desc": "Electric adventure vehicle manufacturer known for the R1T electric pickup, R1S SUV, and commercial delivery vans."},
    {"ticker": "LCID", "name": "Lucid Group Inc.", "sector": "Consumer Discretionary", "industry": "Auto Manufacturers", "marketCap": "$6 Billion", "marketCapNum": 6, "color": "#9b8579", "desc": "Luxury electric automaker producing high-performance, ultra-aerodynamic Lucid Air executive sedans and Gravity SUVs."},
    {"ticker": "PLTR", "name": "Palantir Technologies", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$95 Billion", "marketCapNum": 95, "color": "#111111", "desc": "Big data and artificial intelligence software enterprise delivering Foundry and Gotham platforms for defense and commercial intelligence."},
    {"ticker": "ARM", "name": "Arm Holdings plc", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$140 Billion", "marketCapNum": 140, "color": "#0091bd", "desc": "British semiconductor architecture firm whose low-power RISC instruction set designs power 99% of global smartphones."},
    {"ticker": "SMCI", "name": "Super Micro Computer", "sector": "Information Technology", "industry": "Computer Hardware", "marketCap": "$30 Billion", "marketCapNum": 30, "color": "#003b71", "desc": "High-performance enterprise server and liquid-cooled data center rack designer optimized for generative AI workloads."},
    {"ticker": "MDB", "name": "MongoDB Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$22 Billion", "marketCapNum": 22, "color": "#00ed64", "desc": "Developer-loved document database software and cloud database-as-a-service provider behind MongoDB Atlas."},
    {"ticker": "NET", "name": "Cloudflare Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$32 Billion", "marketCapNum": 32, "color": "#f38020", "desc": "Global web performance, content delivery network (CDN), DDoS mitigation, and serverless edge computing provider."},
    {"ticker": "DASH", "name": "DoorDash Inc.", "sector": "Consumer Discretionary", "industry": "Internet Retail", "marketCap": "$60 Billion", "marketCapNum": 60, "color": "#ff3008", "desc": "Leading on-demand local delivery logistics platform connecting millions of consumers with restaurants and convenience groceries."},
    {"ticker": "SHOP", "name": "Shopify Inc.", "sector": "Information Technology", "industry": "Software — Application", "marketCap": "$100 Billion", "marketCapNum": 100, "color": "#95bf47", "desc": "E-commerce platform empowering millions of merchants worldwide to build and operate digital online storefronts."},
    {"ticker": "SPOT", "name": "Spotify Technology S.A.", "sector": "Communication Services", "industry": "Entertainment", "marketCap": "$70 Billion", "marketCapNum": 70, "color": "#1db954", "desc": "World's most popular audio streaming subscription service, offering millions of licensed music tracks, audiobooks, and podcasts."},
    {"ticker": "UBER", "name": "Uber Technologies Inc.", "sector": "Industrials", "industry": "Software — Infrastructure", "marketCap": "$150 Billion", "marketCapNum": 150, "color": "#000000", "desc": "Global mobility platform operating ride-hailing transportation, Uber Eats food delivery, and freight logistics networks."},
    {"ticker": "MRVL", "name": "Marvell Technology Inc.", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$75 Billion", "marketCapNum": 75, "color": "#003b71", "desc": "Semiconductor developer creating high-speed data infrastructure and optical interconnects for AI cloud clusters."},
    {"ticker": "SNOW", "name": "Snowflake Inc.", "sector": "Information Technology", "industry": "Software — Infrastructure", "marketCap": "$45 Billion", "marketCapNum": 45, "color": "#29b5e8", "desc": "Cloud-based Data Cloud company offering instant, elastic data warehousing, secure sharing, and data lake storage."},
    {"ticker": "RBLX", "name": "Roblox Corporation", "sector": "Communication Services", "industry": "Electronic Gaming", "marketCap": "$28 Billion", "marketCapNum": 28, "color": "#e01a22", "desc": "Global immersive metaverse gaming platform where millions of users create, play, and monetize 3D virtual experiences."},
    {"ticker": "HOOD", "name": "Robinhood Markets Inc.", "sector": "Financials", "industry": "Capital Markets", "marketCap": "$25 Billion", "marketCapNum": 25, "color": "#00c805", "desc": "Commission-free stock, options, and crypto brokerage mobile app that pioneered zero-fee retail investing."},
    {"ticker": "TTWO", "name": "Take-Two Interactive", "sector": "Communication Services", "industry": "Electronic Gaming", "marketCap": "$28 Billion", "marketCapNum": 28, "color": "#f15a22", "desc": "Legendary video game publishing titan behind Grand Theft Auto, Red Dead Redemption, NBA 2K, and Civilization."},
    {"ticker": "ODFL", "name": "Old Dominion Freight Line", "sector": "Industrials", "industry": "Trucking", "marketCap": "$44 Billion", "marketCapNum": 44, "color": "#002d62", "desc": "Leading less-than-truckload (LTL) motor carrier providing nationwide regional and inter-regional shipping services."},
    {"ticker": "ON", "name": "ON Semiconductor", "sector": "Information Technology", "industry": "Semiconductors", "marketCap": "$32 Billion", "marketCapNum": 32, "color": "#007a3d", "desc": "Pioneer in silicon carbide (SiC) and intelligent power solutions for electric vehicles and renewable energy grids."},
    {"ticker": "BKR", "name": "Baker Hughes Company", "sector": "Energy", "industry": "Oil & Gas Equipment & Services", "marketCap": "$42 Billion", "marketCapNum": 42, "color": "#004879", "desc": "Energy technology company providing industrial oilfield services, turbomachinery, and carbon capture solutions."},
    {"ticker": "DIS", "name": "The Walt Disney Company", "sector": "Communication Services", "industry": "Entertainment", "marketCap": "$180 Billion", "marketCapNum": 180, "color": "#113ccf", "desc": "Global family entertainment conglomerate operating Disney+, Pixar, Marvel, Star Wars, ESPN, and worldwide theme park resorts."},
    {"ticker": "NKE", "name": "NIKE Inc.", "sector": "Consumer Discretionary", "industry": "Footwear & Accessories", "marketCap": "$125 Billion", "marketCapNum": 125, "color": "#111111", "desc": "World's leading designer and marketer of athletic footwear, apparel, and sporting equipment with the iconic Swoosh logo."}
]

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
                # Clues
                "dateRangeYears": f"{start_yr} – {end_yr}",
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
    
    os.makedirs("src/data", exist_ok=True)
    
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_ticker_data, comp): comp["ticker"] for comp in COMPANIES}
        for future in concurrent.futures.as_completed(futures):
            ticker = futures[future]
            try:
                res = future.result()
                if res and res['pointCount'] >= 100:
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
        json.dump(results, f, separators=(',', ':'))
        
    meta_path = "src/data/stocksMeta.json"
    meta_list = [{
        "ticker": s["ticker"],
        "name": s["name"],
        "sector": s["sector"],
        "industry": s["industry"],
        "marketCap": s["marketCap"],
        "marketCapNum": s["marketCapNum"]
    } for s in results]
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_list, f, indent=2)

    # Sync to public directory for static asset delivery
    os.makedirs("public", exist_ok=True)
    with open("public/stocks.json", "w", encoding="utf-8") as f:
        json.dump(results, f, separators=(',', ':'))
    with open("public/stocksMeta.json", "w", encoding="utf-8") as f:
        json.dump(meta_list, f, indent=2)
        
    size_kb = os.path.getsize(output_path) / 1024
    print(f"\nDone! Successfully fetched and compiled {len(results)} stocks in {time.time()-t0:.2f}s.")
    print(f"Saved to {output_path} ({size_kb:.1f} KB) and {meta_path}")

if __name__ == "__main__":
    main()
