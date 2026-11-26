# Patient Case Taking Software

An independently written starter project for recording and reviewing patient case information. It is a learning/demo application, not a certified electronic health record (EHR) system.

## Features
- Register a patient with basic demographic and contact details
- Record a clinical case note (chief complaint, history, observations, assessment, and plan)
- View saved patient records
- REST API built with Express and TypeScript
- React + Vite frontend
- PostgreSQL data model using Prisma

## Project structure
```text
patient-case-taking-software/
├── apps/
│   ├── backend/       # Express REST API
│   └── frontend/      # React user interface
├── packages/
│   └── shared/        # Shared TypeScript types
├── docs/              # Project documentation and UML
├── prisma/            # Database schema
├── .env.example
├── package.json
└── README.md
```

## Requirements
- Node.js 20+
- npm 10+
- PostgreSQL 15+ (for database-backed mode)

## Setup
1. Copy `.env.example` to `.env` and update `DATABASE_URL`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the Prisma client and create the database tables:
   ```bash
   npm run db:generate
   npm run db:push
   ```
4. Start the API and frontend in separate terminals:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```
5. Open the frontend URL shown by Vite (normally `http://localhost:5173`).

The API runs on `http://localhost:4000` by default.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/patients` | List patients |
| POST | `/api/patients` | Register a patient |
| GET | `/api/patients/:id/cases` | List a patient's case notes |
| POST | `/api/patients/:id/cases` | Add a case note |

## Important privacy and safety notes
- Use fictional data only while developing or demonstrating this project.
- Do not enter real patient information into an unreviewed student project.
- This starter does not include authentication, authorization, audit logging, encryption-at-rest configuration, backups, or regulatory certification.
- Before any real clinical use, obtain qualified clinical, security, privacy, and legal review and implement appropriate safeguards for the applicable jurisdiction.
- The clinical note fields are for documentation only; the software does not diagnose or recommend treatment.

## License
This original starter is provided for educational use. Add an appropriate license file before distributing it publicly.
