import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUsersService from './ShowUsersService';

let fakeUsersRepository: FakeUsersRepository;
let showUsers: ShowUsersService;

describe('ShowUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUsers = new ShowUsersService(fakeUsersRepository);
  });

  it('should be able to show the user', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const findUser = await showUsers.execute(user.id);

    expect(findUser.email).toBe(user.email);
  });

  it('should not be able to show the non-existing user', async () => {
    await expect(showUsers.execute('non_existing_id')).rejects.toHaveProperty(
      'appErrorType',
      'user-not-found',
    );
  });
});
