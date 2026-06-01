import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, getTopMatches } from '../../data/neighborhoods';
import type { QuizOption } from '../../data/neighborhoods';
import styles from './Neighborhood.module.css';

const LAYER1_LABELS: Record<string, string> = {
  safeRoute: '안심 귀가길',
  hospital: '병원 안심',
  transit: '대중교통',
};
const LAYER2_LABELS: Record<string, string> = {
  dogWalk: '강아지 산책',
  cafe: '스테디 카페',
  indie: '인디 바이브',
  quiet: '머물 포인트',
  nature: '계절 감성',
  community: '인간적 온기',
};

export function NeighborhoodPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'quiz' | 'result'>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [selected, setSelected] = useState<QuizOption | null>(null);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const isLast = currentQ === QUESTIONS.length - 1;

  function handleSelect(option: QuizOption) {
    setSelected(option);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      setStep('result');
    } else {
      setCurrentQ(q => q + 1);
    }
  }

  function handleRestart() {
    setStep('quiz');
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  }

  if (step === 'result') {
    const results = getTopMatches(answers);
    const top = results[0];

    return (
      <div className={styles.page}>
        <div className={styles.resultWrap}>
          <div className={styles.resultHeader}>
            <p className={styles.resultEyebrow}>동네 매칭 완료!</p>
            <h1 className={styles.resultTitle}>
              회원님께 <span className={styles.highlight}>{top.match}%</span> 맞는 동네
            </h1>
            <p className={styles.resultSub}>6가지 질문을 바탕으로 분석했어요</p>
          </div>

          <div className={styles.resultCards}>
            {results.map(({ neighborhood: n, match }, i) => (
              <div key={n.id} className={`${styles.resultCard} ${i === 0 ? styles.resultCardTop : ''}`}>
                {i === 0 && <div className={styles.topBadge}>🏆 최고 매칭</div>}
                <div className={styles.cardHead}>
                  <div>
                    <p className={styles.cardRegion}>{n.region}</p>
                    <h2 className={styles.cardName}>{n.name}</h2>
                    <p className={styles.cardDesc}>{n.description}</p>
                  </div>
                  <div className={styles.matchBadge}>
                    <span className={styles.matchNum}>{match}</span>
                    <span className={styles.matchPct}>%</span>
                  </div>
                </div>

                <div className={styles.matchBar}>
                  <div className={styles.matchBarFill} style={{ width: `${match}%` }} />
                </div>

                <div className={styles.tagRow}>
                  {n.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>

                <div className={styles.scoreGrid}>
                  <div className={styles.scoreSection}>
                    <p className={styles.scoreSectionLabel}>🛡 포기불가 지수</p>
                    {Object.entries(LAYER1_LABELS).map(([key, label]) => (
                      <div key={key} className={styles.scoreRow}>
                        <span className={styles.scoreLabel}>{label}</span>
                        <div className={styles.scoreMini}>
                          <div
                            className={styles.scoreMiniBar}
                            style={{ width: `${n.scores[key as keyof typeof n.scores]}%` }}
                          />
                        </div>
                        <span className={styles.scoreNum}>{n.scores[key as keyof typeof n.scores]}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.scoreSection}>
                    <p className={styles.scoreSectionLabel}>✨ 골목 바이브 지수</p>
                    {Object.entries(LAYER2_LABELS).map(([key, label]) => (
                      <div key={key} className={styles.scoreRow}>
                        <span className={styles.scoreLabel}>{label}</span>
                        <div className={styles.scoreMini}>
                          <div
                            className={styles.scoreMiniBar}
                            style={{ width: `${n.scores[key as keyof typeof n.scores]}%` }}
                          />
                        </div>
                        <span className={styles.scoreNum}>{n.scores[key as keyof typeof n.scores]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <span className={styles.priceRange}>{n.priceRange}</span>
                  <button
                    className={styles.viewBtn}
                    onClick={() => navigate(`/stays?region=${encodeURIComponent(n.region)}`)}
                  >
                    이 동네 숙소 보기 →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.restartBtn} onClick={handleRestart}>
            다시 해보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.quizWrap}>

        {/* 프로그레스 */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressText}>{currentQ + 1} / {QUESTIONS.length}</p>

        {/* 레이어 뱃지 */}
        <div className={`${styles.layerBadge} ${question.layer === 1 ? styles.layer1 : styles.layer2}`}>
          {question.layer === 1 ? '🛡' : '✨'} {question.layerLabel}
        </div>

        {/* 질문 */}
        <div className={styles.questionCard}>
          <div className={styles.questionEmoji}>{question.emoji}</div>
          <h2 className={styles.questionText}>{question.text}</h2>
          {question.subText && <p className={styles.questionSub}>{question.subText}</p>}
        </div>

        {/* 선택지 */}
        <div className={styles.options}>
          {question.options.map(opt => (
            <button
              key={opt.label}
              className={`${styles.option} ${selected?.label === opt.label ? styles.optionSelected : ''}`}
              onClick={() => handleSelect(opt)}
            >
              <span className={styles.optionEmoji}>{opt.emoji}</span>
              <span className={styles.optionLabel}>{opt.label}</span>
              {selected?.label === opt.label && (
                <span className={styles.optionCheck}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          className={`${styles.nextBtn} ${selected ? styles.nextBtnActive : ''}`}
          onClick={handleNext}
          disabled={!selected}
        >
          {isLast ? '결과 보기' : '다음'}
        </button>

        <button className={styles.skipBack} onClick={() => currentQ > 0 && setCurrentQ(q => q - 1)}>
          {currentQ > 0 ? '← 이전' : ''}
        </button>
      </div>
    </div>
  );
}
