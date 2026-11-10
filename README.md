# សប្បាយ សប្បាយ (Sabay Sabay) - Modern Khmer Social & Health Tracker

គេហទំព័រ Web Application **សប្បាយ សប្បាយ** ដ៏ទំនើប ស្រស់ស្អាតឥតខ្ចោះ ដំណើរការលើ Single Page Architecture (SPA) ជាមួយ HTML5, CSS3, និង Vanilla JavaScript (ES6+) ជាភាសាខ្មែរ ១០០% ស្របតាមស្តង់ដារវចនានុក្រមសម្តេចព្រះសង្ឃរាជ ជួន ណាត ដោយរួមបញ្ចូលគ្នារវាងបណ្តាញសង្គមបែប Facebook (Connected User Network, Privacy Controls, Profile, Story, Collage Feed, Interactive Comments, Lightbox) និងប្រព័ន្ធតាមដានសុខភាព អាហារ កាឡូរី ដំណេក និងលំហាត់ប្រាណវ័យ ៤០+។

---

## 🌟 លក្ខណៈពិសេសចម្បង (Key Features)

### ១. បណ្តាញអ្នកប្រើប្រាស់តភ្ជាប់គ្នាជាប្រព័ន្ធ (Connected Facebook Network)
- **User ទាំងអស់ភ្ជាប់គ្នាជាប្រព័ន្ធដូច Facebook:**
  - អ្នកប្រើប្រាស់ទាំងអស់ (`Seang Kunthea`, `Hout Kimsan`, `សុខ វិបុល`, `លីណា សាន`) អាចមើលឃើញរូបភាព និងការបង្ហោះរបស់គ្នាទៅវិញទៅមកនៅលើ Community Feed។
  - អាចចុចលើរូប Avatar ឬឈ្មោះម្ចាស់ Post ដើម្បីចូលទៅកាន់ទំព័រ Profile របស់គេបានភ្លាមៗ។
- **ប្រអប់ប្តូរគណនីនៅលើ Header (`👥 គណនី`):**
  - អនុញ្ញាតឱ្យធ្វើតេស្តប្តូរគណនីភ្លាមៗរវាង `Seang Kunthea`, `Hout Kimsan`, `សុខ វិបុល`, `លីណា សាន` ឬ `ភ្ញៀវ (Guest)` ដើម្បីសាកល្បងមើលការតភ្ជាប់គ្នា និងសិទ្ធិមើលឃើញរូបភាព។

---

### ២. ផ្ទាំងជ្រើសរើសភាពឯកជន (Post Privacy: សាធារណៈ vs. ឯកជនភាព)
- **សារលោតសួរពេល User Post រូបភាព (`#modalPostPrivacyConfirm`):**
  - នៅពេល User ចុចចែករំលែកការបង្ហោះ ប្រព័ន្ធនឹងបង្ហាញផ្ទាំងជ្រើសរើសភាពឯកជន៖
    1. **🌐 សាធារណៈ (Public):** គ្រប់ User ទាំងអស់នៅលើប្រព័ន្ធអាចមើលឃើញរូបភាពនេះ។
    2. **🔒 ឯកជនភាព (Private / Only Me):** គ្រប់ User ផ្សេងទៀតមិនអាចមើលឃើញរូបនេះឡើយ (មានតែម្ចាស់ Post ប៉ុណ្ណោះដែលអាចមើលឃើញ)។
- **ការអនុវត្តភាពឯកជនជាក់ស្តែង (Privacy Filtering ដូច Facebook):**
  - បើ Post ឯកជនភាព៖ រូបនេះនឹងបង្ហាញតែលើ Feed និង Profile របស់ម្ចាស់ Post ផ្ទាល់ប៉ុណ្ណោះ។ ពេលប្តូរទៅកាន់ User ផ្សេង ឬ Guest រូបភាពនេះនឹងត្រូវលាក់បាត់ស្វ័យប្រវត្តិ។
  - មាន Badge បញ្ជាក់ច្បាស់លាស់នៅក្បែរម៉ោងបង្ហោះ៖ `🌐 សាធារណៈ` ឬ `🔒 ឯកជនភាព`។

