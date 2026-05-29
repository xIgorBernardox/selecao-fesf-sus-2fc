# 🏥 Sistema de Cadastro de Pacientes — FESF-SUS

Aplicação web fullstack para cadastro e gestão de pacientes, desenvolvida com **FastAPI** no backend e **Next.js + React** no frontend, containerizada com **Docker**.

---

## 🚀 Tecnologias

**Backend**
- Python 3.14.5
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

**Frontend**
- Next.js 16.2.6
- React 19.2.4
- TypeScript
- Tailwind CSS

**Infraestrutura**
- Docker
- Docker Compose

---

## ✅ Funcionalidades

- Cadastrar paciente (nome completo, CPF, data de nascimento, telefone)
- Listar todos os pacientes cadastrados
- Editar dados de um paciente com confirmação de alteração
- Excluir paciente com confirmação via modal
- Validação de CPF (formato e dígitos verificadores)
- Validação de data de nascimento (data real, não permite datas futuras)
- Máscaras automáticas nos campos de CPF, telefone e data
- Verificação de CPF duplicado

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e em execução

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/xigorbernardox/selecao-fesf-sus.git
cd selecao-fesf-sus
```

2. Suba os containers com um único comando:

```bash
docker-compose up --build
```

3. Acesse no navegador:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:8000 |
| Documentação da API | http://localhost:8000/docs |

---

## 📁 Estrutura do projeto

```
selecao-fesf-sus/
├── backend/
│   ├── main.py           # Rotas da API (CRUD completo)
│   ├── models.py         # Modelo do banco de dados
│   ├── database.py       # Configuração do SQLite
│   ├── requirements.txt  # Dependências Python
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Interface principal
│   │   └── globals.css   # Estilos globais
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pacientes` | Lista todos os pacientes |
| POST | `/pacientes` | Cadastra novo paciente |
| PUT | `/pacientes/{id}` | Atualiza dados de um paciente |
| DELETE | `/pacientes/{id}` | Remove um paciente |

---

## 👨‍💻 Autor

**Igor Bernardo Brito Oliveira**
Tecnólogo em Análise e Desenvolvimento de Sistemas — Estácio da Bahia

- GitHub: [@xigorbernardox](https://github.com/xigorbernardox)
- LinkedIn: [igorbernardo](https://www.linkedin.com/in/igor-bernardo-3828301b7/)
- E-mail: igorbernardo.dev@gmail.com