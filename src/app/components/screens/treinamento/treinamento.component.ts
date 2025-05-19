import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matArrowForward, matCheckCircle, matClose } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

interface Question {
  id: number;
  indice: number;
  texto: string;
  resposta: number;
  gabarito: number;
  valor: number;
  linkErro?: string;
  msgErro?: string;
  imgErro?: string;
  imgAcerto?: string;
  msgAcerto?: string;
  itens: string[];
  ehAdendo?: boolean;
}

interface Video {
  id: number;
  tempo: number;
  link: string;
  titulo?: string;
  imgProxAula?: string;
  fimTreinamento?: boolean;
  img?: string;
  perguntas: Question[];
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
      matArrowForward
    })
  ],
  template: `
    <app-header />
    
    <div class="flex-1 container py-28">
      <div class="max-w-3xl mx-auto px-4">
        <!-- Completion Screen -->
        <div *ngIf="showCompletionScreen" class="text-center">
          <div class="bg-white dark:bg-[#1e1e1e] rounded-2xl p-8 shadow-lg">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Parabéns!</h2>
            <p class="text-lg mb-8 dark:text-gray-300">
              Você completou o quiz com {{ score }} de {{ totalScore }} pontos!
            </p>
            <button
              (click)="restartQuiz()"
              class="bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300"
            >
              Reiniciar Quiz
            </button>
          </div>
        </div>

        <!-- Quiz Content -->
        <div *ngIf="!showCompletionScreen">
          <!-- Video Section -->
          <div *ngIf="videos[currentVideoIndex].titulo" class="mb-8">
            <div class="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-lg">
              <h2 class="text-xl md:text-2xl font-bold mb-4 dark:text-white">
                {{ videos[currentVideoIndex].titulo }}
              </h2>
              <div class="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  [src]="getSafeVideoUrl(videos[currentVideoIndex].link)"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-8">
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-amber-400 transition-all duration-300"
                [style.width.%]="progressPercentage"
              ></div>
            </div>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ currentQuestionIndex + 1 }} de {{ totalQuestions }}
            </div>
          </div>

          <!-- Question Card -->
          <div class="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 shadow-lg">
            <!-- Question Text -->
            <h2 class="text-xl md:text-2xl font-bold mb-6 dark:text-white">
              {{ currentQuestion?.texto }}
            </h2>

            <!-- Answer Options -->
            <div class="grid grid-cols-1 gap-3">
              <button
                *ngFor="let option of currentQuestion?.itens; let i = index"
                (click)="selectAnswer(i)"
                [disabled]="hasAnswered"
                [class]="getAnswerButtonClass(i)"
                class="p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02]"
              >
                {{ option }}
              </button>
            </div>

            <!-- Feedback Message -->
            <div 
              *ngIf="hasAnswered"
              [class]="isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'"
              class="mt-6 p-4 rounded-xl flex items-center gap-3"
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
              class="mt-6 w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              {{ isLastQuestion ? 'Próxima Aula' : 'Próxima' }}
              <ng-icon name="matArrowForward" class="text-xl"></ng-icon>
            </button>
          </div>
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
  `]
})
export class TreinamentoOnlineComponent implements OnInit {
  videos: Video[] = [
    {
      id: 1,
      tempo: 5,
      link: "s2dVKFS_zQg",
      titulo: "Responda as questões abaixo para receber a próxima aula.",
      perguntas: [
        {
          id: 1,
          indice: 0,
          texto: "Qual a média de consumo de diesel para um ônibus urbano?",
          resposta: 0,
          gabarito: 2,
          valor: 0.5,
          linkErro: "kBgSRRHjNeU",
          itens: ["0 km/l a 2 km/l", "2 km/l a 4 km/l", "4 km/l a 6 km/l", "6 km/l a 8 km/l", "8 km/l a 12 km/l"]
        },
        {
          id: 2,
          indice: 1,
          texto: "Quais certificados você pode receber?",
          resposta: 0,
          gabarito: 3,
          valor: 0.5,
          linkErro: "xm9jyxK4C1M",
          itens: ["Amigo da natureza", "Amigo da natureza e eficiente", "Bronze, Prata e Ouro", "Branco, Amarelo, Azul e Preto"]
        }
      ]
    },
    {
      id: 2,
      tempo: 8,
      link: "koj8XjqZ_gc",
      imgProxAula: "Aula3.png",
      perguntas: [
        {
          id: 3,
          indice: 0,
          texto: "Quais fatores de consumo dependem apenas da sua forma de conduzir?",
          resposta: 0,
          gabarito: 4,
          valor: 0.5,
          msgErro: "Resposta ERRADA!!! Assista novamente os primeiros minutos da aula 2, e você vai encontrar a resposta.",
          itens: ["Transito, Carga e Torque (pedal)", "Transito, Frenagem e Carga", "Carga, Giro e Torque (pedal)", "Giro, Frenagem e Torque (pedal)"]
        },
        {
          id: 4,
          indice: 1,
          texto: "Qual o consumo quando o carro está engrenado e seu pé fora do pedal do acelerador?",
          resposta: 0,
          gabarito: 1,
          valor: 1,
          linkErro: "84NEgbYFGq4",
          itens: ["ZERO", "De 1 a 2 Km/L", "De 2 a 3 Km/L", "De 3 a 4 Km/L"]
        },
        {
          id: 5,
          indice: 2,
          texto: "Você pode ultrapassar a faixa verde de consumo mostrada no painel?",
          resposta: 0,
          gabarito: 1,
          valor: 0.5,
          linkErro: "4orTAPQFpEs",
          itens: ["SIM", "NÃO"]
        },
        {
          id: 6,
          indice: 3,
          texto: "Você deve usar o freio para controlar sua velocidade?",
          resposta: 0,
          gabarito: 2,
          valor: 0.5,
          linkErro: "DHwTcJBFEgg",
          itens: ["SIM", "NÃO"]
        }
      ]
    },
    {
      id: 3,
      tempo: 19,
      link: "LIh14F7YlF4",
      imgProxAula: "Aula4.png",
      perguntas: [
        {
          id: 7,
          indice: 0,
          texto: "Quando você pode usar a faixa amarela de giro do motor?",
          resposta: 0,
          gabarito: 3,
          valor: 0.5,
          linkErro: "AdRCf0LLgNE",
          itens: ["Em subidas muito íngremes", "Em arrancadas com o carro pesado", "Apenas como freio motor", "Em uma ultrapassagem"]
        },
        {
          id: 8,
          indice: 1,
          texto: "Quanto você deve pisar no acelerador?",
          resposta: 0,
          gabarito: 3,
          valor: 0.5,
          linkErro: "Iuw6Amptnl0",
          itens: ["Até 30%", "Até 40%", "Até 60%", "Até 80%"]
        },
        {
          id: 9,
          indice: 2,
          texto: "Qual é a faixa de giro mais econômica do veículo?",
          resposta: 0,
          gabarito: 1,
          valor: 1,
          linkErro: "q3nuEAbq_dw",
          itens: ["1400 RPM", "1600 RPM", "1800 RPM", "2000 RPM"]
        },
        {
          id: 10,
          indice: 3,
          texto: "Qual o consumo em uma descida em terceira marcha?",
          resposta: 0,
          gabarito: 1,
          valor: 0.5,
          linkErro: "-m-mZDLjH7E",
          itens: ["ZERO", "De 2 a 3 Km/L", "De 4 a 6 Km/L", "De 6 a 8 Km/L"]
        },
        {
          id: 11,
          indice: 4,
          texto: "Como parar o veículo e pegar um passageiro?",
          resposta: 0,
          gabarito: 4,
          valor: 1,
          linkErro: "vaiddz5vbPQ",
          itens: ["Frear lentamente até o ponto", "Frear quando chega no ponto", "Desengrenar e frear", "Não acelerar e ajustar parada"]
        }
      ]
    },
    {
      id: 4,
      tempo: 6,
      link: "6LQFQ-voCCY",
      imgProxAula: "Aula5.png",
      perguntas: [
        {
          id: 41,
          ehAdendo: true,
          indice: 0,
          texto: "Percebeu como é simples dirigir de forma econômica? Você tem alguma dúvida?",
          resposta: 0,
          gabarito: 2,
          valor: 0,
          itens: ["Ainda tenho dúvidas", "Não tenho dúvidas"],
          imgErro: "Duvidas.jpg"
        }
      ]
    },
    {
      id: 5,
      tempo: 11,
      link: "MmV6JzukL9A",
      imgProxAula: "Aula6.png",
      perguntas: [
        {
          id: 12,
          indice: 0,
          texto: "Quantos pontos você pode conseguir em cada dia trabalhado?",
          resposta: 0,
          gabarito: 2,
          valor: 0.5,
          linkErro: "WG_mcuD1ywM",
          itens: ["3 PONTOS", "5 PONTOS", "50 PONTOS", "100 PONTOS"]
        },
        {
          id: 13,
          indice: 1,
          texto: "Qual o percentual máximo para se pontuar em GIRO?",
          resposta: 0,
          gabarito: 1,
          valor: 0.5,
          linkErro: "_nd2lyxLIWo",
          itens: ["7%", "17%", "27%", "37%"]
        },
        {
          id: 14,
          indice: 2,
          texto: "Qual o percentual máximo de FREIO e PEDAL para pontuar?",
          resposta: 0,
          gabarito: 3,
          valor: 0.5,
          linkErro: "9aJWt-PKYXs",
          itens: ["7% FREIO e 7% PEDAL", "15% FREIO e 7% PEDAL", "7% FREIO e 15% PEDAL", "15% FREIO e 15% PEDAL"]
        },
        {
          id: 15,
          indice: 3,
          texto: "Além de alcançar a média de Giro, Freio e Pedal, como ganhar mais pontos?",
          resposta: 0,
          gabarito: 4,
          valor: 0.5,
          linkErro: "PYbInM4DDtE",
          itens: ["Batendo a média da linha", "Melhorando sua média da semana", "Sendo o mais econômico do turno", "Todas as respostas anteriores"],
          imgAcerto: "A05P15.jpg",
          msgAcerto: "Segue a tabela de pontuação diária."
        },
        {
          id: 16,
          indice: 4,
          texto: "Quantos pontos você precisa ter por dia para sair da fase bronze e ir para a fase prata?",
          resposta: 0,
          gabarito: 1,
          valor: 0.5,
          linkErro: "xvDJ8IXyN0A",
          itens: ["2 PONTOS", "3 PONTOS", "4 PONTOS", "5 PONTOS"],
          imgAcerto: "A05P16.jpg",
          msgAcerto: "Segue a tabela para mudança de fase:"
        },
        {
          id: 17,
          indice: 5,
          texto: "É possível passar direto da fase BRONZE para OURO se você alcançar a média no primeiro mês?",
          resposta: 0,
          gabarito: 2,
          valor: 0.5,
          linkErro: "NcXfLmXkkvk",
          itens: ["SIM", "NÃO"]
        },
        {
          id: 51,
          indice: 6,
          ehAdendo: true,
          texto: "Você tem alguma dúvida sobre como alcançar ou consultar seus pontos?",
          resposta: 0,
          gabarito: 2,
          valor: 0,
          itens: ["Ainda tenho dúvidas", "Não tenho dúvidas"],
          imgErro: "Duvidas.jpg"
        }
      ]
    },
    {
      id: 6,
      tempo: 19,
      link: "ig86byhh5yk",
      fimTreinamento: true,
      img: "assets/img/Treinamento/FimCurso.jpg",
      titulo: 'Assista nossas considerações finais e depoimentos de Motoristas que já alcançaram grandes resultados.',
      perguntas: []
    }
  ];