---

### ៣. ការកំណត់ Logo ក្នុង Menu «ព័ត៌មានផ្ទាល់ខ្លួន» (Header Logo Customization)
- **រក្សាព័ត៌មានរបស់ម្ចាស់ Account:**
  - ផ្ទុកទិន្នន័យផ្ទាល់ខ្លួន៖ ឈ្មោះ, ភេទ, អាយុ, កម្ពស់, គីឡូ, គោលដៅកាឡូរី, Bio, និងរូបថត Profile។
- **ម្ចាស់ Account អាចប្តូរ Logo ចេញ ជំនួសដោយរូបម្ចាស់ Account:**
  - នៅក្នុង Menu ព័ត៌មានផ្ទាល់ខ្លួន មានប្រអប់កំណត់ Logo លើ Header៖
    - **`✨ ប្រើ Logo ថ្មី Sabay_Logo.jpg`** ➔ កំណត់ប្រើ Logo ផ្លូវការ Sabay_Logo.jpg។
    - **`👤 ប្តូរ Logo ដាក់រូបម្ចាស់ Account`** ➔ ប្តូរ Logo លើ Header ទៅជារូបថត Profile របស់ម្ចាស់ Account ភ្លាមៗ (ដូច Facebook)!
    - **`📁 Upload Logo ផ្ទាល់ខ្លួន`** ➔ អាច Upload រូប Logo ផ្ទាល់ខ្លួនពីកុំព្យូទ័របាន។
  - រាល់ការកំណត់ត្រូវបានរក្សាទុកជាប់ក្នុង `localStorage` មិនបាត់បង់ឡើយ។

---

### ៤. ស៊ុមគែមរូបភាព និងប៊ូតុងសកម្មភាព Facebook (Post Framing & FB Action Bar)
- **រូបភាព និង Post មានស៊ុម មានគែម ព័ទ្ធជុំវិញ ហើយដាច់ៗពីគ្នា:**
  - កាត Post នីមួយៗមានស៊ុមរឹងមាំ (`border: 1.5px solid var(--border-color)`), គែមមូលស្អាត (`border-radius: 14px`), និងគម្លាតដាច់ពីគ្នា (`margin-bottom: 2rem`) ព្រមទាំងស្រមោលទាក់ទាញ។
  - រូបភាពក្នុង Post មានស៊ុមព័ទ្ធជុំវិញច្បាស់លាស់។
- **ប៊ូតុងសកម្មភាព Facebook រាងៗខ្លួនលើគ្រប់ Post:**
  - **`👍 ចូលចិត្ត` (Like):** ចុចប្តូរពណ៌ទៅជា `❤️ ចូលចិត្តរួច` ព្រមទាំងបង្កើនចំនួន Like។
  - **`💬 បញ្ចេញមតិ` (Comment):** ចុចដើម្បីផ្តោតលើប្រអប់សរសេរមតិ និងឆ្លើយតបគ្នា។
  - **`↗️ ចែករំលែក` (Share):** ចែករំលែកការបង្ហោះ។
- **ផ្នែកខាងលើ ខាងឆ្វេងនៃ Post:**
  - បង្ហាញរូប Profile មូលរបស់ម្ចាស់ Post និងឈ្មោះម្ចាស់ Account យ៉ាងច្បាស់ ជាមួយម៉ោង និង Badge ភាពឯកជន។
  - ផ្នែកខាងស្តាំមានសញ្ញាចុច ៣ (`···`) ជាមួយជម្រើស **`🗑️ លុបរូបចេញ`** សម្រាប់ម្ចាស់ Post។

---

