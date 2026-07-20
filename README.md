MediQueryAI
An AI-powered natural language interface for hospital databases. Ask questions in plain English — get instant patient records, diagnoses, prescriptions, and lab results. No SQL required.

---

## 🔗 Live App
👉 [mediqueryai.netlify.app](https://mediqueryai.netlify.app)


## 💡 Problem Statement
Medical staff in Nigerian hospitals are locked out of their own data. Querying patient records requires SQL expertise that doctors, nurses, and administrators simply don't have. Critical decisions get delayed because the people who need the data can't access it without calling a developer.

## ✅ Solution
MediQuery AI lets any medical staff member query a hospital database by typing plain English questions — no technical knowledge needed.

Example queries:
- *"Show all diabetic patients admitted this month"*
- *"Which drug was prescribed most for malaria?"*
- *"List all critical lab results from last week"*
- *"How many patients were discharged in June?"*

---

## ⚙️ How It Works
1. User types a question in plain English
2. AI model converts the question to SQL
3. SQL runs against the hospital database
4. Results returned as clean, readable tables

---

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React / HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| AI Engine | OpenRouter (GPT-4o) |
| Workflow | n8n |
| Database | MySQL (Aiven Cloud) |
| Hosting | Netlify |


## 🗄️ Database Structure
The hospital database (`mediquery_db`) contains 4 tables:

- **patients** — demographics, admission status
- **diagnoses** — diseases, severity, attending doctor
- **prescriptions** — drugs, dosage, duration
- **lab_results** — test results, normal ranges, status


## 🚀 Features
- Natural language to SQL conversion
- Real-time query execution
- Secure AES-256 encrypted database connections
- Session-based authentication
- Rate limiting for abuse prevention
- Mobile responsive UI
- Markdown-formatted results


## 🎯 Potential Impact
- Removes SQL barrier for non-technical medical staff
- Speeds up clinical decision-making
- Reduces dependence on IT for routine data requests
- Scalable to any hospital database
- Directly addresses healthcare data accessibility 
  gap in Nigeria and Africa

## 👨‍💻 Team
DataMed

Members
NAJIMDEEN ADAM OYEYMI ||
GANIYU AZEEZ OLAYEMI
   — University of Ibadan

## 📸 Screenshots
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/273d94a8-5741-4bec-95cc-f58645ab2994" />



*Built for the DATICAN AI Competition 2026 — 
University of Ibadan*
