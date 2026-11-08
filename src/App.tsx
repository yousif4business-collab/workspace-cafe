import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Coffee, CalendarPlus, MessageCircle, Briefcase, Sparkles,
  MapPin, Phone, ShoppingBag, Plus, Minus, X, Flame,
  ArrowLeft, ArrowUpRight, ChevronLeft, CheckCircle2,
  Building2, Globe, Layout, Wrench, Users
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
    const label =
      h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
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
const WorkSpaceOfficialLogo = ({ className = 'w-12 h-12' }: { className?: string }) => (
  <img
    src="/logo.png"
    alt="WorkSpace Cafe Logo"
    className={`${className} object-contain rounded-full`}
  />
);

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
      <img src="/logo.png" alt="WorkSpace Cafe" className="h-12 md:h-14 w-auto object-contain" />
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

// ─────────────────────────────────────────────────────────────
// GATEWAY (HOME)
// ─────────────────────────────────────────────────────────────
const GatewayPage = ({ onSelectWorld }: { onSelectWorld: (id: WorldId) => void }) => {
  const [hoveredPanel, setHoveredPanel] = useState<WorldId | null>(null);

  const worlds: World[] = [
    { id: 'menu', code: '01', title: 'SPECIALTY CAFE', tagline: 'Specialty Beans & 16oz Cups', badge: 'QR & SPECIALTY MENU', cta: 'ENTER MENU', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85', desc: 'Specialty Spanish lattes, layered matchas, and fresh bakery treats served in signature cups.' },
    { id: 'padel', code: '02', title: 'PADEL CLUB', tagline: 'Open-Air Rooftop Turf', badge: '60,000 IQD / HOUR', cta: 'BOOK COURT', image: encodeURI(IMAGES.padelRooftop), desc: "Play high above the city on Baghdad's premier rooftop terracotta padel court." },
    { id: 'meeting', code: '03', title: '6TH FL. SUITE', tagline: 'Inside The WorkSpace', badge: '25,000 IQD / HOUR', cta: 'RESERVE SUITE', image: encodeURI(IMAGES.meetingRoom), desc: 'Quiet 6th-floor boardroom with 4K smart display, ergonomic seating, and direct barista catering.' },
    {
      id: 'office',
      code: '04',
      title: 'BUSINESS SUITES',
      tagline: 'Premium Office Solutions',
      badge: 'FROM 1 DESK TO FULL FLOOR',
      cta: 'EXPLORE OFFICES',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      desc: 'Private offices, serviced suites, and enterprise floors in the heart of Baghdad. Scale your business with premium infrastructure.'
    }
  ];

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#12100F] text-white flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-40 px-4 md:px-12 py-3 md:py-5 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto"><WorkSpaceBrandHeader /></div>
        <div className="pointer-events-auto hidden sm:flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-stone-300 font-medium">{SITE.hours}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row w-full lg:h-full">
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
              className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out overflow-hidden flex flex-col justify-end p-6 md:p-12 pb-24 md:pb-28 lg:pb-24 min-h-[70vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/10 ${isHovered ? 'lg:flex-[1.5]' : isDimmed ? 'lg:flex-[0.75]' : 'lg:flex-1'}`}
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img src={world.image} alt={world.title} className={`w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-105 filter grayscale-0 brightness-90' : isDimmed ? 'scale-100 filter grayscale brightness-50 opacity-40' : 'scale-100 filter grayscale-[40%] brightness-75'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 pointer-events-none">
                <span className={`font-serif text-5xl md:text-7xl font-black transition-opacity duration-500 ${isHovered ? 'text-white/30' : 'text-white/10'}`}>{world.code}</span>
              </div>
              <div className="relative z-20 flex flex-col space-y-4 max-w-lg">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 backdrop-blur-md border border-white/20 text-white animate-float">{world.badge}</span>
                </div>
                <div>
                  <div className="text-xs tracking-[0.25em] uppercase text-[#E59866] font-bold mb-1">{world.tagline}</div>
                  <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-white leading-tight">{world.title}</h2>
                </div>
                <p className={`text-xs md:text-sm text-stone-300 font-light leading-relaxed line-clamp-2 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-80 max-h-12'}`}>{world.desc}</p>
                <div className="pt-2">
                  <span className={`inline-flex px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase border transition-all duration-300 items-center space-x-2 ${isHovered ? 'bg-white text-stone-900 border-white shadow-xl translate-x-1' : 'bg-black/40 text-white border-white/40 backdrop-blur-sm'}`}>
                    <span>{world.cta}</span><ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="relative lg:absolute bottom-0 inset-x-0 z-30 px-4 md:px-12 py-3 bg-black/80 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
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
};

const MenuPage = ({ onBack, onNavigateReservation, cart, onAddToCart, onOpenCart }: MenuPageProps) => {
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
      <header className="sticky top-0 z-40 bg-[#12100F]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button onClick={onBack} aria-label="Back to home" className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-stone-900 transition-colors"><ArrowLeft size={16} /></button>
          <WorkSpaceBrandHeader onHomeClick={onBack} />
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button onClick={() => onNavigateReservation('padel')} className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-stone-300"><span>🎾 Padel Court</span></button>
          <button onClick={() => onNavigateReservation('meeting')} className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-stone-300"><span>💼 6th Fl. Room</span></button>
          <button onClick={onOpenCart} aria-label={`Open cart (${cartTotalCount} items)`} className="relative px-4 py-2 rounded-full bg-[#C85228] hover:bg-[#d95d31] text-white text-xs font-bold tracking-wider flex items-center space-x-2 shadow-lg">
            <ShoppingBag size={15} /><span>ORDER</span>
            {cartTotalCount > 0 && <span className="w-5 h-5 rounded-full bg-white text-stone-900 font-bold flex items-center justify-center text-[10px]">{cartTotalCount}</span>}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C85228]">BAGHDAD SPECIALTY BAR & BAKERY</span>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-white mt-1 mb-3">The WorkSpace Menu</h1>
          <p className="text-xs md:text-sm text-stone-300 font-light leading-relaxed">Crafted with Colombian, Ethiopian, and Brazilian micro-lots. Every iced sip is served in our signature printed tumbler; hot coffees in our bean-patterned paper cup.</p>
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
                <Icon size={14} className={isSelected ? 'text-[#C85228]' : 'text-stone-400'} /><span>{cat.name}</span>
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
};

const ReservationPage = ({ type, onBack }: ReservationPageProps) => {
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
        <div className="text-right text-xs text-stone-400 hidden sm:block">
          <div>{SITE.hours}</div><div className="text-[#C85228] font-bold">{SITE.location}</div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C85228]">{isPadel ? 'OPEN-AIR ROOFTOP TURF' : '6TH FLOOR EXECUTIVE SUITE'}</span>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-white mt-1 mb-2">{isPadel ? 'Book Your Padel Court' : 'Reserve 6th Floor Boardroom'}</h1>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <CalendarPlus size={16} className="text-[#C85228] mb-1" /><div className="text-xs font-bold text-white">Opening Hours</div><div className="text-[11px] text-stone-400">{SITE.hours}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <MapPin size={16} className="text-[#C85228] mb-1" /><div className="text-xs font-bold text-white">Location</div><div className="text-[11px] text-stone-400">Hay Al-Jamia, Baghdad</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
              <Phone size={16} className="text-[#C85228] mb-1" /><div className="text-xs font-bold text-white">Direct Line</div>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-[11px] text-stone-400 font-mono hover:text-white transition-colors">{WHATSAPP_DISPLAY}</a>
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
const OfficeSolutionsPage = ({ onBack }: { onBack: () => void }) => {
  const solutions = [
    { icon: Building2, title: 'Private Offices', desc: 'Dedicated, locked suites for teams that need privacy and focus.', price: '1,500,000 IQD', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
    { icon: Briefcase, title: 'Serviced Offices', desc: 'Fully managed, move-in ready with admin and IT support.', price: '2,000,000 IQD', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80' },
    { icon: Users, title: 'Enterprise Suites', desc: 'Entire floors and bespoke configurations for large teams.', price: 'Custom Pricing', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
    { icon: Globe, title: 'Virtual Offices', desc: 'A prestigious Baghdad address without the physical space.', price: '250,000 IQD', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80' },
    { icon: Layout, title: 'Meeting Rooms', desc: 'Fully equipped rooms available on demand.', price: '50,000 IQD', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80' },
    { icon: Wrench, title: 'Custom Solutions', desc: 'Unserviced raw space for tenants who want full control.', price: 'Custom Pricing', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  ];

  const amenities = [
    'Prime Baghdad Location',
    'High-Speed Connectivity',
    'Rooftop Padel Court',
    'F&B Café Bar',
    '24/7 Security & Access',
    'Business-Ready Infrastructure'
  ];

  return (
    <div className="min-h-screen bg-[#12100F] text-[#FAF7F2] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#12100F]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button onClick={onBack} aria-label="Back to home" className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-stone-900 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center space-x-3">
            <WorkSpaceOfficialLogo className="h-10 w-auto" />
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg text-white leading-none">work space<span className="text-[#C85228]">.</span></span>
              <span className="text-[9px] uppercase tracking-widest text-[#E59866] font-semibold mt-1">Business Suites</span>
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-stone-400 hidden sm:block">
          <div>{SITE.hours}</div>
          <div className="text-[#C85228] font-bold">{SITE.location}</div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8">
        {/* Editorial Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#E59866] mb-4">
            WORKSPACE IQ
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-white mt-2 mb-6 leading-[1.1]">
            Built for Serious Business <br />
            <span className="text-[#C85228] italic">At Every Scale.</span>
          </h1>
          <p className="text-sm md:text-base text-stone-400 font-light leading-relaxed max-w-xl mx-auto">
            From a single desk to an entire corporate floor. WorkSpace provides the environment, address, and infrastructure your business needs to thrive in Baghdad.
          </p>
        </div>

        {/* Premium Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
            <div
              key={i}
              className="group relative h-[380px] rounded-3xl overflow-hidden border border-white/10 hover:border-[#C85228]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(200,82,40,0.2)] animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Background Image & Overlay */}
              <img src={sol.image} alt={sol.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12100F] via-[#12100F]/80 to-transparent" />

              {/* Card Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#E59866] group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Icon size={22} />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-2xl text-white mb-2">{sol.title}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed mb-6 max-w-[90%]">{sol.desc}</p>

                  {/* Fixed Footer Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">Starting From</span>
                      <span className="text-sm font-mono font-bold text-[#C85228]">{sol.price}</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C85228] group-hover:border-[#C85228] transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>

        {/* Cinematic Amenities Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 mb-16 animate-scale-in">
          {/* Background image of the rooftop/cafe */}
          <img src={encodeURI(IMAGES.padelRooftop)} alt="WorkSpace Amenities" className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#12100F] via-[#12100F]/80 to-transparent" />

          <div className="relative z-10 p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-4 leading-tight">Beyond the Office.</h2>
              <p className="text-sm text-stone-300 font-light leading-relaxed">
                Work doesn't stop at your desk. Our premium lifestyle and networking features set WorkSpace apart as Baghdad's ultimate business destination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
              {amenities.map((am, i) => (
                <div key={i} className="flex items-center space-x-3 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <CheckCircle2 size={16} className="text-[#C85228] shrink-0" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto pb-12 animate-fade-in-up delay-200">
          <h3 className="text-3xl font-serif font-black text-white mb-4">Ready to find your workspace?</h3>
          <p className="text-sm text-stone-400 mb-8">Schedule a site visit or speak directly with our enterprise team.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I would like to arrange a site visit for WorkSpace Business Suites.')}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center space-x-2">
              <MessageCircle size={18} />
              <span>ARRANGE VIA WHATSAPP</span>
            </a>
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wider uppercase transition-all border border-white/10 flex items-center justify-center space-x-2">
              <Phone size={16} />
              <span>CALL US</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
type Page = 'home' | 'menu' | 'padel' | 'meeting' | 'office';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('workspace_cart') ?? '[]');
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    <div className="min-h-screen bg-[#12100F] font-sans text-stone-100 selection:bg-[#C85228] selection:text-white">
      <GlobalStyles />
      {currentPage === 'home' && <GatewayPage onSelectWorld={(id) => setCurrentPage(id)} />}
      {currentPage === 'menu' && <MenuPage onBack={() => setCurrentPage('home')} onNavigateReservation={(type) => setCurrentPage(type)} cart={cart} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} />}
      {(currentPage === 'padel' || currentPage === 'meeting') && <ReservationPage type={currentPage} onBack={() => setCurrentPage('home')} />}
      {currentPage === 'office' && <OfficeSolutionsPage onBack={() => setCurrentPage('home')} />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateQuantity} onBrowse={() => setCurrentPage('menu')} />
    </div>
  );
}
