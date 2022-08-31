import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUsersService from './CreateUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsers: CreateUsersService;

describe('CreateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUsers = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await createUsers.execute({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
    });

    expect(generateHash).toHaveBeenCalled();
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUsers.execute({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
    });

    await expect(
      createUsers.execute({
        cpf: '01234567654321',
        email: 'testmail@user.com',
        name: 'Test User',
      }),
    ).rejects.toHaveProperty('appErrorType', 'email-already-in-use');
  });
});