  currentVideoIndex = 0;
  currentQuestionIndex = 0;
  hasAnswered = false;
  selectedAnswer: number | null = null;
  isCorrect = false;
  feedbackMessage = '';
  showCompletionScreen = false;
  score = 0;
  totalScore = 0;

  constructor(private sanitizer: DomSanitizer) {}

  get currentQuestion(): Question | undefined {
    return this.videos[this.currentVideoIndex].perguntas[this.currentQuestionIndex];
  }

  get totalQuestions(): number {
    return this.videos[this.currentVideoIndex].perguntas.length;
  }

  get progressPercentage(): number {
    return ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.totalQuestions - 1;
  }

  get isLastVideo(): boolean {
    return this.currentVideoIndex === this.videos.length - 1;
  }

  ngOnInit() {
    // Calculate total possible score
    this.totalScore = this.videos.reduce((total, video) => {
      return total + video.perguntas.reduce((videoTotal, question) => {
        return videoTotal + (question.valor || 0);
      }, 0);
    }, 0);
  }

  selectAnswer(index: number) {
    if (this.hasAnswered) return;

    this.selectedAnswer = index;
    this.hasAnswered = true;
    this.isCorrect = index === this.currentQuestion?.gabarito;

    if (this.isCorrect) {
      this.score += this.currentQuestion?.valor || 0;
      this.feedbackMessage = this.currentQuestion?.msgAcerto || 'Parabéns! Resposta correta!';
    } else {
      this.feedbackMessage = this.currentQuestion?.msgErro || 'Resposta incorreta. Tente novamente!';
    }
  }

  nextQuestion() {
    if (this.isLastQuestion) {
      if (this.isLastVideo) {
        this.showCompletionScreen = true;
      } else {
        this.currentVideoIndex++;
        this.currentQuestionIndex = 0;
      }
    } else {
      this.currentQuestionIndex++;
    }

    this.hasAnswered = false;
    this.selectedAnswer = null;
    this.isCorrect = false;
    this.feedbackMessage = '';
  }

  getAnswerButtonClass(index: number): string {
    if (!this.hasAnswered) {
      return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white';
    }

    if (index === this.currentQuestion?.gabarito) {
      return 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100';
    }

    if (index === this.selectedAnswer) {
      return 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100';
    }

    return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white opacity-50';
  }

  restartQuiz() {
    this.currentVideoIndex = 0;
    this.currentQuestionIndex = 0;
    this.hasAnswered = false;
    this.selectedAnswer = null;
    this.isCorrect = false;
    this.feedbackMessage = '';
    this.showCompletionScreen = false;
    this.score = 0;
  }

  getSafeVideoUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
} 