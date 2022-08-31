import User from '../infra/typeorm/entities/User';

export default interface IListUserResponseDTO {
  items: User[];
  pages: number;
  total: number;
}
