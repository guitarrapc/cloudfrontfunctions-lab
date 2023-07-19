const originRequest = require('./index')
const sut = originRequest.__get__('handler');
test('it does rewrite url case 1', async () => {

    // given
    const event = {
        request: {
            method: 'GET',
            uri: '/?code=123'
        }
    }

    // when
    const uri = sut(event).uri

    // then
    expect(uri).toBe('/index.html?code=123');
})
