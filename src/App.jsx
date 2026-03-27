import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Loader2, Clock, CheckCircle, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import exampleVideo from './assets/example.mp4?url';
import instructionIcon from './assets/instruction.svg?url';
import againIcon from './assets/again.svg?url';
import warningIcon from './assets/warning.svg?url';
import caretIcon from './assets/caret.svg?url';

const API_KEY = 'API_KEY';

// --- DATA ---
const LUSCHER_COLORS = [
    { id: 0, name: 'Сірий', hex: '#AEAEAE' },
    { id: 1, name: 'Синій', hex: '#004F7C' },
    { id: 2, name: 'Зелений', hex: '#346C4F' },
    { id: 3, name: 'Червоний', hex: '#D82C20' },
    { id: 4, name: 'Жовтий', hex: '#EEDC00' },
    { id: 5, name: 'Фіолетовий', hex: '#7C3473' },
    { id: 6, name: 'Коричневий', hex: '#6F4229' },
    { id: 7, name: 'Чорний', hex: '#000000' },
];

const INTERPRETATIONS = {
    0: {
        goals: "Прагнення до спокою та ізоляції. Бажання відгородитися від зовнішніх впливів, щоб відновити сили. Пасивність як захисний механізм.",
        actual: "Поведінка характеризується обережністю та дистанціюванням. Ви намагаєтеся не брати на себе зайвих зобов'язань. Нейтральна позиція.",
        indifferent: "Ставлення до оточення формальне. Ви не дозволяєте втягувати себе в емоційні конфлікти, зберігаючи нейтралітет.",
        rejected: "Виснаження нервової системи або страх перед ізоляцією. Можливе відчуття, що вас не розуміють, але ви заперечуєте свою потребу у спокої."
    },
    1: {
        goals: "Прагнення до гармонії, спокою та глибокої емоційної прив'язаності. Потреба у задоволенні та розумінні. Пошук безпечного середовища.",
        actual: "Ви дієте спокійно та врівноважено. Важливою є емоційна стабільність та лояльність. Чутливість до дрібниць, емпатія.",
        indifferent: "Потреба у спокої тимчасово відкладена. Емоційна глибина зараз не є пріоритетом, можлива певна холодність у стосунках.",
        rejected: "Незадоволеність емоційними зв'язками. Відчуття самотності або розриву стосунків. Стрес через неможливість знайти спокій."
    },
    2: {
        goals: "Прагнення до самоствердження, визнання та влади. Бажання контролювати ситуацію та підвищити власну самооцінку. Наполегливість.",
        actual: "Впевненість у собі, завзятість, принциповість. Ви відстоюєте свої права та думки. Критичне ставлення до чужих ідей.",
        indifferent: "Потреба у визнанні зараз не актуальна. Ви не намагаєтеся нікому нічого доводити. Тимчасова відмова від амбіцій.",
        rejected: "Образа на невизнання. Відчуття тиску з боку оточення. Стрес через неможливість реалізувати свої амбіції або втрату позицій."
    },
    3: {
        goals: "Жага активності, успіху та вражень. Бажання жити «на повну», досягати результатів та отримувати емоційний відгук. Енергійність.",
        actual: "Активна життєва позиція, імпульсивність, ентузіазм. Ви дієте рішуче, прагнете змін та нових подій.",
        indifferent: "Активність знижена. Ви чекаєте слушного моменту, щоб почати діяти, або вважаєте, що зараз не час для ініціативи.",
        rejected: "Фізіологічне та емоційне виснаження. Роздратування через перевтому. Відчуття, що ваші зусилля марні. Потреба у відпочинку."
    },
    4: {
        goals: "Надія на світле майбутнє, пошук нових можливостей та свободи. Прагнення до змін, розширення горизонтів та спілкування.",
        actual: "Оптимізм, комунікабельність, легкість на підйом. Ви шукаєте вихід із ситуації, що склалася, через нові контакти та ідеї.",
        indifferent: "Стабільність для вас зараз важливіша за зміни. Ви не схильні до ризику або нових починань у даний момент.",
        rejected: "Розчарування, відчуття ізоляції або втрати ілюзій. Песимізм. Можливий конфлікт між очікуваннями та реальністю."
    },
    5: {
        goals: "Пошук магічного, інтуїтивного розуміння світу. Бажання зачаровувати та бути зачарованим. Чутливість, фантазія, емоційна зрілість.",
        actual: "Мрійливість, сентиментальність, інтуїтивне сприйняття реальності. Схильність до нестандартних рішень.",
        indifferent: "Прагматичний підхід. Фантазії та інтуїція відсунуті на другий план заради реальних справ.",
        rejected: "Контроль над почуттями. Відмова від мрій заради 'суворої реальності'. Можливе пригнічення творчого потенціалу."
    },
    6: {
        goals: "Потреба у фізичному комфорті, затишку та безпеці. Бажання позбутися проблем, що турбують тіло або викликають тривогу.",
        actual: "Орієнтація на тілесні відчуття, сім'ю, побут. Пошук коренів та стабільності. Важливість фізичного здоров'я.",
        indifferent: "Питання комфорту вирішені або ігноруються. Ви не зациклюєтесь на побутових незручностях.",
        rejected: "Ігнорування фізичних потреб. Придушення бажання комфорту. Можливі проблеми зі здоров'ям, які ви намагаєтеся не помічати."
    },
    7: {
        goals: "Протест проти існуючої ситуації. Бажання радикальних змін, навіть деструктивних. Відмова від компромісів.",
        actual: "Агресивність, нігілізм, деструктивна поведінка. Ви дієте всупереч обставинам, часто провокуючи конфлікти.",
        indifferent: "Здатність контролювати свої радикальні пориви. Ви не дозволяєте чорним думкам керувати вашою поведінкою.",
        rejected: "Бажання контролювати ситуацію без крайнощів. Страх перед порожнечею. Ви намагаєтеся уникати деструктивних думок."
    }
};

