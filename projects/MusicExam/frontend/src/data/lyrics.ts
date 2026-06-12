export interface LyricLine {
  time: number
  text: string
  accent?: number[]
  breath?: boolean
}

export const LYRIC_DATA: Record<number, LyricLine[]> = {
  // 茉莉花 - 经典入门曲
  6: [
    { time: 0, text: '好一朵美丽的茉莉花', accent: [6] },
    { time: 6, text: '好一朵美丽的茉莉花', accent: [6] },
    { time: 12, text: '芬芳美丽满枝桠', accent: [3], breath: true },
    { time: 18, text: '又香又白人人夸' },
    { time: 24, text: '让我来将你摘下' },
    { time: 30, text: '送给别人家' },
    { time: 36, text: '茉莉花呀茉莉花', breath: true },
  ],
  // 送别
  1: [
    { time: 0, text: '长亭外 古道边' },
    { time: 6, text: '芳草碧连天', accent: [2] },
    { time: 12, text: '晚风拂柳笛声残', breath: true },
    { time: 18, text: '夕阳山外山' },
    { time: 24, text: '天之涯 地之角' },
    { time: 30, text: '知交半零落' },
    { time: 36, text: '一瓢浊酒尽余欢', breath: true },
    { time: 42, text: '今宵别梦寒' },
  ],
  // 雪绒花
  2: [
    { time: 0, text: '雪绒花 雪绒花' },
    { time: 5, text: '清晨迎着我开放', accent: [4] },
    { time: 10, text: '小而白 洁而亮', breath: true },
    { time: 15, text: '向我快乐的摇晃' },
    { time: 20, text: '白雪般的花儿' },
    { time: 25, text: '愿你芬芳', accent: [3] },
    { time: 30, text: '永远开花生长', breath: true },
    { time: 35, text: '雪绒花 雪绒花' },
    { time: 40, text: '永远祝福我家乡' },
  ],
  // 让我们荡起双桨
  3: [
    { time: 0, text: '让我们荡起双桨' },
    { time: 6, text: '小船儿推开波浪', accent: [4] },
    { time: 12, text: '海面倒映着美丽的白塔', breath: true },
    { time: 18, text: '四周环绕着绿树红墙' },
    { time: 24, text: '小船儿轻轻 飘荡在水中' },
    { time: 30, text: '迎面吹来了凉爽的风' },
  ],
  // 小红帽
  4: [
    { time: 0, text: '我独自走在郊外的小路上' },
    { time: 5, text: '我把糕点带给外婆尝一尝', accent: [6] },
    { time: 10, text: '她家住在又远又僻静的地方', breath: true },
    { time: 15, text: '我要当心附近是否有大灰狼' },
    { time: 20, text: '当太阳下山岗 我要赶回家' },
    { time: 25, text: '同妈妈一起进入甜蜜梦乡' },
  ],
  // 采蘑菇的小姑娘
  5: [
    { time: 0, text: '采蘑菇的小姑娘' },
    { time: 4, text: '背着一个大竹筐', accent: [4] },
    { time: 8, text: '清早光着小脚丫', breath: true },
    { time: 12, text: '走遍森林和山冈' },
    { time: 16, text: '她采的蘑菇最多' },
    { time: 20, text: '多得像那星星数不清', accent: [7] },
  ],
  // 友谊地久天长
  7: [
    { time: 0, text: '怎能忘记旧日朋友' },
    { time: 6, text: '心中能不欢笑', accent: [4] },
    { time: 12, text: '旧日朋友岂能相忘', breath: true },
    { time: 18, text: '友谊地久天长' },
    { time: 24, text: '友谊万岁 朋友 友谊万岁' },
    { time: 30, text: '举杯痛饮 同声歌颂', accent: [3] },
    { time: 36, text: '友谊地久天长', breath: true },
  ],
  // 外婆的澎湖湾
  8: [
    { time: 0, text: '晚风轻拂澎湖湾' },
    { time: 6, text: '白浪逐沙滩', accent: [3] },
    { time: 12, text: '没有椰林缀斜阳', breath: true },
    { time: 18, text: '只是一片海蓝蓝' },
    { time: 24, text: '坐在门前的矮墙上' },
    { time: 30, text: '一遍遍幻想', accent: [2] },
    { time: 36, text: '也是黄昏的沙滩上', breath: true },
    { time: 42, text: '有着脚印两对半' },
  ],
  // 大海啊故乡
  9: [
    { time: 0, text: '小时候妈妈对我讲' },
    { time: 6, text: '大海就是我故乡', accent: [4] },
    { time: 12, text: '海边出生 海里成长', breath: true },
    { time: 18, text: '大海啊大海' },
    { time: 24, text: '是我生活的地方' },
    { time: 30, text: '海风吹 海浪涌', accent: [2] },
    { time: 36, text: '随我飘流四方', breath: true },
  ],
  // 我的中国心
  10: [
    { time: 0, text: '河山只在我梦萦' },
    { time: 6, text: '祖国已多年未亲近', accent: [5] },
    { time: 12, text: '可是不管怎样也改变不了', breath: true },
    { time: 18, text: '我的中国心' },
    { time: 24, text: '洋装虽然穿在身' },
    { time: 30, text: '我心依然是中国心', accent: [5] },
    { time: 36, text: '我的祖先早已把我的一切', breath: true },
    { time: 42, text: '烙上中国印' },
  ],
  // 长江之歌
  11: [
    { time: 0, text: '你从雪山走来' },
    { time: 6, text: '春潮是你的丰采', accent: [4] },
    { time: 12, text: '你向东海奔去', breath: true },
    { time: 18, text: '惊涛是你的气概' },
    { time: 24, text: '你用甘甜的乳汁' },
    { time: 30, text: '哺育各族儿女', accent: [3] },
    { time: 36, text: '你用健美的臂膀', breath: true },
    { time: 42, text: '挽起高山大海' },
  ],
  // 歌唱祖国
  12: [
    { time: 0, text: '五星红旗迎风飘扬' },
    { time: 6, text: '胜利歌声多么响亮', accent: [5] },
    { time: 12, text: '歌唱我们亲爱的祖国', breath: true },
    { time: 18, text: '从今走向繁荣富强' },
    { time: 24, text: '越过高山 越过平原' },
    { time: 30, text: '跨过奔腾的黄河长江', accent: [6] },
    { time: 36, text: '宽广美丽的土地', breath: true },
    { time: 42, text: '是我们亲爱的家乡' },
  ],
  // 同一首歌
  13: [
    { time: 0, text: '鲜花曾告诉我你怎样走过' },
    { time: 6, text: '大地知道你心中的每一个角落', accent: [8] },
    { time: 12, text: '甜蜜的梦啊谁都不会错过', breath: true },
    { time: 18, text: '终于迎来今天这欢聚时刻' },
    { time: 24, text: '水千条山万座我们曾走过' },
    { time: 30, text: '每一次相逢和笑脸都彼此铭刻', accent: [9] },
    { time: 36, text: '在阳光灿烂欢乐的日子里', breath: true },
    { time: 42, text: '我们手拉手啊想说的太多' },
  ],
  // 我和我的祖国
  14: [
    { time: 0, text: '我和我的祖国' },
    { time: 5, text: '一刻也不能分割', accent: [5] },
    { time: 10, text: '无论我走到哪里', breath: true },
    { time: 15, text: '都流出一首赞歌' },
    { time: 20, text: '我歌唱每一座高山' },
    { time: 25, text: '我歌唱每一条河', accent: [4] },
    { time: 30, text: '袅袅炊烟 小小村落', breath: true },
    { time: 35, text: '路上一道辙' },
  ],
}
