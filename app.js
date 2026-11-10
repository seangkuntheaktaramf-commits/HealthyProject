/**
 * «សុខភាពខ្ញុំ» - Modern Khmer Fitness & Calorie Tracker
 * Client-Side Application Engine (Vanilla ES6+)
 * 100% Khmer Localization & Medical Logic
 */

// =============================================================================
// 1. CONFIGURATION & STATE MANAGEMENT
// =============================================================================
const STORAGE_KEYS = {
  THEME: 'sokhapheap_theme',
  GOAL: 'sokhapheap_goal',
  MEALS: 'sokhapheap_meals',
  WORKOUTS: 'sokhapheap_workouts',
  WATER: 'sokhapheap_water',
  SLEEP_CURRENT: 'sokhapheap_sleep_current',
  SLEEP_HISTORY: 'sokhapheap_sleep_history',
  PROFILE: 'sokhapheap_profile',
  HISTORY: 'sokhapheap_history',
  COMMUNITY_POSTS: 'sokhapheap_community_posts',
};

// Initial default state
const AppState = {
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
  goal: parseInt(localStorage.getItem(STORAGE_KEYS.GOAL), 10) || 2000,
  profile: {
    gender: 'male', // 'male' or 'female'
    age: 45,
    height: 168,
    weight: 65,
  },
  meals: [],
  workouts: [],
  water: parseInt(localStorage.getItem(STORAGE_KEYS.WATER), 10) || 0,
  sleepCurrent: {
    bedtime: '22:30',
    wakeTime: '06:30',
    napStart: '12:30',
    napEnd: '13:00',
  },
  sleepHistory: [],
  communityPosts: [],
  activeTab: 'tabDashboard',
  activeFoodMenu: 'breakfast',
  activeAnalyticsPeriod: 'daily',
  history: {},
};

// =============================================================================
// 2. KHMER NUMBER & DATE UTILITIES
// =============================================================================
const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];
const KHMER_DAYS = [
  'អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'
];

function toKhmerNumber(num) {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (digit) => KHMER_DIGITS[parseInt(digit, 10)]);
}

function formatKhmerLiveDate() {
  const now = new Date();
  const dayName = KHMER_DAYS[now.getDay()];
  const dayNum = String(now.getDate()).padStart(2, '0');
  const monthName = KHMER_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  return `ថ្ងៃ${dayName} ទី ${toKhmerNumber(dayNum)} ${monthName} ${toKhmerNumber(year)}`;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =============================================================================
// 3. MASTER KHMER FOOD PRESETS (5 SPECIFIC MENUS)
// =============================================================================

// Menu 1: Breakfast (19 items)
const MENU_BREAKFAST_ITEMS = [
  { id: 'b_1', name: 'កាហ្វេខ្មៅ', kcal: 5, p: 0.3, c: 0.5, f: 0 },
  { id: 'b_2', name: 'កាហ្វេទឹកដោះគោ', kcal: 180, p: 3, c: 26, f: 7 },
  { id: 'b_3', name: 'កាហ្វេទឹកដោះគោទឹកកក', kcal: 220, p: 4, c: 32, f: 8 },
  { id: 'b_4', name: 'ទឹកដោះគោឆៅ', kcal: 150, p: 8, c: 12, f: 8 },
  { id: 'b_5', name: 'ពងទា (ស្ងោរ/ចំហុយ)', kcal: 80, p: 6, c: 1, f: 6 },
  { id: 'b_6', name: 'បាយសាច់ជ្រូក ពងទាចៀនមួយគ្រាប់', kcal: 550, p: 24, c: 68, f: 20 },
  { id: 'b_7', name: 'គុយទាវប្រហិតសាច់គោ', kcal: 420, p: 22, c: 54, f: 12 },
  { id: 'b_8', name: 'មីឆាសាច់គោ', kcal: 520, p: 25, c: 65, f: 18 },
  { id: 'b_9', name: 'នំបញ្ចុកសម្លខ្មែរ', kcal: 350, p: 15, c: 50, f: 9 },
  { id: 'b_10', name: 'បបរគ្រឿងសាច់ត្រី', kcal: 300, p: 18, c: 45, f: 5 },
  { id: 'b_11', name: 'បបរស ត្រីងៀត', kcal: 320, p: 20, c: 48, f: 6 },
  { id: 'b_12', name: 'នំប៉័ងដាក់សាច់', kcal: 480, p: 20, c: 58, f: 18 },
  { id: 'b_13', name: 'នំប៉ោង', kcal: 260, p: 5, c: 36, f: 11 },
  { id: 'b_14', name: 'បាយស', kcal: 200, p: 4, c: 45, f: 0.5, portionNote: '១ ចានចង្កឹះ' },
  { id: 'b_15', name: 'ពងទាចៀន/ពងមាន់ចៀន', kcal: 120, p: 7, c: 1, f: 10, portionNote: '១ ពង' },
  { id: 'b_16', name: 'សាច់ជ្រូកចៀន/សាច់គោចៀន', kcal: 340, p: 28, c: 4, f: 24, portionNote: '១ ចានតូច' },
  { id: 'b_17', name: 'សាច់មាន់ចៀន/ទាចៀន', kcal: 360, p: 26, c: 8, f: 25, portionNote: '១ ចានតូច' },
  { id: 'b_18', name: 'ត្រីងៀត', kcal: 210, p: 32, c: 0, f: 9, portionNote: '១ ចំណែក' },
  { id: 'b_19', name: 'សាច់គោអាំង', kcal: 280, p: 34, c: 2, f: 15, portionNote: '១ ចានតូច' },
  { id: 'b_water', name: 'ទឹកសុទ្ធ', kcal: 0, p: 0, c: 0, f: 0, portionNote: '១ កែវ (250 ml)' },
];

// Menu 2: Lunch (23 items)
const MENU_LUNCH_ITEMS = [
  { id: 'l_1', name: 'បាយស', kcal: 200, p: 4, c: 45, f: 0.5, portionNote: '១ ចានចង្កឹះ' },
  { id: 'l_2', name: 'សម្លស្ងោរជ្រក់ក្បាលត្រី', kcal: 180, p: 22, c: 8, f: 6 },
  { id: 'l_3', name: 'សម្លម្ជូរគ្រឿងសាច់គោ', kcal: 260, p: 24, c: 12, f: 13 },
  { id: 'l_4', name: 'សម្លកកូរ', kcal: 220, p: 16, c: 22, f: 8 },
  { id: 'l_5', name: 'សម្លស្ងោរឆ្អឹងជំនីជ្រូក', kcal: 280, p: 22, c: 10, f: 16 },
  { id: 'l_6', name: 'សម្លខត្រី', kcal: 240, p: 26, c: 14, f: 9 },
  { id: 'l_7', name: 'សម្លខសាច់ជ្រូកពងទា', kcal: 380, p: 26, c: 20, f: 22 },
  { id: 'l_8', name: 'សម្លការី', kcal: 450, p: 20, c: 26, f: 30 },
  { id: 'l_9', name: 'សម្លប្រហើរ', kcal: 160, p: 14, c: 16, f: 4 },
  { id: 'l_10', name: 'សម្លម្ជូរយួន', kcal: 190, p: 18, c: 15, f: 6 },
  { id: 'l_11', name: 'ឆាខ្ញីសាច់មាន់/ជ្រូក', kcal: 290, p: 26, c: 12, f: 15 },
  { id: 'l_12', name: 'ឆាគ្រឿងសាច់គោ/មាន់', kcal: 310, p: 28, c: 14, f: 16 },
  { id: 'l_13', name: 'ឆាសាច់ជ្រូកជាមួយបន្លែ', kcal: 270, p: 20, c: 16, f: 14 },
  { id: 'l_14', name: 'ពងទាចៀន/ពងមាន់ចៀន', kcal: 120, p: 7, c: 1, f: 10 },
  { id: 'l_15', name: 'សាច់ជ្រូកចៀន/សាច់គោចៀន', kcal: 340, p: 28, c: 4, f: 24 },
  { id: 'l_16', name: 'សាច់មាន់ចៀន/ទាចៀន', kcal: 360, p: 26, c: 8, f: 25 },
  { id: 'l_17', name: 'សាច់អាំង (សាច់គោ/មាន់/ត្រី)', kcal: 250, p: 30, c: 4, f: 12 },
  { id: 'l_18', name: 'សាច់ជ្រូកខ្វៃ', kcal: 420, p: 22, c: 6, f: 34 },
  { id: 'l_19', name: 'មាន់/ទាខ្វៃ', kcal: 390, p: 26, c: 6, f: 29 },
  { id: 'l_20', name: 'ប្រហុកចំហុយ រួមជាមួយបន្លែស្រស់', kcal: 190, p: 18, c: 10, f: 9 },
  { id: 'l_21', name: 'ត្រីងៀត', kcal: 210, p: 32, c: 0, f: 9 },
  { id: 'l_22', name: 'មាន់ដុត', kcal: 300, p: 32, c: 4, f: 17 },
  { id: 'l_23', name: 'សាច់គោអាំង', kcal: 280, p: 34, c: 2, f: 15 },
  { id: 'l_water', name: 'ទឹកសុទ្ធ', kcal: 0, p: 0, c: 0, f: 0, portionNote: '១ កែវ (250 ml)' },
];

// Menu 3: Dinner (23 items mirrored from Menu 2)
const MENU_DINNER_ITEMS = MENU_LUNCH_ITEMS.map((item) => ({
  ...item,
  id: item.id.replace('l_', 'd_'),
}));

// Menu 4: Snacks (6 items)
const MENU_SNACKS_ITEMS = [
  { id: 's_1', name: 'ផ្លែប៉ោម', kcal: 80, p: 0.5, c: 21, f: 0.3, portionNote: '១ ផ្លែ' },
  { id: 's_2', name: 'ផ្លែចេក', kcal: 90, p: 1.2, c: 23, f: 0.3, portionNote: '១ ផ្លែ' },
  { id: 's_3', name: 'ផ្លែក្រូច', kcal: 60, p: 1.2, c: 15, f: 0.2, portionNote: '១ ផ្លែ' },
  { id: 's_4', name: 'គ្រាប់អាល់ម៉ុន', kcal: 160, p: 6, c: 6, f: 14, portionNote: '១ ក្តាប់ដៃ' },
  { id: 's_5', name: 'យ៉ាអួ', kcal: 100, p: 5, c: 14, f: 3, portionNote: '១ កំប៉ុង' },
  { id: 's_6', name: 'នំផ្សេងៗ', kcal: 250, p: 4, c: 35, f: 11, portionNote: '១ ចំណែក' },
  { id: 's_water', name: 'ទឹកសុទ្ធ', kcal: 0, p: 0, c: 0, f: 0, portionNote: '១ កែវ (250 ml)' },
];

// Menu 5: Party & Celebration (Drinks + Appetizers)
const MENU_PARTY_ITEMS = [
  { id: 'p_1', name: 'ស្រាក្រហម', kcal: 125, p: 0.1, c: 4, f: 0, portionNote: '១ កែវ' },
  { id: 'p_2', name: 'ស្រាវីស្គី', kcal: 105, p: 0, c: 0, f: 0, portionNote: '១ កែវ' },
  { id: 'p_3', name: 'ស្រាបៀរ', kcal: 150, p: 1.5, c: 13, f: 0, portionNote: '១ កំប៉ុង' },
  { id: 'p_4', name: 'ភេសជ្ជៈផ្អែមៗ', kcal: 140, p: 0, c: 35, f: 0, portionNote: '១ កំប៉ុង' },
  { id: 'p_5', name: 'ឆាគ្រឿង (ម្ហូបក្លែម)', kcal: 310, p: 28, c: 14, f: 16 },
  { id: 'p_6', name: 'ឆាសាច់ជ្រូកជាមួយបន្លែ (ម្ហូបក្លែម)', kcal: 270, p: 20, c: 16, f: 14 },
  { id: 'p_7', name: 'ពងចៀន (ម្ហូបក្លែម)', kcal: 120, p: 7, c: 1, f: 10 },
  { id: 'p_8', name: 'សាច់ចៀន (ម្ហូបក្លែម)', kcal: 340, p: 28, c: 4, f: 24 },
  { id: 'p_9', name: 'សាច់ខ្វៃ (ម្ហូបក្លែម)', kcal: 420, p: 22, c: 6, f: 34 },
  { id: 'p_10', name: 'ប្រហុកចំហុយ (ម្ហូបក្លែម)', kcal: 190, p: 18, c: 10, f: 9 },
  { id: 'p_11', name: 'ត្រីងៀត (ម្ហូបក្លែម)', kcal: 210, p: 32, c: 0, f: 9 },
  { id: 'p_12', name: 'មាន់ដុត (ម្ហូបក្លែម)', kcal: 300, p: 32, c: 4, f: 17 },
  { id: 'p_13', name: 'សាច់គោអាំង (ម្ហូបក្លែម)', kcal: 280, p: 34, c: 2, f: 15 },
  { id: 'p_water', name: 'ទឹកសុទ្ធ', kcal: 0, p: 0, c: 0, f: 0, portionNote: '១ កែវ (250 ml)' },
];

const ALL_MENUS = {
  breakfast: MENU_BREAKFAST_ITEMS,
  lunch: MENU_LUNCH_ITEMS,
  dinner: MENU_DINNER_ITEMS,
  snacks: MENU_SNACKS_ITEMS,
  party: MENU_PARTY_ITEMS,
};

// =============================================================================
// 4. INITIALIZATION & DATA SEEDING
// =============================================================================
function initAppState() {
  // Load profile
  const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (savedProfile) {
    try {
      AppState.profile = Object.assign(AppState.profile, JSON.parse(savedProfile));
    } catch (e) {}
  }

  // Load meals
  const savedMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
  if (savedMeals) {
    try {
      AppState.meals = JSON.parse(savedMeals);
    } catch (e) {
      AppState.meals = [];
    }
  } else {
    // Seed initial realistic Khmer meals
    const today = new Date().toISOString().split('T')[0];
    AppState.meals = [
      {
        id: 'm_' + Date.now() + '_1',
        name: 'កាហ្វេទឹកដោះគោ',
        kcal: 180,
        category: 'breakfast',
        portion: '១ កែវ (1x)',
        protein: 3,
        carbs: 26,
        fat: 7,
        date: today,
      },
      {
        id: 'm_' + Date.now() + '_2',
        name: 'បាយសាច់ជ្រូក ពងទាចៀនមួយគ្រាប់',
        kcal: 550,
        category: 'breakfast',
        portion: '១ ចាន (1x)',
        protein: 24,
        carbs: 68,
        fat: 20,
        date: today,
      },
      {
        id: 'm_' + Date.now() + '_3',
        name: 'សម្លម្ជូរគ្រឿងសាច់គោ',
        kcal: 260,
        category: 'lunch',
        portion: '១ ចាន (1x)',
        protein: 24,
        carbs: 12,
        fat: 13,
        date: today,
      },
      {
        id: 'm_' + Date.now() + '_4',
        name: 'បាយស',
        kcal: 200,
        category: 'lunch',
        portion: '១ ចានចង្កឹះ (1x)',
        protein: 4,
        carbs: 45,
        fat: 0.5,
        date: today,
      },
    ];
    saveMeals();
  }

  // Load workouts
  const savedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  if (savedWorkouts) {
    try {
      AppState.workouts = JSON.parse(savedWorkouts);
    } catch (e) {
      AppState.workouts = [];
    }
  } else {
    const today = new Date().toISOString().split('T')[0];
    AppState.workouts = [
      {
        id: 'w_' + Date.now() + '_1',
        name: 'ដើរលឿន (Brisk Walk)',
        minutes: 30,
        kcal: 150,
        date: today,
      },
    ];
    saveWorkouts();
  }

  // Load sleep current & history
  const savedSleepCurrent = localStorage.getItem(STORAGE_KEYS.SLEEP_CURRENT);
  if (savedSleepCurrent) {
    try {
      AppState.sleepCurrent = JSON.parse(savedSleepCurrent);
    } catch (e) {}
  }

  const savedSleepHistory = localStorage.getItem(STORAGE_KEYS.SLEEP_HISTORY);
  if (savedSleepHistory) {
    try {
      AppState.sleepHistory = JSON.parse(savedSleepHistory);
    } catch (e) {
      AppState.sleepHistory = [];
    }
  } else {
    // Generate initial sleep history
    AppState.sleepHistory = generateInitialSleepHistory();
    saveSleepHistory();
  }

  // Load Community Posts
  const savedCommunity = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
  if (savedCommunity) {
    try {
      AppState.communityPosts = JSON.parse(savedCommunity);
    } catch (e) {
      AppState.communityPosts = [];
    }
  } else {
    AppState.communityPosts = generateInitialCommunityPosts();
    saveCommunityPosts();
  }
  purgeOldCommunityPosts();

  // Load History for Analytics
  const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (savedHistory) {
    try {
      AppState.history = JSON.parse(savedHistory);
    } catch (e) {
      AppState.history = generateMockAnalyticsHistory();
    }
  } else {
    AppState.history = generateMockAnalyticsHistory();
    saveHistory();
  }

  // Set inputs to match state
  const bedtimeEl = document.getElementById('sleepBedtime');
  const wakeTimeEl = document.getElementById('sleepWakeTime');
  const napStartEl = document.getElementById('napStartTime');
  const napEndEl = document.getElementById('napEndTime');

  if (bedtimeEl) bedtimeEl.value = AppState.sleepCurrent.bedtime;
  if (wakeTimeEl) wakeTimeEl.value = AppState.sleepCurrent.wakeTime;
  if (napStartEl) napStartEl.value = AppState.sleepCurrent.napStart;
  if (napEndEl) napEndEl.value = AppState.sleepCurrent.napEnd;
}

function generateInitialSleepHistory() {
  const records = [];
  const today = new Date();
  const notes = [
    { dur: 8.5, label: 'គ្រប់គ្រាន់ល្អប្រសើរ 🎉' },
    { dur: 7.8, label: 'គ្រប់គ្រាន់ 🎉' },
    { dur: 8.0, label: 'គ្រប់គ្រាន់ 🎉' },
    { dur: 6.2, label: 'មធ្យម ℹ️' },
    { dur: 7.5, label: 'គ្រប់គ្រាន់ 🎉' },
  ];
  for (let i = 0; i < notes.length; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (i + 1));
    const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;
    records.push({
      dateStr: dayStr,
      totalHours: notes[i].dur,
      statusLabel: notes[i].label,
    });
  }
  return records;
}

