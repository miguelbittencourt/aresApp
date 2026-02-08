# ⚔️ A.R.E.S — Aplicativo de Registro de Exercícios Simplificado

Aplicativo mobile para registro e acompanhamento de treinos de forma prática e estruturada.  
Desenvolvido em **Expo + React Native + TypeScript**, com **navegação baseada em arquivos (Expo Router)** e back-end usando **Firebase Auth + Firestore**.

---

## 📌 Sobre

ARES (Application for Recording Exercise Sessions) foi criado para solucionar um problema real:  
📍 permite registrar treinos tanto da forma que você já escreve em textos (como no WhatsApp), transformando isso em dados estruturados, quanto por um formulário onde você pode inserir os exercícios manualmente.

O objetivo é oferecer um app simples para:
- registrar treinos rapidamente;
- organizar histórico;
- acompanhar evolução de cargas;
- editar e revisar treinos gravados.

---

## 🚀 Funcionalidades

- 🔐 Autenticação de usuário (cadastro/login) com **Firebase Auth**
- 🏋️‍♂️ Formulário de treino com validação robusta (usando **Zod + React Hook Form**)
- 📅 Histórico de treinos
- 💾 Sync com banco Firestore
- 📱 Navegação com tabs intuitivas

---

## 🧱 Arquitetura

```

Mobile App (Expo / React Native)
↓
Firebase Auth
↓
Firestore Database
↑
Mobile App interfaces

````

O parser de treino transforma texto em JSON antes de gravar no banco, garantindo estrutura e consistência.

---

## 🧰 Tech Stack

### Frontend
- 📱 **React Native + Expo** (SDK 54)
- 🗂 **Expo Router** (file-based routing)
- ⚛️ **React Hook Form + Zod** (validação e forms)
- ✨ **TypeScript**

### Backend
- 🔐 **Firebase Authentication**
- 📄 **Firestore Database**

---

## 🧪 Pré-Requisitos

Antes de rodar o projeto, certifique-se de ter:

- Node.js (versão 18+ recomendada)
- npm ou yarn
- Expo CLI (@latest)
- Conta Firebase configurada

---

## 🛠️ Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/miguelbittencourt/aresApp.git
cd aresApp
````

2. Instale dependências:

```bash
npm install
```

ou

```bash
yarn install
```

3. Configure a Firebase:

* Crie um projeto no console do Firebase
* Copie as credenciais
* Adicione no arquivo de configuração (ex: `config/firebase.ts`)

4. Rode o app:

```bash
npm start
```

ou

```bash
yarn start
```

Teste no seu dispositivo com **Expo Go** (Android/iOS).

> Você **não precisa necessariamente do Android Studio / Xcode** para rodar no celular, apenas do app Expo Go. ([TabNews][2])

---

## 📂 Estrutura do Projeto

```
├── app/                # Rotas e telas
├── components/         # Componentes reutilizáveis
├── contexts/           # Providers (Auth..)
├── schemas/            # Schemas Zod para validação
├── services/           # Serviços de API/Firebase
├── constants/          # Tema, estilos e configurações
├── utils/              # Funções utilitárias
├── types/              # Tipos TypeScript compartilhados
├── assets/             # Imagens e fontes
├── config/             # Configuração Firebase
```

---

## 🧠 Padrões e Qualidade

Este projeto segue:

✔ Validação consistente com **Zod**
✔ Form handling com **React Hook Form**
✔ Tipagem forte com TypeScript
✔ Navegação baseada em arquivos com Expo Router ([Expo Documentation][1])

---

## 📈 Melhorias Futuras

* 📝 Edição de treinos salvos
* 📊 Gráficos de progressão por exercícios
* ↔️ Conversão automática de texto de treino para objetos estruturados
* 🧠 Integração com IA para parse de texto mais flexível
* 📤 Compartilhamento de treinos
* 💾 Salvar rotinas de treino para facilitar registros futuros
* 🌙 Temas claro/escuro
* 🔔 Notificações de treino

---

## 🦸‍♂️ Autor

**Miguel Bittencourt**
Projeto criado para estudos, portfólio e uso pessoal. ([GitHub][2])

---

[1]: https://docs.expo.dev/develop/file-based-routing/?utm_source=chatgpt.com "Navigation in Expo and React Native apps - Expo Documentation"
[2]: https://github.com/miguelbittencourt/aresApp "GitHub - miguelbittencourt/aresApp: Aplicativo de Registro de Exercícios Simplificado (A.R.E.S)"

