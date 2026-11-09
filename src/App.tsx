import { useState, useMemo, useEffect, useRef } from 'react';
import ChatBotWidget from './ChatBotWidget';
import {
  Coffee, CalendarPlus, MessageCircle, Briefcase, Sparkles,
  MapPin, Phone, ShoppingBag, Plus, Minus, X, Flame,
  ArrowLeft, ArrowUpRight, ChevronLeft, CheckCircle2,
  Building2, Globe, Layout, Wrench, Users, Wifi, Zap, Bath, ShieldCheck
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '9647777007839';
const WHATSAPP_DISPLAY = '0777 700 7839';

const SITE = {
  name: 'WorkSpace Cafe',
  location: 'Hay Al-Jamia, Baghdad, Iraq',
  hours: 'Sat – Thu • 9:00 AM – 5:00 PM',
  openHour: 9,
  closeHour: 17,
  closedWeekday: 5,
} as const;

const IMAGES = {
  logo: 'image_a904d5.png',
  meetingRoom: 'meeting-room.jpg',
  padelRooftop: 'padel-rooftop.jpg',
};

const TRANSLATIONS = {
  en: {
    heroTitle1: 'SPECIALTY CAFE', heroTitle2: 'PADEL CLUB', heroTitle3: '6TH FL. SUITE', heroTitle4: 'BUSINESS SUITES',
    heroDesc1: 'Specialty Spanish lattes, layered matchas, and fresh bakery treats.', heroDesc2: 'Play high above the city on Baghdad’s premier rooftop padel court.', heroDesc3: 'Quiet 6th-floor boardroom with 4K smart display and barista catering.', heroDesc4: 'Private offices, serviced suites, and enterprise floors in the heart of Baghdad.',
    enterMenu: 'ENTER MENU', bookCourt: 'BOOK COURT', reserveSuite: 'RESERVE SUITE', exploreOffices: 'EXPLORE OFFICES',
    menuTitle: 'The WorkSpace Menu', menuDesc: 'Crafted with Colombian, Ethiopian, and Brazilian micro-lots. Every iced sip is served in our signature printed tumbler.',
    catAll: 'Full Menu', catHot: 'Hot Drinks', catIced: 'Iced Drinks', catMojitos: 'Mojitos', catTea: 'Iced Tea', catSmoothies: 'Smoothies', catBakery: 'Bakery & Sweets',
    add: 'ADD', order: 'ORDER', cartEmpty: 'Your bag is currently empty.', checkout: 'ORDER VIA WHATSAPP',
    bookPadel: 'Book Your Padel Court', bookMeeting: 'Reserve 6th Floor Boardroom',
    selectDate: 'Select Date & Time', selectDay: '1. Select Day', selectSlot: '2. Select Start Slot', duration: '3. Duration', addOns: 'Optional Add-Ons',
    namePlace: 'Your Full Name *', phonePlace: 'Phone Number (e.g., 0770 000 0000)', confirmWA: 'CONFIRM ON WHATSAPP', addCalendar: 'Add Slot to Google Calendar', total: 'Grand Total', hours: 'Opening Hours', hour: 'Hour',
    wifi: 'High-Speed Wi-Fi', electricity: '24/7 Electricity', restrooms: 'Premium Restrooms', security: '24/7 Security', location: 'Location', directLine: 'Direct Line',
    officeHero: 'Built for Serious Business At Every Scale.', officeHeroDesc: 'From a single desk to an entire corporate floor. WorkSpace provides the environment, address, and infrastructure your business needs to thrive in Baghdad.',
    officeClients: 'Trusted by Leading Companies', officeGallery: 'See WorkSpace in Detail.',
    solPrivate: 'Private Offices', solPrivateD: 'Dedicated, locked suites for teams that need privacy and focus.', solServiced: 'Serviced Offices', solServicedD: 'Fully managed, move-in ready with admin and IT support.', solEnterprise: 'Enterprise Suites', solEnterpriseD: 'Entire floors and bespoke configurations for large teams.', solVirtual: 'Virtual Offices', solVirtualD: 'A prestigious Baghdad address without the physical space.', solMeeting: 'Meeting Rooms', solMeetingD: 'Fully equipped rooms available on demand.', solCustom: 'Custom Solutions', solCustomD: 'Unserviced raw space for tenants who want full control.',
    startingFrom: 'Starting From', customPricing: 'Custom Pricing', readyTitle: 'Ready to find your workspace?', readyDesc: 'Schedule a site visit or speak directly with our enterprise team.', menu: 'Full Menu'
  },
  ar: {
    heroTitle1: 'المقهى المختص', heroTitle2: 'ملعب البادل', heroTitle3: 'قاعة الطابق السادس', heroTitle4: 'أجنحة الأعمال',
    heroDesc1: 'لاتيه إسباني مختص، ماتشا متعددة الطبقات، ومخبوزات طازجة.', heroDesc2: 'العب فوق مدينة بغداد في أول ملعب بادل على السطح.', heroDesc3: 'قاعة اجتماعات هادئة في الطابق السادس مع شاشة 4K وخدمة تقديم القهوة.', heroDesc4: 'مكاتب خاصة، أجنحة مخدومة، وطوابق للشركات في قلب بغداد.',
    enterMenu: 'دخول القائمة', bookCourt: 'احجز الملعب', reserveSuite: 'احجز القاعة', exploreOffices: 'استكشف المكاتب',
    menuTitle: 'قائمة وورك سبيس', menuDesc: 'مصنوعة من محاصيل كولومبية وإثيوبية وبرازيلية. كل رشفة مثلجة تقدم في كوبنا المميز.',
    catAll: 'القائمة الكاملة', catHot: 'مشروبات ساخنة', catIced: 'مشروبات مثلجة', catMojitos: 'موهيتو', catTea: 'شاي مثلج', catSmoothies: 'سموذي', catBakery: 'مخبوزات وحلويات',
    add: 'أضف', order: 'اطلب', cartEmpty: 'حقيبتك فارغة حالياً.', checkout: 'اطلب عبر واتساب',
    bookPadel: 'احجز ملعب البادل', bookMeeting: 'احجز قاعة الاجتماعات',
    selectDate: 'اختر التاريخ والوقت', selectDay: '1. اختر اليوم', selectSlot: '2. اختر وقت البدء', duration: '3. المدة', addOns: 'إضافات اختيارية',
    namePlace: 'اسمك الكامل *', phonePlace: 'رقم الهاتف (مثال: 0770 000 0000)', confirmWA: 'تأكيد عبر واتساب', addCalendar: 'إضافة إلى تقويم جوجل', total: 'المجموع الكلي', hours: 'ساعات العمل', hour: 'ساعة',
    wifi: 'واي فاي سريع', electricity: 'كهرباء 24/7', restrooms: 'حمامات فاخرة', security: 'أمن 24/7', location: 'الموقع', directLine: 'الخط المباشر',
    officeHero: 'مبني للأعمال الجادة على كل المستويات.', officeHeroDesc: 'من مكتب واحد إلى طابق كامل. وورك سبيس يوفر البيئة والعنوان والبنية التحتية التي يحتاجها عملك للازدهار في بغداد.',
    officeClients: 'موثوق به من قبل الشركات الرائدة', officeGallery: 'شاهد وورك سبيس بالتفصيل.',
    solPrivate: 'مكاتب خاصة', solPrivateD: 'أجنحة مخصصة ومقفلة للفرق التي تحتاج إلى الخصوصية والتركيز.', solServiced: 'مكاتب مخدومة', solServicedD: 'إدارة كاملة، جاهزة للانتقال مع دعم إداري وتقني.', solEnterprise: 'أجنحة الشركات', solEnterpriseD: 'طوابق كاملة وتكوينات مخصصة للفرق الكبيرة.', solVirtual: 'مكاتب افتراضية', solVirtualD: 'عنوان مرموق في بغداد دون الحاجة لمساحة مادية.', solMeeting: 'قاعات الاجتماعات', solMeetingD: 'غرف مجهزة بالكامل متاحة عند الطلب.', solCustom: 'حلول مخصصة', solCustomD: 'مساحة خام غير مخدومة للمستأجرين الذين يريدون السيطرة الكاملة.',
    startingFrom: 'يبدأ من', customPricing: 'تسعير مخصص', readyTitle: 'هل أنت مستعد للعثور على مساحة عملك؟', readyDesc: 'حدد موعداً لزيارة الموقع أو تحدث مباشرة مع فريق المؤسسات لدينا.', menu: 'القائمة الكاملة'
  }
}

type Language = keyof typeof TRANSLATIONS;
type LanguageProps = { lang: Language; setLang: (lang: Language) => void; };

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type WorldId = 'menu' | 'padel' | 'meeting' | 'office';

type World = {
  id: WorldId;
  code: string;
  title: string;
  tagline: string;
  badge: string;
  cta: string;
  image: string;
  desc: string;
};

type MenuItem = {
  id: string;
  category: string;
  name: string;
  arabic: string;
  price: number;
  isIced: boolean;
  isFood?: boolean;
  rating?: string;
  desc: string;
  image: string;
  tags: string[];
};

type CartItem = MenuItem & { quantity: number };

type Day = {
  full: Date;
  day: string;
  dayNum: number;
  month: string;
  disabled: boolean;
};

type TimeSlot = {
  time: string;
  hour: number;
  booked: boolean;
  wouldOverflow: boolean;
};

type Feature = {
  id: string;
  x: string;
  y: string;
  title: string;
  desc: string;
};

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');

const fmtCalendar = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
    d.getHours()
  )}${pad(d.getMinutes())}00`;

function getNextDays(count = 7): Day[] {
  const out: Day[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      full: d,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      disabled: d.getDay() === SITE.closedWeekday,
    });
  }
  return out;
}

function generateTimeSlots(duration: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const preBooked = [SITE.openHour, 14];
  for (let h = SITE.openHour; h < SITE.closeHour; h++) {
    const hour12 = h % 12 || 12;
    const period = h < 12 ? 'AM' : 'PM';
    const label = `${hour12}:00 ${period}`;
    slots.push({
      time: label,
      hour: h,
      booked: preBooked.includes(h),
      wouldOverflow: h + duration > SITE.closeHour,
    });
  }
  return slots;
}

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    .font-serif, [class*="font-serif"] { font-family: 'Playfair Display', Georgia, serif !important; }
    .font-sans, body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    button:focus-visible, a:focus-visible, [role="button"]:focus-visible {
      outline: 2px solid #C85228;
      outline-offset: 2px;
      border-radius: 6px;
    }

    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slide-up { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.3333%); }
    }
    .animate-marquee {
      display: flex;
      width: max-content;
      animation: scroll 45s linear infinite;
    }
    .animate-marquee:hover { animation-play-state: paused; }

    .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-slide-up { animation: slide-up 0.25s ease-out; }
    .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
// BRAND MARKS
// ─────────────────────────────────────────────────────────────
const PadelClubLogo = ({ className = 'w-11 h-11' }: { className?: string }) => (
  <div className={`${className} rounded-full bg-[#C85228] flex items-center justify-center p-2.5 shadow-xl border border-white/20 select-none`} aria-label="Padel Club Baghdad" role="img">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="grid grid-cols-3 gap-0.5 mb-1 opacity-90">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="w-1 h-1 bg-white rounded-full inline-block" />
        ))}
      </div>
      <span className="text-[7px] font-black tracking-widest text-white uppercase leading-tight font-sans">PADEL</span>
      <span className="text-[6px] tracking-wider text-white/90 uppercase font-semibold">BAGHDAD</span>
    </div>
  </div>
);

