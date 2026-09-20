const request = require('supertest');
const { expect } = require('chai');

const api = request(process.env.API_URL || 'http://localhost:3000');

describe('AGRI-NEST API integration', function() {
  this.timeout(20000);
  let userId;
  let farmId;
  let listingId;

  it('registers a user', async () => {
    const res = await api.post('/auth/register').send({ phone: '+255700000002', name: 'Test Farmer' }).expect(201);
    expect(res.body).to.have.property('user_id');
    expect(res.body).to.include({ phone: '+255700000002', name: 'Test Farmer' });
    userId = res.body.user_id;
  });

  it('creates a farm for the user', async () => {
    const res = await api.post('/farms').send({ user_id: userId, name: 'Test Farm' }).expect(201);
    expect(res.body).to.have.property('farm_id');
    expect(res.body).to.include({ user_id: userId, name: 'Test Farm' });
    farmId = res.body.farm_id;
  });

  it('retrieves the created farm', async () => {
    const res = await api.get(`/farms/${farmId}`).expect(200);
    expect(res.body).to.include({ farm_id: farmId, user_id: userId, name: 'Test Farm' });
  });

  it('creates a marketplace listing', async () => {
    const listing = { farmer_id: userId, crop_type: 'Maize', quantity: 100, price: 20000 };
    const res = await api.post('/soko/listings').send(listing).expect(201);
    expect(res.body).to.include({ farmer_id: userId, crop_type: 'Maize' });
    expect(res.body).to.have.property('listing_id');
    listingId = res.body.listing_id;
  });

  it('lists marketplace items', async () => {
    const res = await api.get('/soko/listings').expect(200);
    expect(res.body).to.have.property('items').that.is.an('array');
    expect(res.body.items.some(item => item.listing_id === listingId)).to.be.true;
  });

  it('returns Jicho scan results', async () => {
    const res = await api.post('/jicho/scan').send({ farmer_id: userId, image_base64: 'AAA' }).expect(200);
    expect(res.body).to.have.property('diagnosis');
    expect(res.body).to.have.property('confidence');
  });
});
