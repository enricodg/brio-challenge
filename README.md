# NotificationMS

Hi! This is my solution for notification microservice. Because of the time constraint of within 8 hours, therefore the solution might be far from perfect.

The project is a NestJS microservice for sending notifications via multiple channels with MongoDB persistence and BullMQ for async processing. The codebase follows a layered, modular structure (domains/infrastructure/presentation/usecases) with clear separation and future channel extensibility.

## Module Layering (per domain)

- domains/ — core entities and repository interfaces.
- infrastructure/ — adapters (Mongoose schemas/repos, channel impls).
- presentation/ — controllers/HTTP, BullMQ processors.
- usecases/ — application logic.

Domains:
- notification-types/ — stores notification types with per-channel templates.
- subscription-settings/ — user/company channel subscription flags.
- notifications/ — send/list notifications:
  - HTTP: GET /notifications/:userId , POST /notifications .
  - Use case: render templates, filter by subscriptions, enqueue job.
  - Queue processor: persist UI notifications to Mongo, log email sends.

## Installation
Please run the project running run-compose.sh (make sure to have Docker installed):
```
./run.sh up
```

and stop the project using:
```
./run.sh down
```

## Assumptions & Constraints
- Because of the technical specifications does not mention about the scheduling mentioned in the context, this part is skipped.
- Only 1 language is supported, and no i18n structure is implemented.
- Body of the replacable part in subject & content is directly replaced by user data because there's no more context or requirement about the format of the data.
- All configurations are default (e.g. database, message queue, etc.), no index is created on the database.
- No request body, user validation, only assume user & company is always exist.
- No authentication, api versioning, base response, base db model is implemented.
- User and company are not bounded to each other, and the caller is the one who's responsible for passing the correct user/company id.

## Tests
Run test by
```
pnpm run test --silent
```

Result:
```
PASS  src/modules/notifications/usecases/notification.usecase.spec.ts
PASS  src/modules/notifications/presentation/queues/notification.processor.spec.ts

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        0.61 s, estimated 1 s
```
