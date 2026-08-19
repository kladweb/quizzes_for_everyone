import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loginGoogle, useIsAuthLoading, useUser } from "../../store/useUserStore";
import { Skeleton } from "../../components/Skeleton/Skeleton";
import { handleCopy } from "../../utils/quizUtils";
import "./pageMain.css";

export const PageMain = () => {
  const currentLink = "easywebapp-anyquiz@yahoo.com";
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "ANY QUIZ";
  }, []);

  return (
    <div className='tests-container'>
      {!isImgLoaded && <Skeleton height={"67cqw"} className={"main-image"}/>}
      <Link to='/allquizzes'>
        <img
          className={`main-image${isImgLoaded ? "" : " hidden"}`}
          src="/open.png"
          alt="any-quiz"
          title="Перейти к списку всех тестов"
          onLoad={() => setIsImgLoaded(true)}
          onError={() => setIsImgLoaded(true)}
        />
      </Link>
      {
        user ?
          <div className='noticeBlock'>
            <h1 className='noticeText'>Что Вы хотите сделать?</h1>
            <Link className="link-btn link-main" to='/createquiz'>Создать новый тест</Link>
            <Link className="link-btn link-main" to='/allquizzes'>Пройти тест</Link>
          </div>
          :
          <div className='noticeBlock'>
            <p className='noticeText'>Авторизуйтесь, чтобы начать создавать свои тесты...</p>
            <button className='btn button-login ' onClick={loginGoogle} disabled={isAuthLoading}>
              {isAuthLoading ? "GOOGLE IN..." : "GOOGLE LOGIN"}
            </button>
          </div>
      }
      <Link className='link-nav link-all-quizzes' to={'/allquizzes'}>
        <span>Перейти к списку всех тестов</span>
      </Link>
      <div className="faq-block">
        <h2>Часто задаваемые вопросы (FAQ)</h2>
        <details>
          <summary>Что такое ANYQUIZ ?</summary>
          <p>ANYQUIZ — это онлайн-платформа для создания и прохождения интерактивных тестов (квизов). Вы можете создать
            тест самостоятельно или с помощью ИИ, поделиться ссылкой или QR-кодом и отслеживать результаты его
            прохождения.</p>
        </details>
        <details>
          <summary>Как создать интерактивный тест?</summary>
          <p>В ANYQUIZ можно создать интерактивный тест несколькими способами: вручную, с помощью ИИ или импортировав
            готовый тест из JSON-файла. После создания тест можно отредактировать, поделиться ссылкой или QR-кодом и
            отслеживать результаты прохождения.</p>
        </details>
        <details>
          <summary>Можно ли создать тест при помощи ИИ?</summary>
          <p>Да. В ANYQUIZ можно быстро создать интерактивный тест с помощью ИИ, просто описав тему и пожелания к тесту.
            Также можно использовать любой сторонний ИИ-сервис: сгенерировать тест в нужном формате, импортировать файл
            в ANYQUIZ и получить готовый интерактивный квиз.</p>
        </details>
        <details>
          <summary>Можно ли редактировать тест, созданный при помощи ИИ?</summary>
          <p>Да. В ANYQUIZ можно редактировать созданные тесты: добавлять, изменять и удалять вопросы и варианты
            ответов.</p>
        </details>
        <details>
          <summary>Для кого подходит ANYQUIZ?</summary>
          <p>ANYQUIZ подходит для учителей, преподавателей, студентов, школьников, организаторов мероприятий, авторов
            обучающих материалов и всех, кто хочет быстро создать интерактивный тест или викторину.</p>
        </details>
        <details>
          <summary>Можно ли проходить тесты без регистрации?</summary>
          <p>Да, проходить тесты можно без регистрации и без ограничений. Для создания собственных тестов необходимо
            войти в ANYQUIZ с помощью Google.</p>
        </details>
        <details>
          <summary>Можно ли поделиться тестом с учениками или друзьями?</summary>
          <p>Конечно. Вы можете отправить ученикам или друзьям ссылку на свой тест либо показать QR-код на экране.
            Участникам не обязательно регистрироваться для прохождения теста. Результаты прохождения вы сможете увидеть
            в разделе «Мои тесты».</p>
        </details>
        <details>
          <summary>Я не хочу, чтобы мой тест видели и проходили посторонние.</summary>
          <p>Если вы хотите ограничить доступ к тесту, при создании или редактировании выберите режим private. Такой
            тест не отображается в общем списке тестов, но остается доступным по прямой ссылке. Поэтому ссылку можно
            отправить только тем людям, которым вы хотите дать доступ к тесту.</p>
        </details>
        <details>
          <summary>Я прошел тест и хочу сохранить свои результаты. Как это сделать?</summary>
          <p>После прохождения теста нажмите кнопку «Сохранить результат в PDF-файл». Результат можно сохранить и
            использовать, например, для отправки или печати.</p>
        </details>
        <details>
          <summary>Почему есть ограничения на создание тестов с помощью ИИ? Что такое токены?</summary>
          <p>Генерация тестов с помощью ИИ использует платный AI API, поэтому количество генераций ограничено токенами.
            Токены — внутренняя единица ANYQUIZ, которая используется для генерации тестов с помощью нашего ИИ.</p>
          <p>Если вы хотите создавать тесты без ограничений AI-генерации ANYQUIZ, можно использовать сторонний ИИ-сервис
            и импортировать готовый тест в формате JSON. На странице создания теста из JSON есть шаблон и пример
            промпта. Такой способ также позволяет создавать тесты на основе книг, сайтов, PDF-файлов, документов и
            изображений.</p>
        </details>
        <details>
          <summary>Нужно ли устанавливать программу?</summary>
          <p>Нет. ANYQUIZ работает в браузере, поэтому для создания и прохождения тестов не нужно устанавливать
            отдельную программу.</p>
        </details>
        <details>
          <summary>Как связаться с создателями ANYQUIZ?</summary>
          <p>Если у вас есть вопросы, предложения или идеи по развитию ANYQUIZ, напишите нам по адресу: </p>
          <p className={`info-mail${copied ? " mail-copied" : ""}`}
             onClick={() => handleCopy(currentLink, setCopied)}>{copied ? "Скопировано!" : `${currentLink}.`}</p>
          <p>Мы будем рады получить обратную связь.</p>
        </details>
      </div>
    </div>
  );
}
