'use client'

import React from 'react'; // 👈 IMPORTANTE!
import { useEffect, useState, useRef } from 'react';


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
  const [now, setNow] = useState(new Date());
  const [agoraTop, setAgoraTop] = useState(null);
  const gridRef = useRef(null);
  const isSmallResolution = useMediaQuery('(max-width: 1379px)');
  const interval = isSmallResolution ? 60 : 30;
  const slotHeight = 24;

  // calcula posição exata da linha "Agora" medindo o DOM (considera gaps/borders)
  useEffect(() => {
    if (!gridRef.current) {
      setAgoraTop(null);
      return;
    }
    const minutosDesdeInicio = (now.getHours() * 60 + now.getMinutes()) - 360;
    if (minutosDesdeInicio < 0 || minutosDesdeInicio > (17 * 60)) {
      setAgoraTop(null);
      return;
    }

    // índice do slot atual (0 = 06:00)
    const slotIndex = Math.floor(minutosDesdeInicio / interval);
    // o array 'horarios' existe abaixo na render; construímos aqui uma pequena versão
    const horariosTmp = [];
    for (let h = 6; h <= 23; h++) {
      horariosTmp.push(`${h.toString().padStart(2, '0')}:00`);
      if (interval === 30 && h < 23) horariosTmp.push(`${h.toString().padStart(2, '0')}:30`);
    }

    const slotTime = horariosTmp[slotIndex];
    const slotEl = gridRef.current.querySelector(`[data-time="${slotTime}"]`);
    if (!slotEl) {
      setAgoraTop(null);
      return;
    }
    const gridRect = gridRef.current.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();
    const offsetInsideSlot = (minutosDesdeInicio % interval) / interval * slotHeight;
    const top = slotRect.top - gridRect.top + offsetInsideSlot;
    setAgoraTop(top);
  }, [now, interval, slotHeight]);

  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
    // Atualiza o horário atual a cada minuto
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
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
          className="w-full"
          style={{
            maxWidth: '100vw',
          }}
        >
          {/* Cabeçalho das salas */}
          <div
            className="grid gap-0.5 border border-gray-300 rounded overflow-visible"
            style={{
              gridTemplateColumns: `60px repeat(${salas.length}, 1fr)`,
              position: 'relative',
            }}
          >
            <div className="sticky top-0 left-0 bg-gray-100 border-r border-gray-300 px-1 py-1 font-semibold text-center z-20 text-xs md:text-sm lg:text-base">
              Horário
            </div>
            {salas.map((sala, index) => (
              <div
                key={index}
                className="sticky top-0 bg-green-100 px-1 py-1 font-semibold text-center text-[10px] border-l border-gray-300 z-10 md:text-xs lg:text-sm"
              >
                {sala}
              </div>
            ))}
          </div>
          {/* Grade de horários + linha do agora */}
          <div
            className="grid gap-0.5 border-x border-b border-gray-300 rounded-b overflow-visible"
            ref={gridRef}
            style={{
              gridTemplateColumns: `60px repeat(${salas.length}, 1fr)`,
              position: 'relative',
              height: `${horarios.length * slotHeight}px`,
            }}
          >
            {/* Linha do horário atual - AGORA POSICIONADA CORRETAMENTE */}
            {agoraTop !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: `${agoraTop}px`,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'green',
                  zIndex: 50,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '-14px',
                    background: 'green',
                    color: 'white',
                    fontSize: '10px',
                    padding: '0 4px',
                    borderRadius: '2px',
                  }}
                >
                  Agora: {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            {horarios.map((horario, index) => (
              <React.Fragment key={`linha-${index}`}>
                {/* Coluna de horário */}
                <div
                  className={`sticky left-0 bg-gray-100 px-1 py-0.5 text-[8px] md:text-xs text-right pr-1 border-r border-gray-300 flex items-center justify-end ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                  data-time={horario}
                   style={{ height: `${slotHeight}px` }}
                >
                  {horario}
                </div>

                {/* Colunas por sala */}
                {salas.map((sala, salaIndex) => {
                  const [slotH, slotM] = horario.split(':').map(Number);
                  const slotStart = slotH * 60 + slotM;
                  const slotEnd = slotStart + interval;
                  const blocos = agendamentos.filter(ag => {
                    if (ag.sala !== sala) return false;
                    const [agH, agM] = ag.inicio.split(':').map(Number);
                    const agStart = agH * 60 + agM;
                    return agStart >= slotStart && agStart < slotEnd;
                  });

                  return (
                    <div
                      key={`${index}-${salaIndex}`}
                      className={`relative border-t border-l border-gray-200 p-0.5 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded`}
                      style={{ height: `${slotHeight}px` }}
                    >
                      {blocos.map((ag, idx) => {
                        const [startH, startM] = ag.inicio.split(':').map(Number);
                        const [endH, endM] = ag.fim.split(':').map(Number);
                        const duracaoMin = (endH * 60 + endM) - (startH * 60 + startM);

                        // Ajuste: calcula quantos "slots" o agendamento ocupa e compensa as bordas/gaps entre eles
                        const slotsSpanned = duracaoMin / interval;
                        const internalBorders = Math.max(0, Math.floor(slotsSpanned) - 1); // 1px por borda interna
                        const altura = Math.round(slotsSpanned * slotHeight + internalBorders * 1);

                        return (
                          <div
                            key={idx}
                            className={`absolute left-0 w-full text-white px-1 py-1 shadow ${ag.cor} flex flex-col justify-between rounded`}
                            style={{
                              top: 0,
                              height: `${altura}px`,
                              zIndex: 10,
                            }}
                          >
                            <div className="text-sm font-semibold truncate leading-tight">{ag.nome}</div>
                            <div className="text-xx text-white/90 italic text-right">{ag.responsavel || 'Instrutor não informado'}</div>
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
    </div>
  );
}