function generateMockAnalyticsHistory() {
  const hist = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const goal = AppState.goal;
    const intake = Math.floor(1600 + Math.random() * 450);
    const burned = Math.floor(180 + Math.random() * 260);
    const net = goal - intake + burned;
    hist[dateKey] = { goal, intake, burned, net, sleep: 7.0 + Math.random() * 1.8 };
  }
  return hist;
}

// Persistence helpers
function saveMeals() {
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(AppState.meals));
  updateDailyHistorySnapshot();
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(AppState.workouts));
  updateDailyHistorySnapshot();
}

function saveGoal(newGoal) {
  AppState.goal = parseInt(newGoal, 10) || 2000;
  localStorage.setItem(STORAGE_KEYS.GOAL, AppState.goal);
  updateDailyHistorySnapshot();
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(AppState.profile));
}

function saveWater() {
  localStorage.setItem(STORAGE_KEYS.WATER, AppState.water);
}

function saveSleepCurrent() {
  localStorage.setItem(STORAGE_KEYS.SLEEP_CURRENT, JSON.stringify(AppState.sleepCurrent));
}

function saveSleepHistory() {
  localStorage.setItem(STORAGE_KEYS.SLEEP_HISTORY, JSON.stringify(AppState.sleepHistory));
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(AppState.history));
}

function updateDailyHistorySnapshot() {
  const today = new Date().toISOString().split('T')[0];
  const intake = AppState.meals.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const burned = AppState.workouts.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const net = AppState.goal - intake + burned;
  AppState.history[today] = {
    goal: AppState.goal,
    intake,
    burned,
    net,
    sleep: 8.0,
  };
  saveHistory();
}

// =============================================================================
// 5. RENDERING & UI UPDATES
// =============================================================================


// =============================================================================
// COMMUNITY POSTS STATE & WEEKLY PURGE LOGIC
// =============================================================================
let currentPostImageBase64 = null;

function saveCommunityPosts() {
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(AppState.communityPosts));
}

function purgeOldCommunityPosts(forceReset = false) {
  // Purge posts older than 7 days (7 * 24 * 60 * 60 * 1000 ms)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const beforeLen = AppState.communityPosts.length;
  if (forceReset) {
    // Weekly Reset: removes user posts to reset the 3-post quota for the new week
    AppState.communityPosts = AppState.communityPosts.filter((p) => !p.isMyPost && p.timestamp >= sevenDaysAgo);
  } else {
    AppState.communityPosts = AppState.communityPosts.filter((p) => p.timestamp >= sevenDaysAgo);
  }
  if (AppState.communityPosts.length !== beforeLen) {
    saveCommunityPosts();
  }
}

function generateInitialCommunityPosts() {
  const now = Date.now();
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'post_seed_1',
      isMyPost: false,
      userName: 'សុខ វិបុល',
      userAvatar: '🏃‍♂️',
      text: 'ព្រឹកនេះបានរត់ត្រឹកៗ ៥ គីឡូម៉ែត្រនៅសួនច្បារវត្តភ្នំ អារម្មណ៍ស្រស់ថ្លា និងមានថាមពលពេញមួយថ្ងៃ! 💪🔥 #រត់ពេលព្រឹក #សុខភាពខ្ញុំ #ហាត់ប្រាណ',
      imageData: null,
      timestamp: now - 3600 * 1000 * 3, // 3 hours ago
      dateStr: todayStr,
      timeStr: '៣ ម៉ោងមុន',
      likes: 15,
      isLiked: false,
    },
    {
      id: 'post_seed_2',
      isMyPost: false,
      userName: 'លីណា វ័យ ៤២ ឆ្នាំ',
      userAvatar: '🧘‍♀️',
      text: 'បានហាត់យូហ្គា និងពត់ពែនខ្លួន ៤០ នាទី ជួយបំបាត់ការឈឺចង្កេះ និងសម្រួលសន្លាក់បានយ៉ាងអស្ចារ្យ។ កុំភ្លេចថែរក្សាសុខភាពទាំងអស់គ្នាណា! ✨🌿 #Yoga #វ័យ៤០ឡើង #សុខភាព',
      imageData: null,
      timestamp: now - 3600 * 1000 * 18, // 18 hours ago
      dateStr: todayStr,
      timeStr: 'ម្សិលមិញ',
      likes: 22,
      isLiked: false,
    },
  ];
}

