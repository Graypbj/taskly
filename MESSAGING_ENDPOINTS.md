# Messaging Endpoints

This document describes the WebSocket message formats used for communication between the client and the server.

## Client-to-Server

### Send Message

When a user sends a message, the client sends a JSON object with the following format:

```json
{
  "to": "string",
  "body": "string",
  "timestamp": "string"
}
```

- `to`: The username of the recipient.
- `body`: The content of the message.
- `timestamp`: The ISO 8601 timestamp of when the message was sent.

## Server-to-Client

### Receive Message

When a user receives a message, the server sends a JSON object with the following format:

```json
{
  "from": "string",
  "body": "string",
  "timestamp": "string"
}
```

- `from`: The username of the sender.
- `body`: The content of the message.
- `timestamp`: The ISO 8601 timestamp of when the message was received.
