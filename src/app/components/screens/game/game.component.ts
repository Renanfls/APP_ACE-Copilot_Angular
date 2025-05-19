import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matArrowForward, matCheckCircle, matClose, matDragIndicator, matLocalFireDepartment, matLock, matLockOpen } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { StatisticComponent } from '../../statistic/statistic.component';
import { TaskComponent } from '../../task/task.component';

interface Answer {
  id: number;
  texto: string;
  certa: number;
}

interface Question {
  id: number;
  texto: string;
  respostas: Answer[];
}

interface Level {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  locked: boolean;
  questions: Question[];
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HlmButtonDirective,
    FooterComponent,
    HeaderComponent,
    StatisticComponent,
    TaskComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      matCheckCircle,
      matClose,
      matArrowForward,
      matDragIndicator,
      matLocalFireDepartment,
      matLock,
      matLockOpen
    })
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  showQuiz = false;
  currentLevel: Level | null = null;
  currentQuestionIndex = 0;
  hasAnswered = false;
  selectedAnswer: Answer | null = null;
  isCorrect = false;
  feedbackMessage = '';
  showResults = false;
  correctAnswers = 0;
  incorrectAnswers = 0;
  score = 0;
  incorrectQuestions: Question[] = [];
  shuffledAnswers: Answer[] = [];

  levels: Level[] = [
    {
      id: 1,
      name: 'Nível 1',
      difficulty: 'easy',
      completed: false,
      locked: false,
      questions: this.getQuestions().slice(0, 11)
    },
    {
      id: 2,
      name: 'Nível 2',
      difficulty: 'medium',
      completed: false,
      locked: true,
      questions: this.getQuestions().slice(11, 22)
    },
    {
      id: 3,
      name: 'Nível 3',
      difficulty: 'hard',
      completed: false,
      locked: true,
      questions: this.getQuestions().slice(22)
    }
  ];

  getQuestions(): Question[] {
    return [
      // ... Copy all questions from the quiz component ...
    ];
  }

  get currentQuestion(): Question | undefined {
    return this.currentLevel?.questions[this.currentQuestionIndex];
  }

  get totalQuestions(): number {
    return this.currentLevel?.questions.length || 0;
  }

  get progressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.totalQuestions - 1;
  }

  ngOnInit() {
    this.currentLevel = this.levels[0];
    this.shuffleAnswers();
  }

  toggleQuiz() {
    this.showQuiz = !this.showQuiz;
    if (this.showQuiz) {
      this.currentLevel = this.levels[0];
      this.shuffleAnswers();
    }
  }

  closeQuiz() {
    this.showQuiz = false;
    this.showResults = false;
    this.currentQuestionIndex = 0;
    this.hasAnswered = false;
    this.selectedAnswer = null;
    this.isCorrect = false;
    this.feedbackMessage = '';
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.score = 0;
    this.incorrectQuestions = [];
  }

  shuffleAnswers() {
    if (this.currentQuestion) {
      this.shuffledAnswers = [...this.currentQuestion.respostas].sort(() => Math.random() - 0.5);
    }
  }

  selectAnswer(answer: Answer) {
    if (this.hasAnswered) return;

    this.selectedAnswer = answer;
    this.hasAnswered = true;
    this.isCorrect = answer.certa === 1;

    if (this.isCorrect) {
      this.correctAnswers++;
      this.score += 10;
      this.feedbackMessage = 'Parabéns! Resposta correta!';
    } else {
      this.incorrectAnswers++;
      this.incorrectQuestions.push(this.currentQuestion!);
      this.feedbackMessage = 'Resposta incorreta. Tente novamente!';
    }
  }

  nextQuestion() {
    if (this.isLastQuestion) {
      this.showResults = true;
      if (this.currentLevel) {
        this.currentLevel.completed = true;
        const nextLevelIndex = this.levels.findIndex(l => l.id === this.currentLevel!.id + 1);
        if (nextLevelIndex !== -1) {
          this.levels[nextLevelIndex].locked = false;
        }
      }
    } else {
      this.currentQuestionIndex++;
      this.hasAnswered = false;
      this.selectedAnswer = null;
      this.isCorrect = false;
      this.feedbackMessage = '';
      this.shuffleAnswers();
    }
  }

  getLevelIconClass(level: Level): string {
    if (level.locked) {
      return 'bg-gray-200 dark:bg-gray-700';
    }
    if (level.completed) {
      return 'bg-green-100 dark:bg-green-900';
    }
    return 'bg-amber-100 dark:bg-amber-900';
  }

  getLevelIconColor(level: Level): string {
    if (level.locked) {
      return 'text-gray-500 dark:text-gray-400';
    }
    if (level.completed) {
      return 'text-green-500 dark:text-green-400';
    }
    return 'text-amber-500 dark:text-amber-400';
  }

  getDifficultyColor(level: Level): string {
    switch (level.difficulty) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  getDifficultyText(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return '';
    }
  }

  getLevelProgress(level: Level): number {
    if (level.locked) return 0;
    const completedQuestions = level.questions.filter(q => 
      this.correctAnswers > 0 && this.currentLevel?.questions.includes(q)
    ).length;
    return (completedQuestions / level.questions.length) * 100;
  }

  isLastLevel(level: Level): boolean {
    return level.id === this.levels.length;
  }

  selectLevel(level: Level) {
    if (level.locked) return;
    
    this.currentLevel = level;
    this.currentQuestionIndex = 0;
    this.hasAnswered = false;
    this.selectedAnswer = null;
    this.isCorrect = false;
    this.feedbackMessage = '';
    this.showResults = false;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.score = 0;
    this.incorrectQuestions = [];
    this.shuffleAnswers();
    this.showQuiz = true;
  }

  getAnswerButtonClass(answer: Answer): string {
    if (!this.hasAnswered) {
      return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white';
    }

    if (answer.certa === 1) {
      return 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 correct-answer';
    }

    if (answer === this.selectedAnswer) {
      return 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 incorrect-answer';
    }

    return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white opacity-50';
  }

  getCorrectAnswer(question: Question): string {
    return question.respostas.find(a => a.certa === 1)?.texto || '';
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.hasAnswered = false;
    this.selectedAnswer = null;
    this.isCorrect = false;
    this.feedbackMessage = '';
    this.showResults = false;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.score = 0;
    this.incorrectQuestions = [];
    this.shuffleAnswers();
  }
}
