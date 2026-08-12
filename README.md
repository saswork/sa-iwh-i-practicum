# Sayeed Ahmed - Integrating With HubSpot I: Foundations Practicum

A Node.js, Express, Axios, and Pug application that reads and creates HubSpot CRM custom-object records.

## Practicum custom object

This project uses a **Books** custom object with these properties:

- `name` — string
- `author` — string
- `genre` — string

The custom object should be associated with the HubSpot Contacts object.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```text
HUBSPOT_ACCESS_TOKEN=your_private_app_access_token
HUBSPOT_CUSTOM_OBJECT_TYPE=your_custom_object_type_id
HUBSPOT_CUSTOM_OBJECT_LABEL=Books
PORT=3000
```

Do not commit `.env`. The `.gitignore` file already excludes it.

### 3. Start the application

```bash
node index.js
```

Open:

```text
http://localhost:3000
```

## HubSpot custom object list view

Replace the placeholders below with the values from your developer test account:

https://app.hubspot.com/contacts/YOUR_TEST_ACCOUNT_ID/objects/YOUR_CUSTOM_OBJECT_ID/views/all/list

## Routes

- `GET /` — retrieves up to 100 Books records from HubSpot and displays them in a table.
- `GET /update-cobj` — renders the form used to create a new Book.
- `POST /update-cobj` — sends the form data to HubSpot and redirects to the homepage after a successful creation.

## API implementation

The application uses Axios with a private-app bearer token. The custom-object records are retrieved from HubSpot's CRM object API with the requested properties, and new records are created with a POST request.

## Git history

The practicum requires meaningful commit history. Build the project on a working branch, make multiple commits as features are completed, merge the working branch into `main`, and push the final `main` branch to the public GitHub fork.

## Security

Never commit a HubSpot private app access token. Keep it in `.env`, which is excluded by `.gitignore`.
