/* ==========================================================================
   SUBLEVEL / 地脉 — VOL. 02: UDG / UG
   Scope: forward-facing underground rap/hip-hop. Release years are not limited.

   "UDG" here refers to the UnDefined Generation wave around NetEase Cloud
   Music's UDG rap compilation: rough, self-defined, genre-blurring new voices.
   "UG" refers to underground as a self-organised, non-mainstream scene and
   release practice across eras and styles.

   Style labels keep their English scene names: Plugg, Pluggnb, Rage, Jerk,
   Sigilkore, Digicore, Hyperpop and others.

   Every artist carries primary + secondary styles. If a sound deliberately
   refuses classification, it falls back to the broad "hip-hop" umbrella.

   Preview clips and release metadata are drawn from the public Apple Music
   catalogue through the iTunes Search API (checked 2026-10-31).
   ========================================================================== */
(function () {
  "use strict";

  const REGIONS = [
    {
      id: "cn",
      code: "CN",
      color: "#ff6a43",
      name: { zh: "中国大陆", en: "Mainland China", ko: "중국 본토", ja: "中国本土" },
      shortName: { zh: "中国大陆", en: "China", ko: "중국", ja: "中国" }
    },
    {
      id: "hktw",
      code: "HK/TW",
      color: "#d9ff43",
      name: { zh: "港台", en: "Hong Kong & Taiwan", ko: "홍콩·대만", ja: "香港・台湾" },
      shortName: { zh: "港台", en: "HK/TW", ko: "홍콩·대만", ja: "香港・台湾" }
    },
    {
      id: "kr",
      code: "KR",
      color: "#c7b6ff",
      name: { zh: "韩国", en: "Korea", ko: "한국", ja: "韓国" },
      shortName: { zh: "韩国", en: "Korea", ko: "한국", ja: "韓国" }
    },
    {
      id: "jp",
      code: "JP",
      color: "#8ed0ff",
      name: { zh: "日本", en: "Japan", ko: "일본", ja: "日本" },
      shortName: { zh: "日本", en: "Japan", ko: "일본", ja: "日本" }
    },
    {
      id: "na",
      code: "NA",
      color: "#ffc29a",
      name: { zh: "北美", en: "North America", ko: "북미", ja: "北米" },
      shortName: { zh: "北美", en: "N. America", ko: "북미", ja: "北米" }
    },
    {
      id: "eu",
      code: "EU",
      color: "#ade8c4",
      name: { zh: "欧洲", en: "Europe", ko: "유럽", ja: "ヨーロッパ" },
      shortName: { zh: "欧洲", en: "Europe", ko: "유럽", ja: "欧州" }
    }
  ];

  const STYLES = [
  {
    "id": "plugg",
    "name": "Plugg",
    "nameZh": "插头音乐"
  },
  {
    "id": "pluggnb",
    "name": "Pluggnb",
    "nameZh": "插头R&B"
  },
  {
    "id": "rage",
    "name": "Rage",
    "nameZh": "狂怒说唱"
  },
  {
    "id": "jerk",
    "name": "Jerk",
    "nameZh": "杰克说唱"
  },
  {
    "id": "sigilkore",
    "name": "Sigilkore",
    "nameZh": "符文核"
  },
  {
    "id": "digicore",
    "name": "Digicore",
    "nameZh": "数字核"
  },
  {
    "id": "hyperpop",
    "name": "Hyperpop",
    "nameZh": "超流行"
  },
  {
    "id": "cloud-rap",
    "name": "Cloud Rap",
    "nameZh": "云端说唱"
  },
  {
    "id": "experimental",
    "name": "Experimental Hip-Hop",
    "nameZh": "实验嘻哈"
  },
  {
    "id": "industrial",
    "name": "Industrial Hip-Hop",
    "nameZh": "工业说唱"
  },
  {
    "id": "alternative",
    "name": "Alternative Hip-Hop",
    "nameZh": "另类说唱"
  },
  {
    "id": "emo-rap",
    "name": "Emo Rap",
    "nameZh": "情绪说唱"
  },
  {
    "id": "hip-hop",
    "name": "Hip-Hop",
    "nameZh": "嘻哈音乐"
  }
];

  const PLATFORMS = {
    spotify: {
      tag: "SP",
      className: "spotify",
      name: { zh: "Spotify", en: "Spotify", ko: "Spotify", ja: "Spotify" },
      url: (q) => "https://open.spotify.com/search/" + encodeURIComponent(q)
    },
    apple: {
      tag: "AM",
      className: "apple",
      name: { zh: "Apple Music", en: "Apple Music", ko: "Apple Music", ja: "Apple Music" },
      url: (q) => "https://music.apple.com/search?term=" + encodeURIComponent(q)
    },
    youtube: {
      tag: "YT",
      className: "youtube",
      name: { zh: "YouTube Music", en: "YouTube Music", ko: "YouTube Music", ja: "YouTube Music" },
      url: (q) => "https://music.youtube.com/search?q=" + encodeURIComponent(q)
    },
    netease: {
      tag: "NE",
      className: "netease",
      name: { zh: "网易云音乐", en: "NetEase Cloud Music", ko: "넷이즈 클라우드 뮤직", ja: "網易雲音楽" },
      url: (q) => "https://music.163.com/#/search/m/?s=" + encodeURIComponent(q) + "&type=1"
    },
    qq: {
      tag: "QQ",
      className: "qq",
      name: { zh: "QQ 音乐", en: "QQ Music", ko: "QQ 뮤직", ja: "QQ音楽" },
      url: (q) => "https://y.qq.com/n/ryqq/search?w=" + encodeURIComponent(q) + "&t=song"
    },
    kkbox: {
      tag: "KK",
      className: "kkbox",
      name: { zh: "KKBOX", en: "KKBOX", ko: "KKBOX", ja: "KKBOX" },
      url: (q) => "https://www.kkbox.com/tw/tc/search?q=" + encodeURIComponent(q)
    },
    melon: {
      tag: "ML",
      className: "melon",
      name: { zh: "Melon", en: "Melon", ko: "Melon", ja: "Melon" },
      url: (q) => "https://www.melon.com/search/total/index.htm?q=" + encodeURIComponent(q)
    },
    bugs: {
      tag: "BG",
      className: "bugs",
      name: { zh: "Bugs", en: "Bugs", ko: "Bugs", ja: "Bugs" },
      url: (q) => "https://music.bugs.co.kr/search/integrated?q=" + encodeURIComponent(q)
    },
    line: {
      tag: "LM",
      className: "line",
      name: { zh: "LINE MUSIC", en: "LINE MUSIC", ko: "LINE MUSIC", ja: "LINE MUSIC" },
      url: (q) => "https://music.line.me/search/all?query=" + encodeURIComponent(q)
    },
    amazon: {
      tag: "AZ",
      className: "amazon",
      name: { zh: "Amazon Music", en: "Amazon Music", ko: "Amazon Music", ja: "Amazon Music" },
      url: (q) => "https://music.amazon.co.jp/search?keywords=" + encodeURIComponent(q)
    },
    soundcloud: {
      tag: "SC",
      className: "soundcloud",
      name: { zh: "SoundCloud", en: "SoundCloud", ko: "SoundCloud", ja: "SoundCloud" },
      url: (q) => "https://soundcloud.com/search?q=" + encodeURIComponent(q)
    },
    bandcamp: {
      tag: "BC",
      className: "bandcamp",
      name: { zh: "Bandcamp", en: "Bandcamp", ko: "Bandcamp", ja: "Bandcamp" },
      url: (q) => "https://bandcamp.com/search?q=" + encodeURIComponent(q)
    }
  };

  const REGION_PLATFORMS = {
    cn: ["netease", "qq", "spotify", "apple", "youtube"],
    hktw: ["kkbox", "spotify", "apple", "youtube", "netease"],
    kr: ["melon", "bugs", "spotify", "apple", "youtube"],
    jp: ["line", "amazon", "spotify", "apple", "youtube"],
    na: ["spotify", "apple", "youtube", "soundcloud", "bandcamp"],
    eu: ["spotify", "apple", "youtube", "soundcloud", "bandcamp"]
  };

  const ARTISTS = [
  {
    "id": "bloodz-boi",
    "region": "cn",
    "name": {
      "zh": "血男孩",
      "en": "Bloodz Boi",
      "ko": "블러즈 보이",
      "ja": "ブラッズ・ボーイ"
    },
    "latin": "BLOODZ BOI",
    "initial": "血",
    "base": {
      "zh": "北京",
      "en": "Beijing",
      "ko": "베이징",
      "ja": "北京"
    },
    "tags": [
      "Industrial",
      "Ambient Rap",
      "Noise"
    ],
    "heat": 89,
    "bio": {
      "zh": "北京实验音乐人、说唱歌手，被 Dazed 称为“中国地下说唱的谦逊教父”。从工业、ambient 到说唱，他的声音一直在拆边界；2026 年与 jackzebra 合作专辑《Bloodzebra》。",
      "en": "A Beijing experimental artist and rapper described by Dazed as the humble godfather of Chinese underground rap. Moving through industrial, ambient and rap, he keeps dissolving the borders; his 2026 album with jackzebra is Bloodzebra.",
      "ko": "베이징의 실험 음악가이자 래퍼. Dazed가 ‘중국 언더그라운드 랩의 겸손한 대부’라고 부른 인물이다. 인더스트리얼, 앰비언트, 랩을 오가며 경계를 해체하고, 2026년 jackzebra와 《Bloodzebra》를 발표했다.",
      "ja": "北京の実験音楽家／ラッパー。Dazedに「中国アンダーグラウンド・ラップの謙虚なゴッドファーザー」と呼ばれた。インダストリアル、アンビエント、ラップを行き来しながら境界を溶かし、2026年にjackzebraとの『Bloodzebra』を発表。"
    },
    "project": {
      "title": "Bloodzebra",
      "type": "album",
      "date": "2026-03-20",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/bloodzebra/1886924631?uo=4",
      "preview": {
        "title": "Timezone",
        "durationMs": 140380,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9b/23/1c/9b231cdf-18c3-f1db-fd84-b0e82c50266a/mzaf_14182251558678097339.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/40/a4/74/40a474a0-f9d5-3353-c654-0dd780e94b44/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/timezone/1886924631?i=1886924632&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/bloodz-boi/825094034?uo=4",
    "styles": [
      "experimental",
      "industrial"
    ],
    "avatar": "avatars/bloodz-boi.jpg",
    "neteaseId": "2103",
    "avatarSource": "netease"
  },
  {
    "id": "yaka",
    "region": "cn",
    "name": {
      "zh": "Yaka",
      "en": "Yaka",
      "ko": "야카",
      "ja": "ヤカ"
    },
    "latin": "YAKA",
    "initial": "YK",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "Jungle",
      "Breakbeat",
      "Rage"
    ],
    "heat": 86,
    "bio": {
      "zh": "来自中国的制作人/说唱歌手，把 jungle、breakbeat、rage 和电子俱乐部声响压进同一条低频。UDG 企划中被点名的代表声音之一；2024 年专辑《¡2busy4u! Jungle Rage》。",
      "en": "A Chinese producer and rapper compressing jungle, breakbeat, rage and club electronics into one low-end pressure system. One of the voices highlighted in the UDG project; his 2024 album is ¡2busy4u! Jungle Rage.",
      "ko": "중국의 프로듀서이자 래퍼. 정글, 브레이크비트, 레이지, 클럽 전자음을 하나의 저음 압력으로 밀어붙인다. UDG 프로젝트에서 주목한 목소리 중 하나이며, 2024년 《¡2busy4u! Jungle Rage》를 발표했다.",
      "ja": "中国のプロデューサー／ラッパー。ジャングル、ブレイクビート、レイジ、クラブ・エレクトロニクスをひとつの低音圧に押し込む。UDG企画で注目された声のひとつで、2024年作は『¡2busy4u! Jungle Rage』。"
    },
    "project": {
      "title": "IU",
      "type": "single",
      "date": "2024-07-19",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/iu-single/1755869911?uo=4",
      "preview": {
        "title": "IU",
        "durationMs": 240000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c0/aa/f4/c0aaf4eb-8a9b-bb17-73e4-739cfe4c6be9/mzaf_8500783459918573801.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/89/11/29/89112937-b6e2-3054-3c73-579e90cb2a79/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/iu/1755869911?i=1755869913&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/yaka/1519813408?uo=4",
    "styles": [
      "rage"
    ],
    "avatar": "avatars/yaka.jpg",
    "neteaseId": "32992079",
    "avatarSource": "netease"
  },
  {
    "id": "charity-ssb",
    "region": "cn",
    "name": {
      "zh": "Charity SsB",
      "en": "Charity SsB",
      "ko": "채러티 SsB",
      "ja": "チャリティ・SsB"
    },
    "latin": "CHARITY SSB",
    "initial": "CS",
    "base": {
      "zh": "上海",
      "en": "Shanghai",
      "ko": "상하이",
      "ja": "上海"
    },
    "tags": [
      "Industrial",
      "Club",
      "Art Pop"
    ],
    "heat": 87,
    "bio": {
      "zh": "上海制作人与歌手，Genome 6.66 Mbp 和 Vroskiii 的成员。从工业、club、rave 到 reggaeton，他的作品没有固定轮廓；2024 年专辑《Clemency》把这种不稳定性推到极致。",
      "en": "A Shanghai vocalist and producer, member of Genome 6.66 Mbp and Vroskiii. His records move through industrial, club, rave and reggaeton without settling into one outline; 2024's Clemency turns that instability into a full-length statement.",
      "ko": "상하이의 보컬리스트이자 프로듀서. Genome 6.66 Mbp와 Vroskiii의 멤버다. 인더스트리얼, 클럽, 레이브, 레게톤을 오가며 하나의 윤곽에 정착하지 않고, 2024년 《Clemency》에서 그 불안정성을 완성했다.",
      "ja": "上海のヴォーカリスト／プロデューサー。Genome 6.66 MbpとVroskiiiのメンバー。インダストリアル、クラブ、レイヴ、レゲトンを行き来し、ひとつの輪郭に落ち着かない。2024年『Clemency』でその不安定さを一枚にした。"
    },
    "project": {
      "title": "Clemency",
      "type": "album",
      "date": "2024-08-16",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/clemency/1761952664?uo=4",
      "preview": {
        "title": "The Courier",
        "durationMs": 247975,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6e/0e/d9/6e0ed95d-a2e7-e558-15d5-7cf0fb6f9504/mzaf_7086903630342550871.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ef/47/62/ef47626e-c7f3-9a26-7830-745f78de4235/cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/the-courier/1761952664?i=1761952980&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/charity/1540081424?uo=4",
    "styles": [
      "experimental",
      "alternative"
    ],
    "avatar": "https://cdn-images.dzcdn.net/images/artist/43d15164bc593818f63c4e51d53e9914/500x500-000000-80-0-0.jpg"
  },
  {
    "id": "chaozhou-tugou",
    "region": "hktw",
    "name": {
      "zh": "潮州土狗",
      "en": "Chaozhou TuGou",
      "ko": "차오저우 투거우",
      "ja": "チャオジョウ・トゥゴウ"
    },
    "latin": "CHAOZHOU TUGOU",
    "initial": "狗",
    "base": {
      "zh": "台湾",
      "en": "Taiwan",
      "ko": "대만",
      "ja": "台湾"
    },
    "tags": [
      "Hyperpop",
      "Rage",
      "Internet Rap"
    ],
    "heat": 87,
    "bio": {
      "zh": "台湾新生代里最不按牌理出牌的名字之一，用 hyperpop、rage 与网络语感把说唱推向失真。2026 年单曲《雙眼皮男孩》继续扩大他的怪诞宇宙。",
      "en": "One of Taiwan's least predictable new voices, pushing rap into distortion through hyperpop, rage and internet-born humour. His 2026 single Double-Eyelid Boys keeps expanding that absurd universe.",
      "ko": "대만의 가장 예측 불가능한 신예 중 하나. 하이퍼팝, 레이지, 인터넷 감성으로 랩을 왜곡 쪽으로 밀어붙인다. 2026년 싱글 〈雙眼皮男孩〉로 그 기묘한 세계를 더 넓혔다.",
      "ja": "台湾のニュー・ジェネレーションで最も予測不能な一人。ハイパーポップ、レイジ、インターネット的なユーモアでラップを歪ませる。2026年シングル「雙眼皮男孩」でその奇妙な世界をさらに広げた。"
    },
    "project": {
      "title": "雙眼皮男孩 (feat. 徐晧程徐晧程)",
      "type": "single",
      "date": "2026-08-18",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/%E9%9B%99%E7%9C%BC%E7%9A%AE%E7%94%B7%E5%AD%A9-feat-%E5%BE%90%E6%99%A7%E7%A8%8B%E5%BE%90%E6%99%A7%E7%A8%8B-single/6798613481?uo=4",
      "preview": {
        "title": "Double-Eyelid Boys (feat. LilHAO)",
        "durationMs": 160615,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cc/91/55/cc91557d-c5c0-3e48-1cfb-a19cd98ac0c1/mzaf_13031316669541866155.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5e/e4/b7/5ee4b7f9-0d74-4388-39b3-6556a41c51ca/193017211535_new.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/double-eyelid-boys-feat-lilhao/6798613481?i=6798613482&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/tw/artist/%E6%BD%AE%E5%B7%9E%E5%9C%9F%E7%8B%97/1547663854?uo=4",
    "styles": [
      "hyperpop",
      "rage"
    ],
    "avatar": "avatars/chaozhou-tugou.jpg",
    "neteaseId": "52490120",
    "avatarSource": "netease"
  },
  {
    "id": "sowut",
    "region": "hktw",
    "name": {
      "zh": "SOWUT",
      "en": "SOWUT",
      "ko": "SOWUT",
      "ja": "SOWUT"
    },
    "latin": "SOWUT",
    "initial": "SW",
    "base": {
      "zh": "台北",
      "en": "Taipei",
      "ko": "타이베이",
      "ja": "台北"
    },
    "tags": [
      "Alternative",
      "Electronic",
      "Melodic Rap"
    ],
    "heat": 80,
    "bio": {
      "zh": "台北说唱歌手，长期在 battle、实验制作与旋律说唱之间切换，拒绝被单一场景定义。2026 年专辑《GOOD4SUMMER》依旧在寻找新的重心。",
      "en": "A Taipei rapper who has kept moving between battle rap, experimental production and melodic rap, refusing to be pinned to one scene. His 2026 album GOOD4SUMMER is still looking for a new centre of gravity.",
      "ko": "타이베이의 래퍼. 배틀 랩, 실험적 프로덕션, 멜로디 랩을 오가며 하나의 씬으로 정의되기를 거부한다. 2026년 《GOOD4SUMMER》에서도 새로운 중심을 찾고 있다.",
      "ja": "台北のラッパー。バトル・ラップ、実験的なプロダクション、メロディック・ラップを行き来し、ひとつのシーンに固定されることを拒む。2026年『GOOD4SUMMER』でも新しい重心を探している。"
    },
    "project": {
      "title": "GOOD4SUMMER",
      "type": "album",
      "date": "2026-09-11",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/good4summer/6805065277?uo=4",
      "preview": {
        "title": "247YLSWAGGIN (feat. STACO & T-PLUZ)",
        "durationMs": 183429,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/33/0b/dd/330bddc7-cec8-00dd-337f-3e73c262caf9/mzaf_7316736770040437553.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8e/9d/63/8e9d632b-2c3b-ac5d-52e3-9e4149cc6bd7/4711548162896.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/247ylswaggin-feat-staco-t-pluz/6805065277?i=6805065278&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/tw/artist/sowut/1138324311?uo=4",
    "styles": [
      "hip-hop",
      "alternative"
    ],
    "avatar": "avatars/sowut.jpg",
    "neteaseId": "28481518",
    "avatarSource": "netease"
  },
  {
    "id": "noly",
    "region": "hktw",
    "name": {
      "zh": "N.O.L.Y",
      "en": "N.O.L.Y",
      "ko": "N.O.L.Y",
      "ja": "N.O.L.Y"
    },
    "latin": "N.O.L.Y",
    "initial": "N",
    "base": {
      "zh": "香港",
      "en": "Hong Kong",
      "ko": "홍콩",
      "ja": "香港"
    },
    "tags": [
      "Experimental",
      "Cantonese Rap",
      "Industrial"
    ],
    "heat": 83,
    "bio": {
      "zh": "香港说唱与制作场景的暗面合作者，擅长把工业噪音、粤语声调与梦核采样压进同一空间。2025 年与 YoungQueenz、Floyd Cheung 共同完成《龍寨 DT2》。",
      "en": "A shadow collaborator in Hong Kong rap and production, pressing industrial noise, Cantonese cadence and dreamlike samples into one room. He co-created 2025's Dragon Fort DT2 with YoungQueenz and Floyd Cheung.",
      "ko": "홍콩 랩·프로덕션 씬의 어두운 협업자. 인더스트리얼 노이즈, 광둥어의 억양, 몽환적인 샘플을 한 공간에 밀어 넣는다. 2025년 YoungQueenz, Floyd Cheung과 《龍寨 DT2》를 함께 만들었다.",
      "ja": "香港のラップ／プロダクション・シーンの暗部を担うコラボレーター。インダストリアル・ノイズ、広東語の抑揚、夢のようなサンプルを同じ空間に押し込む。2025年、YoungQueenz、Floyd Cheungと『龍寨 DT2』を共同制作。"
    },
    "project": {
      "title": "龍寨 DT2",
      "type": "album",
      "date": "2025-12-02",
      "tracks": 17,
      "appleUrl": "https://music.apple.com/us/album/%E9%BE%8D%E5%AF%A8-dt2/1856788903?uo=4",
      "preview": {
        "title": "Cimetière Raspail",
        "durationMs": 120500,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a6/8d/9c/a68d9c83-f731-d39a-94e0-2883743c689e/mzaf_1765771939010091583.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ee/2e/30/ee2e3070-ba4b-8da1-d4d6-30de50b30f59/367457939995.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/cimeti%C3%A8re-raspail/1856788903?i=1856788906&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/hk/artist/n-o-l-y/1352606173?uo=4",
    "styles": [
      "experimental",
      "industrial",
      "cloud-rap"
    ],
    "avatar": "avatars/noly.jpg",
    "neteaseId": "27910555",
    "avatarSource": "netease"
  },
  {
    "id": "kim-ximya",
    "region": "kr",
    "name": {
      "zh": "Kim Ximya",
      "en": "Kim Ximya",
      "ko": "김심야",
      "ja": "キム・シムヤ"
    },
    "latin": "KIM XIMYA",
    "initial": "KX",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Spoken Word"
    ],
    "heat": 92,
    "bio": {
      "zh": "首尔实验说唱代表、XXX 成员，把抽象叙事、破碎节拍和近似朗诵的冷感推到前景。2026 年专辑《Dogma》继续拆解“说唱”的边界。",
      "en": "A leading Seoul experimental rapper and member of XXX, foregrounding abstract narrative, broken beats and a cold, almost spoken delivery. His 2026 album Dogma keeps pulling apart the edges of rap.",
      "ko": "서울 실험 랩의 대표 주자이자 XXX 멤버. 추상적 서사, 부서진 비트, 낭독에 가까운 냉담한 전달을 전면에 세운다. 2026년 《Dogma》로 랩의 경계를 계속 해체하고 있다.",
      "ja": "ソウルの実験的ラップを代表する一人で、XXXのメンバー。抽象的な物語、壊れたビート、朗読に近い冷たい語りを前景化する。2026年『Dogma』でラップの輪郭をさらに解体。"
    },
    "project": {
      "title": "Dogma",
      "type": "album",
      "date": "2026-09-09",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/dogma/6805302845?uo=4",
      "preview": {
        "title": "Me Life & Nothing Else",
        "durationMs": 233529,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b4/a5/bd/b4a5bdc8-7248-cf7a-c744-d100724c1e1b/mzaf_11787914668064841286.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/e4/03/8be4038a-809e-3918-a638-c8568d987796/885288355369.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/me-life-nothing-else/6805302845?i=6805302850&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/%EA%B9%80%EC%8B%AC%EC%95%BC/1218103209?uo=4",
    "styles": [
      "experimental"
    ],
    "avatar": "avatars/kim-ximya.jpg",
    "neteaseId": "12342049",
    "avatarSource": "netease"
  },
  {
    "id": "jvcki-wai",
    "region": "kr",
    "name": {
      "zh": "Jvcki Wai",
      "en": "Jvcki Wai",
      "ko": "젭키 와이",
      "ja": "ジェプキー・ワイ"
    },
    "latin": "JVCKI WAI",
    "initial": "JW",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Club",
      "Experimental Trap",
      "Hyperpop"
    ],
    "heat": 88,
    "bio": {
      "zh": "首尔实验说唱与俱乐部场景的异类，高音色、断裂 flow 和强烈的视觉风格自成一派。2025 年与 vangdale 合作《MOLLAK》，把俱乐部声响拧成未来感十足的歌。",
      "en": "A singular presence across Seoul experimental rap and club music: high-pitched delivery, fractured flows and unmistakable visuals. Her 2025 record with vangdale, Mollak, bends club sound into futuristic songs.",
      "ko": "서울 실험 랩과 클럽 사운드를 오가는 독보적 존재. 높은 음색과 파편화된 플로우, 강렬한 비주얼이 트레이드마크다. 2025년 vangdale과의 《MOLLAK》에서 클럽 사운드를 미래적인 노래로 비틀었다.",
      "ja": "ソウルの実験的ラップとクラブ・ミュージックを横断する特異な存在。高い声、断片的なフロウ、鮮烈なビジュアルが武器。2025年、vangdaleとの『MOLLAK』でクラブ・サウンドを未来的な歌へとねじ曲げた。"
    },
    "project": {
      "title": "MOLLAK",
      "type": "album",
      "date": "2025-07-01",
      "tracks": 8,
      "appleUrl": "https://music.apple.com/us/album/mollak/1823646868?uo=4",
      "preview": {
        "title": "GG",
        "durationMs": 152000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/0a/d6/ff0ad6a1-f80c-7749-16ea-4520eec3d93a/mzaf_4043462330378232271.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c0/3d/6b/c03d6b9c-8267-6b03-9574-7a7ecb20e561/888272156249_Cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/gg/1823646868?i=1823646874&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/jvcki-wai/1123982621?uo=4",
    "styles": [
      "experimental"
    ],
    "avatar": "avatars/jvcki-wai.jpg",
    "neteaseId": "12970270",
    "avatarSource": "netease"
  },
  {
    "id": "choilb",
    "region": "kr",
    "name": {
      "zh": "CHOILB",
      "en": "CHOILB",
      "ko": "최엘비",
      "ja": "チェルビ"
    },
    "latin": "CHOILB",
    "initial": "CB",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Alternative",
      "Melodic"
    ],
    "heat": 84,
    "bio": {
      "zh": "首尔另类说唱作者，擅长把日常、旋律和抽象制作折进流行歌结构，让歌听起来既柔软又不稳定。2025 年专辑《her.》是他目前最完整的表达。",
      "en": "A Seoul alternative rapper folding daily life, melody and abstract production into pop-song structures that feel soft and unstable at once. His 2025 album her. is his most complete statement yet.",
      "ko": "서울의 얼터너티브 래퍼. 일상, 멜로디, 추상적인 프로덕션을 팝송 구조에 접어 넣어 부드럽고도 불안정한 노래를 만든다. 2025년 《her.》는 현재까지 가장 완성된 표현이다.",
      "ja": "ソウルのオルタナティブ・ラッパー。日常、メロディ、抽象的なプロダクションをポップ・ソングの構造に折り込み、柔らかくも不安定な歌にする。2025年『her.』は現在の到達点。"
    },
    "project": {
      "title": "her.",
      "type": "album",
      "date": "2025-09-09",
      "tracks": 15,
      "appleUrl": "https://music.apple.com/us/album/her/1837367844?uo=4",
      "preview": {
        "title": "UR GIRL",
        "durationMs": 204655,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/25/a2/fe25a266-1096-7f48-3fd9-f7d98470f9ce/mzaf_4209127932902273236.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/55/91/84/559184d2-26e1-9e3e-4ac9-00a973df4a54/8800331139798_cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/ur-girl/1837367844?i=1837367845&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/%EC%B5%9C%EC%97%98%EB%B9%84/1114670716?uo=4",
    "styles": [
      "alternative",
      "emo-rap"
    ],
    "avatar": "avatars/choilb.jpg",
    "neteaseId": "12645474",
    "avatarSource": "netease"
  },
  {
    "id": "tohji",
    "region": "jp",
    "name": {
      "zh": "Tohji",
      "en": "Tohji",
      "ko": "토지",
      "ja": "トージ"
    },
    "latin": "TOHJI",
    "initial": "TJ",
    "base": {
      "zh": "东京",
      "en": "Tokyo",
      "ko": "도쿄",
      "ja": "東京"
    },
    "tags": [
      "Alternative",
      "Auto-Tune",
      "Club Rap"
    ],
    "heat": 90,
    "bio": {
      "zh": "东京说唱新世代核心之一、Mall Boyz 成员，把 autotune、trap、电子和时尚感变成漂浮的声响。2026 年与 Loota 合作《Kuuga β》。",
      "en": "A core figure in Tokyo's new rap generation and member of Mall Boyz, turning Auto-Tune, trap, electronics and fashion into a floating sound. His 2026 collaboration with Loota is Kuuga β.",
      "ko": "도쿄 신세대 랩의 중심 인물이자 Mall Boyz 멤버. 오토튠, 트랩, 전자음, 패션 감각을 떠다니는 사운드로 만든다. 2026년 Loota와 《Kuuga β》를 발표했다.",
      "ja": "東京の新世代ラップの中心人物で、Mall Boyzのメンバー。オートチューン、トラップ、エレクトロニクス、ファッション感覚を浮遊する音に変える。2026年、Lootaとの『Kuuga β』。"
    },
    "project": {
      "title": "Apck",
      "type": "single",
      "date": "2026-10-21",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/apck-single/6819890701?uo=4",
      "preview": {
        "title": "Apck",
        "durationMs": 162221,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/90/1b/90901b18-a963-8bda-2fe5-026424f8880e/mzaf_1373869804281381408.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5c/16/74/5c167435-36f6-6a3d-77dc-e6bff544dba1/4550795311646_cover.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/apck/6819890701?i=6819890706&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/jp/artist/tohji/1407773789?uo=4",
    "styles": [
      "cloud-rap",
      "alternative"
    ],
    "avatar": "avatars/tohji.jpg",
    "neteaseId": "13904972",
    "avatarSource": "netease"
  },
  {
    "id": "kzm",
    "region": "jp",
    "name": {
      "zh": "kZm",
      "en": "kZm",
      "ko": "kZm",
      "ja": "kZm"
    },
    "latin": "KZM",
    "initial": "KZ",
    "base": {
      "zh": "日本",
      "en": "Japan",
      "ko": "일본",
      "ja": "日本"
    },
    "tags": [
      "Experimental",
      "Bass"
    ],
    "heat": 85,
    "bio": {
      "zh": "日本说唱制作人/rapper、Mall Boyz 成员，用抽象采样、低频和断裂节奏搭出介于俱乐部与说唱之间的空间。2025 年 EP《King of Nostalgia》继续向内部挖掘。",
      "en": "Japanese producer and rapper, a member of Mall Boyz who builds spaces between club music and rap out of abstract samples, low end and broken rhythm. His 2025 EP King of Nostalgia keeps digging inward.",
      "ko": "일본의 프로듀서이자 래퍼, Mall Boyz 멤버. 추상적인 샘플과 저음, 부서진 리듬으로 클럽과 랩 사이의 공간을 만든다. 2025년 EP 《King of Nostalgia》로 더 안쪽을 파고들었다.",
      "ja": "日本のプロデューサー／ラッパーで、Mall Boyzのメンバー。抽象的なサンプル、低音、壊れたリズムでクラブとラップの間の空間をつくる。2025年EP『King of Nostalgia』でさらに内側へ。"
    },
    "project": {
      "title": "246 (feat. Tohji & gummyboy)",
      "type": "single",
      "date": "2026-04-01",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/246-feat-tohji-gummyboy-single/1887292720?uo=4",
      "preview": {
        "title": "246 (feat. Tohji & gummyboy)",
        "durationMs": 233442,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1c/f0/42/1cf04258-0831-2082-5dec-157f0d4f0e30/mzaf_3876335951730336885.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f2/00/a7/f200a764-6b7e-c874-58a3-4b6e5ea1084c/4550754708647_cover.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/246-feat-tohji-gummyboy/1887292720?i=1887292724&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/jp/artist/kzm/1083743314?uo=4",
    "styles": [
      "experimental",
      "cloud-rap"
    ],
    "avatar": "avatars/kzm.jpg",
    "neteaseId": "33899592",
    "avatarSource": "netease"
  },
  {
    "id": "lil-soft-tennis",
    "region": "jp",
    "name": {
      "zh": "Lil Soft Tennis",
      "en": "Lil Soft Tennis",
      "ko": "릴 소프트 테니스",
      "ja": "リル・ソフトテニス"
    },
    "latin": "LIL SOFT TENNIS",
    "initial": "LT",
    "base": {
      "zh": "日本",
      "en": "Japan",
      "ko": "일본",
      "ja": "日本"
    },
    "tags": [
      "Hyperpop",
      "Digicore",
      "Bedroom Pop"
    ],
    "heat": 84,
    "bio": {
      "zh": "日本地下流行与说唱交界处的新鲜异类，旋律甜得发苦，节拍在 digital hardcore 与 hyperpop 之间跳。2024 年 EP《Big Hard Tennis》是他的失真名片。",
      "en": "A fresh outlier where Japanese underground pop meets rap: melodies that are sweet to the point of bitterness, beats that jump between digital hardcore and hyperpop. His 2024 EP Big Hard Tennis is the distorted calling card.",
      "ko": "일본 언더그라운드 팝과 랩의 경계에 있는 신선한 이물. 쓸 만큼 달콤한 멜로디와 디지털 하드코어·하이퍼팝을 오가는 비트가 돋보인다. 2024년 EP 《Big Hard Tennis》가 왜곡된 명함이다.",
      "ja": "日本のアンダーグラウンド・ポップとラップの境界にいる異物。苦いほど甘いメロディ、デジタル・ハードコアとハイパーポップを行き来するビート。2024年EP『Big Hard Tennis』が歪んだ名刺。"
    },
    "project": {
      "title": "Zombie Love",
      "type": "single",
      "date": "2026-05-20",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/zombie-love-single/6766748501?uo=4",
      "preview": {
        "title": "Zombie Love",
        "durationMs": 130049,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/18/c5/69/18c56981-e439-13d9-7acb-ce3b6ab53eb0/mzaf_18161753115443461250.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/30/b2/eb/30b2eb84-375e-7dca-3d5f-c55e45ee0cd6/4550756210872_cover.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/zombie-love/6766748501?i=6766748508&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/jp/artist/lil-soft-tennis/1438054408?uo=4",
    "styles": [
      "hyperpop",
      "digicore"
    ],
    "avatar": "avatars/lil-soft-tennis.jpg",
    "neteaseId": "47079543",
    "avatarSource": "netease"
  },
  {
    "id": "clipping",
    "region": "na",
    "name": {
      "zh": "clipping.",
      "en": "clipping.",
      "ko": "클리핑.",
      "ja": "clipping."
    },
    "latin": "CLIPPING.",
    "initial": "CL",
    "base": {
      "zh": "洛杉矶",
      "en": "Los Angeles",
      "ko": "로스앤젤레스",
      "ja": "ロサンゼルス"
    },
    "tags": [
      "Industrial",
      "Noise",
      "Sci-Fi"
    ],
    "heat": 93,
    "bio": {
      "zh": "洛杉矶实验说唱三人组，把工业噪音、footwork 和科幻叙事焊成一种紧绷的政治声场。2025 年专辑《Dead Channel Sky》是他们迄今最锋利的全长作品。",
      "en": "The Los Angeles experimental rap trio welding industrial noise, footwork and science fiction into a taut political soundfield. Their 2025 album Dead Channel Sky is their sharpest full-length yet.",
      "ko": "로스앤젤레스의 실험 랩 3인조. 인더스트리얼 노이즈, 풋워크, SF 서사를 하나의 팽팽한 정치적 음장으로 용접한다. 2025년 《Dead Channel Sky》는 지금까지 가장 날카로운 정규작이다.",
      "ja": "ロサンゼルスの実験的ラップ・トリオ。インダストリアル・ノイズ、フットワーク、SF的物語を緊迫した政治的サウンドフィールドに溶接する。2025年『Dead Channel Sky』はこれまでで最も鋭いフル・アルバム。"
    },
    "project": {
      "title": "Dead Channel Sky Plus",
      "type": "album",
      "date": "2025-09-19",
      "tracks": 24,
      "appleUrl": "https://music.apple.com/us/album/dead-channel-sky-plus/1822877098?uo=4",
      "preview": {
        "title": "Intro",
        "durationMs": 51426,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/72/73/31/727331e5-3bfb-f048-cffa-18ad2f93e731/mzaf_4260743107368222759.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cc/87/92/cc87927f-12cf-1ebf-a905-feb7509667a9/098787171266.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/intro/1822877098?i=1822877099&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/clipping/810595978?uo=4",
    "styles": [
      "industrial",
      "experimental"
    ],
    "avatar": "avatars/clipping.jpg",
    "neteaseId": "14697958",
    "avatarSource": "netease"
  },
  {
    "id": "backxwash",
    "region": "na",
    "name": {
      "zh": "Backxwash",
      "en": "Backxwash",
      "ko": "백스워시",
      "ja": "バックスウォッシュ"
    },
    "latin": "BACKXWASH",
    "initial": "BX",
    "base": {
      "zh": "蒙特利尔",
      "en": "Montreal",
      "ko": "몬트리올",
      "ja": "モントリオール"
    },
    "tags": [
      "Industrial",
      "Black Metal"
    ],
    "heat": 91,
    "bio": {
      "zh": "蒙特利尔的赞比亚裔制作人/rapper，把黑金属、工业、industrial 与说唱炼成关于生存和反抗的仪式。2025 年专辑《Only Dust Remains》继续燃烧。",
      "en": "A Zambian-Canadian producer and rapper in Montreal forging black metal, industrial, industrial and rap into rituals of survival and defiance. Her 2025 album Only Dust Remains keeps the fire burning.",
      "ko": "몬트리올의 잠비아계 캐나다 프로듀서이자 래퍼. 블랙 메탈, 인더스트리얼, 호러코어, 랩을 생존과 저항의 의식으로 단조한다. 2025년 《Only Dust Remains》는 계속 타오른다.",
      "ja": "モントリオールのザンビア系カナダ人プロデューサー／ラッパー。ブラック・メタル、インダストリアル、ホラーコア、ラップを生存と抵抗の儀式に鍛える。2025年『Only Dust Remains』で炎は消えない。"
    },
    "project": {
      "title": "Only Dust Remains",
      "type": "album",
      "date": "2025-03-28",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/only-dust-remains/1793491480?uo=4",
      "preview": {
        "title": "Black Lazarus",
        "durationMs": 298176,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/be/de/2d/bede2d52-22ff-3968-0388-57029bef3c5a/mzaf_16799037892346594928.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/31/79/d1/3179d1fe-6762-4f73-0b82-0f882261793e/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/black-lazarus/1793491480?i=1793491481&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/backxwash/1360719873?uo=4",
    "styles": [
      "industrial",
      "experimental"
    ],
    "avatar": "avatars/backxwash.jpg",
    "neteaseId": "32567307",
    "avatarSource": "netease"
  },
  {
    "id": "by-storm",
    "region": "na",
    "name": {
      "zh": "By Storm",
      "en": "By Storm",
      "ko": "바이 스톰",
      "ja": "バイ・ストーム"
    },
    "latin": "BY STORM",
    "initial": "BS",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Experimental",
      "Post-Rap"
    ],
    "heat": 90,
    "bio": {
      "zh": "Injury Reserve 的延续：Ritchie with a T 与 Parker Corey 把实验说唱推向更破碎、更旋律化的方向。2026 年专辑《My Ghosts Go Ghost》继续处理失去与重组。",
      "en": "The continuation of Injury Reserve: Ritchie with a T and Parker Corey push experimental rap into more fractured, melodic territory. Their 2026 album My Ghosts Go Ghost keeps working through loss and reconfiguration.",
      "ko": "Injury Reserve의 연장선. Ritchie with a T와 Parker Corey가 실험 랩을 더 파편화되고 멜로디컬한 방향으로 밀어붙인다. 2026년 《My Ghosts Go Ghost》는 상실과 재구성을 계속 다룬다.",
      "ja": "Injury Reserveの継続。Ritchie with a TとParker Coreyが実験的ラップをより断片的でメロディックな領域へ押し広げる。2026年『My Ghosts Go Ghost』は喪失と再構成を扱い続ける。"
    },
    "project": {
      "title": "My Ghosts Go Ghost",
      "type": "album",
      "date": "2026-01-30",
      "tracks": 9,
      "appleUrl": "https://music.apple.com/us/album/my-ghosts-go-ghost/1869647098?uo=4",
      "preview": {
        "title": "Can I Have You For Myself?",
        "durationMs": 321000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/31/8a/fd/318afd3b-2ec7-7b5a-348b-c3d3be6c1095/mzaf_821576975558212453.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/07/8f/21/078f2133-1c3c-aeed-a08f-74f535d7e3e4/193436454834_MGGGCoverIRL.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/can-i-have-you-for-myself/1869647098?i=1869647100&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/by-storm/1700461008?uo=4",
    "styles": [
      "experimental"
    ],
    "avatar": "avatars/by-storm.jpg",
    "neteaseId": "57833306",
    "avatarSource": "netease"
  },
  {
    "id": "blackhaine",
    "region": "eu",
    "name": {
      "zh": "Blackhaine",
      "en": "Blackhaine",
      "ko": "블랙헤인",
      "ja": "ブラックヘイン"
    },
    "latin": "BLACKHAINE",
    "initial": "BH",
    "base": {
      "zh": "英国",
      "en": "United Kingdom",
      "ko": "영국",
      "ja": "イギリス"
    },
    "tags": [
      "Industrial",
      "Noise",
      "Performance"
    ],
    "heat": 89,
    "bio": {
      "zh": "英国实验说唱/表演艺术家，把工业、噪音、舞蹈与北方口音压成一种身体性的压迫感。2022 年 EP《Armour II》仍是理解他的关键入口。",
      "en": "A UK experimental rap and performance artist crushing industrial, noise, dance and a Northern accent into physical pressure. The 2022 EP Armour II remains the key entry point.",
      "ko": "영국의 실험 랩·퍼포먼스 아티스트. 인더스트리얼, 노이즈, 댄스, 북부 억양을 신체적인 압박으로 응축한다. 2022년 EP 《Armour II》가 여전히 핵심 입구다.",
      "ja": "英国の実験的ラップ／パフォーマンス・アーティスト。インダストリアル、ノイズ、ダンス、北部アクセントを身体的な圧に圧縮する。2022年EP『Armour II』が今も重要な入口。"
    },
    "project": {
      "title": "Cold Summer, Pt. 1",
      "type": "single",
      "date": "2023-09-08",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/cold-summer-pt-1-single/1830322149?uo=4",
      "preview": {
        "title": "Cold Summer, Pt. 1",
        "durationMs": 417665,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/37/28/92/37289265-b007-1465-14c9-5402d58008f7/mzaf_15433827310554913609.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/89/91/60/8991606c-b253-0ba8-ce59-61cc0957c1ff/197189328138_PqOnPUSGDgLiIGHnwPRhizomes.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/cold-summer-pt-1/1830322149?i=1830322150&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/gb/artist/blackhaine/1538365614?uo=4",
    "styles": [
      "industrial",
      "experimental"
    ],
    "avatar": "avatars/blackhaine.jpg",
    "neteaseId": "37348840",
    "avatarSource": "netease"
  },
  {
    "id": "nukuluk",
    "region": "eu",
    "name": {
      "zh": "Nukuluk",
      "en": "Nukuluk",
      "ko": "누쿨룩",
      "ja": "ヌクルク"
    },
    "latin": "NUKULUK",
    "initial": "NK",
    "base": {
      "zh": "伦敦",
      "en": "London",
      "ko": "런던",
      "ja": "ロンドン"
    },
    "tags": [
      "Experimental",
      "Post-Punk",
      "Glitch"
    ],
    "heat": 86,
    "bio": {
      "zh": "南伦敦实验嘻哈团体，把电子、朋克、说唱与超流行人声撞在一起。2024 年 mixtape《stillworld》在异化、家庭与伦敦夜色之间搭起一座歪斜的桥。",
      "en": "A South London experimental hip-hop collective colliding electronica, punk, rap and hyperpop vocals. Their 2024 mixtape stillworld builds a crooked bridge between alienation, family and nocturnal London.",
      "ko": "사우스 런던의 실험 힙합 컬렉티브. 전자음, 펑크, 랩, 하이퍼팝 보컬을 충돌시킨다. 2024년 믹스테이프 《stillworld》는 소외, 가족, 런던의 밤 사이에 비뚤어진 다리를 놓는다.",
      "ja": "サウス・ロンドンの実験的ヒップホップ・コレクティブ。エレクトロニカ、パンク、ラップ、ハイパーポップ・ヴォーカルを衝突させる。2024年ミックステープ『stillworld』は疎外、家族、ロンドンの夜の間に歪んだ橋を架ける。"
    },
    "project": {
      "title": "stillworld",
      "type": "album",
      "date": "2024-11-27",
      "tracks": 7,
      "appleUrl": "https://music.apple.com/us/album/stillworld/1768295842?uo=4",
      "preview": {
        "title": "Crashing (Extended Version)",
        "durationMs": 279000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3c/44/ae/3c44aed3-6b12-d90b-8db3-39a2e9d4d6e0/mzaf_14390287611582067421.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9f/88/31/9f8831a6-88d6-305b-c890-05008e64a468/3663729337801_cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/crashing-extended-version/1768295842?i=1768295866&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/gb/artist/nukuluk/1582787766?uo=4",
    "styles": [
      "experimental"
    ],
    "avatar": "avatars/nukuluk.jpg",
    "neteaseId": "49461252",
    "avatarSource": "netease"
  },
  {
    "id": "serane",
    "region": "eu",
    "name": {
      "zh": "Serane",
      "en": "Serane",
      "ko": "세란",
      "ja": "スラン"
    },
    "latin": "SERANE",
    "initial": "SR",
    "base": {
      "zh": "巴黎",
      "en": "Paris",
      "ko": "파리",
      "ja": "パリ"
    },
    "tags": [
      "Plugg",
      "Cloud Rap",
      "Paris"
    ],
    "heat": 84,
    "bio": {
      "zh": "法阿混血的巴黎 rapper，被视作把 plugg 带到法国的先行者之一。他把美国地下 plug 的漂移感改写成巴黎版本；2026 年与 Kasper 939 合作《PRISE STARS》。",
      "en": "The Franco-Argentine Paris rapper credited with bringing plugg into French rap. He re-routes the drift of American underground plug through Paris; his 2026 collaboration with Kasper 939 is PRISE STARS.",
      "ko": "프랑스·아르헨티나 혼혈 파리 래퍼. 미국 언더그라운드 plugg의 표류감을 파리 버전으로 바꾸며 프랑스에 plugg를 소개한 선구자로 꼽힌다. 2026년 Kasper 939와 《PRISE STARS》를 발표했다.",
      "ja": "フランスとアルゼンチンのルーツを持つパリのラッパー。アメリカのアンダーグラウンド・プラグの漂流感をパリ版に書き換え、フランスにプラグを持ち込んだ先駆者の一人とされる。2026年、Kasper 939との『PRISE STARS』。"
    },
    "project": {
      "title": "PRISE STARS",
      "type": "album",
      "date": "2026-10-16",
      "tracks": 7,
      "appleUrl": "https://music.apple.com/us/album/prise-stars/6824044879?uo=4",
      "preview": {
        "title": "FIRST LOVE",
        "durationMs": 108471,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e3/4f/bc/e34fbc7f-26d3-96df-969b-c37725748fd5/mzaf_5257988044182522856.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/78/f9/1c/78f91cab-f0a4-4751-4f88-83cae5b7be33/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/first-love/6824044879?i=6824044882&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/gb/artist/serane/1528640260?uo=4",
    "styles": [
      "plugg",
      "cloud-rap"
    ],
    "avatar": "https://p1.music.126.net/vJdGPHlfXjkR-m17cTAmVA==/109951167789414922.jpg"
  },
  {
    "id": "shoujo-band",
    "region": "cn",
    "styles": [
      "hyperpop",
      "digicore",
      "jerk"
    ],
    "name": {
      "zh": "地下少女樂隊",
      "en": "Underground Girls Band",
      "ko": "언더그라운드 걸스 밴드",
      "ja": "地下少女楽隊"
    },
    "latin": "SHOUJO BAND",
    "initial": "少",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "Hyperpop",
      "Jerk",
      "Anime"
    ],
    "heat": 88,
    "bio": {
      "zh": "把 hyperpop、digicore、jerk 和二次元网络梗揉成一团的中文地下团体。2026 年 mixtape《地下少女樂隊Mixtape1》被 Klay137 选进近期中文说唱发行。",
      "en": "A Chinese underground collective folding hyperpop, digicore, jerk and anime-net humour into one pile. Their 2026 mixtape Underground Girls Band Mixtape 1 was picked by Klay137 in a recent Chinese rap round-up.",
      "ko": "하이퍼팝, 다이지코어, 저크, 애니메이션 인터넷 유머를 한데 뭉친 중국 언더그라운드 컬렉티브. 2026년 믹스테이프 《地下少女樂隊Mixtape1》은 Klay137의 최근 중국 랩 리뷰에 등장했다.",
      "ja": "ハイパーポップ、ダイジコア、ジャーク、アニメ的なネット・ユーモアをひとつに押し込む中国のアンダーグラウンド・コレクティブ。2026年のミックステープ『地下少女樂隊Mixtape1』はKlay137の中国ラップ近作レビューで取り上げられた。"
    },
    "project": {
      "title": "地下少女樂隊Mixtape1",
      "type": "album",
      "date": "2026-10-23",
      "tracks": 11,
      "appleUrl": "https://music.apple.com/us/album/%E5%9C%B0%E4%B8%8B%E5%B0%91%E5%A5%B3%E6%A8%82%E9%9A%8Amixtape1/6822539372?uo=4",
      "preview": {
        "title": "intro (prod.kashsaki x Tomori Rackz)",
        "durationMs": 63089,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/43/d3/02/43d30213-91b4-ff3b-ee60-5ce8cc2fc219/mzaf_6486484004308602981.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/70/1f/8e/701f8e30-fa67-afc2-2694-a9080629c540/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/intro-prod-kashsaki-x-tomori-rackz/6822539372?i=6822539373&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/tw/artist/%E5%9C%B0%E4%B8%8B%E5%B0%91%E5%A5%B3%E6%A8%82%E9%9A%8A/1872990204?uo=4",
    "avatar": "avatars/shoujo-band.jpg",
    "neteaseId": "122728675",
    "avatarSource": "netease"
  },
  {
    "id": "kisso-cotty",
    "region": "cn",
    "styles": [
      "alternative",
      "hip-hop"
    ],
    "name": {
      "zh": "Kisso Cotty",
      "en": "Kisso Cotty",
      "ko": "키소 코티",
      "ja": "キッソ・コッティ"
    },
    "latin": "KISSO COTTY",
    "initial": "KC",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "Alternative R&B",
      "Melodic Rap",
      "Klay137"
    ],
    "heat": 80,
    "bio": {
      "zh": "Klay137 近期中文说唱盘点里的低调名字。2026 年专辑《Melted Summer Dream》把旋律说唱、另类 R&B 和卧室流行的朦胧感混在一起。",
      "en": "A low-key name in Klay137's recent Chinese rap round-up. His 2026 album Melted Summer Dream blurs melodic rap, alternative R&B and bedroom-pop haze.",
      "ko": "Klay137의 최근 중국 랩 정리에서 소개된 조용한 이름. 2026년 앨범 《Melted Summer Dream》은 멜로디 랩, 얼터너티브 R&B, 베드룸 팝의 흐릿함을 섞는다.",
      "ja": "Klay137の最近の中国ラップ総括に登場した静かな名前。2026年作『Melted Summer Dream』はメロディック・ラップ、オルタナティブR&B、ベッドルーム・ポップの霞みを混ぜる。"
    },
    "project": {
      "title": "Melted Summer Dream",
      "type": "album",
      "date": "2026-10-17",
      "tracks": 11,
      "appleUrl": "https://music.apple.com/us/album/melted-summer-dream/6821288470?uo=4",
      "preview": {
        "title": "How did the dream begin?",
        "durationMs": 57049,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7f/16/c6/7f16c617-2f29-3e1e-ef2b-f0d537eb1ff5/mzaf_2234689396462011701.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7a/90/d1/7a90d1f8-0cc8-38a7-415b-75a4197f228f/6932897006022.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/how-did-the-dream-begin/6821288470?i=6821288471&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/kisso-cotty/1743154999?uo=4",
    "avatar": "avatars/kisso-cotty.jpg",
    "neteaseId": "56483836",
    "avatarSource": "netease"
  },
  {
    "id": "vovo-weng",
    "region": "kr",
    "styles": [
      "alternative",
      "hip-hop"
    ],
    "name": {
      "zh": "VOVO WENG",
      "en": "VOVO WENG",
      "ko": "보보웽",
      "ja": "ボボ・ウェン"
    },
    "latin": "VOVO WENG",
    "initial": "VW",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Indie Rap",
      "R&B",
      "beJADE"
    ],
    "heat": 86,
    "bio": {
      "zh": "韩国独立嘻哈场景里的低调名字。2026 年同名专辑把另类 R&B、说唱旋律和卧室制作混在一起；beJADE_ 专门做了一期“VOVO WENG 是谁”。",
      "en": "A quiet name in Korean indie hip-hop. His 2026 self-titled album mixes alternative R&B, melodic rap and bedroom production; beJADE_ devoted an episode to asking who VOVO WENG is.",
      "ko": "한국 인디 힙합 신의 조용한 이름. 2026년 동명 앨범은 얼터너티브 R&B, 멜로디 랩, 베드룸 프로덕션을 섞는다. beJADE_는 ‘VOVO WENG은 누구인가’라는 에피소드를 따로 만들었다.",
      "ja": "韓国のインディー・ヒップホップ scene の静かな名前。2026年のセルフタイトル作はオルタナティブR&B、メロディック・ラップ、ベッドルーム制作を混ぜる。beJADE_は「VOVO WENGとは誰か」という回を制作した。"
    },
    "project": {
      "title": "VOVO WENG",
      "type": "album",
      "date": "2026-10-14",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/vovo-weng/6818448704?uo=4",
      "preview": {
        "title": "SUZUKI NEX",
        "durationMs": 172636,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d8/f1/3c/d8f13c23-3cff-25ec-2cf0-242256da7c6c/mzaf_8957207746212359453.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0f/b7/b8/0fb7b868-213c-0268-69fb-917ea9fe03d6/8800370427528.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/suzuki-nex/6818448704?i=6818448705&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/vovo-weng/1463761737?uo=4",
    "avatar": "avatars/vovo-weng.jpg",
    "neteaseId": "31290072",
    "avatarSource": "netease"
  },
  {
    "id": "chilloud",
    "region": "kr",
    "styles": [
      "hyperpop",
      "digicore"
    ],
    "name": {
      "zh": "chilloud",
      "en": "chilloud",
      "ko": "chilloud",
      "ja": "チルード"
    },
    "latin": "CHILLOUD",
    "initial": "CH",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Hyperpop",
      "Digicore",
      "beJADE"
    ],
    "heat": 85,
    "bio": {
      "zh": "韩国 hyperpop / digicore 场景的代表名字之一。2026 年《헤븐스타》继续把 Auto-Tune 人声、游戏采样和说唱切成碎片；beJADE_ 在 UDG 节目里点名推荐。",
      "en": "One of the defining names in Korean hyperpop and digicore. His 2026 album Heaven Star keeps slicing Auto-Tune vocals, game samples and rap into fragments; beJADE_ name-checked him in a UDG episode.",
      "ko": "한국 하이퍼팝·다이지코어 신을 대표하는 이름 중 하나. 2026년 《헤븐스타》는 오토튠 보컬, 게임 샘플, 랩을 계속 조각낸다. beJADE_가 UDG 에피소드에서 직접 언급했다.",
      "ja": "韓国のハイパーポップ／ダイジコアを代表する名前のひとつ。2026年作『헤븐스타』はオートチューン・ヴォーカル、ゲーム・サンプル、ラップを断片化し続ける。beJADE_もUDG回で名前を挙げた。"
    },
    "project": {
      "title": "헤븐스타",
      "type": "album",
      "date": "2026-10-01",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/%ED%97%A4%EB%B8%90%EC%8A%A4%ED%83%80/6816633416?uo=4",
      "preview": {
        "title": "Oi터니티, et3rnity",
        "durationMs": 160104,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/dd/e1/d0/dde1d0c4-28bf-1a8f-99f0-6784e51492be/mzaf_1663319477388409363.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/cd/4b/c6cd4b65-3a48-ee57-a7a6-213abb8e8905/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/oi%ED%84%B0%EB%8B%88%ED%8B%B0-et3rnity/6816633416?i=6816633417&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/chilloud/1503274785?uo=4",
    "avatar": "avatars/chilloud.jpg",
    "neteaseId": "34585815",
    "avatarSource": "netease"
  },
  {
    "id": "yeil",
    "region": "kr",
    "styles": [
      "digicore",
      "pluggnb",
      "hyperpop"
    ],
    "name": {
      "zh": "yeil",
      "en": "yeil",
      "ko": "예일",
      "ja": "イェイル"
    },
    "latin": "YEIL",
    "initial": "YL",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Pluggnb",
      "Digicore",
      "beJADE"
    ],
    "heat": 85,
    "bio": {
      "zh": "韩国 pluggnb / digicore 新声，2026 年《heart pop》把甜腻旋律、hyperpop 和说唱缝在一起。beJADE_ 的评论区点名喜欢他和 chilloud。",
      "en": "A Korean pluggnb and digicore voice. His 2026 album heart pop stitches sweet melodies, hyperpop and rap together; beJADE_'s comment section name-checked him alongside chilloud.",
      "ko": "한국 플러그앤비·다이지코어 신예. 2026년 《heart pop》은 달콤한 멜로디, 하이퍼팝, 랩을 꿰맨다. beJADE_ 영상 댓글에서 chilloud와 함께 좋아한다는 이름이 나왔다.",
      "ja": "韓国のプラグンビ／ダイジコアの新声。2026年作『heart pop』は甘いメロディ、ハイパーポップ、ラップを縫い合わせる。beJADE_の動画コメントでchilloudと並んで名前が挙がった。"
    },
    "project": {
      "title": "heart pop",
      "type": "album",
      "date": "2026-02-20",
      "tracks": 9,
      "appleUrl": "https://music.apple.com/us/album/heart-pop/1879689708?uo=4",
      "preview": {
        "title": "intro",
        "durationMs": 40875,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/da/3d/4f/da3d4f72-8f0e-1c0f-5391-73c2ebab2dbe/mzaf_3570677291208686387.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/23/fe/b923fef1-f9dd-3bf0-0245-c130f28c0eae/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/intro/1879689708?i=1879689709&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/yeil/1690436799?uo=4",
    "avatar": "avatars/yeil.jpg",
    "neteaseId": "59756526",
    "avatarSource": "netease"
  },
  {
    "id": "0siggy",
    "region": "kr",
    "styles": [
      "plugg",
      "emo-rap"
    ],
    "name": {
      "zh": "0siggy",
      "en": "0siggy",
      "ko": "0siggy",
      "ja": "0siggy"
    },
    "latin": "0SIGGY",
    "initial": "0S",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Plugg",
      "Emo Rap",
      "beJADE"
    ],
    "heat": 84,
    "bio": {
      "zh": "韩国地下说唱新血，2026 年《UNDERGROUND》在 plugg、情绪旋律和 hyper trap 之间移动。beJADE_ 的 2026 KHH UDG 片单里，他是被点名的一位。",
      "en": "A new voice in Korean underground rap. His 2026 album UNDERGROUND moves between plugg, emo melody and hyper trap; he was one of the names highlighted in beJADE_'s 2026 KHH UDG selection.",
      "ko": "한국 언더그라운드 랩의 새 피. 2026년 《UNDERGROUND》는 플러그, 이모 멜로디, 하이퍼 트랩 사이를 오간다. beJADE_의 2026 KHH UDG 셀렉션에서 이름이 언급됐다.",
      "ja": "韓国アンダーグラウンド・ラップの新血。2026年作『UNDERGROUND』はプラグ、エモいメロディ、ハイパー・トラップを行き来する。beJADE_の2026 KHH UDG選曲でも名前が挙がった。"
    },
    "project": {
      "title": "ITAEWON BOUNCE",
      "type": "single",
      "date": "2026-10-16",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/itaewon-bounce-single/6822154662?uo=4",
      "preview": {
        "title": "ITAEWON BOUNCE",
        "durationMs": 156800,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7f/0e/b6/7f0eb64e-9162-5d65-c156-a552ca512a8c/mzaf_7688109562753610969.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e7/4e/7f/e74e7fe5-520a-8cb6-f1af-31c7447ce8ad/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/itaewon-bounce/6822154662?i=6822154663&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/0siggy/1625823326?uo=4",
    "avatar": "https://cdn-images.dzcdn.net/images/artist/88bc32c11798982840846a04c9fa8466/500x500-000000-80-0-0.jpg"
  },
  {
    "id": "skiboyvv",
    "region": "cn",
    "styles": [
      "cloud-rap",
      "plugg"
    ],
    "name": {
      "zh": "skiboyvv",
      "en": "skiboyvv",
      "ko": "skiboyvv",
      "ja": "skiboyvv"
    },
    "latin": "SKIBOYVV",
    "initial": "SK",
    "base": {
      "zh": "成都",
      "en": "Chengdu",
      "ko": "청두",
      "ja": "成都"
    },
    "tags": [
      "skiboyvv",
      "张子越",
      "Cloud Rap",
      "Plugg",
      "Chengdu"
    ],
    "heat": 88,
    "bio": {
      "zh": "成都地下说唱的新面孔。2025 年专辑《BOYS2》，2026 年带着《逃跑计划》巡演；cloud rap、plugg 和卧室流行在他身上像一层潮湿的蒸汽。",
      "en": "A new face in Chengdu's underground rap scene. After 2025's BOYS2 he toured his 2026 project Escape Plan; cloud rap, plugg and bedroom pop gather around him like humid steam.",
      "ko": "청두 언더그라운드 랩의 새 얼굴. 2025년 《BOYS2》 이후 2026년 《逃跑计划》 투어를 돌았다. 클라우드 랩, 플러그, 베드룸 팝이 습한 증기처럼 그를 감싼다.",
      "ja": "成都アンダーグラウンド・ラップの新しい顔。2025年作『BOYS2』の後、2026年作『逃跑计划』のツアーを回った。クラウド・ラップ、プラグ、ベッドルーム・ポップが湿った蒸気のように纏わりつく。"
    },
    "project": {
      "title": "BOYS2",
      "type": "album",
      "date": "2026-10-09",
      "tracks": 14,
      "appleUrl": "https://music.apple.com/us/album/boys2/6820904505?uo=4",
      "preview": null
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/skiboyvv/1615067300?uo=4",
    "avatar": "avatars/skiboyvv-20261101.jpg",
    "neteaseId": "34146331",
    "avatarSource": "netease"
  },
  {
    "id": "dark9community",
    "region": "cn",
    "styles": [
      "rage",
      "industrial"
    ],
    "name": {
      "zh": "暗夜社区",
      "en": "DARK9COMMUNITY",
      "ko": "다크9커뮤니티",
      "ja": "ダーク9コミュニティ"
    },
    "latin": "DARK9COMMUNITY",
    "initial": "D9",
    "base": {
      "zh": "深圳 / 上海",
      "en": "Shenzhen / Shanghai",
      "ko": "선전 / 상하이",
      "ja": "深圳／上海"
    },
    "tags": [
      "Collective",
      "Rage",
      "Dark Trap"
    ],
    "heat": 87,
    "bio": {
      "zh": "深圳—上海的地下集体，成员包括 Chalky Wong、88LIEN 等。2025 年《D9 Ⅱ》把 dark trap、rage 和工业噪声压成一张集体宣言。",
      "en": "A Shenzhen–Shanghai underground collective with Chalky Wong, 88LIEN and others. Their 2025 album D9 II compresses dark trap, rage and industrial noise into a group statement.",
      "ko": "선전–상하이 언더그라운드 컬렉티브. Chalky Wong, 88LIEN 등이 참여한다. 2025년 《D9 Ⅱ》는 다크 트랩, 레이지, 인더스트리얼 노이즈를 하나의 집단 선언으로 압축한다.",
      "ja": "深圳―上海のアンダーグラウンド・コレクティブ。Chalky Wong、88LIENらが参加。2025年作『D9 Ⅱ』はダーク・トラップ、レイジ、インダストリアル・ノイズを集団宣言へ圧縮する。"
    },
    "project": {
      "title": "D9 Ⅱ",
      "type": "album",
      "date": "2025-09-29",
      "tracks": 17,
      "appleUrl": "https://music.apple.com/us/album/d9/1885501550?uo=4",
      "preview": {
        "title": "Wassup (feat. FANVY & Omega)",
        "durationMs": 154676,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6e/3c/69/6e3c6961-0d79-568f-f805-315288232a00/mzaf_6232848898460282547.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bc/63/ae/bc63ae4b-3f2d-1dc1-e235-1335185bfef7/cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/wassup-feat-fanvy-omega/1885501550?i=1885501557&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/cn/artist/dark9community-%E6%9A%97%E5%A4%9C%E7%A4%BE%E5%8C%BA/1727440811?uo=4",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bc/63/ae/bc63ae4b-3f2d-1dc1-e235-1335185bfef7/cover.jpg/100x100bb.jpg"
  },
  {
    "id": "billionhappy",
    "region": "cn",
    "styles": [
      "cloud-rap",
      "hyperpop"
    ],
    "name": {
      "zh": "Billionhappy",
      "en": "Billionhappy",
      "ko": "빌리언해피",
      "ja": "ビリオンハッピー"
    },
    "latin": "BILLIONHAPPY",
    "initial": "BH",
    "base": {
      "zh": "上海",
      "en": "Shanghai",
      "ko": "상하이",
      "ja": "上海"
    },
    "tags": [
      "Cloud Rap",
      "Hyperpop",
      "Shabby Club"
    ],
    "heat": 90,
    "bio": {
      "zh": "安徽出身、常驻上海的 underground rapper，Shabby Club 主脑。2025 年与 SEBii 合作《潮》，把 cloud rap、hyperpop 和中国互联网亚文化烧在一起。",
      "en": "An underground rapper from Anhui based in Shanghai, and the leader of Shabby Club. His 2025 album with SEBii, Chao, burns cloud rap, hyperpop and Chinese internet subculture together.",
      "ko": "안후이 출신, 상하이 거주 언더그라운드 래퍼이자 Shabby Club의 리더. 2025년 SEBii와 함께한 《潮》는 클라우드 랩, 하이퍼팝, 중국 인터넷 서브컬처를 태운다.",
      "ja": "安徽出身、上海在住のアンダーグラウンド・ラッパーで、Shabby Clubの中心人物。2025年にSEBiiと共作した『潮』はクラウド・ラップ、ハイパーポップ、中国のインターネット・サブカルチャーを燃やす。"
    },
    "project": {
      "title": "小牌大耍",
      "type": "single",
      "date": "2026-09-11",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/%E5%B0%8F%E7%89%8C%E5%A4%A7%E8%80%8D-single/6807390958?uo=4",
      "preview": {
        "title": "小牌大耍",
        "durationMs": 150266,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/73/38/d5/7338d5f9-0199-55a6-114f-d89f6b38afec/mzaf_3248436060294995517.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d3/c9/1e/d3c91e6a-d0c5-8bf1-6b4f-dd1f45f7ae2e/cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/%E5%B0%8F%E7%89%8C%E5%A4%A7%E8%80%8D/6807390958?i=6807390967&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/cn/artist/billionhappy/1528136004?uo=4",
    "avatar": "avatars/billionhappy.jpg",
    "neteaseId": "32501012",
    "avatarSource": "netease"
  },
  {
    "id": "trickyzb",
    "region": "cn",
    "styles": [
      "jerk",
      "plugg"
    ],
    "name": {
      "zh": "TrickYzb",
      "en": "TrickYzb",
      "ko": "트릭Yzb",
      "ja": "トリックYzb"
    },
    "latin": "TRICKYZB",
    "initial": "TZ",
    "base": {
      "zh": "成都",
      "en": "Chengdu",
      "ko": "청두",
      "ja": "成都"
    },
    "tags": [
      "Plugg",
      "Jerk",
      "Chengdu"
    ],
    "heat": 83,
    "bio": {
      "zh": "成都新声，2026 年单曲《马丁的早晨》把 plugg、jerk 和四川话说唱的松弛感混在一起；2025 年专辑《Ansuz》与 UDG 混音里都有他的痕迹。",
      "en": "A Chengdu new voice. His 2026 single Martin's Morning mixes plugg, jerk and the unhurried cadence of Sichuan rap; his 2025 album Ansuz and the UDG mix both carry traces of him.",
      "ko": "청두의 신예. 2026년 싱글 《马丁的早晨》은 플러그, 저크, 쓰촨 랩의 느긋한 흐름을 섞는다. 2025년 앨범 《Ansuz》와 UDG 믹스에도 그의 흔적이 있다.",
      "ja": "成都の新声。2026年シングル「马丁的早晨」はプラグ、ジャーク、四川ラップのゆったりした運びを混ぜる。2025年作『Ansuz』やUDGミックスにも彼の痕跡がある。"
    },
    "project": {
      "title": "马丁的早晨",
      "type": "single",
      "date": "2026-09-06",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/%E9%A9%AC%E4%B8%81%E7%9A%84%E6%97%A9%E6%99%A8-single/6809389016?uo=4",
      "preview": {
        "title": "马丁的早晨",
        "durationMs": 149085,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/89/77/32/89773224-d4f3-1979-4f55-4fa19cd165ba/mzaf_8821574390116813103.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/75/13/49/751349ca-20aa-5c03-588c-4178b6b2b6da/6937451237836.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/%E9%A9%AC%E4%B8%81%E7%9A%84%E6%97%A9%E6%99%A8/6809389016?i=6809389017&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/cn/artist/trickyzb/1751440130?uo=4",
    "avatar": "avatars/trickyzb.jpg",
    "neteaseId": "32139022",
    "avatarSource": "netease"
  },
  {
    "id": "devstacks",
    "region": "na",
    "styles": [
      "plugg",
      "sigilkore"
    ],
    "name": {
      "zh": "Devstacks",
      "en": "Devstacks",
      "ko": "데브스택스",
      "ja": "デヴスタックス"
    },
    "latin": "DEVSTACKS",
    "initial": "DS",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Plugg",
      "Sigilkore",
      "Cult"
    ],
    "heat": 87,
    "bio": {
      "zh": "美国地下说唱制作人/rapper，和 OsamaSon 等共同推动 plugg / sigilkore 场景。2026 年《Soul》把邪典采样、失真 808 和旋律说唱熔在一起。",
      "en": "An American underground producer and rapper associated with OsamaSon and the plugg / sigilkore scene. His 2026 album Soul melts cult samples, distorted 808s and melodic rap together.",
      "ko": "미국 언더그라운드 프로듀서이자 래퍼. OsamaSon 등과 플러그/시질코어 신을 함께 밀어냈다. 2026년 《Soul》은 컬트 샘플, 왜곡된 808, 멜로디 랩을 녹여 붙인다.",
      "ja": "アメリカのアンダーグラウンド・プロデューサー／ラッパー。OsamaSonらとプラグ／シジルコア scene を押し広げた。2026年作『Soul』はカルト的なサンプル、歪んだ808、メロディック・ラップを溶接する。"
    },
    "project": {
      "title": "Soul",
      "type": "album",
      "date": "2026-10-09",
      "tracks": 12,
      "appleUrl": "https://music.apple.com/us/album/soul/6819170035?uo=4",
      "preview": {
        "title": "Hand Me Your Soul",
        "durationMs": 184526,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/95/b6/7b/95b67b90-5aba-665d-5415-fe0856e80f4d/mzaf_2913484952260589165.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/15/5a/1a/155a1a61-8ad0-7332-d093-c5b0d76b1489/8721639072559.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/hand-me-your-soul/6819170035?i=6819170037&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/devstacks/1543581587?uo=4",
    "avatar": "avatars/devstacks.jpg",
    "neteaseId": "37674324",
    "avatarSource": "netease"
  },
  {
    "id": "yoyi",
    "region": "cn",
    "styles": [
      "plugg",
      "cloud-rap"
    ],
    "name": {
      "zh": "Yoyi",
      "en": "Yoyi",
      "ko": "Yoyi",
      "ja": "Yoyi"
    },
    "latin": "YOYI",
    "initial": "YO",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG 2026 Cypher",
      "Plugg",
      "Cloud Rap"
    ],
    "heat": 92,
    "bio": {
      "zh": "UDG 2026 CYPHER 里最常被单独截出的声音之一；2026 年单曲《Deeper》把旋律、plugg 的漂移感和低音压力继续推上前。",
      "en": "One of the most clipped-out voices in UDG CYPHER 2026; the 2026 single Deeper pushes melody, plugg drift and low-end pressure further forward.",
      "ko": "UDG 2026 CYPHER에서 가장 자주 잘려 나오는 목소리 중 하나. 2026년 싱글 〈Deeper〉는 멜로디, 플러그의 표류감, 저음 압력을 더 밀어붙인다.",
      "ja": "UDG CYPHER 2026で最も切り取られる声のひとつ。2026年シングル「Deeper」はメロディ、プラグの漂流感、低音の圧力をさらに押し進める。"
    },
    "project": {
      "title": "Emotion",
      "type": "single",
      "date": "2026-08-19",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/emotion-single/6805313228?uo=4",
      "preview": {
        "title": "Emotion",
        "durationMs": 180000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/fc/d5/45fcd513-f977-5e8f-6694-a2e7d63505ba/mzaf_2345716688190227625.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7e/ac/47/7eac47b5-da5b-6031-c1ac-045f260f62e9/4896010744371.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/emotion/6805313228?i=6805313231&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/yoyi/1762655152?uo=4",
    "avatar": "avatars/yoyi.jpg",
    "neteaseId": "55275689",
    "avatarSource": "netease"
  },
  {
    "id": "hidoyard",
    "region": "cn",
    "styles": [
      "rage",
      "plugg"
    ],
    "name": {
      "zh": "HIDOYARD",
      "en": "HIDOYARD",
      "ko": "히도야드",
      "ja": "ヒドヤード"
    },
    "latin": "HIDOYARD",
    "initial": "HD",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG 2026 Cypher",
      "Rage",
      "Plugg"
    ],
    "heat": 91,
    "bio": {
      "zh": "2026 UDG Cypher 的 HIDOYARD 段落把 rage 的冲击和 plugg 的雾气叠在一起；同年专辑《莲華》继续放大这种不稳定。",
      "en": "The HIDOYARD verse in UDG CYPHER 2026 stacks rage impact and plugg haze; the same year's album Lianhua keeps that instability in the foreground.",
      "ko": "UDG CYPHER 2026의 HIDOYARD 구절은 레이지의 충격과 플러그의 안개를 겹친다. 같은 해 앨범 《莲華》는 그 불안정성을 더 크게 드러낸다.",
      "ja": "UDG CYPHER 2026のHIDOYARDのヴァースは、レイジの衝撃とプラグの霧を重ねる。同年のアルバム『莲華』はその不安定さをさらに前景化する。"
    },
    "project": {
      "title": "星星",
      "type": "single",
      "date": "2026-10-25",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/%E6%98%9F%E6%98%9F-single/6826159788?uo=4",
      "preview": null
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/hidoyard/1877647294?uo=4",
    "avatar": "avatars/hidoyard.jpg",
    "neteaseId": "37056973",
    "avatarSource": "netease"
  },
  {
    "id": "losty",
    "region": "cn",
    "styles": [
      "plugg",
      "cloud-rap"
    ],
    "name": {
      "zh": "Losty",
      "en": "Losty",
      "ko": "Losty",
      "ja": "Losty"
    },
    "latin": "LOSTY",
    "initial": "LS",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG 2026 Cypher",
      "Plugg",
      "Cloud Rap"
    ],
    "heat": 89,
    "bio": {
      "zh": "UDG 2026 Cypher 成员；2026 专辑《LAB》把 plugg、cloud rap 和松弛的旋律说唱铺成一张完整的场景切片。",
      "en": "A member of the UDG CYPHER 2026 lineup; the 2026 album LAB lays out plugg, cloud rap and unhurried melodic rap as a full scene slice.",
      "ko": "UDG CYPHER 2026 멤버. 2026년 앨범 《LAB》은 플러그, 클라우드 랩, 느긋한 멜로디 랩을 하나의 장면으로 펼친다.",
      "ja": "UDG CYPHER 2026のメンバー。2026年作『LAB』はプラグ、クラウド・ラップ、ゆったりしたメロディック・ラップを一枚のシーンとして広げる。"
    },
    "project": {
      "title": "LAB",
      "type": "album",
      "date": "2026-09-11",
      "tracks": 11,
      "appleUrl": "https://music.apple.com/us/album/lab/6808506078?uo=4",
      "preview": {
        "title": "Hit Dat Lick",
        "durationMs": 147500,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/92/4e/b5/924eb5bb-ba6d-e3fd-41f9-03dd566bc8f5/mzaf_1670162670999738010.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/db/76/fc/db76fc16-b5cd-752b-c889-bb6a69dfa5b3/885288360295.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/hit-dat-lick/6808506078?i=6808506084&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/losty/1582693499?uo=4",
    "avatar": "avatars/losty.jpg",
    "neteaseId": "14642818",
    "avatarSource": "netease"
  },
  {
    "id": "isolyves",
    "region": "cn",
    "styles": [
      "plugg",
      "rage"
    ],
    "name": {
      "zh": "IsolYves",
      "en": "IsolYves",
      "ko": "IsolYves",
      "ja": "IsolYves"
    },
    "latin": "ISOLYVES",
    "initial": "IY",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG 2026 Cypher",
      "Plugg",
      "Rage"
    ],
    "heat": 87,
    "bio": {
      "zh": "UDG 2026 Cypher 的 IsolYves；2025 EP《EP777》在 plugg、rage 和数字流行之间滑动，钩子黏得很紧。",
      "en": "IsolYves from the UDG CYPHER 2026 lineup; the 2025 EP EP777 slides between plugg, rage and digital pop with hooks that stick.",
      "ko": "UDG CYPHER 2026의 IsolYves. 2025년 EP 《EP777》은 플러그, 레이지, 디지털 팝 사이를 미끄러지며 훅을 단단히 붙인다.",
      "ja": "UDG CYPHER 2026のIsolYves。2025年EP『EP777』はプラグ、レイジ、デジタル・ポップの間を滑り、フックを強く残す。"
    },
    "project": {
      "title": "EP777",
      "type": "album",
      "date": "2025-12-19",
      "tracks": 7,
      "appleUrl": "https://music.apple.com/us/album/ep777/1862951048?uo=4",
      "preview": {
        "title": "白天鹅号",
        "durationMs": 144314,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/93/a3/f7/93a3f72f-f62f-2dde-8693-97a156e6570e/mzaf_7578513261349549588.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ca/fb/97/cafb9768-8eff-4845-97ab-14f690ffc192/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/%E7%99%BD%E5%A4%A9%E9%B9%85%E5%8F%B7/1862951048?i=1862951049&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/isolyves/1840807930?uo=4",
    "avatar": "avatars/isolyves.jpg",
    "neteaseId": "100009583",
    "avatarSource": "netease"
  },
  {
    "id": "dd-ma-shawty",
    "region": "cn",
    "styles": [
      "rage",
      "plugg"
    ],
    "name": {
      "zh": "DD Ma Shawty",
      "en": "DD Ma Shawty",
      "ko": "DD Ma Shawty",
      "ja": "DD Ma Shawty"
    },
    "latin": "DD MA SHAWTY",
    "initial": "DM",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG 2026 Cypher",
      "Rage",
      "Plugg"
    ],
    "heat": 88,
    "bio": {
      "zh": "UDG 2026 Cypher 成员；2025 专辑《21's Tears》把 rage、plugg 和失真的旋律压成一组短促、带攻击性的钩子。",
      "en": "A UDG CYPHER 2026 member; the 2025 album 21's Tears compresses rage, plugg and distorted melody into short, aggressive hooks.",
      "ko": "UDG CYPHER 2026 멤버. 2025년 앨범 《21's Tears》는 레이지, 플러그, 왜곡된 멜로디를 짧고 공격적인 훅으로 압축한다.",
      "ja": "UDG CYPHER 2026のメンバー。2025年作『21's Tears』はレイジ、プラグ、歪んだメロディを短く攻撃的なフックへ圧縮する。"
    },
    "project": {
      "title": "FallingLuv",
      "type": "single",
      "date": "2026-08-19",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/fallingluv-single/6803740798?uo=4",
      "preview": {
        "title": "FallingLuv",
        "durationMs": 151875,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c4/b2/33/c4b2339e-21d4-421f-d454-917442c69f60/mzaf_12185390869641719555.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/87/9b/c6879b44-3b0e-4040-c2cc-6e12fac566ac/6936738137982.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/fallingluv/6803740798?i=6803740799&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/dd-ma-shawty/1851131317?uo=4",
    "avatar": "avatars/dd-ma-shawty.jpg",
    "neteaseId": "94753015",
    "avatarSource": "netease"
  },
  {
    "id": "jesse-margiela",
    "region": "cn",
    "styles": [
      "alternative",
      "hip-hop"
    ],
    "name": {
      "zh": "周乘羽",
      "en": "周乘羽",
      "ko": "周乘羽",
      "ja": "周乘羽"
    },
    "latin": "JESSE MARGIELA",
    "initial": "ZC",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "周乘羽",
      "UDG 2026 Cypher",
      "Alternative",
      "Hip-Hop"
    ],
    "heat": 89,
    "bio": {
      "zh": "UDG 2026 Cypher 的开场者；2025 专辑《幽默与笑话》和 2026 年《商业与玩法》让他成为这轮 UDG 讨论里最常被逐句分析的名字之一。",
      "en": "The opening voice of UDG CYPHER 2026; the 2025 album Humour and Jokes and 2026's Business and Gameplay made him one of the most line-by-line analysed names in this UDG cycle.",
      "ko": "UDG CYPHER 2026의 오프닝. 2025년 앨범 《幽默与笑话》와 2026년 《商业与玩法》로 이번 UDG 사이클에서 가장 문장 단위로 분석되는 이름 중 하나가 됐다.",
      "ja": "UDG CYPHER 2026のオープナー。2025年作『幽默与笑话』と2026年作『商业与玩法』で、今回のUDGサイクルで最も行単位で分析される名前のひとつになった。"
    },
    "project": {
      "title": "City Life Kills",
      "type": "single",
      "date": "2022-11-18",
      "tracks": 2,
      "appleUrl": "https://music.apple.com/us/album/city-life-kills-single/1653317091?uo=4",
      "preview": {
        "title": "City Life Kills (Extended Version)",
        "durationMs": 168275,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/f2/2f/7b/f22f7b02-05b6-8845-0f55-cd8d066592bd/mzaf_374369565836365325.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e3/a8/fa/e3a8fa38-b9a3-674c-d6dc-2a00cd5a365d/a762d5be-9ef4-47cf-aee9-1b19d4298309.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/city-life-kills-extended-version/1653317091?i=1653317104&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/jesse-margiela/1652274326?uo=4",
    "avatar": "avatars/jesse-margiela.jpg",
    "neteaseId": "46356020",
    "avatarSource": "netease"
  },
  {
    "id": "ananta",
    "region": "kr",
    "styles": [
      "plugg",
      "rage"
    ],
    "name": {
      "zh": "ANANTA",
      "en": "ANANTA",
      "ko": "아난타",
      "ja": "アナンタ"
    },
    "latin": "ANANTA",
    "initial": "AN",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "UDG Freshman Cypher KR",
      "Plugg",
      "Rage"
    ],
    "heat": 90,
    "bio": {
      "zh": "韩国 UDG Freshman Cypher 2026 的核心成员与执行制作人之一；2026 单曲《Desperation 25》把 plugg、rage 和俱乐部低音推到一起。",
      "en": "A core member and executive producer of the Korean UDG Freshman Cypher 2026; the 2026 single Desperation 25 pushes plugg, rage and club low-end together.",
      "ko": "한국 UDG Freshman Cypher 2026의 핵심 멤버이자 executive producer. 2026년 싱글 〈Desperation 25〉는 플러그, 레이지, 클럽 저음을 함께 밀어붙인다.",
      "ja": "韓国UDG Freshman Cypher 2026の中心メンバー／エグゼクティブ・プロデューサー。2026年シングル「Desperation 25」はプラグ、レイジ、クラブの低音を押し合わせる。"
    },
    "project": {
      "title": "Desperation 25",
      "type": "single",
      "date": "2026-10-23",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/desperation-25-single/6827008572?uo=4",
      "preview": {
        "title": "Desperation 25",
        "durationMs": 126375,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f6/1f/38/f61f38d7-5a9a-748f-f1bd-d7a2a3df35ed/mzaf_5404151536205464897.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c5/91/60/c59160fb-e173-e31b-d20c-47b5143ec30d/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/desperation-25/6827008572?i=6827008573&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/ananta/1677716394?uo=4",
    "avatar": "avatars/ananta.jpg",
    "neteaseId": "95358264",
    "avatarSource": "netease"
  },
  {
    "id": "mitsu",
    "region": "kr",
    "styles": [
      "digicore",
      "alternative"
    ],
    "name": {
      "zh": "mitsu",
      "en": "mitsu",
      "ko": "미츠",
      "ja": "ミツ"
    },
    "latin": "MITSU",
    "initial": "MI",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "UDG Freshman Cypher KR",
      "Digicore",
      "Alternative"
    ],
    "heat": 87,
    "bio": {
      "zh": "韩国 UDG Freshman Cypher 2026 成员，制作人/歌手；2026 EP《forbidden fruit》把 digicore、电子和说唱切成碎片。",
      "en": "A producer and vocalist in the Korean UDG Freshman Cypher 2026; the 2026 EP forbidden fruit cuts digicore, electronics and rap into fragments.",
      "ko": "한국 UDG Freshman Cypher 2026 멤버이자 프로듀서/보컬리스트. 2026년 EP 《forbidden fruit》은 다이지코어, 전자음, 랩을 조각낸다.",
      "ja": "韓国UDG Freshman Cypher 2026のメンバーで、プロデューサー／ヴォーカリスト。2026年EP『forbidden fruit』はダイジコア、エレクトロニクス、ラップを断片化する。"
    },
    "project": {
      "title": "forbidden fruit",
      "type": "ep",
      "date": "2026-10-30",
      "tracks": 4,
      "appleUrl": "https://music.apple.com/us/album/forbidden-fruit-ep/6822115193?uo=4",
      "preview": {
        "title": "forbidden fruit",
        "durationMs": 117170,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bb/6d/06/bb6d0662-2721-0dbb-81a7-0c5bcb5f77f8/mzaf_8282037466124463701.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4c/a3/36/4ca3368e-d4b1-fd03-e204-318e4f9197a9/1470.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/forbidden-fruit/6822115193?i=6822115194&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/mitsu/1537920672?uo=4",
    "avatar": "avatars/mitsu.jpg",
    "neteaseId": "33501131",
    "avatarSource": "netease"
  },
  {
    "id": "sei",
    "region": "kr",
    "styles": [
      "digicore",
      "alternative"
    ],
    "name": {
      "zh": "sei",
      "en": "sei",
      "ko": "세이",
      "ja": "セイ"
    },
    "latin": "SEI",
    "initial": "SE",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "UDG Freshman Cypher KR",
      "Digicore",
      "Alternative"
    ],
    "heat": 86,
    "bio": {
      "zh": "韩国 UDG Freshman Cypher 2026 成员，负责 cypher 的 audio edit；2026 单曲《rogue-like》把另类流行和说唱揉在一起。",
      "en": "A member of the Korean UDG Freshman Cypher 2026 and its audio editor; the 2026 single rogue-like folds alternative pop and rap together.",
      "ko": "한국 UDG Freshman Cypher 2026 멤버이자 audio edit 담당. 2026년 싱글 〈rogue-like〉는 얼터너티브 팝과 랩을 함께 접는다.",
      "ja": "韓国UDG Freshman Cypher 2026のメンバーで、オーディオ・エディット担当。2026年シングル「rogue-like」はオルタナティブ・ポップとラップを折り重ねる。"
    },
    "project": {
      "title": "rogue-like",
      "type": "single",
      "date": "2026-10-22",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/rogue-like-single/6825791489?uo=4",
      "preview": {
        "title": "rogue-like",
        "durationMs": 107300,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/21/b1/a321b182-bc7a-2fc0-11ed-b12305e4e96d/mzaf_7670594928696283710.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/f9/96/98f996db-bdbf-0461-c33b-470521022fd9/885975137827_cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/rogue-like/6825791489?i=6825791490&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/sei/1844291283?uo=4",
    "avatar": "https://cdn-images.dzcdn.net/images/artist/9fd80b648dfc430d469041f9cb04fc63/500x500-000000-80-0-0.jpg"
  },
  {
    "id": "kianna",
    "region": "jp",
    "styles": [
      "plugg",
      "rage"
    ],
    "name": {
      "zh": "Kianna",
      "en": "Kianna",
      "ko": "Kianna",
      "ja": "Kianna"
    },
    "latin": "KIANNA",
    "initial": "KI",
    "base": {
      "zh": "日本",
      "en": "Japan",
      "ko": "일본",
      "ja": "日本"
    },
    "tags": [
      "UDG Freshman Cypher JP",
      "bbs Asia",
      "Plugg"
    ],
    "heat": 88,
    "bio": {
      "zh": "日本 UDG Freshman Cypher 2026 与 bbs Asia Underground Cypher 2026 成员；2026 专辑《Instinct》把 plugg、rage 和东京俱乐部声响混在一起。",
      "en": "A member of the Japan UDG Freshman Cypher 2026 and bbs Asia Underground Cypher 2026; the 2026 album Instinct mixes plugg, rage and Tokyo club sound.",
      "ko": "일본 UDG Freshman Cypher 2026와 bbs Asia Underground Cypher 2026 멤버. 2026년 앨범 《Instinct》는 플러그, 레이지, 도쿄 클럽 사운드를 섞는다.",
      "ja": "日本UDG Freshman Cypher 2026とbbs Asia Underground Cypher 2026のメンバー。2026年作『Instinct』はプラグ、レイジ、東京のクラブ・サウンドを混ぜる。"
    },
    "project": {
      "title": "goldenblue",
      "type": "single",
      "date": "2026-10-07",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/goldenblue-single/6815900766?uo=4",
      "preview": {
        "title": "goldenblue",
        "durationMs": 220800,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d4/a7/1d/d4a71d28-afbb-a3a9-e637-b393e4d916bf/mzaf_11788097660557070229.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/59/fa/5759fa5d-0992-84a0-7c01-a5c908711cac/4580789789533.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/goldenblue/6815900766?i=6815900767&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/jp/artist/kianna/1511764891?uo=4",
    "avatar": "avatars/kianna.jpg",
    "neteaseId": "56975039",
    "avatarSource": "netease"
  },
  {
    "id": "yvnlazy",
    "region": "jp",
    "styles": [
      "cloud-rap",
      "plugg"
    ],
    "name": {
      "zh": "Yvnlazy",
      "en": "Yvnlazy",
      "ko": "Yvnlazy",
      "ja": "Yvnlazy"
    },
    "latin": "YVNLAZY",
    "initial": "YV",
    "base": {
      "zh": "日本",
      "en": "Japan",
      "ko": "일본",
      "ja": "日本"
    },
    "tags": [
      "UDG Freshman Cypher JP",
      "bbs Asia",
      "Cloud Rap"
    ],
    "heat": 87,
    "bio": {
      "zh": "日本 UDG Freshman Cypher 2026 / bbs Asia Underground Cypher 2026 成员；2026 专辑《Re:Import》把 cloud rap 的雾气和 plugg 的弹性拉长。",
      "en": "A member of the Japan UDG Freshman Cypher 2026 and bbs Asia Underground Cypher 2026; the 2026 album Re:Import stretches cloud-rap haze and plugg elasticity.",
      "ko": "일본 UDG Freshman Cypher 2026와 bbs Asia Underground Cypher 2026 멤버. 2026년 앨범 《Re:Import》는 클라우드 랩의 안개와 플러그의 탄성을 늘린다.",
      "ja": "日本UDG Freshman Cypher 2026とbbs Asia Underground Cypher 2026のメンバー。2026年作『Re:Import』はクラウド・ラップの霧とプラグの弾力を引き伸ばす。"
    },
    "project": {
      "title": "Cradle",
      "type": "single",
      "date": "2026-10-28",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/cradle-single/6826141351?uo=4",
      "preview": {
        "title": "Cradle",
        "durationMs": 158118,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/af/bc/e0/afbce0da-76b0-e717-0881-d0eab41f6c18/mzaf_11998338505458306854.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cb/5f/97/cb5f9770-84aa-f25f-1abd-95b33c0c193c/4550795892596_cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/cradle/6826141351?i=6826141359&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/jp/artist/yvnlazy/1618545208?uo=4",
    "avatar": "avatars/yvnlazy.jpg",
    "neteaseId": "52221517",
    "avatarSource": "netease"
  },
  {
    "id": "esdeekid",
    "region": "eu",
    "styles": [
      "plugg"
    ],
    "name": {
      "zh": "EsDeeKid",
      "en": "EsDeeKid",
      "ko": "에스디키드",
      "ja": "エスディーキッド"
    },
    "latin": "ESDEEKID",
    "initial": "ES",
    "base": {
      "zh": "利物浦",
      "en": "Liverpool",
      "ko": "리버풀",
      "ja": "リヴァプール"
    },
    "tags": [
      "UDG New Music Express",
      "Liverpool"
    ],
    "heat": 88,
    "bio": {
      "zh": "利物浦蒙面 rapper，UDG 新歌速递推荐；2026 单曲《Bandit》把 British rap 的冷峻和地下 plugg 的失真接在一起。",
      "en": "A masked Liverpool rapper featured in UDG New Music Express; the 2026 single Bandit connects British rap's coldness with underground plugg distortion.",
      "ko": "리버풀의 마스크 래퍼. UDG 新歌速递에서 소개됐고, 2026년 싱글 〈Bandit〉은 UK 랩의 냉기와 언더그라운드 플러그의 왜곡을 연결한다.",
      "ja": "リヴァプールのマスクド・ラッパー。UDG 新歌速递で紹介され、2026年シングル「Bandit」はUKラップの冷たさとアンダーグラウンド・プラグの歪みを接続する。"
    },
    "project": {
      "title": "Bandit",
      "type": "single",
      "date": "2026-10-23",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/bandit-single/6820306883?uo=4",
      "preview": {
        "title": "Bandit",
        "durationMs": 110143,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/84/a4/ed84a4c5-75a6-ded7-291b-dc89de02dc8a/mzaf_11480394979587791367.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/75/56/fa/7556face-8d52-330e-869a-eb5bc2277460/075679551986.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/bandit/6820306883?i=6820307129&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/gb/artist/esdeekid/1754179834?uo=4",
    "avatar": "avatars/esdeekid.jpg",
    "neteaseId": "94095583",
    "avatarSource": "netease"
  },
  {
    "id": "slayr",
    "region": "na",
    "styles": [
      "rage",
      "plugg"
    ],
    "name": {
      "zh": "slayr",
      "en": "slayr",
      "ko": "슬레이어",
      "ja": "スレイヤー"
    },
    "latin": "SLAYR",
    "initial": "SL",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Rage",
      "Plugg",
      "Underground"
    ],
    "heat": 89,
    "bio": {
      "zh": "美国地下 rapper，以《Half Blood》《Power 4》和密集的单曲发行进入新一代地下视野；这里采用 slayr，而不是金属乐队 Slayer。",
      "en": "An American underground rapper whose Half Blood / Power 4 run and steady singles placed him in the new underground conversation. This entry is slayr, not the metal band Slayer.",
      "ko": "미국 언더그라운드 래퍼. 《Half Blood》《Power 4》와 꾸준한 싱글로 새로운 언더그라운드 대화에 들어왔다. 이 항목은 메탈 밴드 Slayer가 아닌 slayr다.",
      "ja": "アメリカのアンダーグラウンド・ラッパー。『Half Blood』『Power 4』と継続的なシングルで新しい地下の議論に加わった。ここではメタル・バンドのSlayerではなくslayrを指す。"
    },
    "project": {
      "title": "remember them days",
      "type": "single",
      "date": "2026-09-25",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/remember-them-days-single/6813633582?uo=4",
      "preview": {
        "title": "remember them days",
        "durationMs": 112208,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/94/24/3b/94243b66-4757-60b3-7b89-2a733f288920/mzaf_16721391426546845402.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b5/ee/cf/b5eecf00-a71b-0ded-91c1-9b6a828e85e0/196874801147.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/remember-them-days/6813633582?i=6813633584&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/slayr/1676805496?uo=4",
    "avatar": "avatars/slayr.jpg",
    "neteaseId": "49612680",
    "avatarSource": "netease"
  },
  {
    "id": "mofly",
    "region": "na",
    "styles": [
      "experimental",
      "hip-hop"
    ],
    "name": {
      "zh": "MoFly",
      "en": "MoFly",
      "ko": "MoFly",
      "ja": "MoFly"
    },
    "latin": "MOFLY",
    "initial": "MF",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Trap",
      "Electronic",
      "Underground"
    ],
    "heat": 81,
    "bio": {
      "zh": "美国地下 trap / 电子说唱制作人，2020 年代的《How It Feel》《4X4》把粗糙低音和旋律钩子留在 SoundCloud 式地下空间。",
      "en": "An American underground trap and electronic rap producer whose early-2020s singles How It Feel and 4X4 kept rough low-end and melodic hooks in a SoundCloud-shaped underground.",
      "ko": "미국 언더그라운드 트랩·전자 랩 프로듀서. 2020년대 초 《How It Feel》《4X4》는 거친 저음과 멜로디 훅을 사운드클라우드식 공간에 남겼다.",
      "ja": "アメリカのアンダーグラウンド・トラップ／エレクトロニック・ラップ・プロデューサー。2020年代初頭の「How It Feel」「4X4」は粗い低音とメロディックなフックをSoundCloud的な空間に残した。"
    },
    "project": {
      "title": "How It Feel",
      "type": "single",
      "date": "2021-01-19",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/how-it-feel-single/1550039962?uo=4",
      "preview": {
        "title": "How It Feel",
        "durationMs": 155847,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview124/v4/62/5d/8d/625d8dc0-bfe4-f142-9b15-d662a0efdf46/mzaf_6299812122812958589.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/47/ae/e6/47aee653-002e-50a4-e54c-99dbead2e7a4/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/how-it-feel/1550039962?i=1550039963&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/mofly/1520323789?uo=4",
    "avatar": "avatars/mofly.jpg",
    "neteaseId": "47471965",
    "avatarSource": "netease"
  },
  {
    "id": "lsgc",
    "region": "cn",
    "styles": [
      "experimental",
      "alternative"
    ],
    "name": {
      "zh": "LSGCsikoriot",
      "en": "LSGCsikoriot",
      "ko": "LSGCsikoriot",
      "ja": "LSGCsikoriot"
    },
    "latin": "LSGCSIKORIOT",
    "initial": "LS",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "Experimental",
      "Alternative",
      "China"
    ],
    "heat": 86,
    "bio": {
      "zh": "中文地下实验说唱里持续变形的声音；2026 年专辑《佛哦佛404》把噪音、旋律和自嘲式叙事推成一整块。",
      "en": "A constantly mutating voice in Chinese experimental underground rap; the 2026 album Fo0Fo pushes noise, melody and self-deprecating narrative into one block.",
      "ko": "중국 실험 언더그라운드 랩에서 계속 변형하는 목소리. 2026년 앨범 《佛哦佛404》는 노이즈, 멜로디, 자기조롱적 서사를 하나로 밀어붙인다.",
      "ja": "中国の実験的アンダーグラウンド・ラップで変形し続ける声。2026年作『佛哦佛404』はノイズ、メロディ、自嘲的な語りをひとつの塊へ押し込む。"
    },
    "project": {
      "title": "佛哦佛404(Fo0Fo)",
      "type": "album",
      "date": "2026-08-29",
      "tracks": 18,
      "appleUrl": "https://music.apple.com/us/album/%E4%BD%9B%E5%93%A6%E4%BD%9B404-fo0fo/6805015063?uo=4",
      "preview": {
        "title": "第404次离开intro",
        "durationMs": 163636,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/9d/e3/fe9de394-263b-dce8-8965-13ebf29838d1/mzaf_932117668794106609.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/18/26/e2/1826e212-990c-a5ce-e159-5f9814f30a13/6936738139252.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/%E7%AC%AC404%E6%AC%A1%E7%A6%BB%E5%BC%80intro/6805015063?i=6805015307&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/lsgcsikoriot/1581210956?uo=4",
    "avatar": "avatars/lsgc.jpg",
    "neteaseId": "33097968",
    "avatarSource": "netease"
  },
  {
    "id": "arthurnevawakes",
    "region": "cn",
    "styles": [
      "rage",
      "hip-hop"
    ],
    "name": {
      "zh": "Arthurnevawakes",
      "en": "Arthurnevawakes",
      "ko": "Arthurnevawakes",
      "ja": "Arthurnevawakes"
    },
    "latin": "ARTHURNEVAWAKES",
    "initial": "AR",
    "base": {
      "zh": "深圳",
      "en": "Shenzhen",
      "ko": "선전",
      "ja": "深圳"
    },
    "tags": [
      "Dark9",
      "Rage",
      "Shenzhen"
    ],
    "heat": 84,
    "bio": {
      "zh": "深圳 / 上海地下集体 DARK9COMMUNITY 的成员，也是中文 UDG 场景里最稳定的年轻声音之一；2026 年 EP《:)》继续把 rage 和旋律说唱拉近。",
      "en": "A member of the Shenzhen/Shanghai collective DARK9COMMUNITY and one of the steadiest young voices in Chinese UDG; the 2026 EP :) pulls rage and melodic rap closer together.",
      "ko": "선전/상하이 컬렉티브 DARK9COMMUNITY의 멤버이자 중국 UDG 씬의 안정적인 젊은 목소리. 2026년 EP 《:)》는 레이지와 멜로디 랩을 더 가깝게 당긴다.",
      "ja": "深圳／上海のコレクティブDARK9COMMUNITYのメンバーで、中国UDGシーンの安定した若い声。2026年EP『:)』はレイジとメロディック・ラップを近づける。"
    },
    "project": {
      "title": ":)",
      "type": "ep",
      "date": "2026-05-09",
      "tracks": 5,
      "appleUrl": "https://music.apple.com/us/album/ep/1895918651?uo=4",
      "preview": null
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/arthurnevawakes/1725095916?uo=4",
    "avatar": "avatars/arthurnevawakes.jpg",
    "neteaseId": "49439822",
    "avatarSource": "netease"
  },
  {
    "id": "sion",
    "region": "kr",
    "styles": [
      "digicore",
      "alternative"
    ],
    "name": {
      "zh": "Sion",
      "en": "Sion",
      "ko": "시온",
      "ja": "シオン"
    },
    "latin": "SION",
    "initial": "SI",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Electronic",
      "Digicore",
      "Seoul"
    ],
    "heat": 83,
    "bio": {
      "zh": "韩国地下电子 / 说唱制作人，2026 年 EP《Quiet Damage》把 digicore 的碎片、俱乐部低音和低声旋律压在一起。",
      "en": "A Korean underground electronic and rap producer; the 2026 EP Quiet Damage presses digicore fragments, club low-end and low-register melody together.",
      "ko": "한국 언더그라운드 전자·랩 프로듀서. 2026년 EP 《Quiet Damage》는 다이지코어의 파편, 클럽 저음, 낮은 멜로디를 함께 압축한다.",
      "ja": "韓国のアンダーグラウンド・エレクトロニック／ラップ・プロデューサー。2026年EP『Quiet Damage』はダイジコアの断片、クラブの低音、低いメロディを押し合わせる。"
    },
    "project": {
      "title": "Under Your Direction",
      "type": "single",
      "date": "2026-05-05",
      "tracks": 2,
      "appleUrl": "https://music.apple.com/us/album/under-your-direction-single/1889951506?uo=4",
      "preview": {
        "title": "Stand Still",
        "durationMs": 307165,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3c/96/72/3c9672d3-65cf-6940-a347-3c66ae99b42d/mzaf_18149265425580785158.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1f/b6/ef/1fb6efea-11ee-7ea0-db4e-57e73f4c9d6a/5026854992198.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/stand-still/1889951506?i=1889951675&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/kr/artist/sion/1410596394?uo=4",
    "avatar": "https://cdn-images.dzcdn.net/images/artist/18741f89105242fd9ef436a86014b457/500x500-000000-80-0-0.jpg"
  },
  {
    "id": "kuang-zhaobei",
    "region": "cn",
    "styles": [
      "hip-hop",
      "cloud-rap"
    ],
    "name": {
      "zh": "狂兆北",
      "en": "Kuang Zhaobei",
      "ko": "쿠앙 자오베이",
      "ja": "狂兆北"
    },
    "latin": "KUANG ZHAOBEI",
    "initial": "狂",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "Cloud Rap",
      "Hip-Hop",
      "China"
    ],
    "heat": 82,
    "bio": {
      "zh": "中文地下说唱里低音很厚的名字；2024 年单曲《Destruction frenzy》把 cloud rap 的雾和硬鼓点压在一起。",
      "en": "A low-heavy name in Chinese underground rap; the 2024 single Destruction frenzy presses cloud-rap haze against hard drums.",
      "ko": "중국 언더그라운드 랩에서 저음이 두터운 이름. 2024년 싱글 《Destruction frenzy》는 클라우드 랩의 안개를 단단한 드럼과 압축한다.",
      "ja": "中国アンダーグラウンド・ラップの低音の厚い名前。2024年シングル「Destruction frenzy」はクラウド・ラップの霧を硬いドラムに押し付ける。"
    },
    "project": {
      "title": "Destruction frenzy",
      "type": "single",
      "date": "2024-03-24",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/cn/album/destruction-frenzy-single/1735427448?uo=4",
      "preview": {
        "title": "Destruction frenzy",
        "durationMs": 142222,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/99/72/af/9972af96-37cc-f2d9-d32f-0c2f782791df/mzaf_9123124466487097297.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0f/38/bf/0f38bfa2-5c0b-a733-3bd6-8fd9bc06f590/196871938341.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/destruction-frenzy/1735427448?i=1735427501&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/cn/artist/%E7%8B%82%E5%85%86%E5%8C%97/1581747989?uo=4",
    "avatar": "avatars/kuang-zhaobei.jpg",
    "neteaseId": "30223665",
    "avatarSource": "netease"
  },
  {
    "id": "taco",
    "region": "cn",
    "styles": [
      "plugg",
      "rage"
    ],
    "name": {
      "zh": "Taco",
      "en": "Taco",
      "ko": "Taco",
      "ja": "Taco"
    },
    "latin": "TACO",
    "initial": "TA",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG",
      "Plugg",
      "Rage"
    ],
    "heat": 87,
    "bio": {
      "zh": "UDG 场景里出现频率极高的合作者；2026 年《in 55!w !》和与 delphia! 的合作继续把 plugg、rage 和卧室旋律混在一起。",
      "en": "One of the most frequent collaborators in the UDG scene; 2026 releases including in 55!w ! and the delphia! link keep mixing plugg, rage and bedroom melody.",
      "ko": "UDG 씬에서 가장 자주 등장하는 협업자 중 하나. 2026년 《in 55!w !》와 delphia! 협업은 플러그, 레이지, 베드룸 멜로디를 계속 섞는다.",
      "ja": "UDGシーンで最も頻繁に名前が挙がるコラボレーターの一人。2026年の『in 55!w !』やdelphia!との共作はプラグ、レイジ、ベッドルーム・メロディを混ぜ続ける。"
    },
    "project": {
      "title": "Backstage Pops (feat. skiboyvv)",
      "type": "single",
      "date": "2026-09-11",
      "tracks": 2,
      "appleUrl": "https://music.apple.com/us/album/backstage-pops-feat-skiboyvv-single/6811155541?uo=4",
      "preview": null
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/taco/1652977716?uo=4",
    "avatar": "avatars/taco.jpg",
    "neteaseId": "35169519",
    "avatarSource": "netease"
  },
  {
    "id": "delphia",
    "region": "cn",
    "styles": [
      "hyperpop",
      "plugg"
    ],
    "name": {
      "zh": "delphia!",
      "en": "delphia!",
      "ko": "delphia!",
      "ja": "delphia!"
    },
    "latin": "DELPHIA!",
    "initial": "DE",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "Hyperpop",
      "Plugg",
      "UDG"
    ],
    "heat": 86,
    "bio": {
      "zh": "UDG 场景的 hyperpop / plugg 名字，2022 年《Yah》已经把失真旋律和数字流行拧在一起；2026 年继续出现在 Taco、Chinglish 等人的合作里。",
      "en": "A hyperpop/plugg name in the UDG scene; 2022’s Yah already twisted distorted melody and digital pop together, and 2026 collaborations with Taco, Chinglish and others continue it.",
      "ko": "UDG 씬의 하이퍼팝/플러그 이름. 2022년 《Yah》는 왜곡된 멜로디와 디지털 팝을 꼬았고, 2026년 Taco·Chinglish 등과의 협업으로 이어진다.",
      "ja": "UDGシーンのハイパーポップ／プラグの名前。2022年『Yah』で歪んだメロディとデジタル・ポップを撚り合わせ、2026年もTacoやChinglishらとの共作を続ける。"
    },
    "project": {
      "title": "Yah",
      "type": "single",
      "date": "2022-10-01",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/yah-single/1647980212?uo=4",
      "preview": {
        "title": "Yah",
        "durationMs": 144000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/21/54/db/2154dbe0-378b-456b-6921-b37c5d030d0f/mzaf_9384800975960149622.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ad/b3/7c/adb37cee-ea17-39b5-19d8-c1dd38dcafb9/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/yah/1647980212?i=1647980214&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/delphia/1666004335?uo=4",
    "avatar": "avatars/delphia.jpg",
    "neteaseId": "13296078",
    "avatarSource": "netease"
  },
  {
    "id": "westwood",
    "region": "eu",
    "styles": [
      "alternative",
      "experimental"
    ],
    "name": {
      "zh": "Westwood",
      "en": "Westwood",
      "ko": "Westwood",
      "ja": "Westwood"
    },
    "latin": "WESTWOOD",
    "initial": "WW",
    "base": {
      "zh": "英国",
      "en": "United Kingdom",
      "ko": "영국",
      "ja": "イギリス"
    },
    "tags": [
      "Alternative",
      "UDG",
      "Live"
    ],
    "heat": 88,
    "bio": {
      "zh": "UDG 新歌速递推荐的另类名字；2026 年专辑《Luxury》把失真吉他、电子纹理和说唱人声揉在一起，并计划中国巡演。",
      "en": "An alternative name featured in UDG New Music Express; the 2026 album Luxury folds distorted guitar, electronic texture and rap vocals together, with a China tour planned.",
      "ko": "UDG 新歌速递에서 소개된 얼터너티브 이름. 2026년 앨범 《Luxury》는 왜곡 기타, 전자 질감, 랩 보컬을 함께 접고 중국 투어를 예고했다.",
      "ja": "UDG 新歌速递で紹介されたオルタナティブな名前。2026年作『Luxury』は歪んだギター、エレクトロニックな質感、ラップ・ヴォーカルを折り重ね、中国ツアーも予定する。"
    },
    "project": {
      "title": "Luxury",
      "type": "album",
      "date": "2026-10-23",
      "tracks": 12,
      "appleUrl": "https://music.apple.com/us/album/luxury/6823045579?uo=4",
      "preview": {
        "title": "On The Floor",
        "durationMs": 214513,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/39/14/6b/39146b75-aa1d-0bc1-9e7c-16e40eb131b5/mzaf_13681500841601711385.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/9d/bd/a19dbdb6-1f23-6f39-335d-df94d657ee99/075679551078.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/on-the-floor/6823045579?i=6823045582&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/westwood/1719387562?uo=4",
    "avatar": "avatars/westwood.jpg",
    "neteaseId": "12910116",
    "avatarSource": "netease"
  },
  {
    "id": "nato",
    "region": "cn",
    "styles": [
      "rage",
      "plugg"
    ],
    "name": {
      "zh": "nato",
      "en": "nato",
      "ko": "nato",
      "ja": "nato"
    },
    "latin": "NATO",
    "initial": "NA",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG",
      "Rage",
      "China"
    ],
    "heat": 85,
    "bio": {
      "zh": "中文 UDG 的新一代，2026 年专辑《Let The Young Punks Dance》用 rage 的冲击和 plugg 的旋律把整张项目推起来。",
      "en": "A newer Chinese UDG voice; the 2026 album Let The Young Punks Dance drives the whole project on rage impact and plugg melody.",
      "ko": "중국 UDG의 새로운 세대. 2026년 앨범 《Let The Young Punks Dance》는 레이지의 충격과 플러그의 멜로디로 프로젝트 전체를 밀어붙인다.",
      "ja": "中国UDGの新しい世代。2026年作『Let The Young Punks Dance』はレイジの衝撃とプラグのメロディでプロジェクト全体を押し進める。"
    },
    "project": {
      "title": "Let The Young Punks Dance",
      "type": "album",
      "date": "2026-04-30",
      "tracks": 21,
      "appleUrl": "https://music.apple.com/us/album/let-the-young-punks-dance/1895627198?uo=4",
      "preview": {
        "title": "rock paper strippers",
        "durationMs": 91095,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1c/58/1c/1c581ce4-d023-3977-2b8a-3a81b6233799/mzaf_3967817673251731252.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/f0/f0/c6f0f0ae-e7c8-ca2a-2469-a5a5e222f9c4/cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/rock-paper-strippers/1895627198?i=6764074913&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/nato/1748413099?uo=4",
    "avatar": "avatars/nato.jpg",
    "neteaseId": "55832201",
    "avatarSource": "netease"
  },
  {
    "id": "skyte",
    "region": "na",
    "styles": [
      "plugg",
      "cloud-rap"
    ],
    "name": {
      "zh": "Skyte",
      "en": "Skyte",
      "ko": "Skyte",
      "ja": "Skyte"
    },
    "latin": "SKYTE",
    "initial": "SK",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Plugg",
      "Cloud Rap",
      "Underground"
    ],
    "heat": 81,
    "bio": {
      "zh": "美国地下 rapper，作品目录极长；2026 年专辑《lovekills》把 plugg 的弹性和 cloud rap 的雾拉成一条线。",
      "en": "An American underground rapper with a deep catalogue; the 2026 album lovekills stretches plugg elasticity and cloud-rap haze into one line.",
      "ko": "미국 언더그라운드 래퍼로 카탈로그가 매우 길다. 2026년 앨범 《lovekills》는 플러그의 탄성과 클라우드 랩의 안개를 한 줄로 늘인다.",
      "ja": "アメリカのアンダーグラウンド・ラッパーで、カタログが非常に長い。2026年作『lovekills』はプラグの弾力とクラウド・ラップの霧を一本の線に伸ばす。"
    },
    "project": {
      "title": "Skyte Round 1",
      "type": "single",
      "date": "2026-07-17",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/skyte-round-1-single/6785605511?uo=4",
      "preview": {
        "title": "Skyte Round 1",
        "durationMs": 104118,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/89/68/2a/89682a00-0304-9af8-4868-9028c55ecb1e/mzaf_10949826368803782279.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/68/15/e2/6815e269-9e4c-d81c-9c19-3e2e79ee4a46/199316667394_cover.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/skyte-round-1/6785605511?i=6785605513&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/skyte/1521974191?uo=4",
    "avatar": "avatars/skyte.jpg",
    "neteaseId": "35808237",
    "avatarSource": "netease"
  },
  {
    "id": "2hollis",
    "region": "na",
    "styles": [
      "experimental",
      "hyperpop"
    ],
    "name": {
      "zh": "2hollis",
      "en": "2hollis",
      "ko": "2hollis",
      "ja": "2hollis"
    },
    "latin": "2HOLLIS",
    "initial": "2H",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Experimental",
      "Hyperpop",
      "Pop"
    ],
    "heat": 89,
    "bio": {
      "zh": "美国实验流行 / 说唱制作人，2026 年单曲《Sex》继续把俱乐部鼓、失真合成器和耳语式人声压成自己的流行怪物。",
      "en": "An American experimental pop and rap producer; the 2026 single Sex keeps compressing club drums, distorted synths and whispered vocals into his own pop monster.",
      "ko": "미국 실험 팝·랩 프로듀서. 2026년 싱글 〈Sex〉는 클럽 드럼, 왜곡 신스, 속삭이는 보컬을 계속 압축해 자신만의 팝 괴물을 만든다.",
      "ja": "アメリカの実験的ポップ／ラップ・プロデューサー。2026年シングル「Sex」はクラブ・ドラム、歪んだシンセ、囁く声を圧縮し、独自のポップ・モンスターを作り続ける。"
    },
    "project": {
      "title": "Warhorse",
      "type": "single",
      "date": "2026-09-21",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/warhorse-single/6816292324?uo=4",
      "preview": null
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/2hollis/1535847112?uo=4",
    "avatar": "avatars/2hollis.jpg",
    "neteaseId": "37149872",
    "avatarSource": "netease"
  },
  {
    "id": "lucy-bedroque",
    "region": "na",
    "styles": [
      "digicore",
      "hyperpop"
    ],
    "name": {
      "zh": "Lucy Bedroque",
      "en": "Lucy Bedroque",
      "ko": "Lucy Bedroque",
      "ja": "Lucy Bedroque"
    },
    "latin": "LUCY BEDROQUE",
    "initial": "LB",
    "base": {
      "zh": "美国",
      "en": "United States",
      "ko": "미국",
      "ja": "アメリカ"
    },
    "tags": [
      "Digicore",
      "Hyperpop",
      "Art Pop"
    ],
    "heat": 87,
    "bio": {
      "zh": "美国地下 digicore / 艺术流行创作者，2026 年专辑《c》用碎裂的电子、说唱和极简旋律把自己推向更奇怪的流行边界。",
      "en": "An American underground digicore and art-pop artist; the 2026 album c pushes fragmented electronics, rap and minimal melody toward a stranger pop edge.",
      "ko": "미국 언더그라운드 다이지코어·아트 팝 아티스트. 2026년 앨범 《c》는 조각난 전자음, 랩, 미니멀 멜로디를 더 이상한 팝 경계로 밀어낸다.",
      "ja": "アメリカのアンダーグラウンド・ダイジコア／アート・ポップ・アーティスト。2026年作『c』は断片化したエレクトロニクス、ラップ、ミニマルなメロディをより奇妙なポップの縁へ押し出す。"
    },
    "project": {
      "title": "SPEED DEMON / I KNOW (MY INFLUENCE)",
      "type": "single",
      "date": "2026-10-30",
      "tracks": 2,
      "appleUrl": "https://music.apple.com/us/album/speed-demon-i-know-my-influence-single/6826384553?uo=4",
      "preview": {
        "title": "SPEED DEMON",
        "durationMs": 145778,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/32/11/0b/32110bb7-51af-86e1-6df8-50897079e8e8/mzaf_16725553473472613832.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/66/6a/de/666ade11-1524-1683-7474-ad23742f5f51/075679548863.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/speed-demon/6826384553?i=6826384561&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/lucy-bedroque/1734729660?uo=4",
    "avatar": "avatars/lucy-bedroque.jpg",
    "neteaseId": "60594286",
    "avatarSource": "netease"
  },
  {
    "id": "drogas",
    "region": "cn",
    "styles": [
      "plugg",
      "cloud-rap"
    ],
    "name": {
      "zh": "Drogas",
      "en": "Drogas",
      "ko": "Drogas",
      "ja": "Drogas"
    },
    "latin": "DROGAS",
    "initial": "DR",
    "base": {
      "zh": "中国",
      "en": "China",
      "ko": "중국",
      "ja": "中国"
    },
    "tags": [
      "UDG",
      "Plugg",
      "Cloud Rap"
    ],
    "heat": 86,
    "bio": {
      "zh": "上海 UDG 场景里常被低估的名字，2026 年单曲《愛如雨》和 Taco、delphia! 的合作把他的 plugg 漂移感带进更大的视野。",
      "en": "An underrated name in the Shanghai UDG scene; his 2026 single Ai Ru Yu and collaborations with Taco and delphia! bring his plugg drift into a wider frame.",
      "ko": "상하이 UDG 씬에서 저평가된 이름. 2026년 싱글 《愛如雨》와 Taco, delphia!와의 협업으로 플러그의 표류감을 더 넓은 시야에 놓았다.",
      "ja": "上海UDGシーンの過小評価された名前。2026年シングル『愛如雨』とTaco、delphia!との共作で、プラグの漂流感をより広い視界へ運んだ。"
    },
    "project": {
      "title": "D.S.P",
      "type": "single",
      "date": "2026-05-05",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/d-s-p-single/1895914314?uo=4",
      "preview": {
        "title": "D.S.P",
        "durationMs": 125538,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/b0/6b/feb06b86-1c8f-3729-ee2c-539ec2b37a0e/mzaf_8613336255038952757.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6d/d6/ef/6dd6efe0-23cb-5eec-7ac6-f072af9465a2/6937451276736.png/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/d-s-p/1895914314?i=6764784631&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/drogas/1272960890?uo=4",
    "avatar": "avatars/drogas.jpg",
    "neteaseId": "50705168",
    "avatarSource": "netease"
  },
  {
    "id": "molly-yam",
    "region": "kr",
    "styles": [
      "experimental",
      "hip-hop"
    ],
    "name": {
      "zh": "Molly Yam",
      "en": "Molly Yam",
      "ko": "몰리 얌",
      "ja": "モリー・ヤム"
    },
    "latin": "MOLLY YAM",
    "initial": "MY",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "Trap",
      "R&B",
      "Experimental"
    ],
    "heat": 85,
    "bio": {
      "zh": "韩国说唱场景的病毒式名字，2025 年 EP《TIKTOKSTA》与 Loco、Kid Milli 合作，2026 年续作继续把 trap、R&B 和实验电子打碎。",
      "en": "A viral name in Korean rap. His 2025 EP TIKTOKSTA collaborated with Loco and Kid Milli; the 2026 sequel keeps breaking trap, R&B and experimental electronics apart.",
      "ko": "한국 랩 신의 바이럴 이름. 2025년 EP 《TIKTOKSTA》는 Loco, Kid Milli와 협업했고, 2026년 후속작은 트랩, R&B, 실험 전자음을 계속 부순다.",
      "ja": "韓国ラップ scene のバイラルな名前。2025年EP『TIKTOKSTA』ではLoco、Kid Milliと共演し、2026年の続編はトラップ、R&B、実験的エレクトロニクスを砕き続ける。"
    },
    "project": {
      "title": "TIKTOKSTA Ⅱ",
      "type": "album",
      "date": "2026-06-18",
      "tracks": 18,
      "appleUrl": "https://music.apple.com/us/album/tiktoksta/6781088292?uo=4",
      "preview": {
        "title": "TIKTOKSTA Ⅱ",
        "durationMs": 166400,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/71/77/49/71774921-0633-9650-7da9-cceb8605a33f/mzaf_12345179359106645321.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3a/d4/ba/3ad4baf5-26ba-e222-d28e-25dd5e7a9b6f/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/tiktoksta/6781088292?i=6781088294&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/molly-yam/1761391705?uo=4",
    "avatar": "avatars/molly-yam.jpg",
    "neteaseId": "62188852",
    "avatarSource": "netease"
  },
  {
    "id": "rrriot",
    "region": "hktw",
    "styles": [
      "pluggnb",
      "hyperpop"
    ],
    "name": {
      "zh": "R!R!Riot",
      "en": "R!R!Riot",
      "ko": "R!R!Riot",
      "ja": "R!R!Riot"
    },
    "latin": "R!R!RIOT",
    "initial": "RR",
    "base": {
      "zh": "台湾",
      "en": "Taiwan",
      "ko": "대만",
      "ja": "台湾"
    },
    "tags": [
      "Pluggnb",
      "Hyperpop",
      "Taiwan"
    ],
    "heat": 87,
    "bio": {
      "zh": "台湾 pluggnb 场景最鲜亮的名字之一；Dazed 称她为“台湾的 pluggnb princess”，2026 年《Grey Skies》继续把甜旋律和失真低音拧在一起。",
      "en": "One of the brightest names in Taiwan’s pluggnb scene, described by Dazed as Taiwan’s pluggnb princess; her 2026 single Grey Skies keeps twisting sweet melody and distorted low-end together.",
      "ko": "대만 플러그앤비 씬의 가장 밝은 이름 중 하나. Dazed가 ‘대만의 플러그앤비 프린세스’라고 부른 아티스트로, 2026년 《Grey Skies》는 달콤한 멜로디와 왜곡된 저음을 계속 비튼다.",
      "ja": "台湾プラグンビ・シーンの最も鮮やかな名前のひとつ。Dazedに「台湾のプラグンビ・プリンセス」と呼ばれ、2026年「Grey Skies」は甘いメロディと歪んだ低音を撚り続ける。"
    },
    "project": {
      "title": "LVL R",
      "type": "album",
      "date": "2025-04-11",
      "tracks": 10,
      "appleUrl": "https://music.apple.com/us/album/lvl-r/1807310220?uo=4",
      "preview": null
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/r-r-riot/1686470173?uo=4",
    "avatar": "avatars/rrriot.jpg",
    "neteaseId": "56724807",
    "avatarSource": "netease"
  },
  {
    "id": "hinji",
    "region": "kr",
    "styles": [
      "plugg",
      "rage"
    ],
    "name": {
      "zh": "hinji",
      "en": "hinji",
      "ko": "힌지",
      "ja": "ヒンジ"
    },
    "latin": "HINJI",
    "initial": "HJ",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "UDG Freshman Cypher KR",
      "Plugg",
      "Rage"
    ],
    "heat": 85,
    "bio": {
      "zh": "韩国 UDG Freshman Cypher 2026 成员；2026 年专辑《YOU ARE THE WORST》把 plugg、rage 和带刺的旋律推到前面。",
      "en": "A member of the Korean UDG Freshman Cypher 2026; his 2026 album YOU ARE THE WORST pushes plugg, rage and prickly melody to the front.",
      "ko": "한국 UDG Freshman Cypher 2026 멤버. 2026년 앨범 《YOU ARE THE WORST》는 플러그, 레이지, 가시 같은 멜로디를 앞으로 밀어낸다.",
      "ja": "韓国UDG Freshman Cypher 2026のメンバー。2026年作『YOU ARE THE WORST』はプラグ、レイジ、棘のあるメロディを前景へ押し出す。"
    },
    "project": {
      "title": "YOU ARE THE WORST",
      "type": "album",
      "date": "2026-08-22",
      "tracks": 12,
      "appleUrl": "https://music.apple.com/us/album/you-are-the-worst/6802932705?uo=4",
      "preview": {
        "title": "JA MORANT",
        "durationMs": 148402,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/69/9f/61/699f61fb-8390-48c7-2b1b-187ed399f0b3/mzaf_16845885652597885330.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/89/8e/a4898ea3-1776-f5ac-e3c9-77b38bf32574/191953570594.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/ja-morant/6802932705?i=6802932706&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/hinji/1853485222?uo=4",
    "avatar": "avatars/hinji.jpg",
    "neteaseId": "33760720",
    "avatarSource": "netease"
  },
  {
    "id": "pakaowlla",
    "region": "kr",
    "styles": [
      "plugg",
      "cloud-rap"
    ],
    "name": {
      "zh": "pakaowlla",
      "en": "pakaowlla",
      "ko": "파카울라",
      "ja": "パカオラ"
    },
    "latin": "PAKAOWLLA",
    "initial": "PK",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "UDG Freshman Cypher KR",
      "Plugg",
      "Cloud Rap"
    ],
    "heat": 84,
    "bio": {
      "zh": "韩国 UDG Freshman Cypher 2026 成员；2026 年单曲《mini》在 plugg、另类 R&B 和 cloud rap 的雾里滑动。",
      "en": "A member of the Korean UDG Freshman Cypher 2026; his 2026 single mini slides through plugg, alternative R&B and cloud-rap haze.",
      "ko": "한국 UDG Freshman Cypher 2026 멤버. 2026년 싱글 〈mini〉는 플러그, 얼터너티브 R&B, 클라우드 랩의 안개 사이를 미끄러진다.",
      "ja": "韓国UDG Freshman Cypher 2026のメンバー。2026年シングル「mini」はプラグ、オルタナティブR&B、クラウド・ラップの霧を滑る。"
    },
    "project": {
      "title": "mini (feat. aliswa)",
      "type": "single",
      "date": "2026-07-24",
      "tracks": 1,
      "appleUrl": "https://music.apple.com/us/album/mini-feat-aliswa-single/6791256175?uo=4",
      "preview": {
        "title": "mini (feat. aliswa)",
        "durationMs": 138868,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f2/d5/3f/f2d53f81-6f52-a1c9-3fd4-2328a2b15de0/mzaf_11042479999753580419.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/84/26/9b8426c4-dfcd-a4d5-1bb2-071eb1300a31/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/mini-feat-aliswa/6791256175?i=6791256176&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/pakaowlla/1719021854?uo=4",
    "avatar": "https://cdn-images.dzcdn.net/images/artist/0a2e0ebd2dcece30db6ee9619d26fd1d/500x500-000000-80-0-0.jpg"
  },
  {
    "id": "karaika",
    "region": "kr",
    "styles": [
      "digicore",
      "experimental"
    ],
    "name": {
      "zh": "karaika",
      "en": "karaika",
      "ko": "카라이카",
      "ja": "カライカ"
    },
    "latin": "KARAIKA",
    "initial": "KA",
    "base": {
      "zh": "首尔",
      "en": "Seoul",
      "ko": "서울",
      "ja": "ソウル"
    },
    "tags": [
      "UDG Freshman Cypher KR",
      "Digicore",
      "Experimental"
    ],
    "heat": 84,
    "bio": {
      "zh": "韩国 UDG Freshman Cypher 2026 成员；2026 年专辑《Submit Evidence》把 digicore 的碎片、噪音和旋律放进同一间实验室。",
      "en": "A member of the Korean UDG Freshman Cypher 2026; the 2026 album Submit Evidence puts digicore fragments, noise and melody in the same laboratory.",
      "ko": "한국 UDG Freshman Cypher 2026 멤버. 2026년 앨범 《Submit Evidence》는 다이지코어의 파편, 노이즈, 멜로디를 같은 실험실에 넣는다.",
      "ja": "韓国UDG Freshman Cypher 2026のメンバー。2026年作『Submit Evidence』はダイジコアの断片、ノイズ、メロディを同じ実験室に置く。"
    },
    "project": {
      "title": "Submit Evidence",
      "type": "album",
      "date": "2026-10-29",
      "tracks": 12,
      "appleUrl": "https://music.apple.com/us/album/submit-evidence/6826544355?uo=4",
      "preview": {
        "title": "Xiamen bound train swallowed LSD / G3046",
        "durationMs": 73000,
        "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d8/c2/f7/d8c2f7f1-f7fc-5866-ed56-57cab5907acb/mzaf_11644459479588834832.plus.aac.p.m4a",
        "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c1/d9/ae/c1d9ae3c-653c-e9ac-d8bf-2e4312aabd26/artwork.jpg/100x100bb.jpg",
        "appleUrl": "https://music.apple.com/us/album/xiamen-bound-train-swallowed-lsd-g3046/6826544355?i=6826544356&uo=4"
      }
    },
    "artistAppleUrl": "https://music.apple.com/us/artist/karaika/1777412041?uo=4",
    "avatar": "avatars/karaika.jpg",
    "neteaseId": "59659039",
    "avatarSource": "netease"
  }
];

  window.SUBLEVEL = {
    meta: {
      edition: "VOL. 02",
      window: "不限年份",
      updated: "2026-11-01",
      curatedCount: ARTISTS.length,
      focus: "UDG / UG"
    },
    regions: REGIONS,
    styles: STYLES,
    platforms: PLATFORMS,
    regionPlatforms: REGION_PLATFORMS,
    artists: ARTISTS
  };
})();
