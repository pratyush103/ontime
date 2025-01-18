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
Note: This Project Uses pnpm 
```bash
npm install -g pnpm
pnpm install
```

Set up the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Details

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/19372844-475f-4f5a-9675-ea7b7098cd26)

### Login and Register for Professor
Create Professor accounts and an option to register as a HOD to gain higher privileges and functionalities.

![Login and Register](https://github.com/user-attachments/assets/7e68ce82-7cd1-4add-a356-fd5487e0f1d6)
![Login and Register](https://github.com/user-attachments/assets/dfcadac0-3972-4c32-9ab1-411b0b84b67a)

### Professor Dashboard
See all your divisions at a glance.

![Professor Dashboard](https://github.com/user-attachments/assets/8631d778-dc4a-4af9-9b2b-7d44dadae17f)

### Attendance Page
Take attendance of your students for the day.

![Attendance Page](https://github.com/user-attachments/assets/bfc47722-3038-4dee-8a70-c4e872d927b1)

### Divisions Page
See details about your division and summary about their monthly attendance.

![Divisions Page](https://github.com/user-attachments/assets/57764fb7-083e-429e-858f-4251b51ed3dd)

### Student Details
See details about a student and see their monthly attendance report.

![Student Details](https://github.com/user-attachments/assets/c3406fef-1433-4c9e-a916-f05f99c5078a)




