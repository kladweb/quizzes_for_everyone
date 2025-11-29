// import React, { useState } from 'react';
//
// // Types
// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   correctIndex: number;
//   explanation: string;
// }
//
// interface Quiz {
//   title: string;
//   description: string;
//   questions: Question[];
// }
//
// // Question Component
// const QuestionComponent: React.FC<{
//   question: Question;
//   selectedIndex: number | null;
//   onAnswer: (index: number) => void;
//   isSubmitted: boolean;
// }> = ({ question, selectedIndex, onAnswer, isSubmitted }) => {
//
//   const handleOptionClick = (index: number) => {
//     if (isSubmitted) return;
//     onAnswer(index);
//   };
//
//   const getButtonStyle = (index: number): React.CSSProperties => {
//     const isSelected = index === selectedIndex;
//
//     if (!isSubmitted) {
//       return {
//         backgroundColor: isSelected ? '#1976d2' : 'white',
//         color: isSelected ? 'white' : '#333',
//         borderColor: isSelected ? '#1976d2' : '#ddd'
//       };
//     }
//
//     if (index === question.correctIndex) {
//       return { backgroundColor: '#4caf50', color: 'white', borderColor: '#4caf50' };
//     }
//
//     if (isSelected && index !== question.correctIndex) {
//       return { backgroundColor: '#f44336', color: 'white', borderColor: '#f44336' };
//     }
//
//     return { opacity: 0.5 };
//   };
//
//   return (
//     <div style={{
//       marginBottom: '30px',
//       padding: '20px',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       backgroundColor: '#f9f9f9'
//     }}>
//       <h3 style={{ marginBottom: '15px', color: '#333' }}>{question.question}</h3>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//         {question.options.map((option, index) => (
//           <button
//             key={index}
//             onClick={() => handleOptionClick(index)}
//             disabled={isSubmitted}
//             style={{
//               padding: '12px 20px',
//               fontSize: '16px',
//               border: '2px solid #ddd',
//               borderRadius: '6px',
//               backgroundColor: 'white',
//               cursor: isSubmitted ? 'not-allowed' : 'pointer',
//               transition: 'all 0.3s ease',
//               textAlign: 'left',
//               ...getButtonStyle(index)
//             }}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//       {isSubmitted && (
//         <div style={{
//           marginTop: '15px',
//           padding: '12px',
//           backgroundColor: '#e3f2fd',
//           borderRadius: '6px',
//           color: '#1976d2',
//           fontSize: '14px'
//         }}>
//           <strong>Explanation:</strong> {question.explanation}
//         </div>
//       )}
//     </div>
//   );
// };
//
// // Quiz Component
// const QuizComponent: React.FC<{ quiz: Quiz; onReset: () => void }> = ({ quiz, onReset }) => {
//   const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
//     new Array(quiz.questions.length).fill(null)
//   );
//   const [isSubmitted, setIsSubmitted] = useState(false);
//
//   const handleAnswer = (questionIndex: number, optionIndex: number) => {
//     const newAnswers = [...selectedAnswers];
//     newAnswers[questionIndex] = optionIndex;
//     setSelectedAnswers(newAnswers);
//   };
//
//   const handleSubmit = () => {
//     setIsSubmitted(true);
//   };
//
//   const allAnswered = selectedAnswers.every(answer => answer !== null);
//
//   const correctCount = isSubmitted
//     ? selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctIndex).length
//     : 0;
//   const incorrectCount = isSubmitted ? quiz.questions.length - correctCount : 0;
//
//   return (
//     <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
//       <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//         <h1 style={{ color: '#333', marginBottom: '10px' }}>{quiz.title}</h1>
//         <p style={{ color: '#666', fontSize: '16px' }}>{quiz.description}</p>
//       </div>
//
//       {quiz.questions.map((question, index) => (
//         <QuestionComponent
//           key={question.id}
//           question={question}
//           selectedIndex={selectedAnswers[index]}
//           onAnswer={(optionIndex) => handleAnswer(index, optionIndex)}
//           isSubmitted={isSubmitted}
//         />
//       ))}
//
//       {!isSubmitted && (
//         <div style={{ textAlign: 'center', marginTop: '30px' }}>
//           <button
//             onClick={handleSubmit}
//             disabled={!allAnswered}
//             style={{
//               padding: '15px 40px',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               backgroundColor: allAnswered ? '#1976d2' : '#ccc',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: allAnswered ? 'pointer' : 'not-allowed',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             SUBMIT
//           </button>
//           {!allAnswered && (
//             <p style={{ marginTop: '10px', color: '#f44336', fontSize: '14px' }}>
//               Please answer all questions before submitting
//             </p>
//           )}
//         </div>
//       )}
//
//       {isSubmitted && (
//         <div style={{
//           marginTop: '30px',
//           padding: '20px',
//           backgroundColor: '#e8f5e9',
//           borderRadius: '8px',
//           textAlign: 'center'
//         }}>
//           <h2 style={{ color: '#2e7d32', marginBottom: '15px' }}>Quiz Complete!</h2>
//           <p style={{ fontSize: '18px', marginBottom: '10px' }}>
//             <strong>Correct:</strong> {correctCount} ✓
//           </p>
//           <p style={{ fontSize: '18px', marginBottom: '20px' }}>
//             <strong>Incorrect:</strong> {incorrectCount} ✗
//           </p>
//           <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20' }}>
//             Score: {Math.round((correctCount / quiz.questions.length) * 100)}%
//           </p>
//           <button
//             onClick={onReset}
//             style={{
//               marginTop: '20px',
//               padding: '12px 24px',
//               fontSize: '16px',
//               backgroundColor: '#1976d2',
//               color: 'white',
//               border: 'none',
//               borderRadius: '6px',
//               cursor: 'pointer'
//             }}
//           >
//             Load Another Quiz
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
//
// // QuizLoader Component
// const QuizLoader: React.FC<{ onQuizLoad: (quiz: Quiz) => void }> = ({ onQuizLoad }) => {
//   const [error, setError] = useState<string>('');
//
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//
//     setError('');
//     const reader = new FileReader();
//
//     reader.onload = (e) => {
//       try {
//         const content = e.target?.result as string;
//         const quiz = JSON.parse(content) as Quiz;
//
//         // Basic validation
//         if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
//           throw new Error('Invalid quiz format');
//         }
//
//         onQuizLoad(quiz);
//       } catch (err) {
//         setError('Error loading quiz file. Please check the JSON format.');
//         console.error(err);
//       }
//     };
//
//     reader.onerror = () => {
//       setError('Error reading file.');
//     };
//
//     reader.readAsText(file);
//   };
//
//   return (
//     <div style={{
//       maxWidth: '600px',
//       margin: '100px auto',
//       padding: '40px',
//       textAlign: 'center',
//       border: '2px dashed #ddd',
//       borderRadius: '12px',
//       backgroundColor: '#fafafa'
//     }}>
//       <h1 style={{ color: '#333', marginBottom: '20px' }}>Quiz Application</h1>
//       <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
//         Load a quiz from a JSON file to get started
//       </p>
//
//       <input
//         type="file"
//         accept=".json"
//         onChange={handleFileChange}
//         style={{
//           padding: '12px',
//           fontSize: '16px',
//           border: '2px solid #1976d2',
//           borderRadius: '6px',
//           cursor: 'pointer'
//         }}
//       />
//
//       {error && (
//         <p style={{
//           marginTop: '20px',
//           color: '#f44336',
//           fontSize: '14px',
//           padding: '10px',
//           backgroundColor: '#ffebee',
//           borderRadius: '6px'
//         }}>
//           {error}
//         </p>
//       )}
//
//       <div style={{
//         marginTop: '40px',
//         padding: '20px',
//         backgroundColor: '#e3f2fd',
//         borderRadius: '8px',
//         textAlign: 'left'
//       }}>
//         <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>Sample JSON Format:</h3>
//         <pre style={{
//           backgroundColor: '#fff',
//           padding: '15px',
//           borderRadius: '6px',
//           overflow: 'auto',
//           fontSize: '12px',
//           color: '#333'
//         }}>
// {`{
//   "title": "English Test: Present Simple",
//   "description": "Mini test",
//   "questions": [
//     {
//       "id": 1,
//       "question": "She ___ to school.",
//       "options": ["go", "goes", "went", "going"],
//       "correctIndex": 1,
//       "explanation": "He/She/It → goes"
//     }
//   ]
// }`}
//         </pre>
//       </div>
//     </div>
//   );
// };
//
// // Main App Component
// const App: React.FC = () => {
//   const [quiz, setQuiz] = useState<Quiz | null>(null);
//
//   const handleQuizLoad = (loadedQuiz: Quiz) => {
//     setQuiz(loadedQuiz);
//   };
//
//   const handleReset = () => {
//     setQuiz(null);
//   };
//
//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f5f5f5',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//     }}>
//       {quiz ? (
//         <QuizComponent quiz={quiz} onReset={handleReset} />
//       ) : (
//         <QuizLoader onQuizLoad={handleQuizLoad} />
//       )}
//     </div>
//   );
// };
//
// export default App;
