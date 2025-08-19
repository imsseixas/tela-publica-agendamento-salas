'use client'

import React from 'react'; // 👈 IMPORTANTE!
import { useEffect, useState } from 'react';


const formatDate = (date) => {
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = date.toLocaleDateString('pt-BR', { month: 'long' });
  const ano = date.getFullYear();
  const semana = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  return `${dia} de ${mes} de ${ano} (${semana})`;
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
};

// DADOS DE EXEMPLO
const agendamentos = [
  { sala: 'Sala de treinamento 01', inicio: '07:00', fim: '08:30', nome: 'SERVIÇO DE CIRURGIA GERAL [In-person]', cor: 'bg-blue-400', responsavel: '' },
  { sala: 'Sala de treinamento 01', inicio: '08:30', fim: '10:00', nome: 'TREINAMENTO EM ESPIROMETRIA [In-person]', cor: 'bg-blue-400', responsavel: '' },
  { sala: 'Sala de treinamento 01', inicio: '10:00', fim: '12:00', nome: 'DISCUSSÃO DE CASOS [In-person]', cor: 'bg-blue-400', responsavel: ''},
  { sala: 'Sala de treinamento 01', inicio: '13:30', fim: '15:00', nome: 'SESSÃO DE ARRITMO', cor: 'bg-blue-400', responsavel: '' },
  { sala: 'Sala de treinamento 01', inicio: '15:00', fim: '17:00', nome: 'Anna Karine Cruz Souza', cor: 'bg-blue-400', responsavel: 'Anna Karine Cruz Souza' },
  { sala: 'Sala de treinamento 01', inicio: '18:00', fim: '22:00', nome: 'AULA FACULDADE SANTA CASA', cor: 'bg-blue-400', responsavel: '' },
  { sala: 'Sala de treinamento 02', inicio: '06:30', fim: '08:30', nome: 'Entrevista colaborador/ Wildson Meireles', cor: 'bg-pink-400', responsavel: '' },
  { sala: 'Sala de treinamento 02', inicio: '08:30', fim: '10:30', nome: 'Entrevista colaborador/ Wildson Meireles', cor: 'bg-pink-400', responsavel: '' },
  { sala: 'Sala de treinamento 02', inicio: '18:00', fim: '22:00', nome: 'AULA FACULDADE SANTA CASA', cor: 'bg-pink-400', responsavel: '' },
  { sala: 'Sala de treinamento 03', inicio: '06:30', fim: '09:00', nome: 'SERVIÇO DE ORTOPEDIA [In-person]', cor: 'bg-green-400', responsavel: '' },
  { sala: 'Sala de treinamento 03', inicio: '09:00', fim: '11:00', nome: 'SESSÃO DE CLINCA MÉDICA_INTERNOS', cor: 'bg-green-400', responsavel: 'Dr. Mateus' },
  { sala: 'Sala de treinamento 03', inicio: '14:00', fim: '16:00', nome: 'SESSÃO MEDICINA INTENSIVA/AULA CLINICA RESIDÊNCIA', cor: 'bg-green-400', responsavel: 'Dr. Reinaldo' },
  { sala: 'Sala de treinamento 03', inicio: '18:00', fim: '22:00', nome: 'AULA FACULDADE SANTA CASA', cor: 'bg-green-400', responsavel: '' },
  { sala: 'Sala de treinamento 04', inicio: '06:30', fim: '07:30', nome: 'SERVIÇO DE ANESTESTESIOLOGIA', cor: 'bg-gray-400', responsavel: '' },
  { sala: 'Sala de treinamento 04', inicio: '09:00', fim: '11:00', nome: 'Apresentação Faturamento', cor: 'bg-gray-400', responsavel: 'Barbara Rosentina' },
  { sala: 'Sala de treinamento 04', inicio: '14:00', fim: '17:00', nome: 'Camila Ferreira Houat', cor: 'bg-gray-400', responsavel: 'Camila Ferreira Houat' },
  { sala: 'Sala de treinamento 04', inicio: '18:00', fim: '22:00', nome: 'AULA FACULDADE SANTA CASA', cor: 'bg-gray-400', responsavel: '' },
  { sala: 'SENEP', inicio: '07:00', fim: '10:00', nome: 'SERVIÇO DE CIRURGIA GERAL [In-person]', cor: 'bg-cyan-400', responsavel: '' },
  { sala: 'SENEP', inicio: '14:00', fim: '17:00', nome: 'Luciana Magnavita Rocha', cor: 'bg-cyan-400', responsavel: 'Luciana Magnavita Rocha' },
];

