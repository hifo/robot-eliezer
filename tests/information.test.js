import { expect } from 'chai';
import informationCommand from '../commands/information.js';

describe('information command', () => {
  it('builds slash command metadata with location autocomplete option', () => {
    const json = informationCommand.data.toJSON();

    expect(json.name).to.equal('information');
    expect(json.description).to.be.a('string').and.not.empty;
    expect(json.options).to.be.an('array').with.lengthOf(1);
    expect(json.options[0].name).to.equal('location');
    expect(json.options[0].autocomplete).to.equal(true);
  });

  it('executes with default location and sends reply + followUp', async () => {
    const replies = [];
    const followUps = [];

    const interaction = {
      options: {
        getString: () => null,
      },
      reply: async (message) => {
        replies.push(message);
      },
      followUp: async (message) => {
        followUps.push(message);
      },
    };

    await informationCommand.execute(interaction);

    expect(replies).to.have.lengthOf(1);
    expect(replies[0]).to.include('Today is');
    expect(replies[0]).to.include('(Jerusalem)');
    expect(followUps).to.have.lengthOf(1);
    expect(
      followUps[0].startsWith('For today:') || followUps[0] === 'No holidays today.'
    ).to.equal(true);
  });

  it('uses provided location option when supplied', async () => {
    const replies = [];

    const interaction = {
      options: {
        getString: () => 'New York',
      },
      reply: async (message) => {
        replies.push(message);
      },
      followUp: async () => {},
    };

    await informationCommand.execute(interaction);

    expect(replies).to.have.lengthOf(1);
    expect(replies[0]).to.include('(New York)');
  });
});
