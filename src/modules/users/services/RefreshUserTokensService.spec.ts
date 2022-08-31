import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import RefreshUserTokensService from './RefreshUserTokensService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let refreshUserTokens: RefreshUserTokensService;

describe('RefreshUserTokens', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    refreshUserTokens = new RefreshUserTokensService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to refresh token', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'lorem@email.com',
      name: 'Lorem Ipsum',
      password: '123123',
      phone: '55 11 91234 1234',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const response = await refreshUserTokens.execute({
      refreshToken: token,
      userId: user.id,
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to refresh token to non existing user', async () => {
    await expect(
      refreshUserTokens.execute({
        refreshToken: 'any-token',
        userId: 'lorem_id',
      }),
    ).rejects.toHaveProperty('appErrorType', 'user-not-found');
  });
});
