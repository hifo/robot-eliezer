import { expect } from 'chai';
import {
  handleInteraction,
  registerClientHandlers,
  registerProcessHandlers,
  createBotClient,
  startBot,
} from '../src/index.js';

describe('index runtime wiring', () => {
  it('handles autocomplete and returns at most 25 location choices', async () => {
    let response = [];
    const interaction = {
      isAutocomplete: () => true,
      isChatInputCommand: () => false,
      options: {
        getFocused: () => ({ name: 'location', value: 'a' }),
      },
      respond: async (items) => {
        response = items;
      },
    };

    await handleInteraction(interaction, { commands: new Map() }, [
      'Ashdod',
      'Atlanta',
      'Austin',
      'Athens',
      'Afula',
      'Arad',
      'Akko',
      'Alon',
      'Argaman',
      'Adirim',
      'Ariel',
      'Acre',
      'Ascalon',
      'Aviv',
      'Azor',
      'Azrieli',
      'Anytown',
      'Appleton',
      'Aurora',
      'Alameda',
      'Albany',
      'Amherst',
      'Andover',
      'Acton',
      'Ames',
      'Annapolis',
      'Antioch',
      'Abilene',
    ]);

    expect(response).to.have.lengthOf(25);
    expect(response[0]).to.have.keys(['name', 'value']);
  });

  it('executes chat command when command exists', async () => {
    let executed = false;
    const interaction = {
      isAutocomplete: () => false,
      isChatInputCommand: () => true,
      commandName: 'demo',
      replied: false,
      deferred: false,
      reply: async () => {},
      followUp: async () => {},
    };

    const client = {
      commands: new Map([
        ['demo', { execute: async () => { executed = true; } }],
      ]),
    };

    await handleInteraction(interaction, client, []);
    expect(executed).to.equal(true);
  });

  it('replies with error via followUp when already replied', async () => {
    let followedUp = false;
    const interaction = {
      isAutocomplete: () => false,
      isChatInputCommand: () => true,
      commandName: 'demo',
      replied: true,
      deferred: false,
      reply: async () => {},
      followUp: async () => { followedUp = true; },
    };

    const client = {
      commands: new Map([
        ['demo', { execute: async () => { throw new Error('boom'); } }],
      ]),
    };

    await handleInteraction(interaction, client, []);
    expect(followedUp).to.equal(true);
  });

  it('registers client and process handlers', async () => {
    const onceHandlers = new Map();
    const onHandlers = new Map();
    let deployed = false;

    const client = {
      user: { tag: 'Test#0001' },
      commands: new Map(),
      once: (event, handler) => onceHandlers.set(event, handler),
      on: (event, handler) => onHandlers.set(event, handler),
    };

    registerClientHandlers(client, async () => { deployed = true; }, ['Jerusalem']);

    expect(onceHandlers.has('clientReady')).to.equal(true);
    expect(onHandlers.has('interactionCreate')).to.equal(true);
    expect(onHandlers.has('error')).to.equal(true);
    expect(onHandlers.has('warn')).to.equal(true);

    await onceHandlers.get('clientReady')();
    expect(deployed).to.equal(true);

    const processHandlers = new Map();
    registerProcessHandlers({ on: (event, handler) => processHandlers.set(event, handler) });
    expect(processHandlers.has('unhandledRejection')).to.equal(true);
    expect(processHandlers.has('uncaughtException')).to.equal(true);
  });

  it('creates client with provided instance and starts bot with explicit token', async () => {
    const onHandlers = new Map();
    const onceHandlers = new Map();
    let loginToken = '';
    const processHandlers = new Map();

    const fakeClient = {
      user: { tag: 'Starter#0001' },
      commands: undefined,
      once: (event, handler) => onceHandlers.set(event, handler),
      on: (event, handler) => onHandlers.set(event, handler),
      login: async (token) => {
        loginToken = token;
      },
    };

    const created = createBotClient({
      clientInstance: fakeClient,
      deployCommandsFn: async () => {},
      locations: ['Jerusalem'],
    });

    expect(created).to.equal(fakeClient);
    expect(created.commands).to.not.equal(undefined);

    await startBot({
      clientInstance: fakeClient,
      deployCommandsFn: async () => {},
      locations: ['Jerusalem'],
      processObj: { on: (event, handler) => processHandlers.set(event, handler) },
      token: 'token-123',
    });

    expect(loginToken).to.equal('token-123');
    expect(processHandlers.has('unhandledRejection')).to.equal(true);
    expect(processHandlers.has('uncaughtException')).to.equal(true);
  });
});