// Render Water Hydration Monitor on Dashboard
function renderWaterDashboardMonitor() {
  const subEl = document.getElementById('waterMonitorSubtitle');
  const mlEl = document.getElementById('waterDashboardMlText');
  const barEl = document.getElementById('waterDashboardProgressBar');
  const glassesRow = document.getElementById('waterDashboardGlassesRow');
  const tipEl = document.getElementById('waterStatusTipText');

  const maxGlasses = 8;
  const currentGlasses = AppState.water;
  const currentMl = currentGlasses * 250;

  if (subEl) subEl.textContent = `ផឹកបាន ${toKhmerNumber(currentGlasses)} / ៨ កែវ (~២,០០០ ml)`;
  if (mlEl) mlEl.textContent = `${currentMl.toLocaleString()} / 2,000 ml`;
  if (barEl) barEl.style.width = `${Math.min(100, (currentGlasses / maxGlasses) * 100)}%`;

  if (glassesRow) {
    glassesRow.innerHTML = '';
    for (let i = 1; i <= maxGlasses; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn-glass-quick ${i <= currentGlasses ? 'filled' : ''}`;
      btn.innerHTML = i <= currentGlasses ? '💧' : '🥛';
      btn.title = `កែវទី ${toKhmerNumber(i)} (250 ml)`;
      btn.addEventListener('click', () => {
        AppState.water = AppState.water === i ? i - 1 : i;
        saveWater();
        renderAll();
        showToast(`កម្រិតជាតិទឹក៖ ${(AppState.water * 250).toLocaleString()} ml`, 'info');
      });
      glassesRow.appendChild(btn);
    }
  }

  if (tipEl) {
    if (currentGlasses === 0) {
      tipEl.textContent = '💡 ចាប់ផ្តើមថ្ងៃថ្មីដោយពិសាទឹក ១-២ កែវ ដើម្បីដាស់ប្រព័ន្ធរំលាយអាហារ។';
    } else if (currentGlasses <= 3) {
      tipEl.textContent = '⚠️ កម្រិតជាតិទឹកទាបពេក! សូមបន្តពិសាទឹកឱ្យបានច្រើនដើម្បីការពារការខ្សោះជាតិទឹក។';
    } else if (currentGlasses <= 7) {
      tipEl.textContent = '💧 ល្អណាស់! អ្នកកំពុងបំពេញជាតិទឹកបានល្អ បន្តពិសាបន្ថែមទៀតដើម្បីសម្រេចគោលដៅ។';
    } else {
      tipEl.textContent = '🎉 អស្ចារ្យណាស់! អ្នកបានសម្រេចគោលដៅជាតិទឹក ២,០០០ ml ពេញលេញសម្រាប់ថ្ងៃនេះ!';
    }
  }
}

// Render Community Feed (for both Dashboard and Food Tab)
function renderCommunityFeed() {
  purgeOldCommunityPosts();

  const dashFeedList = document.getElementById('dashboardCommunityFeedList');
  const foodFeedList = document.getElementById('communityFeedList');
  
  const dashQuotaNum = document.getElementById('dashboardUserQuotaNum');
  const foodQuotaNum = document.getElementById('dailyPostCountNum');
  
  const dashQuotaTag = document.getElementById('dashboardQuotaTag');
  const foodQuotaTag = document.getElementById('foodQuotaTag');
  
  const dashSubmitBtn = document.getElementById('btnDashboardSubmitPost');
  const foodSubmitBtn = document.getElementById('btnSubmitPost');
  
  const feedTotalCountText = document.getElementById('feedTotalCountText');

  // Rule: Max 3 posts per person (ក្នុងមួយនាក់អាច Post បានតែ ៣ ដងគត់)
  const myPosts = AppState.communityPosts.filter((p) => p.isMyPost);
  const myCount = myPosts.length;
  const remaining = Math.max(0, 3 - myCount);
  const isQuotaFull = myCount >= 3;

  // Update Quota Badges (កូតារបស់អ្នក៖ X/៣ ដង)
  if (dashQuotaNum) dashQuotaNum.textContent = toKhmerNumber(myCount);
  if (foodQuotaNum) foodQuotaNum.textContent = toKhmerNumber(myCount);
  if (feedTotalCountText) feedTotalCountText.textContent = toKhmerNumber(AppState.communityPosts.length);

  // Update Quota Tags
  [dashQuotaTag, foodQuotaTag].forEach((tag) => {
    if (tag) {
      if (isQuotaFull) {
        tag.textContent = '🔒 គ្រប់កូតា ៣ ដងគត់';
        tag.classList.add('full');
      } else {
        tag.textContent = `នៅសល់ ${toKhmerNumber(remaining)} ដង`;
        tag.classList.remove('full');
      }
    }
  });

  // Update Submit Buttons
  [dashSubmitBtn, foodSubmitBtn].forEach((btn) => {
    if (btn) {
      if (isQuotaFull) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.innerHTML = '<span>🔒</span> គ្រប់កូតា ៣ ដងគត់ហើយ';
        btn.title = 'ក្នុងម្នាក់អាចបង្ហោះបានតែ ៣ ដងគត់ (ប្រព័ន្ធសម្អាតរូបភាពចោល ១ អាទិត្យម្តង)';
      } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = '<span>📤</span> ចែករំលែក (Post Now)';
        btn.title = `នៅសល់កូតា ${toKhmerNumber(remaining)} ដង`;
      }
    }
  });

  // Build Feed HTML
  const feedHtml = buildCommunityFeedHtml();

  if (dashFeedList) dashFeedList.innerHTML = feedHtml;
  if (foodFeedList) foodFeedList.innerHTML = feedHtml;

  // Attach post interaction listeners
  setupPostCardListeners();
}

function buildCommunityFeedHtml() {
  if (AppState.communityPosts.length === 0) {
    return `
      <div class="empty-meal-msg" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <span>📸 មិនទាន់មានការបង្ហោះសកម្មភាពហាត់ប្រាណនៅឡើយទេ</span>
        <span style="font-size: 0.78rem;">(សូមក្លាយជាអ្នកដំបូងគេដែលចែករំលែករូបភាព និងការខិតខំហាត់ប្រាណ!)</span>
      </div>
    `;
  }

  return AppState.communityPosts.map((post) => {
    const formattedText = escapeHtml(post.text).replace(
      /(#[^\s#]+)/g,
      '<span class="post-hashtag">$1</span>'
    );

    let imageHtml = '';
    if (post.imageData) {
      imageHtml = `
        <div class="post-image-box">
          <img src="${post.imageData}" alt="សកម្មភាពហាត់ប្រាណ" loading="lazy">
        </div>
      `;
    }

    const deleteBtnHtml = post.isMyPost
      ? `<button class="btn-item-del" data-del-post="${post.id}" title="លុបការបង្ហោះរបស់អ្នក (ដើម្បីទទួលបានកូតាវិញ)">&times;</button>`
      : '';

    const myBadgeHtml = post.isMyPost
      ? `<span style="font-size: 0.72rem; padding: 0.15rem 0.5rem; background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border-radius: var(--radius-full); margin-left: 0.4rem; font-weight: 700;">🌟 អ្នក (You)</span>`
      : '';

    return `
      <div class="feed-post-card" id="${post.id}">
        <div class="post-header">
          <div class="post-author-group">
            <div class="post-author-avatar">${post.userAvatar || '🏋️‍♂️'}</div>
            <div>
              <div class="post-author-name">
                ${escapeHtml(post.userName)}
                ${myBadgeHtml}
              </div>
              <div class="post-time-meta">⏱️ ${escapeHtml(post.timeStr || 'ថ្មីៗ')} • 🌍 សាធារណៈ</div>
            </div>
          </div>
          ${deleteBtnHtml}
        </div>

        <div class="post-content-text">${formattedText}</div>

        ${imageHtml}

        <div class="post-actions-bar">
          <button class="btn-like-post ${post.isLiked ? 'liked' : ''}" data-like-post="${post.id}">
            <span>${post.isLiked ? '❤️' : '🤍'}</span>
            <span>${toKhmerNumber(post.likes || 0)} ចូលចិត្ត</span>
          </button>

          <div style="display: flex; gap: 0.4rem;">
            <button class="post-cheers-btn" data-cheer-post="${post.id}">
              <span>👏</span> លើកទឹកចិត្ត
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupPostCardListeners() {
  // Like button
  document.querySelectorAll('[data-like-post]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const postId = btn.getAttribute('data-like-post');
      const post = AppState.communityPosts.find((p) => p.id === postId);
      if (post) {
        if (post.isLiked) {
          post.likes = Math.max(0, (post.likes || 1) - 1);
          post.isLiked = false;
        } else {
          post.likes = (post.likes || 0) + 1;
          post.isLiked = true;
          showToast('បានចូលចិត្តការបង្ហោះនេះ! ❤️', 'info');
        }
        saveCommunityPosts();
        renderCommunityFeed();
      }
    });
  });

  // Cheer button
  document.querySelectorAll('[data-cheer-post]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('អ្នកបានផ្ញើសារលើកទឹកចិត្ត៖ "តស៊ូឡើង! សុខភាពល្អជាទ្រព្យធនធំបំផុត!" 👏', 'success');
    });
  });

  // Delete button
  document.querySelectorAll('[data-del-post]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-del-post');
      if (confirm('តើអ្នកពិតជាចង់លុបការបង្ហោះនេះមែនទេ?')) {
        AppState.communityPosts = AppState.communityPosts.filter((p) => p.id !== postId);
        saveCommunityPosts();
        renderCommunityFeed();
        showToast('បានលុបការបង្ហោះរួចរាល់', 'info');
      }
    });
  });
}

