import { useEffect, useMemo, useRef, useState } from 'react';
import questions from './data/questions.json';
import stressQuestions from './data/stressQuestions.json';
import tiebreakData from './data/tiebreak.json';
import {
  applyTiebreakChoices,
  CENTERS,
  computeFullScore,
  type Answers,
  type CenterKey,
  type ScoreResult,
} from './lib/scoring';
import { Collapsible } from './components/Collapsible';
import { typeLabel } from './lib/enneagramTypes';
import { saveResultForReport } from './lib/buildReportFacts';
import { formatReportDate } from './lib/formatDate';
import { isSheetApiConfigured, saveResultToSheet } from './lib/sheetApi';
import { generateAndUploadReportPdf } from './lib/autoArchiveReport';

type Step = 'home' | 'quiz' | 'submitting' | 'scores' | 'tiebreak' | 'done';

type QuizItem = { id: number; text: string; scale: 'enneagram' | 'extra' };

const ENNEAGRAM_SCALE = [
  { v: 1, label: '1 - 完全不符合' },
  { v: 2, label: '2 - 不符合' },
  { v: 3, label: '3 - 有些符合' },
  { v: 4, label: '4 - 符合' },
  { v: 5, label: '5 - 非常符合' },
];

const EXTRA_SCALE = [
  { v: 1, label: '完全不是' },
  { v: 2, label: '基本不符合' },
  { v: 3, label: '一般' },
  { v: 4, label: '普遍如此' },
  { v: 5, label: '非常符合' },
];

const ALL_QUESTIONS: QuizItem[] = [
  ...questions.map((q) => ({ id: q.id, text: q.text, scale: 'enneagram' as const })),
  ...stressQuestions.map((q) => ({ id: q.id, text: q.text, scale: 'extra' as const })),
];

const questionTypes = new Map(questions.map((q) => [q.id, q.type]));

type TiebreakContent = Record<string, { label: string; text: string }>;

function enneagramAnswers(all: Answers): Answers {
  const out: Answers = {};
  for (const q of questions) {
    if (all[q.id] != null) out[q.id] = all[q.id];
  }
  return out;
}

