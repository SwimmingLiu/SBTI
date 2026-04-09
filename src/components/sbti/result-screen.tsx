import Image from "next/image";

import { DimensionList } from "@/components/sbti/dimension-list";
import { typeImages } from "@/lib/sbti-data";
import type { SbtiResult } from "@/lib/sbti-engine";

type ResultScreenProps = {
  onRestart: () => void;
  onToTop: () => void;
  result: SbtiResult;
};

function getFunNote(result: SbtiResult) {
  return result.special
    ? "本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。"
    : "本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。";
}

export function ResultScreen({
  onRestart,
  onToTop,
  result,
}: ResultScreenProps) {
  const imageSrc = typeImages[result.finalType.code];

  return (
    <section className="w-full">
      <div className="px-4 pb-14 pt-6">
        <div className="mx-auto max-w-[980px] rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.08)] md:p-7">
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fbfefb,#f3f8f4)] p-4">
              {imageSrc ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px]">
                  <Image
                    alt={`${result.finalType.code}（${result.finalType.cn}）`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src={imageSrc}
                  />
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-[18px] bg-[var(--soft)] text-[var(--muted)]">
                  图片缺失
                </div>
              )}
              <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-[var(--muted)]">
                {result.finalType.intro}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
                <div className="text-sm text-[var(--muted)]">{result.modeKicker}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-4xl">
                  {result.finalType.code}（{result.finalType.cn}）
                </div>
                <div className="mt-3 inline-flex rounded-full bg-[var(--soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-strong)]">
                  {result.badge}
                </div>
                <div className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {result.sub}
                </div>
              </div>

              <div className="rounded-[24px] border border-[var(--line)] bg-white p-5">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  该人格的简单解读
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                  {result.finalType.desc}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              十五维度评分
            </h2>
            <div className="mt-4">
              <DimensionList result={result} />
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              友情提示
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {getFunNote(result)}
            </p>
          </div>

          <details className="mt-4 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
            <summary className="cursor-pointer text-lg font-semibold text-[var(--foreground)]">
              作者的话
            </summary>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。
              </p>
              <p>
                由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。
              </p>
              <p>
                关于这个测试，我没法很好的平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准（如屌丝可能并非真的屌丝），如有冒犯非常抱歉！！
              </p>
              <p>
                再鉴于时间精力有限，就随便搞了一个先这样玩玩，后续会慢慢完善修改的，总之好玩为主，还请不要用于盈利呀。
              </p>
            </div>
          </details>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
              onClick={onRestart}
              type="button"
            >
              重新测试
            </button>
            <button
              className="rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
              onClick={onToTop}
              type="button"
            >
              回到首页
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