### ៥. ការអនុវត្តបំរាម និងការការពារសិទ្ធិ (Strict Security & Prohibitions)
1. **User មួយ មិនអាចលុប ឬកែប្រែទិន្នន័យ User មួយទៀតបានទេ:** លាក់ប៊ូតុងកែប្រែ និងលុបនៅពេលមើល Profile ឬ Post របស់អ្នកដទៃ។
2. **User ដែលមិនទាន់ Sign Up (Guest) មានសិទ្ធិត្រឹមមើល:** មិនអាចចុច Like, Comment, Share ឬ Post បានឡើយ។
3. **សារជូនដំណឹង:** បង្ហាញសារ **`«សូមចុះឈ្មោះជាមុនសិន បែប ងាយ ងាយ»`** ភ្ជាប់មកជាមួយប៊ូតុង **`✨ ចុះឈ្មោះឥឡូវនេះ (Sign Up)`**។

---

### ៦. ការរក្សាដំណើរការមុខងារដើម ១០០% (Zero Negative Impact)
- **Menu អាហារទាំង ៥ ប្រភេទ និងទឹកសុទ្ធ ០ kcal:** ដំណើរការធម្មតា។
- **ការតាមដានជាតិទឹក (Water Tracker):** តាមដាន ៨ កែវ (២,០០០ ml)។
- **តាមដានដំណេក (Smart Sleep Tracker):** គណនាដំណេកយប់ និងដំណេកថ្ងៃ។
- **គន្លឹះសុខភាព (វ័យ ៤០+):** ការណែនាំវេជ្ជសាស្ត្រកីឡា ៤០+ និង Routine ៧ ថ្ងៃ។
- **ស្ថិតិ និងរបាយការណ៍ (Analytics Charts):** គំនូសតាង Canvas សម្រាប់ Daily, Weekly, Monthly។

---

## 📁 រចនាសម្ព័ន្ធឯកសារគម្រោង (File Structure)

```text
fitness_calorie_tracker/
├── index.html                   # Single Page Application (Network, Privacy Modal, Logo Customization)
├── style.css                    # CSS3 Stylesheet (Facebook Action Bar, Post Framing, Privacy Cards)
├── app.js                       # Vanilla JavaScript (Network Engine, Privacy Filtering, Logo Switcher)
├── README.md                    # ឯកសារណែនាំគម្រោងពេញលេញ
├── run_server.bat               # ឯកសារ Batch សម្រាប់បើក Local Server រហ័ស
├── Sabay_Logo.jpg               # Logo ថ្មីផ្លូវការ «សប្បាយ សប្បាយ»
├── profile_cover.jpg            # Cover Photo ទេសភាពភ្នំ & វត្តអារាម
├── profile_avatar_seang.jpg     # រូប Profile លោក Seang Kunthea
├── post_hout_avatar.jpg         # រូប Avatar លោក Hout Kimsan
├── post_hout_top.jpg            # រូបថតកាហ្វេ & ទាហាន (Collage ធំខាងលើ)
├── post_hout_bottom_left.jpg    # រូបថតចានអាហារពេលព្រឹក (Collage ឆ្វេងក្រោម)
├── post_hout_bottom_right.jpg   # រូបថតអាគារវត្តអារាម (Collage ស្តាំក្រោម)
├── story_create.jpg             # រូបគំរូ Story Create
├── story_chhorm.jpg             # រូប Story Chhorm Ratha
├── story_oeun.jpg               # រូប Story Oeun Sok Neath
├── story_violet.jpg             # រូប Story Violet Muse
├── story_oun.jpg                # រូប Story Oun Makara
└── story_leakhena.jpg           # រូប Story Leakhena Long
```

---

## 🚀 របៀប Upload ឯកសារឡើង GitHub (Upload to GitHub)

ដើម្បី Upload ឯកសារដែលបានកែសម្រួលរួចឡើងទៅកាន់ GitHub Repository [HealthyProject](https://github.com/seangkuntheaktaramf-commits/HealthyProject)៖

1. បើកគេហទំព័រ GitHub៖ `https://github.com/seangkuntheaktaramf-commits/HealthyProject`
2. ចុចប៊ូតុង **`Add file`** ➔ ជ្រើសរើស **`Upload files`**
3. អូសទាញ (Drag & Drop) ឯកសារដែលបានធ្វើបច្ចុប្បន្នភាព៖
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
4. នៅខាងក្រោម ចុចប៊ូតុងបៃតង **`Commit changes`** ជាការស្រេច! 🎉