export default function App() {
  const [step, setStep] = useState<Step>('home');
  const [name, setName] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [tieChoices, setTieChoices] = useState<Partial<Record<CenterKey, number>>>({});
  const [finalResult, setFinalResult] = useState<ScoreResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const savedOnce = useRef(false);

  const tiebreakKeys = useMemo(
    () => Object.keys(result?.tiebreakNeeded ?? {}) as CenterKey[],
    [result]
  );

  const currentQ = ALL_QUESTIONS[index];
  const progress = ((index + 1) / ALL_QUESTIONS.length) * 100;
  const currentScale = currentQ?.scale === 'extra' ? EXTRA_SCALE : ENNEAGRAM_SCALE;

  function startQuiz() {
    if (!name.trim()) return;
    setAnswers({});
    setIndex(0);
    setResult(null);
    setFinalResult(null);
    setTieChoices({});
    setSaveStatus('idle');
    setSaveMessage('');
    savedOnce.current = false;
    setStep('quiz');
  }

  useEffect(() => {
    if (step !== 'submitting' || !result || savedOnce.current) return;
    savedOnce.current = true;

    if (!isSheetApiConfigured()) {
      setSaveStatus('err');
      setSaveMessage('未配置 Google 表格接口，请在 web/.env 中设置 VITE_SHEET_WEBAPP_URL 与 VITE_SHEET_API_SECRET');
      return;
    }

    const testedAt = formatReportDate(new Date().toISOString());

    saveResultForReport({
      name,
      testedAt,
      result,
    });

    setSaveStatus('saving');
    saveResultToSheet({ name, result, answers })
      .then(async (res) => {
        if (!res.ok || !res.row) {
          setSaveStatus('err');
          setSaveMessage(res.error || '保存失败');
          savedOnce.current = false;
          return;
        }

        saveResultForReport({
          name,
          testedAt,
          result,
          sheetRow: res.row,
        });

        await generateAndUploadReportPdf(res.row);
        setSaveStatus('ok');
        setStep('scores');
      })
      .catch((e: Error) => {
        setSaveStatus('err');
        setSaveMessage(e.message || '网络错误');
        savedOnce.current = false;
      });
  }, [step, result, name, answers]);

  function retrySubmit() {
    savedOnce.current = false;
    setSaveStatus('idle');
    setSaveMessage('');
    setStep('submitting');
  }

  function finishQuiz(nextAnswers: Answers) {
    const scored = computeFullScore(enneagramAnswers(nextAnswers), questionTypes);
    setResult(scored);
    setFinalResult(scored);
    setStep('submitting');
  }

  function selectAnswer(value: number) {
    if (!currentQ) return;
    const next = { ...answers, [currentQ.id]: value };
    setAnswers(next);
    if (index < ALL_QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      finishQuiz(next);
    }
  }

  function goNextQuestion() {
    if (!currentQ || answers[currentQ.id] == null) return;
    if (index < ALL_QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      finishQuiz(answers);
    }
  }

  function goTiebreakOrDone() {
    if (!result) return;
    if (tiebreakKeys.length > 0) {
      setStep('tiebreak');
      return;
    }
    setFinalResult(result);
    setStep('done');
  }

  function submitTiebreak() {
    if (!result) return;
    for (const key of tiebreakKeys) {
      if (tieChoices[key] == null) return;
    }
    const final = applyTiebreakChoices(result, tieChoices);
    setFinalResult(final);
    saveResultForReport({
      name,
      testedAt: formatReportDate(new Date().toISOString()),
      result: final,
    });
    setStep('done');
  }

  return (
    <div className="app">
      {step === 'home' && (
        <div className="card">
          <h1>Profigram 九型人格测试</h1>
          <p className="sub">
            共 {ALL_QUESTIONS.length} 题，请根据真实感受作答。全部完成后将提交答卷，随后可查看各型分数；若某中心需进一步确认，将追加少量选择题。
          </p>
          <label>
            <span className="sub">姓名</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
            />
          </label>
          <p style={{ marginTop: 24 }}>
            <button className="btn" disabled={!name.trim()} onClick={startQuiz}>
              开始测试
            </button>
          </p>
        </div>
      )}

      {step === 'quiz' && currentQ && (
        <div className="card">
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="sub">
            第 {index + 1} / {ALL_QUESTIONS.length} 题 · {name}
          </p>
          <h1 style={{ fontSize: '1.15rem' }}>{currentQ.text}</h1>
          <div className="scale">
            {currentScale.map((s) => (
              <label key={s.v}>
                <input
                  type="radio"
                  name={`q-${currentQ.id}`}
                  checked={answers[currentQ.id] === s.v}
                  onChange={() => selectAnswer(s.v)}
                />
                {s.label}
              </label>
            ))}
          </div>
          <div className="nav-row">
            <button
              className="btn btn-secondary"
              type="button"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              上一题
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={answers[currentQ.id] == null}
              onClick={goNextQuestion}
            >
              下一题
            </button>
          </div>
        </div>
      )}

      {step === 'submitting' && (
        <div className="card">
          <h1>{saveStatus === 'err' ? '提交未成功' : '正在提交'}</h1>
          {saveStatus === 'saving' || saveStatus === 'idle' ? (
            <p className="sub">正在提交，请稍候…</p>
          ) : (
            <>
              <p className="sub" style={{ color: '#c62828' }}>
                {saveMessage || '提交失败，请稍后重试'}
              </p>
              <p style={{ marginTop: 24 }}>
                <button className="btn" onClick={retrySubmit}>
                  重新提交
                </button>
              </p>
            </>
          )}
        </div>
      )}

      {step === 'scores' && result && (
        <div className="card">
          <h1>问卷已完成</h1>
          <p className="sub">{name}，答卷已成功提交。详细分数默认收起，需要时可展开查看。</p>

          <Collapsible title="查看各型分数与中心初算" hint="可选">
            <div className="score-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
                <div key={t} className="score-item">
                  <span>{t} 号</span>
                  <strong>{result.scores[t]}</strong>
                </div>
              ))}
            </div>
            <h2 style={{ fontSize: '1.05rem', marginTop: 16 }}>三大中心（初算）</h2>
            {(Object.keys(CENTERS) as CenterKey[]).map((key) => {
              const c = CENTERS[key];
              const w = result.centers[key];
              const pending = result.tiebreakNeeded[key];
              return (
                <p key={key} style={{ margin: '8px 0' }}>
                  {c.name}：{pending ? (
                    <>
                      待确认（{pending.join(' vs ')} 同分）
                      <span className="badge">需追加提问</span>
                    </>
                  ) : (
                    <>
                      {typeLabel(w.type)} · {w.score} 分
                      {w.resolvedBy === 'middle' && (
                        <span className="badge">三型同分取中间号</span>
                      )}
                    </>
                  )}
                </p>
              );
            })}
          </Collapsible>

          <p style={{ marginTop: 24 }}>
            <button className="btn" onClick={goTiebreakOrDone}>
              {tiebreakKeys.length > 0 ? '继续：完成中心确认' : '完成'}
            </button>
          </p>
        </div>
      )}

      {step === 'tiebreak' && result && (
        <div className="card">
          <h1>中心确认</h1>
          <p className="sub">以下中心有两型分数相同且并列最高，请选择更符合您的一段描述。</p>
          {tiebreakKeys.map((key) => {
            const c = CENTERS[key];
            const candidates = result.tiebreakNeeded[key]!;
            const content = tiebreakData as TiebreakContent;
            return (
              <section key={key} style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.05rem' }}>{c.name}</h2>
                {candidates.map((typeNum) => (
                  <div
                    key={typeNum}
                    className={`tie-option ${tieChoices[key] === typeNum ? 'selected' : ''}`}
                    onClick={() => setTieChoices((prev) => ({ ...prev, [key]: typeNum }))}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={0}
                  >
                    <h3>{content[String(typeNum)].label}</h3>
                    <p>{content[String(typeNum)].text}</p>
                  </div>
                ))}
              </section>
            );
          })}
          <button
            className="btn"
            disabled={tiebreakKeys.some((k) => tieChoices[k] == null)}
            onClick={submitTiebreak}
          >
            提交确认
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="card">
          <h1>测试完成</h1>
          <p className="sub">{name}，感谢您的作答。</p>

          <button
            className="btn"
            style={{ marginTop: 24 }}
            onClick={() => {
              setStep('home');
              setName('');
            }}
          >
            返回首页
          </button>
        </div>
      )}
    </div>
  );
}
