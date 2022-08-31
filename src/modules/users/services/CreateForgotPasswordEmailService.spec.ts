import FakeQueueProvider from '../../../shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import CreateForgotPasswordEmailService from './CreateForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeQueueProvider: FakeQueueProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let createForgotPasswordEmail: CreateForgotPasswordEmailService;

describe('CreateForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeQueueProvider = new FakeQueueProvider();

    createForgotPasswordEmail = new CreateForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeQueueProvider,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const addJobSpy = jest.spyOn(fakeQueueProvider, 'addJob');

    await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    await createForgotPasswordEmail.execute('testmail@user.com');

    expect(addJobSpy).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      createForgotPasswordEmail.execute('testmail@user.com'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    await createForgotPasswordEmail.execute('testmail@user.com');

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
