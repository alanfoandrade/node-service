import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import AuthenticateUsersService from './AuthenticateUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let authtenticateUsers: AuthenticateUsersService;

describe('AuthtenticateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    authtenticateUsers = new AuthenticateUsersService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const response = await authtenticateUsers.execute({
      email: 'testmail@user.com',
      password: '123123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authtenticateUsers.execute({
        email: 'testmail@user.com',
        password: '123123123',
      }),
    ).rejects.toHaveProperty('appErrorType', 'invalid-credentials');
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    await expect(
      authtenticateUsers.execute({
        email: 'testmail@user.com',
        password: '123',
      }),
    ).rejects.toHaveProperty('appErrorType', 'invalid-credentials');
  });
});
