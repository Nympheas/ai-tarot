export type Hexagram = {
  number: number;
  name: string;
  nameZh: string;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
  keywords: string[];
  guaci: string; // 卦辞
  meaning: string;
};

export const HEXAGRAMS: Hexagram[] = [
  { number: 1, name: "Qian", nameZh: "乾", symbol: "䷀", upperTrigram: "乾天", lowerTrigram: "乾天", keywords: ["创始", "刚健", "自强"], guaci: "元，亨，利，贞", meaning: "天行健，君子以自强不息。阳刚至极，万物创始之力。" },
  { number: 2, name: "Kun", nameZh: "坤", symbol: "䷁", upperTrigram: "坤地", lowerTrigram: "坤地", keywords: ["包容", "柔顺", "承载"], guaci: "元亨，利牝马之贞", meaning: "地势坤，君子以厚德载物。柔顺包容，承载万物生长。" },
  { number: 3, name: "Zhun", nameZh: "屯", symbol: "䷂", upperTrigram: "坎水", lowerTrigram: "震雷", keywords: ["艰难", "初创", "积累"], guaci: "元亨，利贞，勿用有攸往", meaning: "万事起步艰难，如草木破土而出。宜积累力量，不宜贸然前进。" },
  { number: 4, name: "Meng", nameZh: "蒙", symbol: "䷃", upperTrigram: "艮山", lowerTrigram: "坎水", keywords: ["蒙昧", "启蒙", "学习"], guaci: "亨，匪我求童蒙，童蒙求我", meaning: "蒙昧需要开启，虚心求教方能进步。学习是一生的功课。" },
  { number: 5, name: "Xu", nameZh: "需", symbol: "䷄", upperTrigram: "坎水", lowerTrigram: "乾天", keywords: ["等待", "滋养", "时机"], guaci: "有孚，光亨，贞吉", meaning: "时机未至，宜耐心等待。饮食宴乐，养精蓄锐，静待良机。" },
  { number: 6, name: "Song", nameZh: "讼", symbol: "䷅", upperTrigram: "乾天", lowerTrigram: "坎水", keywords: ["争讼", "慎重", "折中"], guaci: "有孚，窒，惕，中吉，终凶", meaning: "争执易起，慎勿执一。寻求中道调解，过争则两败俱伤。" },
  { number: 7, name: "Shi", nameZh: "师", symbol: "䷆", upperTrigram: "坤地", lowerTrigram: "坎水", keywords: ["军队", "纪律", "领导"], guaci: "贞，丈人，吉，无咎", meaning: "统御需有威信，领导需有德行。纪律与包容并重，方能众志成城。" },
  { number: 8, name: "Bi", nameZh: "比", symbol: "䷇", upperTrigram: "坎水", lowerTrigram: "坤地", keywords: ["亲比", "联合", "辅佐"], guaci: "吉，原筮，元永贞，无咎", meaning: "亲密联合，互助合作。审慎选择盟友，真诚方能长久。" },
  { number: 9, name: "Xiao Xu", nameZh: "小畜", symbol: "䷈", upperTrigram: "巽风", lowerTrigram: "乾天", keywords: ["蓄积", "小成", "柔化"], guaci: "亨，密云不雨，自我西郊", meaning: "小有积累，尚未全成。柔能克刚，顺势而为，静待时机成熟。" },
  { number: 10, name: "Lü", nameZh: "履", symbol: "䷉", upperTrigram: "乾天", lowerTrigram: "兑泽", keywords: ["礼仪", "谨慎", "行进"], guaci: "履虎尾，不咥人，亨", meaning: "如踩虎尾，行事须谨慎合礼。以礼节行，虽险亦吉。" },
  { number: 11, name: "Tai", nameZh: "泰", symbol: "䷊", upperTrigram: "坤地", lowerTrigram: "乾天", keywords: ["通泰", "和谐", "顺畅"], guaci: "小往大来，吉，亨", meaning: "天地交泰，万物通畅。阴阳和合，此乃大吉之象。" },
  { number: 12, name: "Pi", nameZh: "否", symbol: "䷋", upperTrigram: "乾天", lowerTrigram: "坤地", keywords: ["闭塞", "停滞", "守道"], guaci: "否之匪人，不利君子贞", meaning: "天地不交，万物不通。小人当道，君子宜退守待时。" },
  { number: 13, name: "Tong Ren", nameZh: "同人", symbol: "䷌", upperTrigram: "乾天", lowerTrigram: "离火", keywords: ["协同", "团结", "开明"], guaci: "同人于野，亨，利涉大川", meaning: "与人和同，开诚布公。广结善缘，共同前进，可成大事。" },
  { number: 14, name: "Da You", nameZh: "大有", symbol: "䷍", upperTrigram: "离火", lowerTrigram: "乾天", keywords: ["丰盛", "宽容", "守正"], guaci: "元亨", meaning: "大有所获，居高位而谦逊。以德配位，防骄奢而守正。" },
  { number: 15, name: "Qian", nameZh: "谦", symbol: "䷎", upperTrigram: "坤地", lowerTrigram: "艮山", keywords: ["谦逊", "自损", "均衡"], guaci: "亨，君子有终", meaning: "谦道利人，有终必吉。居功不傲，以谦养德，天道损满益谦。" },
  { number: 16, name: "Yu", nameZh: "豫", symbol: "䷏", upperTrigram: "震雷", lowerTrigram: "坤地", keywords: ["预备", "喜悦", "顺动"], guaci: "利建侯行师", meaning: "顺势而动，豫则立。提前谋划，鼓舞士气，行动正当其时。" },
  { number: 17, name: "Sui", nameZh: "随", symbol: "䷐", upperTrigram: "兑泽", lowerTrigram: "震雷", keywords: ["随顺", "跟随", "适应"], guaci: "元亨，利贞，无咎", meaning: "随时变通，顺应自然。随非盲从，择善而随，方为正道。" },
  { number: 18, name: "Gu", nameZh: "蛊", symbol: "䷑", upperTrigram: "艮山", lowerTrigram: "巽风", keywords: ["整治", "革新", "修复"], guaci: "元亨，利涉大川", meaning: "积弊已久，需要整治。敢于变革，拨乱反正，可迎新局。" },
  { number: 19, name: "Lin", nameZh: "临", symbol: "䷒", upperTrigram: "坤地", lowerTrigram: "兑泽", keywords: ["临近", "进取", "关怀"], guaci: "元亨，利贞，至于八月有凶", meaning: "阳气渐长，临近时机。关怀下属，亲临其境，但需防盛极而衰。" },
  { number: 20, name: "Guan", nameZh: "观", symbol: "䷓", upperTrigram: "巽风", lowerTrigram: "坤地", keywords: ["观察", "示范", "省思"], guaci: "盥而不荐，有孚颙若", meaning: "仔细观察，审时度势。以身示范，省察自身，方能洞见真相。" },
  { number: 21, name: "Shi He", nameZh: "噬嗑", symbol: "䷔", upperTrigram: "离火", lowerTrigram: "震雷", keywords: ["决断", "刑法", "贯通"], guaci: "亨，利用狱", meaning: "噬而合之，去除障碍。遇事须果断，破除阻隔方能通畅。" },
  { number: 22, name: "Bi", nameZh: "贲", symbol: "䷕", upperTrigram: "艮山", lowerTrigram: "离火", keywords: ["文饰", "美化", "内外兼修"], guaci: "亨，小利有攸往", meaning: "文质彬彬，内外兼修。装饰美化有其价值，但本质比外表更重要。" },
  { number: 23, name: "Bo", nameZh: "剥", symbol: "䷖", upperTrigram: "艮山", lowerTrigram: "坤地", keywords: ["剥落", "消退", "待时"], guaci: "不利有攸往", meaning: "阴盛阳衰，小人得势。时势不利，宜顺势退守，静待阳复。" },
  { number: 24, name: "Fu", nameZh: "复", symbol: "䷗", upperTrigram: "坤地", lowerTrigram: "震雷", keywords: ["回归", "复苏", "转机"], guaci: "亨，出入无疾，朋来无咎", meaning: "阳气初回，生机复苏。否极泰来，新的循环正在开始。" },
  { number: 25, name: "Wu Wang", nameZh: "无妄", symbol: "䷘", upperTrigram: "乾天", lowerTrigram: "震雷", keywords: ["真实", "自然", "诚正"], guaci: "元亨，利贞，其匪正有眚", meaning: "无妄而为，顺乎自然。真诚无伪，不心存侥幸，方合天道。" },
  { number: 26, name: "Da Xu", nameZh: "大畜", symbol: "䷙", upperTrigram: "艮山", lowerTrigram: "乾天", keywords: ["大积累", "充实", "止而后动"], guaci: "利贞，不家食，吉，利涉大川", meaning: "积蓄力量，厚积薄发。蓄德养才，时机成熟方可大展宏图。" },
  { number: 27, name: "Yi", nameZh: "颐", symbol: "䷚", upperTrigram: "艮山", lowerTrigram: "震雷", keywords: ["养育", "节制", "自养"], guaci: "贞吉，观颐，自求口实", meaning: "颐养之道，慎其所养。饮食言语须节制，养身更需养心。" },
  { number: 28, name: "Da Guo", nameZh: "大过", symbol: "䷛", upperTrigram: "兑泽", lowerTrigram: "巽风", keywords: ["重大", "非常时期", "独立"], guaci: "栋桡，利有攸往，亨", meaning: "大过其常，承压极大。非常时期需非常手段，独立承担方显担当。" },
  { number: 29, name: "Kan", nameZh: "坎", symbol: "䷜", upperTrigram: "坎水", lowerTrigram: "坎水", keywords: ["险难", "坚守", "诚信"], guaci: "有孚，维心亨，行有尚", meaning: "重重险难，惟心诚则通。坚守正道，不失信义，险中求通。" },
  { number: 30, name: "Li", nameZh: "离", symbol: "䷝", upperTrigram: "离火", lowerTrigram: "离火", keywords: ["依附", "光明", "文明"], guaci: "利贞，亨，畜牝牛吉", meaning: "离火相依，光明普照。依附正道，柔顺守正，可成光明之业。" },
  { number: 31, name: "Xian", nameZh: "咸", symbol: "䷞", upperTrigram: "兑泽", lowerTrigram: "艮山", keywords: ["感应", "互动", "婚恋"], guaci: "亨，利贞，取女吉", meaning: "男女相感，天地交应。以虚心感人，真诚相应，情感自然生发。" },
  { number: 32, name: "Heng", nameZh: "恒", symbol: "䷟", upperTrigram: "震雷", lowerTrigram: "巽风", keywords: ["持久", "恒常", "坚定"], guaci: "亨，无咎，利贞，利有攸往", meaning: "恒久之道，贵在坚持。守其正道，持之以恒，方能成就大业。" },
  { number: 33, name: "Dun", nameZh: "遁", symbol: "䷠", upperTrigram: "乾天", lowerTrigram: "艮山", keywords: ["退隐", "远离", "保全"], guaci: "亨，小利贞", meaning: "小人渐盛，君子宜退。退非逃避，是为保全实力，以待时机。" },
  { number: 34, name: "Da Zhuang", nameZh: "大壮", symbol: "䷡", upperTrigram: "震雷", lowerTrigram: "乾天", keywords: ["壮大", "阳刚", "正道用力"], guaci: "利贞", meaning: "阳气壮盛，力量充沛。壮须用于正道，力量若无节制则适得其反。" },
  { number: 35, name: "Jin", nameZh: "晋", symbol: "䷢", upperTrigram: "离火", lowerTrigram: "坤地", keywords: ["晋升", "进步", "光明"], guaci: "康侯用锡马蕃庶，昼日三接", meaning: "光明上进，受到认可。顺势而升，以德服人，前途一片光明。" },
  { number: 36, name: "Ming Yi", nameZh: "明夷", symbol: "䷣", upperTrigram: "坤地", lowerTrigram: "离火", keywords: ["隐忍", "韬光", "保守内明"], guaci: "利艰贞", meaning: "光明受损，暗时宜韬晦。隐藏锋芒，保守内明，静待黑暗过去。" },
  { number: 37, name: "Jia Ren", nameZh: "家人", symbol: "䷤", upperTrigram: "巽风", lowerTrigram: "离火", keywords: ["家庭", "角色", "秩序"], guaci: "利女贞", meaning: "家庭和睦，各守其位。以正道治家，言行一致，方能家道兴旺。" },
  { number: 38, name: "Kui", nameZh: "睽", symbol: "䷥", upperTrigram: "离火", lowerTrigram: "兑泽", keywords: ["对立", "差异", "小事可为"], guaci: "小事吉", meaning: "相违相背，同中有异。求同存异，于对立中寻找共通，化解矛盾。" },
  { number: 39, name: "Jian", nameZh: "蹇", symbol: "䷦", upperTrigram: "坎水", lowerTrigram: "艮山", keywords: ["险阻", "求助", "反思"], guaci: "利西南，不利东北，利见大人，贞吉", meaning: "前路艰险，宜求贵人相助。反思自身，寻求合作，共度难关。" },
  { number: 40, name: "Jie", nameZh: "解", symbol: "䷧", upperTrigram: "震雷", lowerTrigram: "坎水", keywords: ["解脱", "缓解", "宽恕"], guaci: "利西南，无所往，其来复吉", meaning: "险难得解，如春雷化雨。宽恕他人，及时行动，把握解脱时机。" },
  { number: 41, name: "Sun", nameZh: "损", symbol: "䷨", upperTrigram: "艮山", lowerTrigram: "兑泽", keywords: ["减损", "节制", "诚信"], guaci: "有孚，元吉，无咎，可贞", meaning: "损下益上，有时减损亦是增益。以诚信节制欲望，损之又损以至于道。" },
  { number: 42, name: "Yi", nameZh: "益", symbol: "䷩", upperTrigram: "巽风", lowerTrigram: "震雷", keywords: ["增益", "施与", "变革"], guaci: "利有攸往，利涉大川", meaning: "损上益下，慷慨施与。见善则迁，有过则改，积极进取正当时。" },
  { number: 43, name: "Guai", nameZh: "夬", symbol: "䷪", upperTrigram: "兑泽", lowerTrigram: "乾天", keywords: ["决断", "公正", "除弊"], guaci: "扬于王庭，孚号，有厉", meaning: "果断决策，公开除弊。以正道对抗邪恶，刚强决断不留余地。" },
  { number: 44, name: "Gou", nameZh: "姤", symbol: "䷫", upperTrigram: "乾天", lowerTrigram: "巽风", keywords: ["邂逅", "警惕", "阴长"], guaci: "女壮，勿用取女", meaning: "不期而遇，阴柔渐长。把握偶然机遇，但需警惕小人之道渗入。" },
  { number: 45, name: "Cui", nameZh: "萃", symbol: "䷬", upperTrigram: "兑泽", lowerTrigram: "坤地", keywords: ["聚集", "团结", "诚敬"], guaci: "亨，王假有庙，利见大人，亨，利贞", meaning: "人心聚合，众志成城。以诚心聚人，有备无患，聚力方能成事。" },
  { number: 46, name: "Sheng", nameZh: "升", symbol: "䷭", upperTrigram: "坤地", lowerTrigram: "巽风", keywords: ["上升", "积累晋升", "谦进"], guaci: "元亨，用见大人，勿恤，南征吉", meaning: "循序渐进，稳步上升。谦虚努力，顺势而为，积小成大。" },
  { number: 47, name: "Kun", nameZh: "困", symbol: "䷮", upperTrigram: "兑泽", lowerTrigram: "坎水", keywords: ["困境", "坚守", "内省"], guaci: "亨，贞，大人吉，无咎，有言不信", meaning: "身陷困境，言语无力。守志不移，以行动证明，困中磨砺意志。" },
  { number: 48, name: "Jing", nameZh: "井", symbol: "䷯", upperTrigram: "坎水", lowerTrigram: "巽风", keywords: ["资源", "恒常", "养民"], guaci: "改邑不改井，无丧无得", meaning: "井水长存，滋养万民。恒常之道，无私奉献，资源共享方为大义。" },
  { number: 49, name: "Ge", nameZh: "革", symbol: "䷰", upperTrigram: "兑泽", lowerTrigram: "离火", keywords: ["变革", "革新", "顺时"], guaci: "己日乃孚，元亨，利贞，悔亡", meaning: "顺应时势，大力变革。革故鼎新，有大信则变革可成。" },
  { number: 50, name: "Ding", nameZh: "鼎", symbol: "䷱", upperTrigram: "离火", lowerTrigram: "巽风", keywords: ["鼎新", "文明", "稳固"], guaci: "元吉，亨", meaning: "鼎象征文明与法制。稳固秩序，革新文化，培育人才立于大本。" },
  { number: 51, name: "Zhen", nameZh: "震", symbol: "䷲", upperTrigram: "震雷", lowerTrigram: "震雷", keywords: ["震动", "警醒", "恐惧后安"], guaci: "亨，震来虩虩，笑言哑哑", meaning: "雷震惊惧，过后反得安宁。以敬畏之心修身，震动是成长的契机。" },
  { number: 52, name: "Gen", nameZh: "艮", symbol: "䷳", upperTrigram: "艮山", lowerTrigram: "艮山", keywords: ["静止", "止步", "内省"], guaci: "艮其背，不获其身，行其庭，不见其人，无咎", meaning: "知止则止，各止其所。不妄动，不执着，静默中寻找内在安稳。" },
  { number: 53, name: "Jian", nameZh: "渐", symbol: "䷴", upperTrigram: "巽风", lowerTrigram: "艮山", keywords: ["渐进", "婚恋", "循序"], guaci: "女归吉，利贞", meaning: "循序渐进，不可急躁。如大雁按序而飞，按部就班方能稳步前行。" },
  { number: 54, name: "Gui Mei", nameZh: "归妹", symbol: "䷵", upperTrigram: "震雷", lowerTrigram: "兑泽", keywords: ["归属", "情感", "谨慎"], guaci: "征凶，无攸利", meaning: "情感归属，须守本分。不可强求，情投意合方是正道，否则有悔。" },
  { number: 55, name: "Feng", nameZh: "丰", symbol: "䷶", upperTrigram: "震雷", lowerTrigram: "离火", keywords: ["丰盛", "鼎盛", "不忧"], guaci: "亨，王假之，勿忧，宜日中", meaning: "盛大丰收，光明如日中天。居盛须防衰，珍惜丰盛时光，不可自满。" },
  { number: 56, name: "Lü", nameZh: "旅", symbol: "䷷", upperTrigram: "离火", lowerTrigram: "艮山", keywords: ["旅行", "客居", "谨慎"], guaci: "小亨，旅贞吉", meaning: "客居他乡，须谨言慎行。以谦逊之心处世，随遇而安方能化险为夷。" },
  { number: 57, name: "Xun", nameZh: "巽", symbol: "䷸", upperTrigram: "巽风", lowerTrigram: "巽风", keywords: ["顺入", "谦和", "渗透"], guaci: "小亨，利有攸往，利见大人", meaning: "柔顺渗透，如风无处不在。以柔克刚，谦逊顺应，潜移默化成事。" },
  { number: 58, name: "Dui", nameZh: "兑", symbol: "䷹", upperTrigram: "兑泽", lowerTrigram: "兑泽", keywords: ["喜悦", "说服", "和悦"], guaci: "亨，利贞", meaning: "和悦相处，以诚取信。真诚喜悦感染人心，交流与合作自然顺畅。" },
  { number: 59, name: "Huan", nameZh: "涣", symbol: "䷺", upperTrigram: "巽风", lowerTrigram: "坎水", keywords: ["涣散", "消融", "凝聚"], guaci: "亨，王假有庙，利涉大川，利贞", meaning: "涣散需要凝聚。以精神信仰聚人心，化解隔阂，重建团结。" },
  { number: 60, name: "Jie", nameZh: "节", symbol: "䷻", upperTrigram: "坎水", lowerTrigram: "兑泽", keywords: ["节制", "限度", "规范"], guaci: "亨，苦节不可贞", meaning: "节制有度，过犹不及。订立合理规范，甘苦皆宜，不可矫枉过正。" },
  { number: 61, name: "Zhong Fu", nameZh: "中孚", symbol: "䷼", upperTrigram: "巽风", lowerTrigram: "兑泽", keywords: ["诚信", "内在真实", "感化"], guaci: "豚鱼吉，利涉大川，利贞", meaning: "内心真诚，感化万物。以诚信待人，真心自然感动对方，无往不利。" },
  { number: 62, name: "Xiao Guo", nameZh: "小过", symbol: "䷽", upperTrigram: "震雷", lowerTrigram: "艮山", keywords: ["小事过当", "谨小慎微", "守柔"], guaci: "亨，利贞，可小事，不可大事", meaning: "小有过失，宜谨慎纠正。此时不宜大动作，守柔处下，小心行事。" },
  { number: 63, name: "Ji Ji", nameZh: "既济", symbol: "䷾", upperTrigram: "坎水", lowerTrigram: "离火", keywords: ["成功", "完成", "防范"], guaci: "亨，小利贞，初吉终乱", meaning: "事成之后更需谨慎。成功非终点，居安思危，防止功成名就后的松懈。" },
  { number: 64, name: "Wei Ji", nameZh: "未济", symbol: "䷿", upperTrigram: "离火", lowerTrigram: "坎水", keywords: ["未完成", "过渡", "谨慎前行"], guaci: "亨，小狐汔济，濡其尾，无攸利", meaning: "事未完成，仍在过渡。谨慎而行，循序渐进，光明就在前方。" },
];