export default function Home() {
  const [currentDate, setCurrentDate] = useState('');
  const isSmallResolution = useMediaQuery('(max-width: 1379px)');
  const interval = isSmallResolution ? 60 : 30;
  const slotHeight = 24;

  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  // Exemplo: adicione/remova salas aqui sem quebrar
  const salas = [
    'Sala de treinamento 01',
    'Sala de treinamento 02',
    'Sala de treinamento 03',
    'Sala de treinamento 04',
    'SENEP',
    'Auditório Jorge Filgueira'
  ];
  const horarios = [];
  for (let h = 6; h <= 23; h++) {
    horarios.push(`${h.toString().padStart(2, '0')}:00`);
    if (interval === 30 && h < 23) {
      horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  // QR Code responsivo
  const qrSize = isSmallResolution ? 80 : 128;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col max-w-full overflow-x-auto">
      <header className="flex items-center px-4 py-2 bg-white border-b border-green-200 shadow-sm flex-shrink-0 md:px-6 md:py-3 lg:px-8 lg:py-4">
        {/* Logo à esquerda */}
        <div className="flex items-center">
          <img
            src="/logo-santa-casa.svg"
            alt="Logo"
            className="h-16 w-auto mr-4"
          />
        </div>
        {/* Título centralizado */}
        <div className="flex-1 flex justify-center">
          <h1
            className="text-xl font-bold md:text-2xl lg:text-3xl text-center"
            style={{ color: '#73A94F' }}
          >
            PROGRAMAÇÃO DIÁRIA
          </h1>
        </div>
            {/* Data à direita */}
      <div>
        <p
          className="text-2xl font-medium md:text-3xl lg:text-2xl"
          style={{ color: '#73A94F' }}
        >
          {currentDate}
        </p>
      </div>
      </header>

      <div className="p-2 md:p-4 flex-grow overflow-auto">
        <div
          className="w-full grid gap-0.5 border border-gray-300 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `60px repeat(${salas.length}, 1fr)`,
            maxWidth: '100vw'
          }}
        >
          {/* Cabeçalho das salas */}
          <div className="sticky top-0 left-0 bg-gray-100 border-r border-gray-300 px-1 py-1 font-semibold text-center z-20 text-xs md:text-sm lg:text-base">Horário</div>
          {salas.map((sala, index) => (
            <div key={index} className="sticky top-0 bg-green-100 px-1 py-1 font-semibold text-center text-[10px] border-l border-gray-300 z-10 md:text-xs lg:text-sm">
              {sala}
            </div>
          ))}

          {/* Grade de horários */}
          {horarios.map((horario, index) => (
            <React.Fragment key={`linha-${index}`}>
              {/* Coluna de horário */}
              <div 
                className={`sticky left-0 bg-gray-100 px-1 py-0.5 text-[8px] md:text-xs text-right pr-1 border-r border-gray-300 flex items-center justify-end ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                style={{ height: `${slotHeight}px` }}
              >
                {horario}
              </div>

              {/* Colunas por sala */}
              {salas.map((sala, salaIndex) => {
                // Calcula o início e fim do slot atual
                const [slotH, slotM] = horario.split(':').map(Number);
                const slotStart = slotH * 60 + slotM;
                const slotEnd = slotStart + interval;

                // Busca agendamentos que começam dentro do slot
                const blocos = agendamentos.filter(ag => {
                  if (ag.sala !== sala) return false;
                  const [agH, agM] = ag.inicio.split(':').map(Number);
                  const agStart = agH * 60 + agM;
                  return agStart >= slotStart && agStart < slotEnd;
                });

                return (
                  <div 
                    key={`${index}-${salaIndex}`}
                    className={`relative border-t border-l border-gray-200 p-0.5 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ height: `${slotHeight}px` }}
                  >
                    {blocos.map((ag, idx) => {
                      const [startH, startM] = ag.inicio.split(':').map(Number);
                      const [endH, endM] = ag.fim.split(':').map(Number);
                      const duracaoMin = (endH * 60 + endM) - (startH * 60 + startM);
                      const altura = (duracaoMin / interval) * slotHeight;

                      return (
                        <div
                          key={idx}
                          className={`absolute left-0 w-full rounded-md text-white px-1 py-1 shadow ${ag.cor} flex flex-col justify-between`}
                          style={{
                            top: 0,
                            height: `${altura}px`,
                            zIndex: 10,
                          }}
                        >
                          <div className="text-sm font-semibold truncate leading-tight">{ag.nome}</div>
                          <div className="text-xs text-white/90 italic text-right">{ag.responsavel || 'Instrutor não informado'}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
