import { Elysia } from 'elysia'
import { resolveDID } from '@hiero-did-sdk/resolver';

const app = new Elysia()
  .get('/', () => {
    return new Response('Hello World', {status: 200});
  })
  .get('/1.0/identifiers/:identifier', async ({ params: { identifier } }: { params: { identifier: string } }) => {
    console.log(`Resolving ${identifier}`)
    try {
      const { didDocument, didResolutionMetadata, didDocumentMetadata } = await resolveDID(identifier, 'application/ld+json;profile="https://w3id.org/did-resolution"');
      if (didDocument) {
        console.log(`Resolved ${didDocument.id}`);
        return Response.json({
          didDocument,
          didResolutionMetadata: {
              ...didResolutionMetadata,
              contentType: 'application/ld+json'
          },
          didDocumentMetadata
        }, {
          headers: {
              'Content-Type': 'application/json'
          }
        });
      }
      return new Response('Not Found', {status: 404});
    } catch (e: any) {
      console.log(`Failed to resolve ${identifier}: ${e.message}`)
      return new Response(e.message, {status: 400});
    }
  })
  .listen(Bun.env.PORT || 8080)

console.log(`did:hedera resolver is running on port ${app.server?.port}`)