// --- COMPONENTS ---
const ColorCard = ({ color, onClick, isExiting }) => (
    <button
        onClick={() => !isExiting && onClick(color)}
        className={`luscher-color-card${isExiting ? ' is-exiting' : ''}`}
        style={{ backgroundColor: color.hex }}
        aria-label={`Обрати колір ${color.name}`}
    >
        <span className="sr-only">{color.name}</span>
    </button>
);

export default function App() {
    const [stage, setStage] = useState('intro');
    const [round, setRound] = useState(1);
    const [roundColors, setRoundColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [exitingColorId, setExitingColorId] = useState(null);


    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);
    const [aiError, setAiError] = useState(false);

    useEffect(() => {
        resetTest();
    }, []);

    const shuffle = () => [...LUSCHER_COLORS].sort(() => Math.random() - 0.5);

    const resetTest = () => {
        setRoundColors(shuffle());
        setRound(1);
        setSelectedColors([]);
        setExitingColorId(null);
        setAiAnalysis(null);
        setAiError(false);
        setStage('intro');
    };

    const startTest = () => setStage('test');

    const startSecondRound = () => {
        setRoundColors(shuffle());
        setRound(2);
        setSelectedColors([]);
        setStage('test');
    };

    const handleColorSelect = (color) => {
        if (exitingColorId !== null) return;
        setExitingColorId(color.id);

        setTimeout(() => {
            setExitingColorId(null);
            const newSelected = [...selectedColors, color];
            setSelectedColors(newSelected);

            if (newSelected.length === 8) {
                if (round === 1) {
                    setTimeout(() => setStage('intermission'), 400);
                } else {
                    setTimeout(() => setStage('results'), 400);
                }
            }
        }, 380);
    };

    const getProgressPct = () => {
        if (stage === 'intro') return 2;
        if (stage === 'test' && round === 1) return 20 + (selectedColors.length / 8) * 20;
        if (stage === 'intermission') return 40;
        if (stage === 'test' && round === 2) return 60 + (selectedColors.length / 8) * 30;
        if (stage === 'results') return 100;
        return 0;
    };

    const availableCount = 8 - selectedColors.length;

    const getResults = () => {
        if (selectedColors.length < 8) return null;
        const s = selectedColors;
        const getText = (colors, type) => colors.map(c => INTERPRETATIONS[c.id][type]).join(' ');
        return {
            goals: getText(s.slice(0, 2), 'goals'),
            actual: getText(s.slice(2, 4), 'actual'),
            indifferent: getText(s.slice(4, 6), 'indifferent'),
            rejected: getText(s.slice(6, 8), 'rejected'),
            sequenceNames: s.map(c => c.name).join(', ')
        };
    };

    const results = stage === 'results' ? getResults() : null;

    const generateAIAnalysis = async () => {
        if (!results) return;
        setLoadingAi(true);
        setAiError(false);

        const prompt = `
      Ти - професійний психолог та експерт з тесту Люшера.
      Користувач пройшов 8-кольоровий тест (друга вибірка використовується як основна).

      Послідовність вибору кольорів (2-й прохід): ${results.sequenceNames}

      Стандартна інтерпретація (фрагменти):
      1. Бажані цілі (+): ${results.goals}
      2. Поточний стан (x): ${results.actual}
      3. Байдуже (=): ${results.indifferent}
      4. Пригнічені потреби/Стрес (-): ${results.rejected}

      ЗАВДАННЯ:
      1. Напиши "Синтезований психологічний портрет" (узагальни результати, знайди зв'язки між бажаним та реальним, поясни протиріччя якщо є).
      2. Напиши 3 конкретні, емпатичні рекомендації ("Поради для гармонізації"), що допоможуть покращити стан.

      Стиль: Підтримуючий, професійний, українською мовою. Використовуй Markdown для форматування.
    `;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                }
            );
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) setAiAnalysis(text);
            else throw new Error('No text generated');
        } catch (error) {
            console.error('Gemini API Error:', error);
            setAiError(true);
        } finally {
            setLoadingAi(false);
        }
    };

    return (
        <div className="luscher-root">

            {/* PROGRESS BAR */}
            <div className="luscher-progress-track">
                <div
                    className="luscher-progress-fill"
                    style={{ width: `${getProgressPct()}%` }}
                />
            </div>

            <main className="luscher-main">

                {/* STAGE 1: INTRO */}
                {stage === 'intro' && (
                    <div className="luscher-stage">
                        <div className="luscher-card">
                            <div className="luscher-card__label">
                                <img src={instructionIcon} className="luscher-icon-sm" alt="" />
                                <strong>Інструкція:</strong>
                            </div>
                            <p className="luscher-card__text">
                                На наступному екрані обирайте той колір, який вам зараз здається найбільш приємним. Не асоціюйте кольори з одягом чи інтер'єром — обирайте інтуїтивно.
                            </p>
                            <div className="luscher-example-block">
                                <p className="luscher-example-label">Приклад:</p>
                                <video
                                    src={exampleVideo}
                                    className="luscher-video"
                                    controls={false}
                                    muted
                                    playsInline
                                    autoPlay
                                    loop
                                />
                            </div>
                        </div>
                        <div className="luscher-btn-row">
                            <button onClick={startTest} className="luscher-btn-primary">
                                Розпочати тест <img src={caretIcon} className="luscher-icon-sm" alt="" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STAGE 2 & 4: TEST */}
                {stage === 'test' && (
                    <div className="luscher-stage">
                        <div className="luscher-card">
                            <p className="luscher-card__round-label">
                                <strong>Спроба {round}:</strong>
                            </p>
                            <p className="luscher-card__text">Оберіть найприємніший колір</p>
                        </div>
                        <p className="luscher-count-text">
                            <strong>Залишилось обрати: {availableCount}</strong>
                        </p>
                        <div className="luscher-color-grid">
                            {roundColors
                                .filter(c => !selectedColors.some(s => s.id === c.id))
                                .map(color => (
                                    <ColorCard
                                        key={color.id}
                                        color={color}
                                        onClick={handleColorSelect}
                                        isExiting={exitingColorId === color.id}
                                    />
                                ))
                            }
                        </div>
                        <div className="luscher-btn-row">
                            <button onClick={resetTest} className="luscher-btn-secondary">
                                <img src={againIcon} className="luscher-icon-sm" alt="" />
                                Спочатку
                            </button>
                        </div>
                    </div>
                )}

                {/* STAGE 3: INTERMISSION */}
                {stage === 'intermission' && (
                    <div className="luscher-stage">
                        <div className="luscher-card">
                            <div className="luscher-card__label">
                                <Clock className="luscher-icon-sm" />
                                <strong>Невелика перерва</strong>
                            </div>

                            <p className="luscher-card__text">Методика тестування передбачає два підходи з невеликим інтервалом між ними.</p>
                            <p className="luscher-card__text">Будь ласка, зачекайте хвилинку та розслабтеся.</p>
                            <ul className="luscher-instructions-list">
                                <li>Не намагайтеся згадати той порядок, у якому обирали кольори першого разу.</li>
                                <li>Але й не намагайтеся спеціально розкласти їх по-іншому.</li>
                                <li>Просто обирайте кольори, які вам подобаються, так, ніби бачите їх вперше.</li>
                            </ul>
                        </div>
                        <div className="luscher-btn-row luscher-btn-row--gap">
                            <button onClick={resetTest} className="luscher-btn-secondary">
                                <img src={againIcon} className="luscher-icon-sm" alt="" />
                                Спочатку
                            </button>
                            <button onClick={startSecondRound} className="luscher-btn-primary">
                                Продовжити тест <img src={caretIcon} className="luscher-icon-sm" alt="" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STAGE 5: RESULTS */}
                {stage === 'results' && results && (
                    <div className="luscher-stage">

                        <div className="luscher-card luscher-results-header">
                            <div className="luscher-card__label">
                                <CheckCircle className="luscher-icon-sm" />
                                <strong>Результати діагностики</strong>
                            </div>
                            <p className="luscher-card__text">На основі вашого вибору (2-й прохід)</p>
                        </div>

                        <div className="luscher-card luscher-card--result">
                            <p className="luscher-result-title">1. ПРАГНЕННЯ ТА ЦЛІ (БАЖАНЕ)</p>
                            <p className="luscher-result-label">Позиції 1 та 2 (++)</p>
                            <p className="luscher-card__text">{results.goals}</p>
                        </div>

                        <div className="luscher-card luscher-card--result">
                            <p className="luscher-result-title">2. ПОТОЧНИЙ СТАН (РЕАЛЬНЕ)</p>
                            <p className="luscher-result-label">Позиції 3 та 4 (xx)</p>
                            <p className="luscher-card__text">{results.actual}</p>
                        </div>

                        <div className="luscher-card luscher-card--result">
                            <p className="luscher-result-title">3. СТРИМАНІ ВЛАСТИВОСТІ (БАЙДУЖЕ)</p>
                            <p className="luscher-result-label">Позиції 5 та 6 (==)</p>
                            <p className="luscher-card__text">{results.indifferent}</p>
                        </div>

                        <div className="luscher-card luscher-card--result">
                            <p className="luscher-result-title">4. ПРИГНІЧЕНІ ПОТРЕБИ (СТРЕС)</p>
                            <p className="luscher-result-label">Позиції 7 та 8 (--)</p>
                            <p className="luscher-card__text">{results.rejected}</p>
                        </div>

                        {/* AI ANALYSIS */}
                        {/*<div className="luscher-card luscher-card--ai">
                            {!aiAnalysis && !loadingAi && !aiError && (
                                <>
                                    <div className="luscher-card__label">
                                        <Sparkles className="luscher-icon-sm" />
                                        <strong>Глибокий AI-аналіз</strong>
                                    </div>
                                    <p className="luscher-card__text" style={{ fontStyle: 'italic' }}>
                                        Отримайте персоналізований синтез результатів та конкретні поради
                                        для покращення стану за допомогою штучного інтелекту.
                                    </p>
                                    <div className="luscher-btn-row luscher-btn-row--left">
                                        <button onClick={generateAIAnalysis} className="luscher-btn-green">
                                            Створити розширений звіт
                                        </button>
                                    </div>
                                </>
                            )}

                            {loadingAi && (
                                <div className="luscher-ai-loading">
                                    <Loader2 className="luscher-icon-xl luscher-spin" />
                                    <p>Штучний інтелект аналізує ваші вибори...</p>
                                </div>
                            )}

                            {aiError && (
                                <div className="luscher-ai-error"> 
                                    <p>На жаль, виникла помилка при з'єднанні з AI.</p>
                                    <button onClick={generateAIAnalysis} className="luscher-link-btn">
                                        Спробувати ще раз
                                    </button>
                                </div>
                            )}

                            {aiAnalysis && (
                                <>
                                    <div className="luscher-card__label">
                                        <Sparkles className="luscher-icon-sm" />
                                        <strong>Персональний AI-звіт</strong>
                                    </div>
                                    <div className="luscher-prose">
                                        <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                                    </div>
                                </>
                            )}
                        </div>*/}

                        {/* DISCLAIMER */}
                        <div className="luscher-card">
                            <div className="luscher-card__label">
                                <img src={warningIcon} className="luscher-icon-sm" alt="" />
                                <strong>Важливе зауваження:</strong>
                            </div>
                            <p className="luscher-card__text">
                                Цей тест є інструментом для самопізнання "тут і зараз". Результати залежать від моменту тестування.
                                Якщо результати вказують на сильний стрес (особливо в блоці 4), рекомендується відпочити або звернутися до фахівця.
                            </p>
                        </div>

                        <div className="luscher-btn-row">
                            <button onClick={resetTest} className="luscher-btn-primary">
                                <img src={againIcon} className="luscher-icon-sm" alt="" />
                                Пройти тест ще раз
                            </button>
                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}
