This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Description

The Attendance Management System is a web application designed to help educational institutions manage attendance records for students and professors. The system provides functionalities for professors to mark attendance, view attendance reports, and manage student records. It also includes authentication and authorization features to ensure secure access to the system.

### Key Features

- **Authentication**: Professors can log in to the system using their credentials.
- **Student Management**: Professors can add, view, and delete student records.
- **Attendance Management**: Professors can mark attendance for students, view attendance records, and generate attendance reports.
- **Division Management**: Professors can view and manage divisions, including the students and professors assigned to each division.
- **Dashboard**: Professors can view a summary of their divisions, including the number of students and attendance status.



## Technology Used

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **React**: A JavaScript library for building user interfaces.
- **Prisma**: An ORM (Object-Relational Mapping) tool for database management.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **JWT (JSON Web Tokens)**: A standard for creating access tokens that can be used for authentication.
- **bcrypt**: A library for hashing passwords to securely store them in the database.
- **SQLite**: A lightweight database engine used for local development.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/your-username/attendance-management-system.git
cd attendance-management-system
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Set up the database:

```bash
npx prisma migrate dev --name init
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

