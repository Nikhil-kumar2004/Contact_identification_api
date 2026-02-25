# Contact Identification Backend API

# Overview
This project is a backend service that identifies and links customer contacts based on their email address and phone number. The system is designed to consolidate duplicate or related contact records and return them in a structured format, with one primary contact and any related secondary contacts.

The goal of this service is to maintain clean and connected contact data even when users provide different combinations of emails or phone numbers across requests.

# Objective
The backend fulfills the following requirements:

* Design a contact database schema
* Handle primary and secondary contacts
* Implement a `POST /identify` endpoint
* Process email and phone matching logic
* Return structured consolidated contact data


# Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose


# How the System Works

When a request is sent to the `/identify` endpoint with an email and/or phone number, the system follows this logic:

1. If no existing contact matches → a new primary contact is created.
2. If a match exists → the new information is linked as a secondary contact.
3. If multiple existing contacts match → they are merged under the oldest primary contact.
4. The API always returns a consolidated response containing:
   - primary contact ID
   - all linked emails
   - all linked phone numbers
   - IDs of secondary contacts


# API Endpoint

- POST `/identify`

# Request Body

json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}

# Response Format

json
{
  "contact": {
    "primaryContatctId": "id",
    "emails": [],
    "phoneNumbers": [],
    "secondaryContactIds": []
  }
}


# Database Schema

Each contact record contains:

- `_id`
- `email`
- `phoneNumber`
- `linkPrecedence`
- `linkedId`
- `createdAt`
- `updatedAt`


# Server runs on:

http://localhost:5000

# Testing

The endpoint was tested using Postman by sending different combinations of email and phone numbers to verify:

- new contact creation
- linking existing contacts
- merging duplicate records