// Compress Image using HTML5 Canvas (keeps base64 small for localStorage)
function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 800; // max dimension

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
      callback(compressedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

let currentDashboardPostImageBase64 = null;
let currentFoodPostImageBase64 = null;

function setupCommunityComposerListeners() {
  function wireComposer({
    formId,
    fileInputId,
    previewWrapId,
    previewImgId,
    btnRemovePreviewId,
    filenameTextId,
    textInputId,
    getImage,
    setImage,
  }) {
    const fileInput = document.getElementById(fileInputId);
    const previewWrap = document.getElementById(previewWrapId);
    const previewImg = document.getElementById(previewImgId);
    const btnRemove = document.getElementById(btnRemovePreviewId);
    const filenameText = document.getElementById(filenameTextId);
    const formEl = document.getElementById(formId);
    const textInput = document.getElementById(textInputId);

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (filenameText) filenameText.textContent = file.name;
        compressImageFile(file, (base64) => {
          setImage(base64);
          if (previewImg) previewImg.src = base64;
          if (previewWrap) previewWrap.style.display = 'flex';
        });
      });
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', () => {
        setImage(null);
        if (previewWrap) previewWrap.style.display = 'none';
        if (previewImg) previewImg.src = '';
        if (fileInput) fileInput.value = '';
        if (filenameText) filenameText.textContent = 'មិនទាន់ជ្រើសរើសរូបភាពនៅឡើយ';
      });
    }

    if (formEl) {
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        // Rule: Max 3 posts per person strictly (ក្នុងមួយនាក់អាច Post បានតែ ៣ ដងគត់)
        const myPosts = AppState.communityPosts.filter((p) => p.isMyPost);
        if (myPosts.length >= 3) {
          alert('⚠️ លោកអ្នកបានបង្ហោះគ្រប់កូតា ៣ ដងគត់ហើយ! ក្នុងម្នាក់អាចបង្ហោះបានតែ ៣ ដងប៉ុណ្ណោះ។ សូមរង់ចាំការសម្អាតប្រចាំសប្តាហ៍ (៧ ថ្ងៃ) ឬលុបការបង្ហោះចាស់ចេញ ទើបអាចបង្ហោះថ្មីបាន។');
          return;
        }

        const text = textInput ? textInput.value.trim() : '';
        const imgData = getImage();

        if (!text && !imgData) {
          showToast('សូមសរសេររៀបរាប់ ឬភ្ជាប់រូបភាពមុននឹងចែករំលែក', 'warn');
          return;
        }

        const isMale = AppState.profile.gender === 'male';
        const userAvatar = isMale ? '🏋️‍♂️' : '🧘‍♀️';
        const now = Date.now();
        const todayStr = new Date().toISOString().split('T')[0];

        const newPost = {
          id: 'post_' + now + '_' + Math.floor(Math.random() * 1000),
          isMyPost: true, // Marked as current user's post
          userName: isMale ? 'បុរសសុខភាពល្អ' : 'ស្រ្តីសុខភាពល្អ',
          userAvatar,
          text,
          imageData: imgData,
          timestamp: now,
          dateStr: todayStr,
          timeStr: 'ទើបតែបង្ហោះមុននេះ',
          likes: 0,
          isLiked: false,
        };

        AppState.communityPosts.unshift(newPost);
        saveCommunityPosts();

        // Reset composer
        if (textInput) textInput.value = '';
        setImage(null);
        if (previewWrap) previewWrap.style.display = 'none';
        if (previewImg) previewImg.src = '';
        if (fileInput) fileInput.value = '';
        if (filenameText) filenameText.textContent = 'មិនទាន់ជ្រើសរើសរូបភាពនៅឡើយ';

        renderCommunityFeed();
        showToast('បានចែករំលែកសកម្មភាពហាត់ប្រាណជាសាធារណៈដោយជោគជ័យ! 🎉', 'success');
      });
    }
  }

  // 1. Dashboard Composer
  wireComposer({
    formId: 'formDashboardCreatePost',
    fileInputId: 'dashboardPostImageFileInput',
    previewWrapId: 'dashboardPostImagePreviewWrap',
    previewImgId: 'dashboardPostImagePreviewEl',
    btnRemovePreviewId: 'btnDashboardRemovePreview',
    filenameTextId: 'dashboardUploadFilenameText',
    textInputId: 'dashboardPostTextInput',
    getImage: () => currentDashboardPostImageBase64,
    setImage: (val) => { currentDashboardPostImageBase64 = val; },
  });

  // 2. Food Tab Composer
  wireComposer({
    formId: 'formCreatePost',
    fileInputId: 'postImageFileInput',
    previewWrapId: 'postImagePreviewWrap',
    previewImgId: 'postImagePreviewEl',
    btnRemovePreviewId: 'btnRemovePreview',
    filenameTextId: 'uploadFilenameText',
    textInputId: 'postTextInput',
    getImage: () => currentFoodPostImageBase64,
    setImage: (val) => { currentFoodPostImageBase64 = val; },
  });

  // Weekly Purge Handlers
  const handleWeeklyPurge = () => {
    if (confirm('តើអ្នកចង់សម្អាតរូបភាព និងកំណត់កូតាប្រចាំសប្តាហ៍ឡើងវិញមែនទេ? (រូបភាពទាំងអស់នឹងត្រូវសម្អាត ហើយលោកអ្នកនឹងទទួលបានកូតា ៣ ដងថ្មី)')) {
      purgeOldCommunityPosts(true);
      saveCommunityPosts();
      renderCommunityFeed();
      showToast('បានសម្អាតរូបភាពប្រចាំសប្តាហ៍រួចរាល់! លោកអ្នកអាចបង្ហោះរូបភាព ៣ ដងថ្មីបាន។ 🧹', 'success');
    }
  };

  const btnDashPurge = document.getElementById('btnDashboardWeeklyPurge');
  if (btnDashPurge) btnDashPurge.addEventListener('click', handleWeeklyPurge);

  const btnFoodPurge = document.getElementById('btnManualPurgePosts');
  if (btnFoodPurge) btnFoodPurge.addEventListener('click', handleWeeklyPurge);

  // Quick drink glass button on dashboard
  const btnQuickDrink = document.getElementById('btnQuickDrinkGlass');
  if (btnQuickDrink) {
    btnQuickDrink.addEventListener('click', () => {
      if (AppState.water < 8) {
        AppState.water++;
        saveWater();
        renderAll();
        showToast('បានបន្ថែមការផឹកទឹក +១ កែវ (250 ml)! 💧', 'info');
      } else {
        showToast('អ្នកបានសម្រេចគោលដៅផឹកទឹក ៨ កែវ (២,០០០ ml) រួចហើយ! 🎉', 'success');
      }
    });
  }
}

function renderAll() {
  renderTheme();
  renderLiveDate();
  renderProfileHeader();
  renderDashboardHero();
  renderThresholdAlerts();
  renderWaterDashboardMonitor();
  renderFoodMenuGrids();
  renderLoggedFoodLists();
  renderWorkoutsList();
  renderSleepTracker();
  renderAdvisory40();
  renderCommunityFeed();
  renderWaterTracker();
  renderSmartHealthTip();
  renderAnalytics();
}

// Theme
function renderTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
  }
}

// Live date
function renderLiveDate() {
  const dateEl = document.getElementById('currentDateText');
  if (dateEl) dateEl.textContent = formatKhmerLiveDate();
}

// Profile Header
function renderProfileHeader() {
  const profileIcon = document.getElementById('headerProfileIcon');
  const profileText = document.getElementById('headerProfileText');
  const profileSub = document.getElementById('cardProfileSub');

  const isMale = AppState.profile.gender === 'male';
  const genderKhmer = isMale ? 'បុរស' : 'ស្ត្រី';
  const icon = isMale ? '👨' : '👩';
  const ageStr = `${toKhmerNumber(AppState.profile.age)} ឆ្នាំ`;

  if (profileIcon) profileIcon.textContent = icon;
  if (profileText) profileText.textContent = `វ័យ ${ageStr}`;
  if (profileSub) {
    const bmr = isMale
      ? Math.round(10 * AppState.profile.weight + 6.25 * AppState.profile.height - 5 * AppState.profile.age + 5)
      : Math.round(10 * AppState.profile.weight + 6.25 * AppState.profile.height - 5 * AppState.profile.age - 161);
    profileSub.textContent = `${genderKhmer} ${ageStr} (BMR ~${bmr.toLocaleString()} kcal)`;
  }
}

// Dashboard Hero: Ring, Equation, Metrics, Macros
function renderDashboardHero() {
  const goal = AppState.goal;
  const intake = AppState.meals.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const burned = AppState.workouts.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const net = goal - intake + burned;

  // Header Goal Display
  const headerGoalDisplay = document.getElementById('headerGoalDisplay');
  if (headerGoalDisplay) headerGoalDisplay.textContent = goal.toLocaleString();

  // Equation Bar
  const statGoal = document.getElementById('statGoalCalories');
  const statIntake = document.getElementById('statIntakeCalories');
  const statBurned = document.getElementById('statBurnedCalories');
  const statNet = document.getElementById('statNetEquation');

  if (statGoal) statGoal.textContent = goal.toLocaleString();
  if (statIntake) statIntake.textContent = intake.toLocaleString();
  if (statBurned) statBurned.textContent = burned.toLocaleString();
  if (statNet) statNet.textContent = net.toLocaleString();

  // Metric Cards
  const cardGoalNum = document.getElementById('cardGoalNum');
  const cardIntakeNum = document.getElementById('cardIntakeNum');
  const cardBurnedNum = document.getElementById('cardBurnedNum');
  const cardIntakePercent = document.getElementById('cardIntakePercent');
  const cardWorkoutCount = document.getElementById('cardWorkoutCount');

  if (cardGoalNum) cardGoalNum.textContent = goal.toLocaleString();
  if (cardIntakeNum) cardIntakeNum.textContent = intake.toLocaleString();
  if (cardBurnedNum) cardBurnedNum.textContent = burned.toLocaleString();

  const intakePercent = goal > 0 ? Math.round((intake / goal) * 100) : 0;
  if (cardIntakePercent) cardIntakePercent.textContent = `${toKhmerNumber(intakePercent)}% នៃគោលដៅ`;
  if (cardWorkoutCount) cardWorkoutCount.textContent = `${toKhmerNumber(AppState.workouts.length)} សកម្មភាព`;

  // Circular Progress Ring
  const radius = 95;
  const circumference = 2 * Math.PI * radius; // ~596.90
  const circle = document.getElementById('calorieProgressCircle');
  const remNumEl = document.getElementById('netRemainingCalories');
  const statusBadge = document.getElementById('calorieStatusBadge');
  const statusText = document.getElementById('calorieStatusText');

  if (remNumEl) {
    remNumEl.textContent = net.toLocaleString();
    remNumEl.style.color = net < 0 ? '#ef4444' : 'inherit';
  }

  const totalAvailable = goal + burned;
  const fractionConsumed = totalAvailable > 0 ? Math.min(intake / totalAvailable, 1.3) : 0;
  const strokeOffset = circumference - (fractionConsumed * circumference);

  if (circle) {
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${Math.max(0, strokeOffset)}`;

    if (net < 0) {
      circle.style.stroke = 'url(#dangerGradient)';
    } else if (net < goal * 0.15) {
      circle.style.stroke = 'url(#warnGradient)';
    } else {
      circle.style.stroke = 'url(#emeraldCyanGradient)';
    }
  }

  // Status Badge
  if (statusBadge && statusText) {
    statusBadge.className = 'ring-status-pill';
    if (net < 0) {
      statusBadge.classList.add('status-danger');
      statusText.textContent = `លើសកម្រិតកំណត់ (${Math.abs(net).toLocaleString()} kcal)`;
    } else if (net < goal * 0.15) {
      statusBadge.classList.add('status-warn');
      statusText.textContent = 'ជិតដល់កម្រិតកំណត់ហើយ';
    } else {
      statusBadge.classList.add('status-good');
      statusText.textContent = 'ស្ថិតក្នុងកម្រិតល្អប្រសើរ (Deficit)';
    }
  }

  // Macronutrients
  renderMacros(intake);
}

// Macros calculation
function renderMacros(totalIntakeKcal) {
  const targetProteinGrams = Math.round((AppState.goal * 0.25) / 4);
  const targetCarbsGrams = Math.round((AppState.goal * 0.50) / 4);
  const targetFatGrams = Math.round((AppState.goal * 0.25) / 9);

  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  AppState.meals.forEach((m) => {
    if (m.protein !== undefined && m.protein > 0) {
      consumedProtein += m.protein;
      consumedCarbs += m.carbs || 0;
      consumedFat += m.fat || 0;
    } else {
      consumedProtein += Math.round((m.kcal * 0.2) / 4);
      consumedCarbs += Math.round((m.kcal * 0.55) / 4);
      consumedFat += Math.round((m.kcal * 0.25) / 9);
    }
  });

  const pBar = document.getElementById('proteinBar');
  const cBar = document.getElementById('carbsBar');
  const fBar = document.getElementById('fatsBar');

  const pText = document.getElementById('proteinGrams');
  const cText = document.getElementById('carbsGrams');
  const fText = document.getElementById('fatsGrams');

  if (pText) pText.textContent = `${consumedProtein}g / ${targetProteinGrams}g`;
  if (cText) cText.textContent = `${consumedCarbs}g / ${targetCarbsGrams}g`;
  if (fText) fText.textContent = `${consumedFat}g / ${targetFatGrams}g`;

  if (pBar) pBar.style.width = `${Math.min(100, Math.round((consumedProtein / targetProteinGrams) * 100))}%`;
  if (cBar) cBar.style.width = `${Math.min(100, Math.round((consumedCarbs / targetCarbsGrams) * 100))}%`;
  if (fBar) fBar.style.width = `${Math.min(100, Math.round((consumedFat / targetFatGrams) * 100))}%`;
}

// =============================================================================
// 6. AUTOMATIC HEALTH THRESHOLD WARNINGS (បំរាមសុខភាព)
// =============================================================================
function renderThresholdAlerts() {
  const intake = AppState.meals.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const goal = AppState.goal;
  const isFemale = AppState.profile.gender === 'female';
  const minThreshold = isFemale ? 1000 : 1200;

  const lowBanner = document.getElementById('bannerCriticalLow');
  const surplusBanner = document.getElementById('bannerExcessSurplus');

  // Rule 1: Critical Low Intake
  // Show alert if intake is below minimum BMR threshold and user has logged at least one meal
  if (intake > 0 && intake < minThreshold) {
    if (lowBanner) lowBanner.style.display = 'flex';
  } else {
    if (lowBanner) lowBanner.style.display = 'none';
  }

  // Rule 2: Excess Calorie Surplus (> 25% over goal)
  if (intake > goal * 1.25) {
    if (surplusBanner) surplusBanner.style.display = 'flex';
  } else {
    if (surplusBanner) surplusBanner.style.display = 'none';
  }
}

// =============================================================================
// 7. COMPREHENSIVE KHMER FOOD MENUS RENDERING
// =============================================================================
function renderFoodMenuGrids() {
  const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'party'];

  categories.forEach((cat) => {
    const grid = document.getElementById(`gridMenu-${cat}`);
    if (!grid) return;

    const items = ALL_MENUS[cat] || [];
    grid.innerHTML = '';

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'food-card';
      card.dataset.foodId = item.id;
      card.dataset.category = cat;
      card.dataset.baseKcal = item.kcal;
      card.dataset.foodName = item.name;

      card.innerHTML = `
        <div class="food-card-top">
          <div class="food-card-name">${escapeHtml(item.name)}</div>
          <div class="food-card-kcal">~${item.kcal} kcal</div>
        </div>
        <div class="portion-picker-row">
          <div class="portion-multipliers" data-food-card-id="${item.id}">
            <button class="btn-portion" data-mul="0.5">0.5x</button>
            <button class="btn-portion selected" data-mul="1.0">1x</button>
            <button class="btn-portion" data-mul="1.5">1.5x</button>
            <button class="btn-portion" data-mul="2.0">2x</button>
          </div>
          <button class="btn-add-food-card" data-action="add-preset" data-food-id="${item.id}" data-cat="${cat}">
            <span>➕</span> បន្ថែម
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  });

  setupPortionButtonListeners();
}

