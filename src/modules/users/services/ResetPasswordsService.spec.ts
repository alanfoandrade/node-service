import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordsService from './ResetPasswordsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswords: ResetPasswordsService;

describe('ResetPasswords', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswords = new ResetPasswordsService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswords.execute({
      password: '123321',
      token,
    });

    expect(generateHash).toHaveBeenLastCalledWith('123321');
  });

  it('sould not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswords.execute({
        password: '123321',
        token: 'non-existing-token',
      }),
    ).rejects.toHaveProperty('appErrorType', 'user-token-not-found');
  });

  it('sould not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswords.execute({
        password: '123321',
        token,
      }),
    ).rejects.toHaveProperty('appErrorType', 'user-not-found');
  });

  it('sould not be able to reset the password with expired token', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswords.execute({
        password: '123321',
        token,
      }),
    ).rejects.toHaveProperty('appErrorType', 'user-token-expired');
  });
});
