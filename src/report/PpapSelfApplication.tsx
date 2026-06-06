import type { ReactNode } from 'react';

/** PPAP 第 4 页固定区块：自我应用（留空作答） */
export function PpapSelfApplication() {
  return (
    <section className="ppap-self-app" aria-label="自我应用">
      <div className="ppap-self-app__title">自我应用</div>

      <div className="ppap-self-app__body">
        <SelfAppQuestionGroup
          main={
            <>
              1）对我来说，恐惧的情况是？
            </>
          }
        />
        <SelfAppQuestionGroup
          main={
            <>
              2）我想要的自我形象是？
              <br />
              （具体地）
            </>
          }
        />
      </div>
    </section>
  );
}

function SelfAppQuestionGroup({ main }: { main: ReactNode }) {
  return (
    <div className="ppap-self-app__group">
      <p className="ppap-self-app__q ppap-self-app__q--main">{main}</p>
      <AnswerLine />
      <p className="ppap-self-app__q ppap-self-app__q--sub">这样认为的原因是？</p>
      <AnswerLine />
    </div>
  );
}

function AnswerLine() {
  return (
    <div className="ppap-self-app__answer">
      <span className="ppap-self-app__a-label">A：</span>
      <span className="ppap-self-app__a-line" aria-hidden />
    </div>
  );
}
