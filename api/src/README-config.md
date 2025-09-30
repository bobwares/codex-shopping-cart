# Config usage

1. Read values anywhere by injecting `ConfigService`:

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExampleService {
  constructor(private readonly config: ConfigService) {}

  getDbHost(): string {
    return this.config.get<string>('db.host', '127.0.0.1');
  }
}
```

2. Add strongly-typed helpers if desired (create a `config.types.ts` and wrap lookups).
3. Validation lives in `src/config/validation.ts`; update when adding new env keys.
