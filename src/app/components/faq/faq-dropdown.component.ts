// faq-dropdown.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideArrowDown } from '@ng-icons/lucide';

interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  isHtml?: boolean;
}

interface FaqCategory {
  id: number;
  title: string;
  questions: FaqQuestion[];
}

@Component({
  selector: 'app-faq-dropdown',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideArrowUp, lucideArrowDown })],
  templateUrl: './faq-dropdown.component.html',
  styleUrls: ['./faq-dropdown.component.css'] // Alterado de scss para css
})
export class FaqDropdownComponent {
  openCategory: number | null = null;
  openQuestion: string | null = null;

  // Dados organizados por categoria
  faqData: FaqCategory[] = [
    {
      id: 1,
      title: "Certificações e Metas",
      questions: [
        {
          id: "q1",
          question: "Como faço para conquistar o certificado bronze/prata/ouro?",
          answer: "Você precisa fechar 2 meses na condição \"superior\" (atingindo todas as metas de giro, freio e pedal). Cada certificado avança uma fase (bronze → prata → ouro)."
        },
        {
          id: "q2",
          question: "Por que não avanço de fase mesmo atingindo as metas?",
          answer: "O programa exige regularidade. Se seu desempenho oscilar muito, você permanece na mesma fase."
        },
        {
          id: "q3",
          question: "Quais são as metas específicas para cada certificado?",
          answer: `<ul class="list-disc pl-5 space-y-1">
            <li>Bronze: 2 pontos (mínimo em giro, freio e pedal).</li>
            <li>Prata: 3 pontos (inclui direção econômica constante).</li>
            <li>Ouro: 4 pontos (excelência em todas as métricas + baixo consumo de combustível).</li>
          </ul>`,
          isHtml: true
        }
      ]
    },
    {
      id: 2,
      title: "Técnicas de Direção",
      questions: [
        {
          id: "q4",
          question: "Como melhorar minha pontuação em freio e pedal?",
          answer: `<div>
            <p><strong>Freio:</strong> Use redução de marcha, freio motor e antecipe paradas (leia a via para aproveitar a inércia).</p>
            <p><strong>Pedal:</strong> Mantenha aceleração suave e <em>nunca</em> compense baixa rotação com aceleração brusca.</p>
          </div>`,
          isHtml: true
        },
        {
          id: "q5",
          question: "Por que devo trocar marchas em 1600 rpm?",
          answer: "Essa faixa mantém o motor na \"zona verde\" do tacômetro, equilibrando desempenho e economia."
        },
        {
          id: "q6",
          question: "O que é \"leitura da via\" e como fazê-la?",
          answer: "É antecipar obstáculos (semáforos, curvas) para reduzir frenagens e acelerações desnecessárias. Exemplo: ao ver um sinal fechando, tire o pé do acelerador e deixe o veículo rodar por inércia."
        }
      ]
    },
    {
      id: 3,
      title: "Aplicativo e Treinamentos",
      questions: [
        {
          id: "q7",
          question: "Não consigo instalar o app. O que fazer?",
          answer: "Se seu celular é antigo, instale em um dispositivo de familiar ou solicite suporte ao instrutor. O app é leve e funciona até em modelos básicos."
        },
        {
          id: "q8",
          question: "Perdi o treinamento presencial. Posso repor?",
          answer: "Sim! Faça o treinamento online (disponível no app) e marque um acompanhamento prático com um instrutor ace copilot."
        },
        {
          id: "q9",
          question: "Como acompanhar meu desempenho no aplicativo?",
          answer: "Acesse a seção \"pontuação ACE\" no app. Lá você vê suas pontuações, metas e dicas personalizadas."
        }
      ]
    },
    {
      id: 4,
      title: "Ace Game e Recompensas",
      questions: [
        {
          id: "q10",
          question: "Como ganhar a mochila Ace Copilot?",
          answer: "Complete todas as tarefas do Ace Game (incluindo as bônus) e fique entre os top do ranking mensal."
        },
        {
          id: "q11",
          question: "O que são \"tarefas bônus\" no Ace Game?",
          answer: "São desafios extras (ex.: \"refazer o treinamento online\") que dão pontos adicionais no ranking."
        }
      ]
    },
    {
      id: 5,
      title: "Problemas Frequentes",
      questions: [
        {
          id: "q12",
          question: "Meu veículo está \"fraco\" e atrapalha meu desempenho. O que fazer?",
          answer: "Reporte ao inspetor para verificação mecânica. Enquanto isso, ajuste sua condução (ex.: troque marchas mais cedo)."
        },
        {
          id: "q13",
          question: "Não tenho tempo para acessar o app. Vale a pena?",
          answer: "Sim! Basta 5 minutos por dia para ver seu feedback. Quem usa o app regularmente tem 50% mais chances de evoluir no programa."
        }
      ]
    }
  ];

  // Função para alternar a categoria aberta
  toggleCategory(categoryId: number): void {
    if (this.openCategory === categoryId) {
      this.openCategory = null;
      this.openQuestion = null; // Fecha qualquer pergunta aberta quando fechamos a categoria
    } else {
      this.openCategory = categoryId;
      this.openQuestion = null; // Reseta perguntas abertas ao mudar de categoria
    }
  }

  // Função para alternar a pergunta aberta
  toggleQuestion(questionId: string): void {
    this.openQuestion = this.openQuestion === questionId ? null : questionId;
  }
}