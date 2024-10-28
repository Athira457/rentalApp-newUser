import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: '059sa1ztl6hjdouwp-1.a1.typesense.net',
      port:  443,
      protocol: 'https',
    },
  ],
  apiKey: 'EouhKr3qhXg9r9NP26sO87oHGwDqCv2X',
  connectionTimeoutSeconds: 20,
});

export default typesenseClient;