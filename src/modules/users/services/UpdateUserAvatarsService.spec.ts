import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarsService from './UpdateUserAvatarsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatars: UpdateUserAvatarsService;

describe('UpdateUserAvatars', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatars = new UpdateUserAvatarsService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    await updateUserAvatars.execute({
      avatarFilename: 'avatar.jpg',
      userId: user.id,
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatars.execute({
        avatarFilename: 'avatar.jpg',
        userId: 'non-existing-user',
      }),
    ).rejects.toHaveProperty('appErrorType', 'user-not-found');
  });

  it('should delete avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      cpf: '01234567654321',
      email: 'testmail@user.com',
      name: 'Test User',
      password: '123123123',
    });

    await updateUserAvatars.execute({
      avatarFilename: 'avatar.jpg',
      userId: user.id,
    });

    const updatedUser = await updateUserAvatars.execute({
      avatarFilename: 'avatar2.jpg',
      userId: user.id,
    });

    expect(deleteFile).toHaveBeenLastCalledWith('avatar.jpg');
    expect(updatedUser.avatar).toBe('avatar2.jpg');
  });
});
