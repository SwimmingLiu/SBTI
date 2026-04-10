import { sdtiDimensions, sdtiQuestions } from "@/features/sdti/data";
import { toAssetUrl } from "@/lib/asset-urls";

export type SdtiScores = Record<string, number>;

export type SdtiResultPreset = {
  credit?: string;
  desc: string;
  image?: string;
  name: string;
  note: string;
};

export type SdtiComputedResult = SdtiResultPreset & {
  hits: number;
  percentages: Array<{ label: string; score: number }>;
  scores: SdtiScores;
};

const feministImage = toAssetUrl("original/sdti/feminist.webp");

const resultPresets: Record<string, SdtiResultPreset> = {
  construction: {
    desc: "你的人生是一个永远在 beta 版本的软件，每天都在更新，每次更新都带新 bug。昨天立的 flag 今天已经不认了，今天的你讨厌上周的你，上周的你不理解上上周的你。但你并不慌——因为你发现身边那些从不更新的人，用的还是 Windows XP。",
    name: "施工中型",
    note: "代表瞬间：翻到三个月前写的朋友圈，第一反应是“谁啊这是，好矫情”，然后默默删掉。",
  },
  diy: {
    desc: "“算了我自己来”是你这辈子说得最多的一句话。你不是不会求助，你是算过了——解释的时间够你做完三遍。你的人生信条是“能自己搞定的事绝不麻烦别人，能麻烦别人的事也尽量自己搞定”。累吗？累。但是看着别人把事情搞砸你更累。",
    name: "我自己来型",
    note: "代表瞬间：同事说“这个我来吧”，你微笑着点头，回到工位后默默把他交的版本重做了一遍。",
  },
  feminist: {
    credit: "画师：小红书 @13读作一三",
    desc: "🎉 你解锁了隐藏结局。🎉 \n\n 这份问卷有 32 道题，其中几道藏着暗号。系统检测到你不仅看穿了规训，而且不打算继续配合。这种人在统计学上叫“异常值”（但样本量正在迅速扩大），在生活里叫“不好惹”，在历史书里叫“herstory——她们后来改变了一些事”。\n\n你不是在玩这个游戏，你是在重写规则手册的页边批注。你知道沉默的代价，也知道开口的代价，权衡之后选择了后者——不是因为后者更轻，而是因为前者更重。",
    image: feministImage,
    name: "Feminist · 女权主义者 🔓",
    note: "代表瞬间: 有人在饭桌上说了一句话，全场都笑了，只有你没笑。然后你慢慢放下筷子，开口说：“等一下，刚才那句话——”",
  },
  humanReader: {
    desc: "你看人只需要三秒：前两秒确认对方在说什么，第三秒已经算出这话 30 天后会怎么打脸。你的大脑里装着一个巨型剧本数据库，别人刚开个头你就知道结尾。朋友跟你吐槽新认识的人，你“嗯嗯”应着，心里已经写完了这段感情的讣告。",
    name: "阅人无数型",
    note: "代表瞬间：朋友兴奋地说“我觉得ta不一样”，你面无表情地掏出手机备忘录新建了一条，标题是“倒计时 第 1 天”。",
  },
  officeAwakening: {
    desc: "你的身体还在工位上打字，你的灵魂已经在三亚的沙滩上晒了两天了。你和同事说话的时候眼神很温柔，那是因为你在想晚饭吃什么。你点头如捣蒜，但你其实一个字都没听进去。你不是懒，你只是把所有的热情都存到了下班之后的那两小时。",
    name: "社畜觉醒型",
    note: "代表瞬间：老板在会议室慷慨激昂地讲战略，你脸上写着“深受启发”，心里在想“我今天要不要吃麻辣烫”。",
  },
  powerSave: {
    desc: "出门对你来说是一种消耗战。别人周末想的是“去哪玩”，你周末想的是“怎么让自己合法地不去任何地方”。你拒绝邀约的话术库已经积累到可以出书了，最常用的那句是“那天我有点事”（那天其实没有事，但你本人就是那个事）。",
    name: "省电模式型",
    note: "代表瞬间：群里问“周六谁有空”，你盯着手机看了三分钟，最后选择了“装死”。",
  },
  smilingBreakdown: {
    desc: "你的人生哲学是“能用段子解决的问题，就不要哭”。同样的糟心事，别人哭三天，你发八百字小作文配一张翻白眼的猫，底下还要回复粉丝：“哈哈谢谢，我没事，真的。”（你有事。）你是自己的编剧、导演、主演、和唯一没拿片酬的观众。",
    name: "笑着崩溃型",
    note: "代表瞬间：跟朋友讲完一个特别惨的故事，朋友沉默了，你紧接着说“没事啦我当笑话讲的”，然后立刻转移话题。",
  },
  sponge: {
    desc: "你是行走的情绪收纳盒。朋友失恋你失眠，同事加薪你开心，连楼下卖煎饼的大姨今天没笑你都要担心她是不是家里出了事。你记得身边所有人的怪癖、忌口、过敏源、生日、纪念日，但别人问你“你最近怎么样”，你要想三秒才能回答。",
    name: "情绪海绵型",
    note: "代表瞬间：你花了四十分钟安慰完朋友，挂掉电话，发现自己还没吃晚饭，而且也记不起来今天到底饿没饿过。",
  },
  youSayYours: {
    desc: "别人的意见对你来说像是背景音乐，开着也行关了也行。亲戚问你“怎么还不结婚”，你回“哦”；领导说“这个方案要再改改”，你回“好”；陌生人在网上骂你，你发现自己连生气的力气都懒得用。你不是没脾气，你只是把脾气留给了真正值得的事——目前还没有。",
    name: "你说你的型",
    note: "代表瞬间：家庭群里一场腥风血雨，你潜水三天，出来的时候发了个“吃了吗”，瞬间把话题带走。",
  },
};

