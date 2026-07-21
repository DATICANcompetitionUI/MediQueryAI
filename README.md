# MediQuery AI 🏥

An AI-powered natural language interface for hospital databases. Ask questions in plain English — get instant patient records, diagnoses, prescriptions, and lab results. No SQL required.

---

## 🔗 Live App
👉 [mediqueryai.netlify.app](https://mediqueryai.netlify.app)

## 🔐 Demo Access
Use the credentials below to explore the app:

- **Email:** adamnajimdeeen@gmail.com
- **Password:** MediQuery
- 
- **Registration Code:** INV-2026-CLIENT01

> Create a new account using the registration code above, or use the demo credentials to log in directly.

---

## 💡 Problem Statement
Medical staff in Nigerian hospitals are locked out of their own data. Querying patient records requires SQL expertise that doctors, nurses, and administrators simply don't have. Critical decisions get delayed because the people who need the data can't access it without calling a developer.

This is a widespread problem across Africa — not a lack of data, but a lack of access to it.

---

## ✅ Solution
MediQuery AI lets any medical staff member query a hospital database by typing plain English questions — no technical knowledge needed.

**Example queries:**
- *"Show all diabetic patients admitted this month"*
- *"Which drug was prescribed most for malaria?"*
- *"List all critical lab results in the database"*
- *"Show all patients diagnosed with Hypertension"*
- *"Which doctor has seen the most patients?"*
- *"Show all admitted male patients and their diagnoses"*

---

## ⚙️ How It Works

```
User types a question in plain English
        ↓
AI model converts the question to SQL
        ↓
SQL runs against the hospital database
        ↓
Results returned as clean, readable tables
```

1. Medical staff type their question naturally — no SQL, no training required
2. The AI engine (GPT-4o via OpenRouter) intelligently translates it to a precise SQL query
3. The query runs securely against the hospital MySQL database
4. Results are returned instantly in a clean, readable format

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (React) |
| Backend Workflow | n8n (hosted on Railway) |
| AI Engine | OpenRouter — GPT-4o |
| Database | MySQL — Aiven Cloud |
| Hosting | Netlify |
| Security | AES-256 encrypted database connections, session-based auth, rate limiting |

---

## 🗄️ Database Structure

The hospital database (`mediquery_db`) contains 4 tables:

| Table | Description |
|---|---|
| `patients` | Demographics, blood group, admission status |
| `diagnoses` | Disease, severity, attending doctor, date |
| `prescriptions` | Drug name, dosage, frequency, duration |
| `lab_results` | Test name, result, normal range, critical status |

---

## 🚀 Features

- ✅ Natural language to SQL conversion
- ✅ Real-time query execution
- ✅ Secure AES-256 encrypted database connections
- ✅ Session-based user authentication
- ✅ Invite-code protected registration
- ✅ Rate limiting to prevent abuse
- ✅ Mobile responsive UI
- ✅ Results formatted as readable Markdown tables
- ✅ Multi-table JOIN queries handled automatically

---

## 🎯 Potential Impact

- Removes the SQL barrier for non-technical medical staff
- Speeds up clinical decision-making with instant data access
- Reduces dependence on IT personnel for routine data requests
- Scalable to any hospital database — MySQL, PostgreSQL, or MSSQL
- Directly addresses the healthcare data accessibility gap in Nigeria and across Africa
- Low-cost deployment makes it viable for underfunded public hospitals

---

## 👨‍💻 Team — DataMed

| Name | Role |
|---|---|
| Najimdeen Adam Oyeyemi | Lead Developer — AI, Backend, Workflow |
| Ganiyu Azeez Olayemi | Frontend & Testing |

**Institution:** University of Ibadan

---

## 📸 Screenshots

### Login Page
<img width="1366" height="768" alt="MediQuery AI Login" src="https://github.com/user-attachments/assets/13019c80-317c-4888-b1da-2aa7f0fe8b2f" />

### Chat Interface
<img width="1366" height="768" alt="Chat Interface" src="https://github.com/user-attachments/assets/273d94a8-5741-4bec-95cc-f58645ab2994" />

---

*Built for the DATICAN AI Competition 2026 — University of Ibadan*



*Built for the DATICAN AI Competition 2026 — 
University of Ibadan*