// Setup click handlers on multiplier buttons
function setupPortionButtonListeners() {
  document.querySelectorAll('.portion-multipliers .btn-portion').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const parent = e.target.closest('.portion-multipliers');
      parent.querySelectorAll('.btn-portion').forEach((b) => b.classList.remove('selected'));
      e.target.classList.add('selected');
    });
  });

  // Setup Add buttons
  document.querySelectorAll('.btn-add-food-card[data-action="add-preset"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const foodId = btn.getAttribute('data-food-id');
      const cat = btn.getAttribute('data-cat');
      const card = btn.closest('.food-card');
      const selectedMulBtn = card.querySelector('.btn-portion.selected');
      const multiplier = selectedMulBtn ? parseFloat(selectedMulBtn.getAttribute('data-mul')) : 1.0;

      const baseItems = ALL_MENUS[cat] || [];
      const itemData = baseItems.find((it) => it.id === foodId);
      if (!itemData) return;

      const finalKcal = Math.round(itemData.kcal * multiplier);
      const finalProtein = Math.round((itemData.p || 0) * multiplier);
      const finalCarbs = Math.round((itemData.c || 0) * multiplier);
      const finalFat = Math.round((itemData.f || 0) * multiplier);

      let portionText = `${toKhmerNumber(multiplier)} ចំណែក`;
      if (multiplier === 1.0) portionText = itemData.portionNote || '១ ចាន/កែវ';

      const newMeal = {
        id: 'm_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        name: itemData.name,
        kcal: finalKcal,
        category: cat,
        portion: portionText,
        protein: finalProtein,
        carbs: finalCarbs,
        fat: finalFat,
        date: new Date().toISOString().split('T')[0],
      };

      AppState.meals.push(newMeal);
      saveMeals();

      // If user added ទឹកសុទ្ធ, also sync and increment Water Tracker
      if (itemData.name === 'ទឹកសុទ្ធ' || itemData.name.includes('ទឹកសុទ្ធ')) {
        const addedGlasses = Math.max(1, Math.round(multiplier));
        AppState.water = Math.min(8, AppState.water + addedGlasses);
        saveWater();
        renderAll();
        showToast(`បានបន្ថែម៖ ទឹកសុទ្ធ (${(addedGlasses * 250).toLocaleString()} ml) ចូលក្នុងតារាងតាមដានជាតិទឹក! 💧`, 'success');
      } else {
        renderAll();
        showToast(`បានបន្ថែម៖ ${itemData.name} (${finalKcal.toLocaleString()} kcal)`, 'success');
      }
    });
  });
}

// Render Logged Food Lists
function renderLoggedFoodLists() {
  const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'party'];

  categories.forEach((cat) => {
    const listEl = document.getElementById(`list-${cat}`);
    const countEl = document.getElementById(`count-${cat}`);
    const kcalEl = document.getElementById(`kcal-${cat}`);

    const items = AppState.meals.filter((m) => m.category === cat);
    const subtotal = items.reduce((sum, item) => sum + (item.kcal || 0), 0);

    if (countEl) countEl.textContent = `${toKhmerNumber(items.length)} មុខ`;
    if (kcalEl) kcalEl.textContent = `${subtotal.toLocaleString()} kcal`;

    if (!listEl) return;
    listEl.innerHTML = '';

    if (items.length === 0) {
      listEl.innerHTML = `
        <li class="empty-meal-msg">
          <span>🍃 មិនទាន់មានអាហារក្នុងពេលនេះនៅឡើយទេ</span>
          <span style="font-size: 0.74rem;">(ជ្រើសរើសមុខម្ហូបក្នុងបញ្ជីខាងលើ ឬចុច "បន្ថែមផ្ទាល់ខ្លួន")</span>
        </li>
      `;
      return;
    }

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'item-row';
      li.innerHTML = `
        <div class="item-main-info">
          <div>
            <div class="item-name">${escapeHtml(item.name)}</div>
            <div class="item-portion">${escapeHtml(item.portion || '១ ចំណែក')}</div>
          </div>
        </div>
        <div class="item-actions-group">
          <span class="item-kcal">${item.kcal.toLocaleString()} kcal</span>
          <button class="btn-item-del" data-del-meal="${item.id}" title="លុបមុខម្ហូបនេះចេញ">&times;</button>
        </div>
      `;
      listEl.appendChild(li);
    });
  });

  // Attach delete meal listeners
  document.querySelectorAll('[data-del-meal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-del-meal');
      AppState.meals = AppState.meals.filter((m) => m.id !== id);
      saveMeals();
      renderAll();
      showToast('បានលុបមុខម្ហូបរួចរាល់', 'info');
    });
  });
}

// =============================================================================
// 8. WORKOUT TRACKER RENDERING
// =============================================================================
function renderWorkoutsList() {
  const listEl = document.getElementById('workoutsList');
  const countEl = document.getElementById('workoutCountText');
  const totalBurnedEl = document.getElementById('workoutTotalBurned');

  const items = AppState.workouts;
  const totalBurned = items.reduce((sum, item) => sum + (item.kcal || 0), 0);

  if (countEl) countEl.textContent = `${toKhmerNumber(items.length)} សកម្មភាព`;
  if (totalBurnedEl) totalBurnedEl.textContent = totalBurned.toLocaleString();

  if (!listEl) return;
  listEl.innerHTML = '';

  if (items.length === 0) {
    listEl.innerHTML = `
      <li class="empty-meal-msg">
        <span>🧘‍♂️ មិនទាន់មានការហាត់ប្រាណថ្ងៃនេះ</span>
        <span style="font-size: 0.75rem;">(ជ្រើសរើសប្រភេទកីឡាពេញនិយមខាងឆ្វេង ឬចុចបន្ថែមថ្មី)</span>
      </li>
    `;
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'workout-item-card';
    li.innerHTML = `
      <div>
        <div style="font-weight: 700; font-size: 0.95rem;">${escapeHtml(item.name)}</div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">
          ⏱️ រយៈពេល ${toKhmerNumber(item.minutes)} នាទី
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-family: var(--font-family-numbers); font-weight: 800; font-size: 1.1rem; color: var(--accent-emerald);">
          -${item.kcal.toLocaleString()} kcal
        </span>
        <button class="btn-item-del" data-del-workout="${item.id}" title="លុបការហាត់ប្រាណ">&times;</button>
      </div>
    `;
    listEl.appendChild(li);
  });

  // Attach delete workout listeners
  document.querySelectorAll('[data-del-workout]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-del-workout');
      AppState.workouts = AppState.workouts.filter((w) => w.id !== id);
      saveWorkouts();
      renderAll();
      showToast('បានលុបការហាត់ប្រាណរួចរាល់', 'info');
    });
  });
}

// =============================================================================
// 9. SMART SLEEP TRACKER LOGIC & RENDERING
// =============================================================================
function calculateSleepHours() {
  const bedtime = document.getElementById('sleepBedtime')?.value || AppState.sleepCurrent.bedtime;
  const wakeTime = document.getElementById('sleepWakeTime')?.value || AppState.sleepCurrent.wakeTime;
  const napStart = document.getElementById('napStartTime')?.value || AppState.sleepCurrent.napStart;
  const napEnd = document.getElementById('napEndTime')?.value || AppState.sleepCurrent.napEnd;

  function timeToMinutes(t) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  // Night duration (handles midnight crossing)
  let nightMin = timeToMinutes(wakeTime) - timeToMinutes(bedtime);
  if (nightMin < 0) nightMin += 24 * 60;

  // Day nap duration
  let napMin = timeToMinutes(napEnd) - timeToMinutes(napStart);
  if (napMin < 0) napMin += 24 * 60;
  if (napMin > 180) napMin = 30; // sensible guard

  const totalMin = nightMin + napMin;
  const totalHours = Math.round((totalMin / 60) * 10) / 10;
  return totalHours;
}

