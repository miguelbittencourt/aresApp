# 🏋️‍♂️ ARES

**Aplicativo de Registro de Exercícios Simplificado**

ARES é um aplicativo mobile que transforma anotações de treino em texto (como as que você envia no WhatsApp) em dados estruturados, permitindo acompanhar histórico, progressão de cargas e organização dos treinos de forma simples e prática.

Ele foi criado para resolver um problema real:

> registrar treinos sem fricção, do jeito que o usuário já escreve.

---

## 🚀 Motivação

Muitas pessoas registram seus treinos de forma informal, usando:

* WhatsApp
* Bloco de notas
* Anotações soltas

Exemplo real:

```
SmartFit
Supino reto 15kg 8 rep com ajuda
Supino inclinado 18kg 4 rep
Tríceps polia 7kg 8 rep
```

O ARES permite colar esse texto no app e automaticamente transformá-lo em dados estruturados que podem ser armazenados, analisados e visualizados.

---

## 🧠 Como funciona

ARES utiliza uma **linguagem de treino simples**, baseada em uma regra:

```
[NOME DO EXERCÍCIO] [PESO][UNIDADE] [REPETIÇÕES] rep [OBSERVAÇÃO OPCIONAL]
```

Exemplo:

```
Supino reto 15kg 8 rep com ajuda
```

É interpretado como:

| Campo      | Valor       |
| ---------- | ----------- |
| Exercício  | Supino reto |
| Peso       | 15          |
| Unidade    | kg          |
| Repetições | 8           |
| Observação | com ajuda   |

---

## 🧩 Arquitetura

```
Mobile App (Expo / React Native)
        ↓
Firebase Auth
        ↓
Cloud Function (Parser)
        ↓
Firestore (Banco de Dados)
        ↑
Mobile App
```

O parser transforma texto em JSON estruturado antes de salvar os dados.

Essa arquitetura permite, no futuro, substituir o parser por uma IA sem alterar o restante do sistema.

---

## 📱 Funcionalidades do MVP

* Login de usuário
* Inserção de treino via texto
* Processamento automático do treino
* Revisão e edição dos exercícios
* Salvamento no histórico
* Visualização de treinos anteriores

---

## 🗂 Estrutura de dados

Cada treino é salvo como:

```json
{
  "gym": "SmartFit",
  "date": "2026-02-03",
  "sets": [
    {
      "exercise": "Supino reto",
      "weight": 15,
      "unit": "kg",
      "reps": 8,
      "notes": "com ajuda"
    }
  ]
}
```

---

## 🛠 Stack

* **Mobile:** Expo + React Native + TypeScript
* **Backend:** Firebase Cloud Functions
* **Banco:** Firestore
* **Autenticação:** Firebase Auth

---

## 🔮 Futuro

O ARES foi projetado para permitir:

* Gráficos de progressão
* Comparação de desempenho
* Importação direta do WhatsApp
* Uso de IA para interpretar qualquer formato de treino

---

## 👤 Autor

Desenvolvido por **Miguel Bittencourt**
Projeto criado para estudo, portfólio e uso pessoal.