function buildEmptyScores() {
  return Object.fromEntries(
    Object.keys(sdtiDimensions).map((dimension) => [dimension, 0]),
  ) as SdtiScores;
}

function isHigh(dimension: string, scores: SdtiScores) {
  return scores[dimension] / sdtiDimensions[dimension].max >= 0.7;
}

function isLow(dimension: string, scores: SdtiScores) {
  return scores[dimension] / sdtiDimensions[dimension].max <= 0.35;
}

function countTriggerHits(answers: Record<string, string>) {
  const triggers = [
    answers["6"] === "D",
    answers["13"] === "D",
    answers["29"] === "D",
    answers["32"] === "C",
  ];

  return triggers.filter(Boolean).length;
}

export function computeSdtiScores(answers: Record<string, string>) {
  const scores = buildEmptyScores();

  for (const question of sdtiQuestions) {
    if (!question.dim) {
      continue;
    }

    const picked = answers[String(question.n)];
    const option = question.opts.find((item) => item.k === picked);

    if (!option || typeof option.s !== "number") {
      continue;
    }

    scores[question.dim] += option.s;
  }

  return scores;
}

export function computeSdtiResult(answers: Record<string, string>): SdtiComputedResult {
  const scores = computeSdtiScores(answers);
  const hits = countTriggerHits(answers);
  let preset: SdtiResultPreset;

  if (hits >= 2) {
    preset = resultPresets.feminist;
  } else if (isHigh("dark", scores) && isHigh("guard", scores)) {
    preset = resultPresets.humanReader;
  } else if (isHigh("drive", scores) && isHigh("plan", scores)) {
    preset = resultPresets.diy;
  } else if (isLow("intimacy", scores) && isHigh("guard", scores)) {
    preset = resultPresets.powerSave;
  } else if (isHigh("intimacy", scores) && isLow("stable", scores)) {
    preset = resultPresets.sponge;
  } else if (isHigh("dark", scores) && isLow("stable", scores)) {
    preset = resultPresets.smilingBreakdown;
  } else if (isHigh("dark", scores)) {
    preset = resultPresets.officeAwakening;
  } else if (isHigh("stable", scores)) {
    preset = resultPresets.youSayYours;
  } else {
    preset = resultPresets.construction;
  }

  return {
    ...preset,
    hits,
    percentages: Object.entries(sdtiDimensions).map(([dimension, meta]) => ({
      label: meta.label,
      score: Math.round((scores[dimension] / meta.max) * 100),
    })),
    scores,
  };
}
