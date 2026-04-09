# ValueHomes India

ValueHomes India is a lightweight full-stack Java 21 web application for improving the value of Indian middle-class residential properties.

## Project Structure

- `backend/src/`: Java backend source code, routing, services, and persistence
- `backend/data/`: local database files and schema reference
- `frontend/public/`: frontend CSS and JavaScript assets
- `out/`: compiled classes

## Features

- Admin tools to curate property improvement recommendations and manage property listings
- User tools to browse upgrade ideas and submit property details for personalized recommendations
- A local file-backed database with seeded data so the app runs without extra dependencies

## Stack

- Java 21
- Built-in `HttpServer` backend
- HTML, CSS, and vanilla JavaScript frontend
- CSV-backed local persistence in `backend/data/`

## Run

```powershell
New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out (Get-ChildItem -Recurse -Filter *.java backend\\src | ForEach-Object { $_.FullName })
java -cp out com.valuehomes.MainApp
```

Open `http://localhost:8080`.
