# 🩺 Proposta de Desenvolvimento

### Sistema de Agendamento Médico On-line

**Cliente:** Dr. Dixon - Cardiologista  
**Responsável:** Digital Dog  
**Data:** Novembro de 2025  
**Versão:** 1.0

---

## 🎯 Objetivo

Desenvolver uma **plataforma exclusiva de agendamento médico** para uso profissional do Dr. Dixon, permitindo que pacientes **agendem consultas diretamente pelo site** e que o médico **gerencie sua agenda e informações dos pacientes** em um **painel seguro e intuitivo**.

O sistema será hospedado em uma **VPS própria (Hostinger)**, garantindo **autonomia, desempenho e segurança** dos dados, com total conformidade com a **LGPD** e regulamentações do **CFM**.

---

## 🧩 Escopo do MVP

### **1. Site público (paciente)**

- Página institucional com informações do médico, especialização, endereço e contato.
    
- Catálogo de serviços (consulta cardiológica, avaliação pré-operatória, acompanhamento, exames complementares etc.).
    
- Calendário com horários disponíveis em tempo real.
    
- Agendamento on-line direto pelo site com pré-triagem básica.
    
- Confirmação de consulta por e-mail ou SMS.
    
- Política de cancelamento e reagendamento automático.
    
- Área do paciente para histórico de consultas (opcional no MVP).

### **2. Painel do médico**

- Visualização da agenda diária, semanal e mensal.
    
- Filtros por tipo de atendimento e status da consulta.
    
- Edição de horários, bloqueios e criação de novos agendamentos.
    
- Visualização dos dados do paciente e anotações pré-consulta.
    
- Confirmação automática e lembrete de consultas.
    
- Dashboard básico (consultas confirmadas, canceladas, no-show, taxa de ocupação).
    
- Exportação de relatórios básicos.

### **3. Infraestrutura**

- Hospedagem em **VPS Hostinger** (com SSL, backups e painel de controle).
    
- Banco de dados seguro (PostgreSQL) com criptografia.
    
- Sistema desenvolvido com apoio de **ferramentas de Inteligência Artificial (Cursor, Copilot, Bmad)** para otimizar tempo e qualidade técnica.
    
- Código-fonte versionado e documentado no GitHub.
    
- Conformidade total com **LGPD** e regulamentações do **CFM**.

---

## ⚙️ Fase 2 (pós-MVP)

> A ser planejada após a entrega do MVP, conforme resultados e feedback do cliente.

- Chat com IA no site para dúvidas e agendamentos
    
- Follow-ups de pacientes (exames, retorno, campanhas preventivas).
    
- Pagamentos on-line e pré-autorização de cartão.
    
- Relatórios de desempenho e taxa de comparecimento.
    
- Integração com Google Calendar e botão "Agendar On-line" no Google.
    
- Lembretes automáticos via WhatsApp e e-mail.
    
- Integração com prontuário eletrônico (se necessário).
    
- Telemedicina (consultas remotas).

---

## 📆 Cronograma Estimado

| Etapa                                | Descrição                                               | Duração   |
| ------------------------------------ | ------------------------------------------------------- | --------- |
| **1. Descoberta & UX**               | Levantamento de requisitos, fluxos, protótipo navegável | 1 semana  |
| **2. Desenvolvimento**               | Criação do site, painel e API de agendamento            | 3 semanas |
| **3. Testes & Ajustes**              | QA, refinamentos e deploy final na VPS                  | 1 semana  |
| **4. Treinamento & Suporte Inicial** | Entrega documentada + onboarding do médico              | 1 semana  |

**Prazo total estimado:** 6 semanas

---

## 💰 Investimento

| Entrega                               | Valor (R$)                   |
| ------------------------------------- | ---------------------------- |
| Desenvolvimento completo do MVP + PÓS | **R$ 9.800,00**              |
| Hospedagem VPS Hostinger              | **R$ 120,00/mês** (estimado) |
| Domínio .com.br + SSL                 | **R$ 60,00/ano**             |

### Condições de pagamento:

- **30%** na assinatura da proposta (início do projeto)
    
- **40%** após apresentação do protótipo funcional
    
- **30%** na entrega final + suporte de 30 dias
    
> Parcelamento em 3x sem juros no cartão, e desconto no pix.

---

## 📊 Retorno esperado

- Redução de **tempo gasto com agendamentos manuais** (estimativa: 5-10 horas/semana).
    
- Diminuição de **faltas (no-show)** por lembretes automáticos (redução estimada de 20-30%).
    
- **Melhor experiência digital** para pacientes, aumentando satisfação e fidelização.
    
- Imagem profissional e moderna do consultório.
    
- Base pronta para evoluções futuras (teleconsulta, pagamentos, campanhas).
    
- **Aumento de agendamentos** através da disponibilidade 24/7 online.

---

## 🔒 Segurança & Conformidade

- Hospedagem em VPS privada e segura (Hostinger).
    
- Certificado SSL e criptografia de dados em trânsito e em repouso.
    
- Conformidade com a **LGPD**, incluindo consentimento explícito do paciente e política de privacidade.
    
- Conformidade com regulamentações do **CFM** para sistemas médicos.
    
- Logs de acesso e registro de operações críticas.
    
- Backup automático diário dos dados.
    
- Política de retenção de dados conforme legislação.

---

## 📞 Suporte e Manutenção

- **Suporte técnico incluso por 3 meses** após entrega.
    
- Atualizações corretivas e melhorias de performance.
    
- Planos opcionais de manutenção contínua (a partir de R$ 250/mês).

---

## 🧠 Tecnologias Previstas

- **Front-end:** React, TailwindCSS
    
- **Back-end:** Node.js / NestJS ou Express
    
- **Banco de dados:** PostgreSQL
    
- **Infraestrutura:** VPS Hostinger (Linux + Nginx)
    
- **Integrações futuras:** Twilio/Zenvia (SMS/WhatsApp), Google Calendar, Resend/SendGrid (e-mail)

---

## ✍️ Termos e Condições

- O código e o design entregues serão de **uso exclusivo do cliente**, sem revenda a terceiros.
    
- O prazo de entrega poderá ser ajustado mediante escopo adicional.
    
- Após o MVP, melhorias e novos módulos serão orçados separadamente.
    
- A manutenção da VPS, domínio e mensagens (SMS/WhatsApp) é de responsabilidade do cliente.
    
- O cliente é responsável por manter backups adicionais se necessário.

---

## 🚀 Próximos Passos

1. Aprovação desta proposta e assinatura digital.
    
2. Pagamento inicial (30%) e kickoff do projeto.
    
3. Entrega do protótipo UX para validação.
    
4. Desenvolvimento completo e deploy em produção.

---

**Assinatura do Proponente**

---

**Digital Dog**  
[E-mail / telefone / site]  
[CNPJ]

**Assinatura do Cliente**

---

**Dr. Dixon**  
[Clínica / Endereço / Telefone]

---

