import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUsersProfileService from './UpdateUsersProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUsers: UpdateUsersProfileService;

describe('UpdateUsersProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUsers = new UpdateUsersProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const updatedUser = await updateUsers.execute({
      authenticatedUser: {
        id: user.id,
      },
      cpf: '01234567654321',
      email: 'testmailedited2@user.com',
      name: 'Test User Edited2',
    });

    expect(updatedUser.name).toBe('Test User Edited2');
    expect(updatedUser.email).toBe('testmailedited2@user.com');
  });

  it('should not be able to update non-existing user', async () => {
    await expect(
      updateUsers.execute({
        authenticatedUser: {
          id: 'lorem_id',
        },
        cpf: '01234567654321',
        email: 'testmailedited@user.com',
        name: 'Test User Edited',
        password: '123321',
      }),
    ).rejects.toHaveProperty('appErrorType', 'user-not-found');
  });

  it('should not be able to change the email with an already registered e-mail', async () => {
    await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmailtobeupdated@user.com',
      name: 'Test User to be Updated',
      password: '123123123',
    });

    await expect(
      updateUsers.execute({
        authenticatedUser: {
          id: user.id,
        },
        cpf: '01234567654321',
        email: 'testmail@user.com',
        name: 'Test User Edited',
      }),
    ).rejects.toHaveProperty('appErrorType', 'email-already-in-use');
  });

  it('should be able to update the password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    const updatedUser = await updateUsers.execute({
      authenticatedUser: {
        id: user.id,
      },
      cpf: '01234567654321',
      email: 'testmailedited@user.com',
      name: 'Test User Edited',
      password: '123321',
    });

    expect(generateHash).toHaveBeenLastCalledWith('123321');
    expect(updatedUser.password).toBe('123321');
  });
});