// Traditional 3-coin method
// Each line: throw 3 coins (heads=3, tails=2)
// Sum: 6=old yin (changing), 7=young yang, 8=young yin, 9=old yang (changing)
export type LineValue = 6 | 7 | 8 | 9;
export type HexagramLines = [LineValue, LineValue, LineValue, LineValue, LineValue, LineValue]; // bottom to top

export function throwCoins(): LineValue {
  const coins = [
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
  ];
  return coins.reduce((a, b) => a + b, 0) as LineValue;
}

export function getHexagramNumber(lines: HexagramLines): number {
  // Convert lines to binary (yang=1, yin=0), bottom to top
  const binary = lines.map((l) => (l === 7 || l === 9 ? 1 : 0));
  // King Wen sequence lookup (simplified: use trigram-based index)
  const upper = (binary[5] << 2) | (binary[4] << 1) | binary[3];
  const lower = (binary[2] << 2) | (binary[1] << 1) | binary[0];
  return TRIGRAM_TO_HEXAGRAM[upper][lower];
}

// King Wen sequence: [upper trigram][lower trigram] -> hexagram number
// Trigram order: 乾=0, 兑=1, 离=2, 震=3, 巽=4, 坎=5, 艮=6, 坤=7
const TRIGRAM_TO_HEXAGRAM: number[][] = [
  [1, 43, 14, 34, 9, 5, 26, 11],
  [10, 58, 38, 54, 61, 60, 41, 19],
  [13, 49, 30, 55, 37, 63, 22, 36],
  [25, 17, 21, 51, 42, 3, 27, 24],
  [44, 28, 50, 32, 57, 48, 18, 46],
  [6, 47, 64, 40, 59, 29, 4, 7],
  [33, 31, 56, 62, 53, 39, 52, 15],
  [12, 45, 35, 16, 20, 8, 23, 2],
];

export function getHexagram(number: number): Hexagram {
  return HEXAGRAMS.find((h) => h.number === number) ?? HEXAGRAMS[0];
}

export function isYang(line: LineValue): boolean {
  return line === 7 || line === 9;
}

export function isChanging(line: LineValue): boolean {
  return line === 6 || line === 9;
}
