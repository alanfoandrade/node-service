import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import DeleteUsersService from './DeleteUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let deleteUsers: DeleteUsersService;

describe('DeleteUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    deleteUsers = new DeleteUsersService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to delete users', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    await deleteUsers.execute(user.id);

    await expect(deleteUsers.execute(user.id)).rejects.toHaveProperty(
      'appErrorType',
      'user-not-found',
    );
  });
});