function renderSleepTracker() {
  const totalHours = calculateSleepHours();
  const displayEl = document.getElementById('sleepTotalHoursDisplay');
  const banner = document.getElementById('sleepFeedbackBanner');
  const textEl = document.getElementById('sleepFeedbackText');

  if (displayEl) {
    displayEl.textContent = `${toKhmerNumber(totalHours)} ម៉ោង`;
  }

  if (banner && textEl) {
    banner.className = 'sleep-feedback-banner';

    // Rule 1: Adequate sleep (7 to 9 hours)
    if (totalHours >= 7 && totalHours <= 9) {
      banner.classList.add('adequate');
      textEl.innerHTML = `
        <strong>អស្ចារ្យណាស់!</strong> អ្នកគេងបាន <strong>${toKhmerNumber(totalHours)} ម៉ោង</strong> គ្រប់គ្រាន់តាមក្បួនវេជ្ជសាស្ត្រ។ ការគេងស្កប់ស្កល់ជួយឱ្យសាច់ដុំឆាប់ជាសះស្បើយ គ្រប់គ្រងអ័រម៉ូនឃ្លាន និងបង្កើនប្រសិទ្ធភាពសម្រកទម្ងន់! 🎉
      `;
    }
    // Rule 2: Inadequate sleep (< 6 hours)
    else if (totalHours < 6) {
      banner.classList.add('inadequate');
      textEl.innerHTML = `
        <strong>ការព្រមាន៖</strong> អ្នកគេងបានតែ <strong>${toKhmerNumber(totalHours)} ម៉ោង</strong> ប៉ុណ្ណោះ! ការគេងមិនបានគ្រប់គ្រាន់អាចបង្កើនអ័រម៉ូនស្ត្រេស Cortisol ធ្វើឱ្យចង់ញ៉ាំអាហារផ្អែមច្រើន និងកាត់បន្ថយល្បឿនដុតបំផ្លាញខ្លាញ់។ ⚠️
      `;
    }
    // Normal / borderline (6 to <7 hours or >9 hours)
    else {
      banner.classList.add('normal');
      textEl.innerHTML = `
        អ្នកគេងបាន <strong>${toKhmerNumber(totalHours)} ម៉ោង</strong>។ យោងតាមក្បួនវេជ្ជសាស្ត្រ មនុស្សពេញវ័យគួរគេងពី ៧ ទៅ ៩ ម៉ោងក្នុងមួយយប់ ដើម្បីរក្សាតុល្យភាពរាងកាយ និងប្រព័ន្ធភាពស៊ាំឱ្យបានរឹងមាំ។ ✨
      `;
    }
  }

  // Render sleep history list
  const historyList = document.getElementById('sleepHistoryList');
  if (historyList) {
    historyList.innerHTML = '';
    if (AppState.sleepHistory.length === 0) {
      historyList.innerHTML = '<li class="empty-meal-msg"><span>មិនទាន់មានប្រវត្តិដំណេកដែលបានកត់ត្រា</span></li>';
      return;
    }
    AppState.sleepHistory.slice(0, 5).forEach((rec) => {
      const li = document.createElement('li');
      li.className = 'sleep-history-item';
      li.innerHTML = `
        <span style="font-weight: 700;">📅 កាលបរិច្ឆេទ ${escapeHtml(rec.dateStr)}</span>
        <span style="font-family: var(--font-family-numbers); font-weight: 800; color: var(--accent-cyan); font-size: 1.05rem;">
          ${toKhmerNumber(rec.totalHours)} ម៉ោង
        </span>
        <span style="font-size: 0.82rem;">${escapeHtml(rec.statusLabel)}</span>
      `;
      historyList.appendChild(li);
    });
  }
}

// =============================================================================
// 10. SPECIALIZED FITNESS ADVISORY FOR ADULTS 40+ (វ័យ ៤០ឆ្នាំឡើង)
// =============================================================================
function renderAdvisory40() {
  const grid = document.getElementById('advisoryCardsGrid');
  const routineGrid = document.getElementById('routineDaysGrid');
  const isMale = AppState.profile.gender === 'male';

  const maleBtn = document.getElementById('btnGenderMale');
  const femaleBtn = document.getElementById('btnGenderFemale');

  if (maleBtn && femaleBtn) {
    if (isMale) {
      maleBtn.classList.add('active');
      femaleBtn.classList.remove('active');
    } else {
      femaleBtn.classList.add('active');
      maleBtn.classList.remove('active');
    }
  }

  if (!grid) return;
  grid.innerHTML = '';

  if (isMale) {
    // Prescriptions for Men 40+
    grid.innerHTML = `
      <div class="advisor-card">
        <div class="advisor-card-icon">🏋️‍♂️</div>
        <h4>ការហ្វឹកហាត់កម្លាំង (Resistance Training)</h4>
        <p>
          លើកទម្ងន់កម្រិតមធ្យម ២-៣ ដងក្នុងមួយសប្តាហ៍ ដើម្បីទប់ទល់ការបាត់បង់សាច់ដុំ (Sarcopenia) និងជួយរក្សាកម្រិតអ័រម៉ូន Testosterone ឱ្យមានលំនឹងល្អ។
        </p>
      </div>

      <div class="advisor-card">
        <div class="advisor-card-icon">🏃‍♂️</div>
        <h4>សុខភាពបេះដូង និងសរសៃឈាម (Cardio)</h4>
        <p>
          ដើរលឿន ឬជិះកង់ ៣០ នាទីក្នុងមួយថ្ងៃ ដោយជៀសវាងការរត់លោតខ្លាំងពេក ដើម្បីការពារសន្លាក់ជង្គង់ និងកជើងពីការរងសម្ពាធធ្ងន់ធ្ងរ។
        </p>
      </div>

      <div class="advisor-card">
        <div class="advisor-card-icon">🧘‍♂️</div>
        <h4>ការបត់បែន និងលំនឹងរាងកាយ (Mobility)</h4>
        <p>
          ពត់ពែនសាច់ដុំ និងចង្កេះមុន និងក្រោយពេលហាត់ប្រាណ ដើម្បីជៀសវាងការឈឺខ្នង និងរក្សាភាពបត់បែននៃសរសៃពួរ។
        </p>
      </div>
    `;
  } else {
    // Prescriptions for Women 40+
    grid.innerHTML = `
      <div class="advisor-card">
        <div class="advisor-card-icon">🦴</div>
        <h4>សុខភាពឆ្អឹង (Bone Density)</h4>
        <p>
          ហាត់ប្រាណទ្រទម្ងន់ខ្លួន (Bodyweight, Pilates) ដើម្បីទប់ស្កាត់ការបាត់បង់ដង់ស៊ីតេឆ្អឹង និងការពារជំងឺពុកឆ្អឹង (Osteoporosis) ក្រោយវ័យអស់រដូវ។
        </p>
      </div>

      <div class="advisor-card">
        <div class="advisor-card-icon">🌸</div>
        <h4>បេះដូង និងតុល្យភាពអ័រម៉ូន</h4>
        <p>
          ហែលទឹក, យូហ្គា (Yoga), ឬដើរលើជម្រាលកម្រិតស្រាល ដើម្បីគ្រប់គ្រងកម្រិតជាតិស្ករក្នុងឈាម និងកាត់បន្ថយអាការស្មុគស្មាញនៃអ័រម៉ូន។
        </p>
      </div>

      <div class="advisor-card">
        <div class="advisor-card-icon">🌿</div>
        <h4>ការសម្រាក និងស្តារថាមពល (Recovery)</h4>
        <p>
          ជៀសវាងការហាត់ហត់ខ្លាំងហួសហេតុ ផ្តល់ពេលឱ្យរាងកាយងើបឡើងវិញដោយគេងឱ្យគ្រប់គ្រាន់ និងទទួលទានសារធាតុចិញ្ចឹមកាល់ស្យូមឱ្យបានខ្ជាប់ខ្ជួន។
        </p>
      </div>
    `;
  }

  // Routine schedule
  if (routineGrid) {
    const routineMale = [
      { day: 'ចន្ទ', act: '🏋️‍♂️ លើកទម្ងន់ផ្នែកខាងលើ (Upper Body)' },
      { day: 'អង្គារ', act: '🚶‍♂️ ដើរលឿន ៤០ នាទី + ពត់ខ្លួន' },
      { day: 'ពុធ', act: '🏋️‍♂️ ហាត់សាច់ដុំជើង (Lower Body)' },
      { day: 'ព្រហស្បតិ៍', act: '🧘 សម្រាកសាច់ដុំ ឬយូហ្គាស្រាលៗ' },
      { day: 'សុក្រ', act: '🚴‍♂️ ជិះកង់ ឬហែលទឹក ៣០ នាទី' },
      { day: 'សៅរ៍', act: '⚡ ហាត់កម្លាំងស្នូល (Core & Planks)' },
      { day: 'អាទិត្យ', act: '🌿 សម្រាកពេញលេញ និងគេងស្កប់ស្កល់' },
    ];

    const routineFemale = [
      { day: 'ចន្ទ', act: '🧘‍♀️ យូហ្គា ឬ Pilates ពង្រឹងស្នូលខ្លួន' },
      { day: 'អង្គារ', act: '🚶‍♀️ ដើរលឿន ៣៥ នាទីលើជម្រាលស្រាល' },
      { day: 'ពុធ', act: '🦴 Bodyweight Squats & Resistance Bands' },
      { day: 'ព្រហស្បតិ៍', act: '🏊‍♀️ ហែលទឹកកម្សាន្ត ៣០ នាទី' },
      { day: 'សុក្រ', act: '🤸‍♀️ ពត់ពែនសរសៃ និងលំនឹងរាងកាយ' },
      { day: 'សៅរ៍', act: '🚶‍♀️ ដើរលំហែកាយក្រៅផ្ទះ' },
      { day: 'អាទិត្យ', act: '🌿 សម្រាកពេញលេញ និងថែទាំស្បែក' },
    ];

    const routine = isMale ? routineMale : routineFemale;
    routineGrid.innerHTML = '';
    routine.forEach((r) => {
      const d = document.createElement('div');
      d.className = 'routine-day-item';
      d.innerHTML = `
        <span class="routine-day-name">ថ្ងៃ${r.day}</span>
        <span class="routine-day-activity">${r.act}</span>
      `;
      routineGrid.appendChild(d);
    });
  }
}

// =============================================================================
// 11. ANALYTICS & TIMEFRAME SUMMARIES (ស្ថិតិ និងរបាយការណ៍)
// =============================================================================
function renderAnalytics() {
  const intakeTotal = AppState.meals.reduce((s, m) => s + (m.kcal || 0), 0);
  const burnedTotal = AppState.workouts.reduce((s, w) => s + (w.kcal || 0), 0);

  // Calculate dynamic averages based on mock history
  const historyKeys = Object.keys(AppState.history);
  let avgIntake = intakeTotal;
  let totalBurnedAll = burnedTotal;
  let avgSleep = 8.0;

  if (historyKeys.length > 0) {
    const sumIntake = historyKeys.reduce((acc, k) => acc + (AppState.history[k].intake || 0), 0);
    const sumBurned = historyKeys.reduce((acc, k) => acc + (AppState.history[k].burned || 0), 0);
    const sumSleep = historyKeys.reduce((acc, k) => acc + (AppState.history[k].sleep || 8), 0);
    avgIntake = Math.round(sumIntake / historyKeys.length);
    totalBurnedAll = sumBurned;
    avgSleep = Math.round((sumSleep / historyKeys.length) * 10) / 10;
  }

  // Weight Delta: 7,700 kcal deficit = 1 kg fat loss
  const netSurplusDeficit = (avgIntake - AppState.goal) * 7;
  const expectedWeightDeltaKg = (netSurplusDeficit / 7700).toFixed(1);

  const elAvgIntake = document.getElementById('anAvgIntake');
  const elTotalBurned = document.getElementById('anTotalBurned');
  const elExpectedWeight = document.getElementById('anExpectedWeight');
  const elAvgSleep = document.getElementById('anAvgSleep');

  if (elAvgIntake) elAvgIntake.textContent = avgIntake.toLocaleString();
  if (elTotalBurned) elTotalBurned.textContent = totalBurnedAll.toLocaleString();
  if (elExpectedWeight) elExpectedWeight.textContent = `${expectedWeightDeltaKg > 0 ? '+' : ''}${toKhmerNumber(expectedWeightDeltaKg)}`;
  if (elAvgSleep) elAvgSleep.textContent = toKhmerNumber(avgSleep);

  // Draw Canvas Chart
  drawAnalyticsChart();
}

