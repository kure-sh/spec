# kure spec

The _spec_ library package defines the [types](./mod.ts) that the
[API package generator](https://github.com/kure-sh/generator) expects to be fed.

## Example

Below is an example of a simple API with one [custom resource][crd]:
`Calculator`. Normally, this spec would be generated directly from the operator's codebase, via (e.g.) [ingest-go][].

[crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[ingest-go]: https://github.com/kure-sh/ingest-go

```ts
import type { APIGroupVersion } from "jsr:@kure/spec";

export const v1alpha1: APIGroupVersion = {
  apiVersion: "spec.kure.sh/v1alpha1",
  kind: "APIGroupVersion",

  api: "example",
  group: { name: "example.kure.sh", module: null /* root module of API */},
  version: 'v1alpha1',

  dependencies: [
    { package: "kubernetes", version: "1.30" },
  ],

  definitions: [
    {
      name: "Calculator",
      description: "Evaluate a math expression",
      value: {
        type: "resource",
        metadata: { name: "calculators", scope: "namespace", /* ... */},
        properties: [ 
          {
            name: "metadata",
            value: {
              type: "reference",
              target: {
                scope: {
                  package: "kubernetes",
                  group: { name: "meta", module: "meta" },
                  version: "v1",
                },
                name: "ObjectMeta"
              },
            }
          },
          {
            name: "spec",
            value: {
              type: "reference",
              target: { name: "CalculatorSpec" },
            }
          },
          {
            name: "status",
            value: {
              type: "reference",
              target: { name: "CalculatorStatus" },
            }
          },
        ]
      }
    },

    {
      name: "CalculatorSpec",
      description: "Defines the input to Calculator",
      value: {
        type: "object",
        properties: [
          {
            name: "expression",
            value: { type: "string" },
            required: true,
          }
        ]
      }
    },

    {
      name: "CalculatorStatus",
      description: "Provides the output from Calculator",
      value: {
        type: "object",
        properties: [
          {
            name: "result",
            value: {
              type: "optional", // may be `null`
              value: { type: "integer", size: 32 },
            },
            required: true,
          },
          {
            name: "error",
            description: "If the input expression was invalid, explains the error",
            value: { type: "string" },
          }
        ]
      }
    }
  ]
};
```
