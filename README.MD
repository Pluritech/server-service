# @pluritech/server-service

## Installation

To install this library, run:

```bash
$ npm install @pluritech/server-service --save
```

## Consuming this library

You can import this library in any Angular application by running:

```bash
$ npm install @pluritech/server-service
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { ServerServiceModule } from '@pluritech/server-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    ServerServiceModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now, we can use ServerService to control authentication


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Luis H. Moreno](mailto:luis@pluritech.com.br)