function drawAnalyticsChart() {
  const canvas = document.getElementById('calorieChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Set real canvas dimensions for high DPI
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  // Data to plot (Last 7 days)
  const daysLabels = ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'];
  const intakeData = [1850, 1920, 1750, 2100, 1680, 2200, 1800];
  const burnedData = [250, 300, 200, 350, 280, 400, 220];
  const goal = AppState.goal;

  const maxVal = Math.max(...intakeData, goal) * 1.25;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barGroupWidth = chartWidth / daysLabels.length;

  const isDark = AppState.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  ctx.font = '12px "Plus Jakarta Sans", "Kantumruy Pro", sans-serif';

  // Draw horizontal grid lines
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const val = Math.round((maxVal / gridSteps) * i);
    const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${val}`, paddingLeft - 8, y);
  }

  // Draw Goal Line
  const goalY = paddingTop + chartHeight - (goal / maxVal) * chartHeight;
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(paddingLeft, goalY);
  ctx.lineTo(width - paddingRight, goalY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Goal Line Label
  ctx.fillStyle = '#0284c7';
  ctx.textAlign = 'right';
  ctx.fillText(`គោលដៅ ${goal} kcal`, width - paddingRight, goalY - 8);

  // Draw bars
  const singleBarWidth = Math.min(20, barGroupWidth * 0.28);

  daysLabels.forEach((day, idx) => {
    const centerX = paddingLeft + idx * barGroupWidth + barGroupWidth / 2;

    const intake = intakeData[idx];
    const burned = burnedData[idx];

    const intakeBarHeight = (intake / maxVal) * chartHeight;
    const burnedBarHeight = (burned / maxVal) * chartHeight;

    // Intake Bar (Amber)
    const xIntake = centerX - singleBarWidth - 2;
    const yIntake = paddingTop + chartHeight - intakeBarHeight;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(xIntake, yIntake, singleBarWidth, intakeBarHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Burned Bar (Emerald)
    const xBurned = centerX + 2;
    const yBurned = paddingTop + chartHeight - burnedBarHeight;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(xBurned, yBurned, singleBarWidth, burnedBarHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Day label
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(day, centerX, paddingTop + chartHeight + 10);
  });
}

// =============================================================================
// 12. HEALTH TIPS & HYDRATION TRACKER
// =============================================================================
function renderWaterTracker() {
  const container = document.getElementById('waterGlassesContainer');
  const currentMlEl = document.getElementById('waterCurrentMl');
  const maxGlasses = 8;
  const mlPerGlass = 250;

  if (currentMlEl) {
    currentMlEl.textContent = (AppState.water * mlPerGlass).toLocaleString();
  }

  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= maxGlasses; i++) {
    const btn = document.createElement('button');
    btn.className = `glass-btn ${i <= AppState.water ? 'filled' : ''}`;
    btn.innerHTML = i <= AppState.water ? '💧' : '🥛';
    btn.title = `កែវទី ${toKhmerNumber(i)} (250 ml)`;
    btn.addEventListener('click', () => {
      AppState.water = AppState.water === i ? i - 1 : i;
      saveWater();
      renderWaterTracker();
      showToast(`បរិមាណទឹក: ${(AppState.water * mlPerGlass).toLocaleString()} ml`, 'info');
    });
    container.appendChild(btn);
  }
}

function renderSmartHealthTip() {
  const tipEl = document.getElementById('dynamicTipText');
  if (!tipEl) return;

  const intake = AppState.meals.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const goal = AppState.goal;
  const isFemale = AppState.profile.gender === 'female';
  const minThreshold = isFemale ? 1000 : 1200;

  if (intake === 0) {
    tipEl.textContent = 'សូមចាប់ផ្តើមកត់ត្រាអាហារពេលព្រឹករបស់អ្នក ដើម្បីទទួលបានថាមពលស្រស់ថ្លា និងរក្សាលំនឹងជាតិស្ករក្នុងឈាមពេញមួយថ្ងៃ។';
  } else if (intake < minThreshold) {
    tipEl.textContent = `ការប្រុងប្រយ័ត្ន៖ កាឡូរីរបស់អ្នកទាបពេក (${intake} kcal)។ ការញ៉ាំតិចជាង ${minThreshold} kcal អាចប៉ះពាល់ដល់អ័រម៉ូន និងធ្វើឱ្យរាងកាយអស់កម្លាំង។ សូមបន្ថែមអាហារផ្តល់ប្រូតេអ៊ីន និងខ្លាញ់ល្អ។`;
  } else if (intake > goal * 1.25) {
    tipEl.textContent = 'កាឡូរីថ្ងៃនេះលើសពីកម្រិតកំណត់ ២៥%។ អ្នកអាចធ្វើការដើរលឿន ៣០ នាទី ឬពិសាទឹកឱ្យបានច្រើនដើម្បីជួយដល់ការរំលាយអាហារ។';
  } else if (intake <= goal) {
    tipEl.textContent = 'អស្ចារ្យណាស់! អ្នកកំពុងរក្សាកម្រិត Calorie Deficit ដ៏ល្អឥតខ្ចោះ ដែលជាគន្លឹះចម្បងក្នុងការដុតរំលាយជាតិខ្លាញ់ដោយសុវត្ថិភាព។';
  } else {
    tipEl.textContent = 'កាឡូរីរបស់អ្នកស្ថិតក្នុងកម្រិតថេរ (Maintenance)។ បន្តទទួលទានបន្លែ និងប្រូតេអ៊ីន ដើម្បីរក្សាទម្ងន់ឱ្យនៅថេរល្អ។';
  }
}

// =============================================================================
// 13. BMI CALCULATOR
// =============================================================================
function calculateBMI() {
  const hInput = document.getElementById('bmiHeight');
  const wInput = document.getElementById('bmiWeight');
  const resNum = document.getElementById('bmiResultNum');
  const badge = document.getElementById('bmiStatusBadge');
  const advice = document.getElementById('bmiAdviceText');

  const heightCm = parseFloat(hInput.value);
  const weightKg = parseFloat(wInput.value);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    showToast('សូមបញ្ចូលកម្ពស់ និងទម្ងន់ឱ្យបានត្រឹមត្រូវ', 'warn');
    return;
  }

  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  if (resNum) resNum.textContent = toKhmerNumber(bmi);

  if (badge && advice) {
    badge.className = 'bmi-badge-status';
    if (bmi < 18.5) {
      badge.classList.add('status-warn');
      badge.textContent = 'ស្គម (Underweight)';
      advice.textContent = 'ទម្ងន់ក្រោមស្តង់ដារ គួរទទួលទានអាហារសម្បូរប្រូតេអ៊ីន និងកាបូអ៊ីដ្រាតស្មុគស្មាញដើម្បីបង្កើនសាច់ដុំ។';
    } else if (bmi <= 24.9) {
      badge.classList.add('status-good');
      badge.textContent = 'ទម្ងន់សមស្រប (Healthy)';
      advice.textContent = 'ទម្ងន់ស្ថិតក្នុងកម្រិតល្អប្រសើរ គួរបន្តថែរក្សាការញ៉ាំ និងហាត់ប្រាណទៀងទាត់។';
    } else if (bmi <= 29.9) {
      badge.classList.add('status-warn');
      badge.textContent = 'លើសទម្ងន់ (Overweight)';
      advice.textContent = 'ទម្ងន់លើសកម្រិតស្តង់ដារបន្តិច គួរអនុវត្ត Calorie Deficit ស្រាលៗ ៣០០ kcal ក្នុងមួយថ្ងៃ។';
    } else {
      badge.classList.add('status-danger');
      badge.textContent = 'ធាត់លើសទម្ងន់ (Obese)';
      advice.textContent = 'គួរពិគ្រោះជាមួយអ្នកជំនាញអាហារូបត្ថម្ភ និងបង្កើនការដើរលឿន ៤០ នាទីជារៀងរាល់ថ្ងៃ។';
    }
  }

  showToast(`ពិន្ទុ BMI: ${toKhmerNumber(bmi)}`, 'info');
}

// =============================================================================
// 14. EVENT LISTENERS & USER INTERACTIONS
// =============================================================================
function setupEventListeners() {
  // Navigation Bar Links (Smooth switching between SPA tabs)
  document.querySelectorAll('#mainHeaderNav .nav-link-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab-target');
      switchMainTab(targetTab);
    });
  });

  // Food Menus Sub-Navigation
  document.querySelectorAll('#foodMenusSubNav .menu-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetMenu = btn.getAttribute('data-menu');
      switchFoodMenu(targetMenu);
    });
  });

  // Shortcuts on Dashboard Hero
  document.querySelectorAll('[data-switch-to-menu]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.getAttribute('data-switch-to-menu');
      switchMainTab('tabFood');
      switchFoodMenu(menu);
    });
  });

  // Theme Toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEYS.THEME, AppState.theme);
      renderTheme();
      drawAnalyticsChart();
      showToast(`បានប្តូរទៅជា៖ ${AppState.theme === 'dark' ? 'DarkMode ងងឹត' : 'LightMode ពន្លឺ'}`, 'info');
    });
  }

  // Modals Open/Close
  setupModalHandlers();

  // Custom Food Form Submit
  const formAddFood = document.getElementById('formAddFood');
  if (formAddFood) {
    formAddFood.addEventListener('submit', handleAddCustomFoodSubmit);
  }

  // Custom Workout Form Submit
  const formAddWorkout = document.getElementById('formAddWorkout');
  if (formAddWorkout) {
    formAddWorkout.addEventListener('submit', handleAddCustomWorkoutSubmit);
  }

  // Goal & Profile Form Submit
  const formEditGoal = document.getElementById('formEditGoal');
  if (formEditGoal) {
    formEditGoal.addEventListener('submit', handleEditGoalProfileSubmit);
  }

  // Food Search Filter
  const searchInput = document.getElementById('foodSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterFoodItems(e.target.value);
    });
  }

  // Preset Workout Cards Click
  document.querySelectorAll('.workout-preset-card').forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-wname');
      const min = parseInt(card.getAttribute('data-min'), 10);
      const kcal = parseInt(card.getAttribute('data-kcal'), 10);

      AppState.workouts.push({
        id: 'w_' + Date.now(),
        name,
        minutes: min,
        kcal,
        date: new Date().toISOString().split('T')[0],
      });
      saveWorkouts();
      renderAll();
      showToast(`បានបន្ថែមការហាត់ប្រាណ៖ ${name} (-${kcal} kcal)`, 'success');
    });
  });

  // Sleep time input changes
  ['sleepBedtime', 'sleepWakeTime', 'napStartTime', 'napEndTime'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        AppState.sleepCurrent.bedtime = document.getElementById('sleepBedtime').value;
        AppState.sleepCurrent.wakeTime = document.getElementById('sleepWakeTime').value;
        AppState.sleepCurrent.napStart = document.getElementById('napStartTime').value;
        AppState.sleepCurrent.napEnd = document.getElementById('napEndTime').value;
        saveSleepCurrent();
        renderSleepTracker();
      });
    }
  });

  // Save Sleep Record Button
  const btnSaveSleep = document.getElementById('btnSaveSleepRecord');
  if (btnSaveSleep) {
    btnSaveSleep.addEventListener('click', () => {
      const totalHours = calculateSleepHours();
      const now = new Date();
      const dayStr = `${now.getDate()}/${now.getMonth() + 1}`;
      let label = 'គ្រប់គ្រាន់ល្អប្រសើរ 🎉';
      if (totalHours < 6) label = 'មិនគ្រប់គ្រាន់ ⚠️';
      else if (totalHours > 9) label = 'គេងច្រើនលើស ℹ️';

      AppState.sleepHistory.unshift({
        dateStr: dayStr,
        totalHours,
        statusLabel: label,
      });
      if (AppState.sleepHistory.length > 10) AppState.sleepHistory.pop();
      saveSleepHistory();
      renderSleepTracker();
      showToast(`បានកត់ត្រាដំណេក ${toKhmerNumber(totalHours)} ម៉ោងរួចរាល់`, 'success');
    });
  }

  // Gender Switch in 40+ Advisory
  const btnMale = document.getElementById('btnGenderMale');
  const btnFemale = document.getElementById('btnGenderFemale');

  if (btnMale && btnFemale) {
    btnMale.addEventListener('click', () => {
      AppState.profile.gender = 'male';
      saveProfile();
      renderAll();
      showToast('បានកំណត់ប្រវត្តិរូប៖ បុរស', 'info');
    });
    btnFemale.addEventListener('click', () => {
      AppState.profile.gender = 'female';
      saveProfile();
      renderAll();
      showToast('បានកំណត់ប្រវត្តិរូប៖ ស្រ្តី', 'info');
    });
  }

  // Analytics Period Pills
  document.querySelectorAll('.period-pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.period-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.activeAnalyticsPeriod = pill.getAttribute('data-period');
      drawAnalyticsChart();
    });
  });

  // BMI Calculation Button
  const btnCalcBMI = document.getElementById('btnCalcBMI');
  if (btnCalcBMI) {
    btnCalcBMI.addEventListener('click', calculateBMI);
  }

  // Water Quick Add & Reset
  const btnAddWater = document.getElementById('btnAddWaterQuick');
  const btnResetWater = document.getElementById('btnResetWater');

  if (btnAddWater) {
    btnAddWater.addEventListener('click', () => {
      if (AppState.water < 8) {
        AppState.water++;
        saveWater();
        renderWaterTracker();
        showToast('បានបន្ថែមទឹក +១ កែវ (250 ml)', 'info');
      } else {
        showToast('អ្នកបានសម្រេចគោលដៅផឹកទឹក ៨ កែវរួចហើយ! 🎉', 'success');
      }
    });
  }

  if (btnResetWater) {
    btnResetWater.addEventListener('click', () => {
      AppState.water = 0;
      saveWater();
      renderWaterTracker();
      showToast('បានសម្អាតកម្រិតទឹកឡើងវិញ', 'info');
    });
  }

  // Reset Today Button
  const btnResetDay = document.getElementById('btnResetDay');
  if (btnResetDay) {
    btnResetDay.addEventListener('click', () => {
      if (confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យអាហារ និងកីឡាថ្ងៃនេះឡើងវិញមែនទេ?')) {
        AppState.meals = [];
        AppState.workouts = [];
        AppState.water = 0;
        saveMeals();
        saveWorkouts();
        saveWater();
        renderAll();
        showToast('បានសម្អាតទិន្នន័យថ្ងៃនេះរួចរាល់', 'info');
      }
    });
  }

  // Export Data JSON
  const btnExport = document.getElementById('btnExportData');
  if (btnExport) {
    btnExport.addEventListener('click', exportBackupJSON);
  }

  // Community Composer & Weekly Purge Handlers
  setupCommunityComposerListeners();

  // Window resize re-draws canvas cleanly
  window.addEventListener('resize', () => {
    drawAnalyticsChart();
  });
}

function switchMainTab(tabId) {
  if (tabId === 'tabCommunity') {
    AppState.activeTab = 'tabCommunity';
    document.querySelectorAll('#mainHeaderNav .nav-link-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab-target') === 'tabCommunity');
    });

    document.querySelectorAll('.tab-section-view').forEach((sec) => {
      sec.classList.toggle('active', sec.id === 'tabDashboard');
    });

    setTimeout(() => {
      const showcase = document.getElementById('dashboardCommunityShowcase');
      if (showcase) {
        showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
    return;
  }

  AppState.activeTab = tabId;
  document.querySelectorAll('#mainHeaderNav .nav-link-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab-target') === tabId);
  });

  document.querySelectorAll('.tab-section-view').forEach((sec) => {
    sec.classList.toggle('active', sec.id === tabId);
  });

  if (tabId === 'tabFood') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tabId === 'tabAnalytics') {
    setTimeout(drawAnalyticsChart, 50);
  }
}

function switchFoodMenu(menuKey) {
  AppState.activeFoodMenu = menuKey;
  document.querySelectorAll('#foodMenusSubNav .menu-tab-btn').forEach((btn) => {
    if (btn.getAttribute('data-menu') === menuKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.menu-view-panel').forEach((panel) => {
    if (panel.id === `panelMenu-${menuKey}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

function filterFoodItems(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.food-card').forEach((card) => {
    const name = (card.getAttribute('data-food-name') || '').toLowerCase();
    if (!q || name.includes(q)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// =============================================================================
// 15. MODAL SYSTEM
// =============================================================================
function setupModalHandlers() {
  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
    });
  });

  // Close on outside click
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Open Custom Food Modal
  const btnCustomFood = document.getElementById('btnOpenCustomFoodModal');
  if (btnCustomFood) {
    btnCustomFood.addEventListener('click', () => {
      const select = document.getElementById('inputFoodCategory');
      if (select) select.value = AppState.activeFoodMenu;
      document.getElementById('modalAddFood').classList.add('active');
    });
  }

  // Open Custom Food from specific category button
  document.querySelectorAll('[data-open-custom-for]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-open-custom-for');
      const select = document.getElementById('inputFoodCategory');
      if (select) select.value = cat;
      document.getElementById('modalAddFood').classList.add('active');
    });
  });

  // Open Custom Workout Modal
  const btnOpenWorkout = document.getElementById('btnOpenWorkoutModal');
  if (btnOpenWorkout) {
    btnOpenWorkout.addEventListener('click', () => {
      document.getElementById('modalAddWorkout').classList.add('active');
    });
  }

  // Open Goal / Profile Modal
  const btnGoalHeader = document.getElementById('btnOpenGoalModal');
  const btnProfileHeader = document.getElementById('btnOpenProfileModal');
  const btnGoalInline = document.getElementById('btnEditGoalInline');

  const openGoalModal = () => {
    const inputGoal = document.getElementById('inputGoalValue');
    const inputGender = document.getElementById('inputProfileGender');
    const inputAge = document.getElementById('inputProfileAge');

    if (inputGoal) inputGoal.value = AppState.goal;
    if (inputGender) inputGender.value = AppState.profile.gender;
    if (inputAge) inputAge.value = AppState.profile.age;

    document.getElementById('modalEditGoal').classList.add('active');
  };

  if (btnGoalHeader) btnGoalHeader.addEventListener('click', openGoalModal);
  if (btnProfileHeader) btnProfileHeader.addEventListener('click', openGoalModal);
  if (btnGoalInline) btnGoalInline.addEventListener('click', openGoalModal);
}

