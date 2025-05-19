import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matArrowForward, matCheckCircle, matClose, matDragIndicator, matLocalFireDepartment, matLock, matLockOpen } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

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
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconComponent,
    HlmButtonDirective,
    HeaderComponent,
    FooterComponent
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
  template: `
    <app-header />
    
    <div class="flex-1 container py-32">
      <div class="max-w-3xl mx-auto px-4">
        <!-- Treasure Map -->
        <div class="mb-8 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-2xl p-6 shadow-lg">
          <!-- Map Grid -->
          <div class="grid grid-cols-3 gap-4">
            <div *ngFor="let level of levels" 
                 class="relative group"
                 [class.cursor-pointer]="!level.locked"
                 (click)="selectLevel(level)">
              <!-- Level Card -->
              <div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 transform transition-all duration-300"
                   [class.group-hover:scale-105]="!level.locked"
                   [class.opacity-50]="level.locked">
                <!-- Level Icon -->
                <div class="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                     [class]="getLevelIconClass(level)">
                  <ng-icon 
                    [name]="level.locked ? 'matLock' : (level.completed ? 'matCheckCircle' : 'matLockOpen')"
                    class="text-2xl"
                    [class]="getLevelIconColor(level)">
                  </ng-icon>
                </div>
                
                <!-- Level Info -->
                <div class="text-center">
                  <div class="font-bold text-amber-800 dark:text-amber-200">{{ level.name }}</div>
                  <div class="text-sm" [class]="getDifficultyColor(level)">
                    {{ getDifficultyText(level.difficulty) }}
                  </div>
                </div>

                <!-- Progress Indicator -->
                <div *ngIf="!level.locked" class="mt-2">
                  <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 transition-all duration-300"
                         [style.width.%]="getLevelProgress(level)">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Connection Line -->
              <div *ngIf="!isLastLevel(level)" 
                   class="absolute top-1/2 -right-2 w-4 h-0.5 bg-amber-500">
              </div>
            </div>
          </div>
        </div>

        <!-- Game Header -->
        <div class="mb-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg">
          <!-- Progress Bar -->
          <div class="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
            <div 
              class="h-full bg-white transition-all duration-300 rounded-full"
              [style.width.%]="progressPercentage"
            ></div>
          </div>
          
          <!-- Game Stats -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <!-- Level Indicator -->
              <div class="bg-white/10 rounded-xl px-4 py-2">
                <div class="text-sm text-white/80">Nível</div>
                <div class="text-xl font-bold text-white">{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</div>
              </div>

              <!-- Score Display -->
              <div class="bg-white/10 rounded-xl px-4 py-2">
                <div class="text-sm text-white/80">Pontos</div>
                <div class="text-xl font-bold text-white">{{ score }}</div>
              </div>
            </div>

            <!-- Streak Counter -->
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ng-icon name="matLocalFireDepartment" class="text-white text-xl"></ng-icon>
              </div>
              <div class="text-white font-bold text-xl">{{ correctAnswers }}</div>
            </div>
          </div>
        </div>

        <!-- Question Card -->
        <div class="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
          <!-- Question Text -->
          <div class="mb-8">
            <div class="text-sm text-amber-500 dark:text-amber-400 mb-2">Questão {{ currentQuestionIndex + 1 }}</div>
            <h2 class="text-xl md:text-2xl font-bold dark:text-white">
              {{ currentQuestion?.texto }}
            </h2>
          </div>

          <!-- Answer Options Grid -->
          <div class="grid grid-cols-2 gap-4">
            <button
              *ngFor="let option of shuffledAnswers"
              (click)="selectAnswer(option)"
              [disabled]="hasAnswered"
              [class]="getAnswerButtonClass(option)"
              class="p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] min-h-[80px] flex items-center relative group bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
            >
              <!-- Handle Icon -->
              <div class="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ng-icon name="matDragIndicator" class="text-gray-400 dark:text-gray-500"></ng-icon>
              </div>
              
              <!-- Answer Text -->
              <span class="ml-8">{{ option.texto }}</span>
            </button>
          </div>

          <!-- Feedback Message -->
          <div 
            *ngIf="hasAnswered"
            [class]="isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'"
            class="mt-6 p-4 rounded-xl flex items-center gap-3 transform transition-all duration-300"
            [class.correct-answer]="isCorrect"
          >
            <ng-icon 
              [name]="isCorrect ? 'matCheckCircle' : 'matClose'"
              [class]="isCorrect ? 'text-green-500' : 'text-red-500'"
              class="text-2xl"
            ></ng-icon>
            <p [class]="isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
              {{ feedbackMessage }}
            </p>
          </div>

          <!-- Next Button -->
          <button
            *ngIf="hasAnswered"
            (click)="nextQuestion()"
            class="mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {{ isLastQuestion ? 'Ver Resultados' : 'Próxima' }}
            <ng-icon name="matArrowForward" class="text-xl"></ng-icon>
          </button>
        </div>

        <!-- Results Screen -->
        <div *ngIf="showResults" class="bg-white dark:bg-[#1e1e1e] rounded-2xl p-8 shadow-lg mt-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold mb-2 dark:text-white">Fim de Jogo!</h2>
            <p class="text-gray-500 dark:text-gray-400">Veja como você se saiu</p>
          </div>

          <!-- Final Score -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-green-100 dark:bg-green-900 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ correctAnswers }}</div>
              <div class="text-sm text-green-700 dark:text-green-300">Acertos</div>
            </div>
            <div class="bg-red-100 dark:bg-red-900 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ incorrectAnswers }}</div>
              <div class="text-sm text-red-700 dark:text-red-300">Erros</div>
            </div>
            <div class="bg-amber-100 dark:bg-amber-900 rounded-xl p-4 text-center">
              <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ score }}</div>
              <div class="text-sm text-amber-700 dark:text-amber-300">Pontos</div>
            </div>
          </div>
          
          <!-- Review Section -->
          <div *ngIf="incorrectQuestions.length > 0" class="mt-8">
            <h3 class="text-xl font-bold mb-4 dark:text-white">Questões para Revisar:</h3>
            <div class="space-y-4">
              <div *ngFor="let question of incorrectQuestions" 
                   class="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl transform transition-all duration-300 hover:scale-[1.01]">
                <p class="font-medium dark:text-white">{{ question.texto }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Resposta correta: {{ getCorrectAnswer(question) }}
                </p>
              </div>
            </div>
          </div>

          <button
            (click)="restartQuiz()"
            class="mt-8 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    </div>

    <app-footer />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    @keyframes correctAnswer {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    @keyframes incorrectAnswer {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
      100% { transform: translateX(0); }
    }

    @keyframes scoreChange {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    .correct-answer {
      animation: correctAnswer 0.5s ease-in-out forwards;
    }

    .incorrect-answer {
      animation: incorrectAnswer 0.5s ease-in-out;
    }

    .score-change {
      animation: scoreChange 0.3s ease-in-out;
    }

    /* Add hover effect for the handle */
    button:hover .handle-icon {
      opacity: 1;
    }

    /* Add glowing effect for correct answers */
    .glow {
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
    }

    /* Add pulse animation for the progress bar */
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .progress-pulse {
      animation: pulse 2s infinite;
    }

    /* Add map styles */
    .map-path {
      position: absolute;
      background: linear-gradient(90deg, #f59e0b, #d97706);
      height: 2px;
      transform-origin: left center;
    }

    .map-node {
      transition: all 0.3s ease;
    }

    .map-node:hover {
      transform: scale(1.05);
    }

    .map-node.locked {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class QuizComponent implements OnInit {
  questions: Question[] = [
    {
      id: 1,
      texto: "O que é o ACE?",
      respostas: [
        { id: 1, texto: "Um programa de treinamento para motoristas que visa melhorar a condução econômica.", certa: 1 },
        { id: 2, texto: "Um dispositivo de entretenimento para carros.", certa: 0 },
        { id: 3, texto: "Um sistema de navegação GPS.", certa: 0 },
        { id: 4, texto: "Um aplicativo de mensagens.", certa: 0 }
      ]
    },
    {
      id: 2,
      texto: "Qual é a média de consumo de um carro de passeio em quilômetros por litro (km/L)?",
      respostas: [
        { id: 1, texto: "12 km/L.", certa: 1 },
        { id: 2, texto: "25 km/L.", certa: 0 },
        { id: 3, texto: "8 km/L.", certa: 0 },
        { id: 4, texto: "30 km/L.", certa: 0 }
      ]
    },
    {
      id: 3,
      texto: "Qual é a média de consumo de um ônibus em litros por quilômetro (km/L)?",
      respostas: [
        { id: 1, texto: "2,5 km/L.", certa: 1 },
        { id: 2, texto: "5,0 km/L.", certa: 0 },
        { id: 3, texto: "1,5 km/L.", certa: 0 },
        { id: 4, texto: "3,5 km/L.", certa: 0 }
      ]
    },
    {
      id: 4,
      texto: "O que o ACE faz?",
      respostas: [
        { id: 1, texto: "Registra eventos sociais.", certa: 0 },
        { id: 2, texto: "Registra eventos do carro e auxilia na melhoria da condução econômica.", certa: 1 },
        { id: 3, texto: "Registra eventos de trânsito.", certa: 0 },
        { id: 4, texto: "Registra eventos de trânsito e auxilia na melhoria da condução econômica.", certa: 0 }
      ]
    },
    {
      id: 5,
      texto: "Quais são as fases de capacitação do ACE?",
      respostas: [
        { id: 1, texto: "Bronze, Prata, Ouro.", certa: 1 },
        { id: 2, texto: "Bronze, Prata, Platina.", certa: 0 },
        { id: 3, texto: "Bronze, Prata, Ouro, Platina.", certa: 0 },
        { id: 4, texto: "Bronze, Prata, Ouro, Diamante.", certa: 0 }
      ]
    },
    {
      id: 6,
      texto: "Qual é a pontuação mínima estabelecida para cada fase do programa?",
      respostas: [
        { id: 1, texto: "1 ponto para Bronze, 2 pontos para Prata, 3 pontos para Ouro.", certa: 0 },
        { id: 2, texto: "2 pontos para Bronze, 3 pontos para Prata, 4 pontos para Ouro.", certa: 1 },
        { id: 3, texto: "1 ponto para Bronze, 2 pontos para Prata, 3 pontos para Ouro, 4 pontos para Platina.", certa: 0 },
        { id: 4, texto: "2 pontos para Bronze, 3 pontos para Prata, 4 pontos para Ouro, 5 pontos para Platina.", certa: 0 }
      ]
    },
    {
      id: 7,
      texto: "Quantos meses consecutivos atingindo a meta estabelecida para cada fase são necessários para receber o certificado correspondente?",
      respostas: [
        { id: 1, texto: "1 mês.", certa: 0 },
        { id: 2, texto: "2 meses.", certa: 1 },
        { id: 3, texto: "3 meses.", certa: 0 },
        { id: 4, texto: "4 meses.", certa: 0 }
      ]
    },
    {
      id: 8,
      texto: "Qual é a faixa mais econômica e eficiente no conta-giros?",
      respostas: [
        { id: 1, texto: "1200-1600 rpm.", certa: 1 },
        { id: 2, texto: "2000-2500 rpm.", certa: 0 },
        { id: 3, texto: "1400-1800 rpm.", certa: 0 },
        { id: 4, texto: "1800-2200 rpm.", certa: 0 }
      ]
    },
    {
      id: 9,
      texto: "Em que situações é permitido exceder essa faixa de rotação?",
      respostas: [
        { id: 1, texto: "Em situações como acesso a rodovias ou subidas com o carro carregado.", certa: 1 },
        { id: 2, texto: "Sempre que quiser.", certa: 0 },
        { id: 3, texto: "Em situações de emergência.", certa: 0 },
        { id: 4, texto: "Em situações de trânsito intenso.", certa: 0 }
      ]
    },
    {
      id: 10,
      texto: "O uso do motor abaixo da faixa verde é mais econômico?",
      respostas: [
        { id: 1, texto: "Sim.", certa: 0 },
        { id: 2, texto: "Não.", certa: 1 },
        { id: 3, texto: "Depende da condição do motor.", certa: 0 },
        { id: 4, texto: "Não é recomendado.", certa: 0 }
      ]
    },
    {
      id: 11,
      texto: "Por que não devo utilizar o motor abaixo da faixa verde?",
      respostas: [
        { id: 1, texto: "Porque é mais eficiente.", certa: 0 },
        { id: 2, texto: "Porque pode ser prejudicial para o carro.", certa: 1 },
        { id: 3, texto: "Porque é mais barato.", certa: 0 },
        { id: 4, texto: "Porque é mais silencioso.", certa: 0 }
      ]
    },
    {
      id: 12,
      texto: "Como faço a aceleração progressiva?",
      respostas: [
        { id: 1, texto: "Mantendo o pedal abaixo de 50% do curso.", certa: 1 },
        { id: 2, texto: "Pisando fundo no acelerador.", certa: 0 },
        { id: 3, texto: "Pisando fundo no acelerador e mantendo o carro em baixa velocidade.", certa: 0 },
        { id: 4, texto: "Pisando fundo no acelerador e mantendo o carro em alta velocidade.", certa: 0 }
      ]
    },
    {
      id: 13,
      texto: "Em que condição de condução o motorista obtém o veículo com consumo zero?",
      respostas: [
        { id: 1, texto: "Quando o carro está engrenado e acelerando.", certa: 0 },
        { id: 2, texto: "Quando o carro está engrenado e deslizando sem pressionar o acelerador.", certa: 1 },
        { id: 3, texto: "Quando o carro está parado e o motorista mantém o pedal do acelerador pressionado.", certa: 0 },
        { id: 4, texto: "Quando o carro está em baixa velocidade e o motorista mantém o pedal do acelerador pressionado.", certa: 0 }
      ]
    },
    {
      id: 14,
      texto: "Do ponto de vista de economia de combustível, qual a melhor forma de diminuir a velocidade?",
      respostas: [
        { id: 1, texto: "Freando bruscamente.", certa: 0 },
        { id: 2, texto: "Retirando o pé do acelerador e deixando o carro deslizar.", certa: 1 },
        { id: 3, texto: "Freando suavemente e mantendo o carro em baixa velocidade.", certa: 0 },
        { id: 4, texto: "Freando suavemente e mantendo o carro em alta velocidade.", certa: 0 }
      ]
    },
    {
      id: 15,
      texto: "O consumo do carro ligado parado prejudica a pontuação do motorista?",
      respostas: [
        { id: 1, texto: "Sim.", certa: 1 },
        { id: 2, texto: "Não.", certa: 0 },
        { id: 3, texto: "Depende da condição do motorista.", certa: 0 },
        { id: 4, texto: "Depende da condição do carro.", certa: 0 }
      ]
    },
    {
      id: 16,
      texto: "Qual é a condição adequada de utilização da faixa amarela do conta-giros?",
      respostas: [
        { id: 1, texto: "Quando se está em ponto morto.", certa: 0 },
        { id: 2, texto: "Quando se está fazendo uso do freio motor.", certa: 1 },
        { id: 3, texto: "Quando se está fazendo uso do freio motor e mantendo o carro em baixa velocidade.", certa: 0 },
        { id: 4, texto: "Quando se está fazendo uso do freio motor e mantendo o carro em alta velocidade.", certa: 0 }
      ]
    },
    {
      id: 17,
      texto: "Na aceleração progressiva, qual o percentual máximo a ser utilizado?",
      respostas: [
        { id: 1, texto: "25%.", certa: 0 },
        { id: 2, texto: "60%.", certa: 1 },
        { id: 3, texto: "100%.", certa: 0 },
        { id: 4, texto: "150%.", certa: 0 }
      ]
    },
    {
      id: 18,
      texto: "Qual a faixa ultra econômica do motor?",
      respostas: [
        { id: 1, texto: "1400 rpm.", certa: 1 },
        { id: 2, texto: "2000-2500 rpm.", certa: 0 },
        { id: 3, texto: "1200-1600 rpm.", certa: 0 },
        { id: 4, texto: "1800-2200 rpm.", certa: 0 }
      ]
    },
    {
      id: 19,
      texto: "O que é o Econômetro?",
      respostas: [
        { id: 1, texto: "Um dispositivo de medição de temperatura.", certa: 0 },
        { id: 2, texto: "Um modo de leitura do painel que mostra o consumo instantâneo de combustível do motor.", certa: 1 },
        { id: 3, texto: "Um sistema de controle de emissões.", certa: 0 },
        { id: 4, texto: "Um sistema de navegação GPS.", certa: 0 }
      ]
    },
    {
      id: 20,
      texto: "Até que rotação é permitido utilizar em uma subida de forma econômica?",
      respostas: [
        { id: 1, texto: "1800 rpm.", certa: 1 },
        { id: 2, texto: "3000 rpm.", certa: 0 },
        { id: 3, texto: "2000-2500 rpm.", certa: 0 },
        { id: 4, texto: "2500-3000 rpm.", certa: 0 }
      ]
    },
    {
      id: 21,
      texto: "Quais são as únicas condições orientadas a utilizar 100% do pedal do acelerador?",
      respostas: [
        { id: 1, texto: "Nunca é recomendado usar 100% do pedal do acelerador.", certa: 1 },
        { id: 2, texto: "Em todas as condições de condução.", certa: 0 },
        { id: 3, texto: "Em condições específicas de trânsito intenso.", certa: 0 },
        { id: 4, texto: "Em condições específicas de trânsito intenso e alta velocidade.", certa: 0 }
      ]
    },
    {
      id: 22,
      texto: "O que é a distância de seguimento?",
      respostas: [
        { id: 1, texto: "A distância entre os espelhos retrovisores.", certa: 0 },
        { id: 2, texto: "Manter uma distância segura do veículo à frente para manter um ritmo constante na estrada.", certa: 1 },
        { id: 3, texto: "Manter uma distância segura do veículo à frente para manter um ritmo constante na estrada e evitar colisões.", certa: 0 },
        { id: 4, texto: "Manter uma distância segura do veículo à frente para manter um ritmo constante na estrada e evitar colisões em alta velocidade.", certa: 0 }
      ]
    },
    {
      id: 23,
      texto: "Como fazer uma parada programada de forma econômica?",
      respostas: [
        { id: 1, texto: "Pisando fundo no freio.", certa: 0 },
        { id: 2, texto: "Retirando o pé do acelerador e utilizando o freio suavemente apenas para ajustar o ponto de parada.", certa: 1 },
        { id: 3, texto: "Pisando fundo no freio e mantendo o carro em baixa velocidade.", certa: 0 },
        { id: 4, texto: "Retirando o pé do acelerador e utilizando o freio suavemente apenas para ajustar o ponto de parada e mantendo o carro em baixa velocidade.", certa: 0 }
      ]
    },
    {
      id: 24,
      texto: "Como passar no radar de forma econômica?",
      respostas: [
        { id: 1, texto: "Mantendo uma velocidade constante e rápida.", certa: 0 },
        { id: 2, texto: "Retirando o pé do acelerador com antecedência e ajustando a velocidade para corresponder à da via.", certa: 1 },
        { id: 3, texto: "Mantendo uma velocidade constante e rápida e utilizando o radar de forma econômica.", certa: 0 },
        { id: 4, texto: "Retirando o pé do acelerador com antecedência e ajustando a velocidade para corresponder à da via e utilizando o radar de forma econômica.", certa: 0 }
      ]
    },
    {
      id: 25,
      texto: "No declive com a marcha engrenada e sem o pé no acelerador, qual a marcha mais econômica?",
      respostas: [
        { id: 1, texto: "Marcha alta.", certa: 0 },
        { id: 2, texto: "Todas as marchas são econômicas nessas condições.", certa: 1 },
        { id: 3, texto: "Marcha alta e mantendo o carro em baixa velocidade.", certa: 0 },
        { id: 4, texto: "Todas as marchas são econômicas nessas condições e mantendo o carro em baixa velocidade.", certa: 0 }
      ]
    },
    {
      id: 26,
      texto: "Qual é a pontuação máxima que você pode alcançar por dia no programa ACE?",
      respostas: [
        { id: 1, texto: "3 pontos.", certa: 0 },
        { id: 2, texto: "5 pontos.", certa: 1 },
        { id: 3, texto: "7 pontos.", certa: 0 },
        { id: 4, texto: "10 pontos.", certa: 0 }
      ]
    },
    {
      id: 27,
      texto: "Qual é o percentual máximo para pontuar em giro no programa ACE?",
      respostas: [
        { id: 1, texto: "5%.", certa: 0 },
        { id: 2, texto: "7%.", certa: 1 },
        { id: 3, texto: "10%.", certa: 0 },
        { id: 4, texto: "15%.", certa: 0 }
      ]
    },
    {
      id: 28,
      texto: "Qual é o percentual máximo para pontuar em freio no programa ACE?",
      respostas: [
        { id: 1, texto: "7%.", certa: 1 },
        { id: 2, texto: "10%.", certa: 0 },
        { id: 3, texto: "15%.", certa: 0 },
        { id: 4, texto: "20%.", certa: 0 }
      ]
    },
    {
      id: 29,
      texto: "Qual é o percentual máximo para pontuar no pedal do acelerador?",
      respostas: [
        { id: 1, texto: "15%.", certa: 1 },
        { id: 2, texto: "20%.", certa: 0 },
        { id: 3, texto: "25%.", certa: 0 },
        { id: 4, texto: "30%.", certa: 0 }
      ]
    },
    {
      id: 30,
      texto: "Quais são os critérios de pontuação diária no programa ACE?",
      respostas: [
        { id: 1, texto: "Apenas a quilometragem percorrida.", certa: 0 },
        { id: 2, texto: "Giro, freio, pedal do acelerador, média da linha e evolução de consumo em relação à semana anterior.", certa: 1 },
        { id: 3, texto: "Giro, freio, pedal do acelerador, média da linha e evolução de consumo em relação à semana anterior e utilizando o radar de forma econômica.", certa: 0 },
        { id: 4, texto: "Giro, freio, pedal do acelerador, média da linha e evolução de consumo em relação à semana anterior e mantendo o carro em baixa velocidade.", certa: 0 }
      ]
    },
    {
      id: 31,
      texto: "Quais são os quesitos para pontuação diária no programa ACE?",
      respostas: [
        { id: 1, texto: "Não existem critérios para a pontuação diária.", certa: 0 },
        { id: 2, texto: "Giro, freio, pedal do acelerador, média da linha e evolução de consumo em relação à semana anterior.", certa: 1 },
        { id: 3, texto: "Giro, freio, pedal do acelerador, média da linha e evolução de consumo em relação à semana anterior e utilizando o radar de forma econômica.", certa: 0 },
        { id: 4, texto: "Giro, freio, pedal do acelerador, média da linha e evolução de consumo em relação à semana anterior e mantendo o carro em baixa velocidade.", certa: 0 }
      ]
    },
    {
      id: 32,
      texto: "Como faço para baixar o APP do ACE?",
      respostas: [
        { id: 1, texto: "Não é possível baixar o aplicativo.", certa: 0 },
        { id: 2, texto: "Através da loja de aplicativos do dispositivo, procurando por 'Motorista Ace Copilot'.", certa: 1 },
        { id: 3, texto: "Através da loja de aplicativos do dispositivo, procurando por 'Motorista Ace Copilot' e utilizando o radar de forma econômica.", certa: 0 },
        { id: 4, texto: "Através da loja de aplicativos do dispositivo, procurando por 'Motorista Ace Copilot' e mantendo o carro em baixa velocidade.", certa: 0 }
      ]
    },
    {
      id: 33,
      texto: "Por que é importante o acesso ao aplicativo diariamente?",
      respostas: [
        { id: 1, texto: "Para medir o desenvolvimento do motorista e focar nos pontos onde ele pode melhorar.", certa: 1 },
        { id: 2, texto: "Não é importante.", certa: 0 },
        { id: 3, texto: "Apenas para registrar a quilometragem.", certa: 0 },
        { id: 4, texto: "Para verificar o clima.", certa: 0 }
      ]
    }
  ];

  levels: Level[] = [
    {
      id: 1,
      name: 'Nível 1',
      difficulty: 'easy',
      completed: false,
      locked: false,
      questions: this.questions.slice(0, 11)
    },
    {
      id: 2,
      name: 'Nível 2',
      difficulty: 'medium',
      completed: false,
      locked: true,
      questions: this.questions.slice(11, 22)
    },
    {
      id: 3,
      name: 'Nível 3',
      difficulty: 'hard',
      completed: false,
      locked: true,
      questions: this.questions.slice(22)
    }
  ];

  currentLevel: Level | null = null;
  currentQuestionIndex = 0;
  hasAnswered = false;
  selectedAnswer: Answer | null = null;
  isCorrect = false;
  feedbackMessage = '';
  showResults = false;
  correctAnswers = 0;
  score = 0;
  incorrectQuestions: Question[] = [];
  shuffledAnswers: Answer[] = [];
  incorrectAnswers = 0;

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
    this.questions = this.currentLevel.questions;
    this.shuffleAnswers();
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
      // Unlock next level if current level is completed
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
      this.correctAnswers > 0 && this.questions.includes(q)
    ).length;
    return (completedQuestions / level.questions.length) * 100;
  }

  isLastLevel(level: Level): boolean {
    return level.id === this.levels.length;
  }

  selectLevel(level: Level) {
    if (level.locked) return;
    
    this.currentLevel = level;
    this.questions = level.questions;
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