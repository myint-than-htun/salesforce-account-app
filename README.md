# Salesforce Account Integration App

A full-stack application that integrates **Salesforce** and **Google Sheets** to authenticate Salesforce users, manage Salesforce Account records, and synchronize account information with a Google Spreadsheet.

## 🚀 Features

* 🔐 **Salesforce OAuth Authentication**
* ➕ **Create Salesforce Accounts**
* 📋 **Retrieve Salesforce Accounts**
* 📊 **Record Salesforce Account data in Google Sheets**
* 🔄 **Salesforce REST API Integration**
* 🔗 **Google Sheets API Integration**
* 🌐 Full-stack React + Node.js architecture

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │   React Client   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js / Express│
                    │     Backend      │
                    └───────┬───┬──────┘
                            │   │
               ┌────────────┘   └─────────────┐
               ▼                              ▼
      ┌─────────────────┐            ┌─────────────────┐
      │    Salesforce   │            │  Google Sheets  │
      │     REST API    │            │      API        │
      └─────────────────┘            └─────────────────┘
```

## 🔑 Salesforce Authentication

The application uses **Salesforce OAuth 2.0** to authenticate users and obtain the required authorization to access Salesforce data.

Authentication flow:

```text
User
 │
 ▼
React Application
 │
 ▼
Backend
 │
 ▼
Salesforce OAuth
 │
 ▼
Authorization
 │
 ▼
Access Token
 │
 ▼
Salesforce REST API
```

## 📋 Salesforce Account Management

### Create Account

Users can create a Salesforce Account from the application.

Supported fields include:

* Account Name
* Phone
* Website
* Email

### Get Accounts

The application retrieves Salesforce Account records through the Salesforce REST API and displays them in the frontend.

Example:

```text
Account Name     Phone          Website          Email
-------------------------------------------------------------
ABC Company      +959xxxxxxx    abc.com          info@abc.com
XYZ Company      +959xxxxxxx    xyz.com          contact@xyz.com
```

## 📊 Google Sheets Integration

Account information can also be recorded in a Google Spreadsheet.

Example spreadsheet:

| Account Name | Phone       | Website | Email                                     |
| ------------ | ----------- | ------- | ----------------------------------------- |
| ABC Company  | +959xxxxxxx | abc.com | [info@abc.com](mailto:info@abc.com)       |
| XYZ Company  | +959xxxxxxx | xyz.com | [contact@xyz.com](mailto:contact@xyz.com) |

This demonstrates integration between **Salesforce, a Node.js backend, and Google Sheets**.

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST API
* OAuth 2.0

### APIs & Services

* Salesforce REST API
* Salesforce OAuth
* Google Sheets API
* Google OAuth

## 📡 Main API Operations

### Salesforce Authentication

```http
GET /auth/salesforce
```

Starts the Salesforce OAuth authentication flow.

### Get Salesforce Accounts

```http
GET /api/accounts
```

Retrieves Account records from Salesforce.

### Create Salesforce Account

```http
POST /api/accounts
```

Creates a new Account in Salesforce.

Example request:

```json
{
  "name": "ABC Company",
  "phone": "+959123456789",
  "website": "https://abc.com",
  "email": "info@abc.com"
}
```

### Record Account in Google Sheets

```http
POST /api/google-sheets
```

Adds account information to the configured Google Spreadsheet.

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone <your-github-repository-url>
cd salesforce-account-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend:

```env
PORT=3000

SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret
SALESFORCE_REDIRECT_URI=your_salesforce_redirect_uri

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri

GOOGLE_SHEET_ID=your_google_sheet_id
```

> **Important:** Never commit `.env`, OAuth credentials, client secrets, or access tokens to GitHub.

## ▶️ Running the Application

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
npm run dev
```

This project demonstrates practical experience with:

* OAuth 2.0 authentication
* Third-party API integration
* REST API development
* React frontend development
* Node.js / Express backend development
* Salesforce API integration
* Google Sheets API integration
* Data synchronization between external services
* Environment-based configuration
* Secure handling of API credentials

## 👨‍💻 Author

**Myint Than Htun**

Backend Developer | Node.js | Java | Microservices

### Technologies

```text
Node.js • Express.js • React.js • Java • MySQL
MongoDB • Redis • Docker • AWS • REST API
Salesforce API • Google Sheets API • OAuth 2.0
```