function handleAddCustomFoodSubmit(e) {
  e.preventDefault();
  const cat = document.getElementById('inputFoodCategory').value;
  const name = document.getElementById('inputFoodName').value.trim();
  const kcal = parseInt(document.getElementById('inputFoodKcal').value, 10);
  const portion = document.getElementById('inputFoodPortion').value.trim() || '១ ចាន';
  const protein = parseInt(document.getElementById('inputFoodProtein').value, 10) || 0;
  const carbs = parseInt(document.getElementById('inputFoodCarbs').value, 10) || 0;
  const fat = parseInt(document.getElementById('inputFoodFat').value, 10) || 0;

  if (!name || isNaN(kcal) || kcal <= 0) {
    showToast('សូមបញ្ចូលឈ្មោះអាហារ និងកាឡូរីឱ្យបានត្រឹមត្រូវ', 'warn');
    return;
  }

  AppState.meals.push({
    id: 'm_' + Date.now(),
    name,
    kcal,
    category: cat,
    portion,
    protein,
    carbs,
    fat,
    date: new Date().toISOString().split('T')[0],
  });

  saveMeals();
  document.getElementById('modalAddFood').classList.remove('active');
  e.target.reset();
  renderAll();
  showToast(`បានបន្ថែមអាហារ៖ ${name} (${kcal} kcal)`, 'success');
}

function handleAddCustomWorkoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('inputWorkoutName').value.trim();
  const min = parseInt(document.getElementById('inputWorkoutMinutes').value, 10);
  const kcal = parseInt(document.getElementById('inputWorkoutKcal').value, 10);

  if (!name || isNaN(kcal) || kcal <= 0) {
    showToast('សូមបញ្ចូលឈ្មោះកីឡា និងកាឡូរីដុតចេញ', 'warn');
    return;
  }

  AppState.workouts.push({
    id: 'w_' + Date.now(),
    name,
    minutes: min || 30,
    kcal,
    date: new Date().toISOString().split('T')[0],
  });

  saveWorkouts();
  document.getElementById('modalAddWorkout').classList.remove('active');
  e.target.reset();
  renderAll();
  showToast(`បានបន្ថែមការហាត់ប្រាណ៖ ${name} (-${kcal} kcal)`, 'success');
}

function handleEditGoalProfileSubmit(e) {
  e.preventDefault();
  const newGoal = parseInt(document.getElementById('inputGoalValue').value, 10);
  const gender = document.getElementById('inputProfileGender').value;
  const age = parseInt(document.getElementById('inputProfileAge').value, 10);

  if (newGoal >= 800 && newGoal <= 6000) {
    AppState.goal = newGoal;
    AppState.profile.gender = gender;
    AppState.profile.age = age || 45;

    saveGoal(newGoal);
    saveProfile();

    document.getElementById('modalEditGoal').classList.remove('active');
    renderAll();
    showToast(`បានរក្សាទុកគោលដៅ: ${newGoal.toLocaleString()} kcal`, 'success');
  } else {
    showToast('កាឡូរីគោលដៅគួរស្ថិតនៅចន្លោះពី ៨០០ ទៅ ៦,០០០ kcal', 'warn');
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warn') icon = '⚠️';
  if (type === 'danger') icon = '🚨';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px) scale(0.9)';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

// Export Backup JSON
function exportBackupJSON() {
  const backupData = {
    app: '«សុខភាពខ្ញុំ» Fitness & Calorie Tracker',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    profile: AppState.profile,
    goal: AppState.goal,
    meals: AppState.meals,
    workouts: AppState.workouts,
    water: AppState.water,
    sleepHistory: AppState.sleepHistory,
    history: AppState.history,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `SokhapheapKhnhom_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  showToast('បានទាញយកឯកសារបម្រុងទុក (Backup JSON) ដោយជោគជ័យ!', 'success');
}

// =============================================================================
// 16. ENTRY POINT
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAppState();
  setupEventListeners();
  renderAll();
});