const WorkSpaceBrandHeader = ({ onHomeClick }: { onHomeClick?: () => void }) => {
  return (
    <button
      onClick={onHomeClick}
      className="flex items-center cursor-pointer group select-none transition-opacity hover:opacity-90 focus:outline-none"
      aria-label="Go to home"
    >
      <img src="/workspace-logo.png" alt="WorkSpace Cafe" className="h-12 md:h-14 w-auto object-contain" />
    </button>
  );
};

const BrandedCupStamp = ({ isIced = false, isFood = false }: { isIced?: boolean; isFood?: boolean }) => {
  const cfg = isFood ? { cls: 'bg-amber-950/80 border-amber-500/40 text-amber-300', icon: '🥐', label: 'Bakery' }
    : isIced ? { cls: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300', icon: '❄', label: 'Clear Tumbler' }
    : { cls: 'bg-stone-900/80 border-stone-600/40 text-stone-200', icon: '☕', label: 'Paper Cup' };

  return (
    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center space-x-1.5 shadow-md backdrop-blur-md ${cfg.cls}`}>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MEETING ROOM SHOWCASE
// ─────────────────────────────────────────────────────────────
const InsideMeetingRoomFrame = ({ onBookClick }: { onBookClick: () => void }) => {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);

  const features: Feature[] = [
    { id: 'light', x: '50%', y: '25%', title: 'Suspended Minimalist LED', desc: 'Custom linear tube illumination designed for zero screen glare' },
    { id: 'screen', x: '66%', y: '45%', title: '4K Presentation Display', desc: 'Smart screen with AirPlay, HDMI, and acoustic backplate' },
    { id: 'table', x: '50%', y: '68%', title: 'Natural Oak Boardroom Table', desc: 'Seats 10 to 12 executives with built-in power outlets' },
    { id: 'chairs', x: '25%', y: '75%', title: 'Ergonomic Leather Seating', desc: 'High-back ribbed leather chairs with padded headrests' },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-white/10 shadow-2xl group">
      <div className="absolute top-4 right-4 z-30 flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-stone-200">6TH FLOOR</span>
      </div>
      <div className="relative h-[420px] md:h-[550px] w-full overflow-hidden bg-stone-900">
        <img src={encodeURI(IMAGES.meetingRoom)} alt="WorkSpace Cafe 6th Floor Boardroom" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 pointer-events-none">
          {features.map((feat) => (
            <div key={feat.id} style={{ top: feat.y, left: feat.x }} className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
              <button onClick={() => setActiveFeature(activeFeature?.id === feat.id ? null : feat)} aria-label={`Show details: ${feat.title}`} className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-[#C85228]/40 animate-ping" />
                <span className="w-5 h-5 rounded-full bg-[#C85228] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-lg">+</span>
              </button>
            </div>
          ))}
        </div>
        {activeFeature && (
          <div className="absolute bottom-3 inset-x-3 z-40 bg-stone-900/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl text-left animate-slide-up">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-[#C85228] uppercase tracking-wider">6th Floor Spec</span>
                <h4 className="text-sm font-bold text-white mt-1">{activeFeature.title}</h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">{activeFeature.desc}</p>
              </div>
              <button onClick={() => setActiveFeature(null)} aria-label="Close details" className="text-stone-400 hover:text-white p-1"><X size={14} /></button>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 md:p-6 bg-[#161B18] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <div className="text-left w-full sm:w-auto">
          <div className="text-xs text-stone-400">Quiet 6th Floor Business Environment</div>
          <div className="text-sm font-semibold text-white">Direct elevator barista catering included</div>
        </div>
        <button onClick={onBookClick} className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C85228] hover:bg-[#d95d31] text-white font-semibold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2">
          <Briefcase size={16} />
          <span>RESERVE 6TH FLOOR BOARDROOM</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PADEL SHOWCASE
// ─────────────────────────────────────────────────────────────
const RealPadelRooftopShowcase = ({ onBookClick }: { onBookClick: () => void }) => (
  <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-white/10 shadow-2xl group">
    <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
      <span className="w-2 h-2 rounded-full bg-[#C85228] animate-pulse" />
      <span className="text-[10px] font-bold tracking-widest uppercase text-stone-200">OPEN-AIR ROOFTOP TURF • BAGHDAD SKYLINE</span>
    </div>
    <div className="relative h-[420px] md:h-[500px] w-full overflow-hidden">
      <img src={encodeURI(IMAGES.padelRooftop)} alt="WorkSpace Cafe Rooftop Padel Baghdad" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute bottom-4 inset-x-4 md:inset-x-8 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-200">
          <span>🎾 <strong>60,000 IQD</strong> / hour</span>
          <span className="text-stone-500">•</span>
          <span>🌙 Night LED Lighting</span>
          <span className="text-stone-500">•</span>
          <span>☕ Court-side Delivery</span>
        </div>
        <button onClick={onBookClick} className="px-5 py-2 rounded-full bg-[#C85228] hover:bg-[#d95d31] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg whitespace-nowrap">
          Book Court Slot
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MENU DATA
// ─────────────────────────────────────────────────────────────
const MENU_CATEGORIES = [
  { id: 'all', name: 'Full Menu', icon: Sparkles },
  { id: 'hot', name: 'Hot Drinks', icon: Coffee },
  { id: 'iced', name: 'Iced Drinks', icon: Sparkles },
  { id: 'mojitos', name: 'Mojitos', icon: Sparkles },
  { id: 'icedtea', name: 'Iced Tea', icon: Sparkles },
  { id: 'juices', name: 'Natural Juices', icon: Sparkles },
  { id: 'smoothies', name: 'Smoothies', icon: Flame },
  { id: 'bakery', name: 'Bakery & Sweets', icon: Sparkles },
];

const MENU_ITEMS: MenuItem[] = [
  // HOT DRINKS
  { id: 'hot-1', category: 'hot', name: 'Spanish Latte', arabic: 'سبانش لاتيه حار', price: 6000, isIced: false, rating: 'Signature', desc: 'Sweet condensed milk, velvety steamed whole milk, and rich double shot of specialty espresso.', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', tags: ['Customer Favorite', 'Signature Blend'] },
  { id: 'hot-2', category: 'hot', name: 'Flat White', arabic: 'فلات وايت', price: 4500, isIced: false, rating: 'Barista Choice', desc: 'Silky microfoam poured over intense double ristretto espresso for genuine coffee lovers.', image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80', tags: ['Microfoam', 'Intense'] },
  { id: 'hot-3', category: 'hot', name: 'Cortado', arabic: 'كورتادو', price: 4500, isIced: false, rating: 'Classic', desc: 'Equal parts 1:1 specialty espresso and warm textured milk cut to perfection.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', tags: ['Balanced', 'Spanish Origin'] },
  { id: 'hot-4', category: 'hot', name: 'Cafe Latte', arabic: 'كافيه لاتيه', price: 5000, isIced: false, desc: 'Espresso balanced with smooth steamed milk and a delicate top foam layer.', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80', tags: ['Comfort', 'Smooth'] },
  { id: 'hot-5', category: 'hot', name: 'Turkish Coffee', arabic: 'قهوة تركية', price: 3000, isIced: false, desc: 'Finely ground roasted beans slow-cooked in a traditional cezve with aromatic cardamom.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', tags: ['Traditional', 'Cardamom'] },

  // ICED DRINKS
  { id: 'iced-1', category: 'iced', name: 'Iced Matcha Latte', arabic: 'ايس ماتشا لاتيه', price: 7000, isIced: true, rating: 'Top Trending', desc: 'Ceremonial grade Uji Japanese matcha whisked and layered over chilled creamy milk and crystal ice.', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=800&q=80', tags: ['Ceremonial Uji', 'Antioxidant'] },
  { id: 'iced-2', category: 'iced', name: 'Iced Spanish Latte', arabic: 'ايس سبانش لاتيه', price: 6000, isIced: true, rating: 'Best Seller', desc: "Baghdad's absolute favorite: sweet condensed milk with chilled milk, ice, and espresso float.", image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', tags: ['Sweet', 'Layered'] },
  { id: 'iced-3', category: 'iced', name: 'Iced Caramel Macchiato', arabic: 'ايس كراميل', price: 6000, isIced: true, desc: 'Vanilla syrup, cold whole milk, ice cubes, espresso shots, and golden buttery caramel drizzle.', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', tags: ['Buttery Caramel', 'Chilled'] },
  { id: 'iced-4', category: 'iced', name: 'Iced Americano', arabic: 'ايس امريكانو', price: 4000, isIced: true, rating: 'Padel Courtside', desc: 'Double shot specialty espresso extracted over crisp ice and cold filtered water.', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80', tags: ['Zero Sugar', 'Pure Energy'] },

  // MOJITOS
  { id: 'mojito-1', category: 'mojitos', name: 'Mango Passion Mojito', arabic: 'موهيتو مانجو باشن', price: 7500, isIced: true, rating: 'Chef Pick', desc: 'Real mango puree, passion fruit seeds, crushed mint leaves, fresh lime, and sparkling soda.', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', tags: ['Real Fruit', 'Sparkling'] },
  { id: 'mojito-2', category: 'mojitos', name: 'Classic Mint Mojito', arabic: 'موهيتو كلاسيك', price: 6000, isIced: true, desc: 'Freshly muddled garden mint, tangy lime wedges, organic cane sugar, and sparkling club soda.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', tags: ['Fresh Mint', 'Lime'] },

  // ICED TEA
  { id: 'tea-1', category: 'icedtea', name: 'Peach Iced Tea', arabic: 'شاي مثلج بالخوخ', price: 5000, isIced: true, desc: 'Slow-brewed black tea steeped with sweet peach nectar and served crisp over crushed ice.', image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80', tags: ['Slow Steeped', 'Refreshing'] },

  // SMOOTHIES
  { id: 'smoothie-1', category: 'smoothies', name: 'Blueberry Bliss Smoothie', arabic: 'سموذي بلو بيري', price: 7000, isIced: true, rating: 'Superfood', desc: 'Wild mountain blueberries blended thick with creamy Greek yogurt, banana, and honey.', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80', tags: ['Thick & Creamy', 'Greek Yogurt'] },
  { id: 'smoothie-2', category: 'smoothies', name: 'Peanut Butter Energy', arabic: 'سموذي فول سوداني', price: 6500, isIced: true, desc: 'Roasted peanut butter, ripe bananas, almond milk, and raw honey for courtside stamina.', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', tags: ['High Protein', 'Energy Boost'] },

  // BAKERY & SWEETS
  { id: 'bake-1', category: 'bakery', name: 'Signature Cookie on Cup', arabic: 'كوكيز الشوكولاتة على الكوب', price: 4500, isIced: false, isFood: true, rating: 'WorkSpace Viral', desc: 'Warm Belgian dark chocolate chip cookie baked thick and served resting on top of your cup lid.', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80', tags: ['Viral Feature', 'Belgian Chocolate'] },
  { id: 'bake-2', category: 'bakery', name: 'San Sebastian Cheesecake', arabic: 'تشيز كيك سان سيباستيان', price: 6500, isIced: false, isFood: true, rating: 'Chef Favorite', desc: 'Creamy Basque burnt cheesecake served with warm melted Belgian milk chocolate sauce.', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80', tags: ['Caramelized Top', 'Warm Chocolate'] },
  { id: 'bake-3', category: 'bakery', name: 'Fresh Butter Croissant', arabic: 'كرواسون زبدة فرنسي', price: 4000, isIced: false, isFood: true, desc: 'Flaky 100% French butter layers baked golden every morning at 8:30 AM.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', tags: ['Baked Daily', 'French Butter'] },
];

type PadelProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  desc: string;
};

const PADEL_PRODUCTS: PadelProduct[] = [
  { id: 'p1', name: 'Head Speed Pro Racket', category: 'Rackets', price: 180000, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80', desc: 'Precision and power. The official racket of the Padel Club Baghdad pros.' },
  { id: 'p2', name: 'Babolat Technical Viper', category: 'Rackets', price: 210000, image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80', desc: 'Diamond shape for maximum smash power. Lightweight carbon fiber.' },
  { id: 'p3', name: 'Bullpadel Pro Padel Balls', category: 'Balls', price: 15000, image: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=800&q=80', desc: 'Tube of 3 high-altitude pressure balls for tournament play.' },
  { id: 'p4', name: 'Wilson Padel Bag', category: 'Accessories', price: 85000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', desc: 'Thermal insulated racket compartment and shoe pocket.' },
  { id: 'p5', name: 'Overgrip Pack (3x)', category: 'Accessories', price: 12000, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80', desc: 'Tacky feel for maximum control and sweat absorption.' },
  { id: 'p6', name: 'WorkSpace Padel Tee', category: 'Apparel', price: 35000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', desc: 'Breathable performance fabric with the Padel Club Baghdad logo.' },
];

// ─────────────────────────────────────────────────────────────
// GATEWAY (HOME)
// ─────────────────────────────────────────────────────────────
const GatewayPage = ({ onSelectWorld, lang, setLang }: { onSelectWorld: (id: WorldId) => void } & LanguageProps) => {
  const [hoveredPanel, setHoveredPanel] = useState<WorldId | null>(null);
  const t = TRANSLATIONS[lang];

  const worlds: World[] = [
    { id: 'menu', code: '01', title: t.heroTitle1, tagline: lang === 'en' ? 'Specialty Beans & 16oz Cups' : 'حبوب مختصة وأكواب 16 أونصة', badge: 'QR & SPECIALTY MENU', cta: t.enterMenu, image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85', desc: t.heroDesc1 },
    { id: 'padel', code: '02', title: t.heroTitle2, tagline: lang === 'en' ? 'Open-Air Rooftop Turf' : 'ملعب سطح مفتوح', badge: '60,000 IQD / HOUR', cta: t.bookCourt, image: encodeURI(IMAGES.padelRooftop), desc: t.heroDesc2 },
    { id: 'meeting', code: '03', title: t.heroTitle3, tagline: lang === 'en' ? 'Inside The WorkSpace' : 'داخل وورك سبيس', badge: '25,000 IQD / HOUR', cta: t.reserveSuite, image: encodeURI(IMAGES.meetingRoom), desc: t.heroDesc3 },
    {
      id: 'office',
      code: '04',
      title: t.heroTitle4,
      tagline: lang === 'en' ? 'Premium Office Solutions' : 'حلول مكاتب فاخرة',
      badge: lang === 'en' ? 'FROM 1 DESK TO FULL FLOOR' : 'من مكتب واحد إلى الطابق الكامل',
      cta: t.exploreOffices,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      desc: t.heroDesc4
    }
  ];

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#12100F] text-white flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto"><WorkSpaceBrandHeader /></div>
        <div className="pointer-events-auto flex items-center space-x-3">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all">
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <div className="hidden sm:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300 font-medium">{SITE.hours}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row w-full lg:h-[calc(100vh-80px)] pt-20 lg:pt-0">
        {worlds.map((world) => {
          const isHovered = hoveredPanel === world.id;
          const isAnyHovered = hoveredPanel !== null;
          const isDimmed = isAnyHovered && !isHovered;

          return (
            <div
              key={world.id}
              onMouseEnter={() => setHoveredPanel(world.id)}
              onMouseLeave={() => setHoveredPanel(null)}
              onClick={() => onSelectWorld(world.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectWorld(world.id); } }}
              className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out overflow-hidden flex flex-col justify-end p-6 md:p-12 pb-28 lg:pb-24 h-[50vh] sm:h-[60vh] lg:h-full lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/10 ${isHovered ? 'lg:flex-[1.5]' : isDimmed ? 'lg:flex-[0.75]' : 'lg:flex-1'}`}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img src={world.image} alt={world.title} className={`w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-105 filter grayscale-0 brightness-90' : isDimmed ? 'scale-100 filter grayscale brightness-50 opacity-40' : 'scale-100 filter grayscale-[40%] brightness-75'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 pointer-events-none">
                <span className={`font-serif text-5xl md:text-7xl font-black transition-opacity duration-500 ${isHovered ? 'text-white/30' : 'text-white/10'}`}>{world.code}</span>
              </div>
              <div className="relative z-20 flex flex-col max-w-lg pb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 text-white animate-float">
                    {world.badge}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs tracking-[0.25em] uppercase text-[#E59866] font-bold mb-1.5">
                    {world.tagline}
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-[1.1]">
                    {world.title}
                  </h2>
                </div>

                <p className={`text-xs md:text-sm text-stone-300 font-light leading-relaxed line-clamp-2 transition-all duration-500 mb-6 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-80 max-h-12'}`}>
                  {world.desc}
                </p>

                <div>
                  <span className={`inline-flex px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase border transition-all duration-300 items-center space-x-2 ${isHovered ? 'bg-white text-stone-900 border-white shadow-xl translate-x-1' : 'bg-black/40 text-white border-white/40 backdrop-blur-sm'}`}>
                    <span>{world.cta}</span><ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="relative lg:absolute bottom-0 inset-x-0 z-40 px-4 md:px-12 py-3 bg-black/80 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1"><MapPin size={12} className="text-[#C85228]" /><span>{SITE.location}</span></span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="hidden sm:inline font-mono hover:text-white transition-colors">{WHATSAPP_DISPLAY}</a>
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span>@workspacecafe</span><span>•</span><span>@padelclub.baghdad</span>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MENU PAGE
// ─────────────────────────────────────────────────────────────
type MenuPageProps = {
  onBack: () => void;
  onNavigateReservation: (type: 'padel' | 'meeting') => void;
  cart: CartItem[];
  onAddToCart: (item: MenuItem, qty?: number) => void;
  onOpenCart: () => void;
} & LanguageProps;

const MenuPage = ({ onBack, onNavigateReservation, cart, onAddToCart, onOpenCart, lang, setLang }: MenuPageProps) => {
  const t = TRANSLATIONS[lang];
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [cupFilter, setCupFilter] = useState<'all' | 'paper' | 'iced'>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  useEffect(() => { if (selectedItem) setDetailQty(1); }, [selectedItem]);
  useEffect(() => {
    if (!selectedItem) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedItem(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selectedItem]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = selectedCat === 'all' || item.category === selectedCat;
      const matchCup = cupFilter === 'all' ? true : cupFilter === 'iced' ? item.isIced : !item.isIced;
      return matchCat && matchCup;
    });
  }, [selectedCat, cupFilter]);

  const cartTotalCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#141211] text-[#FAF7F2] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#12100F]/95 backdrop-blur-xl border-b border-white/10 px-3 md:px-12 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={onBack} aria-label="Back to home" className="p-2 md:p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-stone-900 transition-colors"><ArrowLeft size={16} /></button>
          <WorkSpaceBrandHeader onHomeClick={onBack} />
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button onClick={() => onNavigateReservation('padel')} className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-stone-300"><span>🎾 Padel Court</span></button>
          <button onClick={() => onNavigateReservation('meeting')} className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-stone-300"><span>💼 6th Fl. Room</span></button>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold">{lang === 'en' ? 'العربية' : 'English'}</button>
          <button onClick={onOpenCart} aria-label={`Open cart (${cartTotalCount} items)`} className="relative px-3 md:px-4 py-2 rounded-full bg-[#C85228] hover:bg-[#d95d31] text-white text-xs font-bold tracking-wider flex items-center space-x-2 shadow-lg">
            <ShoppingBag size={15} /><span className="hidden sm:inline">{t.order}</span>
            {cartTotalCount > 0 && <span className="w-5 h-5 rounded-full bg-white text-stone-900 font-bold flex items-center justify-center text-[10px]">{cartTotalCount}</span>}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C85228]">BAGHDAD SPECIALTY BAR & BAKERY</span>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-white mt-1 mb-3">{t.menuTitle}</h1>
          <p className="text-xs md:text-sm text-stone-300 font-light leading-relaxed">{t.menuDesc}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 my-6">
          <button onClick={() => setCupFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${cupFilter === 'all' ? 'bg-white text-stone-900' : 'bg-white/5 text-stone-400 hover:text-white border border-white/10'}`}>All Items ({MENU_ITEMS.length})</button>
          <button onClick={() => setCupFilter('iced')} className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${cupFilter === 'iced' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-stone-400 hover:text-white border border-white/10'}`}><span>❄</span><span>Clear Printed Tumblers</span></button>
          <button onClick={() => setCupFilter('paper')} className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all ${cupFilter === 'paper' ? 'bg-[#C85228] text-white shadow-lg' : 'bg-white/5 text-stone-400 hover:text-white border border-white/10'}`}><span>☕</span><span>Hot Paper Cups & Treats</span></button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/10 mb-8">
          {MENU_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center space-x-2 whitespace-nowrap transition-all shrink-0 ${isSelected ? 'bg-[#FAF7F2] text-stone-900 shadow-md' : 'bg-white/5 text-stone-300 hover:bg-white/10'}`}>
                <Icon size={14} className={isSelected ? 'text-[#C85228]' : 'text-stone-400'} /><span>{({ all: t.catAll, hot: t.catHot, iced: t.catIced, mojitos: t.catMojitos, icedtea: t.catTea, smoothies: t.catSmoothies, bakery: t.catBakery } as Record<string, string>)[cat.id] ?? cat.name}</span>
              </button>
            );
          })}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-sm">No items match this filter. Try another one.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-[#1A1817] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#C85228]/50 hover:shadow-[0_20px_40px_-15px_rgba(200,82,40,0.3)] transition-all duration-500 flex flex-col justify-between cursor-pointer animate-fade-in-up hover:-translate-y-2"
                style={{ animationDelay: `${(index % 6) * 100}ms` }}
              >
                <div className="relative h-60 w-full overflow-hidden bg-stone-950">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-90 group-hover:brightness-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817] via-[#1A1817]/30 to-black/20 transition-opacity duration-500 group-hover:opacity-70" />
                  <div className="absolute top-4 left-4 z-10 transition-transform duration-500 group-hover:scale-105"><BrandedCupStamp isIced={item.isIced} isFood={item.isFood} /></div>
                  {item.rating && <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-[#C85228] text-white shadow-lg transition-transform duration-500 group-hover:-translate-y-1">{item.rating}</div>}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-serif font-bold text-xl text-[#FAF7F2] group-hover:text-[#E59866] transition-colors duration-300 leading-tight">{item.name}</h3>
                      <span className="font-mono font-bold text-sm text-white whitespace-nowrap mt-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">{item.price.toLocaleString()} IQD</span>
                    </div>
                    <div className="text-xs text-stone-400 font-medium mb-3">{item.arabic}</div>
                    <p className="text-xs text-stone-300 font-light leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags?.slice(0, 2).map((tag, i) => (<span key={i} className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md bg-[#252220] text-stone-400 border border-white/5 group-hover:border-white/10 transition-colors">{tag}</span>))}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item, 1); }} aria-label={`Add ${item.name} to bag`} className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#C85228] border border-white/10 group-hover:border-[#C85228] text-stone-300 group-hover:text-white transition-all duration-300 shadow-md flex items-center justify-center group-hover:scale-110">
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <div onClick={() => setSelectedItem(null)} role="dialog" aria-modal="true" aria-label={selectedItem.name} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="bg-[#1C1A18] rounded-3xl border border-white/15 max-w-md w-full overflow-hidden shadow-2xl animate-zoom-in">
            <div className="relative h-64 w-full overflow-hidden">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedItem(null)} aria-label="Close" className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-stone-900 transition-colors"><X size={16} /></button>
              <div className="absolute bottom-4 left-4"><BrandedCupStamp isIced={selectedItem.isIced} isFood={selectedItem.isFood} /></div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-serif font-black text-2xl text-white">{selectedItem.name}</h3>
                <span className="font-mono font-bold text-lg text-[#E59866]">{selectedItem.price.toLocaleString()} IQD</span>
              </div>
              <div className="text-xs text-stone-400 font-semibold mb-3">{selectedItem.arabic}</div>
              <p className="text-xs text-stone-300 font-light leading-relaxed mb-6">{selectedItem.desc}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button onClick={() => setDetailQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10"><Minus size={14} /></button>
                  <span className="text-sm font-bold text-white w-6 text-center">{detailQty}</span>
                  <button onClick={() => setDetailQty((q) => q + 1)} aria-label="Increase quantity" className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10"><Plus size={14} /></button>
                </div>
                <button onClick={() => { onAddToCart(selectedItem, detailQty); setSelectedItem(null); }} className="flex-1 py-3.5 rounded-2xl bg-[#C85228] hover:bg-[#d95d31] text-white font-bold text-xs tracking-widest uppercase transition-all shadow-xl flex items-center justify-center space-x-2">
                  <Plus size={16} /><span>ADD • {(selectedItem.price * detailQty).toLocaleString()} IQD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// RESERVATION PAGE
// ─────────────────────────────────────────────────────────────
type ReservationPageProps = {
  type: 'padel' | 'meeting';
  onBack: () => void;
  onNavigateShop: () => void;
} & LanguageProps;

const ReservationPage = ({ type, onBack, onNavigateShop, lang, setLang }: ReservationPageProps) => {
  const t = TRANSLATIONS[lang];
  const isPadel = type === 'padel';
  const days = useMemo(() => getNextDays(7), []);
  const [dateIndex, setDateIndex] = useState(() => { const d = getNextDays(7); const i = d.findIndex((x) => !x.disabled); return i >= 0 ? i : 0; });
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [duration, setDuration] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [includeBarista, setIncludeBarista] = useState(false);
  const [extraRackets, setExtraRackets] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const activeDay = days[dateIndex];
  const timeSlots = useMemo(() => generateTimeSlots(duration), [duration]);

  useEffect(() => {
    const current = timeSlots.find((s) => s.time === selectedSlot);
    if (!current || current.booked || current.wouldOverflow) {
      const next = timeSlots.find((s) => !s.booked && !s.wouldOverflow);
      if (next) setSelectedSlot(next.time);
    }
  }, [timeSlots, selectedSlot]);

  const selectedSlotHour = timeSlots.find((s) => s.time === selectedSlot)?.hour ?? SITE.openHour;
  const hourlyRate = isPadel ? 60000 : 25000;
  const addOnsTotal = (extraRackets ? 10000 : 0) + (includeBarista ? 15000 : 0);
  const grandTotal = hourlyRate * duration + addOnsTotal;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const handleWhatsAppConfirm = () => {
    if (!name.trim()) { showToast('Please enter your name to confirm.'); return; }
    const serviceName = isPadel ? '🎾 Rooftop Padel Court (Hay Al-Jamia)' : '💼 6th Floor Executive Boardroom Suite';
    const msg = `*WorkSpace Baghdad Reservation Request*\n-----------------------------\n📍 *Location:* ${SITE.location}\n🏢 *Facility:* ${serviceName}\n👤 *Name:* ${name}\n📞 *Phone:* ${phone || 'Provided via WhatsApp'}\n📅 *Date:* ${activeDay.day} ${activeDay.dayNum} ${activeDay.month} ${activeDay.full.getFullYear()}\n⏰ *Start Time:* ${selectedSlot}\n⏳ *Duration:* ${duration} Hour(s)\n${extraRackets ? '🎾 Extra Padel Rackets included (+10,000 IQD)\n' : ''}${includeBarista ? '☕ Barista Coffee Service included (+15,000 IQD)\n' : ''}-----------------------------\n💰 *Total Amount:* ${grandTotal.toLocaleString()} IQD\n\nPlease confirm availability for my slot!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToGoogleCalendar = () => {
    const start = new Date(activeDay.full);
    start.setHours(selectedSlotHour, 0, 0, 0);
    const end = new Date(start.getTime() + duration * 3_600_000);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: isPadel ? 'Padel @ WorkSpace Rooftop Baghdad' : 'Boardroom @ WorkSpace Cafe 6th Fl.',
      dates: `${fmtCalendar(start)}/${fmtCalendar(end)}`,
      details: `Guest: ${name || 'Guest'}\nTotal: ${grandTotal.toLocaleString()} IQD\n${SITE.location}`,
      location: SITE.location,
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#12100F] text-[#FAF7F2] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#12100F]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button onClick={onBack} aria-label="Back to home" className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-stone-900 transition-colors"><ArrowLeft size={16} /></button>
          {isPadel ? (
            <div className="flex items-center space-x-3 cursor-pointer" onClick={onBack} role="button" tabIndex={0}>
              <PadelClubLogo className="w-10 h-10 shadow-md" />
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg md:text-xl text-white leading-none">padel club<span className="text-[#C85228]">.</span></span>
                <span className="text-[9px] uppercase tracking-widest text-[#E59866] font-semibold mt-1">Rooftop Court • Baghdad</span>
              </div>
            </div>
          ) : (
            <WorkSpaceBrandHeader onHomeClick={onBack} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-all">
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <div className="text-right text-xs text-stone-400 hidden sm:block">
            <div>{SITE.hours}</div><div className="text-[#C85228] font-bold">{SITE.location}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C85228]">{isPadel ? 'OPEN-AIR ROOFTOP TURF' : '6TH FLOOR EXECUTIVE SUITE'}</span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-serif font-black text-white mt-1">{isPadel ? 'Book Your Padel Court' : 'Reserve 6th Floor Boardroom'}</h1>
              {isPadel && (
                <button onClick={onNavigateShop} className="inline-flex items-center justify-center gap-2 self-start px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors">
                  <ShoppingBag size={15} />
                  <span>{lang === 'en' ? 'Shop Padel Gear' : 'تسوق معدات البادل'}</span>
                </button>
              )}
            </div>
            <p className="text-xs md:text-sm text-stone-300 font-light leading-relaxed">{isPadel ? "Baghdad's open-sky rooftop court with Mondo Supercourt XN turf, night illumination, and direct cafe drink delivery." : 'Modern executive meeting room designed for seamless pitches, boardroom discussions, and private business presentations.'}</p>
          </div>
          {isPadel ? <RealPadelRooftopShowcase onBookClick={scrollToForm} /> : <InsideMeetingRoomFrame onBookClick={scrollToForm} />}
          {isPadel && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl group relative">
                <img src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=600&q=80" alt="Padel Court Glass Walls" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white">Panoramic Glass</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl group relative">
                <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80" alt="Padel Court Turf" className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white">Pro Turf Surface</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Wifi size={16} className="text-[#C85228] mb-2" /><div className="text-xs font-bold text-white">{t.wifi}</div><div className="text-[10px] text-stone-400">Fiber Optic</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Zap size={16} className="text-[#C85228] mb-2" /><div className="text-xs font-bold text-white">{t.electricity}</div><div className="text-[10px] text-stone-400">Generator Backed</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Bath size={16} className="text-[#C85228] mb-2" /><div className="text-xs font-bold text-white">{t.restrooms}</div><div className="text-[10px] text-stone-400">Sanitized Hourly</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <ShieldCheck size={16} className="text-[#C85228] mb-2" /><div className="text-xs font-bold text-white">{t.security}</div><div className="text-[10px] text-stone-400">CCTV Monitored</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors col-span-2 lg:col-span-1">
              <MapPin size={16} className="text-[#C85228] mb-2" /><div className="text-xs font-bold text-white">{t.location}</div><div className="text-[10px] text-stone-400">Hay Al-Jamia, Baghdad</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors col-span-2 lg:col-span-1">
              <Phone size={16} className="text-[#C85228] mb-2" /><div className="text-xs font-bold text-white">{t.directLine}</div>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-[10px] text-stone-400 font-mono hover:text-white">{WHATSAPP_DISPLAY}</a>
            </div>
          </div>
        </div>

        <div ref={formRef} className="lg:col-span-5 scroll-mt-24">
          <div className="lg:sticky lg:top-24 bg-[#1A1817] rounded-3xl border border-white/15 p-5 md:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-serif font-black text-2xl text-white mb-1">Select Date &amp; Time</h3>
              <p className="text-xs text-stone-400 font-light">Pick a day, pick a time. Saturday to Thursday.</p>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 block mb-3">1. Select Day</label>
              <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                {days.map((d, idx) => {
                  const isSelected = dateIndex === idx;
                  return (
                    <button key={idx} disabled={d.disabled} onClick={() => setDateIndex(idx)} aria-label={`${d.day} ${d.dayNum} ${d.month}`} className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl flex flex-col items-center justify-center transition-all ${d.disabled ? 'opacity-20 cursor-not-allowed bg-black text-stone-500' : isSelected ? 'bg-[#C85228] text-white shadow-[0_0_15px_rgba(200,82,40,0.4)]' : 'bg-[#252220] hover:bg-[#322e2b] text-stone-300 border border-white/5'}`}>
                      <span className="text-[9px] md:text-[10px] uppercase font-bold">{d.day}</span>
                      <span className="text-xs md:text-sm font-black mt-0.5">{d.dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 block mb-3">2. Select Start Slot</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot, idx) => {
                  const isSelected = selectedSlot === slot.time;
                  const disabled = slot.booked || slot.wouldOverflow;
                  return (
                    <button key={idx} disabled={disabled} onClick={() => setSelectedSlot(slot.time)} aria-label={`${slot.time}${slot.booked ? ' (booked)' : ''}${slot.wouldOverflow ? ' (past closing)' : ''}`} className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all ${disabled ? 'opacity-20 line-through bg-black text-stone-500 cursor-not-allowed' : isSelected ? 'bg-white text-stone-900 shadow-lg' : 'bg-[#252220] hover:bg-[#322e2b] text-stone-300 border border-white/5'}`}>{slot.time}</button>
                  );
                })}
              </div>
              <p className="text-[10px] text-stone-500 mt-2">Slots too late for your selected duration are disabled (cafe closes at 5:00 PM).</p>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 block mb-3">3. Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((dur) => (
                  <button key={dur} onClick={() => setDuration(dur)} className={`py-3 rounded-lg text-[11px] font-bold transition-all ${duration === dur ? 'bg-white text-stone-900 shadow-lg' : 'bg-[#252220] hover:bg-[#322e2b] text-stone-300 border border-white/5'}`}>{dur} {dur === 1 ? 'Hour' : 'Hours'}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 block mb-1">Optional Add-Ons</label>
              {isPadel ? (
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 text-xs">
                  <span className="text-stone-300">🎾 2x Extra Wilson Padel Rackets</span>
                  <input type="checkbox" checked={extraRackets} onChange={(e) => setExtraRackets(e.target.checked)} className="accent-[#C85228] w-4 h-4" />
                </label>
              ) : (
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 text-xs">
                  <span className="text-stone-300">☕ Boardroom Coffee Carafe Service</span>
                  <input type="checkbox" checked={includeBarista} onChange={(e) => setIncludeBarista(e.target.checked)} className="accent-[#C85228] w-4 h-4" />
                </label>
              )}
            </div>
            <div className="space-y-2">
              <input type="text" placeholder="Your Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C85228]" />
              <input type="tel" placeholder="Phone Number (e.g., 0770 000 0000)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#C85228]" />
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between text-stone-400"><span>{isPadel ? 'Padel Court' : '6th Fl. Room'} • {activeDay.day} {activeDay.dayNum} {activeDay.month} • {selectedSlot}</span><span className="font-mono">{hourlyRate.toLocaleString()} IQD/hr</span></div>
              <div className="flex justify-between text-stone-400"><span>Duration ({duration} {duration === 1 ? 'hour' : 'hours'})</span><span className="font-mono">{(hourlyRate * duration).toLocaleString()} IQD</span></div>
              {addOnsTotal > 0 && <div className="flex justify-between text-[#E59866]"><span>Add-ons Total</span><span className="font-mono">+{addOnsTotal.toLocaleString()} IQD</span></div>}
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold text-white"><span>Grand Total</span><span className="text-[#C85228] font-mono text-lg">{grandTotal.toLocaleString()} IQD</span></div>
            </div>
            <div className="space-y-3">
              <button onClick={handleWhatsAppConfirm} className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[#075E54] font-black text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center space-x-2">
                <MessageCircle size={18} strokeWidth={2.5} /><span>CONFIRM ON WHATSAPP ({WHATSAPP_DISPLAY})</span>
              </button>
              <button onClick={handleAddToGoogleCalendar} className="w-full py-3.5 rounded-xl bg-[#252220] hover:bg-[#322e2b] border border-white/5 text-stone-300 font-bold text-[11px] tracking-wider transition-all flex items-center justify-center space-x-2">
                <CalendarPlus size={15} /><span>Add Slot to Google Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      {toast && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 border border-white/20 px-5 py-3 rounded-full text-xs font-bold text-white shadow-2xl animate-slide-up">{toast}</div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────────────────────
type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onBrowse: () => void;
};

const CartDrawer = ({ isOpen, onClose, cart, onUpdateQuantity, onBrowse }: CartDrawerProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map((i) => `• ${i.name} (${i.isIced ? 'Clear Tumbler ❄' : i.isFood ? 'Bakery 🥐' : 'Paper Cup ☕'}) x${i.quantity} = ${(i.price * i.quantity).toLocaleString()} IQD`).join('\n');
    const text = `*WorkSpace Cafe Table Order*\n-----------------------------\n📍 Hay Al-Jamia, Baghdad\n${itemsList}\n-----------------------------\n💰 *Total:* ${total.toLocaleString()} IQD\n\nPlease prepare my order!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Your cafe order" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#1A1817] w-full max-w-md h-full flex flex-col justify-between p-5 md:p-6 border-l border-white/15 animate-slide-in-right">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center space-x-2"><ShoppingBag size={18} className="text-[#C85228]" /><h3 className="font-serif font-bold text-xl text-white">Your Cafe Order</h3></div>
            <button onClick={onClose} aria-label="Close cart" className="p-2 rounded-full bg-white/5 text-stone-400 hover:text-white"><X size={16} /></button>
          </div>
          {cart.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-sm">
              <p className="mb-4">Your bag is currently empty.</p>
              <button onClick={() => { onClose(); onBrowse(); }} className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all">
                <ChevronLeft size={14} /><span>Browse Menu</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{item.name}</div>
                    <div className="text-[10px] text-stone-400">{item.isIced ? '❄ Clear Tumbler' : item.isFood ? '🥐 Bakery' : '☕ Paper Cup'}</div>
                    <div className="text-xs font-mono font-semibold text-[#E59866] mt-1">{(item.price * item.quantity).toLocaleString()} IQD</div>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/40 rounded-xl p-1 border border-white/10">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`} className="p-1.5 rounded text-stone-400 hover:text-white"><Minus size={12} /></button>
                    <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} aria-label={`Increase ${item.name}`} className="p-1.5 rounded text-stone-400 hover:text-white"><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-white"><span>Total</span><span className="text-[#C85228] font-mono text-lg">{total.toLocaleString()} IQD</span></div>
            <button onClick={handleCheckoutWhatsApp} className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center space-x-2">
              <MessageCircle size={17} /><span>ORDER VIA WHATSAPP ({WHATSAPP_DISPLAY})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// OFFICE SOLUTIONS
// ─────────────────────────────────────────────────────────────
const OfficeSolutionsPage = ({ onBack, lang, setLang }: { onBack: () => void, lang: 'en' | 'ar', setLang: (lang: 'en' | 'ar') => void }) => {
  const [formStatus, setFormStatus] = useState('');

  const solutions = [
    { 
      icon: Building2, title: lang === 'en' ? 'Private Offices' : 'مكاتب خاصة', 
      desc: lang === 'en' ? 'Dedicated, locked office suites for companies that require privacy, focus, and a credible business address. Suitable for teams of all sizes.' : 'أجنحة مكتبية مخصصة ومقفلة للشركات التي تتطلب الخصوصية والتركيز وعنوان عمل موثوق. مناسبة للفرق من جميع الأحجام.',
      includes: lang === 'en' ? ['Dedicated locked office', 'Professional business address', '24/7 access', 'High-speed internet', 'Meeting room credits', 'Reception services'] : ['مكتب مقفل مخصص', 'عنوان عمل احترافي', 'وصول 24/7', 'إنترنت عالي السرعة', 'أرصدة غرف الاجتماعات', 'خدمات الاستقبال'],
      suitable: lang === 'en' ? 'Established companies, regional offices, project teams, corporate occupiers' : 'الشركات الراسخة، المكاتب الإقليمية، فرق المشاريع، المستأجرين من الشركات',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    },
    { 
      icon: Briefcase, title: lang === 'en' ? 'Serviced Offices' : 'مكاتب مخدومة', 
      desc: lang === 'en' ? 'Move-in ready, fully managed office environments with business-ready infrastructure and support. Set up and operational from day one.' : 'بيئات مكتبية جاهزة للانتقال ومُدارة بالكامل مع بنية تحتية ودعم جاهزين للأعمال. جاهزة للعمل من اليوم الأول.',
      includes: lang === 'en' ? ['Fully furnished & equipped', 'Managed IT infrastructure', 'Admin & reception support', 'Utilities included', 'Flexible lease terms', 'Business support services'] : ['مفروشة ومجهزة بالكامل', 'بنية تحتية مُدارة لتقنية المعلومات', 'دعم إداري واستقبال', 'تشمل المرافق', 'شروط إيجار مرنة', 'خدمات دعم الأعمال'],
      suitable: lang === 'en' ? 'Companies needing an immediate, professional base with full support' : 'الشركات التي تحتاج إلى قاعدة احترافية فورية مع دعم كامل',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80'
    },
    { 
      icon: Users, title: lang === 'en' ? 'Enterprise Suites' : 'أجنحة الشركات', 
      desc: lang === 'en' ? 'Large-format office solutions for established companies and major occupiers. Entire floors and bespoke configurations for regional headquarters and corporate teams.' : 'حلول مكتبية واسعة النطاق للشركات الراسخة والمستأجرين الكبار. طوابق كاملة وتكوينات مخصصة للمقرات الإقليمية وفرق الشركات.',
      includes: lang === 'en' ? ['Entire floor availability', 'Bespoke configuration', 'Dedicated reception & support', 'Branded environment options', 'Full building services', 'Premium address & facilities'] : ['توفر طابق كامل', 'تكوين مخصص', 'استقبال ودعم مخصص', 'خيارات بيئة ذات علامة تجارية', 'خدمات المبنى الكاملة', 'عنوان ومرافق متميزة'],
      suitable: lang === 'en' ? 'Major corporate occupiers, regional HQs, established businesses' : 'المستأجرون من الشركات الكبرى، المقرات الإقليمية، الشركات الراسخة',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
    },
    { 
      icon: Globe, title: lang === 'en' ? 'Virtual Offices' : 'مكاتب افتراضية', 
      desc: lang === 'en' ? 'A professional Baghdad business address and presence without the need for full-time physical occupancy. Credible, cost-effective, and ready immediately.' : 'عنوان عمل احترافي في بغداد وحضور دون الحاجة إلى إشغال مادي بدوام كامل. موثوق وفعال من حيث التكلفة وجاهز على الفور.',
      includes: lang === 'en' ? ['Professional Baghdad address', 'Mail handling & forwarding', 'Call answering services', 'Meeting room access', 'On-demand workspace', 'Business registration address'] : ['عنوان احترافي في بغداد', 'معالجة وإعادة توجيه البريد', 'خدمات الرد على المكالمات', 'الوصول إلى غرف الاجتماعات', 'مساحة عمل عند الطلب', 'عنوان تسجيل الشركة'],
      suitable: lang === 'en' ? 'Companies requiring a professional Baghdad address without full-time physical space' : 'الشركات التي تتطلب عنواناً احترافياً في بغداد دون مساحة مادية بدوام كامل',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80'
    },
    { 
      icon: Layout, title: lang === 'en' ? 'Meeting Rooms' : 'قاعات الاجتماعات', 
      desc: lang === 'en' ? 'Professional, fully equipped meeting and collaboration spaces available on demand. Ideal for client presentations, team sessions, and business gatherings.' : 'مساحات اجتماعات وتعاون احترافية مجهزة بالكامل متاحة عند الطلب. مثالية لعروض العملاء وجلسات الفريق والتجمعات التجارية.',
      includes: lang === 'en' ? ['Professional AV equipment', 'Flexible hourly booking', 'Reception & hosting support', 'High-speed connectivity', 'Refreshment service', 'Whiteboard & presentation tools'] : ['معدات صوتية ومرئية احترافية', 'حجز مرن بالساعة', 'استقبال ودعم استضافة', 'اتصال عالي السرعة', 'خدمة المرطبات', 'سبورة وأدوات عرض'],
      suitable: lang === 'en' ? 'Teams, independent professionals, and visiting executives' : 'الفرق والمهنيين المستقلين والمديرين التنفيذيين الزائرين',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80'
    },
    { 
      icon: Wrench, title: lang === 'en' ? 'Custom Solutions' : 'حلول مخصصة', 
      desc: lang === 'en' ? 'Bespoke, unserviced office space for tenants who prefer to configure and operate their environment independently. Full control within a professional setting.' : 'مساحة مكتبية مخصصة وغير مخدومة للمستأجرين الذين يفضلون تكوين وتشغيل بيئتهم بشكل مستقل. تحكم كامل داخل بيئة احترافية.',
      includes: lang === 'en' ? ['Raw professional space', 'Fully customisable layout', 'Building services included', 'High-speed internet', 'Secure building access', 'Flexible lease terms'] : ['مساحة احترافية خام', 'تصميم قابل للتخصيص بالكامل', 'تشمل خدمات المبنى', 'إنترنت عالي السرعة', 'وصول آمن للمبنى', 'شروط إيجار مرنة'],
      suitable: lang === 'en' ? 'Established tenants, operators, and businesses with specific setup requirements' : 'المستأجرون الراسخون والمشغلون والشركات ذات المتطلبات المحددة',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    },
  ];

  const clients = [
    { name: 'Al Majal', logo: '/logos/almajal.png' },
    { name: 'Careem', logo: '/logos/careem.png' },
    { name: 'Abwaab', logo: '/logos/abwaab.png' },
    { name: 'WorkSpace Cafe', logo: '/logos/workspace.png' },
    { name: 'Orderii', logo: '/logos/orderii.png' },
    { name: 'Hyundai', logo: '/logos/hyundai.png' },
    { name: 'ABS', logo: '/logos/abs.png' },
    { name: 'Ameena', logo: '/logos/ameena.jpg' },
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', label: lang === 'en' ? 'Building Exterior' : 'المبنى من الخارج' },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', label: lang === 'en' ? 'Interior Finish' : 'التشطيب الداخلي' },
    { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80', label: lang === 'en' ? 'Building Identity' : 'هوية المبنى' },
    { src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', label: lang === 'en' ? 'Collaboration Space' : 'مساحة التعاون' },
    { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80', label: lang === 'en' ? 'Premium Workspace' : 'مساحة عمل متميزة' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus(lang === 'en' ? 'Enquiry received! We will contact you shortly.' : 'تم استلام الاستفسار! سنتصل بك قريباً.');
  };

  return (
    <div className="min-h-screen bg-[#12100F] text-[#FAF7F2] flex flex-col font-sans">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#12100F]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between shadow-lg">
        {/* Left: Logo & Back */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={onBack}
            aria-label="Back to home"
            className="p-2 md:p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-stone-300 hover:text-white transition-all group"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px] group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center cursor-pointer" onClick={onBack}>
            <img src="/workspace-logo.png" alt="WorkSpace Baghdad" className="h-8 md:h-9 w-auto object-contain" />
            <div className="hidden sm:flex flex-col ml-2 md:ml-3 sm:border-l sm:border-white/10 sm:pl-3">
              <span className="font-serif font-black text-sm md:text-lg text-white leading-none">
                Business Suites
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#C85228] font-bold mt-1">
                WorkSpace Baghdad
              </span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-stone-400">
          <a href="#workspaces" className="hover:text-white hover:border-b-2 hover:border-[#C85228] pb-1 transition-all">{lang === 'en' ? 'Workspaces' : 'مساحات العمل'}</a>
          <a href="#gallery" className="hover:text-white hover:border-b-2 hover:border-[#C85228] pb-1 transition-all">{lang === 'en' ? 'Gallery' : 'معرض الصور'}</a>
          <a href="#contact" className="hover:text-white hover:border-b-2 hover:border-[#C85228] pb-1 transition-all">{lang === 'en' ? 'Contact' : 'اتصل بنا'}</a>
        </nav>

        {/* Right: Contact & Actions */}
        <div className="flex items-center space-x-3">
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="hidden xl:flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-all text-xs font-mono font-semibold"
          >
            <Phone size={14} className="text-[#C85228]" />
            <span>+964 788 295 9696</span>
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 md:px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-2 md:px-4 md:py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-white transition-all flex items-center space-x-1"
          >
            <Globe size={12} className="text-stone-400" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative py-24 px-4 text-center border-b border-white/5 bg-[#0A0908]">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 leading-tight">
              Flexible Office Solutions for <br />
              <span className="text-[#C85228] italic">Businesses of Every Size.</span>
            </h1>
            <p className="text-base md:text-lg text-stone-400 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Private offices, serviced offices, enterprise suites, virtual offices, meeting rooms, and custom solutions — for businesses ranging from single professionals to major corporate teams.
            </p>
          </div>
        </section>

        {/* Client Marquee */}
        <section className="py-16 bg-[#12100F] border-b border-white/5 overflow-hidden relative">
          <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 mb-10">
            Trusted by Leading Companies
          </p>

          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#12100F] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#12100F] to-transparent z-10 pointer-events-none" />

          {/* The Moving Belt */}
          <div className="flex w-max animate-marquee items-center">
            {/* Tripled for a perfect infinite loop */}
            {[...clients, ...clients, ...clients].map((client, i) => (
              <div
                key={i}
                className="mx-3 md:mx-4 flex-shrink-0 w-36 h-24 md:w-44 md:h-28 bg-white rounded-2xl flex items-center justify-center p-4 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer group border border-white/20"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const span = document.createElement('span');
                      span.className = 'fallback-text text-stone-900 font-bold text-xs tracking-wider uppercase text-center';
                      span.innerText = client.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Workspaces Grid (Merged Image + Text) */}
        <section id="workspaces" className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C85228]">OUR WORKSPACES</span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-2 mb-4">Solutions for Every Stage and Scale</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {solutions.map((sol, i) => (
              <div key={i} className="group bg-[#1A1817] rounded-3xl overflow-hidden border border-white/10 hover:border-[#C85228]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(200,82,40,0.2)] flex flex-col animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                
                {/* Image Header */}
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img src={sol.image} alt={sol.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.6] group-hover:brightness-[0.8]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817] via-transparent to-transparent" />
                  <div className="absolute bottom-3 md:bottom-4 left-4 md:left-6 flex items-center space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#C85228]">
                      <sol.icon size={16} className="md:w-5 md:h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-xl md:text-2xl text-white drop-shadow-md">{sol.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <p className="text-[11px] md:text-xs text-stone-400 mb-4 md:mb-6 flex-grow">{sol.desc}</p>
                  
                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85228] mb-3 block">WHAT'S INCLUDED</span>
                    <ul className="space-y-2">
                      {sol.includes.map((inc, j) => (
                        <li key={j} className="flex items-start space-x-2 text-[11px] text-stone-300">
                          <CheckCircle2 size={12} className="text-[#C85228] mt-0.5 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <p className="text-[10px] text-stone-500 mb-3 leading-relaxed"><span className="font-bold text-stone-400">Suitable for:</span> {sol.suitable}</p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`I am interested in ${sol.title}`)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white hover:text-[#C85228] transition-colors flex items-center">
                      Discuss Your Requirement <ArrowUpRight size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-[#0A0908] border-y border-white/5 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C85228]">GALLERY</span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-2 mb-4">See WorkSpace in Detail</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className={`group relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-64 md:h-80 ${i === 0 ? 'md:col-span-2 md:h-96' : ''}`}>
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-[0.7] group-hover:brightness-[0.9]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-6 left-6 text-sm font-bold text-white tracking-wide">{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-4 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-2">Ready to Find Your Workspace?</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex items-center space-x-4 p-6 rounded-2xl bg-[#25D366] text-stone-900 hover:bg-[#20ba5a] transition-colors">
                <MessageCircle size={24} />
                <div>
                  <div className="font-bold text-sm">WhatsApp Us</div>
                  <div className="text-xs font-mono font-semibold">+964 788 295 9696</div>
                </div>
              </a>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center space-x-4 p-6 rounded-2xl bg-[#1A1817] border border-white/10 hover:border-white/20 transition-colors">
                <Phone size={24} className="text-[#C85228]" />
                <div>
                  <div className="font-bold text-sm text-white">Call Now</div>
                  <div className="text-xs font-mono text-stone-400">+964 788 295 9696</div>
                </div>
              </a>
              <div className="p-6 rounded-2xl bg-[#1A1817] border border-white/10">
                <h4 className="font-bold text-sm text-white mb-4">Contact Information</h4>
                <div className="space-y-4 text-xs text-stone-400">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Address</span>
                    <p>Building 70, Jordan Street<br />Hay Al Jamia, Baghdad, Iraq</p>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Email</span>
                    <p>info@workspace.iq</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-[#1A1817] p-5 md:p-8 rounded-3xl border border-white/10">
              {formStatus ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <CheckCircle2 size={48} className="text-[#25D366] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-stone-400 text-sm">{formStatus}</p>
                  <button onClick={() => setFormStatus('')} className="mt-6 text-xs font-bold text-[#C85228] uppercase tracking-wider hover:text-white transition-colors">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Full Name *</label>
                      <input required type="text" className="w-full bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C85228]" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Company</label>
                      <input type="text" className="w-full bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C85228]" placeholder="Company name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Phone Number</label>
                      <input type="tel" className="w-full bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C85228]" placeholder="+964 7XX XXX XXXX" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Email Address</label>
                      <input type="email" className="w-full bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C85228]" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Space Requirement</label>
                    <select className="w-full bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C85228] appearance-none">
                      <option value="">Select a workspace type...</option>
                      {solutions.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">Tell Us More</label>
                    <textarea rows={4} className="w-full bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C85228] resize-none" placeholder="Describe your workspace requirements..."></textarea>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-white hover:bg-stone-200 text-stone-900 font-bold text-xs tracking-wider uppercase py-4 rounded-xl transition-colors">
                      Submit Enquiry
                    </button>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs tracking-wider uppercase py-4 rounded-xl transition-colors flex items-center justify-center space-x-2">
                      <MessageCircle size={16} />
                      <span>Contact via WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0908] py-12 px-4 md:px-12 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <span className="font-serif font-black text-2xl text-white tracking-tight">WORKSPACE</span>
            <p className="text-xs text-stone-500 max-w-sm mt-3">Premium office and flexible workspace solutions for businesses of every size — from single professionals to major corporate headquarters — in Baghdad.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 text-xs text-stone-400">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#C85228] mb-2">Contact</span>
              <p>+964 788 295 9696</p>
              <p>info@workspace.iq</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#C85228] mb-2">Location</span>
              <p>Building 70, Jordan Street</p>
              <p>Hay Al Jamia, Baghdad</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-[10px] text-stone-600">
          © 2026 WorkSpace Baghdad. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FloatingWhatsApp = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello WorkSpace Baghdad! I would like to inquire about your services.')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-[100] bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center group"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle size={24} />
    <span className="absolute right-16 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Chat with us!</span>
  </a>
);

const PadelShopPage = ({ onBack, onNavigateReservation, lang }: { onBack: () => void; onNavigateReservation: () => void; lang: Language }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#12100F] text-[#FAF7F2] flex flex-col">
    <header className="sticky top-0 z-40 bg-[#12100F]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} aria-label="Back to home" className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-stone-900 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center space-x-3">
          <PadelClubLogo className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg text-white leading-none">Padel Shop<span className="text-[#C85228]">.</span></span>
            <span className="text-[9px] uppercase tracking-widest text-[#E59866] font-semibold mt-1">Official Gear</span>
          </div>
        </div>
      </div>
      <button onClick={onNavigateReservation} className="px-4 py-2 rounded-full bg-[#C85228] hover:bg-[#d95d31] text-white text-xs font-bold tracking-wider transition-all shadow-lg flex items-center space-x-2">
        <CalendarPlus size={15} />
        <span className="hidden sm:inline">{lang === 'en' ? 'Book Court' : 'احجز الملعب'}</span>
      </button>
    </header>

    <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">{lang === 'en' ? 'Elevate Your Game.' : 'ارتقِ بمستوى لعبك.'}</h1>
        <p className="text-sm text-stone-400">
          {lang === 'en'
            ? 'Premium rackets, balls, and apparel available for purchase at the WorkSpace Pro Shop.'
            : 'مضارب وكرات وملابس رياضية مميزة متوفرة للشراء من متجر وورك سبيس.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PADEL_PRODUCTS.map((item) => (
          <div key={item.id} className="group bg-[#1A1817] rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#C85228]/40 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="relative h-64 w-full overflow-hidden bg-stone-950">
              <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1817] via-transparent to-black/30" />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">{item.category}</div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-white mb-2">{item.name}</h3>
                <p className="text-xs text-stone-400 mb-4">{item.desc}</p>
              </div>
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
                <span className="font-mono font-bold text-lg text-[#E59866] whitespace-nowrap">{item.price.toLocaleString()} IQD</span>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`I want to order: ${item.name} (${item.price.toLocaleString()} IQD)`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 font-bold text-xs transition-all flex items-center space-x-1"
                >
                  <MessageCircle size={14} />
                  <span>{lang === 'en' ? 'ORDER' : 'اطلب'}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
type Page = 'home' | 'menu' | 'padel' | 'meeting' | 'office' | 'padel-shop';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('workspace_cart') ?? '[]');
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    try { localStorage.setItem('workspace_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const handleAddToCart = (item: MenuItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
        if (item.id === id) {
          const next = item.quantity + delta;
          return next > 0 ? { ...item, quantity: next } : null;
        }
        return item;
      }).filter((x): x is CartItem => x !== null)
    );
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#12100F] font-sans text-stone-100 selection:bg-[#C85228] selection:text-white">
      <GlobalStyles />
      {currentPage === 'home' && <GatewayPage onSelectWorld={(id) => setCurrentPage(id)} lang={lang} setLang={setLang} />}
      {currentPage === 'menu' && <MenuPage onBack={() => setCurrentPage('home')} onNavigateReservation={(type) => setCurrentPage(type)} cart={cart} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} lang={lang} setLang={setLang} />}
      {(currentPage === 'padel' || currentPage === 'meeting') && <ReservationPage type={currentPage} onBack={() => setCurrentPage('home')} onNavigateShop={() => setCurrentPage('padel-shop')} lang={lang} setLang={setLang} />}
      {currentPage === 'office' && <OfficeSolutionsPage onBack={() => setCurrentPage('home')} lang={lang} setLang={setLang} />}
      {currentPage === 'padel-shop' && <PadelShopPage onBack={() => setCurrentPage('home')} onNavigateReservation={() => setCurrentPage('padel')} lang={lang} />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateQuantity} onBrowse={() => setCurrentPage('menu')} />
      <FloatingWhatsApp />
      <ChatBotWidget lang={lang} />
    </div>
  );
}
