export default interface IListUserDTO {
  cpf?: string;
  email?: string;
  name?: string;
  order: 'ASC' | 'DESC';
  phone?: string;
  skip?: number;
  sort: string;
  take?: number;
}
